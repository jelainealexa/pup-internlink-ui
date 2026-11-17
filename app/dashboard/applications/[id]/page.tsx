import Link from "next/link";
import ApplicationDecision from "@/app/components/ApplicationDecision";
import { applications } from "@/app/lib/mockData";

export default async function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = applications.find(
    (record) => record.id === id
  );

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
            {application.opportunity} ·{" "}
            {application.company}
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
              <dt>Year Level</dt>
              <dd>{application.yearLevel}</dd>
            </div>

            <div>
              <dt>Section</dt>
              <dd>{application.section}</dd>
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
              <dd>{application.id}</dd>
            </div>

            <div>
              <dt>Submission Date</dt>
              <dd>
                {application.submissionDate}
              </dd>
            </div>

            <div>
              <dt>Status</dt>
              <dd>{application.status}</dd>
            </div>
          </dl>
        </div>

        <div className="detail-section">
          <span className="section-label">
            RELATED REQUIREMENTS
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

      <ApplicationDecision
        applicationId={application.id}
        initialStatus={application.status}
        existingReason={
          application.rejectionReason
        }
      />
    </>
  );
}