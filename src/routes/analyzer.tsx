import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Section } from "@/components/shared/Section";
import { DropZone } from "@/components/upload/DropZone";
import { Callout } from "@/components/shared/Callout";
import type { UploadFile } from "@/components/upload/DropZone";
import type { AiAnalysisReport } from "@/lib/ai-analysis";
import { FileText, ShieldCheck, FileSearch, Wind, Home, Waves, FileSignature, AlertCircle, Sparkles, KeyRound, MapPin, Loader2, Landmark, Mail, Printer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyzer")({
  component: AnalyzerPage,
  head: () => ({ meta: [{ title: "Document Analyzer — Florida HomeShield" }] }),
});

const docTypes = [
  { key: "damage-photo", label: "Damage photo analyzer", icon: FileSearch, description: "Review visible property damage from a JPG, PNG, or WebP photo. Photos are analyzed only and not saved to cloud storage by this app." },
  { key: "declaration", label: "Insurance declaration page", icon: ShieldCheck, description: "Coverage limits, deductibles, exclusions and endorsements — translated to plain English." },
  { key: "rental-agreement", label: "Rental agreement", icon: KeyRound, description: "Lease terms, rent, deposits, fees, maintenance duties, insurance requirements, move-out rules, and tenant-risk clauses." },
  { key: "hoa-agreement", label: "HOA agreement", icon: Landmark, description: "Review dues, restrictions, maintenance duties, fine rules, rental limits, insurance requirements, and storm or repair obligations." },
  { key: "wind", label: "Wind mitigation inspection", icon: Wind, description: "Uniform Mitigation Verification (OIR-B1-1802) credits, with missing-credit estimates." },
  { key: "four", label: "4-point inspection", icon: FileSearch, description: "Roof, electrical, HVAC and plumbing. Flag failures that could prevent renewal." },
  { key: "roof", label: "Roof inspection report", icon: Home, description: "Remaining useful life estimate, material flags, and renewal-risk indicators." },
  { key: "flood", label: "Flood insurance documents", icon: Waves, description: "NFIP policy review, FEMA zone confirmation, elevation certificate review." },
  { key: "estimate", label: "Contractor estimate", icon: FileSignature, description: "Line-item review, AOB language scan, scope vs. damage check." },
];

type AddressSuggestion = {
  label: string;
  city?: string;
  county?: string;
  state?: string;
  postcode?: string;
};

function withPropertyContext(text: string, address: string) {
  const trimmedAddress = address.trim();
  if (!trimmedAddress) return text;
  return `Property address/context: ${trimmedAddress}\n\n${text}`;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read this file."));
    reader.readAsDataURL(file);
  });
}

function buildPrintableReport({
  documentLabel,
  address,
  report,
  damageAnalysis,
}: {
  documentLabel: string;
  address: string;
  report?: AiAnalysisReport | null;
  damageAnalysis?: string;
}) {
  const lines = [
    "Florida HomeShield Analysis Report",
    `Document type: ${documentLabel}`,
    address.trim() ? `Property/address context: ${address.trim()}` : "",
    `Created: ${new Date().toLocaleString()}`,
    "",
  ];

  if (report) {
    lines.push(report.title, report.subtitle, "", "Summary:", report.summary, "");
    report.sections.forEach((section, index) => {
      lines.push(
        `${index + 1}. ${section.title}: ${section.value}`,
        section.note,
        section.explanation,
        section.nextSteps.length ? `Next steps: ${section.nextSteps.join(" | ")}` : "",
        "",
      );
    });
    if (report.insights.length) {
      lines.push("Why this matters:", ...report.insights.map((insight) => `- ${insight}`), "");
    }
  }

  if (damageAnalysis) {
    lines.push("Damage photo analysis:", damageAnalysis, "");
  }

  lines.push(
    "Note: This report is educational and practical guidance only. It is not legal, insurance, claims-adjusting, or contractor advice.",
  );

  return lines.filter(Boolean).join("\n");
}

function AnalyzerPage() {
  return (
    <Shell>
      <AnalyzerContent />
    </Shell>
  );
}

