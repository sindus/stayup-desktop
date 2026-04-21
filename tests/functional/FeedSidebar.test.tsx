import { describe, it, expect, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { FeedSidebar } from "@/components/feed/FeedSidebar"
import { LanguageProvider } from "@/context/LanguageContext"
import { useNavigationStore } from "@/store/navigation"
import type { FeedFlux } from "@/hooks/useFeed"

function renderWithLang(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>)
}

const fluxes: FeedFlux[] = [
  {
    id: "1",
    repository_id: 1,
    provider: "changelog",
    url: "https://github.com/facebook/react",
    identifier: "facebook/react",
  },
  {
    id: "2",
    repository_id: 2,
    provider: "youtube",
    url: "https://youtube.com/@fireship",
    identifier: "@fireship",
  },
  {
    id: "3",
    repository_id: 3,
    provider: "youtube",
    url: "https://youtube.com/@theo",
    identifier: "@theo",
  },
]

beforeEach(() => {
  useNavigationStore.setState({ selection: { type: "all" } })
})

describe("FeedSidebar", () => {
  it("renders the 'Tous les flux' button", () => {
    renderWithLang(<FeedSidebar fluxes={fluxes} />)
    expect(screen.getByText("Tous les flux")).toBeInTheDocument()
  })

  it("renders one entry per provider group", () => {
    renderWithLang(<FeedSidebar fluxes={fluxes} />)
    expect(screen.getByText("GitHub Changelog")).toBeInTheDocument()
    expect(screen.getByText("YouTube")).toBeInTheDocument()
  })

  it("shows flux identifiers when a category is expanded (default)", () => {
    renderWithLang(<FeedSidebar fluxes={fluxes} />)
    expect(screen.getByText("facebook/react")).toBeInTheDocument()
    expect(screen.getByText("@fireship")).toBeInTheDocument()
    expect(screen.getByText("@theo")).toBeInTheDocument()
  })

  it("collapses a category when its chevron is clicked", () => {
    renderWithLang(<FeedSidebar fluxes={fluxes} />)

    const buttons = screen.getAllByRole("button")
    const chevronButtons = buttons.filter((b) => b.textContent?.trim() === "")
    // chevronButtons[0] = changelog, chevronButtons[1] = youtube
    fireEvent.click(chevronButtons[1])

    expect(screen.queryByText("@fireship")).not.toBeInTheDocument()
    expect(screen.queryByText("@theo")).not.toBeInTheDocument()
    expect(screen.getByText("facebook/react")).toBeInTheDocument()
  })

  it("dispatches 'all' selection on 'Tous les flux' click", () => {
    useNavigationStore.setState({ selection: { type: "category", provider: "youtube" } })
    renderWithLang(<FeedSidebar fluxes={fluxes} />)
    fireEvent.click(screen.getByText("Tous les flux"))
    expect(useNavigationStore.getState().selection).toEqual({ type: "all" })
  })

  it("dispatches a category selection when clicking a provider label", () => {
    renderWithLang(<FeedSidebar fluxes={fluxes} />)
    fireEvent.click(screen.getByText("YouTube"))
    expect(useNavigationStore.getState().selection).toEqual({
      type: "category",
      provider: "youtube",
    })
  })

  it("dispatches a flux selection when clicking a specific flux", () => {
    renderWithLang(<FeedSidebar fluxes={fluxes} />)
    fireEvent.click(screen.getByText("facebook/react"))
    expect(useNavigationStore.getState().selection).toEqual({
      type: "flux",
      fluxId: "1",
      provider: "changelog",
    })
  })

  it("renders an empty sidebar without errors when there are no fluxes", () => {
    renderWithLang(<FeedSidebar fluxes={[]} />)
    expect(screen.getByText("Tous les flux")).toBeInTheDocument()
    expect(screen.queryByText("GitHub Changelog")).not.toBeInTheDocument()
  })
})
