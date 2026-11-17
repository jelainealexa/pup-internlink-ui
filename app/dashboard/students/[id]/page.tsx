import Link from "next/link";

import {
  applications,
  placements,
  students,
} from "@/app/lib/mockData";

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const student = students.find(
    (record) => record.id === id
  );

  if (!student) {
    return <h1>Student not found</h1>;
  }

  const studentApplications =
    applications.filter(
      (application) =>
        application.studentId === id
    );

  const placement = placements.find(
    (record) => record.studentId === id
  );

  const progress =
    student.requiredHours > 0
      ? Math.round(
          (student.hours /
            student.requiredHours) *
            100
        )
      : 0;

  const remaining = Math.max(
    student.requiredHours - student.hours,
    0
  );

  return (
    <>
      {/* BREADCRUMB */}

      <div className="breadcrumb">
        <Link href="/dashboard/students">
          Students
        </Link>

        <span>/</span>

        <span>{student.name}</span>
      </div>


      {/* IDENTITY HERO */}

      <section className="student-hero-v2">

        <div className="student-identity-v2">
          <span className="section-label">
            STUDENT PROFILE
          </span>

          <h1>{student.name}</h1>

          <div className="student-identity-meta">
            <span>{student.id}</span>

            <span>{student.program}</span>

            <span>
              {student.yearLevel} ·{" "}
              {student.section}
            </span>
          </div>
        </div>

        <Link
          href={`/dashboard/students/${student.id}/edit`}
          className="secondary-action link-button-reset"
        >
          Edit Profile
        </Link>

      </section>


      {/* MAIN INTERNSHIP STATUS */}

      <section className="student-internship-card">

        <div className="student-internship-primary">
          <div className="student-status-row">
            <span className="student-status-pill">
              {student.status}
            </span>

            {placement && (
              <span className="student-placement-id">
                {placement.id}
              </span>
            )}
          </div>

          <span className="section-label">
            CURRENT INTERNSHIP
          </span>

          <h2>
            {student.placement}
          </h2>

          <p>
            {student.position}
          </p>
        </div>


        <div className="student-progress-v2">

          <div className="student-progress-main">
            <strong>{progress}%</strong>

            <span>completed</span>
          </div>

          <div className="student-progress-track">
            <div
              style={{
                width: `${Math.min(
                  progress,
                  100
                )}%`,
              }}
            />
          </div>

          <div className="student-progress-numbers">
            <div>
              <strong>{student.hours}</strong>
              <span>Rendered</span>
            </div>

            <div>
              <strong>{remaining}</strong>
              <span>Remaining</span>
            </div>

            <div>
              <strong>
                {student.requiredHours}
              </strong>
              <span>Required</span>
            </div>
          </div>

        </div>

      </section>


      {/* RECORD SHORTCUTS */}

      <section className="student-record-hub">

        <div className="student-section-heading">
          <div>
            <span className="section-label">
              INTERNSHIP RECORD
            </span>

            <h2>
              Everything related to this student
            </h2>
          </div>
        </div>


        <div className="student-record-card-grid">

          <Link
            href={`/dashboard/requirements?student=${id}`}
            className="student-record-card"
          >
            <span className="record-card-index">
              01
            </span>

            <strong>Requirements</strong>

            <p>
              Documents and review status
            </p>

            <span className="record-card-arrow">
              →
            </span>
          </Link>


          <Link
            href={`/dashboard/applications?student=${id}`}
            className="student-record-card"
          >
            <span className="record-card-index">
              02
            </span>

            <strong>Applications</strong>

            <p>
              {studentApplications.length}{" "}
              application
              {studentApplications.length !== 1
                ? "s"
                : ""}
            </p>

            <span className="record-card-arrow">
              →
            </span>
          </Link>


          {placement ? (
            <Link
              href={`/dashboard/placements/${placement.id}`}
              className="student-record-card"
            >
              <span className="record-card-index">
                03
              </span>

              <strong>Placement</strong>

              <p>
                {placement.company}
              </p>

              <span className="record-card-arrow">
                →
              </span>
            </Link>
          ) : (
            <div className="student-record-card student-card-disabled">
              <span className="record-card-index">
                03
              </span>

              <strong>Placement</strong>

              <p>
                Not yet available
              </p>
            </div>
          )}


          {placement ? (
            <Link
              href={`/dashboard/progress/${id}`}
              className="student-record-card"
            >
              <span className="record-card-index">
                04
              </span>

              <strong>Progress</strong>

              <p>
                {progress}% completed
              </p>

              <span className="record-card-arrow">
                →
              </span>
            </Link>
          ) : (
            <div className="student-record-card student-card-disabled">
              <span className="record-card-index">
                04
              </span>

              <strong>Progress</strong>

              <p>
                Available after placement
              </p>
            </div>
          )}


          <Link
            href={`/dashboard/evaluations?student=${id}`}
            className="student-record-card"
          >
            <span className="record-card-index">
              05
            </span>

            <strong>Evaluations</strong>

            <p>
              Company and faculty records
            </p>

            <span className="record-card-arrow">
              →
            </span>
          </Link>

        </div>

      </section>


      {/* DETAILS */}

      <section className="student-detail-v2">

        <div className="student-detail-panel">
          <span className="section-label">
            STUDENT INFORMATION
          </span>

          <dl className="student-info-list">

            <div>
              <dt>Student ID</dt>
              <dd>{student.id}</dd>
            </div>

            <div>
              <dt>Email</dt>
              <dd>{student.email}</dd>
            </div>

            <div>
              <dt>Program</dt>
              <dd>{student.program}</dd>
            </div>

            <div>
              <dt>Year Level</dt>
              <dd>{student.yearLevel}</dd>
            </div>

            <div>
              <dt>Section</dt>
              <dd>{student.section}</dd>
            </div>

          </dl>
        </div>


        <div className="student-detail-panel student-placement-detail">

          <span className="section-label">
            PLACEMENT DETAILS
          </span>

          {placement ? (
            <dl className="student-info-list">

              <div>
                <dt>Company</dt>
                <dd>{placement.company}</dd>
              </div>

              <div>
                <dt>Opportunity</dt>
                <dd>
                  {placement.opportunity}
                </dd>
              </div>

              <div>
                <dt>Faculty Adviser</dt>
                <dd>
                  {placement.adviser}
                </dd>
              </div>

              <div>
                <dt>Supervisor</dt>
                <dd>
                  {placement.supervisor}
                </dd>
              </div>

              <div>
                <dt>Start Date</dt>
                <dd>
                  {placement.startDate}
                </dd>
              </div>

              <div>
                <dt>End Date</dt>
                <dd>
                  {placement.endDate}
                </dd>
              </div>

            </dl>
          ) : (
            <p className="empty-message">
              No placement has been created yet.
            </p>
          )}

        </div>

      </section>
    </>
  );
}