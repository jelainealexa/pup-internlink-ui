import Link from "next/link";

const applications = [
  {
    id: "app-001",
    student: "Angela Reyes",
    company: "Accenture Philippines",
    role: "Software Development Intern",
    stage: "Screening",
  },
  {
    id: "app-002",
    student: "Miguel Santos",
    company: "IBM Philippines",
    role: "IT Support Intern",
    stage: "Interview",
  },
  {
    id: "app-003",
    student: "Sofia Cruz",
    company: "Globe Telecom",
    role: "Data Analytics Intern",
    stage: "Accepted",
  },
];

const stages = [
  {
    label: "Applied",
    count: 14,
  },
  {
    label: "Screening",
    count: 8,
  },
  {
    label: "Interview",
    count: 5,
  },
  {
    label: "Accepted",
    count: 21,
  },
];

export default function ApplicationsPage() {
  return (
    <>
      <header className="content-header">
        <div className="page-eyebrow">
          05 / Application Flow
        </div>

        <h1>Applications</h1>

        <p>
          Follow student applications from initial submission to
          confirmed internship placement.
        </p>
      </header>

      <section className="application-flow">
        {stages.map((stage, index) => (
          <div className="flow-stage" key={stage.label}>
            <span className="section-label">
              0{index + 1}
            </span>

            <strong className="flow-count">
              {stage.count}
            </strong>

            <h2>{stage.label}</h2>
          </div>
        ))}
      </section>

      <section className="page-index">
        <span className="section-label">
          APPLICATION RECORDS
        </span>

        {applications.map((application, index) => (
          <Link
            href={`/dashboard/applications/${application.id}`}
            className="index-row"
            key={application.id}
          >
            <span className="index-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div>
              <span className="index-title">
                {application.student}
              </span>

              <small className="row-subtext">
                {application.company} · {application.role}
              </small>
            </div>

            <span>
              {application.stage} →
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}