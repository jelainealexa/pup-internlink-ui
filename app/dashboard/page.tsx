import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      {/* PAGE INTRO */}

      <header className="overview-header">
        <div className="page-eyebrow">
          OVERVIEW
        </div>

        <h1>
          Good afternoon, Coordinator.
        </h1>

        <p>
          18 items need your attention today.
        </p>
      </header>

      {/* NEEDS ATTENTION */}

      <section className="overview-section">
        <div className="overview-section-heading">
          <div>
            <span className="section-label">
              NEEDS ATTENTION
            </span>

            <h2>
              Start with these.
            </h2>
          </div>
        </div>

        <div className="attention-grid">
          <Link
            href="/dashboard/applications?status=pending"
            className="attention-card attention-primary"
          >
            <div className="attention-card-top">
              <span>Applications</span>
              <span>→</span>
            </div>

            <strong>12</strong>

            <p>Pending review</p>
          </Link>

          <Link
            href="/dashboard/requirements?status=pending"
            className="attention-card"
          >
            <div className="attention-card-top">
              <span>Requirements</span>
              <span>→</span>
            </div>

            <strong>04</strong>

            <p>Awaiting review</p>
          </Link>

          <Link
            href="/dashboard/evaluations?status=pending"
            className="attention-card"
          >
            <div className="attention-card-top">
              <span>Evaluations</span>
              <span>→</span>
            </div>

            <strong>02</strong>

            <p>Pending</p>
          </Link>
        </div>
      </section>

      {/* PROGRAM OVERVIEW */}

      <section className="overview-section">
        <div className="overview-section-heading">
          <div>
            <span className="section-label">
              PROGRAM
            </span>

            <h2>At a glance</h2>
          </div>
        </div>

        <div className="snapshot-grid">
          <Link
            href="/dashboard/students"
            className="snapshot-item"
          >
            <span>Students</span>
            <strong>124</strong>
          </Link>

          <Link
            href="/dashboard/partners"
            className="snapshot-item"
          >
            <span>Industry Partners</span>
            <strong>32</strong>
          </Link>

          <Link
            href="/dashboard/internships"
            className="snapshot-item"
          >
            <span>Opportunities</span>
            <strong>46</strong>
          </Link>

          <Link
            href="/dashboard/placements?status=ongoing"
            className="snapshot-item"
          >
            <span>Active Placements</span>
            <strong>87</strong>
          </Link>
        </div>
      </section>

      {/* PROGRESS + QUICK ACTIONS */}

      <section className="overview-split">
        <div className="overview-panel">
          <div className="panel-heading">
            <div>
              <span className="section-label">
                INTERNSHIP PROGRESS
              </span>

              <h2>87% placed</h2>
            </div>

            <Link
              href="/dashboard/progress"
              className="tertiary-link"
            >
              View progress →
            </Link>
          </div>

          <div className="overview-progress-bar">
            <div
              className="overview-progress-value"
              style={{ width: "87%" }}
            />
          </div>

          <div className="overview-progress-stats">
            <div>
              <strong>87</strong>
              <span>Ongoing</span>
            </div>

            <div>
              <strong>24</strong>
              <span>Completed</span>
            </div>

            <div>
              <strong>11</strong>
              <span>Near completion</span>
            </div>
          </div>
        </div>

        <div className="overview-panel">
          <div className="panel-heading">
            <div>
              <span className="section-label">
                QUICK ACTIONS
              </span>

              <h2>Create or review</h2>
            </div>
          </div>

          <div className="overview-actions">
            <Link
              href="/dashboard/students/create"
              className="overview-action-primary"
            >
              <span>Add Student</span>
              <span>＋</span>
            </Link>

            <Link href="/dashboard/partners/create">
              <span>Add Industry Partner</span>
              <span>→</span>
            </Link>

            <Link href="/dashboard/internships/create">
              <span>Create Opportunity</span>
              <span>→</span>
            </Link>

            <Link href="/dashboard/applications?status=pending">
              <span>Review Applications</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ACTIVITY */}

      <section className="overview-section overview-activity">
        <div className="overview-section-heading">
          <div>
            <span className="section-label">
              RECENT ACTIVITY
            </span>

            <h2>Latest updates</h2>
          </div>
        </div>

        <div className="activity-list-clean">
          <Link
            href="/dashboard/applications/app-001"
            className="activity-item"
          >
            <div className="activity-person">
              <strong>Joshua Tan</strong>
              <span>Submitted an application</span>
            </div>

            <div className="activity-meta">
              <small>10m</small>
              <span className="activity-arrow">→</span>
            </div>
          </Link>

          <Link
            href="/dashboard/applications/app-002"
            className="activity-item"
          >
            <div className="activity-person">
              <strong>Nicole Garcia</strong>
              <span>Application accepted</span>
            </div>

            <div className="activity-meta">
              <small>1h</small>
              <span className="activity-arrow">→</span>
            </div>
          </Link>

          <Link
            href="/dashboard/progress/2024-0003"
            className="activity-item"
          >
            <div className="activity-person">
              <strong>Sofia Cruz</strong>
              <span>Completed internship hours</span>
            </div>

            <div className="activity-meta">
              <small>3h</small>
              <span className="activity-arrow">→</span>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}