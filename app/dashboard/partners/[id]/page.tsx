import Link from "next/link";
import { notFound } from "next/navigation";

const partnerData: Record<string, {
  name: string;
  industry: string;
  status: string;
  contact: string;
  email: string;
  slots: number;
  interns: number;
}> = {
  "accenture-philippines": {
    name: "Accenture Philippines",
    industry: "Technology",
    status: "Active",
    contact: "Maria Dela Cruz",
    email: "internships@accenture.example",
    slots: 12,
    interns: 8,
  },

  "ibm-philippines": {
    name: "IBM Philippines",
    industry: "Technology",
    status: "Active",
    contact: "Joshua Santos",
    email: "internships@ibm.example",
    slots: 8,
    interns: 6,
  },

  "globe-telecom": {
    name: "Globe Telecom",
    industry: "Telecommunications",
    status: "Active",
    contact: "Patricia Reyes",
    email: "internships@globe.example",
    slots: 10,
    interns: 7,
  },
};

export default async function PartnerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const partner = partnerData[id];

  if (!partner) {
    notFound();
  }

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/partners">
          Partners
        </Link>

        <span>/</span>

        <span>{partner.name}</span>
      </div>

      <header className="record-header">
        <div>
          <span className="section-label">
            INDUSTRY PARTNER
          </span>

          <h1>{partner.name}</h1>

          <p>
            {partner.industry}
          </p>
        </div>

        <div className="record-status">
          <span>PARTNERSHIP STATUS</span>
          <strong>{partner.status}</strong>
        </div>
      </header>

      <section className="record-summary">
        <div>
          <span>AVAILABLE SLOTS</span>
          <strong>{partner.slots}</strong>
        </div>

        <div>
          <span>CURRENT INTERNS</span>
          <strong>{partner.interns}</strong>
        </div>

        <div>
          <span>DOCUMENT STATUS</span>
          <strong>Complete</strong>
        </div>
      </section>

      <section className="detail-grid">
        <div className="detail-section">
          <span className="section-label">
            COMPANY INFORMATION
          </span>

          <dl className="record-list">
            <div>
              <dt>Industry</dt>
              <dd>{partner.industry}</dd>
            </div>

            <div>
              <dt>Contact Person</dt>
              <dd>{partner.contact}</dd>
            </div>

            <div>
              <dt>Email</dt>
              <dd>{partner.email}</dd>
            </div>

            <div>
              <dt>Partnership</dt>
              <dd>{partner.status}</dd>
            </div>
          </dl>
        </div>

        <div className="detail-section">
          <span className="section-label">
            RELATED RECORDS
          </span>

          {id === "accenture-philippines" ? (
            <>
              <Link
                href="/dashboard/internships/software-development-intern"
                className="related-row"
              >
                <div>
                  <small>OPPORTUNITY</small>
                  <strong>
                    Software Development Intern
                  </strong>
                </div>

                <span>→</span>
              </Link>

              <Link
                href="/dashboard/students/2024-0001"
                className="related-row"
              >
                <div>
                  <small>STUDENT</small>
                  <strong>Angela Reyes</strong>
                </div>

                <span>→</span>
              </Link>
            </>
          ) : (
            <div className="empty-message">
              Related internship and student records will appear here.
            </div>
          )}
        </div>
      </section>
    </>
  );
}