import { useLanguage } from "@/context/LanguageContext"
import type { Language } from "@/lib/translations"

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setLang("fr" as Language)}
        className={`text-sm px-1.5 py-0.5 rounded transition-colors ${
          lang === "fr"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground opacity-50"
        }`}
        aria-label="Français"
      >
        🇫🇷
      </button>
      <button
        onClick={() => setLang("en" as Language)}
        className={`text-sm px-1.5 py-0.5 rounded transition-colors ${
          lang === "en"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground opacity-50"
        }`}
        aria-label="English"
      >
        🇬🇧
      </button>
    </div>
  )
}
