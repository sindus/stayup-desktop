import { test, expect } from "@playwright/test"
import { TAURI_MOCK_SCRIPT } from "./fixtures/tauri-mock"

test.beforeEach(async ({ page }) => {
  await page.addInitScript(TAURI_MOCK_SCRIPT)
})

test("theme toggle button is visible on the login screen", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("button", { name: "Basculer le thème" })).toBeVisible()
})

test("clicking the theme toggle adds the dark class to the html element", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: "Basculer le thème" }).click()
  const htmlClass = await page.locator("html").getAttribute("class")
  expect(htmlClass).toContain("dark")
})

test("clicking the theme toggle twice restores the light theme", async ({ page }) => {
  await page.goto("/")
  const toggle = page.getByRole("button", { name: "Basculer le thème" })
  await toggle.click()
  await toggle.click()
  const htmlClass = await page.locator("html").getAttribute("class")
  expect(htmlClass ?? "").not.toContain("dark")
})
