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
    return (
      <>
        <Link
          href="/dashboard/students"
          className="back-link"
        >
          ← Back to Students
        </Link>

        <h1>Student not found</h1>
      </>
    );
  }

  const studentApplications = applications.filter(
    (application) => application.studentId === id
  );

  const placement = placements.find(
    (record) => record.studentId === id
  );

  const progress =
    student.requiredHours > 0
      ? Math.round(
          (student.hours / student.requiredHours) * 100
        )
      : 0;

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/students">
          Students
        </Link>

        <span>/</span>

        <span>{student.name}</span>
      </div>

      <header className="student-profile-header">
        <div>
          <span className="section-label">
            STUDENT RECORD
          </span>

          <h1 className="student-name">
            {student.name}
          </h1>

          <p className="student-program">
            {student.program} · {student.yearLevel} ·{" "}
            {student.section}
          </p>
        </div>

        <div className="profile-header-actions">
          <div className="student-id-block">
            <span>STUDENT ID</span>
            <strong>{student.id}</strong>
          </div>

          <Link
            href={`/dashboard/students/${student.id}/edit`}
            className="secondary-action link-button-reset"
          >
            Edit Student
          </Link>
        </div>
      </header>

      <section className="student-overview">
        <div className="student-main-info">
          <span className="section-label">
            CURRENT INTERNSHIP
          </span>

          <div className="student-company">
            {student.placement}
          </div>

          <p>{student.position}</p>
        </div>

        <div className="student-status-info">
          <div>
            <span>STATUS</span>
            <strong>{student.status}</strong>
          </div>

          <div>
            <span>RENDERED HOURS</span>

            <strong>
              {student.hours} / {student.requiredHours}
            </strong>
          </div>

          <div>
            <span>PROGRESS</span>
            <strong>{progress}%</strong>
          </div>
        </div>
      </section>

      <section className="student-record-grid">
        <div className="student-record-section">
          <span className="section-label">
            PROFILE
          </span>

          <dl className="record-list">
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

        <div className="student-record-section">
          <span className="section-label">
            PLACEMENT SUMMARY
          </span>

          {placement ? (
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
                <dt>Faculty Adviser</dt>
                <dd>{placement.adviser}</dd>
              </div>

              <div>
                <dt>Supervisor</dt>
                <dd>{placement.supervisor}</dd>
              </div>

              <div>
                <dt>Start Date</dt>
                <dd>{placement.startDate}</dd>
              </div>

              <div>
                <dt>End Date</dt>
                <dd>{placement.endDate}</dd>
              </div>
            </dl>
          ) : (
            <p className="empty-message">
              No official placement has been created yet.
            </p>
          )}
        </div>
      </section>

      <section className="student-records">
        <span className="section-label">
          STUDENT INTERNSHIP RECORD
        </span>

        <Link
          href={`/dashboard/requirements?student=${id}`}
          className="student-record-link"
        >
          <div>
            <span className="record-number">01</span>

            <div>
              <strong>Requirements</strong>

              <p>
                Submitted documents, review status, and
                remarks
              </p>
            </div>
          </div>

          <span>→</span>
        </Link>

        <Link
          href={`/dashboard/applications?student=${id}`}
          className="student-record-link"
        >
          <div>
            <span className="record-number">02</span>

            <div>
              <strong>Applications</strong>

              <p>
                {studentApplications.length} application
                {studentApplications.length !== 1 ? "s" : ""}{" "}
                recorded
              </p>
            </div>
          </div>

          <span>→</span>
        </Link>

        {placement ? (
          <Link
            href={`/dashboard/placements/${placement.id}`}
            className="student-record-link"
          >
            <div>
              <span className="record-number">03</span>

              <div>
                <strong>Placement</strong>

                <p>
                  Open official placement record{" "}
                  {placement.id}
                </p>
              </div>
            </div>

            <span>→</span>
          </Link>
        ) : (
          <div className="student-record-link disabled-record">
            <div>
              <span className="record-number">03</span>

              <div>
                <strong>Placement</strong>
                <p>No placement created yet</p>
              </div>
            </div>
          </div>
        )}

        {placement ? (
          <Link
            href={`/dashboard/progress/${id}`}
            className="student-record-link"
          >
            <div>
              <span className="record-number">04</span>

              <div>
                <strong>Progress</strong>
                <p>
                  Progress reports and accumulated hours
                </p>
              </div>
            </div>

            <span>→</span>
          </Link>
        ) : (
          <div className="student-record-link disabled-record">
            <div>
              <span className="record-number">04</span>

              <div>
                <strong>Progress</strong>
                <p>Available after placement</p>
              </div>
            </div>
          </div>
        )}

        <Link
          href={`/dashboard/evaluations?student=${id}`}
          className="student-record-link"
        >
          <div>
            <span className="record-number">05</span>

            <div>
              <strong>Evaluations</strong>

              <p>
                Company supervisor and faculty adviser
                evaluation records
              </p>
            </div>
          </div>

          <span>→</span>
        </Link>
      </section>
    </>
  );
}