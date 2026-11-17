import Link from "next/link";
import ProgressReportReview from "@/app/components/ProgressReportReview";
import {
  placements,
  progressReports,
} from "@/app/lib/mockData";

export default async function ProgressDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const placement = placements.find(
    (record) => record.studentId === id
  );

  if (!placement) {
    return <h1>Progress record not found</h1>;
  }

  const reports = progressReports.filter(
    (report) => report.studentId === id
  );

  const remaining = Math.max(
    placement.requiredHours -
      placement.renderedHours,
    0
  );

  const completion = Math.round(
    (placement.renderedHours /
      placement.requiredHours) *
      100
  );

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/progress">
          Progress Monitoring
        </Link>

        <span>/</span>

        <span>{placement.student}</span>
      </div>

      <header className="record-header">
        <div>
          <span className="section-label">
            PROGRESS RECORD
          </span>

          <h1>{placement.student}</h1>

          <p>
            {placement.opportunity} ·{" "}
            {placement.company}
          </p>
        </div>

        <div className="record-status">
          <span>COMPLETION</span>
          <strong>{completion}%</strong>
        </div>
      </header>

      <section className="record-summary">
        <div>
          <span>REQUIRED HOURS</span>
          <strong>
            {placement.requiredHours}
          </strong>
        </div>

        <div>
          <span>RENDERED HOURS</span>
          <strong>
            {placement.renderedHours}
          </strong>
        </div>

        <div>
          <span>REMAINING HOURS</span>
          <strong>{remaining}</strong>
        </div>

        <div>
          <span>PLACEMENT</span>
          <strong>{placement.id}</strong>
        </div>
      </section>

      <section className="detail-grid">
        <div className="detail-section">
          <span className="section-label">
            PLACEMENT SUMMARY
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
              <dt>Faculty Adviser</dt>
              <dd>{placement.adviser}</dd>
            </div>

            <div>
              <dt>Company Supervisor</dt>
              <dd>{placement.supervisor}</dd>
            </div>

            <div>
              <dt>Required Hours</dt>
              <dd>
                {placement.requiredHours}
              </dd>
            </div>

            <div>
              <dt>Accumulated Hours</dt>
              <dd>
                {placement.renderedHours}
              </dd>
            </div>
          </dl>
        </div>

        <div className="detail-section">
          <span className="section-label">
            RELATED RECORDS
          </span>

          <Link
            href={`/dashboard/students/${placement.studentId}`}
            className="related-row"
          >
            <div>
              <small>STUDENT</small>
              <strong>
                View Student Profile
              </strong>
            </div>

            <span>→</span>
          </Link>

          <Link
            href={`/dashboard/placements/${placement.id}`}
            className="related-row"
          >
            <div>
              <small>PLACEMENT</small>
              <strong>
                View Placement Details
              </strong>
            </div>

            <span>→</span>
          </Link>
        </div>
      </section>

      <section className="progress-history">
        <span className="section-label">
          PROGRESS REPORT HISTORY
        </span>

        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Submission Date</th>
                <th>Hours Rendered</th>
                <th>Tasks Reported</th>
                <th>Remarks</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.date}</td>
                  <td>{report.hours}</td>
                  <td>{report.task}</td>
                  <td>{report.remarks}</td>
                  <td>{report.reviewStatus}</td>

                  <td>
                    <ProgressReportReview
                      report={report}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {reports.length === 0 && (
            <div className="empty-directory">
              No progress reports submitted yet.
            </div>
          )}
        </div>
      </section>
    </>
  );
}