import { useState } from "react"
import {
  GitBranch,
  PlaySquare,
  Rss,
  Globe,
  ChevronDown,
  ChevronRight,
  LayoutList,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigationStore } from "@/store/navigation"
import { useLanguage } from "@/context/LanguageContext"
import type { FeedFlux } from "@/hooks/useFeed"
import type { Provider } from "@/types"

interface FeedSidebarProps {
  fluxes: FeedFlux[]
}

export function FeedSidebar({ fluxes }: FeedSidebarProps) {
  const { selection, setSelection } = useNavigationStore()
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const providerConfig: Record<
    Provider,
    { label: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    changelog: { label: t.feed.providers.changelog, icon: GitBranch },
    youtube: { label: t.feed.providers.youtube, icon: PlaySquare },
    rss: { label: t.feed.providers.rss, icon: Rss },
    scrap: { label: t.feed.providers.scrap, icon: Globe },
  }

  const byProvider = fluxes.reduce<Partial<Record<Provider, FeedFlux[]>>>((acc, flux) => {
    ;(acc[flux.provider] ??= []).push(flux)
    return acc
  }, {})

  const providers = Object.keys(byProvider) as Provider[]

  function isExpanded(provider: Provider) {
    return expanded[provider] !== false
  }

  function toggleExpanded(provider: Provider) {
    setExpanded((prev) => ({ ...prev, [provider]: !isExpanded(provider) }))
  }

  const isAllActive = selection.type === "all"

  return (
    <aside className="w-56 shrink-0 border-r pr-4 overflow-y-auto">
      <div className="mb-4">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t.feed.myFeeds}
        </span>
      </div>

      <nav className="space-y-0.5">
        <button
          onClick={() => setSelection({ type: "all" })}
          className={cn(
            "flex w-full items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
            isAllActive
              ? "bg-accent text-accent-foreground font-medium"
              : "text-foreground hover:bg-muted",
          )}
        >
          <LayoutList className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{t.feed.allFeeds}</span>
        </button>

        {providers.map((provider) => {
          const { label, icon: Icon } = providerConfig[provider]
          const isCategoryActive = selection.type === "category" && selection.provider === provider
          const open = isExpanded(provider)

          return (
            <div key={provider}>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => toggleExpanded(provider)}
                  className="p-1 text-muted-foreground hover:text-foreground rounded"
                >
                  {open ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
                <button
                  onClick={() => setSelection({ type: "category", provider })}
                  className={cn(
                    "flex flex-1 items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                    isCategoryActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              </div>

              {open && (
                <div className="ml-7 mt-0.5 space-y-0.5 mb-1">
                  {(byProvider[provider] ?? []).map((flux) => {
                    const isActive = selection.type === "flux" && selection.fluxId === flux.id
                    return (
                      <button
                        key={flux.id}
                        onClick={() =>
                          setSelection({
                            type: "flux",
                            fluxId: flux.id,
                            provider: flux.provider,
                          })
                        }
                        className={cn(
                          "w-full truncate px-2 py-1 text-sm rounded-md transition-colors text-left",
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {flux.identifier}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
