"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { students } from "@/app/lib/mockData";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState("All");
  const [yearLevel, setYearLevel] = useState("All");
  const [section, setSection] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("name");

  const programs = [...new Set(students.map((s) => s.program))];
  const yearLevels = [
    ...new Set(students.map((s) => s.yearLevel)),
  ];
  const sections = [...new Set(students.map((s) => s.section))];

  const filteredStudents = useMemo(() => {
    let result = students.filter((student) => {
      const query = search.toLowerCase();

      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query);

      const matchesProgram =
        program === "All" || student.program === program;

      const matchesYear =
        yearLevel === "All" ||
        student.yearLevel === yearLevel;

      const matchesSection =
        section === "All" || student.section === section;

      const matchesStatus =
        status === "All" || student.status === status;

      return (
        matchesSearch &&
        matchesProgram &&
        matchesYear &&
        matchesSection &&
        matchesStatus
      );
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
  }, [
    search,
    program,
    yearLevel,
    section,
    status,
    sort,
  ]);

  return (
    <>
      <header className="content-header students-header">
        <div>
          <div className="page-eyebrow">
            02 / Student Directory
          </div>

          <h1>Students</h1>

          <p>
            Find student records, check internship status,
            and open each student&apos;s complete record.
          </p>
        </div>

        <Link
          href="/dashboard/students/create"
          className="primary-action link-button-reset"
        >
          + Add Student
        </Link>
      </header>

      <section className="student-controls expanded-controls">
        <div>
          <label>SEARCH</label>

          <input
            type="search"
            placeholder="Student name or student ID"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div>
          <label>PROGRAM</label>

          <select
            value={program}
            onChange={(event) =>
              setProgram(event.target.value)
            }
          >
            <option>All</option>

            {programs.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label>YEAR LEVEL</label>

          <select
            value={yearLevel}
            onChange={(event) =>
              setYearLevel(event.target.value)
            }
          >
            <option>All</option>

            {yearLevels.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label>SECTION</label>

          <select
            value={section}
            onChange={(event) =>
              setSection(event.target.value)
            }
          >
            <option>All</option>

            {sections.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label>STATUS</label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option>All</option>
            <option>Applying</option>
            <option>Awaiting Placement</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>
        </div>

        <div>
          <label>SORT BY</label>

          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
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

        <span>Academic Year 2026-2027</span>
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

                <td>
                  {student.yearLevel} / {student.section}
                </td>

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
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>
    </>
  );
}