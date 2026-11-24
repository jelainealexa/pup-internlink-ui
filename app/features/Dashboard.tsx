"use client";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  UserCog,
  UserPlus,
} from "lucide-react";
import { MetricLink, PageHeader, RowLink } from "../components/ui";
import {
  available,
  get,
  hours,
  latestSubmission,
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
  const quickActions: [string, string, typeof UserPlus, boolean?][] = [
    [
      "Review Applications",
      "/dashboard/applications?status=Pending",
      FileText,
      true,
    ],
    ["Add Student", "/dashboard/students/create", UserPlus],
    ["Add Industry Partner", "/dashboard/partners/create", Building2],
    ["Create Opportunity", "/dashboard/internships/create", Briefcase],
    ["Generate reports", "/dashboard/reports", BarChart3],
    ["Faculty Management", "/dashboard/faculty", UserCog],
  ];
  const metric = (label: string) => {
    const found = metrics.find(([name]) => name === label)!;
    return (
      <MetricLink key={label} href={found[2]} count={found[1]} label={label} />
    );
  };
  const attention: {
    key: string;
    href: string;
    count: number;
    label: string;
  }[] = [];
  if (prefs.requirementAlerts)
    attention.push(
      {
        key: "pending-req",
        href: "/dashboard/requirements?view=submissions&status=Pending&attempt=latest",
        count: currentSubs.filter((s) => s.status === "Pending").length,
        label: "Pending requirement reviews",
      },
      {
        key: "rejected-sub",
        href: "/dashboard/requirements?view=submissions&status=Rejected&attempt=latest",
        count: currentSubs.filter((s) => s.status === "Rejected").length,
        label: "Rejected submissions",
      },
    );
  if (prefs.progressAlerts)
    attention.push({
      key: "pending-progress",
      href: "/dashboard/progress?view=reports&reportStatus=Pending&status=Ongoing",
      count: db.reports.filter(
        (r) =>
          ["Pending", "Pending Review"].includes(r.status) &&
          ps.some((p) => p.id === r.placementId && p.status === "Ongoing"),
      ).length,
      label: "Pending progress reviews",
    });
  if (prefs.evaluationAlerts)
    attention.push({
      key: "pending-eval",
      href: "/dashboard/evaluations?status=Pending&placementStatus=Ongoing",
      count: db.evaluations.filter(
        (e) =>
          e.status === "Pending" &&
          ps.some((p) => p.id === e.placementId && p.status === "Ongoing"),
      ).length,
      label: "Pending evaluations",
    });
  if (prefs.partnershipAlerts)
    attention.push({
      key: "expiring",
      href: "/dashboard/partners?status=Expiring%20Soon",
      count: companies.filter((c) => partnership(db, c.id) === "Expiring Soon")
        .length,
      label: "Expiring partnerships (30 days)",
    });
  const placedShare = students.length
    ? Math.round(
        (new Set(
          ps
            .filter((p) => p.status !== "Terminated")
            .map((p) => get(db.applications, p.applicationId).studentId),
        ).size /
          students.length) *
          100,
      )
    : 0;
  const ongoing = ps.filter((p) => p.status === "Ongoing");
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <PageHeader
        title="Coordinator overview"
        description={`${account.name} · Academic year ${year} · Shared browser-local records`}
      />
      <section className="attention-summary">
        <h2>Needs attention</h2>
        {attention.length ? (
          <div className="metric-links metric-links--urgent">
            {attention.map((item, index) => (
              <MetricLink
                key={item.key}
                href={item.href}
                count={item.count}
                label={item.label}
                tone={index === 0 ? "urgent" : undefined}
              />
            ))}
          </div>
        ) : (
          <p className="all-clear">
            <CheckCircle2 size={16} aria-hidden="true" />
            Alert reminders are switched off in Settings.
          </p>
        )}
      </section>
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <section className="program-summary">
            <h2>Program summary</h2>
            <div className="summary-groups">
              <div className="summary-group">
                <h3>Applications</h3>
                <div className="metric-links metric-links--strip">
                  {[
                    "Pending applications",
                    "Accepted applications",
                    "Rejected applications",
                  ].map(metric)}
                </div>
              </div>
              <div className="summary-group">
                <h3>Placements</h3>
                <div className="metric-links metric-links--strip">
                  {[
                    "Ongoing placements",
                    "Completed placements",
                    "Terminated placements",
                  ].map(metric)}
                </div>
              </div>
              <div className="summary-group">
                <h3>Opportunities</h3>
                <div className="metric-links">
                  {[
                    "Active internship opportunities",
                    "Available opportunities",
                  ].map(metric)}
                </div>
              </div>
              <div className="summary-group">
                <h3>Registry and partnerships</h3>
                <div className="metric-links">
                  {[
                    "Registered students",
                    "Industry partners",
                    "Active companies",
                    "Expired MOAs",
                  ].map(metric)}
                </div>
              </div>
            </div>
          </section>
          <section>
            <h2>Progress monitoring</h2>
            <div className="panel">
              <dl className="stat-row">
                <div>
                  <dt>Ongoing placements</dt>
                  <dd>{ongoing.length}</dd>
                </div>
                <div>
                  <dt>Students reporting</dt>
                  <dd>
                    {
                      new Set(
                        db.reports
                          .filter((r) =>
                            ps.some(
                              (p) =>
                                p.id === r.placementId &&
                                p.status === "Ongoing",
                            ),
                          )
                          .map((r) => r.placementId),
                      ).size
                    }
                  </dd>
                </div>
                <div>
                  <dt>Approved hours (all placements)</dt>
                  <dd>{sumHours(ps.map((p) => hours(db, p.id).reviewed))}</dd>
                </div>
                <div>
                  <dt>Near completion (75%+)</dt>
                  <dd>
                    {
                      ongoing.filter((p) => hours(db, p.id).percent >= 75)
                        .length
                    }
                  </dd>
                </div>
                <div>
                  <dt>Missing / delayed reports</dt>
                  <dd>{ps.filter((p) => reportingGap(db, p, today)).length}</dd>
                </div>
              </dl>
              <div className="coverage">
                <p>
                  {placedShare}% of registered students have a non-terminated
                  placement in this academic year.
                </p>
                <progress
                  value={placedShare}
                  max={100}
                  aria-label="Registered students with a non-terminated placement"
                />
              </div>
            </div>
          </section>
        </div>
        <aside
          className="dashboard-aside"
          aria-label="Shortcuts and recent activity"
        >
          <section>
            <h2>Quick actions</h2>
            <ul className="quick-actions">
              {quickActions.map(([label, href, Icon, primary]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className={primary ? "is-primary" : undefined}
                  >
                    <Icon size={17} aria-hidden="true" />
                    {label}
                    <ArrowRight
                      className="qa-go"
                      size={15}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Recent activity</h2>
            <div className="panel panel-flush">
              <ul className="activity-list">
                {db.activities.slice(0, 8).map((a) => (
                  <li key={a.id}>
                    <span className="activity-dot" aria-hidden="true" />
                    <div className="activity-body">
                      <p>{a.message}</p>
                      <time dateTime={a.at}>
                        {new Date(a.at).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                    <RowLink href={a.href}>Open related record</RowLink>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
