import Link from "next/link";

const placements = [
  {
    id: "PL-001",
    student: "Miguel Santos",
    company: "IBM Philippines",
    opportunity: "IT Support Intern",
    adviser: "Prof. Maria Santos",
    supervisor: "John Reyes",
    startDate: "Nov. 15, 2026",
    endDate: "Feb. 15, 2027",
    requiredHours: 486,
    renderedHours: 280,
    status: "Ongoing",
  },
  {
    id: "PL-002",
    student: "Sofia Cruz",
    company: "Globe Telecom",
    opportunity: "Data Analytics Intern",
    adviser: "Prof. Carlo Mendoza",
    supervisor: "Patricia Lim",
    startDate: "Aug. 10, 2026",
    endDate: "Nov. 10, 2026",
    requiredHours: 486,
    renderedHours: 486,
    status: "Completed",
  },
];

export default function PlacementsPage() {
  return (
    <>
      <header className="content-header">
        <div className="page-eyebrow">
          06 / Placements
        </div>

        <h1>Placements</h1>

        <p>
          Manage official internship assignments for students with
          accepted applications.
        </p>
      </header>

      <section className="placement-summary">
        <div>
          <span className="section-label">ONGOING</span>
          <strong>87</strong>
          <p>active internship placements</p>
        </div>

        <div>
          <span className="section-label">COMPLETED</span>
          <strong>24</strong>
          <p>placements already completed</p>
        </div>

        <div>
          <span className="section-label">TERMINATED</span>
          <strong>03</strong>
          <p>placements ended before completion</p>
        </div>
      </section>

      <section className="placement-controls">
        <div>
          <label>SEARCH</label>
          <input
            type="search"
            placeholder="Student name or placement ID"
          />
        </div>

        <div>
          <label>COMPANY</label>
          <select>
            <option>All Companies</option>
            <option>IBM Philippines</option>
            <option>Globe Telecom</option>
          </select>
        </div>

        <div>
          <label>STATUS</label>
          <select>
            <option>All</option>
            <option>Ongoing</option>
            <option>Completed</option>
            <option>Terminated</option>
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
      </section>

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Placement ID</th>
              <th>Student</th>
              <th>Company</th>
              <th>Opportunity</th>
              <th>Faculty Adviser</th>
              <th>Supervisor</th>
              <th>Hours</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {placements.map((placement) => (
              <tr key={placement.id}>
                <td>{placement.id}</td>
                <td>{placement.student}</td>
                <td>{placement.company}</td>
                <td>{placement.opportunity}</td>
                <td>{placement.adviser}</td>
                <td>{placement.supervisor}</td>
                <td>
                  {placement.renderedHours} / {placement.requiredHours}
                </td>
                <td>{placement.status}</td>

                <td>
                  <Link
                    href={`/dashboard/placements/${placement.id}`}
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