import Link from "next/link";

const opportunities = [
  {
    id: "software-development-intern",
    role: "Software Development Intern",
    company: "Accenture Philippines",
    setup: "Hybrid",
    slots: 4,
  },
  {
    id: "data-analytics-intern",
    role: "Data Analytics Intern",
    company: "Globe Telecom",
    setup: "Hybrid",
    slots: 3,
  },
  {
    id: "it-support-intern",
    role: "IT Support Intern",
    company: "IBM Philippines",
    setup: "On-site",
    slots: 2,
  },
];

export default function InternshipsPage() {
  return (
    <>
      <header className="content-header">
        <div className="page-eyebrow">
          04 / Opportunities
        </div>

        <h1>Open opportunities</h1>

        <p>
          Internship positions currently available from participating
          industry partners.
        </p>
      </header>

      <section className="page-index">
        <span className="section-label">
          CURRENTLY OPEN
        </span>

        {opportunities.map((item, index) => (
          <Link
            href={`/dashboard/internships/${item.id}`}
            className="index-row"
            key={item.id}
          >
            <span className="index-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div>
              <span className="index-title">
                {item.role}
              </span>

              <small className="row-subtext">
                {item.company}
              </small>
            </div>

            <span>
              {item.setup} · {item.slots} slots →
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}