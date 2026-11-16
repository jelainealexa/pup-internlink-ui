import Link from "next/link";

const progressRecords = [
  {
    studentId: "2024-0001",
    student: "Angela Reyes",
    company: "Accenture Philippines",
    adviser: "Prof. Maria Santos",
    requiredHours: 486,
    renderedHours: 320,
    status: "Ongoing",
  },
  {
    studentId: "2024-0002",
    student: "Miguel Santos",
    company: "IBM Philippines",
    adviser: "Prof. Maria Santos",
    requiredHours: 486,
    renderedHours: 280,
    status: "Ongoing",
  },
  {
    studentId: "2024-0003",
    student: "Sofia Cruz",
    company: "Globe Telecom",
    adviser: "Prof. Carlo Mendoza",
    requiredHours: 486,
    renderedHours: 486,
    status: "Completed",
  },
];

export default function ProgressPage() {
  return (
    <>
      <header className="content-header">
        <div className="page-eyebrow">
          07 / Progress Monitoring
        </div>

        <h1>Progress monitoring</h1>

        <p>
          Track student internship progress through rendered hours,
          submitted reports, and completion status.
        </p>
      </header>

      <section className="progress-summary">
        <div>
          <span className="section-label">
            ONGOING PLACEMENTS
          </span>

          <strong>87</strong>

          <p>students currently completing internship hours</p>
        </div>

        <div>
          <span className="section-label">
            PENDING REVIEWS
          </span>

          <strong>14</strong>

          <p>progress reports waiting for review</p>
        </div>

        <div>
          <span className="section-label">
            NEAR COMPLETION
          </span>

          <strong>11</strong>

          <p>students close to completing required hours</p>
        </div>

        <div>
          <span className="section-label">
            HOURS COMPLETED
          </span>

          <strong>24</strong>

          <p>students who completed required internship hours</p>
        </div>
      </section>

      <section className="progress-controls">
        <div>
          <label>SEARCH</label>

          <input
            type="search"
            placeholder="Student name or student number"
          />
        </div>

        <div>
          <label>COMPANY</label>

          <select>
            <option>All Companies</option>
            <option>Accenture Philippines</option>
            <option>IBM Philippines</option>
            <option>Globe Telecom</option>
          </select>
        </div>

        <div>
          <label>FACULTY ADVISER</label>

          <select>
            <option>All Advisers</option>
            <option>Prof. Maria Santos</option>
            <option>Prof. Carlo Mendoza</option>
          </select>
        </div>

        <div>
          <label>STATUS</label>

          <select>
            <option>All</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>
        </div>
      </section>

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Student Number</th>
              <th>Company</th>
              <th>Faculty Adviser</th>
              <th>Required</th>
              <th>Rendered</th>
              <th>Remaining</th>
              <th>Progress</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {progressRecords.map((record) => {
              const remaining = Math.max(
                record.requiredHours - record.renderedHours,
                0
              );

              const completion = Math.round(
                (record.renderedHours / record.requiredHours) * 100
              );

              return (
                <tr key={record.studentId}>
                  <td>
                    <strong>{record.student}</strong>
                  </td>

                  <td>{record.studentId}</td>

                  <td>{record.company}</td>

                  <td>{record.adviser}</td>

                  <td>{record.requiredHours}</td>

                  <td>{record.renderedHours}</td>

                  <td>{remaining}</td>

                  <td>{completion}%</td>

                  <td>{record.status}</td>

                  <td>
                    <Link
                      href={`/dashboard/progress/${record.studentId}`}
                    >
                      Open →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}