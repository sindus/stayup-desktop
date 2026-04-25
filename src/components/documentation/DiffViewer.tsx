import { useNavigationStore } from "@/store/navigation"
import { useLanguage } from "@/context/LanguageContext"
import { useDocDiff } from "@/hooks/useDocumentation"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface DiffViewerProps {
  docId: number
  versionId: number
}

function classifyLine(line: string): "added" | "removed" | "header" | "context" {
  if (line.startsWith("+") && !line.startsWith("+++")) return "added"
  if (line.startsWith("-") && !line.startsWith("---")) return "removed"
  if (line.startsWith("@@") || line.startsWith("---") || line.startsWith("+++")) return "header"
  return "context"
}

export function DiffViewer({ docId, versionId }: DiffViewerProps) {
  const { t } = useLanguage()
  const { setSelection } = useNavigationStore()
  const { docName, version, diff, scraped_at, loading, error } = useDocDiff(docId, versionId)

  if (loading) {
    return <p className="text-sm text-muted-foreground italic py-12 text-center">{t.documentation.loading}</p>
  }

  if (error) {
    return <p className="text-sm text-destructive py-12 text-center">{error}</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSelection({ type: "doc-history", docId })}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {t.documentation.history}
        </button>
      </div>

      {docName && version !== null && (
        <div className="space-y-0.5">
          <h2 className="font-semibold">{docName}</h2>
          <p className="text-xs text-muted-foreground">
            {t.documentation.version} {version}
            {scraped_at && (
              <> &middot; {t.documentation.scrapedAt} {new Date(scraped_at).toLocaleDateString()}</>
            )}
          </p>
        </div>
      )}

      {diff ? (
        <pre className="text-xs font-mono rounded-md border bg-muted/20 overflow-x-auto">
          {diff.split("\n").map((line, i) => {
            const kind = classifyLine(line)
            return (
              <div
                key={i}
                className={cn("px-4 py-px", {
                  "bg-green-500/10 text-green-700 dark:text-green-400": kind === "added",
                  "bg-red-500/10 text-red-700 dark:text-red-400": kind === "removed",
                  "text-muted-foreground": kind === "header",
                })}
              >
                {line || " "}
              </div>
            )
          })}
        </pre>
      ) : (
        <p className="text-sm text-muted-foreground italic">{t.documentation.noDiff}</p>
      )}
    </div>
  )
}
