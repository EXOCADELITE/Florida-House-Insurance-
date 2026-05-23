import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type UploadFile = {
  id: string;
  name: string;
  size: number;
  file?: File;
  type?: string;
  status: "queued" | "uploading" | "success" | "error";
  progress: number;
};

export function DropZone({
  label,
  description,
  accept = ".pdf,.png,.jpg,.jpeg",
  onFiles,
  onAnalyze,
}: {
  label: string;
  description: string;
  accept?: string;
  onFiles?: (files: UploadFile[]) => void;
  onAnalyze?: (files: UploadFile[]) => void | Promise<void>;
}) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const readyFiles = files.filter((file) => file.status === "success");

  const handleFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const next: UploadFile[] = Array.from(incoming).map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
        size: f.size,
        file: f,
        type: f.type,
        status: "uploading",
        progress: 0,
      }));
      setFiles((prev) => [...prev, ...next]);
      // This is only an in-browser progress state for the local analysis flow.
      next.forEach((file) => {
        const tick = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) => {
              if (f.id !== file.id) return f;
              const nextProgress = Math.min(100, f.progress + Math.random() * 18 + 6);
              if (nextProgress >= 100) {
                clearInterval(tick);
                return { ...f, progress: 100, status: "success" };
              }
              return { ...f, progress: nextProgress };
            }),
          );
        }, 240);
      });
      onFiles?.(next);
    },
    [onFiles],
  );

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all",
          dragging
            ? "border-orange bg-orange/5"
            : "border-border bg-secondary/30 hover:border-orange/40 hover:bg-secondary/50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange/10 text-orange">
          <UploadCloud className="h-6 w-6" />
        </div>
        <p className="mt-4 text-base font-semibold text-foreground">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">{description}</p>
        <p className="mt-4 text-xs text-muted-foreground">
          Drag & drop or click to browse · PDF, JPG, PNG · up to 25 MB each
        </p>
      </div>
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f) => (
            <li key={f.id} className="rounded-xl border border-border bg-card p-3.5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground truncate">{f.name}</p>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {(f.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      f.status === "error" ? "bg-destructive" : f.status === "success" ? "bg-success" : "bg-orange",
                    )}
                    style={{ width: `${f.progress}%` }}
                  />
                </div>
              </div>
              {f.status === "success" && <CheckCircle2 className="h-4 w-4 text-success" />}
              {f.status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFiles((prev) => prev.filter((x) => x.id !== f.id));
                }}
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary"
                aria-label="Remove file"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
          <Button
            className="bg-orange text-white hover:bg-orange/90 w-full sm:w-auto"
            disabled={readyFiles.length === 0 || analyzing}
            onClick={() => {
              if (readyFiles.length === 0) return;
              setAnalyzing(true);
              window.setTimeout(() => {
                Promise.resolve(onAnalyze?.(readyFiles)).finally(() => setAnalyzing(false));
              }, 900);
            }}
          >
            {analyzing
              ? "Analyzing documents..."
              : readyFiles.length === 0
                ? "Finishing upload..."
                : `Run analysis on ${readyFiles.length} file${readyFiles.length === 1 ? "" : "s"}`}
          </Button>
        </ul>
      )}
    </div>
  );
}
