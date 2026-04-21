import { useState, useCallback } from "react"
import { check } from "@tauri-apps/plugin-updater"
import { relaunch } from "@tauri-apps/plugin-process"

export type UpdateStatus =
  | "idle"
  | "checking"
  | "up-to-date"
  | "available"
  | "downloading"
  | "restarting"
  | "error"

export function useUpdater() {
  const [status, setStatus] = useState<UpdateStatus>("idle")

  const checkForUpdates = useCallback(async () => {
    setStatus("checking")
    try {
      const update = await check()
      if (!update) {
        setStatus("up-to-date")
        return
      }
      setStatus("available")
      setStatus("downloading")
      await update.downloadAndInstall()
      setStatus("restarting")
      await relaunch()
    } catch {
      setStatus("error")
    }
  }, [])

  const dismiss = useCallback(() => setStatus("idle"), [])

  return { status, checkForUpdates, dismiss }
}
