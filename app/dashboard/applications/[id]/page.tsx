import Link from "next/link";

const applicationData: Record<string, {
  student: string;
  studentId: string;
  program: string;
  yearSection: string;
  opportunity: string;
  company: string;
  description: string;
  slots: number;
  status: string;
  submissionDate: string;
}> = {
  "app-001": {
    student: "Angela Reyes",
    studentId: "2024-0001",
    program: "BS Computer Engineering",
    yearSection: "4th Year / 4-1",
    opportunity: "Software Development Intern",
    company: "Accenture Philippines",
    description: "Software development and application support internship.",
    slots: 4,
    status: "Pending",
    submissionDate: "November 10, 2026",
  },

  "app-002": {
    student: "Miguel Santos",
    studentId: "2024-0002",
    program: "BS Information Technology",
    yearSection: "4th Year / 4-2",
    opportunity: "IT Support Intern",
    company: "IBM Philippines",
    description: "Technical support and infrastructure internship.",
    slots: 2,
    status: "Accepted",
    submissionDate: "November 8, 2026",
  },

  "app-003": {
    student: "Sofia Cruz",
    studentId: "2024-0003",
    program: "BS Computer Science",
    yearSection: "4th Year / 4-1",
    opportunity: "Data Analytics Intern",
    company: "Globe Telecom",
    description: "Data processing and analytics internship.",
    slots: 3,
    status: "Rejected",
    submissionDate: "November 2, 2026",
  },
};

export default async function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = applicationData[id];

  if (!application) {
    return <h1>Application not found</h1>;
  }

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/applications">
          Applications
        </Link>

        <span>/</span>

        <span>{application.student}</span>
      </div>

      <header className="record-header">
        <div>
          <span className="section-label">
            APPLICATION RECORD
          </span>

          <h1>{application.student}</h1>

          <p>
            {application.opportunity} · {application.company}
          </p>
        </div>

        <div className="record-status">
          <span>STATUS</span>
          <strong>{application.status}</strong>
        </div>
      </header>

      <section className="detail-grid">
        <div className="detail-section">
          <span className="section-label">
            STUDENT INFORMATION
          </span>

          <dl className="record-list">
            <div>
              <dt>Name</dt>
              <dd>{application.student}</dd>
            </div>

            <div>
              <dt>Student Number</dt>
              <dd>{application.studentId}</dd>
            </div>

            <div>
              <dt>Program</dt>
              <dd>{application.program}</dd>
            </div>

            <div>
              <dt>Year / Section</dt>
              <dd>{application.yearSection}</dd>
            </div>
          </dl>

          <Link
            href={`/dashboard/students/${application.studentId}`}
            className="simple-action"
          >
            View Student Profile →
          </Link>
        </div>

        <div className="detail-section">
          <span className="section-label">
            OPPORTUNITY INFORMATION
          </span>

          <dl className="record-list">
            <div>
              <dt>Position</dt>
              <dd>{application.opportunity}</dd>
            </div>

            <div>
              <dt>Company</dt>
              <dd>{application.company}</dd>
            </div>

            <div>
              <dt>Available Slots</dt>
              <dd>{application.slots}</dd>
            </div>

            <div>
              <dt>Description</dt>
              <dd>{application.description}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="detail-grid">
        <div className="detail-section">
          <span className="section-label">
            APPLICATION INFORMATION
          </span>

          <dl className="record-list">
            <div>
              <dt>Application ID</dt>
              <dd>{id}</dd>
            </div>

            <div>
              <dt>Submission Date</dt>
              <dd>{application.submissionDate}</dd>
            </div>

            <div>
              <dt>Status</dt>
              <dd>{application.status}</dd>
            </div>
          </dl>
        </div>

        <div className="detail-section">
          <span className="section-label">
            MANDATORY REQUIREMENTS
          </span>

          <div className="requirement-row">
            <span>Resume</span>
            <strong>Approved</strong>
          </div>

          <div className="requirement-row">
            <span>Transcript of Records</span>
            <strong>Approved</strong>
          </div>

          <div className="requirement-row">
            <span>Medical Certificate</span>
            <strong>Approved</strong>
          </div>
        </div>
      </section>

      <section className="decision-section">
        <span className="section-label">
          AVAILABLE ACTIONS
        </span>

        {application.status === "Pending" && (
          <>
            <p>
              Review the student information, required documents, and
              opportunity availability before making a decision.
            </p>

            <div className="decision-actions">
              <button className="secondary-action">
                Reject Application
              </button>

              <button className="primary-action">
                Accept Application
              </button>
            </div>
          </>
        )}

        {application.status === "Accepted" && (
          <>
            <p>
              This application has been accepted and is ready for official
              internship placement.
            </p>

            <Link
              href={`/dashboard/placements/create?application=${id}`}
              className="primary-action link-button"
            >
              Create Placement →
            </Link>
          </>
        )}

        {application.status === "Rejected" && (
          <>
            <p>
              This application was rejected and remains in the student's
              application history.
            </p>

            <div className="rejection-note">
              <span>REJECTION REASON</span>

              <p>
                Required criteria for the selected opportunity were not met.
              </p>
            </div>
          </>
        )}
      </section>
    </>
  );
}