import Link from "next/link";

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <div className="page-eyebrow">
        02 / Student Directory / {id}
      </div>

      <Link
        href="/dashboard/students"
        className="back-link"
      >
        ← Back to Students
      </Link>

      <header className="student-profile-header">
        <div>
          <span className="section-label">
            STUDENT RECORD
          </span>

          <h1 className="student-name">
            Angela Reyes
          </h1>

          <p className="student-program">
            BS Computer Engineering
          </p>
        </div>

        <div className="student-id-block">
          <span>STUDENT ID</span>
          <strong>{id}</strong>
        </div>
      </header>

      <section className="student-overview">
        <div className="student-main-info">
          <span className="section-label">
            INTERNSHIP PLACEMENT
          </span>

          <div className="student-company">
            Accenture Philippines
          </div>

          <p>
            Software Development Intern
          </p>
        </div>

        <div className="student-status-info">
          <div>
            <span>STATUS</span>
            <strong>Active</strong>
          </div>

          <div>
            <span>RENDERED HOURS</span>
            <strong>320 / 486</strong>
          </div>

          <div>
            <span>APPLICATION</span>
            <strong>Accepted</strong>
          </div>
        </div>
      </section>

      <section className="student-record-grid">
        <div className="student-record-section">
          <span className="section-label">
            BASIC INFORMATION
          </span>

          <dl className="record-list">
            <div>
              <dt>Email</dt>
              <dd>angela.reyes@example.com</dd>
            </div>

            <div>
              <dt>Program</dt>
              <dd>BS Computer Engineering</dd>
            </div>

            <div>
              <dt>Year Level</dt>
              <dd>4th Year</dd>
            </div>

            <div>
              <dt>Faculty Adviser</dt>
              <dd>Prof. Maria Santos</dd>
            </div>
          </dl>
        </div>

        <div className="student-record-section">
          <span className="section-label">
            INTERNSHIP DETAILS
          </span>

          <dl className="record-list">
            <div>
              <dt>Company</dt>
              <dd>Accenture Philippines</dd>
            </div>

            <div>
              <dt>Position</dt>
              <dd>Software Development Intern</dd>
            </div>

            <div>
              <dt>Work Setup</dt>
              <dd>Hybrid</dd>
            </div>

            <div>
              <dt>Start Date</dt>
              <dd>September 15, 2026</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="student-next">
        <span className="section-label">
          RELATED RECORDS
        </span>

        <Link
          href="/dashboard/applications"
          className="index-row"
        >
          <span className="index-number">01</span>

          <span className="index-title">
            Application Record
          </span>

          <span className="index-arrow">→</span>
        </Link>

        <Link
          href="/dashboard/evaluations"
          className="index-row"
        >
          <span className="index-number">02</span>

          <span className="index-title">
            Evaluation Record
          </span>

          <span className="index-arrow">→</span>
        </Link>
      </section>
    </>
  );
}