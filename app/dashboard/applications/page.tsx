"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { applications } from "@/app/lib/mockData";

export default function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [company, setCompany] = useState("All");
  const [opportunity, setOpportunity] =
    useState("All");
  const [sort, setSort] = useState("newest");
  const [studentFilter, setStudentFilter] =
    useState("");

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const incomingStatus = params.get("status");
    const incomingStudent = params.get("student");

    if (incomingStatus) {
      setStatus(
        incomingStatus.charAt(0).toUpperCase() +
          incomingStatus.slice(1)
      );
    }

    if (incomingStudent) {
      setStudentFilter(incomingStudent);
    }
  }, []);

  const companies = [
    ...new Set(
      applications.map(
        (application) => application.company
      )
    ),
  ];

  const opportunities = [
    ...new Set(
      applications.map(
        (application) =>
          application.opportunity
      )
    ),
  ];

  const filteredApplications = useMemo(() => {
    let result = applications.filter(
      (application) => {
        const query = search.toLowerCase();

        const matchesSearch =
          application.student
            .toLowerCase()
            .includes(query) ||
          application.studentId
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          status === "All" ||
          application.status === status;

        const matchesCompany =
          company === "All" ||
          application.company === company;

        const matchesOpportunity =
          opportunity === "All" ||
          application.opportunity ===
            opportunity;

        const matchesStudent =
          !studentFilter ||
          application.studentId ===
            studentFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCompany &&
          matchesOpportunity &&
          matchesStudent
        );
      }
    );

    result = [...result].sort((a, b) => {
      if (sort === "oldest") {
        return a.sortDate.localeCompare(
          b.sortDate
        );
      }

      return b.sortDate.localeCompare(
        a.sortDate
      );
    });

    return result;
  }, [
    search,
    status,
    company,
    opportunity,
    sort,
    studentFilter,
  ]);

  const pendingApplications =
    applications.filter(
      (item) => item.status === "Pending"
    );

  const acceptedCount = applications.filter(
    (item) => item.status === "Accepted"
  ).length;

  const rejectedCount = applications.filter(
    (item) => item.status === "Rejected"
  ).length;

  const firstPending =
    pendingApplications[0];

  return (
    <>
      <header className="content-header operations-page-header">
        <div>
          <div className="page-eyebrow">
            06 / APPLICATIONS
          </div>

          <h1>Applications</h1>

          <p>
            Review submissions and decide what
            moves forward.
          </p>
        </div>
      </header>

      {/* DECISION FOCUS */}

      <section className="application-focus">
        <div className="application-focus-main">
          <span className="section-label">
            NEEDS A DECISION
          </span>

          <div className="application-focus-count">
            {pendingApplications.length}
          </div>

          <h2>
            Pending application
            {pendingApplications.length !== 1
              ? "s"
              : ""}
          </h2>

          {firstPending && (
            <div className="next-application">
              <div>
                <span>Next to review</span>

                <strong>
                  {firstPending.student}
                </strong>

                <p>
                  {firstPending.opportunity} ·{" "}
                  {firstPending.company}
                </p>
              </div>

              <Link
                href={`/dashboard/applications/${firstPending.id}`}
                className="application-review-button"
              >
                Review →
              </Link>
            </div>
          )}
        </div>

        <div className="application-outcomes">
          <button
            type="button"
            className={
              status === "Accepted"
                ? "outcome-card outcome-card-active"
                : "outcome-card"
            }
            onClick={() =>
              setStatus(
                status === "Accepted"
                  ? "All"
                  : "Accepted"
              )
            }
          >
            <span>Accepted</span>
            <strong>{acceptedCount}</strong>
            <small>Ready for placement</small>
          </button>

          <button
            type="button"
            className={
              status === "Rejected"
                ? "outcome-card outcome-card-active"
                : "outcome-card"
            }
            onClick={() =>
              setStatus(
                status === "Rejected"
                  ? "All"
                  : "Rejected"
              )
            }
          >
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
            <small>Application history</small>
          </button>
        </div>
      </section>

      {/* DIRECTORY */}

      <section
        className="operations-directory"
        id="application-directory"
      >
        <div className="directory-heading-v2">
          <div>
            <span className="section-label">
              APPLICATION DIRECTORY
            </span>

            <h2>
              {filteredApplications.length} record
              {filteredApplications.length !== 1
                ? "s"
                : ""}
            </h2>
          </div>

          {status !== "All" && (
            <button
              className="clear-filter-action"
              onClick={() => setStatus("All")}
            >
              Clear status filter
            </button>
          )}
        </div>

        {studentFilter && (
          <div className="context-filter">
            Student:{" "}
            <strong>{studentFilter}</strong>

            <button
              onClick={() =>
                setStudentFilter("")
              }
            >
              Clear
            </button>
          </div>
        )}

        <div className="operations-filter-bar applications-filter-bar">
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
            <label>STATUS</label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option>All</option>
              <option>Pending</option>
              <option>Accepted</option>
              <option>Rejected</option>
            </select>
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
            <label>OPPORTUNITY</label>

            <select
              value={opportunity}
              onChange={(event) =>
                setOpportunity(
                  event.target.value
                )
              }
            >
              <option>All</option>

              {opportunities.map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>SORT DATE</label>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>
            </select>
          </div>
        </div>

        <div className="table-shell operations-table-shell">
          <table>
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Student</th>
                <th>Student Number</th>
                <th>Opportunity</th>
                <th>Company</th>
                <th>Application Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map(
                (application) => (
                  <tr key={application.id}>
                    <td>{application.id}</td>

                    <td>
                      <strong>
                        {application.student}
                      </strong>
                    </td>

                    <td>
                      {application.studentId}
                    </td>

                    <td>
                      {application.opportunity}
                    </td>

                    <td>
                      {application.company}
                    </td>

                    <td>
                      {application.submissionDate}
                    </td>

                    <td>
                      <span
                        className={`record-status-pill status-${application.status.toLowerCase()}`}
                      >
                        {application.status}
                      </span>
                    </td>

                    <td>
                      <Link
                        href={`/dashboard/applications/${application.id}`}
                        className="table-action"
                      >
                        Review →
                      </Link>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          {filteredApplications.length ===
            0 && (
            <div className="empty-directory">
              No applications match the
              selected filters.
            </div>
          )}
        </div>
      </section>
    </>
  );
}