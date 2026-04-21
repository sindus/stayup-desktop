import { LoginForm } from "./LoginForm"
import { OAuthButtons } from "./OAuthButtons"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

interface LoginModalProps {
  onLogin: (email: string, password: string) => Promise<void>
  onOAuth: (provider: "github" | "google") => Promise<void>
  loading: boolean
  error: string | null
}

export function LoginModal({ onLogin, onOAuth, loading, error }: LoginModalProps) {
  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <div className="absolute top-3 right-3">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold tracking-tight">StayUp</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connectez-vous pour accéder à vos flux
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <LoginForm onSubmit={onLogin} loading={loading} error={error} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <OAuthButtons onOAuth={onOAuth} loading={loading} />
        </div>
      </div>
    </div>
  )
}
