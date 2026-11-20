import { Database } from "./domain";
import {
  companyFor,
  get,
  hours,
  nameOf,
  partnership,
  remainingSlots,
  studentFor,
  studentStatus,
  sumHours,
} from "./rules";

export const reportCategories = [
  "Students",
  "Industry Partners",
  "Opportunities",
  "Applications",
  "Placements",
  "Progress",
  "Evaluations",
] as const;
export type ReportCategory = (typeof reportCategories)[number];
export interface ReportFilters {
  category: ReportCategory;
  academicYear: string;
  companyId: string;
  status: string;
}
export interface GeneratedReport {
  filters: ReportFilters;
  generatedAt: string;
  revision: number;
  headers: string[];
  rows: (string | number)[][];
  totals: Record<string, number>;
}
export function generateReport(
  db: Database,
  filters: ReportFilters,
  now = new Date().toISOString(),
): GeneratedReport {
  const sameYear = (year: string) =>
    !filters.academicYear || year === filters.academicYear;
  const companyMatches = (id: string) =>
    !filters.companyId || filters.companyId === id;
  const statusMatches = (status: string) =>
    !filters.status || filters.status.toLowerCase() === status.toLowerCase();
  const person = (id: string) =>
    db.accounts.find((a) => a.id === id)?.name ?? "—";
  let headers: string[] = [],
    rows: (string | number)[][] = [],
    totals: Record<string, number> = {};
  switch (filters.category) {
    case "Students": {
      headers = [
        "Student ID",
        "Student",
        "Email",
        "Program",
        "Year level",
        "Section",
        "Status",
        "Academic year",
      ];
      rows = db.students
        .filter(
          (s) =>
            sameYear(s.academicYear) &&
            statusMatches(studentStatus(db, s.id)) &&
            (!filters.companyId ||
              db.placements.some(
                (p) =>
                  studentFor(db, p).id === s.id &&
                  companyFor(db, p).id === filters.companyId,
              )),
        )
        .map((s) => [
          s.studentNumber,
          nameOf(s),
          s.email,
          s.program,
          s.yearLevel,
          s.section,
          studentStatus(db, s.id),
          s.academicYear,
        ]);
      break;
    }
    case "Industry Partners": {
      headers = [
        "Company",
        "Industry",
        "Email",
        "MOA start",
        "MOA end",
        "Status",
        "Academic year",
      ];
      rows = db.companies
        .filter(
          (c) =>
            sameYear(c.academicYear) &&
            companyMatches(c.id) &&
            statusMatches(partnership(db, c.id, now.slice(0, 10))),
        )
        .map((c) => [
          c.name,
          c.industry,
          c.email,
          c.moaStart,
          c.moaEnd,
          partnership(db, c.id, now.slice(0, 10)),
          c.academicYear,
        ]);
      break;
    }
    case "Opportunities": {
      headers = [
        "Opportunity",
        "Company",
        "Capacity",
        "Remaining slots",
        "Status",
        "Academic year",
      ];
      const selected = db.opportunities.filter(
        (o) =>
          sameYear(o.academicYear) &&
          companyMatches(o.companyId) &&
          statusMatches(o.status),
      );
      rows = selected.map((o) => [
        o.title,
        get(db.companies, o.companyId).name,
        o.capacity,
        remainingSlots(db, o.id),
        o.status,
        o.academicYear,
      ]);
      totals = {
        "Total capacity": selected.reduce((sum, o) => sum + o.capacity, 0),
        "Remaining slots": selected.reduce(
          (sum, o) => sum + remainingSlots(db, o.id),
          0,
        ),
      };
      break;
    }
    case "Applications": {
      headers = [
        "Application",
        "Student ID",
        "Student",
        "Opportunity",
        "Company",
        "Date",
        "Status",
        "Academic year",
      ];
      rows = db.applications
        .filter(
          (a) =>
            sameYear(a.academicYear) &&
            companyMatches(get(db.opportunities, a.opportunityId).companyId) &&
            statusMatches(a.status),
        )
        .map((a) => [
          a.id,
          get(db.students, a.studentId).studentNumber,
          nameOf(get(db.students, a.studentId)),
          get(db.opportunities, a.opportunityId).title,
          get(db.companies, get(db.opportunities, a.opportunityId).companyId)
            .name,
          a.submittedAt,
          a.status,
          a.academicYear,
        ]);
      break;
    }
    case "Placements":
    case "Progress": {
      const selected = db.placements.filter(
        (p) =>
          sameYear(p.academicYear) &&
          companyMatches(companyFor(db, p).id) &&
          statusMatches(p.status),
      );
      headers = [
        "Placement",
        "Student ID",
        "Student",
        "Company",
        "Status",
        "Start",
        "End",
        "Required hours",
        "Rendered hours",
        "Approved hours",
        "Remaining hours",
        "Completion percent",
        "Academic year",
      ];
      rows = selected.map((p) => {
        const h = hours(db, p.id);
        return [
          p.id,
          studentFor(db, p).studentNumber,
          nameOf(studentFor(db, p)),
          companyFor(db, p).name,
          p.status,
          p.startDate,
          p.endDate,
          p.requiredHours,
          h.submitted,
          h.reviewed,
          h.remaining,
          h.percent,
          p.academicYear,
        ];
      });
      totals = {
        "Required hours": sumHours(selected.map((p) => p.requiredHours)),
        "Rendered hours": sumHours(
          selected.map((p) => hours(db, p.id).submitted),
        ),
        "Approved hours": sumHours(
          selected.map((p) => hours(db, p.id).reviewed),
        ),
      };
      break;
    }
    case "Evaluations": {
      headers = [
        "Evaluation",
        "Student",
        "Company",
        "Placement",
        "Evaluator",
        "Role",
        "Date",
        "Score",
        "Comments",
        "Status",
        "Academic year",
      ];
      const selected = db.evaluations.filter((e) => {
        const p = get(db.placements, e.placementId);
        return (
          sameYear(p.academicYear) &&
          companyMatches(companyFor(db, p).id) &&
          statusMatches(e.status)
        );
      });
      rows = selected.map((e) => {
        const p = get(db.placements, e.placementId);
        return [
          e.id,
          nameOf(studentFor(db, p)),
          companyFor(db, p).name,
          p.id,
          person(e.evaluatorId),
          get(db.accounts, e.evaluatorId).role,
          e.submittedAt ?? "",
          e.grade ?? "",
          e.comments ?? "",
          e.status,
          p.academicYear,
        ];
      });
      const scored = selected.filter((e) => e.grade !== undefined);
      totals = {
        "Submitted evaluations": selected.filter(
          (e) => e.status === "Submitted",
        ).length,
        ...(scored.length
          ? {
              "Mean demonstration score":
                Math.round(
                  (scored.reduce((sum, e) => sum + e.grade!, 0) /
                    scored.length) *
                    100,
                ) / 100,
            }
          : {}),
      };
      break;
    }
  }
  return {
    filters: { ...filters },
    generatedAt: now,
    revision: db.revision,
    headers,
    rows,
    totals: { Records: rows.length, ...totals },
  };
}
export function csvCell(value: string | number): string {
  let text = String(value);
  if (typeof value === "string" && /^[\s]*[=+\-@\t\r]/.test(text))
    text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
export function reportCsv(report: GeneratedReport): string {
  return (
    "\uFEFF" +
    [report.headers, ...report.rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\r\n") +
    "\r\n"
  );
}
