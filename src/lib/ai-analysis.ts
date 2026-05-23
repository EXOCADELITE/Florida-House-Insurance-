export type AiAnalysisSection = {
  title: string;
  value: string;
  tone: "default" | "warning" | "success";
  note: string;
  explanation: string;
  nextSteps: string[];
};

export type AiAnalysisReport = {
  title: string;
  subtitle: string;
  summary: string;
  sections: AiAnalysisSection[];
  insights: string[];
};

export type AnalyzeRequest = {
  documentType: string;
  documentLabel: string;
  documentText: string;
  imageDataUrl?: string;
  fileNames?: string[];
};

export type AskAiRequest = {
  question: string;
  documentType: string;
  documentLabel: string;
  documentText: string;
  report?: AiAnalysisReport | null;
};

export type DamagePhotoRequest = {
  imageDataUrl: string;
  fileName?: string;
  notes?: string;
};

const reportSchemaExample: AiAnalysisReport = {
  title: "Document summary",
  subtitle: "Uploaded Florida housing document",
  summary: "Plain-English summary of the biggest financial, insurance, maintenance, renewal, and risk items.",
  sections: [
    {
      title: "Key term",
      value: "Review needed",
      tone: "default",
      note: "Important term found in the document.",
      explanation: "Explain what this item means for a Florida homeowner, renter, or tenant.",
      nextSteps: ["Confirm this term before signing or renewing."],
    },
  ],
  insights: ["One important Florida-specific note from the document."],
};

const fallbackReport: AiAnalysisReport = {
  title: "Document analysis needs more text",
  subtitle: "Florida HomeShield AI review",
  summary:
    "I could not find enough document text or a readable policy image to produce a reliable analysis. Upload a JPG, PNG, or WebP document image, or paste policy, inspection, rental agreement, estimate, or declaration text and run analysis again.",
  sections: [
    {
      title: "Document text",
      value: "Missing",
      tone: "warning",
      note: "The AI needs readable text from the document.",
      explanation:
        "PDFs still need pasted text in this version. JPG, PNG, and WebP policy images can be read directly by the AI when uploaded.",
      nextSteps: [
        "Upload a clear JPG, PNG, or WebP image of the document, or paste the key pages or copied PDF text into the analyzer.",
        "Include declaration pages, deductibles, endorsements, lease terms, deposit rules, inspection findings, and mitigation notes.",
      ],
    },
  ],
  insights: [
    "For the next version, add OCR/PDF parsing so scanned files can be read automatically.",
  ],
};

const insuranceSignals = [
  "policy",
  "declarations",
  "declaration page",
  "premium",
  "deductible",
  "coverage",
  "dwelling",
  "personal property",
  "loss of use",
  "liability",
  "endorsement",
  "exclusion",
  "wind",
  "hurricane",
  "flood",
  "mitigation",
  "inspection",
  "roof",
  "plumbing",
  "electrical",
  "hvac",
  "claim",
  "insurer",
  "carrier",
  "homeowners",
  "renters",
  "renter",
  "rental agreement",
  "lease agreement",
  "residential lease",
  "security deposit",
  "monthly rent",
  "late fee",
  "move-out",
  "move in",
  "move-in",
  "renewal term",
  "termination",
  "notice to vacate",
  "property manager",
  "premises",
  "tenant",
  "landlord",
  "lease",
  "contents coverage",
  "additional living expense",
  "ale",
  "medical payments",
  "scheduled property",
  "renters insurance",
  "ho-4",
  "contractor estimate",
  "scope of work",
  "replacement cost",
  "estimate",
  "invoice",
  "receipt",
  "proposal",
  "quote",
  "permit",
  "appraisal",
  "home inspection",
  "property inspection",
  "mold",
  "water damage",
  "leak",
  "moisture",
  "remediation",
  "restoration",
  "repair",
  "damage",
  "photos",
  "property address",
  "hoa",
  "homeowners association",
  "association agreement",
  "declaration of covenants",
  "covenants conditions restrictions",
  "cc&r",
  "ccrs",
  "bylaws",
  "architectural review",
  "architectural control",
  "association dues",
  "special assessment",
  "violation notice",
  "fine committee",
  "rental restrictions",
  "common areas",
  "condo",
  "townhome",
  "apartment",
  "unit",
  "claim number",
  "adjuster",
  "public adjuster",
  "engineer report",
  "roofing",
  "drywall",
  "flooring",
  "windows",
  "doors",
  "shutters",
  "auto insurance",
  "personal auto",
  "vehicle",
  "vin",
  "collision",
  "comprehensive",
  "uninsured motorist",
  "bodily injury",
  "property damage liability",
  "medpay",
  "roadside assistance",
  "mailing address",
  "policyholder",
  "policy number",
  "effective date",
  "expiration date",
];

