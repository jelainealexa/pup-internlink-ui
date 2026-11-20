import { test, expect, Page } from "@playwright/test";
import {
  auditLogin,
  auditLogout,
  auditDay,
  auditConfirm,
  auditSnapshot,
  auditPassword,
} from "./audit-helpers";
test.use({ actionTimeout: 15000 });
async function changeRole(page: Page, email = "coordinator@example.test") {
  if (await page.getByRole("button", { name: "Log out", exact: true }).count())
    await auditLogout(page);
  await auditLogin(page, email);
}
async function fill(page: Page, values: Record<string, string>) {
  for (const [name, value] of Object.entries(values))
    await page.locator(`form [name=${name}]`).fill(value);
}
async function registerStudent(page: Page, number: string, email: string) {
  await page.goto("/dashboard/students/create");
  await fill(page, {
    studentNumber: number,
    firstName: "Updated",
    lastName: "Synthetic",
    email,
    section: "4-U",
  });
  await page.locator("[name=program]").selectOption("BS Computer Science");
  await page.locator("[name=yearLevel]").selectOption("4th Year");
  await page.getByRole("button", { name: "Save Student", exact: true }).click();
  await expect(page).toHaveURL(/students\/(?!create$)[^/?]+$/);
  return page.url().split("/").at(-1)!;
}
function detail(page: Page, label: string) {
  return page
    .locator("dt")
    .filter({
      hasText: new RegExp(
        "^" + label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$",
      ),
    })
    .locator("..")
    .locator("dd");
}
async function manualLogin(page: Page, email: string, password: string) {
  await page.goto("/");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password *", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
}

