"use client";
import { useState } from "react";
import {
  Field,
  PageHeader,
  SaveForm,
  Table,
  options,
  text,
} from "../components/ui";
import {
  GeneratedReport,
  ReportCategory,
  generateReport,
  reportCategories,
  reportCsv,
} from "../lib/reporting";
import { useData } from "./shared";

export function Reports() {
  const { db, prefs } = useData();
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const years = [
    ...db.students,
    ...db.companies,
    ...db.opportunities,
    ...db.applications,
    ...db.placements,
  ].map((x) => x.academicYear);
  function download() {
    if (!report) return;
    const url = URL.createObjectURL(
      new Blob([reportCsv(report)], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `internlink-${report.filters.category.toLowerCase().replaceAll(" ", "-")}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <PageHeader
        title="Reports & Analytics"
        description="Generate reports from the current saved records. Export uses the exact generated rows; new changes require regenerating the report."
      />
      <div className="no-print">
        <SaveForm
          submit="Generate Report"
          success="Report generated from saved records."
          save={async (data) => {
            setReport(
              generateReport(db, {
                category: text(data, "category") as ReportCategory,
                academicYear: text(data, "academicYear"),
                companyId: text(data, "companyId"),
                status: text(data, "status"),
              }),
            );
          }}
        >
          <div className="form-grid">
            <Field
              label="Report category"
              name="category"
              value="Students"
              options={options([...reportCategories])}
            />
            <Field
              label="Academic year"
              name="academicYear"
              value={prefs.academicYear}
              options={options(years)}
              required={false}
              hint="Leave blank for all academic years."
            />
            <Field
              label="Company"
              name="companyId"
              options={db.companies.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              required={false}
            />
            <Field
              label="Status"
              name="status"
              required={false}
              options={options([
                "Not Yet Placed",
                "Applying",
                "Awaiting Placement",
                "Ongoing",
                "Completed",
                "Terminated",
                "Pending",
                "Active",
                "Expiring Soon",
                "Expired",
                "Pending Approval",
                "Approved",
                "Closed",
                "Accepted",
                "Rejected",
                "Submitted",
              ])}
              hint="Choose a status applicable to the selected report; an incompatible status returns an empty result."
            />
          </div>
        </SaveForm>
      </div>
      {report && (
        <section className="generated-report">
          <h2>{report.filters.category} report</h2>
          <p>
            Generated {new Date(report.generatedAt).toLocaleString()} · Saved
            revision {report.revision} · Year:{" "}
            {report.filters.academicYear || "All"} · Company:{" "}
            {db.companies.find((c) => c.id === report.filters.companyId)
              ?.name ?? "All"}{" "}
            · Status: {report.filters.status || "All"}
          </p>
          <p>Synthetic browser-local demonstration data</p>
          <div className="report-totals">
            {Object.entries(report.totals).map(([label, value]) => (
              <span key={label}>
                <strong>{label}:</strong> {value}
              </span>
            ))}
          </div>
          <div className="action-bar no-print">
            <button className="primary-action" onClick={download}>
              Export CSV
            </button>
            <button className="secondary-action" onClick={() => window.print()}>
              Print report
            </button>
          </div>
          <Table
            headers={report.headers}
            rows={report.rows}
            caption={`${report.filters.category} — ${report.rows.length} records`}
          />
        </section>
      )}
    </>
  );
}
