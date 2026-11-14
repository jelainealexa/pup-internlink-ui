import Link from "next/link";
import { notFound } from "next/navigation";

const internshipData: Record<string, {
  role: string;
  company: string;
  partnerId: string;
  setup: string;
  slots: number;
  applications: number;
  accepted: number;
  deadline: string;
  programs: string[];
}> = {
  "software-development-intern": {
    role: "Software Development Intern",
    company: "Accenture Philippines",
    partnerId: "accenture-philippines",
    setup: "Hybrid",
    slots: 4,
    applications: 14,
    accepted: 3,
    deadline: "November 30, 2026",
    programs: [
      "BS Computer Engineering",
      "BS Information Technology",
      "BS Computer Science",
    ],
  },

  "data-analytics-intern": {
    role: "Data Analytics Intern",
    company: "Globe Telecom",
    partnerId: "globe-telecom",
    setup: "Hybrid",
    slots: 3,
    applications: 9,
    accepted: 1,
    deadline: "December 5, 2026",
    programs: [
      "BS Information Technology",
      "BS Computer Science",
    ],
  },

  "it-support-intern": {
    role: "IT Support Intern",
    company: "IBM Philippines",
    partnerId: "ibm-philippines",
    setup: "On-site",
    slots: 2,
    applications: 7,
    accepted: 1,
    deadline: "December 3, 2026",
    programs: [
      "BS Information Technology",
      "BS Computer Engineering",
    ],
  },
};

export default async function InternshipDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const internship = internshipData[id];

  if (!internship) {
    notFound();
  }

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/internships">
          Opportunities
        </Link>

        <span>/</span>

        <span>{internship.role}</span>
      </div>

      <header className="record-header">
        <div>
          <span className="section-label">
            INTERNSHIP OPPORTUNITY
          </span>

          <h1>{internship.role}</h1>

          <p>
            <Link
              href={`/dashboard/partners/${internship.partnerId}`}
            >
              {internship.company} →
            </Link>
          </p>
        </div>

        <div className="record-status">
          <span>POSTING STATUS</span>
          <strong>Open</strong>
        </div>
      </header>

      <section className="record-summary">
        <div>
          <span>AVAILABLE SLOTS</span>
          <strong>
            {internship.accepted} / {internship.slots}
          </strong>
        </div>

        <div>
          <span>APPLICATIONS</span>
          <strong>{internship.applications}</strong>
        </div>

        <div>
          <span>WORK SETUP</span>
          <strong>{internship.setup}</strong>
        </div>

        <div>
          <span>DEADLINE</span>
          <strong>{internship.deadline}</strong>
        </div>
      </section>

      <section className="detail-grid">
        <div className="detail-section">
          <span className="section-label">
            ELIGIBILITY
          </span>

          <div className="simple-list">
            {internship.programs.map((program) => (
              <div key={program}>
                {program}
              </div>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <span className="section-label">
            APPLICANTS
          </span>

          {id === "software-development-intern" ? (
            <>
              <Link
                href="/dashboard/applications/app-001"
                className="related-row"
              >
                <div>
                  <small>SCREENING</small>
                  <strong>Angela Reyes</strong>
                </div>

                <span>→</span>
              </Link>

              <div className="related-row">
                <div>
                  <small>APPLIED</small>
                  <strong>Joshua Tan</strong>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-message">
              Applicant records will appear here.
            </div>
          )}
        </div>
      </section>
    </>
  );
}