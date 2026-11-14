import Link from "next/link";
import { notFound } from "next/navigation";

const applicationData: Record<string, {
  student: string;
  studentId: string;
  company: string;
  role: string;
  internshipId: string;
  stage: string;
  submitted: string;
}> = {
  "app-001": {
    student: "Angela Reyes",
    studentId: "2024-0001",
    company: "Accenture Philippines",
    role: "Software Development Intern",
    internshipId: "software-development-intern",
    stage: "Screening",
    submitted: "November 10, 2026",
  },

  "app-002": {
    student: "Miguel Santos",
    studentId: "2024-0002",
    company: "IBM Philippines",
    role: "IT Support Intern",
    internshipId: "it-support-intern",
    stage: "Interview",
    submitted: "November 8, 2026",
  },

  "app-003": {
    student: "Sofia Cruz",
    studentId: "2024-0003",
    company: "Globe Telecom",
    role: "Data Analytics Intern",
    internshipId: "data-analytics-intern",
    stage: "Accepted",
    submitted: "November 2, 2026",
  },
};

const stages = [
  "Submitted",
  "Screening",
  "Interview",
  "Accepted",
];

export default async function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = applicationData[id];

  if (!application) {
    notFound();
  }

  const activeIndex =
    application.stage === "Screening"
      ? 1
      : application.stage === "Interview"
      ? 2
      : application.stage === "Accepted"
      ? 3
      : 0;

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
            {application.role} · {application.company}
          </p>
        </div>

        <div className="record-status">
          <span>CURRENT STAGE</span>
          <strong>{application.stage}</strong>
        </div>
      </header>

      <section className="status-stepper">
        {stages.map((stage, index) => (
          <div
            key={stage}
            className={`status-step ${
              index <= activeIndex ? "status-step-active" : ""
            }`}
          >
            <span>
              {String(index + 1).padStart(2, "0")}
            </span>

            <strong>{stage}</strong>
          </div>
        ))}
      </section>

      <section className="detail-grid">
        <div className="detail-section">
          <span className="section-label">
            APPLICATION INFORMATION
          </span>

          <dl className="record-list">
            <div>
              <dt>Applicant</dt>
              <dd>{application.student}</dd>
            </div>

            <div>
              <dt>Position</dt>
              <dd>{application.role}</dd>
            </div>

            <div>
              <dt>Company</dt>
              <dd>{application.company}</dd>
            </div>

            <div>
              <dt>Submitted</dt>
              <dd>{application.submitted}</dd>
            </div>
          </dl>
        </div>

        <div className="detail-section">
          <span className="section-label">
            REQUIREMENTS
          </span>

          <div className="requirement-row">
            <span>Resume</span>
            <strong>Submitted</strong>
          </div>

          <div className="requirement-row">
            <span>Endorsement Letter</span>
            <strong>Submitted</strong>
          </div>

          <div className="requirement-row">
            <span>Application Form</span>
            <strong>Submitted</strong>
          </div>
        </div>
      </section>

      <section className="action-section">
        <span className="section-label">
          RELATED RECORDS
        </span>

        <div className="action-links">
          <Link
            href={`/dashboard/students/${application.studentId}`}
            className="action-link"
          >
            <small>STUDENT</small>
            <strong>
              View {application.student}
            </strong>
            <span>→</span>
          </Link>

          <Link
            href={`/dashboard/internships/${application.internshipId}`}
            className="action-link"
          >
            <small>OPPORTUNITY</small>
            <strong>
              View Internship Posting
            </strong>
            <span>→</span>
          </Link>
        </div>
      </section>

      <section className="decision-section">
        <span className="section-label">
          NEXT ACTION
        </span>

        {application.stage === "Screening" && (
          <>
            <p>
              The application is currently under screening.
            </p>

            <div className="decision-actions">
              <button className="secondary-action">
                Reject Application
              </button>

              <button className="primary-action">
                Move to Interview
              </button>
            </div>
          </>
        )}

        {application.stage === "Interview" && (
          <>
            <p>
              The applicant has reached the interview stage.
            </p>

            <div className="decision-actions">
              <button className="secondary-action">
                Reject Application
              </button>

              <button className="primary-action">
                Mark as Accepted
              </button>
            </div>
          </>
        )}

        {application.stage === "Accepted" && (
          <p>
            This application has been accepted and can proceed to
            internship placement.
          </p>
        )}
      </section>
    </>
  );
}