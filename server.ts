import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { analyzeDamagePhotoWithAi, analyzeDocumentWithAi, askAiAboutDocument } from "./lib/ai-analysis";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

type AddressSuggestion = {
  label: string;
  city?: string;
  county?: string;
  state?: string;
  postcode?: string;
};

function getEnvValue(env: unknown, key: string): string {
  if (env && typeof env === "object" && key in env) {
    const value = (env as Record<string, unknown>)[key];
    if (typeof value === "string") return value;
  }

  if (typeof process !== "undefined" && process.env[key]) {
    return String(process.env[key]);
  }

  return "";
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hasUsablePhone(value: string): boolean {
  return value.replace(/\D/g, "").length >= 10;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char] ?? char);
}

async function sendReportEmail(body: unknown, env: unknown): Promise<{ id?: string }> {
  const fields = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const to = typeof fields.to === "string" ? fields.to.trim() : "";
  const phone = typeof fields.phone === "string" ? fields.phone.trim() : "";
  const subject = typeof fields.subject === "string" ? fields.subject.trim() : "";
  const reportText = typeof fields.reportText === "string" ? fields.reportText.trim() : "";

  if (!isValidEmail(to)) {
    throw new Error("Enter a valid email address.");
  }

  if (!hasUsablePhone(phone)) {
    throw new Error("Enter a valid phone number before sending the report.");
  }

  if (!reportText) {
    throw new Error("Create an analysis report before sending email.");
  }

  const apiKey = getEnvValue(env, "RESEND_API_KEY");
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing. Add your Resend API key to .env.local and Vercel environment variables.");
  }

  const from = getEnvValue(env, "RESEND_FROM_EMAIL") || "Florida HomeShield <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: subject || "Florida HomeShield analysis report",
      text: reportText,
      html: `
        <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5">
          <h1 style="color:#0b2545;margin-bottom:8px">Florida HomeShield Analysis Report</h1>
          <pre style="white-space:pre-wrap;font-family:Arial,sans-serif;font-size:14px">${escapeHtml(reportText)}</pre>
        </div>
      `,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Resend could not send this email.";
    throw new Error(message);
  }

  return payload && typeof payload === "object" ? (payload as { id?: string }) : {};
}

async function getAddressSuggestions(query: string): Promise<AddressSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  const searchUrl = new URL("https://nominatim.openstreetmap.org/search");
  searchUrl.searchParams.set("format", "jsonv2");
  searchUrl.searchParams.set("addressdetails", "1");
  searchUrl.searchParams.set("limit", "6");
  searchUrl.searchParams.set("countrycodes", "us");
  searchUrl.searchParams.set("viewbox", "-87.8,31.2,-79.8,24.3");
  searchUrl.searchParams.set("bounded", "1");
  searchUrl.searchParams.set("q", trimmed);

  const response = await fetch(searchUrl, {
    headers: {
      accept: "application/json",
      "user-agent": "FloridaHomeShield/1.0 local preview address autocomplete",
    },
  });

  if (!response.ok) {
    throw new Error("Address lookup failed.");
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) return [];

  return payload.slice(0, 6).map((item) => {
    const fields = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const address = fields.address && typeof fields.address === "object"
      ? (fields.address as Record<string, unknown>)
      : {};

    const city =
      typeof address.city === "string"
        ? address.city
        : typeof address.town === "string"
          ? address.town
          : typeof address.village === "string"
            ? address.village
            : undefined;

    return {
      label: String(fields.display_name || trimmed),
      city,
      county: typeof address.county === "string" ? address.county : undefined,
      state: typeof address.state === "string" ? address.state : undefined,
      postcode: typeof address.postcode === "string" ? address.postcode : undefined,
    };
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/analyze") {
        if (request.method !== "POST") {
          return Response.json({ error: "Method not allowed" }, { status: 405 });
        }

        try {
          const body = await request.json();
          const report = await analyzeDocumentWithAi(body, env);
          return Response.json({ report });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to analyze this document.";
          return Response.json({ error: message }, { status: 400 });
        }
      }

      if (url.pathname === "/api/ask-ai") {
        if (request.method !== "POST") {
          return Response.json({ error: "Method not allowed" }, { status: 405 });
        }

        try {
          const body = await request.json();
          const answer = await askAiAboutDocument(body, env);
          return Response.json({ answer });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to answer that question.";
          return Response.json({ error: message }, { status: 400 });
        }
      }

      if (url.pathname === "/api/analyze-damage-photo") {
        if (request.method !== "POST") {
          return Response.json({ error: "Method not allowed" }, { status: 405 });
        }

        try {
          const body = await request.json();
          const analysis = await analyzeDamagePhotoWithAi(body, env);
          return Response.json({ analysis });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to analyze this photo.";
          return Response.json({ error: message }, { status: 400 });
        }
      }

      if (url.pathname === "/api/address-suggest") {
        if (request.method !== "GET") {
          return Response.json({ error: "Method not allowed" }, { status: 405 });
        }

        try {
          const suggestions = await getAddressSuggestions(url.searchParams.get("q") ?? "");
          return Response.json({ suggestions });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to look up addresses.";
          return Response.json({ error: message, suggestions: [] }, { status: 400 });
        }
      }

      if (url.pathname === "/api/send-report-email") {
        if (request.method !== "POST") {
          return Response.json({ error: "Method not allowed" }, { status: 405 });
        }

        try {
          const body = await request.json();
          const result = await sendReportEmail(body, env);
          return Response.json({ ok: true, id: result.id });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to send this email.";
          return Response.json({ error: message }, { status: 400 });
        }
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
