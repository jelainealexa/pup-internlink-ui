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
  const [company, setCompany] =
    useState("All");
  const [status, setStatus] =
    useState("All");
  const [adviser, setAdviser] =
    useState("All");

  const [sort, setSort] = useState(
    "start-newest"
  );

  const [studentFilter, setStudentFilter] =
    useState("");

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const incomingStatus =
      params.get("status");

    const incomingStudent =
      params.get("student");

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

  const filteredPlacements = useMemo(() => {
    let result = placements.filter(
      (placement) => {
        const query =
          search.toLowerCase();

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
            placement.studentId ===
              studentFilter)
        );
      }
    );

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

  const ongoing = placements.filter(
    (item) => item.status === "Ongoing"
  ).length;

  const completed = placements.filter(
    (item) => item.status === "Completed"
  ).length;

  const terminated = placements.filter(
    (item) => item.status === "Terminated"
  ).length;

  return (
    <>
      <header className="content-header operations-page-header">
        <div>
          <div className="page-eyebrow">
            07 / PLACEMENTS
          </div>

          <h1>Placements</h1>

          <p>
            Official internship assignments and
            supervision records.
          </p>
        </div>
      </header>

      {/* ASSIGNMENT OVERVIEW */}

      <section className="placement-overview-v2">
        <div className="placement-active-total">
          <span className="section-label">
            ACTIVE PLACEMENTS
          </span>

          <strong>{ongoing}</strong>

          <p>
            students currently assigned to an
            industry partner
          </p>
        </div>

        <div className="placement-status-list">
          <button
            onClick={() =>
              setStatus(
                status === "Ongoing"
                  ? "All"
                  : "Ongoing"
              )
            }
            className={
              status === "Ongoing"
                ? "placement-status-row placement-status-active"
                : "placement-status-row"
            }
          >
            <span>Ongoing</span>
            <strong>{ongoing}</strong>
          </button>

          <button
            onClick={() =>
              setStatus(
                status === "Completed"
                  ? "All"
                  : "Completed"
              )
            }
            className={
              status === "Completed"
                ? "placement-status-row placement-status-active"
                : "placement-status-row"
            }
          >
            <span>Completed</span>
            <strong>{completed}</strong>
          </button>

          <button
            onClick={() =>
              setStatus(
                status === "Terminated"
                  ? "All"
                  : "Terminated"
              )
            }
            className={
              status === "Terminated"
                ? "placement-status-row placement-status-active"
                : "placement-status-row"
            }
          >
            <span>Terminated</span>
            <strong>{terminated}</strong>
          </button>
        </div>
      </section>

      {/* DIRECTORY */}

      <section className="operations-directory">
        <div className="directory-heading-v2">
          <div>
            <span className="section-label">
              PLACEMENT DIRECTORY
            </span>

            <h2>
              {filteredPlacements.length} assignment
              {filteredPlacements.length !== 1
                ? "s"
                : ""}
            </h2>
          </div>
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

        <div className="operations-filter-bar placement-filter-bar-v2">
          <div className="filter-search-wide">
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
            <label>SORT</label>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
            >
              <option value="start-newest">
                Start: Newest
              </option>

              <option value="start-oldest">
                Start: Oldest
              </option>

              <option value="end-newest">
                End: Latest
              </option>

              <option value="end-oldest">
                End: Earliest
              </option>
            </select>
          </div>
        </div>

        <div className="table-shell operations-table-shell">
          <table className="placement-table-v2">
            <thead>
              <tr>
                <th>Placement</th>
                <th>Student</th>
                <th>Assignment</th>
                <th>Supervision</th>
                <th>Schedule</th>
                <th>Hours</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredPlacements.map(
                (placement) => {
                  const percent = Math.round(
                    (placement.renderedHours /
                      placement.requiredHours) *
                      100
                  );

                  return (
                    <tr key={placement.id}>
                      <td>
                        <strong>
                          {placement.id}
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {placement.student}
                        </strong>

                        <span className="cell-subtext">
                          {placement.studentId}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {placement.company}
                        </strong>

                        <span className="cell-subtext">
                          {placement.opportunity}
                        </span>
                      </td>

                      <td>
                        <span>
                          {placement.adviser}
                        </span>

                        <span className="cell-subtext">
                          {placement.supervisor}
                        </span>
                      </td>

                      <td>
                        <span>
                          {placement.startDate}
                        </span>

                        <span className="cell-subtext">
                          to {placement.endDate}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {placement.renderedHours}
                          {" / "}
                          {
                            placement.requiredHours
                          }
                        </strong>

                        <span className="cell-subtext">
                          {percent}% completed
                        </span>
                      </td>

                      <td>
                        <span
                          className={`record-status-pill status-${placement.status.toLowerCase()}`}
                        >
                          {placement.status}
                        </span>
                      </td>

                      <td>
                        <Link
                          href={`/dashboard/placements/${placement.id}`}
                          className="table-action"
                        >
                          Open →
                        </Link>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}