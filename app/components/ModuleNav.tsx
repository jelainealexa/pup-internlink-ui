"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const modules = [
  {
    number: "01",
    label: "Overview",
    href: "/dashboard",
  },
  {
    number: "02",
    label: "Students",
    href: "/dashboard/students",
  },
  {
    number: "03",
    label: "Partners",
    href: "/dashboard/partners",
  },
  {
    number: "04",
    label: "Requirements",
    href: "/dashboard/requirements",
  },
  {
    number: "05",
    label: "Opportunities",
    href: "/dashboard/internships",
  },
  {
    number: "06",
    label: "Applications",
    href: "/dashboard/applications",
  },
  {
    number: "07",
    label: "Placements",
    href: "/dashboard/placements",
  },
  {
    number: "08",
    label: "Progress",
    href: "/dashboard/progress",
  },
  {
    number: "09",
    label: "Evaluations",
    href: "/dashboard/evaluations",
  },
  {
    number: "10",
    label: "Reports",
    href: "/dashboard/reports",
  },
  {
    number: "11",
    label: "Settings",
    href: "/dashboard/settings",
  },
];

export default function ModuleNav() {
  const pathname = usePathname();

  return (
    <nav className="module-nav">
      {modules.map((module) => {
        const active =
          module.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(module.href);

        return (
          <Link
            key={module.href}
            href={module.href}
            className={`module-link ${
              active ? "active-module" : ""
            }`}
          >
            <span className="module-number">
              {module.number}
            </span>

            <span>{module.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}