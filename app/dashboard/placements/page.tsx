"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { placements } from "@/app/lib/mockData";

export default function PlacementsPage() {
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("All");
  const [status, setStatus] = useState("All");
  const [adviser, setAdviser] = useState("All");
  const [sort, setSort] = useState("start-newest");
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
    ...new Set(placements.map((item) => item.company)),
  ];

  const advisers = [
    ...new Set(placements.map((item) => item.adviser)),
  ];

  const filteredPlacements = useMemo(() => {
    let result = placements.filter((placement) => {
      const query = search.toLowerCase();

      return (
        (placement.student
          .toLowerCase()
          .includes(query) ||
          placement.id
            .toLowerCase()
            .includes(query)) &&
        (company === "All" ||
          placement.company === company) &&
        (status === "All" ||
          placement.status === status) &&
        (adviser === "All" ||
          placement.adviser === adviser) &&
        (!studentFilter ||
          placement.studentId === studentFilter)
      );
    });

    result = [...result].sort((a, b) => {
      if (sort === "start-oldest") {
        return a.sortStartDate.localeCompare(
          b.sortStartDate
        );
      }

      if (sort === "end-newest") {
        return b.sortEndDate.localeCompare(
          a.sortEndDate
        );
      }

      if (sort === "end-oldest") {
        return a.sortEndDate.localeCompare(
          b.sortEndDate
        );
      }

      return b.sortStartDate.localeCompare(
        a.sortStartDate
      );
    });

    return result;
  }, [
    search,
    company,
    status,
    adviser,
    sort,
    studentFilter,
  ]);

  return (
    <>
      <header className="content-header">
        <div className="page-eyebrow">
          07 / Placements
        </div>

        <h1>Placements</h1>

        <p>
          Manage official internship assignments created
          from accepted applications.
        </p>
      </header>

      <section className="placement-summary">
        <div>
          <span className="section-label">
            ONGOING
          </span>

          <strong>
            {
              placements.filter(
                (item) => item.status === "Ongoing"
              ).length
            }
          </strong>

          <p>active internship placements</p>
        </div>

        <div>
          <span className="section-label">
            COMPLETED
          </span>

          <strong>
            {
              placements.filter(
                (item) => item.status === "Completed"
              ).length
            }
          </strong>

          <p>completed placements</p>
        </div>

        <div>
          <span className="section-label">
            TERMINATED
          </span>

          <strong>
            {
              placements.filter(
                (item) => item.status === "Terminated"
              ).length
            }
          </strong>

          <p>placements terminated early</p>
        </div>
      </section>

      {studentFilter && (
        <div className="active-filter-notice">
          Showing placement for student{" "}
          <strong>{studentFilter}</strong>

          <button
            onClick={() => setStudentFilter("")}
          >
            Clear
          </button>
        </div>
      )}

      <section className="placement-controls placement-controls-expanded">
        <div>
          <label>SEARCH</label>

          <input
            type="search"
            placeholder="Student name or placement ID"
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
          <label>SORT</label>

          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
          >
            <option value="start-newest">
              Start Date: Newest
            </option>
            <option value="start-oldest">
              Start Date: Oldest
            </option>
            <option value="end-newest">
              End Date: Latest
            </option>
            <option value="end-oldest">
              End Date: Earliest
            </option>
          </select>
        </div>
      </section>

      <div className="table-shell">
        <table className="wide-table">
          <thead>
            <tr>
              <th>Placement ID</th>
              <th>Student</th>
              <th>Company</th>
              <th>Opportunity</th>
              <th>Faculty Adviser</th>
              <th>Company Supervisor</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Required</th>
              <th>Rendered</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredPlacements.map((placement) => (
              <tr key={placement.id}>
                <td>{placement.id}</td>
                <td>{placement.student}</td>
                <td>{placement.company}</td>
                <td>{placement.opportunity}</td>
                <td>{placement.adviser}</td>
                <td>{placement.supervisor}</td>
                <td>{placement.startDate}</td>
                <td>{placement.endDate}</td>
                <td>{placement.requiredHours}</td>
                <td>{placement.renderedHours}</td>
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