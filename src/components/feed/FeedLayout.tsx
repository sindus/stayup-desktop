import { useCallback } from "react"
import { useNavigationStore } from "@/store/navigation"
import { useFeed } from "@/hooks/useFeed"
import { useMenu } from "@/hooks/useMenu"
import { useLanguage } from "@/context/LanguageContext"
import { useTheme } from "@/context/ThemeContext"
import { FeedSidebar } from "./FeedSidebar"
import { FeedItemList } from "./FeedItemList"
import { UnifiedFeedList } from "./UnifiedFeedList"
import { DocList } from "@/components/documentation/DocList"
import { DocViewer } from "@/components/documentation/DocViewer"
import { HistoryList } from "@/components/documentation/HistoryList"
import { DiffViewer } from "@/components/documentation/DiffViewer"
import { UserMenu } from "@/components/layout/UserMenu"
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
    if (selection.type === "documentation") return <DocList />
    if (selection.type === "doc") return <DocViewer docId={selection.docId} />
    if (selection.type === "doc-history") return <HistoryList docId={selection.docId} />
    if (selection.type === "doc-diff")
      return <DiffViewer docId={selection.docId} versionId={selection.versionId} />

    if (loading) {
      return (
        <p className="text-[13px] text-muted-foreground italic py-12 text-center">
          {t.feed.loading}
        </p>
      )
    }
    if (error) {
      return (
        <div className="py-12 text-center space-y-2">
          <p className="text-[13px] text-destructive">{error}</p>
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

  const initial = session.userId?.charAt(0)?.toUpperCase() ?? "?"

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 h-[52px] shrink-0"
        style={{ borderBottom: "1px solid hsl(var(--border))" }}
      >
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
            <rect width="26" height="26" rx="6" fill="var(--teal)" />
            <path d="M13 6L19.5 15H15V20H11V15H6.5L13 6Z" fill="#09090b" />
          </svg>
          <span className="font-semibold text-[14px]" style={{ letterSpacing: "-0.02em" }}>
            StayUp
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold"
            style={{
              background: "linear-gradient(135deg, var(--teal), oklch(0.65 0.22 280))",
              color: "#fafafa",
            }}
          >
            {initial}
          </div>
          <UserMenu session={session} onLogout={onLogout} />
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <FeedSidebar fluxes={fluxes} userId={session.userId} onRefresh={stableRefresh} />
        <main className="flex-1 overflow-y-auto px-5 py-4">{renderContent()}</main>
      </div>
    </div>
  )
}
