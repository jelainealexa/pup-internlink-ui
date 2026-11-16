export default function SettingsPage() {
  return (
    <>
      <header className="content-header">
        <div className="page-eyebrow">
          System / Settings
        </div>

        <h1>Settings</h1>

        <p>
          Manage coordinator preferences and system configuration.
          Detailed settings will be finalized once the remaining system
          requirements are confirmed.
        </p>
      </header>

      <section className="settings-section">
        <span className="section-label">
          ACCOUNT
        </span>

        <div className="settings-row">
          <div>
            <strong>Coordinator Account</strong>
            <p>
              View the currently signed-in coordinator account.
            </p>
          </div>

          <span>Coordinator</span>
        </div>

        <div className="settings-row">
          <div>
            <strong>Email Address</strong>
            <p>
              Email associated with this account.
            </p>
          </div>

          <span>coordinator@pup.edu.ph</span>
        </div>
      </section>

      <section className="settings-section">
        <span className="section-label">
          SYSTEM PREFERENCES
        </span>

        <div className="settings-row">
          <div>
            <strong>Academic Year</strong>
            <p>
              Current academic year used throughout the internship
              workspace.
            </p>
          </div>

          <select defaultValue="2026-2027">
            <option value="2026-2027">2026–2027</option>
            <option value="2025-2026">2025–2026</option>
          </select>
        </div>

        <div className="settings-row">
          <div>
            <strong>Default Records View</strong>
            <p>
              Choose the default number of records displayed in directory
              pages.
            </p>
          </div>

          <select defaultValue="25">
            <option value="10">10 records</option>
            <option value="25">25 records</option>
            <option value="50">50 records</option>
          </select>
        </div>
      </section>

      <section className="settings-section">
        <span className="section-label">
          NOTIFICATIONS
        </span>

        <div className="settings-row">
          <div>
            <strong>Pending Requirements</strong>
            <p>
              Show reminders when student submissions still require review.
            </p>
          </div>

          <input type="checkbox" defaultChecked />
        </div>

        <div className="settings-row">
          <div>
            <strong>Pending Evaluations</strong>
            <p>
              Show reminders for incomplete internship evaluations.
            </p>
          </div>

          <input type="checkbox" defaultChecked />
        </div>

        <div className="settings-row">
          <div>
            <strong>Expiring Partnerships</strong>
            <p>
              Show reminders when an industry partner MOA is nearing
              expiration.
            </p>
          </div>

          <input type="checkbox" defaultChecked />
        </div>
      </section>

      <div className="settings-note">
        <span className="section-label">
          PROTOTYPE NOTE
        </span>

        <p>
          These settings are placeholders for the current UI/UX prototype.
          Final options should follow the approved functional requirements
          once system configuration rules are finalized.
        </p>
      </div>
    </>
  );
}