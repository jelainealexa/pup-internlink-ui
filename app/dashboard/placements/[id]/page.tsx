import Link from "next/link";
import {
  placements,
  progressReports,
} from "@/app/lib/mockData";

export default async function PlacementDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const placement = placements.find(
    (record) => record.id === id
  );

  if (!placement) {
    return <h1>Placement not found</h1>;
  }

  const progress = Math.round(
    (placement.renderedHours /
      placement.requiredHours) *
      100
  );

  const remaining = Math.max(
    placement.requiredHours -
      placement.renderedHours,
    0
  );

  const reports = progressReports.filter(
    (report) =>
      report.studentId === placement.studentId
  );

  const pendingReports = reports.filter(
    (report) =>
      report.reviewStatus === "Pending Review"
  ).length;

  const completed =
    placement.status === "Completed";

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/placements">
          Placements
        </Link>

        <span>/</span>

        <span>{placement.id}</span>
      </div>

      <header className="record-header">
        <div>
          <span className="section-label">
            PLACEMENT RECORD
          </span>

          <h1>{placement.student}</h1>

          <p>
            {placement.opportunity} ·{" "}
            {placement.company}
          </p>
        </div>

        <div className="record-status">
          <span>STATUS</span>
          <strong>{placement.status}</strong>
        </div>
      </header>

      <section className="record-summary">
        <div>
          <span>PLACEMENT ID</span>
          <strong>{placement.id}</strong>
        </div>

        <div>
          <span>RENDERED HOURS</span>

          <strong>
            {placement.renderedHours} /{" "}
            {placement.requiredHours}
          </strong>
        </div>

        <div>
          <span>COMPLETION</span>
          <strong>{progress}%</strong>
        </div>

        <div>
          <span>END DATE</span>
          <strong>{placement.endDate}</strong>
        </div>
      </section>

      <section className="detail-grid">
        <div className="detail-section">
          <span className="section-label">
            PLACEMENT INFORMATION
          </span>

          <dl className="record-list">
            <div>
              <dt>Student</dt>
              <dd>{placement.student}</dd>
            </div>

            <div>
              <dt>Company</dt>
              <dd>{placement.company}</dd>
            </div>

            <div>
              <dt>Opportunity</dt>
              <dd>{placement.opportunity}</dd>
            </div>

            <div>
              <dt>Start Date</dt>
              <dd>{placement.startDate}</dd>
            </div>

            <div>
              <dt>End Date</dt>
              <dd>{placement.endDate}</dd>
            </div>

            <div>
              <dt>Required Hours</dt>
              <dd>{placement.requiredHours}</dd>
            </div>
          </dl>
        </div>

        <div className="detail-section">
          <span className="section-label">
            SUPERVISORS
          </span>

          <dl className="record-list">
            <div>
              <dt>Faculty Adviser</dt>
              <dd>{placement.adviser}</dd>
            </div>

            <div>
              <dt>Company Supervisor</dt>
              <dd>{placement.supervisor}</dd>
            </div>
          </dl>

          <Link
            href={`/dashboard/students/${placement.studentId}`}
            className="simple-action detail-action"
          >
            View Student Profile →
          </Link>
        </div>
      </section>

      <section className="placement-module-grid">
        <div className="placement-module">
          <span className="section-label">
            PROGRESS
          </span>

          <strong className="module-large-number">
            {progress}%
          </strong>

          <p>
            {placement.renderedHours} rendered ·{" "}
            {remaining} remaining
          </p>

          <Link
            href={`/dashboard/progress/${placement.studentId}`}
            className="simple-action"
          >
            View Progress Details →
          </Link>
        </div>

        <div className="placement-module">
          <span className="section-label">
            PROGRESS REPORTS
          </span>

          <strong className="module-large-number">
            {reports.length}
          </strong>

          <p>
            {pendingReports} report
            {pendingReports !== 1 ? "s" : ""} waiting
            for review
          </p>

          <Link
            href={`/dashboard/progress/${placement.studentId}`}
            className="simple-action"
          >
            Review Reports →
          </Link>
        </div>

        <div className="placement-module">
          <span className="section-label">
            EVALUATIONS
          </span>

          <div className="mini-status-row">
            <span>Company Supervisor</span>
            <strong>
              {completed ? "Submitted" : "Pending"}
            </strong>
          </div>

          <div className="mini-status-row">
            <span>Faculty Adviser</span>
            <strong>
              {completed ? "Submitted" : "Pending"}
            </strong>
          </div>

          <Link
            href={`/dashboard/evaluations?student=${placement.studentId}`}
            className="simple-action detail-action"
          >
            View Evaluations →
          </Link>
        </div>

        <div className="placement-module">
          <span className="section-label">
            CERTIFICATE
          </span>

          {completed ? (
            <>
              <dl className="record-list compact-record-list">
                <div>
                  <dt>Certificate No.</dt>
                  <dd>
                    CERT-{placement.id}-2026
                  </dd>
                </div>

                <div>
                  <dt>Issue Status</dt>
                  <dd>Available</dd>
                </div>
              </dl>
            </>
          ) : (
            <p>
              Certificate information becomes available
              once completion conditions are satisfied.
            </p>
          )}
        </div>
      </section>
    </>
  );
}