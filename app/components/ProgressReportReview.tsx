"use client";

import { useState } from "react";
import type { ProgressReport } from "@/app/lib/mockData";

export default function ProgressReportReview({
  report,
}: {
  report: ProgressReport;
}) {
  const [open, setOpen] = useState(false);
  const [reviewed, setReviewed] = useState(
    report.reviewStatus === "Reviewed"
  );

  return (
    <>
      <button
        className="text-action"
        onClick={() => setOpen(true)}
      >
        Review →
      </button>

      {open && (
        <div className="prototype-overlay">
          <div className="prototype-dialog">
            <div className="dialog-header">
              <div>
                <span className="section-label">
                  PROGRESS REPORT
                </span>

                <h2>{report.id}</h2>
              </div>

              <button
                className="dialog-close"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>

            <dl className="record-list">
              <div>
                <dt>Submission Date</dt>
                <dd>{report.date}</dd>
              </div>

              <div>
                <dt>Hours Rendered</dt>
                <dd>{report.hours}</dd>
              </div>

              <div>
                <dt>Tasks Reported</dt>
                <dd>{report.task}</dd>
              </div>

              <div>
                <dt>Supervisor Remarks</dt>
                <dd>{report.remarks}</dd>
              </div>

              <div>
                <dt>Review Status</dt>
                <dd>
                  {reviewed
                    ? "Reviewed"
                    : "Pending Review"}
                </dd>
              </div>
            </dl>

            <div className="decision-actions">
              <button
                className="secondary-action"
                onClick={() => setOpen(false)}
              >
                Close
              </button>

              {!reviewed && (
                <button
                  className="primary-action"
                  onClick={() => setReviewed(true)}
                >
                  Mark as Reviewed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}