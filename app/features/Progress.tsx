"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Back,
  Details,
  Field,
  Filter,
  Filters,
  PageHeader,
  RecordState,
  SaveForm,
  Search,
  Table,
  number,
  options,
  text,
  useFilters,
} from "../components/ui";
import {
  canSeePlacement,
  companyFor,
  get,
  hours,
  nameOf,
  reportingGap,
  studentFor,
} from "../lib/rules";
import {
  FeatureProps,
  accountName,
  matches,
  searchMatches,
  useData,
  useYear,
} from "./shared";

export function Progress({ id, action }: FeatureProps) {
  const { db, account, mutate, setNotice } = useData();
  const router = useRouter(),
    filters = useFilters(),
    year = useYear();
  const canSubmit = ["Coordinator", "Student"].includes(account.role);
  if (action === "create") {
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
          description="One daily report per placement/date, up to 12 hours. Only reviewed hours count toward official demonstration completion."
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
            />
            <Field
              label="Hours rendered"
              name="hours"
              type="number"
              min={0}
              max={12}
              step="any"
            />
            <Field label="Tasks performed" name="tasks" type="textarea" />
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
          description={`${nameOf(studentFor(db, p))} · ${report.status}`}
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
            ["Review status", report.status],
          ]}
        />
        {account.role !== "Student" &&
          canSeePlacement(db, account, p) &&
          report.status === "Pending Review" &&
          p.status === "Ongoing" && (
            <section>
              <h2>Review report</h2>
              <SaveForm
                revision={db.revision}
                submit="Mark as Reviewed"
                save={async (data, revision) => {
                  await mutate(
                    {
                      type: "report.review",
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
            </section>
          )}
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
            ["Submitted hours", h.submitted],
            ["Reviewed hours", h.reviewed],
            ["Remaining hours", h.remaining],
            ["Completion", `${h.percent}%`],
            [
              "Faculty adviser",
              accountName(db, get(db.faculty, p.adviserId).accountId),
            ],
            [
              "Company supervisor",
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
              r.status,
              <Link href={`/dashboard/progress/reports/${r.id}`} key={4763}>
                View / Review report
              </Link>,
            ])}
        />
      </>
    );
  }
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
          (r) => r.placementId === p.id && r.status === "Pending Review",
        )),
  );
  return (
    <>
      <PageHeader
        title="Progress monitoring"
        description="Submitted and reviewed totals remain separate. Demo reporting policy: a daily report is late after seven calendar days without a work-date report during an ongoing placement."
      >
        {canSubmit && (
          <Link className="primary-action" href="/dashboard/progress/create">
            Submit progress report
          </Link>
        )}
      </PageHeader>
      <div className="metric-links">
        <Link href="/dashboard/progress?review=pending&status=Ongoing">
          <strong>
            {
              db.reports.filter(
                (r) =>
                  r.status === "Pending Review" &&
                  yearPlacements.some(
                    (p) => p.id === r.placementId && p.status === "Ongoing",
                  ),
              ).length
            }
          </strong>
          Pending reviews
        </Link>
        <Link href="/dashboard/progress?status=Ongoing&near=true">
          <strong>
            {
              yearPlacements.filter(
                (p) => p.status === "Ongoing" && hours(db, p.id).percent >= 75,
              ).length
            }
          </strong>
          Near completion (75%+ reviewed)
        </Link>
      </div>
      <Filters>
        <Search placeholder="Student name or number" />
        <Filter
          name="near"
          label="Completion focus"
          choices={[
            { value: "true", label: "Near completion (75%+ reviewed)" },
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
          "Submitted",
          "Reviewed",
          "Remaining",
          "Completion",
          "Reporting",
          "Actions",
        ]}
        rows={ps.map((p) => {
          const h = hours(db, p.id);
          return [
            nameOf(studentFor(db, p)),
            <span key={7051}>
              {companyFor(db, p).name}
              <br />
              {accountName(db, get(db.faculty, p.adviserId).accountId)}
            </span>,
            p.requiredHours,
            h.submitted,
            h.reviewed,
            h.remaining,
            <span key={7200}>
              <span>{h.percent}%</span>
              <progress
                aria-label={`${nameOf(studentFor(db, p))} completion`}
                max={100}
                value={Math.min(h.percent, 100)}
              />
            </span>,
            p.status !== "Ongoing"
              ? p.status
              : reportingGap(db, p, today)
                ? "Missing / delayed report"
                : "Reporting current",
            <Link href={`/dashboard/progress/${p.id}`} key={7457}>
              Open progress
            </Link>,
          ];
        })}
      />
    </>
  );
}
