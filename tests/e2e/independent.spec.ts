import { test, expect } from "@playwright/test";
const password = "InternLink!2026";
async function enter(
  page: import("@playwright/test").Page,
  email = "coordinator@example.test",
) {
  await page.goto("/");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: false }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Log out", exact: true }),
  ).toBeVisible();
}
test("IV-10: a stale edit must not overwrite another tab's persisted student changes", async ({
  page,
  context,
}) => {
  await enter(page);
  const peer = await context.newPage();
  await page.goto("/dashboard/students/2024-0001/edit");
  await peer.goto("/dashboard/students/2024-0001/edit");
  await expect(peer.getByLabel("Email *", { exact: true })).toHaveValue(
    "student@example.test",
  );
  await peer.getByLabel("Last name").fill("Peer Synthetic");
  await page
    .getByLabel("Email *", { exact: true })
    .fill("audit-preserved@example.test");
  await page.getByRole("button", { name: "Save Changes", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Mira Demo", exact: true }),
  ).toBeVisible();
  const observer = await context.newPage();
  await observer.goto("/dashboard/students/2024-0001");
  await expect(observer.locator("dl")).toContainText(
    "audit-preserved@example.test",
  );
  await peer.bringToFront();
  await expect(peer.getByLabel("Email *", { exact: true })).toHaveValue(
    "student@example.test",
  );
  await peer.getByRole("button", { name: "Save Changes", exact: true }).click();
  await expect(peer.locator(".functional-form [role=alert]")).toContainText(
    /changed/i,
  );
  await expect(peer.getByLabel("Last name")).toHaveValue("Peer Synthetic");
  await observer.reload();
  await expect(observer.locator("dl")).toContainText(
    "audit-preserved@example.test",
  );
  await peer.close();
  await observer.close();
});
test("IV-11: unauthenticated contextual placement URL survives sign in", async ({
  page,
}) => {
  await page.goto("/dashboard/placements/create?application=app-002");
  await expect(
    page.getByRole("heading", { name: "Demonstration sign in" }),
  ).toBeVisible();
  await page.getByLabel("Email address").fill("coordinator@example.test");
  await page.getByLabel("Password", { exact: false }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Create placement", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Application ID", { exact: false })).toHaveValue(
    "app-002",
  );
});
test("IV-03: direct navigation does not reveal another draft posting to a student", async ({
  page,
}) => {
  await enter(page, "student@example.test");
  await page.goto("/dashboard/internships/opp-3");
  await expect(
    page.getByRole("heading", { name: "Record not found", exact: true }),
  ).toBeVisible();
  await page.goto("/dashboard/internships/opp-1");
  await expect(
    page.getByRole("heading", {
      name: "Software Development Intern",
      exact: true,
    }),
  ).toBeVisible();
});
