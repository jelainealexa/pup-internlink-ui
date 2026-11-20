"use client";
import Link from "next/link";
import { PageHeader, Table } from "../components/ui";
import {
  available,
  get,
  hours,
  latestSubmission,
  nameOf,
  partnership,
  reportingGap,
  sumHours,
  postingStatus,
} from "../lib/rules";
import { useData } from "./shared";

export function Dashboard() {
  const { db, account, prefs } = useData();
  const year = prefs.academicYear;
  const students = db.students.filter((s) => s.academicYear === year),
    ps = db.placements.filter((p) => p.academicYear === year),
    apps = db.applications.filter((a) => a.academicYear === year),
    companies = db.companies.filter((c) => c.academicYear === year),
    opps = db.opportunities.filter((o) => o.academicYear === year);
  const currentSubs = students.flatMap((s) =>
    db.requirements
      .map((r) => latestSubmission(db, s.id, r.id))
      .filter((s) => !!s),
  );
  const metrics: [string, number, string][] = [
    ["Registered students", students.length, "/dashboard/students"],
    ["Industry partners", companies.length, "/dashboard/partners"],
    [
      "Active internship opportunities",
      opps.filter((o) => postingStatus(db, o.id) === "Active").length,
      "/dashboard/internships?status=Active",
    ],
    [
      "Available opportunities",
      opps.filter((o) => available(db, o.id)).length,
      "/dashboard/internships?available=true",
    ],
    ...["Pending", "Accepted", "Rejected"].map(
      (status) =>
        [
          `${status} applications`,
          apps.filter((a) => a.status === status).length,
          `/dashboard/applications?status=${status}`,
        ] as [string, number, string],
    ),
    ...["Ongoing", "Completed", "Terminated"].map(
      (status) =>
        [
          `${status} placements`,
          ps.filter((p) => p.status === status).length,
          `/dashboard/placements?status=${status}`,
        ] as [string, number, string],
    ),
  ];
  const coordinator = account.role === "Coordinator";
  metrics.push(
    [
      "Active companies",
      companies.filter((c) =>
        ["Active", "Expiring Soon"].includes(partnership(db, c.id)),
      ).length,
      "/dashboard/partners?status=Eligible",
    ],
    [
      "Expired MOAs",
      companies.filter((c) => partnership(db, c.id) === "Expired").length,
      "/dashboard/partners?status=Expired",
    ],
  );
  return (
    <>
      <PageHeader
        title={
          coordinator ? "Coordinator overview" : `${account.role} dashboard`
        }
        description={`${account.name} · Academic year ${year} · Shared browser-local records`}
      />
      <section>
        <h2>Program summary</h2>
        <div className="metric-links">
          {metrics
            .filter(
              ([, , href]) =>
                coordinator ||
                (!href.includes("partners") && !href.includes("students")),
            )
            .map(([label, count, href]) => (
              <Link key={label} href={href}>
                <strong>{count}</strong>
                {label}
              </Link>
            ))}
        </div>
      </section>
      <section>
        <h2>Needs attention</h2>
        <div className="metric-links">
          {prefs.requirementAlerts && account.role !== "Company Supervisor" && (
            <Link href="/dashboard/requirements?view=submissions&status=Pending&attempt=latest">
              <strong>
                {currentSubs.filter((s) => s.status === "Pending").length}
              </strong>
              Pending requirement reviews
            </Link>
          )}
          {prefs.requirementAlerts && account.role !== "Company Supervisor" && (
            <Link href="/dashboard/requirements?view=submissions&status=Rejected&attempt=latest">
              <strong>
                {currentSubs.filter((s) => s.status === "Rejected").length}
              </strong>
              Rejected submissions
            </Link>
          )}
          {prefs.progressAlerts && (
            <Link href="/dashboard/progress?view=reports&reportStatus=Pending&status=Ongoing">
              <strong>
                {
                  db.reports.filter(
                    (r) =>
                      ["Pending", "Pending Review"].includes(r.status) &&
                      ps.some(
                        (p) => p.id === r.placementId && p.status === "Ongoing",
                      ),
                  ).length
                }
              </strong>
              Pending progress reviews
            </Link>
          )}
          {prefs.evaluationAlerts && (
            <Link href="/dashboard/evaluations?status=Pending&placementStatus=Ongoing">
              <strong>
                {
                  db.evaluations.filter(
                    (e) =>
                      e.status === "Pending" &&
                      ps.some(
                        (p) => p.id === e.placementId && p.status === "Ongoing",
                      ),
                  ).length
                }
              </strong>
              Pending evaluations
            </Link>
          )}
          {prefs.partnershipAlerts && coordinator && (
            <Link href="/dashboard/partners?status=Expiring%20Soon">
              <strong>
                {
                  companies.filter(
                    (c) => partnership(db, c.id) === "Expiring Soon",
                  ).length
                }
              </strong>
              Expiring partnerships (30 days)
            </Link>
          )}
        </div>
      </section>
      <section>
        <h2>Progress monitoring</h2>
        <Table
          headers={[
            "Ongoing",
            "Students reporting",
            "Approved hours (all placements)",
            "Near completion (75%+)",
            "Missing / delayed reports",
          ]}
          rows={[
            [
              ps.filter((p) => p.status === "Ongoing").length,
              new Set(
                db.reports
                  .filter((r) =>
                    ps.some(
                      (p) => p.id === r.placementId && p.status === "Ongoing",
                    ),
                  )
                  .map((r) => r.placementId),
              ).size,
              sumHours(ps.map((p) => hours(db, p.id).reviewed)),
              ps.filter(
                (p) => p.status === "Ongoing" && hours(db, p.id).percent >= 75,
              ).length,
              ps.filter((p) =>
                reportingGap(db, p, new Date().toISOString().slice(0, 10)),
              ).length,
            ],
          ]}
        />
        <p>
          {students.length
            ? `${Math.round((new Set(ps.filter((p) => p.status !== "Terminated").map((p) => get(db.applications, p.applicationId).studentId)).size / students.length) * 100)}%`
            : "0%"}{" "}
          of registered students have a non-terminated placement in this
          academic year.
        </p>
      </section>
      <section>
        <h2>Quick actions</h2>
        <div className="record-links">
          {coordinator ? (
            <>
              <Link href="/dashboard/students/create">Add Student</Link>
              <Link href="/dashboard/partners/create">
                Add Industry Partner
              </Link>
              <Link href="/dashboard/internships/create">
                Create Opportunity
              </Link>
              <Link href="/dashboard/applications?status=Pending">
                Review Applications
              </Link>
              <Link href="/dashboard/reports">Generate reports</Link>
              <Link href="/dashboard/faculty">Faculty Management</Link>
            </>
          ) : account.role === "Student" ? (
            <>
              <Link href="/dashboard/requirements/submissions/create">
                Submit document
              </Link>
              <Link href="/dashboard/applications/create">
                Submit application
              </Link>
              <Link href="/dashboard/progress/create">
                Submit progress report
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard/placements">Assigned placements</Link>
              <Link href="/dashboard/evaluations?status=Pending">
                Assigned evaluation obligations
              </Link>
            </>
          )}
        </div>
      </section>
      {account.role === "Student" &&
        db.students.find((s) => s.accountId === account.id) && (
          <p>
            Personal record:{" "}
            <Link
              href={`/dashboard/students/${db.students.find((s) => s.accountId === account.id)!.id}`}
            >
              {nameOf(db.students.find((s) => s.accountId === account.id)!)}
            </Link>
          </p>
        )}
      <section>
        <h2>Recent activity</h2>
        <Table
          headers={["Action", "Time", "Record"]}
          rows={db.activities.slice(0, 12).map((a) => [
            a.message,
            new Date(a.at).toLocaleString(),
            <Link href={a.href} key={5403}>
              Open related record
            </Link>,
          ])}
        />
      </section>
    </>
  );
}
