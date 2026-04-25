import { create } from "zustand"
import type { Provider } from "@/types"

export type NavSelection =
  | { type: "all" }
  | { type: "category"; provider: Provider }
  | { type: "flux"; fluxId: string; provider: Provider }
  | { type: "documentation" }
  | { type: "doc"; docId: number }
  | { type: "doc-history"; docId: number }
  | { type: "doc-diff"; docId: number; versionId: number }

interface NavigationState {
  selection: NavSelection
  setSelection: (s: NavSelection) => void
}

export const useNavigationStore = create<NavigationState>()((set) => ({
  selection: { type: "all" },
  setSelection: (selection) => set({ selection }),
}))
