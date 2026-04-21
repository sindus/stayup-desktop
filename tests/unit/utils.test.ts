import { describe, it, expect } from "vitest"
import { cn, formatDate, extractIdentifier } from "@/lib/utils"

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-2")).toBe("px-2 py-2")
  })

  it("deduplicates conflicting tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })

  it("ignores falsy values", () => {
    expect(cn("px-2", false && "py-2", null, undefined)).toBe("px-2")
  })

  it("handles conditional classes via objects", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active")
  })
})

describe("formatDate", () => {
  it("returns empty string for null", () => {
    expect(formatDate(null)).toBe("")
  })

  it("returns empty string for undefined", () => {
    expect(formatDate(undefined)).toBe("")
  })

  it("formats a valid ISO date using the French locale", () => {
    const result = formatDate("2024-06-15T14:30:00Z")
    expect(result).toMatch(/2024/)
    expect(result).toMatch(/juin|15/)
  })
})

describe("extractIdentifier", () => {
  it("extracts owner/repo from a changelog GitHub URL", () => {
    expect(extractIdentifier("https://github.com/facebook/react", "changelog")).toBe(
      "facebook/react",
    )
  })

  it("extracts the channel path from a YouTube URL", () => {
    expect(extractIdentifier("https://www.youtube.com/@fireship", "youtube")).toBe("@fireship")
  })

  it("extracts hostname + path from an RSS URL", () => {
    expect(extractIdentifier("https://blog.example.com/feed.xml", "rss")).toBe(
      "blog.example.com/feed.xml",
    )
  })

  it("extracts only the hostname from a scrap URL", () => {
    expect(extractIdentifier("https://news.ycombinator.com/newest", "scrap")).toBe(
      "news.ycombinator.com",
    )
  })

  it("returns the original string when the URL is invalid", () => {
    expect(extractIdentifier("not-a-url", "changelog")).toBe("not-a-url")
  })

  it("handles deeply nested changelog paths and only takes the first two segments", () => {
    expect(extractIdentifier("https://github.com/vercel/next.js/releases", "changelog")).toBe(
      "vercel/next.js",
    )
  })
})
