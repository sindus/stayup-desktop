import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { ThemeProvider, useTheme } from "@/context/ThemeContext"

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove("dark")
})

describe("ThemeProvider", () => {
  it("defaults to light when no stored preference and system is light", () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider })
    expect(result.current.theme).toBe("light")
    expect(document.documentElement.classList.contains("dark")).toBe(false)
  })

  it("restores a stored 'dark' preference from localStorage", () => {
    localStorage.setItem("theme", "dark")
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider })
    expect(result.current.theme).toBe("dark")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  it("restores a stored 'light' preference from localStorage", () => {
    localStorage.setItem("theme", "light")
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider })
    expect(result.current.theme).toBe("light")
  })

  it("toggles from light to dark", () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider })
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe("dark")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  it("toggles from dark back to light", () => {
    localStorage.setItem("theme", "dark")
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider })
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe("light")
    expect(document.documentElement.classList.contains("dark")).toBe(false)
  })

  it("persists the chosen theme in localStorage", () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider })
    act(() => result.current.toggleTheme())
    expect(localStorage.getItem("theme")).toBe("dark")
    act(() => result.current.toggleTheme())
    expect(localStorage.getItem("theme")).toBe("light")
  })

  it("throws when used outside of ThemeProvider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within ThemeProvider",
    )
  })
})
