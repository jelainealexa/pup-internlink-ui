"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useApp } from "./AppProvider";
import { preferencesOf } from "../lib/rules";
import { SavedNotice } from "./ui";

export function Workspace({ children }: { children: ReactNode }) {
  const { account, db, loading, error, refresh, logout } = useApp();
  const pathname = usePathname(),
    router = useRouter(),
    query = useSearchParams();
  const [open, setOpen] = useState(true);
  const [logoutError, setLogoutError] = useState("");
  useEffect(() => {
    if (!loading && !error && !account)
      router.replace(
        `/?next=${encodeURIComponent(pathname + (query.size ? `?${query}` : ""))}`,
      );
  }, [loading, error, account, pathname, router, query]);
  if (loading)
    return (
      <main className="page">
        <p role="status">Loading browser-local demonstration records…</p>
      </main>
    );
  if (error)
    return (
      <main className="page">
        <h1>Data unavailable</h1>
        <p role="alert">{error}</p>
        <button onClick={() => void refresh()}>Retry loading</button>
        <Link href="/">Return to sign in and recovery</Link>
      </main>
    );
  if (!account || !db)
    return (
      <main className="page">
        <p role="status">Redirecting to demonstration sign in…</p>
      </main>
    );
  const prefs = preferencesOf(db, account.id);
  const modules =
    account.role === "Coordinator"
      ? [
          ["Overview", "/dashboard"],
          ["Students", "/dashboard/students"],
          ["Industry Partners", "/dashboard/partners"],
          ["Requirements", "/dashboard/requirements"],
          ["Opportunities", "/dashboard/internships"],
          ["Applications", "/dashboard/applications"],
          ["Placements", "/dashboard/placements"],
          ["Progress Monitoring", "/dashboard/progress"],
          ["Evaluations", "/dashboard/evaluations"],
          ["Reports & Analytics", "/dashboard/reports"],
          ["Settings", "/dashboard/settings"],
        ]
      : [
          ["My dashboard", "/dashboard"],
          ...(account.role === "Student"
            ? [
                [
                  "My profile",
                  `/dashboard/students/${db.students.find((s) => s.accountId === account.id)?.id}`,
                ],
                ["My requirements", "/dashboard/requirements?view=submissions"],
                ["Available opportunities", "/dashboard/internships"],
                ["My applications", "/dashboard/applications"],
              ]
            : []),
          ...(account.role === "Faculty Adviser"
            ? [
                ["Assigned students", "/dashboard/students"],
                [
                  "Requirement reviews",
                  "/dashboard/requirements?view=submissions",
                ],
              ]
            : []),
          ...(account.role === "Company Supervisor"
            ? [
                [
                  "My company",
                  `/dashboard/partners/${db.supervisors.find((s) => s.accountId === account.id)?.companyId}`,
                ],
              ]
            : []),
          ["Assigned placements", "/dashboard/placements"],
          ["Progress reports", "/dashboard/progress"],
          ["Evaluations", "/dashboard/evaluations"],
          ["Settings", "/dashboard/settings"],
        ];
  return (
    <div
      className={`workspace ${open ? "navigation-expanded" : "navigation-collapsed"}`}
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="workspace-header">
        <div className="masthead">
          <div>
            <Link className="brand-title" href="/dashboard">
              PUP INTERNLINK
            </Link>
            <p className="brand-subtitle">Internship Coordination Workspace</p>
          </div>
          <div className="session-info">
            <strong>{account.name}</strong>
            <span>
              {account.role} · {prefs.academicYear}
            </span>
            <button
              className="secondary-action"
              onClick={async () => {
                try {
                  await logout();
                  router.replace("/");
                } catch (error) {
                  setLogoutError(
                    error instanceof Error
                      ? error.message
                      : "Could not end the demonstration session.",
                  );
                }
              }}
            >
              Log out
            </button>
            {logoutError && <p role="alert">{logoutError}</p>}
          </div>
        </div>
        <div className="demo-banner">
          Demonstration mode · Synthetic data stored in this browser only ·
          Simulated access controls
        </div>
      </header>
      <div className="workspace-body">
        <aside
          className={`sidebar-shell ${open ? "sidebar-open" : "sidebar-collapsed"}`}
        >
          <div className="sidebar-top">
            <strong>{open ? account.role : "Menu"}</strong>
            <button
              type="button"
              className="sidebar-toggle"
              aria-label={open ? "Collapse navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls="module-navigation"
              onClick={() => setOpen(!open)}
            >
              {open ? "←" : "☰"}
            </button>
          </div>
          <nav
            className="sidebar-nav"
            id="module-navigation"
            aria-label="Workspace modules"
          >
            {modules.map(([label, href], index) => (
              <Link
                className={`sidebar-link ${pathname === href.split("?")[0] || (href !== "/dashboard" && pathname.startsWith(href.split("?")[0] + "/")) ? "sidebar-link-active" : ""}`}
                aria-current={
                  pathname === href.split("?")[0] ? "page" : undefined
                }
                aria-label={
                  open
                    ? undefined
                    : `${String(index + 1).padStart(2, "0")} ${label}`
                }
                href={href}
                key={label}
                title={label}
              >
                <span className="sidebar-short">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="sidebar-link-text">{label}</span>
              </Link>
            ))}
          </nav>
        </aside>
        <main className="workspace-content" id="main-content">
          <SavedNotice />
          {account.role !== "Coordinator" && (
            <p className="scope-note">
              Complementary demonstration portal · Your own or assigned records
              only
            </p>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
