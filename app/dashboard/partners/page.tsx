import Link from "next/link";

const partners = [
  {
    id: "accenture-philippines",
    name: "Accenture Philippines",
    industry: "Technology",
    interns: 8,
    slots: 12,
    status: "Active",
  },
  {
    id: "ibm-philippines",
    name: "IBM Philippines",
    industry: "Technology",
    interns: 6,
    slots: 8,
    status: "Active",
  },
  {
    id: "globe-telecom",
    name: "Globe Telecom",
    industry: "Telecommunications",
    interns: 7,
    slots: 10,
    status: "Active",
  },
];

export default function PartnersPage() {
  return (
    <>
      <header className="content-header">
        <div className="page-eyebrow">
          03 / Industry Network
        </div>

        <h1>Partners</h1>

        <p>
          A working directory of companies participating in the
          university internship program.
        </p>
      </header>

      <section className="overview-lead">
        <div className="semester-pulse">
          <span className="section-label">
            ACTIVE NETWORK
          </span>

          <strong className="pulse-number">32</strong>

          <p className="pulse-caption">
            industry partners are currently connected to the internship
            program.
          </p>
        </div>

        <div className="now-panel">
          <span className="section-label">
            NEEDS ATTENTION
          </span>

          <ul className="now-list">
            <li>
              <strong>04</strong>
              <span>partnerships pending renewal</span>
            </li>

            <li>
              <strong>05</strong>
              <span>documents requiring review</span>
            </li>

            <li>
              <strong>46</strong>
              <span>available internship slots</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="page-index">
        <span className="section-label">
          COMPANY DIRECTORY
        </span>

        {partners.map((partner, index) => (
          <Link
            href={`/dashboard/partners/${partner.id}`}
            className="index-row"
            key={partner.id}
          >
            <span className="index-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div>
              <span className="index-title">
                {partner.name}
              </span>

              <small className="row-subtext">
                {partner.industry} · {partner.status}
              </small>
            </div>

            <span>
              {partner.interns} interns / {partner.slots} slots →
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}