"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const groups = [
  {
    label: "Management",
    items: [
      {
        short: "ST",
        label: "Students",
        href: "/dashboard/students",
      },
      {
        short: "IP",
        label: "Industry Partners",
        href: "/dashboard/partners",
      },
      {
        short: "RQ",
        label: "Requirements",
        href: "/dashboard/requirements",
      },
      {
        short: "OP",
        label: "Opportunities",
        href: "/dashboard/internships",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        short: "AP",
        label: "Applications",
        href: "/dashboard/applications",
      },
      {
        short: "PL",
        label: "Placements",
        href: "/dashboard/placements",
      },
      {
        short: "PR",
        label: "Progress Monitoring",
        href: "/dashboard/progress",
      },
      {
        short: "EV",
        label: "Evaluations",
        href: "/dashboard/evaluations",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        short: "RP",
        label: "Reports & Analytics",
        href: "/dashboard/reports",
      },
      {
        short: "SE",
        label: "Settings",
        href: "/dashboard/settings",
      },
    ],
  },
];

export default function ModuleNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`sidebar-shell ${
        open ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <div className="sidebar-top">
        {open && (
          <div>
            <span className="sidebar-context">
              COORDINATOR
            </span>

            <strong>Workspace</strong>
          </div>
        )}

        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setOpen((current) => !current)}
          aria-label={
            open ? "Collapse navigation" : "Open navigation"
          }
        >
          {open ? "←" : "☰"}
        </button>
      </div>

      <nav className="sidebar-nav">
        <Link
          href="/dashboard"
          className={`sidebar-link sidebar-overview ${
            pathname === "/dashboard"
              ? "sidebar-link-active"
              : ""
          }`}
        >
          <span className="sidebar-short">OV</span>

          {open && <span>Overview</span>}
        </Link>

        {groups.map((group) => (
          <div
            className="sidebar-group"
            key={group.label}
          >
            {open && (
              <span className="sidebar-group-label">
                {group.label}
              </span>
            )}

            {group.items.map((item) => {
              const active = pathname.startsWith(
                item.href
              );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!open ? item.label : undefined}
                  className={`sidebar-link ${
                    active
                      ? "sidebar-link-active"
                      : ""
                  }`}
                >
                  <span className="sidebar-short">
                    {item.short}
                  </span>

                  {open && (
                    <span className="sidebar-link-text">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}