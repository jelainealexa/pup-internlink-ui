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

    const urlStatus = params.get("status");
    const student = params.get("student");

    if (urlStatus) {
      const formatted =
        urlStatus.charAt(0).toUpperCase() +
        urlStatus.slice(1);

      setStatus(formatted);
    }

    if (student) {
      setStudentFilter(student);
    }
  }, []);

  const companies = [
    ...new Set(applications.map((item) => item.company)),
  ];

  const opportunities = [
    ...new Set(
      applications.map((item) => item.opportunity)
    ),
  ];

  const filteredApplications = useMemo(() => {
    let result = applications.filter((application) => {
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
        application.opportunity === opportunity;

      const matchesStudent =
        !studentFilter ||
        application.studentId === studentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCompany &&
        matchesOpportunity &&
        matchesStudent
      );
    });

    result = [...result].sort((a, b) => {
      if (sort === "oldest") {
        return a.sortDate.localeCompare(b.sortDate);
      }

      return b.sortDate.localeCompare(a.sortDate);
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

  const pending = applications.filter(
    (item) => item.status === "Pending"
  ).length;

  const accepted = applications.filter(
    (item) => item.status === "Accepted"
  ).length;

  const rejected = applications.filter(
    (item) => item.status === "Rejected"
  ).length;

  return (
    <>
      <header className="content-header">
        <div className="page-eyebrow">
          06 / Applications
        </div>

        <h1>Applications</h1>

        <p>
          Review student applications and manage their
          status before official placement.
        </p>
      </header>

      <section className="application-summary">
        <div>
          <span className="section-label">
            PENDING
          </span>
          <strong>{pending}</strong>
          <p>applications waiting for review</p>
        </div>

        <div>
          <span className="section-label">
            ACCEPTED
          </span>
          <strong>{accepted}</strong>
          <p>applications approved for placement</p>
        </div>

        <div>
          <span className="section-label">
            REJECTED
          </span>
          <strong>{rejected}</strong>
          <p>applications not approved</p>
        </div>
      </section>

      {studentFilter && (
        <div className="active-filter-notice">
          Showing applications for student{" "}
          <strong>{studentFilter}</strong>

          <button
            onClick={() => setStudentFilter("")}
          >
            Clear
          </button>
        </div>
      )}

      <section className="application-controls application-controls-expanded">
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
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label>OPPORTUNITY</label>

          <select
            value={opportunity}
            onChange={(event) =>
              setOpportunity(event.target.value)
            }
          >
            <option>All</option>

            {opportunities.map((item) => (
              <option key={item}>{item}</option>
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
      </section>

      <div className="directory-meta">
        <span>
          {filteredApplications.length} application
          {filteredApplications.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="table-shell">
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
                  <td>{application.studentId}</td>
                  <td>{application.opportunity}</td>
                  <td>{application.company}</td>
                  <td>
                    {application.submissionDate}
                  </td>
                  <td>{application.status}</td>

                  <td>
                    <Link
                      href={`/dashboard/applications/${application.id}`}
                    >
                      Open →
                    </Link>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {filteredApplications.length === 0 && (
          <div className="empty-directory">
            <strong>No applications found.</strong>
          </div>
        )}
      </div>
    </>
  );
}