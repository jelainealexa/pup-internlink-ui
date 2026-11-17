"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { applications } from "@/app/lib/mockData";

export default function CreatePlacementPage() {
  const [applicationId, setApplicationId] =
    useState("app-002");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [requiredHours, setRequiredHours] =
    useState("486");

  const [adviser, setAdviser] = useState("");
  const [supervisor, setSupervisor] =
    useState("");

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const incoming = params.get("application");

    if (incoming) {
      setApplicationId(incoming);
    }
  }, []);

  const application = applications.find(
    (record) => record.id === applicationId
  );

  if (!application) {
    return <h1>Application not found</h1>;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setSaved(false);

    if (!application || application.status !== "Accepted") {
      setError(
        "A placement can only be created from an accepted application."
      );
      return;
    }

    if (
      !startDate ||
      !endDate ||
      !requiredHours ||
      !adviser ||
      !supervisor
    ) {
      setError("Complete all required fields.");
      return;
    }

    if (endDate <= startDate) {
      setError(
        "End date must be later than the start date."
      );
      return;
    }

    setSaved(true);
  }

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/placements">
          Placements
        </Link>

        <span>/</span>

        <span>Create Placement</span>
      </div>

      <header className="content-header">
        <div className="page-eyebrow">
          Placement Setup
        </div>

        <h1>Create placement</h1>

        <p>
          Create the official internship assignment from
          an accepted application.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <section className="placement-form-section">
          <span className="section-label">
            01 / APPLICATION INFORMATION
          </span>

          <div className="form-grid">
            <div>
              <label>APPLICATION ID</label>
              <input
                value={application.id}
                readOnly
              />
            </div>

            <div>
              <label>STUDENT ID</label>
              <input
                value={application.studentId}
                readOnly
              />
            </div>

            <div>
              <label>STUDENT NAME</label>
              <input
                value={application.student}
                readOnly
              />
            </div>

            <div>
              <label>OPPORTUNITY</label>
              <input
                value={application.opportunity}
                readOnly
              />
            </div>

            <div>
              <label>COMPANY</label>
              <input
                value={application.company}
                readOnly
              />
            </div>
          </div>
        </section>

        <section className="placement-form-section">
          <span className="section-label">
            02 / PLACEMENT INFORMATION
          </span>

          <div className="form-grid">
            <div>
              <label>PLACEMENT ID</label>
              <input
                value="Auto-generated after save"
                readOnly
              />
            </div>

            <div>
              <label>STATUS</label>
              <input value="Ongoing" readOnly />
            </div>

            <div>
              <label>START DATE *</label>

              <input
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(event.target.value)
                }
              />
            </div>

            <div>
              <label>END DATE *</label>

              <input
                type="date"
                value={endDate}
                onChange={(event) =>
                  setEndDate(event.target.value)
                }
              />
            </div>

            <div>
              <label>REQUIRED HOURS *</label>

              <input
                type="number"
                value={requiredHours}
                onChange={(event) =>
                  setRequiredHours(event.target.value)
                }
              />
            </div>

            <div>
              <label>APPROVED BY</label>

              <input
                value="Current Internship Coordinator"
                readOnly
              />
            </div>
          </div>
        </section>

        <section className="placement-form-section">
          <span className="section-label">
            03 / SUPERVISOR ASSIGNMENT
          </span>

          <div className="form-grid">
            <div>
              <label>FACULTY ADVISER *</label>

              <select
                value={adviser}
                onChange={(event) =>
                  setAdviser(event.target.value)
                }
              >
                <option value="">
                  Select faculty adviser
                </option>

                <option>
                  Prof. Maria Santos
                </option>

                <option>
                  Prof. Carlo Mendoza
                </option>
              </select>
            </div>

            <div>
              <label>COMPANY SUPERVISOR *</label>

              <select
                value={supervisor}
                onChange={(event) =>
                  setSupervisor(event.target.value)
                }
              >
                <option value="">
                  Select company supervisor
                </option>

                <option>John Reyes</option>
                <option>Patricia Lim</option>
              </select>
            </div>
          </div>
        </section>

        <section className="placement-form-section">
          <span className="section-label">
            04 / REVIEW AND SAVE
          </span>

          <div className="review-summary">
            <div>
              <span>Student</span>
              <strong>{application.student}</strong>
            </div>

            <div>
              <span>Student ID</span>
              <strong>
                {application.studentId}
              </strong>
            </div>

            <div>
              <span>Company</span>
              <strong>{application.company}</strong>
            </div>

            <div>
              <span>Opportunity</span>
              <strong>
                {application.opportunity}
              </strong>
            </div>

            <div>
              <span>Start Date</span>
              <strong>
                {startDate || "Not selected"}
              </strong>
            </div>

            <div>
              <span>End Date</span>
              <strong>
                {endDate || "Not selected"}
              </strong>
            </div>

            <div>
              <span>Required Hours</span>
              <strong>{requiredHours}</strong>
            </div>

            <div>
              <span>Faculty Adviser</span>
              <strong>
                {adviser || "Not selected"}
              </strong>
            </div>

            <div>
              <span>Company Supervisor</span>
              <strong>
                {supervisor || "Not selected"}
              </strong>
            </div>
          </div>

          {error && (
            <div className="prototype-message error-message">
              {error}
            </div>
          )}

          {saved && (
            <div className="prototype-message success-message">
              Placement validated successfully. In the
              production system, the placement would now be
              saved, assigned a Placement ID, and opened in
              Placement Details.
            </div>
          )}

          <div className="form-actions">
            <Link
              href={`/dashboard/applications/${application.id}`}
              className="secondary-action link-button-reset"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="primary-action"
            >
              Save Placement
            </button>
          </div>
        </section>
      </form>
    </>
  );
}