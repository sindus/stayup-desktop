import { useAuth } from "@/hooks/useAuth"
import { useUpdater } from "@/hooks/useUpdater"
import { useLanguage } from "@/context/LanguageContext"
import { LoginModal } from "@/components/auth/LoginModal"
import { FeedLayout } from "@/components/feed/FeedLayout"
import { UpdateBanner } from "@/components/ui/UpdateBanner"

export default function App() {
  const { session, loading, error, login, loginOAuth, logout } = useAuth()
  const { status: updateStatus, downloadProgress, checkForUpdates, dismiss: dismissUpdate } = useUpdater()
  const { t } = useLanguage()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <p className="text-sm text-muted-foreground">{t.feed.loading}</p>
      </div>
    )
  }

  if (!session) {
    return <LoginModal onLogin={login} onOAuth={loginOAuth} loading={loading} error={error} />
  }

  return (
    <div className="flex flex-col h-screen">
      <UpdateBanner status={updateStatus} downloadProgress={downloadProgress} t={t} onDismiss={dismissUpdate} />
      <FeedLayout session={session} onLogout={logout} onCheckUpdates={checkForUpdates} />
    </div>
  )
}
