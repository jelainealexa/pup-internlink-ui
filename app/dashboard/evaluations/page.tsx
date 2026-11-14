import Link from "next/link";

const evaluations = [
  {
    id: "eval-001",
    student: "Angela Reyes",
    company: "Accenture Philippines",
    hours: 320,
    status: "Incomplete",
  },
  {
    id: "eval-002",
    student: "Miguel Santos",
    company: "IBM Philippines",
    hours: 280,
    status: "Completed",
  },
  {
    id: "eval-003",
    student: "Sofia Cruz",
    company: "Globe Telecom",
    hours: 400,
    status: "Completed",
  },
];

export default function EvaluationsPage() {
  return (
    <>
      <header className="content-header">
        <div className="page-eyebrow">
          06 / Evaluation Records
        </div>

        <h1>Evaluations</h1>

        <p>
          Track internship performance, completed hours, and required
          evaluation submissions.
        </p>
      </header>

      <section className="workspace-grid">
        <div className="workspace-section">
          <span className="section-label">
            COMPLETED
          </span>

          <div className="progress-number">
            72%
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: "72%" }}
            />
          </div>
        </div>

        <div className="workspace-section">
          <span className="section-label">
            STILL PENDING
          </span>

          <div className="progress-number">
            18
          </div>

          <p className="progress-caption">
            evaluations require completion
          </p>
        </div>
      </section>

      <section className="page-index">
        <span className="section-label">
          EVALUATION RECORDS
        </span>

        {evaluations.map((evaluation, index) => (
          <Link
            href={`/dashboard/evaluations/${evaluation.id}`}
            className="index-row"
            key={evaluation.id}
          >
            <span className="index-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div>
              <span className="index-title">
                {evaluation.student}
              </span>

              <small className="row-subtext">
                {evaluation.company} · {evaluation.hours} hours
              </small>
            </div>

            <span>
              {evaluation.status} →
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}