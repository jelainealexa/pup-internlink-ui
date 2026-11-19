import { expect, test } from "@playwright/test";
import {
  confirmDialog,
  fillStudent,
  future,
  login,
  logout,
  today,
} from "./helpers";
test("B–J: entire persisted internship lifecycle through supported UI actions", async ({
  page,
}) => {
  test.setTimeout(240000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await login(page);
  await page.goto("/dashboard/students/create");
  await fillStudent(page, "SYN-E2E-001", "flowstudent@example.test");
  await page.getByRole("button", { name: "Save Student", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Flow Synthetic", exact: true }),
  ).toBeVisible();
  const studentId = page.url().split("/").at(-1)!;
  await page.getByRole("link", { name: "Edit Profile", exact: true }).click();
  await page.getByLabel("First name").fill("Edited");
  await page.getByRole("button", { name: "Save Changes" }).click();
  await expect(
    page.getByRole("heading", { name: "Edited Synthetic", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Edited Synthetic", exact: true }),
  ).toBeVisible();
  await page.goto("/dashboard/students");
  await page.getByRole("searchbox").fill("SYN-E2E-001");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Edited Synthetic");
  await page.goto("/dashboard/students/create");
  await fillStudent(page, "SYN-E2E-001", "another@example.test");
  await page.getByRole("button", { name: "Save Student", exact: true }).click();
  await expect(page.locator(".error-message[role=alert]")).toContainText(
    "identifier already exists",
  );
  await page.goto("/dashboard/partners/create");
  await page.getByLabel("Company name").fill("E2E Synthetic Company");
  await page.getByLabel("Industry *", { exact: true }).fill("Technology");
  await page.getByLabel("Address *", { exact: true }).fill("1 Synthetic Road");
  await page.getByLabel("Contact person").fill("Example Contact");
  await page.getByLabel("Contact email").fill("flowcompany@example.test");
  await page.getByLabel("Contact number").fill("000-000-9876");
  await page.getByLabel("MOA start date").fill(today());
  await page.getByLabel("MOA end date").fill(future(365));
  await page.getByLabel("Partnership approval").selectOption("true");
  await page.getByRole("button", { name: "Save Partner" }).click();
  await expect(
    page.getByRole("heading", { name: "E2E Synthetic Company", exact: true }),
  ).toBeVisible();
  const companyId = page.url().split("/").at(-1)!;
  await page
    .getByRole("link", { name: "Add Company Supervisor", exact: true })
    .click();
  await page.getByLabel("Supervisor name").fill("Flow Supervisor");
  await page
    .getByLabel("Email *", { exact: true })
    .fill("flowsupervisor@example.test");
  await page.getByLabel("Contact number").fill("000-000-9875");
  await page.getByRole("button", { name: "Save supervisor" }).click();
  await expect(
    page.getByRole("heading", { name: "Flow Supervisor", exact: true }),
  ).toBeVisible();
  const supervisorId = page.url().split("/").at(-1)!;
  await page.goto(`/dashboard/internships/create?company=${companyId}`);
  await page.getByLabel("Position title").fill("Lifecycle Developer Intern");
  await page
    .getByLabel("Description *", { exact: true })
    .fill("Synthetic lifecycle work, no real personal data.");
  await page.getByLabel("Total capacity").fill("1");
  await page.getByRole("button", { name: "Save Opportunity" }).click();
  await expect(
    page.getByRole("heading", { name: "Lifecycle Developer Intern" }),
  ).toBeVisible();
  const opportunityId = page.url().split("/").at(-1)!;
  await page
    .getByRole("button", { name: "Approve / Reopen Opportunity" })
    .click();
  await confirmDialog(page);
  await page.goto("/dashboard/requirements/create");
  await page.getByLabel("Requirement name").fill("Lifecycle clearance");
  await page
    .getByLabel("Description *", { exact: true })
    .fill("Synthetic lifecycle clearance document.");
  await page.getByRole("button", { name: "Save Requirement" }).click();
  await expect(
    page.getByRole("heading", { name: "Requirements", exact: true }),
  ).toBeVisible();
  await logout(page);
  await login(page, "flowstudent@example.test");
  for (const requirement of [
    "Resume",
    "Enrollment Clearance",
    "Lifecycle clearance",
  ]) {
    await page.goto("/dashboard/requirements/submissions/create");
    await page.getByLabel("Student *", { exact: true }).selectOption(studentId);
    await page
      .getByLabel("Requirement *", { exact: true })
      .selectOption({ label: `${requirement} (Mandatory)` });
    await page.getByLabel("Document *", { exact: true }).setInputFiles({
      name: `${requirement}.txt`,
      mimeType: "text/plain",
      buffer: Buffer.from(`Synthetic ${requirement} attachment bytes`),
    });
    await page
      .getByRole("button", { name: "Store and submit document" })
      .click();
    await expect(
      page.getByRole("heading", { name: requirement, exact: true }),
    ).toBeVisible();
    await expect(page.locator("pre")).toContainText(`Synthetic ${requirement}`);
  }
  await logout(page);
  await login(page);
  await page.goto(
    `/dashboard/requirements?view=submissions&student=${studentId}`,
  );
  await expect(
    page.getByRole("link", { name: "View submission", exact: true }),
  ).toHaveCount(3);
  const submissionLinks = await page
    .getByRole("link", { name: "View submission", exact: true })
    .evaluateAll((els) => [
      ...new Set(
        els
          .map((e) => e.getAttribute("href")!)
          .filter((h) => h.includes("/submissions/")),
      ),
    ]);
  expect(submissionLinks.length).toBe(3);
  const rejectedHref = submissionLinks[0];
  await page.goto(rejectedHref);
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
    .fill("Synthetic correction required");
  await page
    .getByRole("button", { name: "Reject submission", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Resubmit document", exact: true }),
  ).toBeVisible();
  await logout(page);
  await login(page, "flowstudent@example.test");
  await page.goto(rejectedHref);
  await page
    .getByRole("link", { name: "Resubmit document", exact: true })
    .click();
  await page.getByLabel("Document *", { exact: true }).setInputFiles({
    name: "replacement.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic corrected document"),
  });
  await page.getByRole("button", { name: "Store and submit document" }).click();
  await expect(page.locator("pre")).toContainText(
    "Synthetic corrected document",
  );
  const replacementHref = new URL(page.url()).pathname;
  await logout(page);
  await login(page);
  for (const href of [...submissionLinks.slice(1), replacementHref]) {
    await page.goto(href);
    await page.getByRole("button", { name: "Approve submission" }).click();
    await confirmDialog(page);
    await expect(
      page.getByRole("button", { name: "Approve submission" }),
    ).toHaveCount(0);
  }
  await page.goto(`/dashboard/students/${studentId}`);
  await expect(
    page.getByText("All current mandatory requirements are approved", {
      exact: false,
    }),
  ).toBeVisible();
  await logout(page);
  await login(page, "flowstudent@example.test");
  await page.goto(
    `/dashboard/applications/create?opportunity=${opportunityId}`,
  );
  await page
    .getByRole("button", { name: "Submit Application", exact: true })
    .click();
  await expect(page.getByTestId("application-status")).toHaveText("Pending");
  const applicationId = page.url().split("/").at(-1)!;
  await logout(page);
  await login(page);
  await page.goto(`/dashboard/applications/${applicationId}`);
  await page
    .getByRole("button", { name: "Accept Application", exact: true })
    .click();
  await confirmDialog(page);
  await expect(page.getByTestId("application-status")).toHaveText("Accepted");
  await page.reload();
  await expect(page.getByTestId("application-status")).toHaveText("Accepted");
  await page
    .getByRole("link", { name: "Create Placement", exact: true })
    .click();
  await expect(page.getByLabel("Student name", { exact: false })).toHaveValue(
    "Edited Synthetic",
  );
  await expect(
    page
      .getByLabel("Company supervisor", { exact: false })
      .locator("option")
      .filter({ hasText: "Morgan Demo" }),
  ).toHaveCount(0);
  await page.getByLabel("Start date").fill(today());
  await page.getByLabel("End date").fill(future(30));
  await page
    .getByRole("spinbutton", { name: "Required hours *", exact: true })
    .fill("8");
  await page
    .getByLabel("Faculty adviser", { exact: false })
    .selectOption("fac-1");
  await page
    .getByLabel("Company supervisor", { exact: false })
    .selectOption(supervisorId);
  await page
    .getByLabel("I reviewed the displayed application", { exact: false })
    .check();
  await page.getByRole("button", { name: "Review and Save Placement" }).click();
  await expect(
    page.getByRole("heading", { name: "Required evaluations", exact: true }),
  ).toBeVisible();
  const placementId = page.url().split("/").at(-1)!;
  await page.goto(`/dashboard/placements/create?application=${applicationId}`);
  await expect(
    page.getByRole("heading", { name: "Placement already exists" }),
  ).toBeVisible();
  await logout(page);
  await login(page, "flowstudent@example.test");
  await page.goto(`/dashboard/progress/create?placement=${placementId}`);
  await page.getByLabel("Work date").fill(today());
  await page.getByLabel("Hours rendered").fill("8");
  await page
    .getByLabel("Tasks performed")
    .fill("Completed synthetic lifecycle work.");
  await page.getByRole("button", { name: "Submit Report" }).click();
  await expect(
    page.getByRole("heading", { name: "Progress", exact: false }),
  ).toHaveCount(0);
  const reportHref = new URL(page.url()).pathname;
  await expect(
    page.getByText("Completed synthetic lifecycle work.", { exact: true }),
  ).toBeVisible();
  await logout(page);
  await login(page, "faculty@example.test");
  await page.goto(reportHref);
  await page
    .getByLabel("Reviewer remarks")
    .fill("Reviewed synthetic evidence and eight hours.");
  await page.getByRole("button", { name: "Mark as Reviewed" }).click();
  await expect(
    page.getByRole("button", { name: "Mark as Reviewed" }),
  ).toHaveCount(0);
  await page.goto(`/dashboard/evaluations?placement=${placementId}`);
  const facultyEvalHref = await page
    .locator("tbody tr")
    .filter({ hasText: "Robin Demo" })
    .getByRole("link", { name: "Open evaluation" })
    .getAttribute("href");
  await page.goto(facultyEvalHref!);
  await page.getByLabel("Demonstration score").fill("93");
  await page
    .getByLabel("Evaluation comments")
    .fill("Synthetic faculty evaluation completed.");
  await page.getByRole("button", { name: "Submit Evaluation" }).click();
  await expect(
    page.getByRole("button", { name: "Submit Evaluation" }),
  ).toHaveCount(0);
  await logout(page);
  await login(page, "flowsupervisor@example.test");
  await page.goto(facultyEvalHref!);
  await expect(
    page.getByRole("button", { name: "Submit Evaluation" }),
  ).toHaveCount(0);
  await page.goto(`/dashboard/evaluations?placement=${placementId}`);
  const companyEvalHref = await page
    .locator("tbody tr")
    .filter({ hasText: "Flow Supervisor" })
    .getByRole("link", { name: "Open evaluation" })
    .getAttribute("href");
  await page.goto(companyEvalHref!);
  await page.getByLabel("Demonstration score").fill("95");
  await page
    .getByLabel("Evaluation comments")
    .fill("Synthetic company evaluation completed.");
  await page.getByRole("button", { name: "Submit Evaluation" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Submit Evaluation" }),
  ).toHaveCount(0);
  await logout(page);
  await login(page);
  await page.goto(`/dashboard/progress/${placementId}`);
  await expect(page.locator("dl")).toContainText("100%");
  await expect(
    page.locator("dl > div").filter({ hasText: "Reviewed hours" }),
  ).toContainText("8");
  await page.goto(`/dashboard/placements/${placementId}`);
  await page
    .getByRole("button", { name: "Confirm completion", exact: true })
    .click();
  await confirmDialog(page);
  await expect(
    page.getByRole("heading", { name: "Required evaluations" }),
  ).toBeVisible();
  await page
    .getByLabel("Demonstration certificate number", { exact: false })
    .fill("DEMO-E2E-CERT");
  await page.getByLabel("Issue date", { exact: false }).fill(today());
  await page
    .getByRole("button", { name: "Record demonstration certificate" })
    .click();
  await expect(page.getByText("DEMO-E2E-CERT", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("DEMO-E2E-CERT", { exact: true })).toBeVisible();
  await page.goto(`/dashboard/applications/app-001`);
  await page
    .getByLabel("Rejection reason")
    .fill("Synthetic acceptance criteria not met");
  await page.getByLabel("I confirm rejection", { exact: false }).check();
  await page.getByRole("button", { name: "Confirm Rejection" }).click();
  await page.reload();
  await expect(page.getByTestId("application-status")).toHaveText("Rejected");
  await expect(
    page.getByRole("cell", {
      name: "Synthetic acceptance criteria not met",
      exact: true,
    }),
  ).toBeVisible();
  await page.goto("/dashboard/reports");
  await page.getByLabel("Report category").selectOption("Progress");
  await page.getByLabel("Company", { exact: true }).selectOption(companyId);
  await page.getByRole("button", { name: "Generate Report" }).click();
  await expect(page.locator(".generated-report tbody")).toContainText(
    "Edited Synthetic",
  );
  await expect(page.locator(".generated-report tbody tr")).toHaveCount(1);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream!) chunks.push(chunk);
  const csv = Buffer.concat(chunks).toString("utf8");
  expect(csv).toContain('"Edited Synthetic"');
  expect(csv).toContain('"100"');
  expect(csv).not.toContain('"Mira Demo"');
  expect(errors).toEqual([]);
});
