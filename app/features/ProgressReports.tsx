"use client";
import Link from "next/link";
import {
  PageHeader,
  Search,
  Filter,
  Table,
  options,
  useFilters,
} from "../components/ui";
import { companyFor, get, nameOf, studentFor, reviewState } from "../lib/rules";
import {
  accountName,
  matches,
  searchMatches,
  useData,
  useYear,
} from "./shared";
export function ProgressReports() {
  const { db } = useData(),
    filters = useFilters(),
    year = useYear();
  const rows = db.reports.filter((r) => {
    const p = get(db.placements, r.placementId),
      s = studentFor(db, p);
    return (
      p.academicYear === year &&
      searchMatches(filters.value("q"), nameOf(s), s.studentNumber, r.tasks) &&
      matches(filters.value("student"), s.id) &&
      matches(filters.value("company"), companyFor(db, p).id) &&
      matches(filters.value("adviser"), p.adviserId) &&
      matches(filters.value("status"), p.status) &&
      matches(filters.value("reportStatus"), reviewState(r.status))
    );
  });
  return (
    <>
      <PageHeader
        title="Submitted Progress Reports"
        description="Company-based monitoring of reported work, supervisor decisions and separate faculty remarks"
      >
        <Link href="/dashboard/progress">Placement progress summary</Link>
      </PageHeader>
      <div className="filter-panel">
        <Search placeholder="Student, ID or reported activities" />
        <Filter
          name="company"
          label="Company"
          choices={db.companies.map((c) => ({ value: c.id, label: c.name }))}
        />
        <Filter
          name="adviser"
          label="Faculty adviser"
          choices={db.faculty.map((f) => ({
            value: f.id,
            label: accountName(db, f.accountId),
          }))}
        />
        <Filter
          name="reportStatus"
          label="Report approval status"
          choices={options(["Pending", "Approved", "Rejected"])}
        />
        <Filter
          name="status"
          label="Placement status"
          choices={options(["Ongoing", "Completed", "Terminated"])}
        />
        <Link
          className="secondary-action"
          href="/dashboard/progress?view=reports"
        >
          Reset filters
        </Link>
      </div>
      <Table
        headers={[
          "Report",
          "Student",
          "Company",
          "Period",
          "Tasks / activities",
          "Rendered report hours",
          "Submitted",
          "Supervisor approval",
          "Supervisor remarks",
          "Faculty monitoring remarks",
          "Actions",
        ]}
        rows={rows.map((r) => {
          const p = get(db.placements, r.placementId);
          return [
            r.id,
            nameOf(studentFor(db, p)),
            companyFor(db, p).name,
            `${r.workDate}${r.periodEnd ? ` – ${r.periodEnd}` : ""}`,
            r.tasks,
            r.hours,
            r.submittedAt,
            reviewState(r.status),
            r.remarks,
            (r.facultyRemarks ?? [])
              .map((m) => `${accountName(db, m.actorId)}: ${m.text}`)
              .join("; "),
            <Link key={r.id} href={`/dashboard/progress/reports/${r.id}`}>
              View / Review report
            </Link>,
          ];
        })}
      />
    </>
  );
}
