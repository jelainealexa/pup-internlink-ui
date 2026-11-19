import { expect, test } from "@playwright/test";
import { login } from "./helpers";
import { fillStudent, logout } from "./helpers";
test("every dashboard summary opens the matching filtered records", async ({
  page,
}) => {
  await login(page);
  const cards = await page
    .locator(".metric-links a")
    .evaluateAll((links) =>
      links.map((link) => ({
        href: link.getAttribute("href")!,
        count: Number(link.querySelector("strong")!.textContent),
      })),
    );
  expect(cards).toHaveLength(14);
  for (const card of cards) {
    await page.goto(card.href);
    await expect(page.locator("tbody tr")).toHaveCount(card.count);
  }
  await page.goto("/dashboard/progress");
  await page.getByRole("link", { name: /Near completion/ }).click();
  await expect(page.getByLabel("Completion focus")).toHaveValue("true");
  await expect(page.getByText("No records match these filters.")).toBeVisible();
});
test("dashboard document alerts exclude superseded rejected attempts while retaining history", async ({
  page,
}) => {
  await login(page, "student5@example.test");
  await page.goto(
    "/dashboard/requirements/submissions/create?requirement=req-2",
  );
  await page
    .getByLabel("Document *", { exact: true })
    .setInputFiles({
      name: "resubmitted-synthetic.txt",
      mimeType: "text/plain",
      buffer: Buffer.from(
        "Synthetic resubmission for latest-attempt filter regression",
      ),
    });
  await page
    .getByRole("button", { name: "Store and submit document", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Enrollment Clearance", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".content-header")).toContainText("Attempt 2");
  await logout(page);
  await login(page);
  const rejected = page.getByRole("link", { name: /Rejected submissions/ });
  await expect(rejected.locator("strong")).toHaveText("0");
  await rejected.click();
  await expect(page.getByLabel("Submission attempts")).toHaveValue("latest");
  await expect(page.getByText("No records match these filters.")).toBeVisible();
  await page.getByLabel("Submission attempts").selectOption("");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Rejected");
});
test("shared browser tabs refresh after a persisted mutation", async ({
  page,
  context,
}) => {
  await login(page);
  const other = await context.newPage();
  await other.goto("/dashboard/students");
  await expect(other.locator("tbody tr")).toHaveCount(6);
  await page.goto("/dashboard/students/create");
  await fillStudent(page, "SYN-TAB-001", "tabs@example.test", "Tab");
  await page.getByRole("button", { name: "Save Student", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Tab Synthetic", exact: true }),
  ).toBeVisible();
  await expect(other.locator("tbody tr")).toHaveCount(7);
  await other.close();
});
test("academic year and default landing preferences have observable effects", async ({
  page,
}) => {
  await login(page);
  await page.goto("/dashboard/settings");
  await page
    .getByLabel("Default landing page")
    .selectOption("/dashboard/students");
  await page.getByLabel("Academic year preference").selectOption("2025-2026");
  await page.getByRole("button", { name: "Save Preferences" }).click();
  await expect(page.getByRole("status")).toContainText("Preferences saved");
  await logout(page);
  await login(page);
  await expect(page).toHaveURL(/\/dashboard\/students$/);
  await expect(page.getByText("No records match these filters.")).toBeVisible();
  await page.goto("/dashboard/settings");
  await page.getByLabel("Academic year preference").selectOption("2026-2027");
  await page.getByRole("button", { name: "Save Preferences" }).click();
  await page.goto("/dashboard/students");
  await expect(page.locator("tbody tr")).toHaveCount(6);
});
test("company, supervisor, opportunity and requirement edits persist and propagate", async ({
  page,
}) => {
  await login(page);
  await page.goto("/dashboard/partners/company-1/edit");
  await page.getByLabel("Company name").fill("Updated Synthetic Labs");
  await page.getByRole("button", { name: "Save Partner" }).click();
  await expect(
    page.getByRole("heading", { name: "Updated Synthetic Labs", exact: true }),
  ).toBeVisible();
  await page.goto("/dashboard/internships/opp-1");
  await expect(page.locator("#main-content")).toContainText(
    "Updated Synthetic Labs",
  );
  await page.goto(
    "/dashboard/partners/company-1/supervisors/supervisor-1/edit",
  );
  await page.getByLabel("Supervisor name").fill("Updated Demo Supervisor");
  await page.getByRole("button", { name: "Save supervisor" }).click();
  await expect(
    page.getByRole("heading", { name: "Updated Demo Supervisor", exact: true }),
  ).toBeVisible();
  await page.goto("/dashboard/placements/PL-001");
  await expect(page.locator("dl")).toContainText("Updated Demo Supervisor");
  await page.goto("/dashboard/internships/opp-1/edit");
  await page.getByLabel("Position title").fill("Updated Synthetic Opportunity");
  await page.getByRole("button", { name: "Save Opportunity" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Updated Synthetic Opportunity",
      exact: true,
    }),
  ).toBeVisible();
  await page.goto("/dashboard/applications/app-002");
  await expect(page.locator("#main-content")).toContainText(
    "Updated Synthetic Opportunity",
  );
  await page.goto("/dashboard/requirements/req-1/edit");
  await page
    .getByLabel("Description *", { exact: true })
    .fill("Updated synthetic requirement instructions.");
  await page.getByRole("button", { name: "Save Requirement" }).click();
  await expect(page.locator("tbody")).toContainText(
    "Updated synthetic requirement instructions.",
  );
  await page.reload();
  await expect(page.locator("tbody")).toContainText(
    "Updated synthetic requirement instructions.",
  );
  await page.goto("/dashboard/requirements/submissions/sub-2024-0001-req-1");
  const download = page.waitForEvent("download");
  await page
    .getByRole("link", { name: "Download resume-demo.txt", exact: true })
    .click();
  const file = await download;
  const stream = await file.createReadStream();
  const chunks = [];
  for await (const chunk of stream!) chunks.push(chunk);
  expect(Buffer.concat(chunks).toString("utf8")).toContain("Synthetic Resume");
});
test("directory controls, URL back/forward and filtered dashboard destinations", async ({
  page,
}) => {
  await login(page);
  await page.goto("/dashboard/students");
  await page
    .getByLabel("Program", { exact: true })
    .selectOption("BS Information Technology");
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.getByLabel("Year level", { exact: true }).selectOption("3rd Year");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.getByLabel("Sort by", { exact: true }).selectOption("hours");
  await expect(page.locator("tbody tr").first()).toContainText("Theo Sample");
  await page.goto("/dashboard/partners?status=Expiring%20Soon");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Riverstone Studio");
  await page.goto("/dashboard");
  await page.getByRole("link", { name: /Pending applications/ }).click();
  await expect(page.getByLabel("Status", { exact: true })).toHaveValue(
    "Pending",
  );
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Coordinator overview" }),
  ).toBeVisible();
  await page.goForward();
  await expect(page.getByLabel("Status", { exact: true })).toHaveValue(
    "Pending",
  );
});
