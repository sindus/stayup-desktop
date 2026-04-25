import { useNavigationStore } from "@/store/navigation"
import { useLanguage } from "@/context/LanguageContext"
import { useDocHistory } from "@/hooks/useDocumentation"
import { ChevronLeft } from "lucide-react"

interface HistoryListProps {
  docId: number
}

export function HistoryList({ docId }: HistoryListProps) {
  const { t } = useLanguage()
  const { setSelection } = useNavigationStore()
  const { docName, versions, loading, error } = useDocHistory(docId)

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground italic py-12 text-center">
        {t.documentation.loading}
      </p>
    )
  }

  if (error) {
    return <p className="text-sm text-destructive py-12 text-center">{error}</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSelection({ type: "doc", docId })}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {t.documentation.backToDoc}
        </button>
      </div>

      {docName && (
        <h2 className="font-semibold">
          {docName} &mdash; {t.documentation.history}
        </h2>
      )}

      {versions.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">{t.documentation.noContent}</p>
      ) : (
        <div className="space-y-2">
          {versions.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between rounded-md border px-4 py-3 text-sm"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {t.documentation.version} {v.version}
                  </span>
                  {v.is_current && (
                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                      {t.documentation.current}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t.documentation.scrapedAt} {new Date(v.scraped_at).toLocaleDateString()}
                  {v.archived_at && (
                    <>
                      {" "}
                      &middot; {t.documentation.archivedAt}{" "}
                      {new Date(v.archived_at).toLocaleDateString()}
                    </>
                  )}
                </p>
              </div>

              {v.has_diff && (
                <button
                  onClick={() => setSelection({ type: "doc-diff", docId, versionId: v.id })}
                  className="text-xs px-2.5 py-1 rounded-md border border-border hover:bg-muted transition-colors"
                >
                  Diff
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
