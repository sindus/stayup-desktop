import { describe, it, expect, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { ThemeProvider } from "@/context/ThemeContext"

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove("dark")
})

describe("ThemeToggle", () => {
  it("renders the toggle button", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )
    expect(screen.getByRole("button", { name: "Basculer le thème" })).toBeInTheDocument()
  })

  it("applies dark class to the document when toggled to dark", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )
    fireEvent.click(screen.getByRole("button", { name: "Basculer le thème" }))
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  it("removes dark class when toggled back to light", () => {
    localStorage.setItem("theme", "dark")
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )
    fireEvent.click(screen.getByRole("button", { name: "Basculer le thème" }))
    expect(document.documentElement.classList.contains("dark")).toBe(false)
  })
})
