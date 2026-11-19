import { expect, test } from "@playwright/test";
import { login, today, future } from "./helpers";
test("F: placement date/hour/affiliation guards and capacity are enforced before persistence", async ({
  page,
}) => {
  await login(page);
  await page.goto("/dashboard/placements/create?application=app-002");
  await page.getByLabel("Start date").fill(future(3));
  await page.getByLabel("End date").fill(today());
  await page
    .getByRole("spinbutton", { name: "Required hours *", exact: true })
    .fill("8");
  await page.getByLabel("Faculty adviser").selectOption("fac-1");
  await page.getByLabel("Company supervisor").selectOption("supervisor-1");
  await page.getByLabel("I reviewed the displayed", { exact: false }).check();
  await page.getByRole("button", { name: "Review and Save Placement" }).click();
  await expect(page.locator(".error-message")).toContainText("End date");
  await page.getByLabel("Start date").fill(today());
  await page.getByLabel("End date").fill(future(30));
  await page
    .getByRole("spinbutton", { name: "Required hours *", exact: true })
    .fill("-5");
  await page.getByRole("button", { name: "Review and Save Placement" }).click();
  expect(
    await page
      .getByRole("spinbutton", { name: "Required hours *", exact: true })
      .evaluate((el) => (el as HTMLInputElement).validity.valid),
  ).toBe(false);
  await page
    .getByRole("spinbutton", { name: "Required hours *", exact: true })
    .fill("8");
  await page.getByLabel("Company supervisor").evaluate((el) => {
    (el as HTMLSelectElement).add(
      new Option("Unrelated synthetic supervisor", "supervisor-2"),
    );
  });
  await page.getByLabel("Company supervisor").selectOption("supervisor-2");
  await page.getByRole("button", { name: "Review and Save Placement" }).click();
  await expect(page.locator(".error-message")).toContainText("belongs");
  await page.getByLabel("Company supervisor").selectOption("supervisor-1");
  await page.getByRole("button", { name: "Review and Save Placement" }).click();
  await expect(
    page.getByRole("heading", { name: "Required evaluations", exact: true }),
  ).toBeVisible();
  await page.goto("/dashboard/internships/opp-1");
  await expect(
    page.locator("dl > div").filter({ hasText: "Remaining slots" }),
  ).toContainText("0");
  await page.goto("/dashboard/applications/create?opportunity=opp-1");
  await expect(
    page.getByLabel("Opportunity").locator('option[value="opp-1"]'),
  ).toHaveCount(0);
});
test("E: acceptance blocks missing approvals; requirement rejection and application reason guards", async ({
  page,
}) => {
  await login(page);
  await page.goto("/dashboard/applications/app-001");
  await page
    .getByRole("button", { name: "Accept Application", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Confirm", exact: true })
    .click();
  await expect(page.locator(".inline-error")).toContainText("mandatory");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Close dialog" })
    .click();
  await expect(page.getByTestId("application-status")).toHaveText("Pending");
  await page.getByLabel("I confirm rejection", { exact: false }).check();
  await page.getByRole("button", { name: "Confirm Rejection" }).click();
  expect(
    await page
      .getByLabel("Rejection reason")
      .evaluate((el) => (el as HTMLTextAreaElement).validity.valid),
  ).toBe(false);
  await page.goto("/dashboard/requirements/submissions/sub-2024-0005-req-1");
  await page
    .getByRole("button", { name: "Reject submission", exact: true })
    .click();
  expect(
    await page
      .getByLabel("Rejection reason")
      .evaluate((el) => (el as HTMLTextAreaElement).validity.valid),
  ).toBe(false);
  await page
    .getByLabel("Rejection reason")
    .fill("Synthetic validation rejection");
  await page
    .getByRole("button", { name: "Reject submission", exact: true })
    .click();
  await page.reload();
  await expect(page.locator("dl")).toContainText(
    "Synthetic validation rejection",
  );
});
