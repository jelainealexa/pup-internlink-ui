import { expect, test } from "@playwright/test";
import { login, logout, password } from "./helpers";
test("A: invalid/inactive credentials, direct URL guard, role restriction and logout", async ({
  page,
}) => {
  await page.goto("/dashboard/students");
  await expect(page).toHaveURL(/\/?next=/);
  await page.getByLabel("Email address").fill("coordinator@example.test");
  await page.getByLabel("Password", { exact: false }).fill("wrong");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator(".error-message[role=alert]")).toContainText(
    "Invalid demonstration",
  );
  await page.getByLabel("Email address").fill("student6@example.test");
  await page.getByLabel("Password", { exact: false }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator(".error-message[role=alert]")).toContainText(
    "inactive",
  );
  await login(page, "student@example.test");
  await page.goto("/dashboard/reports");
  await expect(
    page.getByRole("heading", { name: "Access denied" }),
  ).toBeVisible();
  await page.goto("/dashboard/students/2024-0002");
  await expect(
    page.getByRole("heading", { name: "Record not found" }),
  ).toBeVisible();
  await logout(page);
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Demonstration sign in" }),
  ).toBeVisible();
});
test("supervisor and adviser portals restrict unrelated records", async ({
  page,
}) => {
  await login(page, "supervisor@example.test");
  await page.goto("/dashboard/placements/PL-003");
  await expect(
    page.getByRole("heading", { name: "Record not found" }),
  ).toBeVisible();
  await page.goto("/dashboard/evaluations/eval-PL-001-faculty-1");
  await expect(
    page.getByRole("button", { name: "Submit Evaluation" }),
  ).toHaveCount(0);
  await logout(page);
  await login(page, "faculty2@example.test");
  await page.goto("/dashboard/students/2024-0001");
  await expect(
    page.getByRole("heading", { name: "Record not found" }),
  ).toBeVisible();
});