const unrelatedSignals = [
  "resume",
  "invoice for dinner",
  "restaurant menu",
  "school transcript",
  "bank statement",
  "medical record",
  "recipe",
  "airline ticket",
  "movie script",
];

function looksLikeHomeInsuranceDocument(input: AnalyzeRequest): boolean {
  const text = `${input.documentLabel} ${input.fileNames?.join(" ") ?? ""} ${input.documentText}`
    .toLowerCase()
    .replace(/\s+/g, " ");

  const insuranceSignalCount = insuranceSignals.filter((signal) => text.includes(signal)).length;
  const unrelatedSignalCount = unrelatedSignals.filter((signal) => text.includes(signal)).length;
  const selectedKnownType = input.documentType !== "damage-photo" && input.documentType.trim().length > 0;

  return unrelatedSignalCount === 0 && (insuranceSignalCount >= 1 || selectedKnownType);
}

function getEnvValue(env: unknown, key: string): string | undefined {
  if (env && typeof env === "object" && key in env) {
    const value = (env as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) return value;
  }

  const maybeProcess = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process;
  const value = maybeProcess?.env?.[key];
  return value?.trim() || undefined;
}

function extractResponseText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const fields = payload as Record<string, unknown>;
  if (typeof fields.output_text === "string") return fields.output_text;

  const output = Array.isArray(fields.output) ? fields.output : [];
  return output
    .flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const content = (item as Record<string, unknown>).content;
      return Array.isArray(content) ? content : [];
    })
    .map((content) => {
      if (!content || typeof content !== "object") return "";
      const text = (content as Record<string, unknown>).text;
      return typeof text === "string" ? text : "";
    })
    .join("\n")
    .trim();
}

function normalizeReport(value: unknown): AiAnalysisReport {
  if (!value || typeof value !== "object") return fallbackReport;
  const report = value as Partial<AiAnalysisReport>;
  return {
    title: String(report.title || "AI document analysis"),
    subtitle: String(report.subtitle || "Uploaded Florida homeowner document"),
    summary: String(report.summary || fallbackReport.summary),
    sections: Array.isArray(report.sections) && report.sections.length > 0
      ? report.sections.slice(0, 6).map((section) => ({
          title: String(section.title || "Finding"),
          value: String(section.value || "Review needed"),
          tone: section.tone === "success" || section.tone === "warning" ? section.tone : "default",
          note: String(section.note || ""),
          explanation: String(section.explanation || ""),
          nextSteps: Array.isArray(section.nextSteps)
            ? section.nextSteps.slice(0, 4).map((step) => String(step))
            : [],
        }))
      : fallbackReport.sections,
    insights: Array.isArray(report.insights)
      ? report.insights.slice(0, 6).map((insight) => String(insight))
      : fallbackReport.insights,
  };
}

