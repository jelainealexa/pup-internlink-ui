"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Back,
  Details,
  Field,
  Filter,
  Filters,
  HoursMeter,
  Identity,
  MetricLink,
  PageHeader,
  RecordState,
  RowLink,
  SaveForm,
  Search,
  Stack,
  Status,
  Table,
  number,
  options,
  text,
  useFilters,
} from "../components/ui";
import {
  companyFor,
  get,
  hours,
  nameOf,
  reportingGap,
  studentFor,
  reviewState,
} from "../lib/rules";
import {
  FeatureProps,
  accountName,
  matches,
  searchMatches,
  useData,
  useYear,
} from "./shared";
import { WeeklyReport } from "./Attendance";
import { ProgressReports } from "./ProgressReports";

export function Progress({ id, action }: FeatureProps) {
  const { db, account, mutate, setNotice } = useData();
  const router = useRouter(),
    filters = useFilters(),
    year = useYear();
  const canSubmit = ["Coordinator", "Student"].includes(account.role);
  if (action === "weekly-create") return <WeeklyReport />;
  if (action === "create") {
    const replaced = db.reports.find((r) => r.id === filters.value("replace"));
    if (filters.value("replace") && !replaced) return <RecordState />;
    if (!canSubmit) return <RecordState title="Access denied" />;
    if (!db.placements.some((p) => p.status === "Ongoing"))
      return (
        <RecordState
          title="No ongoing placement"
          message="Progress reports can only be submitted for an ongoing placement."
          back="/dashboard/placements"
        />
      );
    return (
      <>
        <Back href="/dashboard/progress">Progress monitoring</Back>
        <PageHeader
          title="Submit progress report"
          description="Alternative daily report, up to 12 hours per date. Use attendance and a weekly report for the updated workflow. Only supervisor-approved hours count toward completion."
        />
        <SaveForm
          revision={db.revision}
          submit="Submit Report"
          cancel="/dashboard/progress"
          save={async (data, revision) => {
            const result = await mutate(
              {
                type: "report.create",
                placementId: text(data, "placementId"),
                workDate: text(data, "workDate"),
                hours: number(data, "hours"),
                tasks: text(data, "tasks"),
                replacesId: replaced?.id,
              },
              undefined,
              revision,
            );
            setNotice("Progress report saved for review.");
            router.push(`/dashboard/progress/reports/${result}`);
          }}
        >
          <div className="form-grid">
            <Field
              label="Placement"
              name="placementId"
              value={filters.value("placement")}
              options={db.placements
                .filter((p) => p.status === "Ongoing")
                .map((p) => ({
                  value: p.id,
                  label: `${p.id} — ${nameOf(studentFor(db, p))}`,
                }))}
            />
            <Field
              label="Work date"
              name="workDate"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={replaced?.workDate}
              readOnly={!!replaced}
            />
            <Field
              label="Hours rendered"
              name="hours"
              type="number"
              min={0}
              max={12}
              step="any"
              value={replaced?.hours}
            />
            <Field
              label="Tasks performed"
              name="tasks"
              type="textarea"
              value={replaced?.tasks}
            />
          </div>
        </SaveForm>
      </>
    );
  }
  if (action === "report-detail") {
    const report = db.reports.find((r) => r.id === id);
    if (!report) return <RecordState />;
    const p = get(db.placements, report.placementId);
    return (
      <>
        <Back href={`/dashboard/progress/${p.id}`}>Placement progress</Back>
        <PageHeader
          title={report.id}
          description={`${nameOf(studentFor(db, p))} · ${reviewState(report.status)}`}
        />
        <Details
          items={[
            [
              "Placement",
              <Link href={`/dashboard/placements/${p.id}`} key={2340}>
                {p.id}
              </Link>,
            ],
            ["Work date", report.workDate],
            ["Report kind", report.kind ?? "Legacy daily"],
            ["Period end", report.periodEnd],
            ["Attempt", report.attempt ?? 1],
            [
              "Legacy source status",
              report.legacyStatus
                ? `${report.legacyStatus} (${report.legacyStatus === "Reviewed" ? "historical approved hours grandfathered; original reviewer retained" : "historical pending review preserved"})`
                : undefined,
            ],
            ["Submission time", new Date(report.submittedAt).toLocaleString()],
            ["Hours rendered", report.hours],
            ["Tasks", report.tasks],
            ["Supervisor / Reviewer remarks", report.remarks],
            ["Reviewer", accountName(db, report.reviewerId)],
            [
              "Review time",
              report.reviewedAt
                ? new Date(report.reviewedAt).toLocaleString()
                : "—",
            ],
            ["Report approval status", reviewState(report.status)],
          ]}
        />
        {account.role === "Intern Supervisor" &&
          get(db.supervisors, p.supervisorId).accountId === account.id &&
          reviewState(report.status) === "Pending" &&
          p.status === "Ongoing" && (
            <section>
              <h2>Review report</h2>
              <SaveForm
                revision={db.revision}
                submit="Approve Report"
                save={async (data, revision) => {
                  await mutate(
                    {
                      type: "report.decide",
                      decision: "Approved",
                      id: report.id,
                      remarks: text(data, "remarks"),
                    },
                    undefined,
                    revision,
                  );
                  setNotice("Review saved and hours recalculated everywhere.");
                }}
              >
                <Field
                  label="Reviewer remarks"
                  name="remarks"
                  type="textarea"
                  value={report.remarks}
                />
              </SaveForm>
              <SaveForm
                revision={db.revision}
                submit="Reject Report"
                save={async (data, revision) => {
                  await mutate(
                    {
                      type: "report.decide",
                      id: report.id,
                      decision: "Rejected",
                      remarks: text(data, "rejectionRemarks"),
                    },
                    undefined,
                    revision,
                  );
                  setNotice(
                    "Report rejected; history and rendered work retained.",
                  );
                }}
              >
                <Field
                  label="Report rejection remarks"
                  name="rejectionRemarks"
                  type="textarea"
                />
              </SaveForm>
            </section>
          )}
        {account.role === "Faculty Adviser" &&
          get(db.faculty, p.adviserId).accountId === account.id && (
            <SaveForm
              revision={db.revision}
              submit="Save Faculty Monitoring Remark"
              save={async (data, revision) => {
                await mutate(
                  {
                    type: "report.monitor",
                    id: report.id,
                    remarks: text(data, "facultyRemarks"),
                  },
                  undefined,
                  revision,
                );
                setNotice(
                  "Faculty monitoring saved. Approved hours are unchanged.",
                );
              }}
            >
              <Field
                label="Faculty monitoring remarks"
                name="facultyRemarks"
                type="textarea"
              />
            </SaveForm>
          )}
        {canSubmit &&
          report.status === "Rejected" &&
          p.status === "Ongoing" && (
            <Link
              href={
                report.kind === "Weekly"
                  ? `/dashboard/progress/weekly/create?placement=${p.id}&from=${report.workDate}&to=${report.periodEnd}`
                  : `/dashboard/progress/create?placement=${p.id}&replace=${report.id}`
              }
            >
              Resubmit Rejected Report
            </Link>
          )}
        <h2>Supervisor decision history</h2>
        <Table
          headers={["Status", "Actor", "Date", "Remarks"]}
          rows={(report.history ?? []).map((h) => [
            reviewState(h.status),
            accountName(db, h.actorId),
            h.at,
            h.remarks,
          ])}
        />
        <h2>Faculty monitoring history</h2>
        <Table
          headers={["Adviser", "Date", "Monitoring remarks"]}
          rows={(report.facultyRemarks ?? []).map((m) => [
            accountName(db, m.actorId),
            m.at,
            m.text,
          ])}
        />
      </>
    );
  }
  if (id) {
    const p =
      db.placements.find((p) => p.id === id) ??
      db.placements
        .filter((p) => studentFor(db, p).id === id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    if (!p) return <RecordState />;
    const h = hours(db, p.id),
      student = studentFor(db, p);
    return (
      <>
        <Back href="/dashboard/progress">Progress monitoring</Back>
        <PageHeader
          title={`${nameOf(student)} — progress`}
          description={`${p.id} · ${companyFor(db, p).name}`}
        >
          {canSubmit && p.status === "Ongoing" && (
            <Link
              className="primary-action"
              href={`/dashboard/progress/create?placement=${p.id}`}
            >
              Submit progress report
            </Link>
          )}
        </PageHeader>
        <div className="record-links">
          <Link href={`/dashboard/attendance?placement=${p.id}`}>
            Daily Attendance Record
          </Link>
          {canSubmit && p.status === "Ongoing" && (
            <Link href={`/dashboard/progress/weekly/create?placement=${p.id}`}>
              Submit Weekly Report
            </Link>
          )}
        </div>
        <Details
          items={[
            [
              "Student",
              <Link href={`/dashboard/students/${student.id}`} key={3929}>
                {nameOf(student)}
              </Link>,
            ],
            [
              "Placement",
              <Link href={`/dashboard/placements/${p.id}`} key={4019}>
                {p.id}
              </Link>,
            ],
            ["Required hours", p.requiredHours],
            ["Rendered hours", h.submitted],
            ["Approved hours", h.reviewed],
            ["Remaining hours", h.remaining],
            ["Completion", `${h.percent}%`],
            [
              "Faculty adviser",
              accountName(db, get(db.faculty, p.adviserId).accountId),
            ],
            [
              "Intern Supervisor",
              accountName(db, get(db.supervisors, p.supervisorId).accountId),
            ],
          ]}
        />
        <h2>Progress report history</h2>
        <Table
          headers={[
            "Report",
            "Work date",
            "Submitted",
            "Hours",
            "Tasks",
            "Remarks",
            "Review status",
            "Actions",
          ]}
          rows={db.reports
            .filter((r) => r.placementId === p.id)
            .sort((a, b) => b.workDate.localeCompare(a.workDate))
            .map((r) => [
              r.id,
              r.workDate,
              r.submittedAt.slice(0, 10),
              r.hours,
              r.tasks,
              r.remarks,
              reviewState(r.status),
              <Link href={`/dashboard/progress/reports/${r.id}`} key={4763}>
                View / Review report
              </Link>,
            ])}
        />
      </>
    );
  }
  if (filters.value("view") === "reports") return <ProgressReports />;
  const today = new Date().toISOString().slice(0, 10);
  const yearPlacements = db.placements.filter((p) => p.academicYear === year);
  const ps = db.placements.filter(
    (p) =>
      p.academicYear === year &&
      searchMatches(
        filters.value("q"),
        nameOf(studentFor(db, p)),
        studentFor(db, p).studentNumber,
      ) &&
      matches(filters.value("student"), studentFor(db, p).id) &&
      matches(filters.value("company"), companyFor(db, p).id) &&
      matches(filters.value("adviser"), p.adviserId) &&
      matches(filters.value("status"), p.status) &&
      (!filters.value("near") ||
        (p.status === "Ongoing" && hours(db, p.id).percent >= 75)) &&
      (!filters.value("review") ||
        db.reports.some(
          (r) => r.placementId === p.id && reviewState(r.status) === "Pending",
        )),
  );
  return (
    <>
      <PageHeader
        title="Progress monitoring"
        description="Rendered and supervisor-approved totals remain separate. Demonstration reporting policy: monitoring flags seven calendar days without a report during an ongoing placement."
      >
        {canSubmit && (
          <>
            <Link
              className="primary-action"
              href="/dashboard/progress/weekly/create"
            >
              Submit weekly report
            </Link>
            <Link href="/dashboard/attendance">Daily attendance</Link>
            <Link href="/dashboard/progress/create">Submit daily report</Link>
          </>
        )}
      </PageHeader>
      <Link href="/dashboard/progress?view=reports">
        View submitted progress reports
      </Link>
      <div className="metric-links metric-links--strip metric-links--pair">
        <MetricLink
          href="/dashboard/progress?view=reports&reportStatus=Pending&status=Ongoing"
          count={
            db.reports.filter(
              (r) =>
                reviewState(r.status) === "Pending" &&
                yearPlacements.some(
                  (p) => p.id === r.placementId && p.status === "Ongoing",
                ),
            ).length
          }
          label="Pending reviews"
        />
        <MetricLink
          href="/dashboard/progress?status=Ongoing&near=true"
          count={
            yearPlacements.filter(
              (p) => p.status === "Ongoing" && hours(db, p.id).percent >= 75,
            ).length
          }
          label="Near completion (75%+ approved)"
        />
      </div>
      <Filters>
        <Search placeholder="Student name or number" />
        <Filter
          name="near"
          label="Completion focus"
          choices={[
            { value: "true", label: "Near completion (75%+ approved)" },
          ]}
        />
        <Filter
          name="student"
          label="Student"
          choices={db.students.map((s) => ({ value: s.id, label: nameOf(s) }))}
        />
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
          name="status"
          label="Placement status"
          choices={options(["Ongoing", "Completed", "Terminated"])}
        />
        <Filter
          name="review"
          label="Review queue"
          choices={[{ value: "pending", label: "Has pending reports" }]}
        />
      </Filters>
      <Table
        headers={[
          "Student",
          "Company / Adviser",
          "Required",
          "Rendered",
          "Approved",
          "Remaining",
          "Completion",
          "Reporting",
          "Actions",
        ]}
        hrefs={ps.map((p) => `/dashboard/progress/${p.id}`)}
        numeric={[2, 3, 4, 5]}
        tones={ps.map((p) =>
          p.status === "Ongoing" && reportingGap(db, p, today)
            ? "warning"
            : undefined,
        )}
        rows={ps.map((p) => {
          const h = hours(db, p.id);
          const gap = p.status === "Ongoing" && reportingGap(db, p, today);
          return [
            <Identity key="who" name={nameOf(studentFor(db, p))} />,
            <Stack
              key="co"
              primary={companyFor(db, p).name}
              secondary={accountName(
                db,
                get(db.faculty, p.adviserId).accountId,
              )}
            />,
            p.requiredHours,
            h.submitted,
            h.reviewed,
            h.remaining,
            <HoursMeter
              key="pct"
              approved={Math.min(h.reviewed, p.requiredHours)}
              required={p.requiredHours}
              label={`${nameOf(studentFor(db, p))} completion`}
            />,
            p.status !== "Ongoing" ? (
              <Status key="rp">{p.status}</Status>
            ) : gap ? (
              <Status key="rp" tone="warning">
                Missing / delayed report
              </Status>
            ) : (
              <Status key="rp" tone="success">
                Reporting current
              </Status>
            ),
            <RowLink href={`/dashboard/progress/${p.id}`} key={7457}>
              Open progress
            </RowLink>,
          ];
        })}
      />
    </>
  );
}
