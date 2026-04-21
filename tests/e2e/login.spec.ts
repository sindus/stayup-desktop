import { test, expect } from "@playwright/test"
import { TAURI_MOCK_SCRIPT } from "./fixtures/tauri-mock"

test.beforeEach(async ({ page }) => {
  await page.addInitScript(TAURI_MOCK_SCRIPT)
})

test("shows the login modal on first launch", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "StayUp" })).toBeVisible()
  await expect(page.getByText("Connectez-vous pour accéder à vos flux")).toBeVisible()
})

test("renders email and password fields in the login form", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByLabel("Email")).toBeVisible()
  await expect(page.getByLabel("Mot de passe")).toBeVisible()
  await expect(page.getByRole("button", { name: "Se connecter" })).toBeVisible()
})

test("shows validation errors when submitting an empty form", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: "Se connecter" }).click()
  await expect(
    page.getByText("Email invalide").or(page.getByText("Mot de passe requis")),
  ).toBeVisible()
})

test("shows an error for an invalid email format", async ({ page }) => {
  await page.goto("/")
  await page.getByLabel("Email").fill("not-an-email")
  await page.getByLabel("Mot de passe").fill("pass")
  await page.getByRole("button", { name: "Se connecter" }).click()
  await expect(page.getByText("Email invalide")).toBeVisible()
})
