"use client";
import Link from "next/link";
import { Details, PageHeader, RecordState, Table } from "../components/ui";
import {
  available,
  get,
  hours,
  latestSubmission,
  partnership,
  postingStatus,
  remainingSlots,
  reviewState,
  roleLabel,
  studentFor,
  canReviewStudent,
} from "../lib/rules";
import { useData } from "./shared";

export function RoleDashboard() {
  const { db, account, prefs } = useData(),
    year = prefs.academicYear;
  const profile = db.supervisors.find((s) => s.accountId === account.id),
    faculty = db.faculty.find((f) => f.accountId === account.id);
  const company = db.companies.find((c) => c.id === profile?.companyId);
  if (
    ["Company Supervisor", "Intern Supervisor"].includes(account.role) &&
    !company
  )
    return (
      <RecordState
        title="Company profile unavailable"
        message="Ask the coordinator to check the account relationship."
      />
    );
  const ps = db.placements.filter((p) => p.academicYear === year),
    opps = db.opportunities.filter((o) => o.academicYear === year);
  const reports = db.reports.filter((r) =>
      ps.some((p) => p.id === r.placementId),
    ),
    ongoingReports = reports.filter((r) =>
      ps.some((p) => p.id === r.placementId && p.status === "Ongoing"),
    );
  const pendingReports = ongoingReports.filter(
    (r) => reviewState(r.status) === "Pending",
  );
  const pendingEvals = db.evaluations.filter(
    (e) =>
      e.status === "Pending" &&
      ps.some((p) => p.id === e.placementId && p.status === "Ongoing") &&
      (account.role === "Company Supervisor" ||
        account.role === "Student" ||
        e.evaluatorId === account.id),
  );
  const currentStudents = db.students.filter(
    (s) => s.academicYear === year && canReviewStudent(db, account, s.id),
  );
  const currentSubs = currentStudents.flatMap((s) =>
    db.requirements
      .map((r) => latestSubmission(db, s.id, r.id))
      .filter((r) => !!r),
  );
  const metrics: [string, number, string][] = [];
  if (account.role === "Faculty Adviser") {
    const own = ps.filter((p) => p.adviserId === faculty?.id),
      ids = new Set(own.map((p) => p.id));
    metrics.push(
      [
        "Total assigned students",
        db.students.filter(
          (s) => s.academicYear === year && s.adviserId === faculty?.id,
        ).length,
        `/dashboard/students?adviser=${faculty?.id}`,
      ],
      [
        "Pending requirement reviews",
        currentSubs.filter((s) => s.status === "Pending").length,
        "/dashboard/requirements?view=submissions&status=Pending&attempt=latest",
      ],
      [
        "Active internship placements",
        own.filter((p) => p.status === "Ongoing").length,
        `/dashboard/placements?adviser=${faculty?.id}&status=Ongoing`,
      ],
      [
        "Pending progress reports",
        pendingReports.filter((r) => ids.has(r.placementId)).length,
        `/dashboard/progress?view=reports&reportStatus=Pending&status=Ongoing&adviser=${faculty?.id}`,
      ],
      [
        "Students nearing completion",
        own.filter(
          (p) => p.status === "Ongoing" && hours(db, p.id).percent >= 75,
        ).length,
        `/dashboard/progress?adviser=${faculty?.id}&status=Ongoing&near=true`,
      ],
      [
        "Completed internship placements",
        own.filter((p) => p.status === "Completed").length,
        `/dashboard/placements?adviser=${faculty?.id}&status=Completed`,
      ],
      [
        "Pending evaluations",
        pendingEvals.length,
        `/dashboard/evaluations?evaluator=${account.id}&status=Pending&placementStatus=Ongoing`,
      ],
    );
  } else if (account.role === "Company Supervisor") {
    metrics.push(
      ["Total internship opportunities", opps.length, "/dashboard/internships"],
      [
        "Pending internship posting approvals",
        opps.filter((o) => o.status.startsWith("Pending Approval")).length,
        "/dashboard/internships?status=Pending%20(all%20stages)",
      ],
      [
        "Approved internship postings",
        opps.filter((o) => o.status === "Approved").length,
        "/dashboard/internships?status=Approved",
      ],
      [
        "Active internship postings",
        opps.filter((o) => postingStatus(db, o.id) === "Active").length,
        "/dashboard/internships?status=Active",
      ],
      [
        "Total available internship slots",
        opps
          .filter((o) => available(db, o.id))
          .reduce((n, o) => n + remainingSlots(db, o.id), 0),
        "/dashboard/internships?available=true",
      ],
      [
        "Total Intern Supervisors",
        db.supervisors.filter(
          (s) => get(db.accounts, s.accountId).role === "Intern Supervisor",
        ).length,
        `/dashboard/partners/${company!.id}#supervisors`,
      ],
      [
        "Total current interns",
        ps.filter((p) => p.status === "Ongoing").length,
        "/dashboard/placements?status=Ongoing",
      ],
    );
  } else if (account.role === "Intern Supervisor") {
    const assigned = new Set(
        opps
          .filter((o) => o.supervisorIds?.includes(profile!.id))
          .map((o) => o.id),
      ),
      apps = db.applications.filter(
        (a) => a.academicYear === year && assigned.has(a.opportunityId),
      );
    metrics.push(
      [
        "Total assigned internship opportunities",
        assigned.size,
        "/dashboard/internships?assigned=true",
      ],
      [
        "Total applications received",
        apps.length,
        "/dashboard/applications?assigned=true",
      ],
      ...(["Pending", "Accepted", "Rejected"] as const).map(
        (status) =>
          [
            `${status} applications`,
            apps.filter((a) => a.status === status).length,
            `/dashboard/applications?assigned=true&status=${status}`,
          ] as [string, number, string],
      ),
      [
        "Total assigned interns",
        new Set(ps.map((p) => studentFor(db, p).id)).size,
        "/dashboard/students?interns=true",
      ],
      [
        "Pending progress reports",
        pendingReports.length,
        "/dashboard/progress?view=reports&reportStatus=Pending&status=Ongoing",
      ],
      [
        "Approved progress reports",
        reports.filter((r) => reviewState(r.status) === "Approved").length,
        "/dashboard/progress?view=reports&reportStatus=Approved",
      ],
      [
        "Pending student evaluations",
        pendingEvals.length,
        `/dashboard/evaluations?evaluator=${account.id}&status=Pending&placementStatus=Ongoing`,
      ],
      [
        "Completed student evaluations",
        db.evaluations.filter(
          (e) =>
            e.evaluatorId === account.id &&
            e.status === "Submitted" &&
            ps.some((p) => p.id === e.placementId),
        ).length,
        `/dashboard/evaluations?evaluator=${account.id}&status=Submitted`,
      ],
    );
  } else {
    const apps = db.applications.filter((a) => a.academicYear === year);
    metrics.push(
      [
        "Available opportunities",
        opps.filter((o) => available(db, o.id)).length,
        "/dashboard/internships?available=true",
      ],
      ...(["Pending", "Accepted", "Rejected"] as const).map(
        (status) =>
          [
            `${status} applications`,
            apps.filter((a) => a.status === status).length,
            `/dashboard/applications?status=${status}`,
          ] as [string, number, string],
      ),
      ...(["Ongoing", "Completed", "Terminated"] as const).map(
        (status) =>
          [
            `${status} placements`,
            ps.filter((p) => p.status === status).length,
            `/dashboard/placements?status=${status}`,
          ] as [string, number, string],
      ),
    );
  }
  return (
    <>
      <PageHeader
        title={`${roleLabel(account.role)} dashboard`}
        description={`${account.name} / Academic year ${year} / Authorized shared browser-local records`}
      />
      <div className="metric-links">
        {metrics.map(([label, count, href]) => (
          <Link key={label} href={href}>
            <strong>{count}</strong>
            {label}
          </Link>
        ))}
      </div>
      {account.role === "Company Supervisor" && company && (
        <Details
          items={[
            ["Active MOA status", partnership(db, company.id)],
            ["MOA expiration date", company.moaEnd],
          ]}
        />
      )}
      <section>
        <h2>Needs attention</h2>
        <div className="metric-links">
          {prefs.progressAlerts && (
            <Link href="/dashboard/progress?view=reports&reportStatus=Pending&status=Ongoing">
              <strong>{pendingReports.length}</strong>Local progress reminders
            </Link>
          )}
          {prefs.evaluationAlerts && (
            <Link
              href={`/dashboard/evaluations?status=Pending&placementStatus=Ongoing${["Faculty Adviser", "Intern Supervisor"].includes(account.role) ? `&evaluator=${account.id}` : ""}`}
            >
              <strong>{pendingEvals.length}</strong>Local evaluation reminders
            </Link>
          )}
          {prefs.requirementAlerts && account.role === "Faculty Adviser" && (
            <Link href="/dashboard/requirements?view=submissions&status=Pending&attempt=latest">
              <strong>
                {currentSubs.filter((s) => s.status === "Pending").length}
              </strong>
              Local requirement reminders
            </Link>
          )}
          {prefs.requirementAlerts &&
            account.role === "Student" &&
            ["Before Internship", "During Internship", "After Internship"].map(
              (phase) => {
                const student = db.students.find(
                  (s) => s.accountId === account.id,
                );
                const pending = db.requirements
                  .filter((r) => r.phase === phase)
                  .map((r) =>
                    student
                      ? latestSubmission(db, student.id, r.id)
                      : undefined,
                  )
                  .filter((s) => s && s.status !== "Approved");
                return (
                  <Link
                    key={phase}
                    href={`/dashboard/requirements?phase=${encodeURIComponent(phase)}`}
                  >
                    <strong>{pending.length}</strong>
                    {phase} document reminders
                  </Link>
                );
              },
            )}
          {prefs.partnershipAlerts &&
            account.role === "Company Supervisor" &&
            company && (
              <Link href={`/dashboard/partners/${company.id}`}>
                <strong>
                  {partnership(db, company.id) === "Expiring Soon" ? 1 : 0}
                </strong>
                Local partnership expiration reminder
              </Link>
            )}
        </div>
      </section>
      <section>
        <h2>Workspace actions</h2>
        <div className="record-links">
          {account.role === "Student" && (
            <>
              <Link
                href={`/dashboard/students/${db.students.find((s) => s.accountId === account.id)?.id}`}
              >
                My Profile
              </Link>
              <Link href="/dashboard/requirements">
                Internship Requirements
              </Link>
              <Link href="/dashboard/attendance">Daily Attendance Record</Link>
              <Link href="/dashboard/progress/weekly/create">
                Weekly Report
              </Link>
            </>
          )}
          {account.role === "Faculty Adviser" && (
            <>
              <Link href="/dashboard/students/create">
                Pre-Register Student
              </Link>
              <Link href="/dashboard/students">Assigned students</Link>
              <Link href="/dashboard/progress?view=reports">
                Company-based progress monitoring
              </Link>
            </>
          )}
          {account.role === "Company Supervisor" && company && (
            <>
              <Link href={`/dashboard/partners/${company.id}`}>
                Company Profile and Intern Supervisor Management
              </Link>
              <Link href="/dashboard/internships/create">
                Create Internship Posting
              </Link>
            </>
          )}
          {account.role === "Intern Supervisor" && profile && (
            <>
              <Link
                href={`/dashboard/partners/${profile.companyId}/supervisors/${profile.id}`}
              >
                Supervisor Profile
              </Link>
              <Link href="/dashboard/applications?assigned=true">
                Application Management
              </Link>
              <Link href="/dashboard/students?interns=true">My Interns</Link>
            </>
          )}
          <Link href="/dashboard/placements">Internship Placements</Link>
          <Link href="/dashboard/evaluations">Internship Evaluation</Link>
          <Link href="/dashboard/settings">Account Settings</Link>
        </div>
      </section>
      <section>
        <h2>Recent activity</h2>
        <Table
          headers={["Activity", "Date", "Record"]}
          rows={db.activities.slice(0, 12).map((a) => [
            a.message,
            a.at,
            <Link key={a.id} href={a.href}>
              Open related record
            </Link>,
          ])}
        />
      </section>
    </>
  );
}
