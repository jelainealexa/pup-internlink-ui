import Link from "next/link";

const studentData: Record<string, {
  name: string;
  program: string;
  yearSection: string;
  email: string;
  placement: string;
  position: string;
  status: string;
  hours: number;
  requiredHours: number;
}> = {
  "2024-0001": {
    name: "Angela Reyes",
    program: "BS Computer Engineering",
    yearSection: "4th Year / 4-1",
    email: "angela.reyes@example.com",
    placement: "Accenture Philippines",
    position: "Software Development Intern",
    status: "Ongoing",
    hours: 320,
    requiredHours: 486,
  },

  "2024-0002": {
    name: "Miguel Santos",
    program: "BS Information Technology",
    yearSection: "4th Year / 4-2",
    email: "miguel.santos@example.com",
    placement: "IBM Philippines",
    position: "IT Support Intern",
    status: "Ongoing",
    hours: 280,
    requiredHours: 486,
  },

  "2024-0003": {
    name: "Sofia Cruz",
    program: "BS Computer Science",
    yearSection: "4th Year / 4-1",
    email: "sofia.cruz@example.com",
    placement: "Globe Telecom",
    position: "Data Analytics Intern",
    status: "Completed",
    hours: 486,
    requiredHours: 486,
  },

  "2024-0004": {
    name: "Joshua Tan",
    program: "BS Information Technology",
    yearSection: "4th Year / 4-3",
    email: "joshua.tan@example.com",
    placement: "Not Yet Placed",
    position: "None",
    status: "Applying",
    hours: 0,
    requiredHours: 486,
  },
};

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const student = studentData[id];

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
            {student.program} · {student.yearSection}
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
            CURRENT INTERNSHIP
          </span>

          <div className="student-company">
            {student.placement}
          </div>

          <p>
            {student.position}
          </p>

        </div>

        <div className="student-status-info">

          <div>
            <span>STATUS</span>

            <strong>
              {student.status}
            </strong>
          </div>

          <div>
            <span>RENDERED HOURS</span>

            <strong>
              {student.hours} / {student.requiredHours}
            </strong>
          </div>

          <div>
            <span>PROGRESS</span>

            <strong>
              {progress}%
            </strong>
          </div>

        </div>

      </section>

      {/* BASIC STUDENT INFO */}

      <section className="student-record-grid">

        <div className="student-record-section">

          <span className="section-label">
            PROFILE
          </span>

          <dl className="record-list">

            <div>
              <dt>Student ID</dt>
              <dd>{id}</dd>
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
              <dt>Year / Section</dt>
              <dd>{student.yearSection}</dd>
            </div>

          </dl>

        </div>

        <div className="student-record-section">

          <span className="section-label">
            PLACEMENT SUMMARY
          </span>

          <dl className="record-list">

            <div>
              <dt>Company</dt>
              <dd>{student.placement}</dd>
            </div>

            <div>
              <dt>Position</dt>
              <dd>{student.position}</dd>
            </div>

            <div>
              <dt>Status</dt>
              <dd>{student.status}</dd>
            </div>

            <div>
              <dt>Required Hours</dt>
              <dd>{student.requiredHours}</dd>
            </div>

          </dl>

        </div>

      </section>

      {/* CENTRAL ACCESS TO RELATED RECORDS */}

      <section className="student-records">

        <span className="section-label">
          STUDENT INTERNSHIP RECORD
        </span>

        <Link
          href={`/dashboard/requirements?student=${id}`}
          className="student-record-link"
        >
          <div>
            <span className="record-number">
              01
            </span>

            <div>
              <strong>
                Requirements
              </strong>

              <p>
                Submitted documents, review status, and remarks
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
            <span className="record-number">
              02
            </span>

            <div>
              <strong>
                Applications
              </strong>

              <p>
                Internship applications and their current status
              </p>
            </div>
          </div>

          <span>→</span>
        </Link>

        <Link
          href={`/dashboard/placements?student=${id}`}
          className="student-record-link"
        >
          <div>
            <span className="record-number">
              03
            </span>

            <div>
              <strong>
                Placement
              </strong>

              <p>
                Company, opportunity, supervisors, dates, and required hours
              </p>
            </div>
          </div>

          <span>→</span>
        </Link>

        <Link
          href={`/dashboard/progress?student=${id}`}
          className="student-record-link"
        >
          <div>
            <span className="record-number">
              04
            </span>

            <div>
              <strong>
                Progress
              </strong>

              <p>
                Progress reports, activities, and rendered hours
              </p>
            </div>
          </div>

          <span>→</span>
        </Link>

        <Link
          href={`/dashboard/evaluations?student=${id}`}
          className="student-record-link"
        >
          <div>
            <span className="record-number">
              05
            </span>

            <div>
              <strong>
                Evaluations
              </strong>

              <p>
                Company supervisor and faculty adviser evaluations
              </p>
            </div>
          </div>

          <span>→</span>
        </Link>

      </section>
    </>
  );
}