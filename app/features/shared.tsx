"use client";
import { useApp } from "../components/AppProvider";
import { Database, Placement } from "../lib/domain";
import {
  applicationFor,
  companyFor,
  get,
  hours,
  nameOf,
  opportunityFor,
  preferencesOf,
  studentFor,
} from "../lib/rules";
import {
  HoursMeter,
  Identity,
  Mono,
  RowLink,
  Stack,
  Status,
  Table,
  useFilters,
} from "../components/ui";

export interface FeatureProps {
  id?: string;
  action?: string;
  parentId?: string;
}
export function useData() {
  const app = useApp();
  if (!app.db || !app.account)
    throw new Error("A loaded demonstration session is required.");
  return {
    ...app,
    db: app.db,
    account: app.account,
    prefs: preferencesOf(app.db, app.account.id),
  };
}
export const accountName = (db: Database, id?: string) =>
  db.accounts.find((a) => a.id === id)?.name ?? "—";
export const matches = (filter: string, value: string) =>
  !filter || value.toLowerCase() === filter.toLowerCase();
export const searchMatches = (query: string, ...values: string[]) =>
  values.some((v) => v.toLowerCase().includes(query.trim().toLowerCase()));
export function useYear() {
  const { prefs } = useData();
  const filters = useFilters();
  return filters.value("year") || prefs.academicYear;
}
export function PlacementRows({ placements }: { placements: Placement[] }) {
  const { db } = useData();
  return (
    <Table
      headers={[
        "Placement",
        "Student",
        "Company / Opportunity",
        "Supervision",
        "Dates",
        "Approved / Required",
        "Status",
        "Actions",
      ]}
      hrefs={placements.map((p) => `/dashboard/placements/${p.id}`)}
      rows={placements.map((p) => {
        const progress = hours(db, p.id);
        return [
          <Mono key="id">{p.id}</Mono>,
          <Identity key="student" name={nameOf(studentFor(db, p))} />,
          <Stack
            key="company"
            primary={companyFor(db, p).name}
            secondary={opportunityFor(db, p).title}
          />,
          <div className="cell-stack" key="supervision">
            <span>
              <span className="cell-label">Adviser</span>{" "}
              {accountName(db, get(db.faculty, p.adviserId).accountId)}
            </span>
            <span>
              <span className="cell-label">Supervisor</span>{" "}
              {accountName(db, get(db.supervisors, p.supervisorId).accountId)}
            </span>
          </div>,
          <Stack
            key="dates"
            primary={p.startDate}
            secondary={`to ${p.endDate}`}
          />,
          <HoursMeter
            key="hours"
            approved={progress.reviewed}
            required={p.requiredHours}
          />,
          <Status key="status">{p.status}</Status>,
          <RowLink href={`/dashboard/placements/${p.id}`} key="open">
            Open placement
          </RowLink>,
        ];
      })}
    />
  );
}
export function ApplicationRows({
  studentId,
  opportunityId,
}: {
  studentId?: string;
  opportunityId?: string;
}) {
  const { db } = useData();
  const list = db.applications.filter(
    (a) =>
      (!studentId || a.studentId === studentId) &&
      (!opportunityId || a.opportunityId === opportunityId),
  );
  return (
    <Table
      headers={["Application", "Student", "Opportunity", "Status", "Actions"]}
      hrefs={list.map((a) => `/dashboard/applications/${a.id}`)}
      rows={list.map((a) => [
        <Mono key="id">{a.id}</Mono>,
        <Identity key="s" name={nameOf(get(db.students, a.studentId))} />,
        get(db.opportunities, a.opportunityId).title,
        <Status key="st">{a.status}</Status>,
        <RowLink href={`/dashboard/applications/${a.id}`} key="open">
          Open application
        </RowLink>,
      ])}
    />
  );
}
export function EvaluationRows({
  placementId,
  studentId,
}: {
  placementId?: string;
  studentId?: string;
}) {
  const { db } = useData();
  const list = db.evaluations.filter(
    (e) =>
      (!placementId || e.placementId === placementId) &&
      (!studentId ||
        applicationFor(db, get(db.placements, e.placementId)).studentId ===
          studentId),
  );
  return (
    <Table
      headers={[
        "Evaluation",
        "Student",
        "Placement",
        "Evaluator",
        "Date",
        "Score",
        "Status",
        "Actions",
      ]}
      hrefs={list.map((e) => `/dashboard/evaluations/${e.id}`)}
      rows={list.map((e) => [
        <Mono key="id">{e.id}</Mono>,
        <Identity
          key="s"
          name={nameOf(studentFor(db, get(db.placements, e.placementId)))}
        />,
        <Mono key="p">{e.placementId}</Mono>,
        accountName(db, e.evaluatorId),
        e.submittedAt?.slice(0, 10) ?? "—",
        e.grade ?? "—",
        <Status key="st">{e.status}</Status>,
        <RowLink href={`/dashboard/evaluations/${e.id}`} key="open">
          Open evaluation
        </RowLink>,
      ])}
    />
  );
}
