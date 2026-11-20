import { expect, test, Page } from "@playwright/test";
import type { Database, Placement } from "../../app/lib/domain";
import {
  auditDay,
  auditLogin,
  auditLogout,
  auditSnapshot,
} from "./audit-helpers";

type Row = {
  label: string;
  fields: Record<string, string>;
  hours?: number;
  start?: string;
  end?: string;
};
function oracle(db: Database, section: string): Row[] {
  const student = (id: string) => db.students.find((s) => s.id === id)!;
  const name = (id: string) => {
    const s = student(id);
    return `${s.firstName} ${s.lastName}`;
  };
  const application = (p: Placement) =>
    db.applications.find((a) => a.id === p.applicationId)!;
  const company = (p: Placement) =>
    db.opportunities.find((o) => o.id === application(p).opportunityId)!
      .companyId;
  const reviewed = (p: Placement) =>
    db.reports
      .filter(
        (r) =>
          r.placementId === p.id && ["Reviewed", "Approved"].includes(r.status),
      )
      .reduce((n, r) => n + r.hours, 0);
  const placements = (id: string) =>
    db.placements.filter((p) => application(p).studentId === id);
  const status = (id: string) => {
    const ps = placements(id);
    if (ps.some((p) => p.status === "Ongoing")) return "Ongoing";
    if (ps.some((p) => p.status === "Completed")) return "Completed";
    const apps = db.applications.filter((a) => a.studentId === id);
    if (
      apps.some(
        (a) =>
          a.status === "Accepted" &&
          !db.placements.some((p) => p.applicationId === a.id),
      )
    )
      return "Awaiting Placement";
    if (apps.some((a) => a.status === "Pending")) return "Applying";
    return ps.length ? "Terminated" : "Not Yet Placed";
  };
  const partnership = (id: string) => {
    const c = db.companies.find((c) => c.id === id)!;
    const today = auditDay();
    if (!c.approved || c.moaStart > today) return "Pending";
    if (c.moaEnd < today) return "Expired";
    return (Date.parse(c.moaEnd) - Date.parse(today)) / 86400000 <= 30
      ? "Expiring Soon"
      : "Active";
  };
  if (section === "students")
    return db.students.map((s) => ({
      label: s.studentNumber,
      hours: placements(s.id).reduce((n, p) => n + reviewed(p), 0),
      fields: {
        q: name(s.id) + " " + s.studentNumber,
        program: s.program,
        yearLevel: s.yearLevel,
        section: s.section,
        status: status(s.id),
        activation:
          db.accounts.find((a) => a.id === s.accountId)!.activationState ??
          (db.accounts.find((a) => a.id === s.accountId)!.active
            ? "Active"
            : "Deactivated"),
        adviser: s.adviserId ?? "",
        company: placements(s.id).map(company).join("|"),
        name: name(s.id),
      },
    }));
  if (section === "partners")
    return db.companies.map((c) => ({
      label: c.name,
      end: c.moaEnd,
      fields: { q: c.name, industry: c.industry, status: partnership(c.id) },
    }));
  if (section === "internships")
    return db.opportunities.map((o) => {
      const allocated = db.placements.filter(
        (p) =>
          p.status !== "Terminated" && application(p).opportunityId === o.id,
      ).length;
      const eligible =
        o.status === "Active" &&
        ["Active", "Expiring Soon"].includes(partnership(o.companyId)) &&
        o.capacity > allocated &&
        (o.supervisorIds ?? []).some((id) => {
          const s = db.supervisors.find((s) => s.id === id)!;
          const a = db.accounts.find((a) => a.id === s.accountId)!;
          return a.active && a.role === "Intern Supervisor";
        });
      return {
        label: o.title,
        fields: {
          q:
            o.title +
            " " +
            db.companies.find((c) => c.id === o.companyId)!.name,
          company: o.companyId,
          status:
            o.status === "Active" && allocated >= o.capacity
              ? "Filled"
              : o.status,
          location: o.location ?? "Not specified",
          modality: o.modality ?? "Not specified",
          hours: String(o.requiredHours ?? ""),
          available: eligible ? "true" : "false",
        },
      };
    });
  if (section === "applications")
    return db.applications.map((a) => ({
      label: a.id,
      start: a.submittedAt,
      fields: {
        q: name(a.studentId) + " " + student(a.studentId).studentNumber,
        student: a.studentId,
        company: db.opportunities.find((o) => o.id === a.opportunityId)!
          .companyId,
        opportunity: a.opportunityId,
        status: a.status,
      },
    }));
  if (section === "placements" || section === "progress")
    return db.placements.map((p) => ({
      label: section === "progress" ? name(application(p).studentId) : p.id,
      start: p.startDate,
      end: p.endDate,
      fields: {
        q:
          name(application(p).studentId) +
          " " +
          (section === "progress"
            ? student(application(p).studentId).studentNumber
            : p.id),
        student: application(p).studentId,
        company: company(p),
        adviser: p.adviserId,
        status: p.status,
        near:
          p.status === "Ongoing" && reviewed(p) / p.requiredHours >= 0.75
            ? "true"
            : "false",
        review: db.reports.some(
          (r) =>
            r.placementId === p.id &&
            ["Pending Review", "Pending"].includes(r.status),
        )
          ? "pending"
          : "none",
      },
    }));
  if (section === "evaluations")
    return db.evaluations.map((e) => {
      const p = db.placements.find((p) => p.id === e.placementId)!,
        account = db.accounts.find((a) => a.id === e.evaluatorId)!;
      return {
        label: e.id,
        fields: {
          q: name(application(p).studentId) + " " + account.name + " " + p.id,
          student: application(p).studentId,
          placementStatus: p.status,
          status: e.status,
          role: account.role,
          evaluator: e.evaluatorId,
        },
      };
    });
  if (section === "requirements")
    return db.requirements.map((r) => ({
      label: r.name,
      fields: {
        q: r.name + " " + r.description,
        classification: r.classification,
        phase: r.phase ?? "Before Internship",
      },
    }));
  return db.submissions.map((s) => ({
    label: s.id,
    start: s.submittedAt,
    fields: {
      q:
        name(s.studentId) +
        " " +
        student(s.studentId).studentNumber +
        " " +
        db.requirements.find((r) => r.id === s.requirementId)!.name,
      status: s.status,
      phase:
        db.requirements.find((r) => r.id === s.requirementId)!.phase ??
        "Before Internship",
      attempt: db.submissions
        .filter(
          (r) =>
            r.studentId === s.studentId && r.requirementId === s.requirementId,
        )
        .every((r) => r.attempt <= s.attempt)
        ? "latest"
        : "old",
    },
  }));
}
async function labels(page: Page) {
  return page.locator("tbody tr td:first-child").allTextContents();
}
async function assertSet(page: Page, rows: Row[]) {
  await expect
    .poll(async () => (await labels(page)).sort())
    .toEqual(rows.map((r) => r.label).sort());
}
for (const section of [
  "students",
  "partners",
  "internships",
  "applications",
  "placements",
  "progress",
  "evaluations",
  "requirements",
  "submissions",
]) {
  test(`independent directory matrix: ${section} every filter option, search, reset, sort and refresh`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    await auditLogin(page);
    const base =
      section === "submissions"
        ? "/dashboard/requirements?view=submissions"
        : `/dashboard/${section}`;
    await page.goto(base);
    const expected = oracle(await auditSnapshot(page), section);
    await assertSet(page, expected);
    const keys: Record<string, string> = {
      Program: "program",
      "Activation status": "activation",
      "Assigned adviser": "adviser",
      Location: "location",
      Modality: "modality",
      "Required hours": "hours",
      "Internship phase": "phase",
      "Year level": "yearLevel",
      Section: "section",
      Status: "status",
      "Sort by": "sort",
      Industry: "industry",
      "Partnership status": "status",
      Company: "company",
      Availability: "available",
      Student: "student",
      Opportunity: "opportunity",
      "Submission date": "sort",
      "Faculty adviser": "adviser",
      "Placement status":
        section === "evaluations" ? "placementStatus" : "status",
      "Sort dates": "sort",
      "Completion focus": "near",
      "Review queue": "review",
      "Evaluation status": "status",
      "Evaluator role": "role",
      "Assigned evaluator": "evaluator",
      Classification: "classification",
      "Submission attempts": "attempt",
      "Submission status": "status",
    };
    const selectors = (
      await page.locator(".filter-panel select").evaluateAll((els) =>
        els.map((el, index) => ({
          index,
          label: el.parentElement!.querySelector("label")!.textContent!,
          options: Array.from((el as HTMLSelectElement).options)
            .map((o) => o.value)
            .filter(Boolean),
        })),
      )
    ).map((s) => ({ ...s, name: keys[s.label] }));
    for (const select of selectors) {
      for (const value of select.options) {
        await page.goto(base);
        await page
          .locator(".filter-panel select")
          .nth(select.index)
          .selectOption(value);
        await expect(page).toHaveURL(new RegExp(`${select.name}=`));
        if (select.name === "sort") {
          const ordered = [...expected].sort((a, b) => {
            if (section === "students")
              return value === "hours"
                ? b.hours! - a.hours!
                : value === "id"
                  ? a.label.localeCompare(b.label)
                  : a.fields.name.localeCompare(b.fields.name);
            if (section === "partners")
              return value === "expiration"
                ? a.end!.localeCompare(b.end!)
                : a.label.localeCompare(b.label);
            if (section === "applications")
              return value === "oldest"
                ? a.start!.localeCompare(b.start!)
                : b.start!.localeCompare(a.start!);
            return value === "start-oldest"
              ? a.start!.localeCompare(b.start!)
              : value === "end-oldest"
                ? a.end!.localeCompare(b.end!)
                : value === "end-newest"
                  ? b.end!.localeCompare(a.end!)
                  : b.start!.localeCompare(a.start!);
          });
          await expect
            .poll(() => labels(page))
            .toEqual(ordered.map((r) => r.label));
        } else
          await assertSet(
            page,
            expected.filter((r) =>
              select.name === "status" && value === "Eligible"
                ? ["Active", "Expiring Soon"].includes(r.fields.status)
                : select.name === "status" && value === "Pending (all stages)"
                  ? r.fields.status.startsWith("Pending Approval")
                  : select.name === "company" && section === "students"
                    ? r.fields.company.split("|").includes(value)
                    : r.fields[select.name] === value,
            ),
          );
        await page.reload();
        await expect(
          page.locator(".filter-panel select").nth(select.index),
        ).toHaveValue(value);
      }
    }
    await page.goto(base);
    const query = expected[0].fields.q.split(" ")[0];
    await page.getByRole("searchbox").fill(query);
    await assertSet(
      page,
      expected.filter((r) =>
        r.fields.q.toLowerCase().includes(query.toLowerCase()),
      ),
    );
    await page.getByRole("searchbox").fill("no-independent-record-match");
    await expect(
      page.getByText("No records match these filters."),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Reset filters", exact: true })
      .click();
    if (section === "submissions")
      await page
        .getByRole("link", { name: "Student submissions", exact: true })
        .click();
    await assertSet(page, expected);
  });
}

