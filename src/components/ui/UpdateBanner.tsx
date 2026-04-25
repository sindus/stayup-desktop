import type { UpdateStatus } from "@/hooks/useUpdater"
import type { Translations } from "@/lib/translations"

interface UpdateBannerProps {
  status: UpdateStatus
  downloadProgress: number | null
  t: Translations
  onDismiss: () => void
}

const DISMISSIBLE: UpdateStatus[] = ["up-to-date", "error"]

export function UpdateBanner({ status, downloadProgress, t, onDismiss }: UpdateBannerProps) {
  if (status === "idle") return null

  function getMessage() {
    switch (status) {
      case "checking":
        return t.updater.checking
      case "up-to-date":
        return t.updater.upToDate
      case "downloading":
        if (downloadProgress !== null) {
          return t.updater.downloading + " " + String(downloadProgress) + "%"
        }
        return t.updater.downloading
      case "restarting":
        return t.updater.restarting
      case "error":
        return t.updater.error
      default:
        return ""
    }
  }

  return (
    <div className="flex items-center justify-between border-b bg-muted/50 px-6 py-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span>{getMessage()}</span>
        {status === "downloading" && downloadProgress !== null && (
          <div className="flex-1 max-w-32 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: String(downloadProgress) + "%" }}
            />
          </div>
        )}
      </div>
      {DISMISSIBLE.includes(status) && (
        <button
          onClick={onDismiss}
          className="ml-4 shrink-0 hover:text-foreground transition-colors"
        >
          &#x2715;
        </button>
      )}
    </div>
  )
}
