import { describe, it, expect } from "vitest"
import { decodeToken, isTokenExpired } from "@/lib/session"

function makeJwt(payload: Record<string, unknown>): string {
  const encoded = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
  return `eyJhbGciOiJIUzI1NiJ9.${encoded}.signature`
}

describe("decodeToken", () => {
  it("extracts all fields from a valid token", () => {
    const token = makeJwt({ sub: "u42", name: "Alice", email: "alice@test.com", role: "admin" })
    expect(decodeToken(token)).toEqual({
      userId: "u42",
      name: "Alice",
      email: "alice@test.com",
      role: "admin",
    })
  })

  it("uses default values when fields are absent", () => {
    const token = makeJwt({})
    const session = decodeToken(token)
    expect(session.userId).toBe("")
    expect(session.name).toBe("")
    expect(session.email).toBe("")
    expect(session.role).toBe("user")
  })

  it("defaults role to 'user' when field is missing", () => {
    const token = makeJwt({ sub: "u1", name: "Bob", email: "b@b.com" })
    expect(decodeToken(token).role).toBe("user")
  })
})

describe("isTokenExpired", () => {
  it("returns false for a token expiring in the future", () => {
    const token = makeJwt({ exp: Math.floor(Date.now() / 1000) + 3600 })
    expect(isTokenExpired(token)).toBe(false)
  })

  it("returns true for an already-expired token", () => {
    const token = makeJwt({ exp: Math.floor(Date.now() / 1000) - 1 })
    expect(isTokenExpired(token)).toBe(true)
  })

  it("returns true when exp field is absent", () => {
    const token = makeJwt({ sub: "u1" })
    expect(isTokenExpired(token)).toBe(true)
  })

  it("returns true for a malformed token", () => {
    expect(isTokenExpired("not.valid.jwt")).toBe(true)
    expect(isTokenExpired("bad")).toBe(true)
  })
})
