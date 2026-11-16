import Link from "next/link";

export default function CreatePlacementPage() {
  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/placements">
          Placements
        </Link>

        <span>/</span>

        <span>Create Placement</span>
      </div>

      <header className="content-header">
        <div className="page-eyebrow">
          Placement Setup
        </div>

        <h1>Create placement</h1>

        <p>
          Complete the internship assignment after an application has
          been accepted.
        </p>
      </header>

      <section className="placement-form-section">
        <span className="section-label">
          01 / APPLICATION INFORMATION
        </span>

        <div className="form-grid">
          <div>
            <label>APPLICATION ID</label>
            <input value="app-002" readOnly />
          </div>

          <div>
            <label>STUDENT</label>
            <input value="Miguel Santos" readOnly />
          </div>

          <div>
            <label>OPPORTUNITY</label>
            <input value="IT Support Intern" readOnly />
          </div>

          <div>
            <label>COMPANY</label>
            <input value="IBM Philippines" readOnly />
          </div>
        </div>
      </section>

      <section className="placement-form-section">
        <span className="section-label">
          02 / PLACEMENT INFORMATION
        </span>

        <div className="form-grid">
          <div>
            <label>START DATE</label>
            <input type="date" />
          </div>

          <div>
            <label>END DATE</label>
            <input type="date" />
          </div>

          <div>
            <label>REQUIRED HOURS</label>
            <input
              type="number"
              placeholder="486"
            />
          </div>

          <div>
            <label>STATUS</label>
            <input value="Ongoing" readOnly />
          </div>
        </div>
      </section>

      <section className="placement-form-section">
        <span className="section-label">
          03 / SUPERVISOR ASSIGNMENT
        </span>

        <div className="form-grid">
          <div>
            <label>FACULTY ADVISER</label>

            <select>
              <option>Select faculty adviser</option>
              <option>Prof. Maria Santos</option>
              <option>Prof. Carlo Mendoza</option>
            </select>
          </div>

          <div>
            <label>COMPANY SUPERVISOR</label>

            <select>
              <option>Select company supervisor</option>
              <option>John Reyes</option>
              <option>Patricia Lim</option>
            </select>
          </div>
        </div>
      </section>

      <section className="decision-section">
        <span className="section-label">
          04 / REVIEW AND SAVE
        </span>

        <p>
          Review the placement information before saving the official
          internship assignment.
        </p>

        <div className="decision-actions">
          <Link
            href="/dashboard/applications/app-002"
            className="secondary-action link-button"
          >
            Cancel
          </Link>

          <button className="primary-action">
            Save Placement
          </button>
        </div>
      </section>
    </>
  );
}