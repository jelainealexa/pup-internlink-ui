import { expect, Page } from "@playwright/test";
import {
  auditLogin,
  auditLogout,
  auditConfirm,
  auditPassword,
} from "./audit-helpers";

export async function activateRegisteredStudent(
  page: Page,
  id: string,
  email: string,
  studentNumber: string,
) {
  await page.goto(`/dashboard/students/${id}`);
  await expect(
    page
      .locator("dt")
      .filter({ hasText: /^Account status$/ })
      .locator(".."),
  ).toContainText("Pending Activation");
  await page
    .getByRole("button", { name: "Generate Invitation", exact: true })
    .click();
  const link = page.getByRole("link", {
    name: "Open demonstration activation link",
    exact: true,
  });
  await expect(link).toBeVisible();
  const href = (await link.getAttribute("href"))!;
  await auditLogout(page);
  await page.goto(href);
  await page.locator("[name=studentNumber]").fill(studentNumber);
  await page.locator("[name=password]").fill(auditPassword);
  await page.locator("[name=confirmPassword]").fill(auditPassword);
  await page
    .getByRole("button", { name: "Activate Account", exact: true })
    .click();
  await expect(
    page.getByText("Existing pre-registered account activated.", {
      exact: false,
    }),
  ).toBeVisible();
  await auditLogin(page);
  await page.goto(`/dashboard/students/${id}`);
  await expect(
    page
      .locator("dt")
      .filter({ hasText: /^Account status$/ })
      .locator(".."),
  ).toContainText("Active");
}
export async function postingFields(page: Page, hours = "486") {
  await page.locator("[name=location]").fill("Synthetic City");
  await page.locator("[name=modality]").selectOption("Hybrid");
  await page.locator("[name=requiredHours]").fill(hours);
  await page.locator("[name=qualifications]").fill("Academic enrollment");
  await page.locator("[name=skills]").fill("Synthetic communication skills");
  await page
    .locator("[name=responsibilities]")
    .fill("Synthetic academic internship activities");
}
export async function stagedPostingApproval(
  page: Page,
  companyId: string,
  opportunityId: string,
  supervisorId: string,
) {
  const adminEmail = `admin-${companyId}@example.test`;
  await page.goto(`/dashboard/partners/${companyId}/supervisors/create`);
  await page.locator("[name=role]").selectOption("Company Supervisor");
  await page.locator("[name=name]").fill("Synthetic Company Administrator");
  await page.locator("[name=email]").fill(adminEmail);
  await page.locator("[name=phone]").fill("000-555-0198");
  await page
    .getByRole("button", { name: "Save supervisor", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText(
    "Synthetic Company Administrator",
  );
  await auditLogout(page);
  await auditLogin(page, adminEmail);
  await page.goto(`/dashboard/internships/${opportunityId}`);
  await page
    .locator("[name=remarks]")
    .fill("Company reviewed this synthetic posting");
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
  await auditLogout(page);
  await auditLogin(page);
  await page.goto(`/dashboard/internships/${opportunityId}`);
  await page
    .locator("[name=remarks]")
    .fill("Coordinator reviewed this synthetic posting");
  await page
    .getByRole("button", {
      name: "Save Coordinator Posting Decision",
      exact: true,
    })
    .click();
  await expect(page.locator(".feature-header")).toContainText("Approved");
  await auditLogout(page);
  await auditLogin(page, adminEmail);
  await page.goto(`/dashboard/internships/${opportunityId}`);
  await page
    .getByRole("button", { name: "Activate Posting", exact: true })
    .click();
  await auditConfirm(page);
  await expect(page.locator(".feature-header")).toContainText("Active");
  await auditLogout(page);
  await auditLogin(page);
  await page.goto(`/dashboard/internships/${opportunityId}`);
}
