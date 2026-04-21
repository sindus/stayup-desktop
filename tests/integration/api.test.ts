import { describe, it, expect, vi, beforeEach } from "vitest"
import { loginWithPassword, getUserFeed } from "@/lib/api"

const API_URL = "https://api.example.com"
const TOKEN = "test-token"

beforeEach(() => {
  vi.restoreAllMocks()
})

describe("loginWithPassword", () => {
  it("returns the token string on successful login", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ token: "jwt-abc-123" }),
      }),
    )
    const token = await loginWithPassword("user@test.com", "pass123", API_URL)
    expect(token).toBe("jwt-abc-123")
  })

  it("throws 'Identifiants invalides.' on 401", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401 }))
    await expect(loginWithPassword("bad@test.com", "wrong", API_URL)).rejects.toThrow(
      "Identifiants invalides.",
    )
  })

  it("throws 'Erreur serveur' on 5xx", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    await expect(loginWithPassword("u@test.com", "pass", API_URL)).rejects.toThrow(
      "Erreur serveur, réessayez.",
    )
  })

  it("strips trailing slash from apiUrl before calling the endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "t" }),
    })
    vi.stubGlobal("fetch", fetchMock)
    await loginWithPassword("u@test.com", "pass", "https://api.example.com/")
    expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/auth/login", expect.anything())
  })
})

describe("getUserFeed", () => {
  it("fetches feed data and includes the bearer token", async () => {
    const mockData = {
      repositories: [],
      connectors: { changelog: [], youtube: [], rss: [], scrap: [] },
    }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => mockData })
    vi.stubGlobal("fetch", fetchMock)

    const data = await getUserFeed("user-1", TOKEN, API_URL)
    expect(data).toEqual(mockData)
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/ui/users/user-1/feed`,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: `Bearer ${TOKEN}` }),
      }),
    )
  })

  it("retries once on a 5xx error and succeeds", async () => {
    const mockData = {
      repositories: [],
      connectors: { changelog: [], youtube: [], rss: [], scrap: [] },
    }
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({ ok: true, json: async () => mockData })
    vi.stubGlobal("fetch", fetchMock)

    await getUserFeed("user-1", TOKEN, API_URL)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("throws after the second 5xx (no more retries)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    await expect(getUserFeed("user-1", TOKEN, API_URL)).rejects.toThrow("StayUp API error 500")
  })

  it("retries once on a network TypeError", async () => {
    const mockData = {
      repositories: [],
      connectors: { changelog: [], youtube: [], rss: [], scrap: [] },
    }
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Network error"))
      .mockResolvedValueOnce({ ok: true, json: async () => mockData })
    vi.stubGlobal("fetch", fetchMock)

    await getUserFeed("user-1", TOKEN, API_URL)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
