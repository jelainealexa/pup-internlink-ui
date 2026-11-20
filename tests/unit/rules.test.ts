import { beforeEach, describe, expect, it } from "vitest";
import { Database } from "../../app/lib/domain";
import { createSeed } from "../../app/lib/seed";
import { applyCommand } from "../../app/lib/commands";
import {
  completionProblems,
  dateRange,
  email,
  hours,
  missingRequirements,
  partnership,
  positive,
  remainingSlots,
  reportingGap,
  required,
} from "../../app/lib/rules";
import {
  csvCell,
  generateReport,
  reportCsv,
  reportCategories,
} from "../../app/lib/reporting";
import { now } from "../helpers";
let db: Database;
beforeEach(async () => {
  db = await createSeed(now);
});
describe("validation and derived business rules", () => {
  it.each(["", "   ", "x".repeat(501)])(
    "rejects missing/oversize required strings %j",
    (value) => {
      expect(() => required(value, "Name")).toThrow();
    },
  );
  it("trims required strings and normalizes email", () => {
    expect(required(" Sample ", "Name")).toBe("Sample");
    expect(email(" DEMO@EXAMPLE.TEST ")).toBe("demo@example.test");
  });
  it.each(["broken", "a @example.test", "a@b", ""])(
    "rejects invalid email %j",
    (value) => {
      expect(() => email(value)).toThrow();
    },
  );
  it.each([0, -1, NaN, Infinity, 10001])(
    "rejects invalid required hours %j",
    (value) => {
      expect(() => positive(value, "Hours")).toThrow();
    },
  );
  it("rejects noninteger capacity", () => {
    expect(() => positive(1.5, "Capacity", 10000, true)).toThrow();
  });
  it.each([
    ["2026-12-02", "2026-12-01"],
    ["2026-02-30", "2026-03-02"],
    ["", "2026-12-01"],
  ])("rejects invalid date range %s/%s", (a, b) => {
    expect(() => dateRange(a, b)).toThrow();
  });
  it("accepts same-day placements under demo policy", () => {
    expect(() => dateRange("2026-12-01", "2026-12-01")).not.toThrow();
  });
  it("computes all four partnership states with an inclusive 30-day window", () => {
    expect(
      db.companies.map((c) => partnership(db, c.id, "2026-11-19")),
    ).toEqual(["Active", "Expiring Soon", "Pending", "Expired"]);
    db.companies[0].moaEnd = "2026-12-19";
    expect(partnership(db, "company-1", "2026-11-19")).toBe("Expiring Soon");
  });
  it("derives reviewed and submitted totals separately", () => {
    expect(hours(db, "PL-001")).toEqual({
      submitted: 16,
      reviewed: 8,
      remaining: 72,
      percent: 10,
    });
  });
  it("implements the PDF's 243/486 example and safe zero guard", () => {
    db.placements[0].requiredHours = 486;
    db.reports[0].hours = 243;
    expect(hours(db, "PL-001").percent).toBe(50);
    db.placements[0].requiredHours = 0;
    expect(hours(db, "PL-001").percent).toBe(0);
  });
  it("does not equate placement labels with evaluations or certificate existence", () => {
    expect(completionProblems(db, "PL-001").length).toBeGreaterThan(0);
    expect(completionProblems(db, "PL-002")).toEqual([]);
  });
  it("only consumes capacity for non-terminated placements", () => {
    expect(remainingSlots(db, "opp-1")).toBe(1);
    expect(remainingSlots(db, "opp-2")).toBe(1);
  });
  it("requires approved current mandatory submissions", () => {
    expect(missingRequirements(db, "2024-0005")).toHaveLength(2);
    expect(missingRequirements(db, "2024-0001")).toHaveLength(0);
  });
  it("flags a seven-day reporting gap only for ongoing placements", () => {
    expect(reportingGap(db, db.placements[0], "2026-12-01")).toBe(true);
    expect(reportingGap(db, db.placements[1], "2026-12-01")).toBe(false);
  });
  it("seed has unique IDs and valid normalized relations", () => {
    for (const collection of [
      db.accounts,
      db.students,
      db.companies,
      db.opportunities,
      db.applications,
      db.placements,
      db.reports,
      db.evaluations,
    ])
      expect(new Set(collection.map((x) => x.id)).size).toBe(collection.length);
    for (const p of db.placements) {
      const a = db.applications.find((a) => a.id === p.applicationId)!;
      const o = db.opportunities.find((o) => o.id === a.opportunityId)!;
      expect(
        db.supervisors.find((s) => s.id === p.supervisorId)?.companyId,
      ).toBe(o.companyId);
      expect(db.evaluations.filter((e) => e.placementId === p.id)).toHaveLength(
        2,
      );
      expect(hours(db, p.id).reviewed).toBeGreaterThanOrEqual(0);
    }
    expect(
      db.reports.every((r) =>
        db.placements.some(
          (p) =>
            p.id === r.placementId &&
            r.workDate >= p.startDate &&
            r.workDate <= p.endDate,
        ),
      ),
    ).toBe(true);
  });
});
describe("report calculations and escaping", () => {
  it.each(reportCategories)("generates %s from records", (category) => {
    const r = generateReport(
      db,
      { category, academicYear: "2026-2027", companyId: "", status: "" },
      now.toISOString(),
    );
    expect(r.rows.length).toBeGreaterThan(0);
    expect(r.totals.Records).toBe(r.rows.length);
    expect(r.rows.every((row) => row.length === r.headers.length)).toBe(true);
  });
  it("filters report rows and totals together", () => {
    const r = generateReport(db, {
      category: "Progress",
      academicYear: "2026-2027",
      companyId: "company-1",
      status: "Ongoing",
    });
    expect(r.rows).toHaveLength(1);
    expect(r.totals["Approved hours"]).toBe(8);
    expect(reportCsv(r)).toContain('"PL-001"');
    expect(reportCsv(r)).not.toContain('"PL-002"');
  });
  it("returns an honest empty report", () => {
    expect(
      generateReport(db, {
        category: "Students",
        academicYear: "1900-1901",
        companyId: "",
        status: "",
      }).rows,
    ).toEqual([]);
  });
  it.each([
    '=HYPERLINK("x")',
    "+SUM(A1)",
    "-1+2",
    "@SUM(A1)",
    "  =1+1",
    "\t=1+1",
  ])("neutralizes spreadsheet formulas %j", (value) => {
    expect(csvCell(value).startsWith("\"'")).toBe(true);
  });
  it("escapes quotes, commas and newlines without truncation", () => {
    expect(csvCell('a,"b"\nc')).toBe('"a,""b""\nc"');
    expect(csvCell(12)).toBe('"12"');
  });
});
describe("command guard boundaries", () => {
  const run = (
    command: Parameters<typeof applyCommand>[2],
    actor = "coord-1",
  ) =>
    applyCommand(db, actor, command, {
      now: now.toISOString(),
      id: () => crypto.randomUUID(),
      verifier: "synthetic-verifier",
    });
  it("rejects wrong-company supervisor", () => {
    expect(() =>
      run({
        type: "placement.create",
        input: {
          applicationId: "app-002",
          adviserId: "fac-1",
          supervisorId: "supervisor-2",
          startDate: "2026-11-19",
          endDate: "2026-12-01",
          requiredHours: 8,
        },
      }),
    ).toThrow(/belongs/);
  });
  it("rejects third/duplicate/unassigned evaluation submissions", () => {
    expect(() =>
      run(
        {
          type: "evaluation.submit",
          id: "eval-PL-001-faculty-1",
          grade: 90,
          comments: "Synthetic assessment",
        },
        "faculty-2",
      ),
    ).toThrow(/assigned/);
    run(
      {
        type: "evaluation.submit",
        id: "eval-PL-001-faculty-1",
        grade: 90,
        comments: "Synthetic assessment",
      },
      "faculty-1",
    );
    expect(() =>
      run(
        {
          type: "evaluation.submit",
          id: "eval-PL-001-faculty-1",
          grade: 90,
          comments: "Repeat",
        },
        "faculty-1",
      ),
    ).toThrow(/already/);
    expect(
      db.evaluations.filter((e) => e.placementId === "PL-001"),
    ).toHaveLength(2);
  });
  it.each([-1, 101, NaN])("rejects invalid evaluation score %s", (grade) => {
    expect(() =>
      run(
        {
          type: "evaluation.submit",
          id: "eval-PL-001-faculty-1",
          grade,
          comments: "Example",
        },
        "faculty-1",
      ),
    ).toThrow(/between/);
  });
});
