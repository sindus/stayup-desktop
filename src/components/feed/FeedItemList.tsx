import type {
  ChangelogItem,
  YoutubeItem,
  YoutubeItemContent,
  RssItem,
  RssItemContent,
  ScrapItem,
  ScrapItemParams,
  Provider,
} from "@/types"
import { formatDate, openUrl } from "@/lib/utils"

function extractHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

function extractChannelName(url: string): string {
  try {
    const { pathname } = new URL(url)
    const atMatch = pathname.match(/^\/@(.+)/)
    if (atMatch) return `@${atMatch[1]}`
    const segments = pathname.split("/").filter(Boolean)
    return segments[segments.length - 1] ?? url
  } catch {
    return url
  }
}

const PROVIDER_COLORS: Record<string, string> = {
  changelog: "var(--teal)",
  youtube: "var(--rose)",
  rss: "var(--amber)",
  scrap: "var(--green)",
}

type AnyItem = ChangelogItem | YoutubeItem | RssItem | ScrapItem

function getItemDate(item: AnyItem): string {
  if ("datetime" in item && item.datetime) return item.datetime
  return item.executed_at
}

interface FeedItemListProps {
  items: AnyItem[]
  provider: Provider
  repositories?: { repository_id: number; url: string }[]
}

export function FeedItemList({ items, provider, repositories = [] }: FeedItemListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic py-12 text-center">
        Aucun contenu disponible.
      </p>
    )
  }

  const repoUrlMap = Object.fromEntries(repositories.map((r) => [r.repository_id, r.url]))

  const sorted = [...items].sort(
    (a, b) => new Date(getItemDate(b)).getTime() - new Date(getItemDate(a)).getTime(),
  )

  return (
    <div className="space-y-4">
      {provider === "changelog" &&
        (sorted as ChangelogItem[]).map((item) => (
          <ChangelogEntry
            key={item.id}
            item={item}
            repoUrl={repoUrlMap[item.repository_id] ?? ""}
          />
        ))}
      {provider === "youtube" &&
        (sorted as YoutubeItem[]).map((item) => (
          <YoutubeEntry key={item.id} item={item} color={PROVIDER_COLORS[provider]} />
        ))}
      {provider === "rss" &&
        (sorted as RssItem[]).map((item) => (
          <RssEntry key={item.id} item={item} color={PROVIDER_COLORS[provider]} />
        ))}
      {provider === "scrap" &&
        (sorted as ScrapItem[]).map((item) => (
          <ScrapEntry key={item.id} item={item} color={PROVIDER_COLORS[provider]} />
        ))}
    </div>
  )
}

function ChangelogEntry({ item, repoUrl }: { item: ChangelogItem; repoUrl: string }) {
  const href = repoUrl ? `${repoUrl}/releases/tag/${item.version}` : undefined

  const content = (
    <div className="space-y-1 border-l-2 border-muted pl-3 py-1">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-sm text-gray-100">{item.version}</span>
        <span className="text-xs text-gray-500 shrink-0">
          {formatDate(item.datetime ?? item.executed_at)}
        </span>
      </div>
      {item.content && (
        <p className="text-sm text-gray-400 line-clamp-3 whitespace-pre-line">
          {item.content
            .replace(/#{1,6}\s/g, "")
            .replace(/\r\n/g, " ")
            .slice(0, 300)}
        </p>
      )}
    </div>
  )

  if (!href) return content

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault()
        void openUrl(href)
      }}
      className="block cursor-pointer"
    >
      {content}
    </a>
  )
}

function YoutubeEntry({ item, color }: { item: YoutubeItem; color: string }) {
  let parsed: YoutubeItemContent | null = null
  try {
    parsed = JSON.parse(item.content) as YoutubeItemContent
  } catch {
    // ignore
  }

  const inner = (
    <div className="flex gap-3">
      {parsed?.thumbnail && (
        <img
          src={parsed.thumbnail}
          alt={parsed?.title ?? "Thumbnail"}
          width={120}
          height={68}
          loading="lazy"
          className="object-cover rounded shrink-0"
        />
      )}
      <div className="space-y-1 min-w-0">
        <p className="font-medium text-sm line-clamp-2 text-gray-100">
          {parsed?.title ?? "Sans titre"}
        </p>
        <div className="flex items-center gap-2">
          {parsed?.url && (
            <span className="text-xs font-mono" style={{ color }}>
              {extractChannelName(parsed.url)}
            </span>
          )}
          <span className="text-xs text-gray-500">
            {formatDate(item.datetime ?? item.executed_at)}
          </span>
        </div>
      </div>
    </div>
  )

  const videoUrl = parsed?.link ?? parsed?.url
  if (!videoUrl) return inner

  return (
    <a
      href={videoUrl}
      onClick={(e) => {
        e.preventDefault()
        void openUrl(videoUrl)
      }}
      className="block cursor-pointer"
    >
      {inner}
    </a>
  )
}

function RssEntry({ item, color }: { item: RssItem; color: string }) {
  let parsed: RssItemContent | null = null
  try {
    parsed = JSON.parse(item.content) as RssItemContent
  } catch {
    // ignore
  }

  const source = parsed?.link ? extractHostname(parsed.link) : null

  const inner = (
    <div className="space-y-1 border-l-2 border-muted pl-3 py-1">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-sm line-clamp-1 text-gray-100">
          {parsed?.title ?? "Sans titre"}
        </span>
        <span className="text-xs text-gray-500 shrink-0">
          {formatDate(item.datetime ?? item.executed_at)}
        </span>
      </div>
      {source && (
        <p className="text-xs font-mono" style={{ color }}>
          {source}
        </p>
      )}
      {parsed?.summary && <p className="text-sm text-gray-400 line-clamp-2">{parsed.summary}</p>}
    </div>
  )

  if (!parsed?.link) return inner

  const link = parsed.link
  return (
    <a
      href={link}
      onClick={(e) => {
        e.preventDefault()
        void openUrl(link)
      }}
      className="block cursor-pointer"
    >
      {inner}
    </a>
  )
}

function ScrapEntry({ item, color }: { item: ScrapItem; color: string }) {
  const params: ScrapItemParams | null =
    typeof item.params === "string"
      ? (() => {
          try {
            return JSON.parse(item.params) as ScrapItemParams
          } catch {
            return null
          }
        })()
      : (item.params as ScrapItemParams | null)

  const inner = (
    <div className="space-y-1 border-l-2 border-muted pl-3 py-1">
      <div className="flex items-center justify-between gap-2">
        {params?.url && (
          <span className="font-mono text-xs line-clamp-1" style={{ color }}>
            {params.url}
          </span>
        )}
        <span className="text-xs text-gray-500 shrink-0">{formatDate(item.executed_at)}</span>
      </div>
      {item.content && (
        <p className="text-sm text-gray-400 line-clamp-3 whitespace-pre-line">
          {item.content.slice(0, 400)}
        </p>
      )}
    </div>
  )

  if (!params?.url) return inner

  const url = params.url
  return (
    <a
      href={url}
      onClick={(e) => {
        e.preventDefault()
        void openUrl(url)
      }}
      className="block cursor-pointer"
    >
      {inner}
    </a>
  )
}
