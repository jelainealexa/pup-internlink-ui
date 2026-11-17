"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  applicationId: string;
  initialStatus: "Pending" | "Accepted" | "Rejected";
  existingReason?: string;
};

export default function ApplicationDecision({
  applicationId,
  initialStatus,
  existingReason,
}: Props) {
  const [status, setStatus] =
    useState(initialStatus);

  const [showReject, setShowReject] =
    useState(false);

  const [reason, setReason] = useState(
    existingReason || ""
  );

  if (status === "Accepted") {
    return (
      <section className="decision-section">
        <span className="section-label">
          AVAILABLE ACTIONS
        </span>

        <p>
          This application has been accepted and is
          ready for official internship placement.
        </p>

        <Link
          href={`/dashboard/placements/create?application=${applicationId}`}
          className="primary-action link-button-reset"
        >
          Create Placement →
        </Link>
      </section>
    );
  }

  if (status === "Rejected") {
    return (
      <section className="decision-section">
        <span className="section-label">
          APPLICATION DECISION
        </span>

        <p>This application has been rejected.</p>

        <div className="rejection-note">
          <span>REJECTION REASON</span>

          <p>
            {reason ||
              "No rejection reason recorded."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="decision-section">
      <span className="section-label">
        AVAILABLE ACTIONS
      </span>

      <p>
        Review the student, mandatory requirements,
        opportunity, and available slots before making
        a decision.
      </p>

      {!showReject ? (
        <div className="decision-actions">
          <button
            type="button"
            className="secondary-action"
            onClick={() => setShowReject(true)}
          >
            Reject Application
          </button>

          <button
            type="button"
            className="primary-action"
            onClick={() => setStatus("Accepted")}
          >
            Accept Application
          </button>
        </div>
      ) : (
        <div className="reject-panel">
          <span className="section-label">
            CONFIRM REJECTION
          </span>

          <p>
            Provide a reason before confirming the
            rejection.
          </p>

          <textarea
            value={reason}
            onChange={(event) =>
              setReason(event.target.value)
            }
            placeholder="Enter rejection reason..."
          />

          <div className="decision-actions">
            <button
              type="button"
              className="secondary-action"
              onClick={() => {
                setShowReject(false);
                setReason("");
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              className="primary-action"
              disabled={!reason.trim()}
              onClick={() => setStatus("Rejected")}
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      )}
    </section>
  );
}