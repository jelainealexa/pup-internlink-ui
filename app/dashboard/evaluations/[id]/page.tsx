import Link from "next/link";
import { notFound } from "next/navigation";

const evaluationData: Record<string, {
  student: string;
  studentId: string;
  company: string;
  hours: number;
  status: string;
  companyEvaluation: string;
  studentEvaluation: string;
  facultyEvaluation: string;
}> = {
  "eval-001": {
    student: "Angela Reyes",
    studentId: "2024-0001",
    company: "Accenture Philippines",
    hours: 320,
    status: "Incomplete",
    companyEvaluation: "Submitted",
    studentEvaluation: "Submitted",
    facultyEvaluation: "Pending",
  },

  "eval-002": {
    student: "Miguel Santos",
    studentId: "2024-0002",
    company: "IBM Philippines",
    hours: 280,
    status: "Completed",
    companyEvaluation: "Submitted",
    studentEvaluation: "Submitted",
    facultyEvaluation: "Submitted",
  },

  "eval-003": {
    student: "Sofia Cruz",
    studentId: "2024-0003",
    company: "Globe Telecom",
    hours: 400,
    status: "Completed",
    companyEvaluation: "Submitted",
    studentEvaluation: "Submitted",
    facultyEvaluation: "Submitted",
  },
};

export default async function EvaluationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const evaluation = evaluationData[id];

  if (!evaluation) {
    notFound();
  }

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/evaluations">
          Evaluations
        </Link>

        <span>/</span>

        <span>{evaluation.student}</span>
      </div>

      <header className="record-header">
        <div>
          <span className="section-label">
            EVALUATION RECORD
          </span>

          <h1>{evaluation.student}</h1>

          <p>
            {evaluation.company}
          </p>
        </div>

        <div className="record-status">
          <span>OVERALL STATUS</span>
          <strong>{evaluation.status}</strong>
        </div>
      </header>

      <section className="record-summary">
        <div>
          <span>RENDERED HOURS</span>
          <strong>{evaluation.hours}</strong>
        </div>

        <div>
          <span>COMPANY</span>
          <strong>{evaluation.company}</strong>
        </div>

        <div>
          <span>STATUS</span>
          <strong>{evaluation.status}</strong>
        </div>
      </section>

      <section className="evaluation-checklist">
        <span className="section-label">
          REQUIRED EVALUATIONS
        </span>

        <div className="evaluation-item">
          <div>
            <strong>Company Evaluation</strong>
            <p>
              Evaluation submitted by the industry supervisor.
            </p>
          </div>

          <span>{evaluation.companyEvaluation}</span>
        </div>

        <div className="evaluation-item">
          <div>
            <strong>Student Self-Evaluation</strong>
            <p>
              Student reflection and internship experience.
            </p>
          </div>

          <span>{evaluation.studentEvaluation}</span>
        </div>

        <div className="evaluation-item">
          <div>
            <strong>Faculty Evaluation</strong>
            <p>
              Final assessment from the assigned faculty adviser.
            </p>
          </div>

          <span>{evaluation.facultyEvaluation}</span>
        </div>
      </section>

      <section className="action-section">
        <span className="section-label">
          RELATED RECORD
        </span>

        <div className="action-links">
          <Link
            href={`/dashboard/students/${evaluation.studentId}`}
            className="action-link"
          >
            <small>STUDENT RECORD</small>

            <strong>
              View {evaluation.student}
            </strong>

            <span>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}