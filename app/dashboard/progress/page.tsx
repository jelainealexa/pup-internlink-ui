"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
} from "react";
import {
  placements,
  progressReports,
} from "@/app/lib/mockData";

export default function ProgressPage() {
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("All");
  const [adviser, setAdviser] = useState("All");
  const [status, setStatus] = useState("All");

  const companies = [
    ...new Set(placements.map((item) => item.company)),
  ];

  const advisers = [
    ...new Set(placements.map((item) => item.adviser)),
  ];

  const filteredRecords = useMemo(() => {
    return placements.filter((placement) => {
      const query = search.toLowerCase();

      return (
        (placement.student
          .toLowerCase()
          .includes(query) ||
          placement.studentId
            .toLowerCase()
            .includes(query)) &&
        (company === "All" ||
          placement.company === company) &&
        (adviser === "All" ||
          placement.adviser === adviser) &&
        (status === "All" ||
          placement.status === status)
      );
    });
  }, [search, company, adviser, status]);

  const ongoing = placements.filter(
    (item) => item.status === "Ongoing"
  ).length;

  const reportingStudents = new Set(
    progressReports.map((report) => report.studentId)
  ).size;

  const pendingReviews = progressReports.filter(
    (report) =>
      report.reviewStatus === "Pending Review"
  ).length;

  const nearCompletion = placements.filter(
    (placement) => {
      const percentage =
        placement.renderedHours /
        placement.requiredHours;

      return (
        percentage >= 0.75 &&
        placement.status === "Ongoing"
      );
    }
  ).length;

  const completedHours = placements.filter(
    (placement) =>
      placement.renderedHours >=
      placement.requiredHours
  ).length;

  return (
    <>
      <header className="content-header">
        <div className="page-eyebrow">
          08 / Progress Monitoring
        </div>

        <h1>Progress monitoring</h1>

        <p>
          Track internship hours, progress reports, and
          completion status across active placements.
        </p>
      </header>

      <section className="progress-summary five-summary">
        <div>
          <span className="section-label">
            ONGOING PLACEMENTS
          </span>
          <strong>{ongoing}</strong>
          <p>active placements</p>
        </div>

        <div>
          <span className="section-label">
            CURRENTLY REPORTING
          </span>
          <strong>{reportingStudents}</strong>
          <p>students with submitted reports</p>
        </div>

        <div>
          <span className="section-label">
            PENDING REVIEWS
          </span>
          <strong>{pendingReviews}</strong>
          <p>reports waiting for review</p>
        </div>

        <div>
          <span className="section-label">
            NEAR COMPLETION
          </span>
          <strong>{nearCompletion}</strong>
          <p>students at 75% or above</p>
        </div>

        <div>
          <span className="section-label">
            COMPLETED REQUIRED HOURS
          </span>
          <strong>{completedHours}</strong>
          <p>students who reached required hours</p>
        </div>
      </section>

      <section className="progress-controls">
        <div>
          <label>SEARCH</label>

          <input
            type="search"
            placeholder="Student name or student number"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div>
          <label>COMPANY</label>

          <select
            value={company}
            onChange={(event) =>
              setCompany(event.target.value)
            }
          >
            <option>All</option>

            {companies.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label>FACULTY ADVISER</label>

          <select
            value={adviser}
            onChange={(event) =>
              setAdviser(event.target.value)
            }
          >
            <option>All</option>

            {advisers.map((item) => (
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
            <option>Ongoing</option>
            <option>Completed</option>
            <option>Terminated</option>
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
            {filteredRecords.map((record) => {
              const remaining = Math.max(
                record.requiredHours -
                  record.renderedHours,
                0
              );

              const completion = Math.round(
                (record.renderedHours /
                  record.requiredHours) *
                  100
              );

              return (
                <tr key={record.id}>
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