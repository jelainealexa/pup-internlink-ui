import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      <div className="page-eyebrow">
        Internship Program / Overview
      </div>

      <h1 className="page-title">
        Where everyone stands, right now.
      </h1>

      <p className="page-description">
        A working overview of placements, applications, deadlines,
        and student internship progress for the current academic term.
      </p>

      <section className="overview-lead">
        <div className="semester-pulse">
          <span className="section-label">
            SEMESTER PULSE
          </span>

          <strong className="pulse-number">
            124
          </strong>

          <p className="pulse-caption">
            students are currently participating in the internship
            program.
          </p>
        </div>

        <div className="now-panel">
          <span className="section-label">
            NEEDS ATTENTION
          </span>

          <ul className="now-list">
            <li>
              <strong>18</strong>
              <span>evaluations still pending</span>
            </li>

            <li>
              <strong>09</strong>
              <span>students awaiting placement</span>
            </li>

            <li>
              <strong>05</strong>
              <span>partner documents nearing expiration</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="workspace-section">
          <span className="section-label">
            PLACEMENT PROGRESS
          </span>

          <div className="progress-number">
            87 / 100
          </div>

          <div className="progress-track">
            <div className="progress-fill" />
          </div>

          <p className="progress-caption">
            87% current placement rate
          </p>
        </div>

        <div className="workspace-section">
          <span className="section-label">
            RECENT MOVEMENT
          </span>

          <ul className="movement-list">
            <li>
              <strong>Angela Reyes</strong>
              <span>Application moved to Screening</span>
              <small>10m</small>
            </li>

            <li>
              <strong>Sofia Cruz</strong>
              <span>Placement accepted</span>
              <small>1h</small>
            </li>

            <li>
              <strong>Miguel Santos</strong>
              <span>Evaluation submitted</span>
              <small>3h</small>
            </li>
          </ul>
        </div>
      </section>

      <section className="page-index">
        <span className="section-label">
          WORKSPACE INDEX
        </span>

        <Link
          className="index-row"
          href="/dashboard/students"
        >
          <span className="index-number">02</span>
          <span className="index-title">
            Student Directory
          </span>
          <span className="index-arrow">→</span>
        </Link>

        <Link
          className="index-row"
          href="/dashboard/partners"
        >
          <span className="index-number">03</span>
          <span className="index-title">
            Industry Network
          </span>
          <span className="index-arrow">→</span>
        </Link>

        <Link
          className="index-row"
          href="/dashboard/internships"
        >
          <span className="index-number">04</span>
          <span className="index-title">
            Opportunities
          </span>
          <span className="index-arrow">→</span>
        </Link>

        <Link
          className="index-row"
          href="/dashboard/applications"
        >
          <span className="index-number">05</span>
          <span className="index-title">
            Application Flow
          </span>
          <span className="index-arrow">→</span>
        </Link>

        <Link
          className="index-row"
          href="/dashboard/evaluations"
        >
          <span className="index-number">06</span>
          <span className="index-title">
            Evaluation Records
          </span>
          <span className="index-arrow">→</span>
        </Link>
      </section>
    </>
  );
}