import type { Translations } from "./fr"

export const en: Translations = {
  auth: {
    subtitle: "Sign in to access your feeds",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    signingIn: "Signing in…",
    emailInvalid: "Invalid email",
    passwordRequired: "Password is required",
    continueWithGitHub: "Continue with GitHub",
    continueWithGoogle: "Continue with Google",
    or: "or",
  },
  feed: {
    myFeeds: "My feeds",
    allFeeds: "All feeds",
    loading: "Loading…",
    retry: "Retry",
    providers: {
      changelog: "GitHub Changelog",
      youtube: "YouTube",
      rss: "RSS",
      scrap: "Web scraping",
    },
  },
  userMenu: {
    signOut: "Sign out",
  },
  menu: {
    file: {
      title: "File",
      checkForUpdates: "Check for updates",
      refresh: "Refresh",
      quit: "Quit",
    },
    language: {
      title: "Language",
      french: "🇫🇷 Français",
      english: "🇬🇧 English",
    },
    display: {
      title: "View",
      lightMode: "Light mode",
      darkMode: "Dark mode",
      fullscreen: "Full screen",
    },
    help: {
      title: "Help",
      about: "About StayUp",
    },
  },
  updater: {
    checking: "Checking for updates…",
    upToDate: "You are up to date.",
    updateAvailable: "Update available",
    downloading: "Downloading…",
    restarting: "Restarting…",
    error: "Error checking for updates.",
  },
}
