import Link from "next/link";

const placementData: Record<string, {
  student: string;
  studentId: string;
  company: string;
  opportunity: string;
  adviser: string;
  supervisor: string;
  startDate: string;
  endDate: string;
  requiredHours: number;
  renderedHours: number;
  status: string;
}> = {
  "PL-001": {
    student: "Miguel Santos",
    studentId: "2024-0002",
    company: "IBM Philippines",
    opportunity: "IT Support Intern",
    adviser: "Prof. Maria Santos",
    supervisor: "John Reyes",
    startDate: "November 15, 2026",
    endDate: "February 15, 2027",
    requiredHours: 486,
    renderedHours: 280,
    status: "Ongoing",
  },

  "PL-002": {
    student: "Sofia Cruz",
    studentId: "2024-0003",
    company: "Globe Telecom",
    opportunity: "Data Analytics Intern",
    adviser: "Prof. Carlo Mendoza",
    supervisor: "Patricia Lim",
    startDate: "August 10, 2026",
    endDate: "November 10, 2026",
    requiredHours: 486,
    renderedHours: 486,
    status: "Completed",
  },
};

export default async function PlacementDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const placement = placementData[id];

  if (!placement) {
    return <h1>Placement not found</h1>;
  }

  const progress = Math.round(
    (placement.renderedHours / placement.requiredHours) * 100
  );

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/placements">
          Placements
        </Link>

        <span>/</span>

        <span>{id}</span>
      </div>

      <header className="record-header">
        <div>
          <span className="section-label">
            PLACEMENT RECORD
          </span>

          <h1>{placement.student}</h1>

          <p>
            {placement.opportunity} · {placement.company}
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
          <strong>{id}</strong>
        </div>

        <div>
          <span>RENDERED HOURS</span>
          <strong>
            {placement.renderedHours} / {placement.requiredHours}
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
        </div>
      </section>

      <section className="student-records">
        <span className="section-label">
          RELATED PLACEMENT RECORDS
        </span>

        <Link
          href={`/dashboard/students/${placement.studentId}`}
          className="student-record-link"
        >
          <div>
            <span className="record-number">01</span>

            <div>
              <strong>Student Profile</strong>
              <p>Open the student’s complete internship record</p>
            </div>
          </div>

          <span>→</span>
        </Link>

        <Link
          href={`/dashboard/progress?student=${placement.studentId}`}
          className="student-record-link"
        >
          <div>
            <span className="record-number">02</span>

            <div>
              <strong>Progress Reports</strong>
              <p>Review rendered hours and submitted progress reports</p>
            </div>
          </div>

          <span>→</span>
        </Link>

        <Link
          href={`/dashboard/evaluations?student=${placement.studentId}`}
          className="student-record-link"
        >
          <div>
            <span className="record-number">03</span>

            <div>
              <strong>Evaluations</strong>
              <p>Check company and faculty evaluation records</p>
            </div>
          </div>

          <span>→</span>
        </Link>
      </section>
    </>
  );
}