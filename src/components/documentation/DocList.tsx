import { useNavigationStore } from "@/store/navigation"
import { useLanguage } from "@/context/LanguageContext"
import { useDocumentation } from "@/hooks/useDocumentation"
import { cn } from "@/lib/utils"

export function DocList() {
  const { t } = useLanguage()
  const { setSelection } = useNavigationStore()
  const { docs, loading, error, subscribe, unsubscribe } = useDocumentation()

  if (loading) {
    return <p className="text-sm text-muted-foreground italic py-12 text-center">{t.documentation.loading}</p>
  }

  if (error) {
    return <p className="text-sm text-destructive py-12 text-center">{error}</p>
  }

  if (docs.length === 0) {
    return <p className="text-sm text-muted-foreground italic py-12 text-center">{t.documentation.noContent}</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {docs.map((doc) => (
        <div key={doc.id} className="rounded-lg border bg-card p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-medium text-sm">{doc.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{doc.url}</p>
            {doc.current_version !== null && (
              <p className="text-xs text-muted-foreground">
                {t.documentation.version} {doc.current_version}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelection({ type: "doc", docId: doc.id })}
              className="text-xs px-2.5 py-1 rounded-md border border-border hover:bg-muted transition-colors"
            >
              {t.documentation.viewContent}
            </button>
            <button
              onClick={() => setSelection({ type: "doc-history", docId: doc.id })}
              className="text-xs px-2.5 py-1 rounded-md border border-border hover:bg-muted transition-colors"
            >
              {t.documentation.viewHistory}
            </button>
            <button
              onClick={() => (doc.is_subscribed ? unsubscribe(doc.id) : subscribe(doc.id))}
              className={cn(
                "text-xs px-2.5 py-1 rounded-md transition-colors ml-auto",
                doc.is_subscribed
                  ? "bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {doc.is_subscribed ? t.documentation.unsubscribe : t.documentation.subscribe}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
