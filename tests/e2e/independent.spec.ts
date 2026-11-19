import { test, expect } from "@playwright/test";
import { prepareEmptyCoordinator, auditLogin } from "./audit-helpers";
const password = "InternLink!2026";
test("invalid edit and nested record identifiers remain explicit not-found states", async ({
  page,
}) => {
  await enter(page);
  for (const route of [
    "/dashboard/students/unknown/edit",
    "/dashboard/partners/unknown/edit",
    "/dashboard/partners/company-1/supervisors/unknown",
    "/dashboard/partners/company-1/supervisors/unknown/edit",
    "/dashboard/partners/company-2/supervisors/supervisor-1",
    "/dashboard/partners/company-2/supervisors/supervisor-1/edit",
    "/dashboard/requirements/unknown/edit",
    "/dashboard/internships/unknown/edit",
    "/dashboard/progress/reports/unknown",
  ]) {
    await page.goto(route);
    await expect(
      page.getByRole("heading", { name: "Record not found", exact: true }),
    ).toBeVisible();
  }
  await page.goto("/dashboard/placements/create?application=unknown");
  await expect(page.getByRole("heading",{name:"Choose an accepted application",exact:true})).toBeVisible();
});
test("accepted unplaced students have an accurate status and no forbidden placement action", async ({
  page,
}) => {
  await enter(page, "student4@example.test");
  await page.goto("/dashboard/applications/app-002");
  await expect(
    page.getByRole("link", { name: "Create Placement", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByTestId("application-status")).toHaveText("Accepted");
});
test("IV-15: empty eligible data has actionable empty states rather than impossible forms", async ({
  page,
}) => {
  await prepareEmptyCoordinator(page);
  await auditLogin(page);
  await page.goto("/dashboard/internships/create");
  await expect(
    page.getByRole("heading", { name: "No registered partners", exact: true }),
  ).toBeVisible();
  await page.goto("/dashboard/applications/create");
  await expect(
    page.getByRole("heading", { name: "No active students", exact: true }),
  ).toBeVisible();
  await page.goto("/dashboard/progress/create");
  await expect(
    page.getByRole("heading", { name: "No ongoing placement", exact: true }),
  ).toBeVisible();
  await page.goto("/dashboard/requirements/submissions/create");
  await expect(
    page.getByRole("heading", {
      name: "No requirements configured",
      exact: true,
    }),
  ).toBeVisible();
});
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
  await page.bringToFront();
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
  await peer
    .getByRole("button", { name: "Reload latest form", exact: true })
    .click();
  await expect(peer.getByLabel("Email *", { exact: true })).toHaveValue(
    "audit-preserved@example.test",
  );
  await peer.getByLabel("Last name").fill("Peer Synthetic");
  await peer.getByRole("button", { name: "Save Changes", exact: true }).click();
  await expect(peer.locator("h1")).toHaveText("Mira Peer Synthetic");
  await observer.reload();
  await expect(observer.locator("dl")).toContainText(
    "audit-preserved@example.test",
  );
  await peer.close();
  await observer.close();
});
test("IV-14: failed confirmed mutation explains the failure inside its active dialog", async ({
  page,
}) => {
  await enter(page);
  await page.goto("/dashboard/placements/PL-001");
  await page
    .getByRole("button", { name: "Confirm completion", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText(
    "Required reviewed hours",
  );
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
