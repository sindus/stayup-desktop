import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { open } from "@tauri-apps/plugin-shell";
import type { Provider } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function extractIdentifier(url: string, provider: Provider): string {
  try {
    const u = new URL(url);
    switch (provider) {
      case "changelog": {
        const parts = u.pathname.replace(/^\//, "").split("/");
        return parts.slice(0, 2).join("/");
      }
      case "youtube":
        return u.pathname.replace(/^\//, "");
      case "rss":
        return u.hostname + u.pathname;
      case "scrap":
        return u.hostname;
      default:
        return url;
    }
  } catch {
    return url;
  }
}

export async function openUrl(url: string): Promise<void> {
  await open(url);
}
