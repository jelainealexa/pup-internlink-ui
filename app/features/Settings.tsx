"use client";
import { useState } from "react";
import {
  Details,
  Field,
  PageHeader,
  SaveForm,
  options,
  text,
} from "../components/ui";
import { useData } from "./shared";

export function Settings() {
  const { account, db, prefs, mutate, service, refresh } = useData();
  const [resetOpen, setResetOpen] = useState(false);
  const years = [
    ...new Set([
      prefs.academicYear,
      "2026-2027",
      "2025-2026",
      ...db.students.map((s) => s.academicYear),
      ...db.companies.map((c) => c.academicYear),
    ]),
  ];
  const toggles = [
    [
      "requirementAlerts",
      "Requirement alerts",
      "Show pending/rejected document counts on your dashboard.",
    ],
    [
      "evaluationAlerts",
      "Evaluation alerts",
      "Show pending evaluation counts on your dashboard.",
    ],
    [
      "progressAlerts",
      "Progress alerts",
      "Show pending report review counts on your dashboard.",
    ],
    [
      "partnershipAlerts",
      "Partnership expiration alerts",
      "Show expiring partner counts on the coordinator dashboard.",
    ],
    [
      "largerText",
      "Larger interface text",
      "Increase supporting text and control sizes throughout the workspace.",
    ],
    [
      "reduceMotion",
      "Reduced motion",
      "Disable interface transitions and animated movement.",
    ],
  ] as const;
  return (
    <>
      <PageHeader
        title="Settings"
        description="Preferences are personal to this synthetic account in this browser. Reminder counts are local dashboard indicators, not email or SMS notifications."
      />
      <h2>Account information</h2>
      <Details
        items={[
          ["Name", account.name],
          ["Email", account.email],
          ["Role", account.role],
          ["Data mode", service.mode],
          ["Session", "Simulated, expires eight hours after sign in"],
        ]}
      />
      <h2>Workspace preferences</h2>
      <SaveForm
        revision={db.revision}
        submit="Save Preferences"
        success="Preferences saved and applied throughout this browser workspace."
        save={async (data, revision) => {
          await mutate(
            {
              type: "preferences.save",
              input: {
                academicYear: text(data, "academicYear"),
                landingPage: text(data, "landingPage"),
                density: text(data, "density") as "Comfortable" | "Compact",
                requirementAlerts: data.has("requirementAlerts"),
                evaluationAlerts: data.has("evaluationAlerts"),
                progressAlerts: data.has("progressAlerts"),
                partnershipAlerts: data.has("partnershipAlerts"),
                largerText: data.has("largerText"),
                reduceMotion: data.has("reduceMotion"),
              },
            },
            undefined,
            revision,
          );
        }}
      >
        <div className="form-grid">
          <Field
            label="Academic year preference"
            name="academicYear"
            value={prefs.academicYear}
            options={options(years)}
            hint="Changes the default year shown in directories, dashboard summaries and reports."
          />
          <Field
            label="Default landing page"
            name="landingPage"
            value={prefs.landingPage}
            options={
              account.role === "Coordinator"
                ? [
                    { value: "/dashboard", label: "Overview" },
                    { value: "/dashboard/students", label: "Students" },
                    { value: "/dashboard/applications", label: "Applications" },
                    {
                      value: "/dashboard/progress",
                      label: "Progress Monitoring",
                    },
                  ]
                : [{ value: "/dashboard", label: "My dashboard" }]
            }
          />
          <Field
            label="Table density"
            name="density"
            value={prefs.density}
            options={options(["Comfortable", "Compact"])}
          />
        </div>
        {toggles
          .filter(
            ([key]) =>
              (account.role === "Coordinator" || key !== "partnershipAlerts") &&
              (account.role !== "Company Supervisor" ||
                key !== "requirementAlerts"),
          )
          .map(([key, label, description]) => (
            <div className="preference-row" key={key}>
              <div>
                <label htmlFor={`pref-${key}`}>{label}</label>
                <p>{description}</p>
              </div>
              <input
                id={`pref-${key}`}
                type="checkbox"
                name={key}
                defaultChecked={prefs[key]}
              />
            </div>
          ))}
      </SaveForm>
      {account.role === "Coordinator" && (
        <section className="reset-panel">
          <h2>Reset synthetic data</h2>
          <p>
            This removes all synthetic records, attachments and preferences in
            this browser, restores the seed, and signs you out. No server or
            other browser is affected.
          </p>
          <button
            className="secondary-action"
            onClick={() => setResetOpen(!resetOpen)}
          >
            {resetOpen ? "Cancel reset" : "Prepare demonstration reset"}
          </button>
          {resetOpen && (
            <SaveForm
              submit="Permanently reset this browser's demo"
              save={async (data) => {
                await service.reset(text(data, "confirmation"));
                await refresh();
              }}
            >
              <Field label="Type RESET DEMO" name="confirmation" />
            </SaveForm>
          )}
        </section>
      )}
    </>
  );
}