export async function analyzeDocumentWithAi(input: AnalyzeRequest, env: unknown): Promise<AiAnalysisReport> {
  const documentText = input.documentText.trim();
  const hasImage = input.imageDataUrl?.startsWith("data:image/") ?? false;
  if (!hasImage && documentText.length < 80) return fallbackReport;
  if (!hasImage && !looksLikeHomeInsuranceDocument(input)) {
    throw new Error(
      "This does not look like an insurance, housing, property, rental, repair, inspection, claim, or damage document. Please upload a related document image or paste readable text from it.",
    );
  }

  const apiKey = getEnvValue(env, "OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing. Add it to your local environment or deployment secrets.");
  }

  const model = getEnvValue(env, "OPENAI_MODEL") || "gpt-5.4-mini";
  const prompt = [
    "You are Florida HomeShield, an assistant that reviews insurance, property, housing, and rental agreement documents.",
    "Analyze the provided document text or image for a homeowner, renter, tenant, or policyholder. Be practical, cautious, and plain-English.",
    "Do not invent facts. If a value is missing, say it is missing and recommend what to confirm.",
    "Do not give legal advice. Explain practical risks and recommend confirming legal questions with a qualified professional.",
    "For homeowner documents, focus on coverage, deductibles, exclusions, roof/renewal risk, wind mitigation credits, flood gaps, contractor/AOB risk, and next steps.",
    "For auto policy documents, focus on policyholder, vehicle, VIN, effective dates, liability limits, collision and comprehensive deductibles, uninsured motorist, medical payments, roadside assistance, premium, discounts, and unusual terms.",
    "For rental agreements or leases, focus on rent, deposits, fees, renewal and termination terms, maintenance duties, repair response, insurance requirements, utilities, access/inspection rights, hurricane/storm responsibilities, flood or mold language, move-out charges, and unusual tenant-risk clauses.",
    "For HOA agreements, declarations, covenants, bylaws, or community rules, focus on dues, special assessments, owner maintenance duties, association maintenance duties, architectural approval requirements, exterior restrictions, rental limits, pet/parking rules, fine and violation process, insurance obligations, common-area responsibilities, storm preparation, roof/window/door repair duties, and resale or disclosure risks.",
    "For repair invoices, estimates, permits, HOA letters, photos reports, appraisals, or claim paperwork, identify what the document is, summarize the key facts, flag practical risks, and list next steps.",
    "Return only valid JSON matching this TypeScript shape:",
    JSON.stringify(reportSchemaExample, null, 2),
    "",
    `Selected document type: ${input.documentLabel} (${input.documentType})`,
    input.fileNames?.length ? `Uploaded file names: ${input.fileNames.join(", ")}` : "",
    "",
    hasImage ? "Document image is attached. Also use any optional pasted text below." : "Document text:",
    documentText.slice(0, 28000) || "No pasted text provided.",
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: hasImage
        ? [
            {
              role: "user",
              content: [
                { type: "input_text", text: prompt },
                { type: "input_image", image_url: input.imageDataUrl },
              ],
            },
          ]
        : prompt,
    }),
  });

  const payload = await response.json().catch(() => undefined);
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? JSON.stringify((payload as Record<string, unknown>).error)
        : response.statusText;
    throw new Error(`OpenAI analysis failed: ${message}`);
  }

  const text = extractResponseText(payload);
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) return fallbackReport;

  try {
    return normalizeReport(JSON.parse(text.slice(jsonStart, jsonEnd + 1)));
  } catch {
    return fallbackReport;
  }
}

export async function askAiAboutDocument(input: AskAiRequest, env: unknown): Promise<string> {
  const question = input.question.trim();
  if (question.length < 4) {
    throw new Error("Ask a short question about the document first.");
  }

  const apiKey = getEnvValue(env, "OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing. Add it to your local environment or deployment secrets.");
  }

  const model = getEnvValue(env, "OPENAI_MODEL") || "gpt-5.4-mini";
  const prompt = [
    "You are Florida HomeShield. Answer the user's question using only the provided document text and AI report context.",
    "Be concise, practical, and plain-English. If the document does not say, say what to confirm.",
    "Do not give legal, financial, or claims-adjusting advice. Recommend a licensed professional when appropriate.",
    "",
    `Document type: ${input.documentLabel} (${input.documentType})`,
    input.report ? `Current report: ${JSON.stringify(input.report)}` : "",
    "",
    "Document text:",
    input.documentText.trim().slice(0, 22000) || "No document text pasted.",
    "",
    `Question: ${question}`,
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, input: prompt }),
  });

  const payload = await response.json().catch(() => undefined);
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? JSON.stringify((payload as Record<string, unknown>).error)
        : response.statusText;
    throw new Error(`OpenAI question failed: ${message}`);
  }

  return extractResponseText(payload) || "I could not answer that from the provided document text.";
}

export async function analyzeDamagePhotoWithAi(input: DamagePhotoRequest, env: unknown): Promise<string> {
  if (!input.imageDataUrl.startsWith("data:image/")) {
    throw new Error("Please choose a JPG, PNG, or WebP damage photo.");
  }

  const apiKey = getEnvValue(env, "OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing. Add it to your local environment or deployment secrets.");
  }

  const model = getEnvValue(env, "OPENAI_MODEL") || "gpt-5.4-mini";
  const prompt = [
    "You are Florida HomeShield. Review this property damage photo cautiously for documentation help.",
    "Describe only visible conditions. Do not identify a definitive cause, repair price, coverage decision, or claim outcome.",
    "Return a concise homeowner-friendly review with these headings: Visible damage, Severity to document, Photos to take next, What to tell the insurer or landlord, What not to assume.",
    "Recommend a licensed contractor, inspector, or adjuster when damage may be structural, electrical, mold-related, or unsafe.",
    input.fileName ? `File name: ${input.fileName}` : "",
    input.notes ? `User notes: ${input.notes}` : "",
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            { type: "input_image", image_url: input.imageDataUrl },
          ],
        },
      ],
    }),
  });

  const payload = await response.json().catch(() => undefined);
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? JSON.stringify((payload as Record<string, unknown>).error)
        : response.statusText;
    throw new Error(`OpenAI photo analysis failed: ${message}`);
  }

  return extractResponseText(payload) || "I could not analyze this photo. Try a clearer image with good lighting.";
}
