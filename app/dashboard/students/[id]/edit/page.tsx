"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { students } from "@/app/lib/mockData";

export default function EditStudentPage() {
  const params = useParams<{ id: string }>();

  const student = students.find(
    (record) => record.id === params.id
  );

  const [saved, setSaved] = useState(false);

  if (!student) {
    return <h1>Student not found</h1>;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <>
      <div className="breadcrumb">
        <Link
          href={`/dashboard/students/${student.id}`}
        >
          {student.name}
        </Link>

        <span>/</span>

        <span>Edit</span>
      </div>

      <header className="content-header">
        <div className="page-eyebrow">
          Student Record
        </div>

        <h1>Edit student</h1>

        <p>
          Update the student&apos;s basic academic and
          contact information.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <section className="placement-form-section">
          <span className="section-label">
            STUDENT INFORMATION
          </span>

          <div className="form-grid">
            <div>
              <label>STUDENT ID</label>
              <input value={student.id} readOnly />
            </div>

            <div>
              <label>EMAIL</label>
              <input
                type="email"
                defaultValue={student.email}
              />
            </div>

            <div>
              <label>FIRST NAME</label>
              <input defaultValue={student.firstName} />
            </div>

            <div>
              <label>LAST NAME</label>
              <input defaultValue={student.lastName} />
            </div>

            <div>
              <label>PROGRAM</label>

              <select defaultValue={student.program}>
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
              <label>YEAR LEVEL</label>

              <select defaultValue={student.yearLevel}>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>

            <div>
              <label>SECTION</label>
              <input defaultValue={student.section} />
            </div>
          </div>
        </section>

        {saved && (
          <div className="prototype-message success-message">
            Prototype update successful. No database
            changes are being stored yet.
          </div>
        )}

        <div className="form-actions">
          <Link
            href={`/dashboard/students/${student.id}`}
            className="secondary-action link-button-reset"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="primary-action"
          >
            Save Changes
          </button>
        </div>
      </form>
    </>
  );
}