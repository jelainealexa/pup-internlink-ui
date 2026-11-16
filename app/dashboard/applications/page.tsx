import Link from "next/link";

const applications = [
  {
    id: "app-001",
    student: "Angela Reyes",
    studentNumber: "2024-0001",
    opportunity: "Software Development Intern",
    company: "Accenture Philippines",
    date: "Nov. 10, 2026",
    status: "Pending",
  },
  {
    id: "app-002",
    student: "Miguel Santos",
    studentNumber: "2024-0002",
    opportunity: "IT Support Intern",
    company: "IBM Philippines",
    date: "Nov. 8, 2026",
    status: "Accepted",
  },
  {
    id: "app-003",
    student: "Sofia Cruz",
    studentNumber: "2024-0003",
    opportunity: "Data Analytics Intern",
    company: "Globe Telecom",
    date: "Nov. 2, 2026",
    status: "Rejected",
  },
];

export default function ApplicationsPage() {
  const pending = applications.filter(
    (application) => application.status === "Pending"
  ).length;

  const accepted = applications.filter(
    (application) => application.status === "Accepted"
  ).length;

  const rejected = applications.filter(
    (application) => application.status === "Rejected"
  ).length;

  return (
    <>
      <header className="content-header">
        <div className="page-eyebrow">
          05 / Applications
        </div>

        <h1>Applications</h1>

        <p>
          Review student applications and manage their application status
          before placement.
        </p>
      </header>

      <section className="application-summary">
        <div>
          <span className="section-label">PENDING</span>
          <strong>{pending}</strong>
          <p>applications waiting for review</p>
        </div>

        <div>
          <span className="section-label">ACCEPTED</span>
          <strong>{accepted}</strong>
          <p>applications approved for placement</p>
        </div>

        <div>
          <span className="section-label">REJECTED</span>
          <strong>{rejected}</strong>
          <p>applications not approved</p>
        </div>
      </section>

      <section className="application-controls">
        <div>
          <label>SEARCH</label>
          <input
            type="search"
            placeholder="Student name or student number"
          />
        </div>

        <div>
          <label>STATUS</label>
          <select>
            <option>All</option>
            <option>Pending</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>
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
          <label>OPPORTUNITY</label>
          <select>
            <option>All Opportunities</option>
            <option>Software Development Intern</option>
            <option>IT Support Intern</option>
            <option>Data Analytics Intern</option>
          </select>
        </div>
      </section>

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Student</th>
              <th>Student Number</th>
              <th>Opportunity</th>
              <th>Company</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {applications.map((application) => (
              <tr key={application.id}>
                <td>{application.id}</td>

                <td>
                  <strong>{application.student}</strong>
                </td>

                <td>{application.studentNumber}</td>

                <td>{application.opportunity}</td>

                <td>{application.company}</td>

                <td>{application.date}</td>

                <td>{application.status}</td>

                <td>
                  <Link
                    href={`/dashboard/applications/${application.id}`}
                  >
                    Open →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}