test("independent settings: computed styles, all reminder effects, persisted year and landing preference", async ({
  page,
}) => {
  await auditLogin(page);
  await page.goto("/dashboard/students");
  const originalPadding = await page
    .locator("td")
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).paddingTop));
  await page.goto("/dashboard/settings");
  for (const name of [
    "requirementAlerts",
    "evaluationAlerts",
    "progressAlerts",
    "partnershipAlerts",
  ])
    await page.locator(`[name=${name}]`).uncheck();
  await page.locator("[name=largerText]").check();
  await page.locator("[name=reduceMotion]").check();
  await page.locator("[name=density]").selectOption("Compact");
  await page.locator("[name=landingPage]").selectOption("/dashboard/students");
  await page
    .getByRole("button", { name: "Save Preferences", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Preferences saved");
  await page.reload();
  await expect(page.locator("[name=largerText]")).toBeChecked();
  await expect(page.locator("[name=reduceMotion]")).toBeChecked();
  expect(
    await page
      .locator("input")
      .first()
      .evaluate((el) => getComputedStyle(el).fontSize),
  ).toBe("16px");
  expect(
    await page
      .locator("button")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  await page.goto("/dashboard/students");
  expect(
    await page
      .locator("td")
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).paddingTop)),
  ).toBeLessThan(originalPadding);
  await page.goto("/dashboard");
  await expect(
    page
      .getByRole("heading", { name: "Needs attention", exact: true })
      .locator("..")
      .locator("a"),
  ).toHaveCount(0);
  for (const [setting, label] of [
    ["requirementAlerts", "Pending requirement reviews"],
    ["evaluationAlerts", "Pending evaluations"],
    ["progressAlerts", "Pending progress reviews"],
    ["partnershipAlerts", "Expiring partnerships (30 days)"],
  ]) {
    await page.goto("/dashboard/settings");
    await page.locator(`[name=${setting}]`).check();
    await page
      .getByRole("button", { name: "Save Preferences", exact: true })
      .click();
    await page.goto("/dashboard");
    await expect(page.getByRole("link").filter({ hasText: label })).toHaveCount(
      1,
    );
  }
  await page.goto("/dashboard/settings");
  await page.locator("[name=academicYear]").selectOption("2025-2026");
  await page
    .getByRole("button", { name: "Save Preferences", exact: true })
    .click();
  await page.goto("/dashboard/students");
  await expect(page.getByText("No records match these filters.")).toBeVisible();
  await auditLogout(page);
  await auditLogin(page);
  await expect(page).toHaveURL(/dashboard\/students$/);
  await expect(page.getByText("No records match these filters.")).toBeVisible();
});