test("updated A-B: pre-registration, faculty scope, invitation activation, recovery and account credentials", async ({
  page,
}) => {
  test.setTimeout(240000);
  await auditLogin(page);
  await page.goto("/dashboard/faculty/create");
  await fill(page, {
    name: "Updated Faculty",
    email: "updated-faculty@example.test",
  });
  await page.getByRole("button", { name: "Save Faculty", exact: true }).click();
  await expect(page).toHaveURL(/faculty\/(?!create$)[^/?]+$/);
  const facultyId = page.url().split("/").at(-1)!;
  const id = await registerStudent(
    page,
    "IU-BROWSER-01",
    "updated-student@example.test",
  );
  await expect(detail(page, "Account status")).toHaveText("Pending Activation");
  await page
    .getByRole("button", { name: "Generate Invitation", exact: true })
    .click();
  const original = await page
    .getByRole("link", { name: "Open demonstration activation link" })
    .getAttribute("href");
  expect(original).toContain("token=");
  await page.goto(`/dashboard/faculty/${facultyId}`);
  await page.locator("[name=studentId]").selectOption(id);
  await page
    .getByRole("button", { name: "Assign Student", exact: true })
    .click();
  await page.reload();
  await expect(page.locator("tbody")).toContainText("IU-BROWSER-01");
  await changeRole(page, "updated-faculty@example.test");
  await page.goto(`/dashboard/students/${id}`);
  await expect(detail(page, "Assigned Faculty Adviser")).toHaveText(
    "Updated Faculty",
  );
  await page
    .getByRole("button", { name: "Generate Invitation", exact: true })
    .click();
  await expect
    .poll(() =>
      page
        .getByRole("link", { name: "Open demonstration activation link" })
        .getAttribute("href"),
    )
    .not.toBe(original);
  const currentInvitation = (await page
    .getByRole("link", { name: "Open demonstration activation link" })
    .getAttribute("href"))!;
  const extra = await registerStudent(
    page,
    "IU-FACULTY-02",
    "faculty-preregistered@example.test",
  );
  await expect(detail(page, "Assigned Faculty Adviser")).toHaveText(
    "Updated Faculty",
  );
  expect(extra).not.toBe(id);
  await auditLogout(page);
  await page.goto(currentInvitation);
  await fill(page, {
    studentNumber: "WRONG-STUDENT",
    password: "Activated!2026",
    confirmPassword: "Activated!2026",
  });
  await page
    .getByRole("button", { name: "Activate Account", exact: true })
    .click();
  await expect(page.locator(".error-message")).toContainText("must match");
  await page.locator("[name=studentNumber]").fill("IU-BROWSER-01");
  await page.locator("[name=confirmPassword]").fill("Different!2026");
  await page
    .getByRole("button", { name: "Activate Account", exact: true })
    .click();
  await expect(page.locator(".error-message")).toContainText("confirmation");
  await page.locator("[name=confirmPassword]").fill("Activated!2026");
  await page
    .getByRole("button", { name: "Activate Account", exact: true })
    .click();
  await expect(
    page.getByText("Existing pre-registered account activated.", {
      exact: false,
    }),
  ).toBeVisible();
  await manualLogin(page, "updated-student@example.test", "Activated!2026");
  await expect(
    page.getByRole("button", { name: "Log out", exact: true }),
  ).toBeVisible();
  await page.goto(`/dashboard/students/${id}`);
  await expect(detail(page, "Assigned Faculty Adviser")).toHaveText(
    "Updated Faculty",
  );
  await expect(detail(page, "Profile completion")).toContainText("100%");
  await page.goto("/dashboard/settings");
  const emailForm = page.locator("form").filter({
    has: page.getByRole("button", {
      name: "Update Email Address",
      exact: true,
    }),
  });
  await emailForm.locator("[name=email]").fill("STUDENT2@EXAMPLE.TEST");
  await emailForm.locator("[name=currentPassword]").fill("Activated!2026");
  await emailForm
    .getByRole("button", { name: "Update Email Address", exact: true })
    .click();
  await expect(emailForm.locator(".error-message")).toContainText("already");
  await emailForm.locator("[name=email]").fill("updated-email@example.test");
  await emailForm
    .getByRole("button", { name: "Update Email Address", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Demonstration sign in", exact: true }),
  ).toBeVisible();
  await manualLogin(page, "updated-student@example.test", "Activated!2026");
  await expect(page.locator(".error-message")).toContainText("Invalid");
  await manualLogin(page, "updated-email@example.test", "Activated!2026");
  await expect(
    page.getByRole("button", { name: "Log out", exact: true }),
  ).toBeVisible();
  await page.goto("/dashboard/settings");
  const passwordForm = page.locator("form").filter({
    has: page.getByRole("button", { name: "Change Password", exact: true }),
  });
  await passwordForm.locator("[name=currentPassword]").fill("Activated!2026");
  await passwordForm.locator("[name=newPassword]").fill("Changed!2026");
  await passwordForm.locator("[name=confirmPassword]").fill("Changed!2026");
  await passwordForm
    .getByRole("button", { name: "Show new password", exact: true })
    .click();
  await expect(passwordForm.locator("[name=newPassword]")).toHaveAttribute(
    "type",
    "text",
  );
  await passwordForm
    .getByRole("button", { name: "Hide new password", exact: true })
    .click();
  await passwordForm
    .getByRole("button", { name: "Change Password", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Demonstration sign in", exact: true }),
  ).toBeVisible();
  await manualLogin(page, "updated-email@example.test", "Activated!2026");
  await expect(page.locator(".error-message")).toContainText("Invalid");
  await manualLogin(page, "updated-email@example.test", "Changed!2026");
  await auditLogout(page);
  await page
    .getByRole("link", { name: "Forgot Password", exact: true })
    .click();
  await page
    .getByLabel("Registered email address")
    .fill("updated-email@example.test");
  await page
    .getByRole("button", {
      name: "Send Password Reset Link (local demo)",
      exact: true,
    })
    .click();
  const reset = (await page
    .getByRole("link", { name: "Open local password reset link" })
    .getAttribute("href"))!;
  await page
    .getByRole("link", { name: "Open local password reset link" })
    .click();
  await fill(page, {
    password: "Recovered!2026",
    confirmPassword: "Recovered!2026",
  });
  await page
    .getByRole("button", { name: "Reset Password", exact: true })
    .click();
  await expect(
    page.getByText("Demonstration password reset.", { exact: false }),
  ).toBeVisible();
  await page.goto(reset);
  await fill(page, {
    password: "Recovered!2026",
    confirmPassword: "Recovered!2026",
  });
  await page
    .getByRole("button", { name: "Reset Password", exact: true })
    .click();
  await expect(page.locator(".error-message")).toContainText("already used");
  await manualLogin(page, "updated-email@example.test", "Recovered!2026");
  await auditLogout(page);
  await auditLogin(page);
  await page.goto(`/dashboard/students/${id}`);
  await expect(detail(page, "Email")).toHaveText("updated-email@example.test");
  await page
    .getByRole("button", { name: "Deactivate Student Account", exact: true })
    .click();
  await auditConfirm(page);
  await auditLogout(page);
  await manualLogin(page, "updated-email@example.test", "Recovered!2026");
  await expect(page.locator(".error-message")).toContainText("inactive");
  await auditLogin(page);
  const db = await auditSnapshot(page);
  expect(
    db.students.filter((s) => s.studentNumber === "IU-BROWSER-01"),
  ).toHaveLength(1);
  expect(
    db.accounts.find(
      (a) => a.id === db.students.find((s) => s.id === id)!.accountId,
    )?.activationState,
  ).toBe("Deactivated");
});

test("updated C-H: five-role posting, phased documents, application, attendance, weekly decisions and completion", async ({
  page,
}) => {
  test.setTimeout(360000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await auditLogin(page);
  await page.goto("/dashboard/partners/create");
  await fill(page, {
    name: "Updated Synthetic Company",
    industry: "Synthetic QA",
    address: "10 Synthetic Avenue",
    contactPerson: "Fictional Contact",
    email: "contact@updated.example.test",
    phone: "000-555-0188",
    moaStart: auditDay(-90),
    moaEnd: auditDay(180),
  });
  await page.locator("[name=approved]").selectOption("true");
  await page.getByRole("button", { name: "Save Partner", exact: true }).click();
  await expect(page).toHaveURL(/partners\/(?!create$)[^/?]+$/);
  const companyId = page.url().split("/").at(-1)!;
  await page.goto(`/dashboard/partners/${companyId}/supervisors/create`);
  await page.locator("[name=role]").selectOption("Company Supervisor");
  await fill(page, {
    name: "Updated Company Administrator",
    email: "updated-company@example.test",
    phone: "000-555-0187",
  });
  await page
    .getByRole("button", { name: "Save supervisor", exact: true })
    .click();
  const definitions: Record<string, string> = {};
  for (const phase of [
    "Before Internship",
    "During Internship",
    "After Internship",
  ]) {
    await page.goto("/dashboard/requirements/create");
    await fill(page, {
      name: `Updated ${phase} Proof`,
      description: "Synthetic phase document",
    });
    await page.locator("[name=phase]").selectOption(phase);
    await page
      .getByRole("button", { name: "Save Requirement", exact: true })
      .click();
    const href = await page
      .locator("tbody tr")
      .filter({ hasText: `Updated ${phase} Proof` })
      .getByRole("link", { name: "Edit requirement" })
      .getAttribute("href");
    definitions[phase] = href!.split("/").at(-2)!;
  }
  await page.goto("/dashboard/students/2024-0004");
  await page.locator("[name=adviserId]").selectOption("fac-1");
  await page
    .getByRole("button", { name: "Assign Faculty Adviser", exact: true })
    .click();
  await changeRole(page, "updated-company@example.test");
  await expect(page.locator("h1")).toHaveText("Company Supervisor dashboard");
  await page.goto(`/dashboard/partners/${companyId}/edit`);
  await expect(page.locator("[name=moaEnd]")).toHaveAttribute("readonly", "");
  await page.locator("[name=address]").fill("12 Updated Synthetic Avenue");
  await page.getByRole("button", { name: "Save Partner", exact: true }).click();
  await page.goto(`/dashboard/partners/${companyId}/supervisors/create`);
  await fill(page, {
    name: "Updated Intern Mentor",
    email: "updated-mentor@example.test",
    phone: "000-555-0186",
  });
  await page.locator("[name=active]").selectOption("false");
  await page
    .getByRole("button", { name: "Save supervisor", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("Updated Intern Mentor");
  const supervisorId = page.url().split("/").at(-1)!;
  await auditLogout(page);
  await manualLogin(page, "updated-mentor@example.test", auditPassword);
  await expect(page.locator(".error-message")).toContainText("inactive");
  await auditLogin(page, "updated-company@example.test");
  await page.goto(
    `/dashboard/partners/${companyId}/supervisors/${supervisorId}/edit`,
  );
  await page.locator("[name=active]").selectOption("true");
  await page
    .getByRole("button", { name: "Save supervisor", exact: true })
    .click();
  await page.goto("/dashboard/internships/create");
  await page.locator("[name=companyId]").selectOption(companyId);
  await fill(page, {
    title: "Updated Remote Internship",
    description: "Synthetic internship",
    capacity: "1",
    location: "Synthetic Town",
    requiredHours: "1",
    qualifications: "Academic enrollment",
    skills: "Communication",
    responsibilities: "Synthetic academic work",
  });
  await page.locator("[name=modality]").selectOption("Remote");
  await page
    .getByRole("button", { name: "Save Opportunity", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("Updated Remote Internship");
  const opportunityId = page.url().split("/").at(-1)!;
  await page.locator("[name=remarks]").fill("Company reviewed posting");
  await page
    .getByRole("button", { name: "Save Company Posting Decision", exact: true })
    .click();
  await expect(page.locator(".feature-header")).toContainText(
    "Pending Approval - Coordinator",
  );
  await page.reload();
  await page.locator(`[name=supervisorIds][value="${supervisorId}"]`).check();
  await page
    .getByRole("button", { name: "Save Opportunity Assignments", exact: true })
    .click();
  await expect(
    page
      .locator(".saved-notice")
      .filter({ hasText: "Opportunity assignments saved." }),
  ).toBeVisible();
  await changeRole(page);
  await page.goto(`/dashboard/internships/${opportunityId}`);
  await page.locator("[name=decision]").selectOption("Rejected");
  await page.locator("[name=remarks]").fill("Clarify the synthetic posting");
  await page
    .getByRole("button", {
      name: "Save Coordinator Posting Decision",
      exact: true,
    })
    .click();
  await expect(page.locator(".feature-header")).toContainText("Rejected");
  await changeRole(page, "updated-company@example.test");
  await page.goto(`/dashboard/internships/${opportunityId}`);
  await page.locator("[name=remarks]").fill("Company resubmits after review");
  await page
    .getByRole("button", { name: "Save Company Posting Decision", exact: true })
    .click();
  await expect(page.locator(".feature-header")).toContainText(
    "Pending Approval - Coordinator",
  );
  await changeRole(page);
  await page.goto(`/dashboard/internships/${opportunityId}`);
  await page.locator("[name=remarks]").fill("Coordinator approves posting");
  await page
    .getByRole("button", {
      name: "Save Coordinator Posting Decision",
      exact: true,
    })
    .click();
  await expect(page.locator(".feature-header")).toContainText("Approved");
  await changeRole(page, "updated-company@example.test");
  await page.goto(`/dashboard/internships/${opportunityId}`);
  await page
    .getByRole("button", { name: "Activate Posting", exact: true })
    .click();
  await auditConfirm(page);
  await changeRole(page, "student4@example.test");
  await page.goto("/dashboard/internships");
  await page
    .getByLabel("Location", { exact: true })
    .selectOption("Synthetic Town");
  await page.getByLabel("Modality", { exact: true }).selectOption("Remote");
  await page.getByLabel("Required hours", { exact: true }).selectOption("1");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("link", { name: "Open opportunity" }).click();
  await page
    .getByRole("link", { name: "Updated Synthetic Company", exact: true })
    .click();
  await expect(detail(page, "Address")).toHaveText(
    "12 Updated Synthetic Avenue",
  );
  await page.goto(
    `/dashboard/applications/create?opportunity=${opportunityId}`,
  );
  await page
    .getByRole("button", { name: "Submit Application", exact: true })
    .click();
  await expect(page).toHaveURL(/applications\/(?!create$)[^/?]+$/);
  const applicationId = page.url().split("/").at(-1)!;
  await changeRole(page, "updated-mentor@example.test");
  await expect(page.locator("h1")).toHaveText("Intern Supervisor dashboard");
  await page.goto("/dashboard/internships/opp-1");
  await expect(
    page.getByRole("heading", { name: "Record not found", exact: true }),
  ).toBeVisible();
  await page.goto(`/dashboard/applications/${applicationId}`);
  await page
    .getByRole("button", { name: "Accept Application", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Confirm", exact: true })
    .click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    "mandatory",
  );
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Close dialog", exact: true })
    .click();
  const submit = async (phase: string, version: string) => {
    await page.goto(
      `/dashboard/requirements/submissions/create?requirement=${definitions[phase]}`,
    );
    await page.locator("[type=file]").setInputFiles({
      name: `synthetic-${version}.txt`,
      mimeType: "text/plain",
      buffer: Buffer.from(`Synthetic ${phase} ${version}`),
    });
    await page
      .getByRole("button", { name: "Store and submit document", exact: true })
      .click();
    await expect(page).toHaveURL(/submissions\/(?!create$)[^/?]+$/);
    return page.url();
  };
  await changeRole(page, "student4@example.test");
  const rejected = await submit("Before Internship", "first");
  await changeRole(page, "faculty@example.test");
  await page.goto(rejected);
  await page.locator("[name=reason]").fill(" ");
  await page
    .getByRole("button", { name: "Reject submission", exact: true })
    .click();
  await expect(page.locator(".error-message")).toContainText(
    "Rejection reason",
  );
  await page
    .locator("[name=reason]")
    .fill("Please replace the synthetic proof");
  await page
    .getByRole("button", { name: "Reject submission", exact: true })
    .click();
  await expect(detail(page, "Submission status")).toHaveText("Rejected");
  await changeRole(page, "student4@example.test");
  const approved = await submit("Before Internship", "replacement");
  await changeRole(page, "faculty@example.test");
  await page.goto(approved);
  await page
    .getByLabel("Faculty approval remarks (optional)")
    .fill("Faculty validates replacement");
  await page
    .getByRole("button", { name: "Approve submission", exact: true })
    .click();
  await auditConfirm(page);
  await changeRole(page, "updated-mentor@example.test");
  await page.goto(`/dashboard/applications/${applicationId}`);
  await page
    .getByLabel("Acceptance remarks (optional)")
    .fill("Assigned mentor accepts");
  await page
    .getByRole("button", { name: "Accept Application", exact: true })
    .click();
  await auditConfirm(page);
  await expect(page.getByTestId("application-status")).toHaveText("Accepted");
  await changeRole(page);
  await page.goto(`/dashboard/applications/${applicationId}`);
  await expect(page.locator("#main-content")).toContainText(
    "Assigned mentor accepts",
  );
  await page
    .getByRole("link", { name: "Create Placement", exact: true })
    .click();
  await expect(page.locator("[name=application]")).toHaveValue(applicationId);
  await fill(page, {
    startDate: auditDay(-6),
    endDate: auditDay(7),
    requiredHours: "1",
  });
  await page.locator("[name=adviserId]").selectOption("fac-1");
  await page.locator("[name=supervisorId]").selectOption(supervisorId);
  await page.getByLabel("I reviewed the displayed", { exact: false }).check();
  await page
    .getByRole("button", { name: "Review and Save Placement", exact: true })
    .click();
  await expect(page).toHaveURL(/placements\/[^/?]+$/);
  const placementId = page.url().split("/").at(-1)!;
  await changeRole(page, "student4@example.test");
  for (const [offset, hours] of [
    [-2, "0.7"],
    [-1, "0.3"],
  ] as const) {
    await page.goto(`/dashboard/attendance/create?placement=${placementId}`);
    await fill(page, {
      date: auditDay(offset),
      hours,
      activity: "Synthetic daily work",
    });
    await page
      .getByRole("button", { name: "Save Attendance", exact: true })
      .click();
    await expect(page).toHaveURL(/attendance\?placement=/);
  }
  const weekly = async (tasks: string) => {
    await page.goto(
      `/dashboard/progress/weekly/create?placement=${placementId}&from=${auditDay(-2)}&to=${auditDay(-1)}`,
    );
    await page.locator("[name=tasks]").fill(tasks);
    await page
      .getByRole("button", { name: "Submit Weekly Report", exact: true })
      .click();
    await expect(page).toHaveURL(/progress\/reports\/[^/?]+$/);
    return page.url();
  };
  const firstReport = await weekly("Initial weekly activities");
  await changeRole(page, "updated-mentor@example.test");
  await page.goto(firstReport);
  await page
    .locator("[name=rejectionRemarks]")
    .fill("More weekly detail needed");
  await page
    .getByRole("button", { name: "Reject Report", exact: true })
    .click();
  await changeRole(page, "student4@example.test");
  const finalReport = await weekly("Revised weekly activities");
  await page.goto(`/dashboard/placements/${placementId}`);
  await expect(detail(page, "Rendered hours")).toHaveText("1");
  await expect(detail(page, "Approved / Required hours")).toHaveText("0 / 1");
  await changeRole(page, "faculty@example.test");
  await page.goto(finalReport);
  await page
    .locator("[name=facultyRemarks]")
    .fill("Faculty monitors without approval");
  await page
    .getByRole("button", {
      name: "Save Faculty Monitoring Remark",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("button", { name: "Approve Report", exact: true }),
  ).toHaveCount(0);
  await changeRole(page, "updated-mentor@example.test");
  await page.goto(finalReport);
  await page.locator("[name=remarks]").fill("Validated one hour of activities");
  await page
    .getByRole("button", { name: "Approve Report", exact: true })
    .click();
  await page.reload();
  await expect(detail(page, "Report approval status")).toHaveText("Approved");
  await expect(page.locator("#main-content")).toContainText(
    "Faculty monitors without approval",
  );
  await changeRole(page, "student4@example.test");
  for (const phase of ["During Internship", "After Internship"]) {
    await page.goto("/dashboard/requirements");
    await page.getByRole("tab", { name: phase, exact: true }).click();
    await expect(
      page.getByRole("tab", { name: phase, exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    const href = await submit(phase, "completion");
    await changeRole(page, "faculty@example.test");
    await page.goto(href);
    await page
      .getByRole("button", { name: "Approve submission", exact: true })
      .click();
    await auditConfirm(page);
    await changeRole(page, "student4@example.test");
  }
  await changeRole(page, "updated-mentor@example.test");
  await page.goto(`/dashboard/evaluations?placement=${placementId}`);
  const companyEval = (await page
    .locator("tbody tr")
    .filter({ hasText: "Updated Intern Mentor" })
    .getByRole("link", { name: "Open evaluation" })
    .getAttribute("href"))!;
  const facultyEval = (await page
    .locator("tbody tr")
    .filter({ hasText: "Robin Demo" })
    .getByRole("link", { name: "Open evaluation" })
    .getAttribute("href"))!;
  await page.goto(facultyEval);
  await expect(
    page.getByRole("button", { name: "Submit Evaluation", exact: true }),
  ).toHaveCount(0);
  await page.goto(companyEval);
  await fill(page, {
    grade: "92",
    comments: "Synthetic company performance",
    evaluationDate: auditDay(),
  });
  await page
    .getByRole("button", { name: "Submit Evaluation", exact: true })
    .click();
  await changeRole(page, "faculty@example.test");
  await page.goto(facultyEval);
  await fill(page, {
    grade: "88",
    comments: "Synthetic faculty performance",
    evaluationDate: auditDay(),
  });
  await page
    .getByRole("button", { name: "Submit Evaluation", exact: true })
    .click();
  await changeRole(page);
  await page.goto(`/dashboard/placements/${placementId}`);
  await expect(detail(page, "Approved / Required hours")).toHaveText("1 / 1");
  await page
    .getByRole("button", { name: "Confirm completion", exact: true })
    .click();
  await auditConfirm(page);
  await fill(page, { number: "SYN-UPDATED-CERT", issueDate: auditDay() });
  await page
    .getByRole("button", {
      name: "Record demonstration certificate",
      exact: true,
    })
    .click();
  await page.reload();
  await expect(detail(page, "Status")).toHaveText("Completed");
  const db = await auditSnapshot(page);
  expect(
    db.attendance?.filter((a) => a.placementId === placementId),
  ).toHaveLength(2);
  expect(db.reports.filter((r) => r.placementId === placementId)).toHaveLength(
    2,
  );
  expect(
    db.evaluations.filter(
      (e) => e.placementId === placementId && e.status === "Submitted",
    ),
  ).toHaveLength(2);
  expect(
    db.submissions.filter(
      (s) =>
        s.requirementId === definitions["Before Internship"] &&
        s.studentId === "2024-0004",
    ),
  ).toHaveLength(2);
  expect(
    db.opportunities
      .find((o) => o.id === opportunityId)
      ?.decisions?.map((d) => d.outcome),
  ).toEqual(["Approved", "Rejected", "Approved", "Approved", "Activated"]);
  expect(errors).toEqual([]);
});
