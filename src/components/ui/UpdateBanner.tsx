import type { UpdateStatus } from "@/hooks/useUpdater"
import type { Translations } from "@/lib/translations"

interface UpdateBannerProps {
  status: UpdateStatus
  t: Translations
  onDismiss: () => void
}

const DISMISSIBLE: UpdateStatus[] = ["up-to-date", "error"]

export function UpdateBanner({ status, t, onDismiss }: UpdateBannerProps) {
  if (status === "idle") return null

  const messages: Record<UpdateStatus, string> = {
    idle: "",
    checking: t.updater.checking,
    "up-to-date": t.updater.upToDate,
    available: t.updater.updateAvailable,
    downloading: t.updater.downloading,
    restarting: t.updater.restarting,
    error: t.updater.error,
  }

  return (
    <div className="flex items-center justify-between border-b bg-muted/50 px-6 py-2 text-xs text-muted-foreground">
      <span>{messages[status]}</span>
      {DISMISSIBLE.includes(status) && (
        <button onClick={onDismiss} className="ml-4 hover:text-foreground transition-colors">
          ✕
        </button>
      )}
    </div>
  )
}
