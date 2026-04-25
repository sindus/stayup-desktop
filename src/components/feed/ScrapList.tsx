import { useLanguage } from "@/context/LanguageContext"
import { useScrap } from "@/hooks/useScrap"
import { cn } from "@/lib/utils"

export function ScrapList() {
  const { t } = useLanguage()
  const { repos, loading, error, subscribe, unsubscribe } = useScrap()

  if (loading) {
    return <p className="text-sm text-muted-foreground italic py-12 text-center">{t.scrap.loading}</p>
  }

  if (error) {
    return <p className="text-sm text-destructive py-12 text-center">{error}</p>
  }

  if (repos.length === 0) {
    return <p className="text-sm text-muted-foreground italic py-12 text-center">{t.scrap.noContent}</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {repos.map((repo) => (
        <div key={repo.id} className="rounded-lg border bg-card p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium truncate">{repo.url}</p>
            {repo.config.articles_selector && (
              <p className="text-xs text-muted-foreground font-mono truncate">
                {repo.config.articles_selector}
              </p>
            )}
          </div>
          <button
            onClick={() => (repo.is_subscribed ? unsubscribe(repo.id) : subscribe(repo.id))}
            className={cn(
              "w-full text-xs px-2.5 py-1.5 rounded-md transition-colors",
              repo.is_subscribed
                ? "bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {repo.is_subscribed ? t.scrap.unsubscribe : t.scrap.subscribe}
          </button>
        </div>
      ))}
    </div>
  )
}
