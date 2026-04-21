import { useCallback } from "react"
import { useNavigationStore } from "@/store/navigation"
import { useFeed } from "@/hooks/useFeed"
import { useMenu } from "@/hooks/useMenu"
import { useLanguage } from "@/context/LanguageContext"
import { useTheme } from "@/context/ThemeContext"
import { FeedSidebar } from "./FeedSidebar"
import { FeedItemList } from "./FeedItemList"
import { UnifiedFeedList } from "./UnifiedFeedList"
import { UserMenu } from "@/components/layout/UserMenu"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import type { AppSession } from "@/lib/session"

interface FeedLayoutProps {
  session: AppSession
  onLogout: () => void
  onCheckUpdates: () => void
}

export function FeedLayout({ session, onLogout, onCheckUpdates }: FeedLayoutProps) {
  const { selection } = useNavigationStore()
  const { fluxes, connectors, loading, error, refresh } = useFeed(session.userId)
  const { lang, t, setLang } = useLanguage()
  const { theme, setTheme } = useTheme()

  const stableRefresh = useCallback(() => refresh(), [refresh])

  useMenu({
    lang,
    t,
    theme,
    setLang,
    setTheme,
    onCheckUpdates,
    onRefresh: stableRefresh,
  })

  const repositories = fluxes.map((f) => ({
    repository_id: f.repository_id,
    url: f.url,
  }))

  function renderContent() {
    if (loading) {
      return (
        <p className="text-sm text-muted-foreground italic py-12 text-center">{t.feed.loading}</p>
      )
    }
    if (error) {
      return (
        <div className="py-12 text-center space-y-2">
          <p className="text-sm text-destructive">{error}</p>
          <button onClick={refresh} className="text-xs text-muted-foreground underline">
            {t.feed.retry}
          </button>
        </div>
      )
    }
    if (!connectors) return null

    if (selection.type === "all") {
      return (
        <UnifiedFeedList
          changelog={connectors.changelog}
          youtube={connectors.youtube}
          rss={connectors.rss}
          scrap={connectors.scrap}
          repositories={repositories}
        />
      )
    }

    if (selection.type === "category") {
      const { provider } = selection
      const items =
        provider === "changelog"
          ? connectors.changelog
          : provider === "youtube"
            ? connectors.youtube
            : provider === "rss"
              ? connectors.rss
              : connectors.scrap

      return <FeedItemList items={items} provider={provider} repositories={repositories} />
    }

    if (selection.type === "flux") {
      const { fluxId, provider } = selection
      const flux = fluxes.find((f) => f.id === fluxId)
      const repoId = flux?.repository_id

      const allItems =
        provider === "changelog"
          ? connectors.changelog
          : provider === "youtube"
            ? connectors.youtube
            : provider === "rss"
              ? connectors.rss
              : connectors.scrap

      const filtered = repoId ? allItems.filter((item) => item.repository_id === repoId) : allItems

      return <FeedItemList items={filtered} provider={provider} repositories={repositories} />
    }

    return null
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-background text-foreground">
      <header className="flex items-center justify-between border-b px-6 py-3 shrink-0">
        <span className="font-semibold text-sm">StayUp</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu session={session} onLogout={onLogout} />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden px-6 py-4 gap-6">
        <FeedSidebar fluxes={fluxes} />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  )
}
