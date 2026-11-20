"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Back,
  Field,
  Filter,
  Filters,
  PageHeader,
  RecordState,
  SaveForm,
  Table,
  number,
  text,
  useFilters,
} from "../components/ui";
import { get, nameOf, studentFor, sumHours, reviewState } from "../lib/rules";
import { FeatureProps, useData } from "./shared";

export function Attendance({ action }: FeatureProps) {
  const { db, account, mutate, setNotice } = useData(),
    filters = useFilters(),
    router = useRouter();
  const own = ["Student", "Coordinator"].includes(account.role),
    placements = db.placements.filter((p) => p.status === "Ongoing");
  if (action === "create") {
    if (!own) return <RecordState title="Access denied" />;
    if (!placements.length) return <RecordState title="No ongoing placement" />;
    return (
      <>
        <Back href="/dashboard/attendance">Daily attendance</Back>
        <PageHeader
          title="Record Daily Attendance"
          description="One record per placement/date; positive hours up to12, within placement dates and not in the future. Attendance hours await linked weekly report approval."
        />
        <SaveForm
          revision={db.revision}
          submit="Save Attendance"
          cancel="/dashboard/attendance"
          save={async (data, revision) => {
            const placementId = text(data, "placementId");
            await mutate(
              {
                type: "attendance.create",
                placementId,
                date: text(data, "date"),
                hours: number(data, "hours"),
                activity: text(data, "activity"),
              },
              undefined,
              revision,
            );
            setNotice("Daily attendance saved.");
            router.push(`/dashboard/attendance?placement=${placementId}`);
          }}
        >
          <Field
            label="Placement"
            name="placementId"
            value={filters.value("placement")}
            options={placements.map((p) => ({
              value: p.id,
              label: `${p.id} / ${nameOf(studentFor(db, p))}`,
            }))}
          />
          <Field
            label="Attendance date"
            name="date"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
          />
          <Field
            label="Attendance hours"
            name="hours"
            type="number"
            min={0}
            max={12}
            step="any"
          />
          <Field
            label="Attendance activities"
            name="activity"
            type="textarea"
          />
        </SaveForm>
      </>
    );
  }
  const entries = (db.attendance ?? [])
    .filter(
      (a) =>
        !filters.value("placement") ||
        a.placementId === filters.value("placement"),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHeader
        title="Daily Attendance"
        description="Rendered hours are recorded once; weekly approval releases their official approved-hour contribution."
      >
        {own && (
          <>
            <Link
              className="primary-action"
              href={`/dashboard/attendance/create${filters.value("placement") ? `?placement=${filters.value("placement")}` : ""}`}
            >
              Record Daily Attendance
            </Link>
            <Link
              href={`/dashboard/progress/weekly/create${filters.value("placement") ? `?placement=${filters.value("placement")}` : ""}`}
            >
              Submit Weekly Report
            </Link>
          </>
        )}
      </PageHeader>
      <Filters>
        <Filter
          name="placement"
          label="Placement"
          choices={db.placements.map((p) => ({
            value: p.id,
            label: `${p.id} / ${nameOf(studentFor(db, p))}`,
          }))}
        />
      </Filters>
      <Table
        headers={[
          "Date",
          "Student",
          "Placement",
          "Hours",
          "Activities",
          "Weekly approval",
          "Actions",
        ]}
        rows={entries.map((a) => {
          const r = db.reports.find((r) => r.id === a.reportId),
            p = get(db.placements, a.placementId);
          return [
            a.date,
            nameOf(studentFor(db, p)),
            a.placementId,
            a.hours,
            a.activity,
            r ? reviewState(r.status) : "Not submitted",
            r ? (
              <Link key={r.id} href={`/dashboard/progress/reports/${r.id}`}>
                View weekly report
              </Link>
            ) : (
              <Link key={a.id} href={`/dashboard/progress/${a.placementId}`}>
                Placement progress
              </Link>
            ),
          ];
        })}
      />
    </>
  );
}

export function WeeklyReport() {
  const { db, account, mutate, setNotice } = useData(),
    filters = useFilters(),
    router = useRouter();
  const [placementId, setPlacement] = useState(filters.value("placement")),
    [from, setFrom] = useState(filters.value("from")),
    [to, setTo] = useState(filters.value("to"));
  if (!["Student", "Coordinator"].includes(account.role))
    return <RecordState title="Access denied" />;
  const ps = db.placements.filter((p) => p.status === "Ongoing");
  if (!ps.length) return <RecordState title="No ongoing placement" />;
  const entries = (db.attendance ?? []).filter(
    (a) =>
      a.placementId === placementId &&
      (!from || a.date >= from) &&
      (!to || a.date <= to) &&
      (!a.reportId ||
        db.reports.find((r) => r.id === a.reportId)?.status === "Rejected"),
  );
  return (
    <>
      <Back href="/dashboard/progress">Progress monitoring</Back>
      <PageHeader
        title="Submit Weekly Report"
        description="Choose a 1–7day reporting period and its recorded attendance. Rejected periods may be resubmitted; earlier decisions remain. Weekly records do not duplicate rendered hours."
      />
      <SaveForm
        revision={db.revision}
        submit="Submit Weekly Report"
        cancel="/dashboard/progress"
        save={async (data, revision) => {
          const id = await mutate(
            {
              type: "report.weekly",
              placementId: text(data, "placementId"),
              fromDate: text(data, "fromDate"),
              toDate: text(data, "toDate"),
              attendanceIds: data.getAll("attendanceIds").map(String),
              tasks: text(data, "tasks"),
            },
            undefined,
            revision,
          );
          setNotice("Weekly report and attendance references stored.");
          router.push(`/dashboard/progress/reports/${id}`);
        }}
      >
        <Field
          label="Placement"
          name="placementId"
          value={placementId}
          onChange={setPlacement}
          options={ps.map((p) => ({
            value: p.id,
            label: `${p.id} / ${nameOf(studentFor(db, p))}`,
          }))}
        />
        <Field
          label="Period start"
          name="fromDate"
          type="date"
          value={from}
          onChange={setFrom}
        />
        <Field
          label="Period end"
          name="toDate"
          type="date"
          value={to}
          onChange={setTo}
          max={new Date().toISOString().slice(0, 10)}
        />
        <h2>Eligible attendance</h2>
        {!entries.length && (
          <p>
            No unsubmitted/rejected attendance matches this period.{" "}
            <Link
              href={`/dashboard/attendance/create?placement=${placementId}`}
            >
              Record attendance
            </Link>{" "}
            first.
          </p>
        )}
        {entries.map((a) => (
          <label className="checkbox-field" key={a.id}>
            <input
              type="checkbox"
              name="attendanceIds"
              value={a.id}
              defaultChecked
            />
            {a.date} / {a.hours} hours / {a.activity}
          </label>
        ))}
        <p>
          Eligible attendance totals {sumHours(entries.map((a) => a.hours))}{" "}
          hours. Saved report hours derive from the selected entries.
        </p>
        <Field
          label="Weekly tasks and activities"
          name="tasks"
          type="textarea"
        />
      </SaveForm>
    </>
  );
}
