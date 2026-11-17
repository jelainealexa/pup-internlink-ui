export default function SettingsPage() {
  return (
    <>
      <header className="content-header">
        <div className="page-eyebrow">
          11 / Settings
        </div>

        <h1>Settings</h1>

        <p>
          System configuration options will be added
          once additional coordinator requirements are
          finalized.
        </p>
      </header>

      <section className="settings-section">
        <span className="section-label">
          CURRENT ACCOUNT
        </span>

        <div className="settings-row">
          <div>
            <strong>Account Role</strong>

            <p>
              Current access level for this workspace.
            </p>
          </div>

          <span>Internship Coordinator</span>
        </div>

        <div className="settings-row">
          <div>
            <strong>Email Address</strong>

            <p>
              Email associated with the current
              coordinator account.
            </p>
          </div>

          <span>coordinator@pup.edu.ph</span>
        </div>
      </section>

      <section className="settings-placeholder">
        <span className="section-label">
          SYSTEM CONFIGURATION
        </span>

        <h2>No configurable settings yet.</h2>

        <p>
          This area is intentionally reserved because
          detailed Settings functionality is not yet
          defined in the approved system flow.
        </p>
      </section>
    </>
  );
}