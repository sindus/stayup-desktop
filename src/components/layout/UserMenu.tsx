import type { AppSession } from "@/lib/session";

interface UserMenuProps {
  session: AppSession;
  onLogout: () => void;
}

export function UserMenu({ session, onLogout }: UserMenuProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground truncate max-w-[160px]">
        {session.email}
      </span>
      <button
        onClick={onLogout}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Déconnexion
      </button>
    </div>
  );
}
