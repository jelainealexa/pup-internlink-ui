import Link from "next/link";

const students = [
  {
    id: "2024-0001",
    name: "Angela Reyes",
    program: "BS Computer Engineering",
    company: "Accenture",
    status: "Active",
  },
  {
    id: "2024-0002",
    name: "Miguel Santos",
    program: "BS Information Technology",
    company: "IBM Philippines",
    status: "Active",
  },
  {
    id: "2024-0003",
    name: "Sofia Cruz",
    program: "BS Computer Science",
    company: "Globe Telecom",
    status: "Completed",
  },
];

export default function StudentsPage() {
  return (
    <>
      <header className="content-header">
        <div className="page-eyebrow">
          02 / Student Directory
        </div>

        <h1>Students</h1>

        <p>
          Monitor student placements, internship progress, and records
          for the current academic term.
        </p>
      </header>

      <div className="placeholder-block">
        <span className="section-label">
          FIND A STUDENT
        </span>

        <p>
          Search and filtering controls will be placed here.
        </p>
      </div>

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Program</th>
              <th>Placement</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td><strong>{student.name}</strong></td>
                <td>{student.program}</td>
                <td>{student.company}</td>
                <td>{student.status}</td>

                <td>
                  <Link href={`/dashboard/students/${student.id}`}>
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