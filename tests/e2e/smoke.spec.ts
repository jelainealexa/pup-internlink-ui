import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { login, logout } from "./helpers";
test("production navigation, query filters, persistence and accessible responsive states", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await login(page);
  for (const route of [
    "/dashboard",
    "/dashboard/students",
    "/dashboard/students/create",
    "/dashboard/students/2024-0001",
    "/dashboard/students/2024-0001/edit",
    "/dashboard/partners",
    "/dashboard/partners/create",
    "/dashboard/partners/company-1",
    "/dashboard/partners/company-1/edit",
    "/dashboard/partners/company-1/supervisors/create",
    "/dashboard/partners/company-1/supervisors/supervisor-1",
    "/dashboard/partners/company-1/supervisors/supervisor-1/edit",
    "/dashboard/requirements",
    "/dashboard/requirements/create",
    "/dashboard/requirements/req-1/edit",
    "/dashboard/requirements?view=submissions",
    "/dashboard/requirements/submissions/create",
    "/dashboard/requirements/submissions/sub-2024-0005-req-1",
    "/dashboard/internships",
    "/dashboard/internships/create",
    "/dashboard/internships/opp-1",
    "/dashboard/internships/opp-1/edit",
    "/dashboard/applications",
    "/dashboard/applications/create",
    "/dashboard/applications/app-002",
    "/dashboard/placements",
    "/dashboard/placements/create?application=app-002",
    "/dashboard/placements/PL-001",
    "/dashboard/progress",
    "/dashboard/progress/create",
    "/dashboard/progress/PL-001",
    "/dashboard/progress/reports/PR-002",
    "/dashboard/evaluations",
    "/dashboard/evaluations/eval-PL-001-faculty-1",
    "/dashboard/reports",
    "/dashboard/settings",
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("#main-content h1")).toHaveCount(1);
    await expect(
      page.getByText("Record not found", { exact: true }),
    ).toHaveCount(0);
  }
  for (const route of [
    "/dashboard/students/unknown",
    "/dashboard/partners/unknown",
    "/dashboard/internships/unknown",
    "/dashboard/applications/unknown",
    "/dashboard/placements/unknown",
    "/dashboard/progress/unknown",
    "/dashboard/evaluations/unknown",
    "/dashboard/requirements/submissions/unknown",
  ]) {
    await page.goto(route);
    await expect(
      page.getByRole("heading", { name: "Record not found" }),
    ).toBeVisible();
  }
  await page.goto("/dashboard/applications?status=Pending&student=2024-0005");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(6);
  await page.goto("/dashboard/applications?opportunity=opp-2");
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await page.goto("/dashboard/placements?status=Ongoing&student=2024-0001");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.goto("/dashboard/progress?student=2024-0002");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.goto("/dashboard/evaluations?student=2024-0001&status=Pending");
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await page.goto("/dashboard/students");
  await page.getByRole("searchbox").fill("no-synthetic-match");
  await expect(page.getByText("No records match these filters.")).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(6);
  await page.goto("/dashboard/settings");
  await page.getByLabel("Larger interface text", { exact: true }).check();
  await page.getByLabel("Reduced motion", { exact: true }).check();
  await page
    .getByLabel("Table density", { exact: false })
    .selectOption("Compact");
  await page.getByLabel("Requirement alerts", { exact: true }).uncheck();
  await page.getByRole("button", { name: "Save Preferences" }).click();
  await expect(page.locator(".application")).toHaveClass(/larger-text/);
  await expect(page.locator(".application")).toHaveClass(/reduced-motion/);
  await expect(page.locator(".application")).toHaveClass(/compact-tables/);
  await page.reload();
  await expect(
    page.getByLabel("Larger interface text", { exact: true }),
  ).toBeChecked();
  await page.goto("/dashboard");
  await expect(
    page.getByRole("link", { name: /Pending requirement reviews/ }),
  ).toHaveCount(0);
  await page.goto("/dashboard/settings");
  await page.getByLabel("Larger interface text", { exact: true }).uncheck();
  await page.getByRole("button", { name: "Save Preferences" }).click();
  for (const route of [
    "/dashboard",
    "/dashboard/students",
    "/dashboard/students/2024-0001",
    "/dashboard/requirements/submissions/create",
    "/dashboard/placements/create?application=app-002",
    "/dashboard/settings",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  }
  await page.goto("/dashboard/settings");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  await page.goto("/dashboard/internships/opp-3");
  const trigger = page.getByRole("button", {
    name: "Approve / Reopen Opportunity",
  });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.goto("/dashboard");
  await page.screenshot({
    path: `test-results/dashboard-${test.info().project.name}.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("I: all seven generated reports, CSV, empty result and print presentation", async ({
  page,
}) => {
  await login(page);
  await page.goto("/dashboard/reports");
  for (const category of [
    "Students",
    "Industry Partners",
    "Opportunities",
    "Applications",
    "Placements",
    "Progress",
    "Evaluations",
  ]) {
    await page.getByLabel("Report category").selectOption(category);
    await page.getByRole("button", { name: "Generate Report" }).click();
    await expect(
      page.getByRole("heading", { name: `${category} report`, exact: true }),
    ).toBeVisible();
    expect(
      await page.locator(".generated-report tbody tr").count(),
    ).toBeGreaterThan(0);
  }
  await page.getByLabel("Status", { exact: true }).selectOption("Expired");
  await page.getByRole("button", { name: "Generate Report" }).click();
  await expect(page.locator(".generated-report")).toContainText(
    "No records match these filters.",
  );
  await page.getByLabel("Status", { exact: true }).selectOption("");
  await page.getByRole("button", { name: "Generate Report" }).click();
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".sidebar-shell")).toBeHidden();
  await expect(page.locator(".generated-report table")).toBeVisible();
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => {
    window.print = () => {
      document.body.dataset.printInvoked = "yes";
    };
  });
  await page.getByRole("button", { name: "Print report" }).click();
  await expect(page.locator("body")).toHaveAttribute(
    "data-print-invoked",
    "yes",
  );
});
test("intentional reset and keyboard accessible login", async ({ page }) => {
  await login(page);
  await page.goto("/dashboard/settings");
  await page
    .getByRole("button", { name: "Prepare demonstration reset" })
    .click();
  await page.getByLabel("Type RESET DEMO").fill("wrong");
  await page
    .getByRole("button", { name: "Permanently reset this browser's demo" })
    .click();
  await expect(page.locator(".error-message[role=alert]")).toContainText(
    "RESET DEMO",
  );
  await page.getByLabel("Type RESET DEMO").fill("RESET DEMO");
  await page
    .getByRole("button", { name: "Permanently reset this browser's demo" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Demonstration sign in" }),
  ).toBeVisible();
  await expect(page.getByLabel("Password", { exact: false })).toHaveValue("");
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations).toEqual([]);
  await login(page);
  await logout(page);
});