export function AnalyzerContent() {
  const [active, setActive] = useState(docTypes[0].key);
  const [propertyAddress, setPropertyAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [documentText, setDocumentText] = useState("");
  const [aiReport, setAiReport] = useState<AiAnalysisReport | null>(null);
  const [aiError, setAiError] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [asking, setAsking] = useState(false);
  const [damagePhoto, setDamagePhoto] = useState<File | null>(null);
  const [damageNotes, setDamageNotes] = useState("");
  const [damageAnalysis, setDamageAnalysis] = useState("");
  const [damageError, setDamageError] = useState("");
  const [analyzingDamage, setAnalyzingDamage] = useState(false);
  const current = docTypes.find((d) => d.key === active)!;
  const isDamageMode = active === "damage-photo";

  async function runAiAnalysis(files: UploadFile[]) {
    setAiError("");
    setAiReport(null);

    const imageFile = files.find((upload) => upload.file && upload.file.type.startsWith("image/"))?.file;
    const imageDataUrl = imageFile ? await readFileAsDataUrl(imageFile) : undefined;

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        documentType: active,
        documentLabel: current.label,
        documentText: withPropertyContext(documentText, propertyAddress),
        imageDataUrl,
        fileNames: files.map((file) => file.name),
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setAiError(payload.error || "The AI analysis could not run yet.");
      return;
    }

    setAiReport(payload.report);
  }

  async function askAiQuestion() {
    setQuestionError("");
    setAnswer("");
    setAsking(true);

    const response = await fetch("/api/ask-ai", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        question,
        documentType: active,
        documentLabel: current.label,
        documentText: withPropertyContext(documentText, propertyAddress),
        report: aiReport,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    setAsking(false);
    if (!response.ok) {
      setQuestionError(payload.error || "The AI could not answer that question.");
      return;
    }
    setAnswer(payload.answer);
  }

  async function analyzeDamagePhoto() {
    if (!damagePhoto) {
      setDamageError("Choose a damage photo first.");
      return;
    }

    setDamageError("");
    setDamageAnalysis("");
    setAnalyzingDamage(true);

    const imageDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read this photo."));
      reader.readAsDataURL(damagePhoto);
    });

    const response = await fetch("/api/analyze-damage-photo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        imageDataUrl,
        fileName: damagePhoto.name,
        notes: withPropertyContext(damageNotes, propertyAddress),
      }),
    });

    const payload = await response.json().catch(() => ({}));
    setAnalyzingDamage(false);
    if (!response.ok) {
      setDamageError(payload.error || "The AI could not analyze this photo.");
      return;
    }
    setDamageAnalysis(payload.analysis);
  }

  return (
    <Section
      eyebrow="Document analyzer"
      title="Upload it once. Understand it forever."
      description="Drop in any Florida home document below. We translate it into plain English and flag what matters."
    >
      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <nav className="space-y-1.5">
          {docTypes.map((d) => (
            <button
              key={d.key}
              onClick={() => setActive(d.key)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                active === d.key
                  ? "border-orange/40 bg-orange/5 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-orange/30",
              )}
            >
              <d.icon className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium">{d.label}</span>
            </button>
          ))}
        </nav>
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 text-primary">
                <current.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{current.label}</h2>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{current.description}</p>
              </div>
            </div>
          </div>
          <PropertyContextPanel address={propertyAddress} setAddress={setPropertyAddress} />
          {isDamageMode ? (
            <DamagePhotoPanel
              damagePhoto={damagePhoto}
              setDamagePhoto={setDamagePhoto}
              damageNotes={damageNotes}
              setDamageNotes={setDamageNotes}
              damageAnalysis={damageAnalysis}
              damageError={damageError}
              analyzingDamage={analyzingDamage}
              onAnalyze={analyzeDamagePhoto}
            />
          ) : (
            <>
              <DropZone
                label={`Upload your ${current.label.toLowerCase()}`}
                description="Upload a JPG, PNG, or WebP policy image for direct AI review. For PDFs, paste readable text below for now."
                onAnalyze={runAiAnalysis}
              />
              <div className="rounded-2xl border border-border bg-card p-5">
                <label htmlFor="document-text" className="text-sm font-semibold text-foreground">
                  Paste document text or extra context
                </label>
                <p className="mt-1 text-sm text-muted-foreground">
                  For PDFs, copy text from the document into this box. For JPG, PNG, or WebP policy images, this is optional.
                </p>
                <textarea
                  id="document-text"
                  value={documentText}
                  onChange={(event) => setDocumentText(event.target.value)}
                  className="mt-4 min-h-48 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-orange"
                  placeholder="Paste lease terms, HOA rules, dues, restrictions, maintenance duties, insurance requirements, violation/fine language, inspection findings, exclusions, or estimate language here..."
                />
              </div>
              {aiError && (
                <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  <div>
                    <p className="font-semibold">AI setup needed</p>
                    <p className="mt-1 text-muted-foreground">{aiError}</p>
                  </div>
                </div>
              )}
              {aiReport && <AiReportView report={aiReport} />}
              <AskAiPanel
                question={question}
                setQuestion={setQuestion}
                answer={answer}
                questionError={questionError}
                asking={asking}
                onAsk={askAiQuestion}
              />
            </>
          )}
          {(aiReport || damageAnalysis) && (
            <EmailReportPanel
              email={email}
              setEmail={(value) => {
                setEmail(value);
                setEmailSaved(false);
              }}
              phone={phone}
              setPhone={(value) => {
                setPhone(value);
                setEmailSaved(false);
              }}
              saved={emailSaved}
              onSave={() => setEmailSaved(true)}
              documentLabel={current.label}
              address={propertyAddress}
              report={aiReport}
              damageAnalysis={damageAnalysis}
            />
          )}
          <Callout tone="info" title="What happens after upload">
            The live version sends pasted document text or uploaded policy images to a private server route, then OpenAI returns a plain-English report.
            Damage photos are sent directly for AI review and are not stored by this app. Built-in PDF text extraction is the next layer to add. <Link to="/analysis/insurance" className="text-orange font-medium hover:underline">See an example output</Link>.
          </Callout>
          <Callout tone="success" title="Your documents are private">
            We never share documents with insurers, contractors or third parties. Delete any time.
          </Callout>
        </div>
      </div>
    </Section>
  );
}

