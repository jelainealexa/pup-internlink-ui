"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const students = [
  {
    id: "2024-0001",
    name: "Angela Reyes",
    program: "BS Computer Engineering",
    yearSection: "4th Year / 4-1",
    placement: "Accenture Philippines",
    status: "Ongoing",
    hours: 320,
  },
  {
    id: "2024-0002",
    name: "Miguel Santos",
    program: "BS Information Technology",
    yearSection: "4th Year / 4-2",
    placement: "IBM Philippines",
    status: "Ongoing",
    hours: 280,
  },
  {
    id: "2024-0003",
    name: "Sofia Cruz",
    program: "BS Computer Science",
    yearSection: "4th Year / 4-1",
    placement: "Globe Telecom",
    status: "Completed",
    hours: 486,
  },
  {
    id: "2024-0004",
    name: "Joshua Tan",
    program: "BS Information Technology",
    yearSection: "4th Year / 4-3",
    placement: "Not Yet Placed",
    status: "Applying",
    hours: 0,
  },
];

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("name");

  const filteredStudents = useMemo(() => {
    let result = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.id.toLowerCase().includes(search.toLowerCase());

      const matchesProgram =
        program === "All" || student.program === program;

      const matchesStatus =
        status === "All" || student.status === status;

      return matchesSearch && matchesProgram && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      if (sort === "id") {
        return a.id.localeCompare(b.id);
      }

      if (sort === "hours") {
        return b.hours - a.hours;
      }

      return a.name.localeCompare(b.name);
    });

    return result;
  }, [search, program, status, sort]);

  return (
    <>
      <header className="content-header students-header">
        <div>
          <div className="page-eyebrow">
            02 / Student Directory
          </div>

          <h1>Students</h1>

          <p>
            Find student records, check placement status, and open each
            student's complete internship record.
          </p>
        </div>

        <button className="primary-action">
          + Add Student
        </button>
      </header>

      <section className="student-controls">
        <div className="student-search">
          <label>SEARCH</label>

          <input
            type="search"
            placeholder="Student name or student ID"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div>
          <label>PROGRAM</label>

          <select
            value={program}
            onChange={(event) => setProgram(event.target.value)}
          >
            <option>All</option>
            <option>BS Computer Engineering</option>
            <option>BS Information Technology</option>
            <option>BS Computer Science</option>
          </select>
        </div>

        <div>
          <label>STATUS</label>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>All</option>
            <option>Applying</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>
        </div>

        <div>
          <label>SORT BY</label>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="name">Student Name</option>
            <option value="id">Student ID</option>
            <option value="hours">Rendered Hours</option>
          </select>
        </div>
      </section>

      <div className="directory-meta">
        <span>
          {filteredStudents.length} student
          {filteredStudents.length !== 1 ? "s" : ""}
        </span>

        <span>
          Current Academic Term
        </span>
      </div>

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student</th>
              <th>Program</th>
              <th>Year / Section</th>
              <th>Placement</th>
              <th>Status</th>
              <th>Hours</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>

                <td>
                  <strong>{student.name}</strong>
                </td>

                <td>{student.program}</td>

                <td>{student.yearSection}</td>

                <td>{student.placement}</td>

                <td>{student.status}</td>

                <td>{student.hours}</td>

                <td>
                  <Link
                    href={`/dashboard/students/${student.id}`}
                  >
                    Open →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="empty-directory">
            <strong>No students found.</strong>

            <p>
              Try a different name, student ID, program, or status.
            </p>
          </div>
        )}
      </div>
    </>
  );
}