import {
  activateRegisteredStudent,
  postingFields,
  stagedPostingApproval,
} from "./update-helpers";
import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  auditConfirm,
  auditDay,
  auditLogin,
  auditLogout,
  auditSnapshot,
  downloadBytes,
} from "./audit-helpers";
test.use({ actionTimeout: 15000 });

test("independent A-I: fractional lifecycle, real PDF/images, propagation and CSV round trip", async ({
  page,
}) => {
  test.setTimeout(300000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await auditLogin(page);
  await page.goto("/dashboard/students/create");
  await page.getByRole("button", { name: "Save Student", exact: true }).click();
  expect(
    await page
      .locator("form")
      .evaluate((form) => (form as HTMLFormElement).checkValidity()),
  ).toBe(false);
  for (const [name, value] of Object.entries({
    studentNumber: "AUDIT-001",
    firstName: 'Audit, "CSV"',
    lastName: "Student",
    email: "audit-student@example.test",
    section: "4-A",
  }))
    await page.locator(`[name=${name}]`).fill(value);
  await page
    .getByLabel("Program *", { exact: true })
    .selectOption("BS Computer Science");
  await page
    .getByLabel("Year level *", { exact: true })
    .selectOption("4th Year");
  await page.getByRole("button", { name: "Save Student", exact: true }).click();
  await expect(page).toHaveURL(/students\/(?!create$)[^/?]+$/);
  const studentId = page.url().split("/").at(-1)!;
  await page.getByRole("button", { name: "Dismiss saved message" }).click();
  await expect(page.locator(".saved-notice")).toHaveCount(0);
  await page.goto("/dashboard/students?q=AUDIT-001");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("link", { name: "Open student" }).click();
  await page.getByRole("link", { name: "Edit Profile" }).click();
  await page.getByLabel("Last name").fill("Revised");
  await page.getByRole("button", { name: "Save Changes", exact: true }).click();
  await expect(page.locator("h1")).toContainText('Audit, "CSV" Revised');
  await page.reload();
  await expect(page.locator("h1")).toContainText('Audit, "CSV" Revised');
  await activateRegisteredStudent(
    page,
    studentId,
    "audit-student@example.test",
    "AUDIT-001",
  );
  await page.goto("/dashboard/partners/create");
  for (const [name, value] of Object.entries({
    name: 'Audit, "Labs"',
    industry: "Synthetic QA",
    address: "100 Synthetic Street",
    contactPerson: "Fictional Contact",
    email: "audit-company@example.test",
    phone: "-----",
    moaStart: auditDay(-100),
    moaEnd: auditDay(300),
  }))
    await page.locator(`[name=${name}]`).fill(value);
  await page.locator("[name=approved]").selectOption("true");
  await page.getByRole("button", { name: "Save Partner", exact: true }).click();
  await expect(page.locator(".error-message")).toContainText("digits");
  await page.locator("[name=phone]").fill("+1 555 0199");
  await page.getByRole("button", { name: "Save Partner", exact: true }).click();
  await expect(page).toHaveURL(/partners\/(?!create$)[^/?]+$/);
  const companyId = page.url().split("/").at(-1)!;
  await page.getByRole("link", { name: /Add Supervisor Account/i }).click();
  for (const [name, value] of Object.entries({
    name: "Audit Supervisor",
    email: "audit-supervisor@example.test",
    phone: "+1 555 0198",
  }))
    await page.locator(`[name=${name}]`).fill(value);
  await page
    .getByRole("button", { name: "Save supervisor", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("Audit Supervisor");
  const supervisorId = page.url().split("/").at(-1)!;
  const requirementIds: string[] = [];
  for (const [name, classification] of [
    ["Audit PDF Proof", "Mandatory"],
    ["Audit JPEG Proof", "Optional"],
  ]) {
    await page.goto("/dashboard/requirements/create");
    await page.locator("[name=name]").fill(name);
    await page
      .locator("textarea[name=description]")
      .fill("Independent synthetic attachment requirement");
    await page.locator("[name=classification]").selectOption(classification);
    await page
      .getByRole("button", { name: "Save Requirement", exact: true })
      .click();
    const href = await page
      .locator("tbody tr")
      .filter({ hasText: name })
      .getByRole("link", { name: "Edit requirement" })
      .getAttribute("href");
    requirementIds.push(href!.split("/").at(-2)!);
  }
  await page.goto("/dashboard/internships/create");
  await page.locator("[name=companyId]").selectOption(companyId);
  await page.locator("[name=title]").fill("Independent QA Internship");
  await page
    .locator("textarea[name=description]")
    .fill("Synthetic internship for independent verification");
  await page.locator("[name=capacity]").fill("1.5");
  expect(
    await page
      .locator("[name=capacity]")
      .evaluate((el) => (el as HTMLInputElement).validity.valid),
  ).toBe(false);
  await page.locator("[name=capacity]").fill("1");
  await postingFields(page);
  await page
    .getByRole("button", { name: "Save Opportunity", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("Independent QA Internship");
  const opportunityId = page.url().split("/").at(-1)!;
  await stagedPostingApproval(page, companyId, opportunityId, supervisorId);
  await auditLogout(page);
  await auditLogin(page, "audit-student@example.test");
  const submissions: string[] = [];
  for (const requirement of ["req-1", "req-2", requirementIds[0]]) {
    await page.goto(
      `/dashboard/requirements/submissions/create?requirement=${requirement}`,
    );
    if (requirement === "req-1") {
      await page.locator("[type=file]").setInputFiles({
        name: "unsupported.html",
        mimeType: "text/html",
        buffer: Buffer.from("Synthetic HTML"),
      });
      await page
        .getByRole("button", { name: "Store and submit document" })
        .click();
      await expect(page.locator(".error-message")).toContainText("Supported");
      await page.locator("[type=file]").setInputFiles({
        name: "empty.txt",
        mimeType: "text/plain",
        buffer: Buffer.alloc(0),
      });
      await page
        .getByRole("button", { name: "Store and submit document" })
        .click();
      await expect(page.locator(".error-message")).toContainText("nonempty");
    }
    if (requirement === requirementIds[0])
      await page
        .locator("[type=file]")
        .setInputFiles(resolve("tests/fixtures/audit-document.pdf"));
    else
      await page.locator("[type=file]").setInputFiles({
        name: `${requirement}.txt`,
        mimeType: "text/plain",
        buffer: Buffer.from(
          '<img src=x onerror="window.independentXss=1"> Synthetic text',
        ),
      });
    await page
      .getByRole("button", { name: "Store and submit document" })
      .click();
    await expect(page).toHaveURL(/submissions\/(?!create$)[^/?]+$/);
    submissions.push(page.url());
    await page.reload();
    await expect(page.getByRole("link", { name: /^Download / })).toBeVisible();
    if (requirement === requirementIds[0])
      expect(await downloadBytes(page)).toEqual(
        readFileSync(resolve("tests/fixtures/audit-document.pdf")),
      );
    else {
      await expect(page.locator("pre")).toContainText("<img");
      expect(
        await page.evaluate(() => Reflect.get(window, "independentXss")),
      ).toBeUndefined();
    }
  }
  await auditLogout(page);
  await auditLogin(page);
  await page.goto(submissions[2]);
  await page
    .getByRole("button", { name: "Reject submission", exact: true })
    .click();
  expect(
    await page
      .locator("[name=reason]")
      .evaluate((el) => (el as HTMLTextAreaElement).validity.valid),
  ).toBe(false);
  await page.locator("[name=reason]").fill("Synthetic replacement requested");
  await page
    .getByRole("button", { name: "Reject submission", exact: true })
    .click();
  await page.reload();
  await expect(page.locator("dl")).toContainText(
    "Synthetic replacement requested",
  );
  await expect(page.locator("dl")).toContainText("Alex Demo");
  await auditLogout(page);
  await auditLogin(page, "audit-student@example.test");
  await page.goto(
    `/dashboard/requirements/submissions/create?requirement=${requirementIds[0]}`,
  );
  await page
    .locator("[type=file]")
    .setInputFiles(resolve("tests/fixtures/audit-document.pdf"));
  await page.getByRole("button", { name: "Store and submit document" }).click();
  await expect(page).toHaveURL(/submissions\/(?!create$)[^/?]+$/);
  submissions[2] = page.url();
  await auditLogout(page);
  await auditLogin(page);
  for (const href of submissions) {
    await page.goto(href);
    await page
      .getByRole("button", { name: "Approve submission", exact: true })
      .click();
    await auditConfirm(page);
    await expect(page.locator("#main-content")).toContainText("Approved");
  }
  await page.goto(`/dashboard/students/${studentId}`);
  await expect(
    page.getByText(
      "All Before Internship mandatory requirements are approved under the demonstration policy.",
    ),
  ).toBeVisible();
  await auditLogout(page);
  await auditLogin(page, "audit-student@example.test");
  await page.goto(
    `/dashboard/applications/create?opportunity=${opportunityId}`,
  );
  await page
    .getByRole("button", { name: "Submit Application", exact: true })
    .click();
  await expect(page).toHaveURL(/applications\/(?!create$)[^/?]+$/);
  const applicationId = page.url().split("/").at(-1)!;
  await auditLogout(page);
  await auditLogin(page);
  await page.goto(`/dashboard/applications/${applicationId}`);
  await expect(page.locator("h1")).toContainText('Audit, "CSV" Revised');
  await page
    .getByRole("button", { name: "Accept Application", exact: true })
    .click();
  await auditConfirm(page);
  await page
    .getByRole("link", { name: "Create Placement", exact: true })
    .click();
  await expect(page.locator("[name=application]")).toHaveValue(applicationId);
  await expect(page.locator("[name=application]")).toHaveAttribute(
    "readonly",
    "",
  );
  await page.locator("[name=startDate]").fill(auditDay(-4));
  await page.locator("[name=endDate]").fill(auditDay(5));
  await page.locator("[name=requiredHours]").fill("1");
  await page.locator("[name=adviserId]").selectOption("fac-2");
  await page.locator("[name=supervisorId]").selectOption(supervisorId);
  await page.getByLabel("I reviewed the displayed", { exact: false }).check();
  await page
    .getByRole("button", { name: "Review and Save Placement", exact: true })
    .click();
  await expect(page).toHaveURL(/placements\/[^/?]+$/);
  const placementId = page.url().split("/").at(-1)!;
  await page.goto(`/dashboard/placements/create?application=${applicationId}`);
  await expect(
    page.getByRole("heading", { name: "Placement already exists" }),
  ).toBeVisible();
  await auditLogout(page);
  await auditLogin(page, "audit-student@example.test");
  const reports: string[] = [];
  for (const [index, hours] of [0.7, 0.1, 0.1, 0.1].entries()) {
    await page.goto(`/dashboard/progress/create?placement=${placementId}`);
    await page.locator("[name=workDate]").fill(auditDay(index - 4));
    await page.locator("[name=hours]").fill(String(hours));
    await page
      .locator("[name=tasks]")
      .fill(`Independent fractional work ${index}`);
    await page
      .getByRole("button", { name: "Submit Report", exact: true })
      .click();
    await expect(page).toHaveURL(/progress\/reports\/[^/]+$/);
    reports.push(page.url());
  }
  for (const [requirement, file] of [
    ["req-3", "audit-document.png"],
    [requirementIds[1], "audit-document.jpg"],
  ]) {
    await page.goto(
      `/dashboard/requirements/submissions/create?requirement=${requirement}`,
    );
    await page
      .locator("[type=file]")
      .setInputFiles(resolve(`tests/fixtures/${file}`));
    await page
      .getByRole("button", { name: "Store and submit document" })
      .click();
    await expect(page).toHaveURL(/submissions\/(?!create$)[^/?]+$/);
    submissions.push(page.url());
    await page.reload();
    await expect
      .poll(() =>
        page
          .getByRole("img")
          .evaluate((el) => (el as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
    expect(await downloadBytes(page)).toEqual(
      readFileSync(resolve(`tests/fixtures/${file}`)),
    );
  }
  await auditLogout(page);
  await auditLogin(page, "audit-supervisor@example.test");
  for (const href of reports) {
    await page.goto(href);
    await page
      .locator("[name=remarks]")
      .fill("Independent supervisor approval");
    await page
      .getByRole("button", { name: "Approve Report", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Approve Report", exact: true }),
    ).toHaveCount(0);
  }
  await auditLogout(page);
  await auditLogin(page, "faculty2@example.test");
  for (const href of submissions.slice(3)) {
    await page.goto(href);
    await page
      .getByRole("button", { name: "Approve submission", exact: true })
      .click();
    await auditConfirm(page);
    await expect(page.locator("dl")).toContainText("Casey Sample");
  }
  await page.goto(`/dashboard/evaluations?placement=${placementId}`);
  const facultyEvaluation = await page
    .locator("tbody tr")
    .filter({ hasText: "Casey Sample" })
    .getByRole("link", { name: "Open evaluation" })
    .getAttribute("href");
  const companyEvaluation = await page
    .locator("tbody tr")
    .filter({ hasText: "Audit Supervisor" })
    .getByRole("link", { name: "Open evaluation" })
    .getAttribute("href");
  await page.goto(facultyEvaluation!);
  await page.locator("[name=grade]").fill("88.75");
  await page.locator("[name=comments]").fill("Independent faculty assessment");
  await page
    .getByRole("button", { name: "Submit Evaluation", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Submit Evaluation", exact: true }),
  ).toHaveCount(0);
  await auditLogout(page);
  await auditLogin(page, "audit-supervisor@example.test");
  await page.goto(facultyEvaluation!);
  await expect(
    page.getByRole("button", { name: "Submit Evaluation", exact: true }),
  ).toHaveCount(0);
  await page.goto("/dashboard/students/2024-0001");
  await expect(
    page.getByRole("heading", { name: "Record not found" }),
  ).toBeVisible();
  await page.goto(companyEvaluation!);
  await page.locator("[name=grade]").fill("82.5");
  const csvComment = '=SUM(1,2)\n"Synthetic company comment"';
  await page.locator("[name=comments]").fill(csvComment);
  await page
    .getByRole("button", { name: "Submit Evaluation", exact: true })
    .click();
  await page.reload();
  await expect(page.locator("dl")).toContainText(csvComment);
  await auditLogout(page);
  await auditLogin(page);
  await page.goto(`/dashboard/placements/${placementId}`);
  await expect(page.locator("dl")).toContainText("100%");
  await page
    .getByRole("button", { name: "Confirm completion", exact: true })
    .click();
  await auditConfirm(page);
  await page.locator("[name=number]").fill("SYN-INDEPENDENT-CERT");
  await page.locator("[name=issueDate]").fill(auditDay());
  await page
    .getByRole("button", {
      name: "Record demonstration certificate",
      exact: true,
    })
    .click();
  await page.reload();
  await expect(page.locator("#main-content")).toContainText(
    "SYN-INDEPENDENT-CERT",
  );
  await page.goto("/dashboard/reports");
  await page.locator("[name=category]").selectOption("Evaluations");
  await page.locator("[name=companyId]").selectOption(companyId);
  await page
    .getByRole("button", { name: "Generate Report", exact: true })
    .click();
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await expect(page.locator(".report-totals")).toContainText("85.63");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV", exact: true }).click();
  const stream = await (await download).createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const csv = Buffer.concat(chunks).toString("utf8");
  expect(csv).toContain('"\'=SUM(1,2)\n""Synthetic company comment"""');
  expect(csv).toContain('Audit, ""CSV"" Revised');
  expect(csv).not.toContain("Mira Demo");
  const snapshot = await auditSnapshot(page);
  const own = snapshot.placements.find((p) => p.id === placementId)!;
  expect(own.status).toBe("Completed");
  expect(
    snapshot.reports
      .filter((r) => r.placementId === placementId)
      .map((r) => r.hours),
  ).toEqual([0.7, 0.1, 0.1, 0.1]);
  expect(
    snapshot.evaluations.filter((e) => e.placementId === placementId),
  ).toHaveLength(2);
  expect(
    snapshot.certificates.filter((c) => c.placementId === placementId),
  ).toHaveLength(1);
  await page.goto(`/dashboard/progress/${placementId}`);
  await expect(page.locator("dl")).toContainText("100%");
  await page.goto(`/dashboard/students/${studentId}`);
  await expect(page.locator("h1")).toContainText('Audit, "CSV" Revised');
  await expect(page.locator("#main-content")).toContainText("Completed");
  expect(errors).toEqual([]);
});