function PropertyContextPanel({
  address,
  setAddress,
}: {
  address: string;
  setAddress: (value: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const skipNextLookup = useRef("");

  useEffect(() => {
    const query = address.trim();
    if (query.length < 3 || skipNextLookup.current === query) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setLookupError("");

      try {
        const response = await fetch(`/api/address-suggest?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.error || "Address lookup failed.");
        }
        setSuggestions(Array.isArray(payload.suggestions) ? payload.suggestions : []);
        setOpen(true);
      } catch (error) {
        if (controller.signal.aborted) return;
        setSuggestions([]);
        setLookupError(error instanceof Error ? error.message : "Address lookup failed.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [address]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <label htmlFor="property-address" className="text-sm font-semibold text-foreground">
        Property address or city
      </label>
      <p className="mt-1 text-sm text-muted-foreground">
        Optional. Start typing and choose a matching Florida address or city.
      </p>
      <div className="relative mt-4">
        <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id="property-address"
          value={address}
          onFocus={() => setOpen(suggestions.length > 0)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          onChange={(event) => {
            skipNextLookup.current = "";
            setAddress(event.target.value);
          }}
          className="h-12 w-full rounded-xl border border-input bg-background px-11 pr-11 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-orange"
          placeholder="Example: 123 Main St, Tampa, FL"
          autoComplete="street-address"
        />
        {loading && (
          <Loader2 className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
        {open && suggestions.length > 0 && (
          <div className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-border bg-popover p-1 shadow-xl">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  skipNextLookup.current = suggestion.label;
                  setAddress(suggestion.label);
                  setOpen(false);
                  setSuggestions([]);
                }}
                className="w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary"
              >
                <span className="block text-sm font-medium text-foreground">{suggestion.label}</span>
                {(suggestion.city || suggestion.county || suggestion.postcode) && (
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {[suggestion.city, suggestion.county, suggestion.postcode].filter(Boolean).join(" - ")}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Used only to improve this analysis. Not required.
      </p>
      {lookupError && <p className="mt-2 text-xs text-warning">{lookupError}</p>}
    </div>
  );
}

function AiReportView({ report }: { report: AiAnalysisReport }) {
  return (
    <div className="rounded-2xl border border-orange/30 bg-orange/5 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-orange">Live AI analysis</p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">{report.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{report.subtitle}</p>
        </div>
      </div>
      <p className="mt-5 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground/90">
        {report.summary}
      </p>
      <div className="mt-4 grid gap-3">
        {report.sections.map((section) => (
          <div
            key={`${section.title}-${section.value}`}
            className={cn(
              "rounded-xl border p-4",
              section.tone === "warning" && "border-warning/30 bg-warning/10",
              section.tone === "success" && "border-success/30 bg-success/10",
              section.tone === "default" && "border-border bg-card",
            )}
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{section.title}</p>
                <p className="mt-1 text-lg font-bold text-foreground">{section.value}</p>
              </div>
              <p className="text-sm text-muted-foreground sm:max-w-sm">{section.note}</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">{section.explanation}</p>
            {section.nextSteps.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {section.nextSteps.map((step) => (
                  <li key={step} className="flex gap-2 text-sm text-foreground/90">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      {report.insights.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-foreground">Why this matters</p>
          <ul className="mt-2 space-y-1.5">
            {report.insights.map((insight) => (
              <li key={insight} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EmailReportPanel({
  email,
  setEmail,
  phone,
  setPhone,
  saved,
  onSave,
  documentLabel,
  address,
  report,
  damageAnalysis,
}: {
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  saved: boolean;
  onSave: () => void;
  documentLabel: string;
  address: string;
  report?: AiAnalysisReport | null;
  damageAnalysis?: string;
}) {
  const reportText = buildPrintableReport({ documentLabel, address, report, damageAnalysis });
  const [sending, setSending] = useState(false);
  const [sendMessage, setSendMessage] = useState("");
  const [sendError, setSendError] = useState("");
  const canDeliver = email.trim().length > 0 && phone.trim().length > 0;
  const mailtoHref = `mailto:${encodeURIComponent(email.trim())}?subject=${encodeURIComponent(
    `Florida HomeShield ${documentLabel} report`,
  )}&body=${encodeURIComponent(reportText)}`;

  async function sendReport() {
    setSendError("");
    setSendMessage("");

    if (!email.trim()) {
      setSendError("Enter an email address first.");
      return;
    }

    if (!phone.trim()) {
      setSendError("Enter a phone number before getting the report.");
      return;
    }

    setSending(true);
    const response = await fetch("/api/send-report-email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        to: email.trim(),
        phone: phone.trim(),
        subject: `Florida HomeShield ${documentLabel} report`,
        reportText,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    setSending(false);

    if (!response.ok) {
      setSendError(payload.error || "The email could not be sent yet.");
      return;
    }

    setSendMessage("Report sent. Check the inbox in a minute.");
  }

  function printReport() {
    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) return;
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Florida HomeShield Report</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; margin: 32px; line-height: 1.5; }
            h1 { color: #0b2545; margin-bottom: 4px; }
            pre { white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>Florida HomeShield Report</h1>
          <pre>${reportText.replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[char] ?? char)}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <label htmlFor="report-email" className="text-sm font-semibold text-foreground">
        Get your report
      </label>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter an email and phone number to receive the finished report. We only send the report by email.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input
          id="report-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 flex-1 rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-orange"
          placeholder="Email address"
        />
        <input
          id="report-phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="h-12 flex-1 rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-orange"
          placeholder="Phone number"
        />
      </div>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onSave}
          disabled={!canDeliver}
          className="rounded-xl border border-input bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save contact
        </button>
        <button
          type="button"
          onClick={sendReport}
          disabled={!canDeliver || sending}
          className="inline-flex items-center justify-center rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Mail className="mr-2 h-4 w-4" />
          {sending ? "Sending..." : "Send email"}
        </button>
        <a
          href={canDeliver ? mailtoHref : undefined}
          aria-disabled={!canDeliver}
          onClick={(event) => {
            if (!canDeliver) event.preventDefault();
          }}
          className={cn(
            "inline-flex items-center justify-center rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange/90",
            !canDeliver && "pointer-events-none cursor-not-allowed opacity-60",
          )}
        >
          <Mail className="mr-2 h-4 w-4" />
          Open email draft
        </a>
        <button
          type="button"
          onClick={printReport}
          className="inline-flex items-center justify-center rounded-xl border border-input bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print report
        </button>
      </div>
      {sendMessage && <p className="mt-3 text-sm text-success">{sendMessage}</p>}
      {sendError && <p className="mt-3 text-sm text-warning">{sendError}</p>}
      {saved && (
        <p className="mt-3 text-sm text-success">
          Contact saved for this session. The report will still only be sent to the email address.
        </p>
      )}
      <textarea
        readOnly
        value={reportText}
        className="mt-4 min-h-40 w-full rounded-xl border border-input bg-secondary/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground outline-none"
        aria-label="Printable report text"
      />
    </div>
  );
}

function AskAiPanel({
  question,
  setQuestion,
  answer,
  questionError,
  asking,
  onAsk,
}: {
  question: string;
  setQuestion: (value: string) => void;
  answer: string;
  questionError: string;
  asking: boolean;
  onAsk: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Ask AI a question</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask about the pasted document text or the generated report.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="min-h-12 flex-1 rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-orange"
          placeholder="Example: What fees should I ask the landlord about?"
        />
        <button
          onClick={onAsk}
          disabled={asking}
          className="rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {asking ? "Asking..." : "Ask AI"}
        </button>
      </div>
      {questionError && <p className="mt-3 text-sm text-warning">{questionError}</p>}
      {answer && (
        <div className="mt-4 whitespace-pre-line rounded-xl border border-border bg-secondary/30 p-4 text-sm leading-relaxed text-foreground/90">
          {answer}
        </div>
      )}
    </div>
  );
}

function DamagePhotoPanel({
  damagePhoto,
  setDamagePhoto,
  damageNotes,
  setDamageNotes,
  damageAnalysis,
  damageError,
  analyzingDamage,
  onAnalyze,
}: {
  damagePhoto: File | null;
  setDamagePhoto: (file: File | null) => void;
  damageNotes: string;
  setDamageNotes: (value: string) => void;
  damageAnalysis: string;
  damageError: string;
  analyzingDamage: boolean;
  onAnalyze: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary">
          <FileSearch className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Damage photo analyzer</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select a clear damage photo for AI review. Photos are sent for analysis only and are not saved to cloud storage by this app.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => setDamagePhoto(event.target.files?.[0] ?? null)}
          className="rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground"
        />
        {damagePhoto && (
          <p className="text-xs text-muted-foreground">
            Ready to analyze: <span className="font-medium text-foreground">{damagePhoto.name}</span>
          </p>
        )}
        <textarea
          value={damageNotes}
          onChange={(event) => setDamageNotes(event.target.value)}
          className="min-h-24 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-orange"
          placeholder="Optional: what happened, room/location, storm date, leak source, or what you already noticed..."
        />
        <button
          onClick={onAnalyze}
          disabled={analyzingDamage}
          className="w-full rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {analyzingDamage ? "Analyzing photo..." : "Analyze damage photo"}
        </button>
      </div>
      {damageError && <p className="mt-3 text-sm text-warning">{damageError}</p>}
      {damageAnalysis && (
        <div className="mt-4 whitespace-pre-line rounded-xl border border-border bg-secondary/30 p-4 text-sm leading-relaxed text-foreground/90">
          {damageAnalysis}
        </div>
      )}
    </div>
  );
}
