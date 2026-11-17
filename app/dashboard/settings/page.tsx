"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [academicYear, setAcademicYear] =
    useState("2026-2027");

  const [landingPage, setLandingPage] =
    useState("Overview");

  const [tableDensity, setTableDensity] =
    useState("Comfortable");

  const [requirementAlerts, setRequirementAlerts] =
    useState(true);

  const [evaluationAlerts, setEvaluationAlerts] =
    useState(true);

  const [progressAlerts, setProgressAlerts] =
    useState(true);

  const [partnershipAlerts, setPartnershipAlerts] =
    useState(true);

  const [largerText, setLargerText] =
    useState(false);

  const [reduceMotion, setReduceMotion] =
    useState(false);

  return (
    <>
      <header className="settings-header-v3">
        <div className="page-eyebrow">
          SYSTEM
        </div>

        <h1>Settings</h1>

        <p>
          Account, workspace, and reminder preferences.
        </p>
      </header>

      {/* ACCOUNT + WORKSPACE */}

      <section className="settings-group-v3">
        <div className="settings-group-title">
          <span className="section-label">
            ACCOUNT & WORKSPACE
          </span>

          <h2>General</h2>
        </div>

        <div className="settings-two-column">

          <div className="settings-card-v3">
            <h3>Coordinator account</h3>

            <SettingValue
              label="Role"
              value="Internship Coordinator"
            />

            <SettingValue
              label="Email"
              value="coordinator@pup.edu.ph"
            />
          </div>

          <div className="settings-card-v3">
            <h3>Workspace</h3>

            <SettingSelect
              label="Academic Year"
              value={academicYear}
              onChange={setAcademicYear}
              options={[
                "2026-2027",
                "2025-2026",
              ]}
            />

            <SettingSelect
              label="Default Landing Page"
              value={landingPage}
              onChange={setLandingPage}
              options={[
                "Overview",
                "Students",
                "Applications",
                "Progress Monitoring",
              ]}
            />

            <SettingSelect
              label="Table Density"
              value={tableDensity}
              onChange={setTableDensity}
              options={[
                "Comfortable",
                "Compact",
              ]}
            />
          </div>

        </div>
      </section>

      {/* NOTIFICATIONS */}

      <section className="settings-group-v3">
        <div className="settings-group-title">
          <span className="section-label">
            NOTIFICATIONS
          </span>

          <h2>Task reminders</h2>

          <p>
            Surface reminders for items that require
            coordinator action.
          </p>
        </div>

        <div className="settings-card-v3">
          <SettingToggle
            title="Pending requirements"
            description="Student documents waiting for review."
            checked={requirementAlerts}
            onChange={setRequirementAlerts}
          />

          <SettingToggle
            title="Pending evaluations"
            description="Required internship evaluations still incomplete."
            checked={evaluationAlerts}
            onChange={setEvaluationAlerts}
          />

          <SettingToggle
            title="Progress reports"
            description="Submitted progress reports waiting for review."
            checked={progressAlerts}
            onChange={setProgressAlerts}
          />

          <SettingToggle
            title="Expiring partnerships"
            description="Partner agreements nearing expiration."
            checked={partnershipAlerts}
            onChange={setPartnershipAlerts}
          />
        </div>
      </section>

      {/* ACCESSIBILITY */}

      <section className="settings-group-v3">
        <div className="settings-group-title">
          <span className="section-label">
            ACCESSIBILITY
          </span>

          <h2>Display</h2>
        </div>

        <div className="settings-card-v3">
          <SettingToggle
            title="Larger interface text"
            description="Increase supporting labels and secondary text."
            checked={largerText}
            onChange={setLargerText}
          />

          <SettingToggle
            title="Reduce motion"
            description="Reduce hover movement and interface transitions."
            checked={reduceMotion}
            onChange={setReduceMotion}
          />
        </div>
      </section>
    </>
  );
}


function SettingValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="settings-row-v3">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}


function SettingSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="settings-row-v3">
      <span>{label}</span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        {options.map((option) => (
          <option key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}


function SettingToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="settings-toggle-row-v3">
      <div>
        <strong>{title}</strong>

        <span>{description}</span>
      </div>

      <button
        type="button"
        className={`settings-switch ${
          checked
            ? "settings-switch-on"
            : ""
        }`}
        onClick={() =>
          onChange(!checked)
        }
        aria-pressed={checked}
      >
        <span />
      </button>
    </div>
  );
}