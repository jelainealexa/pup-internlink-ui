import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      <div className="page-eyebrow">
        Internship Program / Overview
      </div>

      <h1 className="page-title">
        What needs attention right now.
      </h1>

      <p className="page-description">
        A working overview of students, placements, applications,
        requirements, progress, and evaluations for the current term.
      </p>

      {/* PRIORITY / ATTENTION AREA */}

      <section className="overview-lead">
        <div className="semester-pulse">
          <span className="section-label">
            CURRENT INTERNSHIP PROGRAM
          </span>

          <strong className="pulse-number">
            124
          </strong>

          <p className="pulse-caption">
            registered students are currently included in the internship
            program.
          </p>
        </div>

        <div className="now-panel">
          <span className="section-label">
            NEEDS ATTENTION
          </span>

          <div className="attention-list">

            <Link
              href="/dashboard/applications?status=pending"
              className="attention-row"
            >
              <strong>12</strong>

              <span>
                Pending applications
              </span>

              <span>→</span>
            </Link>

            <Link
              href="/dashboard/requirements?status=pending"
              className="attention-row"
            >
              <strong>07</strong>

              <span>
                Requirements to review
              </span>

              <span>→</span>
            </Link>

            <Link
              href="/dashboard/evaluations?status=pending"
              className="attention-row"
            >
              <strong>18</strong>

              <span>
                Pending evaluations
              </span>

              <span>→</span>
            </Link>

            <Link
              href="/dashboard/partners?status=expiring"
              className="attention-row"
            >
              <strong>04</strong>

              <span>
                Partner agreements expiring soon
              </span>

              <span>→</span>
            </Link>

          </div>
        </div>
      </section>

      {/* PROGRAM SUMMARY */}

      <section className="dashboard-summary">

        <span className="section-label">
          PROGRAM SUMMARY
        </span>

        <div className="summary-grid">

          <Link
            href="/dashboard/students"
            className="summary-item"
          >
            <span>Students</span>

            <strong>124</strong>

            <small>
              View all registered students
            </small>
          </Link>

          <Link
            href="/dashboard/partners"
            className="summary-item"
          >
            <span>Industry Partners</span>

            <strong>32</strong>

            <small>
              View registered companies
            </small>
          </Link>

          <Link
            href="/dashboard/internships"
            className="summary-item"
          >
            <span>Opportunities</span>

            <strong>46</strong>

            <small>
              View available opportunities
            </small>
          </Link>

          <Link
            href="/dashboard/placements?status=ongoing"
            className="summary-item"
          >
            <span>Ongoing Placements</span>

            <strong>87</strong>

            <small>
              View active internship assignments
            </small>
          </Link>

        </div>
      </section>

      {/* PROGRESS + RECENT ACTIVITY */}

      <section className="workspace-grid">

        <div className="workspace-section">

          <span className="section-label">
            PLACEMENT PROGRESS
          </span>

          <div className="progress-number">
            87%
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: "87%" }}
            />
          </div>

          <p className="progress-caption">
            students currently placed in internship assignments
          </p>

          <Link
            href="/dashboard/progress"
            className="simple-action dashboard-action"
          >
            Open Progress Monitoring →
          </Link>

        </div>

        <div className="workspace-section">

          <span className="section-label">
            RECENT ACTIVITY
          </span>

          <ul className="movement-list">

            <li>
              <strong>Angela Reyes</strong>

              <span>
                Submitted internship application
              </span>

              <small>10m</small>
            </li>

            <li>
              <strong>Miguel Santos</strong>

              <span>
                Placement record created
              </span>

              <small>1h</small>
            </li>

            <li>
              <strong>Sofia Cruz</strong>

              <span>
                Evaluation submitted
              </span>

              <small>3h</small>
            </li>

          </ul>

        </div>

      </section>

      {/* QUICK ACCESS */}

      <section className="page-index">
        <span className="section-label">
          QUICK ACTIONS
        </span>

        <Link
          href="/dashboard/students/create"
          className="index-row"
        >
          <span className="index-number">01</span>

          <span className="index-title">
            Add Student
          </span>

          <span className="index-arrow">→</span>
        </Link>

        <Link
          href="/dashboard/partners/create"
          className="index-row"
        >
          <span className="index-number">02</span>

          <span className="index-title">
            Add Industry Partner
          </span>

          <span className="index-arrow">→</span>
        </Link>

        <Link
          href="/dashboard/internships/create"
          className="index-row"
        >
          <span className="index-number">03</span>

          <span className="index-title">
            Create Opportunity
          </span>

          <span className="index-arrow">→</span>
        </Link>

        <Link
          href="/dashboard/applications?status=pending"
          className="index-row"
        >
          <span className="index-number">04</span>

          <span className="index-title">
            Review Pending Applications
          </span>

          <span className="index-arrow">→</span>
        </Link>
      </section>
    </>
  );
}