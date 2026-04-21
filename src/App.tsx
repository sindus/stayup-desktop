import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/auth/LoginModal";
import { FeedLayout } from "@/components/feed/FeedLayout";

export default function App() {
  const { session, loading, error, login, loginOAuth, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <LoginModal
        onLogin={login}
        onOAuth={loginOAuth}
        loading={loading}
        error={error}
      />
    );
  }

  return <FeedLayout session={session} onLogout={logout} />;
}
