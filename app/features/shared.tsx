"use client";
import Link from "next/link";
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
import { Table, useFilters } from "../components/ui";

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
        "Reviewed / Required",
        "Status",
        "Actions",
      ]}
      rows={placements.map((p) => [
        p.id,
        nameOf(studentFor(db, p)),
        <span key={1460}>
          {companyFor(db, p).name}
          <br />
          {opportunityFor(db, p).title}
        </span>,
        <span key={1526}>
          {accountName(db, get(db.faculty, p.adviserId).accountId)}
          <br />
          {accountName(db, get(db.supervisors, p.supervisorId).accountId)}
        </span>,
        `${p.startDate} – ${p.endDate}`,
        `${hours(db, p.id).reviewed} / ${p.requiredHours} (${hours(db, p.id).percent}%)`,
        p.status,
        <Link href={`/dashboard/placements/${p.id}`} key={1785}>
          Open placement
        </Link>,
      ])}
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
  return (
    <Table
      headers={["Application", "Student", "Opportunity", "Status", "Actions"]}
      rows={db.applications
        .filter(
          (a) =>
            (!studentId || a.studentId === studentId) &&
            (!opportunityId || a.opportunityId === opportunityId),
        )
        .map((a) => [
          a.id,
          nameOf(get(db.students, a.studentId)),
          get(db.opportunities, a.opportunityId).title,
          a.status,
          <Link href={`/dashboard/applications/${a.id}`} key={2331}>
            Open application
          </Link>,
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
      rows={db.evaluations
        .filter(
          (e) =>
            (!placementId || e.placementId === placementId) &&
            (!studentId ||
              applicationFor(db, get(db.placements, e.placementId))
                .studentId === studentId),
        )
        .map((e) => [
          e.id,
          nameOf(studentFor(db, get(db.placements, e.placementId))),
          e.placementId,
          accountName(db, e.evaluatorId),
          e.submittedAt?.slice(0, 10) ?? "—",
          e.grade ?? "—",
          e.status,
          <Link href={`/dashboard/evaluations/${e.id}`} key={3021}>
            Open evaluation
          </Link>,
        ])}
    />
  );
}
