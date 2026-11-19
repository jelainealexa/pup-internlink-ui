import { expect, Page } from "@playwright/test";
export const password = "InternLink!2026";
export async function login(page: Page, email = "coordinator@example.test") {
  await page.goto("/");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: false }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Log out", exact: true }),
  ).toBeVisible();
}
export async function logout(page: Page) {
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Demonstration sign in" }),
  ).toBeVisible();
}
export async function fillStudent(
  page: Page,
  id: string,
  email: string,
  firstName = "Flow",
) {
  await page.getByLabel("Student ID", { exact: false }).fill(id);
  await page.getByLabel("Email *", { exact: true }).fill(email);
  await page.getByLabel("First name").fill(firstName);
  await page.getByLabel("Last name").fill("Synthetic");
  await page
    .getByLabel("Program *", { exact: true })
    .selectOption("BS Computer Science");
  await page
    .getByLabel("Year level *", { exact: true })
    .selectOption("4th Year");
  await page.getByLabel("Section *", { exact: true }).fill("4-9");
}
export async function confirmDialog(page: Page) {
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(dialog).not.toBeVisible();
}
export const today = () => new Date().toISOString().slice(0, 10);
export const future = (days: number) =>
  new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
