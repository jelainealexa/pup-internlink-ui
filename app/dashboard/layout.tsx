import Link from "next/link";
import ModuleNav from "../components/ModuleNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="workspace">
      <header className="workspace-header">
        <div className="masthead">
          <div>
            <Link href="/dashboard" className="brand-title">
              PUP INTERNLINK
            </Link>

            <p className="brand-subtitle">
              Internship Coordination Workspace
            </p>
          </div>

          <div className="workspace-meta">
            <div>
              <span>ACADEMIC YEAR</span>
              <strong>2026–2027</strong>
            </div>

            <div>
              <span>ROLE</span>
              <strong>Coordinator</strong>
            </div>

            <Link href="/" className="logout-link">
              Exit
            </Link>
          </div>
        </div>

        <ModuleNav />
      </header>

      <main className="workspace-content">
        {children}
      </main>
    </div>
  );
}