"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { students } from "@/app/lib/mockData";

export default function AddStudentPage() {
  const [studentId, setStudentId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [program, setProgram] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [section, setSection] = useState("");

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setSaved(false);

    if (
      !studentId ||
      !firstName ||
      !lastName ||
      !email ||
      !program ||
      !yearLevel ||
      !section
    ) {
      setError("Complete all required fields.");
      return;
    }

    const duplicateId = students.some(
      (student) => student.id === studentId
    );

    const duplicateEmail = students.some(
      (student) =>
        student.email.toLowerCase() === email.toLowerCase()
    );

    if (duplicateId) {
      setError("This student ID already exists.");
      return;
    }

    if (duplicateEmail) {
      setError("This email address already exists.");
      return;
    }

    setSaved(true);
  }

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/students">
          Students
        </Link>

        <span>/</span>

        <span>Add Student</span>
      </div>

      <header className="content-header">
        <div className="page-eyebrow">
          Student Registration
        </div>

        <h1>Add student</h1>

        <p>
          Create a student record for the internship
          coordination workspace.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <section className="placement-form-section">
          <span className="section-label">
            STUDENT INFORMATION
          </span>

          <div className="form-grid">
            <div>
              <label>STUDENT ID *</label>

              <input
                value={studentId}
                onChange={(event) =>
                  setStudentId(event.target.value)
                }
                placeholder="2024-0006"
              />
            </div>

            <div>
              <label>EMAIL *</label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="student@pup.edu.ph"
              />
            </div>

            <div>
              <label>FIRST NAME *</label>

              <input
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
              />
            </div>

            <div>
              <label>LAST NAME *</label>

              <input
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
              />
            </div>

            <div>
              <label>PROGRAM *</label>

              <select
                value={program}
                onChange={(event) =>
                  setProgram(event.target.value)
                }
              >
                <option value="">
                  Select program
                </option>
                <option>
                  BS Computer Engineering
                </option>
                <option>
                  BS Information Technology
                </option>
                <option>
                  BS Computer Science
                </option>
              </select>
            </div>

            <div>
              <label>YEAR LEVEL *</label>

              <select
                value={yearLevel}
                onChange={(event) =>
                  setYearLevel(event.target.value)
                }
              >
                <option value="">
                  Select year level
                </option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>

            <div>
              <label>SECTION *</label>

              <input
                value={section}
                onChange={(event) =>
                  setSection(event.target.value)
                }
                placeholder="4-1"
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="prototype-message error-message">
            {error}
          </div>
        )}

        {saved && (
          <div className="prototype-message success-message">
            <strong>Student record validated.</strong>

            <p>
              In the production system, this record would now
              be saved and the coordinator would be redirected
              to the newly created Student Profile.
            </p>
          </div>
        )}

        <div className="form-actions">
          <Link
            href="/dashboard/students"
            className="secondary-action link-button-reset"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="primary-action"
          >
            Save Student
          </button>
        </div>
      </form>
    </>
  );
}