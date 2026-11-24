"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, ReactNode, useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Briefcase,
  Building2,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  FileCheck2,
  FileText,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  LogOut,
  MapPinned,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
  UserCog,
  UserRound,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "./AppProvider";
import { preferencesOf, roleLabel } from "../lib/rules";
import {
  ModuleLabelContext,
  SavedNotice,
  initials,
  moduleLabelFor,
} from "./ui";

type NavItem = { label: string; href: string; icon: LucideIcon };

const DESKTOP = "(min-width: 901px)";

/** One icon family (Lucide outline), chosen by destination rather than label. */
function iconFor(label: string, href: string, index: number): LucideIcon {
  if (index === 0) return LayoutDashboard;
  if (/#supervisors/.test(href)) return UsersRound;
  if (/\/supervisors\//.test(href)) return UserRound;
  if (/interns=true/.test(href)) return Users;
  if (/^Assigned students$/.test(label)) return Users;
  const segment = href.split("?")[0].split("#")[0].split("/")[2];
  switch (segment) {
    case "students":
      return GraduationCap;
    case "partners":
      return Building2;
    case "faculty":
      return UserCog;
    case "requirements":
      return FileCheck2;
    case "internships":
      return Briefcase;
    case "applications":
      return FileText;
    case "placements":
      return MapPinned;
    case "progress":
      return Activity;
    case "attendance":
      return CalendarCheck;
    case "evaluations":
      return ClipboardList;
    case "reports":
      return BarChart3;
    case "settings":
      return Settings;
    default:
      return LayoutDashboard;
  }
}

export function Workspace({ children }: { children: ReactNode }) {
  const { account, db, loading, error, refresh, logout } = useApp();
  const pathname = usePathname(),
    router = useRouter(),
    query = useSearchParams();
  const [open, setOpen] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia(DESKTOP).matches,
  );
  const [logoutError, setLogoutError] = useState("");
  useEffect(() => {
    if (!loading && !error && !account)
      router.replace(
        `/?next=${encodeURIComponent(pathname + (query.size ? `?${query}` : ""))}`,
      );
  }, [loading, error, account, pathname, router, query]);
  // On small screens the navigation is a drawer: close it after navigating
  // and when Escape is pressed.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (typeof window !== "undefined" && !window.matchMedia(DESKTOP).matches)
      setOpen(false);
  }
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !window.matchMedia(DESKTOP).matches)
        setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  if (loading)
    return (
      <main className="page state-page">
        <p role="status">
          <Loader2 className="spin" size={18} aria-hidden="true" /> Loading
          browser-local demonstration records…
        </p>
      </main>
    );
  if (error)
    return (
      <main className="page state-page">
        <section className="state-card">
          <h1>Data unavailable</h1>
          <p role="alert" className="error-message prototype-message">
            {error}
          </p>
          <div className="action-bar">
            <button className="primary-action" onClick={() => void refresh()}>
              Retry loading
            </button>
            <Link className="secondary-action" href="/">
              Return to sign in and recovery
            </Link>
          </div>
        </section>
      </main>
    );
  if (!account || !db)
    return (
      <main className="page state-page">
        <p role="status">
          <Loader2 className="spin" size={18} aria-hidden="true" /> Redirecting
          to demonstration sign in…
        </p>
      </main>
    );
  const prefs = preferencesOf(db, account.id);
  const studentId = db.students.find((s) => s.accountId === account.id)?.id;
  const profile = db.supervisors.find((s) => s.accountId === account.id);
  const entries: string[][] =
    account.role === "Coordinator"
      ? [
          ["Overview", "/dashboard"],
          ["Students", "/dashboard/students"],
          ["Industry Partners", "/dashboard/partners"],
          ["Faculty Management", "/dashboard/faculty"],
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
                ["My profile", `/dashboard/students/${studentId}`],
                ["My requirements", "/dashboard/requirements?view=submissions"],
                ["Available opportunities", "/dashboard/internships"],
                ["My applications", "/dashboard/applications"],
                ["Daily Attendance", "/dashboard/attendance"],
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
                ["My company", `/dashboard/partners/${profile?.companyId}`],
                ["Internship Postings", "/dashboard/internships"],
                [
                  "Intern Supervisor Management",
                  `/dashboard/partners/${profile?.companyId}#supervisors`,
                ],
              ]
            : []),
          ...(account.role === "Intern Supervisor"
            ? [
                [
                  "Supervisor Profile",
                  `/dashboard/partners/${profile?.companyId}/supervisors/${profile?.id}`,
                ],
                [
                  "Assigned Opportunities",
                  "/dashboard/internships?assigned=true",
                ],
                [
                  "Application Management",
                  "/dashboard/applications?assigned=true",
                ],
                ["My Interns", "/dashboard/students?interns=true"],
              ]
            : []),
          ["Assigned placements", "/dashboard/placements"],
          ["Progress reports", "/dashboard/progress?view=reports"],
          ["Evaluations", "/dashboard/evaluations"],
          ["Settings", "/dashboard/settings"],
        ];
  const modules: NavItem[] = entries.map(([label, href], index) => ({
    label,
    href,
    icon: iconFor(label, href, index),
  }));
  const navigationGroup = (href: string) =>
    /\/(reports|settings)([?#]|$)/.test(href)
      ? "System"
      : /\/(applications|placements|progress|attendance|evaluations)([?#]|$)/.test(
            href,
          ) ||
          (account.role === "Intern Supervisor" &&
            href.startsWith("/dashboard/students"))
        ? "Internship operations"
        : "Management";
  const isActive = (href: string) => {
    const base = href.split(/[?#]/)[0];
    return (
      pathname === base ||
      (base !== "/dashboard" && pathname.startsWith(base + "/"))
    );
  };
  const moduleLabel = moduleLabelFor(pathname);
  const closeOnMobile = () => {
    if (!window.matchMedia(DESKTOP).matches) setOpen(false);
  };
  const ToggleIcon = open ? PanelLeftClose : PanelLeftOpen;
  return (
    <div
      className={`workspace ${open ? "navigation-expanded" : "navigation-collapsed"}`}
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <aside
        className={`sidebar-shell ${open ? "sidebar-open" : "sidebar-collapsed"}`}
      >
        <div className="sidebar-brand">
          <span className="brand-mark" aria-hidden="true">
            IL
          </span>
          <div className="brand-copy">
            <Link className="brand-title" href="/dashboard">
              PUP InternLink
            </Link>
            <p className="brand-subtitle">Internship coordination</p>
          </div>
        </div>
        <div className="sidebar-context">
          <span className="context-label">Signed in as</span>
          <strong>{roleLabel(account.role)}</strong>
          <span className="context-year">
            Academic year {prefs.academicYear}
          </span>
        </div>
        <nav
          className="sidebar-nav"
          id="module-navigation"
          aria-label="Workspace modules"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) closeOnMobile();
          }}
        >
          {modules.map(({ label, href, icon: Icon }, index) => (
            <Fragment key={label}>
              {index > 0 &&
                (index === 1 ||
                  navigationGroup(href) !==
                    navigationGroup(modules[index - 1].href)) && (
                  <>
                    <span className="sidebar-divider" aria-hidden="true" />
                    <span className="sidebar-group-label">
                      {navigationGroup(href)}
                    </span>
                  </>
                )}
              <Link
                className={`sidebar-link ${isActive(href) ? "sidebar-link-active" : ""}`}
                aria-current={
                  pathname === href.split(/[?#]/)[0] ? "page" : undefined
                }
                aria-label={open ? undefined : label}
                href={href}
                title={label}
              >
                <Icon size={19} strokeWidth={1.9} aria-hidden="true" />
                <span className="sidebar-link-text">{label}</span>
              </Link>
            </Fragment>
          ))}
        </nav>
      </aside>
      {open && (
        <div
          className="nav-scrim"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="workspace-main">
        <header className="workspace-header">
          <button
            type="button"
            className="nav-toggle"
            aria-label={open ? "Collapse navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="module-navigation"
            onClick={() => setOpen(!open)}
          >
            <ToggleIcon size={19} aria-hidden="true" />
          </button>
          <Link href="/dashboard" className="topbar-brand">
            <span className="brand-mark" aria-hidden="true">
              IL
            </span>
            InternLink
          </Link>
          <div className="topbar-context" aria-label="Current location">
            <span>{roleLabel(account.role)}</span>
            <ChevronRight size={14} aria-hidden="true" />
            <strong>{moduleLabel}</strong>
          </div>
          <div className="topbar-spacer" />
          <div className="session-info">
            <span className="avatar" aria-hidden="true">
              {initials(account.name)}
            </span>
            <div className="session-text">
              <strong>{account.name}</strong>
              <span>
                {roleLabel(account.role)} · {prefs.academicYear}
              </span>
            </div>
            <button
              className="secondary-action btn-sm"
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
              <LogOut size={16} aria-hidden="true" />
              Log out
            </button>
          </div>
        </header>
        <main className="workspace-content" id="main-content">
          {logoutError && (
            <p role="alert" className="error-message prototype-message">
              {logoutError}
            </p>
          )}
          <div className="demo-banner">
            <FlaskConical size={15} aria-hidden="true" />
            <span>
              Demonstration mode · Synthetic data stored in this browser only ·
              Simulated access controls
            </span>
            {account.role !== "Coordinator" && (
              <span className="scope-note">
                <ShieldCheck size={15} aria-hidden="true" />
                Browser-local role portal · Only permitted own, assigned or
                associated company records
              </span>
            )}
          </div>
          <SavedNotice />
          <ModuleLabelContext.Provider value={moduleLabel}>
            {children}
          </ModuleLabelContext.Provider>
        </main>
      </div>
    </div>
  );
}
