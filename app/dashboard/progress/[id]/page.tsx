import Link from "next/link";

const progressData: Record<string, {
  student: string;
  company: string;
  opportunity: string;
  adviser: string;
  supervisor: string;
  requiredHours: number;
  renderedHours: number;
  placementId: string;
}> = {
  "2024-0001": {
    student: "Angela Reyes",
    company: "Accenture Philippines",
    opportunity: "Software Development Intern",
    adviser: "Prof. Maria Santos",
    supervisor: "John Reyes",
    requiredHours: 486,
    renderedHours: 320,
    placementId: "PL-003",
  },

  "2024-0002": {
    student: "Miguel Santos",
    company: "IBM Philippines",
    opportunity: "IT Support Intern",
    adviser: "Prof. Maria Santos",
    supervisor: "John Reyes",
    requiredHours: 486,
    renderedHours: 280,
    placementId: "PL-001",
  },

  "2024-0003": {
    student: "Sofia Cruz",
    company: "Globe Telecom",
    opportunity: "Data Analytics Intern",
    adviser: "Prof. Carlo Mendoza",
    supervisor: "Patricia Lim",
    requiredHours: 486,
    renderedHours: 486,
    placementId: "PL-002",
  },
};

const reports = [
  {
    id: "PR-001",
    date: "Oct. 10, 2026",
    hours: 40,
    task: "Website development",
    remarks: "Good progress",
  },
  {
    id: "PR-002",
    date: "Oct. 17, 2026",
    hours: 40,
    task: "Database testing",
    remarks: "Satisfactory",
  },
  {
    id: "PR-003",
    date: "Oct. 24, 2026",
    hours: 35,
    task: "Documentation",
    remarks: "Under review",
  },
];

export default async function ProgressDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const progress = progressData[id];

  if (!progress) {
    return <h1>Progress record not found</h1>;
  }

  const remaining = Math.max(
    progress.requiredHours - progress.renderedHours,
    0
  );

  const completion = Math.round(
    (progress.renderedHours / progress.requiredHours) * 100
  );

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/progress">
          Progress Monitoring
        </Link>

        <span>/</span>

        <span>{progress.student}</span>
      </div>

      <header className="record-header">
        <div>
          <span className="section-label">
            PROGRESS RECORD
          </span>

          <h1>{progress.student}</h1>

          <p>
            {progress.opportunity} · {progress.company}
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

          <strong>{progress.requiredHours}</strong>
        </div>

        <div>
          <span>RENDERED HOURS</span>

          <strong>{progress.renderedHours}</strong>
        </div>

        <div>
          <span>REMAINING HOURS</span>

          <strong>{remaining}</strong>
        </div>

        <div>
          <span>PLACEMENT</span>

          <strong>{progress.placementId}</strong>
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
              <dd>{progress.student}</dd>
            </div>

            <div>
              <dt>Company</dt>
              <dd>{progress.company}</dd>
            </div>

            <div>
              <dt>Opportunity</dt>
              <dd>{progress.opportunity}</dd>
            </div>

            <div>
              <dt>Faculty Adviser</dt>
              <dd>{progress.adviser}</dd>
            </div>

            <div>
              <dt>Company Supervisor</dt>
              <dd>{progress.supervisor}</dd>
            </div>
          </dl>
        </div>

        <div className="detail-section">
          <span className="section-label">
            RELATED RECORDS
          </span>

          <Link
            href={`/dashboard/students/${id}`}
            className="related-row"
          >
            <div>
              <small>STUDENT</small>
              <strong>View Student Profile</strong>
            </div>

            <span>→</span>
          </Link>

          <Link
            href={`/dashboard/placements/${progress.placementId}`}
            className="related-row"
          >
            <div>
              <small>PLACEMENT</small>
              <strong>View Placement Details</strong>
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

                  <td>
                    <button className="text-action">
                      Review →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}