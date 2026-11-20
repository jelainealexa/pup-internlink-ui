import { test, expect } from "@playwright/test";
import {
  auditLogin,
  auditLogout,
  auditSnapshot,
  auditDay,
} from "./audit-helpers";

test("updated portal metrics derive from company and assignment records, and phase tabs support keyboard", async ({
  page,
}) => {
  await auditLogin(page);
  const db = await auditSnapshot(page);
  const year =
    String(new Date().getUTCFullYear()) +
    "-" +
    String(new Date().getUTCFullYear() + 1);
  const company = (p: (typeof db.placements)[number]) =>
    db.opportunities.find(
      (o) =>
        o.id ===
        db.applications.find((a) => a.id === p.applicationId)!.opportunityId,
    )!.companyId;
  const metric = async (label: string, total: number) => {
    const a = page.locator(".metric-links a").filter({
      hasText: new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"),
    });
    await expect(a).toHaveCount(1);
    await expect(a.locator("strong")).toHaveText(String(total));
    return a;
  };
  const eligible = (id: string) => {
    const c = db.companies.find((c) => c.id === id)!;
    return c.approved && c.moaStart <= auditDay() && c.moaEnd >= auditDay();
  };
  await metric(
    "Active companies",
    db.companies.filter((c) => c.academicYear === year && eligible(c.id))
      .length,
  );
  await metric(
    "Expired MOAs",
    db.companies.filter(
      (c) =>
        c.academicYear === year &&
        c.approved &&
        c.moaStart <= auditDay() &&
        c.moaEnd < auditDay(),
    ).length,
  );
  await page.goto("/dashboard/faculty/fac-1/edit");
  await page.locator("[name=name]").fill("Revised Synthetic Adviser");
  await page.getByRole("button", { name: "Save Faculty", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("Revised Synthetic Adviser");
  await auditLogout(page);
  await auditLogin(page, "company@example.test");
  const opps = db.opportunities.filter(
      (o) => o.companyId === "company-1" && o.academicYear === year,
    ),
    ps = db.placements.filter(
      (p) => company(p) === "company-1" && p.academicYear === year,
    );
  const allocated = (id: string) =>
    db.placements.filter(
      (p) =>
        p.status !== "Terminated" &&
        db.applications.find((a) => a.id === p.applicationId)!.opportunityId ===
          id,
    ).length;
  await metric("Total internship opportunities", opps.length);
  await metric(
    "Pending internship posting approvals",
    opps.filter((o) => o.status.startsWith("Pending Approval")).length,
  );
  await metric(
    "Approved internship postings",
    opps.filter((o) => o.status === "Approved").length,
  );
  await metric(
    "Active internship postings",
    opps.filter((o) => o.status === "Active" && allocated(o.id) < o.capacity)
      .length,
  );
  await metric(
    "Total available internship slots",
    opps
      .filter(
        (o) =>
          o.status === "Active" &&
          eligible(o.companyId) &&
          o.supervisorIds?.some((id) => {
            const s = db.supervisors.find((s) => s.id === id)!;
            return db.accounts.find((a) => a.id === s.accountId)!.active;
          }),
      )
      .reduce((n, o) => n + Math.max(0, o.capacity - allocated(o.id)), 0),
  );
  await metric(
    "Total Intern Supervisors",
    db.supervisors.filter(
      (s) =>
        s.companyId === "company-1" &&
        db.accounts.find((a) => a.id === s.accountId)!.role ===
          "Intern Supervisor",
    ).length,
  );
  await metric(
    "Total current interns",
    ps.filter((p) => p.status === "Ongoing").length,
  );
  await (await metric("Total internship opportunities", opps.length)).click();
  await expect(page.locator("tbody tr")).toHaveCount(opps.length);
  await page.goto("/dashboard/faculty");
  await expect(
    page.getByRole("heading", { name: "Access denied", exact: true }),
  ).toBeVisible();
  await auditLogout(page);
  await auditLogin(page, "faculty@example.test");
  const students = db.students.filter(
    (s) => s.adviserId === "fac-1" && s.academicYear === year,
  );
  const facultyPs = db.placements.filter(
    (p) => p.adviserId === "fac-1" && p.academicYear === year,
  );
  await metric("Total assigned students", students.length);
  await metric(
    "Active internship placements",
    facultyPs.filter((p) => p.status === "Ongoing").length,
  );
  await metric(
    "Completed internship placements",
    facultyPs.filter((p) => p.status === "Completed").length,
  );
  await (await metric("Total assigned students", students.length)).click();
  await expect(page.locator("tbody tr")).toHaveCount(students.length);
  await page.goto("/dashboard/faculty/create");
  await expect(
    page.getByRole("heading", { name: "Access denied", exact: true }),
  ).toBeVisible();
  await auditLogout(page);
  await auditLogin(page, "supervisor@example.test");
  const assigned = new Set(
    db.opportunities
      .filter(
        (o) =>
          o.academicYear === year && o.supervisorIds?.includes("supervisor-1"),
      )
      .map((o) => o.id),
  );
  const apps = db.applications.filter(
    (a) => a.academicYear === year && assigned.has(a.opportunityId),
  );
  await metric("Total assigned internship opportunities", assigned.size);
  await metric("Total applications received", apps.length);
  for (const status of ["Pending", "Accepted", "Rejected"]) {
    await metric(
      status + " applications",
      apps.filter((a) => a.status === status).length,
    );
  }
  await (await metric("Total applications received", apps.length)).click();
  await expect(page.locator("tbody tr")).toHaveCount(apps.length);
  await page.goto(
    "/dashboard/partners/company-1/supervisors/supervisor-1/edit",
  );
  await page.locator("[name=phone]").fill("000-555-0177");
  await page
    .getByRole("button", { name: "Save supervisor", exact: true })
    .click();
  await expect(page.locator("dl")).toContainText("000-555-0177");
  await page.reload();
  await expect(page.locator("dl")).toContainText("000-555-0177");
  await auditLogout(page);
  await auditLogin(page, "student@example.test");
  await page.goto("/dashboard/requirements");
  const before = page.getByRole("tab", {
    name: "Before Internship",
    exact: true,
  });
  await before.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "During Internship", exact: true }),
  ).toBeFocused();
  await expect(page).toHaveURL(/phase=During/);
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "After Internship", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.reload();
  await expect(
    page.getByRole("tab", { name: "After Internship", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
});
