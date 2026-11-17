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
  const [company, setCompany] =
    useState("All");
  const [adviser, setAdviser] =
    useState("All");
  const [status, setStatus] =
    useState("All");

  const companies = [
    ...new Set(
      placements.map(
        (placement) =>
          placement.company
      )
    ),
  ];

  const advisers = [
    ...new Set(
      placements.map(
        (placement) =>
          placement.adviser
      )
    ),
  ];

  const filteredRecords = useMemo(() => {
    return placements.filter(
      (placement) => {
        const query =
          search.toLowerCase();

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
      }
    );
  }, [
    search,
    company,
    adviser,
    status,
  ]);

  const ongoing = placements.filter(
    (placement) =>
      placement.status === "Ongoing"
  ).length;

  const reportingStudents = new Set(
    progressReports.map(
      (report) => report.studentId
    )
  ).size;

  const pendingReports =
    progressReports.filter(
      (report) =>
        report.reviewStatus ===
        "Pending Review"
    );

  const nearCompletion =
    placements.filter((placement) => {
      const percentage =
        placement.renderedHours /
        placement.requiredHours;

      return (
        percentage >= 0.75 &&
        percentage < 1 &&
        placement.status === "Ongoing"
      );
    }).length;

  const completedHours =
    placements.filter(
      (placement) =>
        placement.renderedHours >=
        placement.requiredHours
    ).length;

  const firstPendingReport =
    pendingReports[0];

  return (
    <>
      <header className="content-header operations-page-header">
        <div>
          <div className="page-eyebrow">
            08 / PROGRESS MONITORING
          </div>

          <h1>Progress monitoring</h1>

          <p>
            Find delayed reports, review hours,
            and monitor completion.
          </p>
        </div>
      </header>

      {/* REVIEW ALERT */}

      <section className="progress-attention-v2">
        <div className="progress-attention-main">
          <span className="section-label">
            REVIEW QUEUE
          </span>

          <strong>
            {pendingReports.length}
          </strong>

          <h2>
            report
            {pendingReports.length !== 1
              ? "s"
              : ""}{" "}
            need review
          </h2>

          {firstPendingReport && (
            <Link
              href={`/dashboard/progress/${firstPendingReport.studentId}`}
              className="progress-review-action"
            >
              Review next report →
            </Link>
          )}
        </div>

        <div className="progress-snapshot-v2">
          <div>
            <span>Ongoing</span>
            <strong>{ongoing}</strong>
          </div>

          <div>
            <span>Reporting</span>
            <strong>
              {reportingStudents}
            </strong>
          </div>

          <div>
            <span>Near completion</span>
            <strong>
              {nearCompletion}
            </strong>
          </div>

          <div>
            <span>
              Completed hours
            </span>

            <strong>
              {completedHours}
            </strong>
          </div>
        </div>
      </section>

      {/* MONITORING TABLE */}

      <section className="operations-directory">
        <div className="directory-heading-v2">
          <div>
            <span className="section-label">
              STUDENT PROGRESS
            </span>

            <h2>
              {filteredRecords.length} student
              {filteredRecords.length !== 1
                ? "s"
                : ""}{" "}
              monitored
            </h2>
          </div>
        </div>

        <div className="operations-filter-bar progress-filter-bar-v2">
          <div className="filter-search-wide">
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
                <option key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>
              FACULTY ADVISER
            </label>

            <select
              value={adviser}
              onChange={(event) =>
                setAdviser(event.target.value)
              }
            >
              <option>All</option>

              {advisers.map((item) => (
                <option key={item}>
                  {item}
                </option>
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
        </div>

        <div className="progress-record-list">
          {filteredRecords.map(
            (record) => {
              const remaining = Math.max(
                record.requiredHours -
                  record.renderedHours,
                0
              );

              const completion =
                Math.round(
                  (record.renderedHours /
                    record.requiredHours) *
                    100
                );

              const studentPending =
                progressReports.filter(
                  (report) =>
                    report.studentId ===
                      record.studentId &&
                    report.reviewStatus ===
                      "Pending Review"
                ).length;

              return (
                <Link
                  href={`/dashboard/progress/${record.studentId}`}
                  className="progress-record-row"
                  key={record.id}
                >
                  <div className="progress-person">
                    <strong>
                      {record.student}
                    </strong>

                    <span>
                      {record.studentId}
                    </span>
                  </div>

                  <div className="progress-company">
                    <strong>
                      {record.company}
                    </strong>

                    <span>
                      {record.adviser}
                    </span>
                  </div>

                  <div className="progress-hours-v2">
                    <div className="progress-hours-heading">
                      <strong>
                        {record.renderedHours} /{" "}
                        {
                          record.requiredHours
                        }{" "}
                        hrs
                      </strong>

                      <span>
                        {completion}%
                      </span>
                    </div>

                    <div className="progress-row-track">
                      <div
                        style={{
                          width: `${Math.min(
                            completion,
                            100
                          )}%`,
                        }}
                      />
                    </div>

                    <span className="progress-remaining">
                      {remaining} hours remaining
                    </span>
                  </div>

                  <div className="progress-record-status">
                    {studentPending > 0 ? (
                      <span className="review-needed-badge">
                        {studentPending} review
                        {studentPending !== 1
                          ? "s"
                          : ""}
                      </span>
                    ) : (
                      <span
                        className={`record-status-pill status-${record.status.toLowerCase()}`}
                      >
                        {record.status}
                      </span>
                    )}

                    <span className="progress-open-arrow">
                      →
                    </span>
                  </div>
                </Link>
              );
            }
          )}
        </div>
      </section>
    </>
  );
}