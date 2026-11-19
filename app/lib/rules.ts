import {
  Account,
  AppError,
  Database,
  Placement,
  Preferences,
  Role,
  Student,
  defaultPreferences,
} from "./domain";

export const nameOf = (s: Student) => `${s.firstName} ${s.lastName}`;
export function get<T extends { id: string }>(items: T[], id: string): T {
  const item = items.find((x) => x.id === id);
  if (!item)
    throw new AppError(
      "NOT_FOUND",
      "The requested record does not exist or is not available to this account.",
    );
  return item;
}
export function preferencesOf(db: Database, accountId: string): Preferences {
  if (db.preferences[accountId]) return db.preferences[accountId];
  const student = db.students.find((s) => s.accountId === accountId);
  const actor = db.accounts.find((a) => a.id === accountId);
  const placement = actor
    ? db.placements
        .filter((p) => canSeePlacement(db, actor, p))
        .sort(
          (a, b) =>
            Number(b.status === "Ongoing") - Number(a.status === "Ongoing") ||
            b.createdAt.localeCompare(a.createdAt),
        )[0]
    : undefined;
  const supervisor = db.supervisors.find((s) => s.accountId === accountId);
  const company = db.companies.find((c) => c.id === supervisor?.companyId);
  const year = new Date().getUTCFullYear();
  return {
    ...defaultPreferences,
    academicYear:
      student?.academicYear ??
      placement?.academicYear ??
      company?.academicYear ??
      `${year}-${year + 1}`,
  };
}
export function required(value: string, field: string, max = 500) {
  const text = value.trim();
  if (!text || text.length > max)
    throw new AppError(
      "VALIDATION",
      `${field} is required and must be no more than ${max} characters.`,
    );
  return text;
}
export function email(value: string) {
  const text = required(value, "Email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text))
    throw new AppError("VALIDATION", "Enter a valid email address.");
  return text;
}
export function validAcademicYear(value: string) {
  const year = required(value, "Academic year", 9);
  if (
    !/^\d{4}-\d{4}$/.test(year) ||
    Number(year.slice(5)) !== Number(year.slice(0, 4)) + 1
  )
    throw new AppError(
      "VALIDATION",
      "Academic year must contain consecutive years, such as 2026-2027.",
    );
  return year;
}
export function validatePhone(value: string) {
  const phone = required(value, "Contact number", 40);
  if (!/^[+\d() .-]{5,40}$/.test(phone) || phone.replace(/\D/g, "").length < 5)
    throw new AppError(
      "VALIDATION",
      "Enter a contact number with at least five digits and valid phone punctuation.",
    );
  return phone;
}
export function sumHours(values: number[]) {
  let sum = 0,
    correction = 0;
  for (const value of values) {
    const adjusted = value - correction;
    const next = sum + adjusted;
    correction = next - sum - adjusted;
    sum = next;
  }
  return Number(sum.toPrecision(12));
}
export function positive(
  value: number,
  field: string,
  max = 10000,
  integer = false,
) {
  if (
    !Number.isFinite(value) ||
    value <= 0 ||
    value > max ||
    (integer && !Number.isInteger(value))
  )
    throw new AppError(
      "VALIDATION",
      `${field} must be ${integer ? "a positive integer" : "a positive number"} no greater than ${max}.`,
    );
  return value;
}
export function validDate(value: string) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(Date.parse(value)) ||
    new Date(value).toISOString().slice(0, 10) !== value
  )
    throw new AppError("VALIDATION", "Enter a valid calendar date.");
  return value;
}
export function dateRange(start: string, end: string) {
  validDate(start);
  validDate(end);
  if (end < start)
    throw new AppError(
      "VALIDATION",
      "End date must be on or after the start date.",
    );
}
export function partnership(
  db: Database,
  companyId: string,
  today = new Date().toISOString().slice(0, 10),
) {
  const c = get(db.companies, companyId);
  if (!c.approved || c.moaStart > today) return "Pending" as const;
  if (c.moaEnd < today) return "Expired" as const;
  return (Date.parse(c.moaEnd) - Date.parse(today)) / 86400000 <= 30
    ? ("Expiring Soon" as const)
    : ("Active" as const);
}
export const eligibleCompany = (
  db: Database,
  companyId: string,
  today?: string,
) => ["Active", "Expiring Soon"].includes(partnership(db, companyId, today));
export const applicationFor = (db: Database, p: Placement) =>
  get(db.applications, p.applicationId);
export const studentFor = (db: Database, p: Placement) =>
  get(db.students, applicationFor(db, p).studentId);
export const opportunityFor = (db: Database, p: Placement) =>
  get(db.opportunities, applicationFor(db, p).opportunityId);
export const companyFor = (db: Database, p: Placement) =>
  get(db.companies, opportunityFor(db, p).companyId);
export const latestSubmission = (
  db: Database,
  studentId: string,
  requirementId: string,
) =>
  db.submissions
    .filter(
      (s) => s.studentId === studentId && s.requirementId === requirementId,
    )
    .sort((a, b) => b.attempt - a.attempt)[0];
export const missingRequirements = (db: Database, studentId: string) =>
  db.requirements.filter(
    (r) =>
      r.classification === "Mandatory" &&
      latestSubmission(db, studentId, r.id)?.status !== "Approved",
  );
export const allocated = (db: Database, opportunityId: string) =>
  db.placements.filter(
    (p) =>
      p.status !== "Terminated" &&
      applicationFor(db, p).opportunityId === opportunityId,
  ).length;
export const remainingSlots = (db: Database, opportunityId: string) =>
  db.availability?.[opportunityId]?.remaining ??
  Math.max(
    0,
    get(db.opportunities, opportunityId).capacity -
      allocated(db, opportunityId),
  );
export const available = (
  db: Database,
  opportunityId: string,
  today?: string,
) => {
  const o = get(db.opportunities, opportunityId);
  return (
    db.availability?.[opportunityId]?.eligible ??
    (o.status === "Approved" &&
      eligibleCompany(db, o.companyId, today) &&
      remainingSlots(db, o.id) > 0)
  );
};
export function hours(db: Database, placementId: string) {
  const p = get(db.placements, placementId);
  const reports = db.reports.filter((r) => r.placementId === placementId);
  const submitted = sumHours(reports.map((r) => r.hours));
  const reviewed = sumHours(
    reports.filter((r) => r.status === "Reviewed").map((r) => r.hours),
  );
  return {
    submitted,
    reviewed,
    remaining: Math.max(0, sumHours([p.requiredHours, -reviewed])),
    percent:
      p.requiredHours > 0
        ? Number(((reviewed / p.requiredHours) * 100).toPrecision(12))
        : 0,
  };
}
export const placementsForStudent = (db: Database, studentId: string) =>
  db.placements
    .filter((p) => applicationFor(db, p).studentId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
export function studentStatus(db: Database, studentId: string) {
  const ps = placementsForStudent(db, studentId);
  if (ps.some((p) => p.status === "Ongoing")) return "Ongoing";
  if (ps.some((p) => p.status === "Completed")) return "Completed";
  if (
    db.applications.some(
      (a) =>
        a.studentId === studentId &&
        a.status === "Accepted" &&
        !db.placements.some((p) => p.applicationId === a.id),
    )
  )
    return "Awaiting Placement";
  if (
    db.applications.some(
      (a) => a.studentId === studentId && a.status === "Pending",
    )
  )
    return "Applying";
  return ps.length ? "Terminated" : "Not Yet Placed";
}
export function canSeePlacement(db: Database, actor: Account, p: Placement) {
  return (
    actor.role === "Coordinator" ||
    (actor.role === "Student" && studentFor(db, p).accountId === actor.id) ||
    (actor.role === "Faculty Adviser" &&
      get(db.faculty, p.adviserId).accountId === actor.id) ||
    (actor.role === "Company Supervisor" &&
      get(db.supervisors, p.supervisorId).accountId === actor.id)
  );
}
export function requireRole(actor: Account, ...roles: Role[]) {
  if (!actor.active)
    throw new AppError(
      "UNAUTHENTICATED",
      "This demonstration account is inactive.",
    );
  if (!roles.includes(actor.role))
    throw new AppError(
      "FORBIDDEN",
      "This demonstration account cannot perform this action.",
    );
}
export function canReviewStudent(
  db: Database,
  actor: Account,
  studentId: string,
) {
  return (
    actor.role === "Coordinator" ||
    (actor.role === "Faculty Adviser" &&
      placementsForStudent(db, studentId).some(
        (p) => get(db.faculty, p.adviserId).accountId === actor.id,
      ))
  );
}
export function completionProblems(
  db: Database,
  placementId: string,
): string[] {
  const p = get(db.placements, placementId);
  const errors: string[] = [];
  if (p.status === "Terminated") errors.push("Placement is terminated.");
  if (hours(db, p.id).reviewed < p.requiredHours)
    errors.push("Required reviewed hours are incomplete.");
  if (db.reports.some((r) => r.placementId === p.id && r.status !== "Reviewed"))
    errors.push("Progress reports still need review.");
  if (
    p.requiredRequirementIds.some(
      (id) =>
        latestSubmission(db, studentFor(db, p).id, id)?.status !== "Approved",
    )
  )
    errors.push("Mandatory requirements need approval.");
  const obligations = db.evaluations.filter((e) => e.placementId === p.id);
  if (
    obligations.length !== 2 ||
    obligations.some((e) => e.status !== "Submitted")
  )
    errors.push("Both assigned evaluations must be submitted.");
  return errors;
}
export function reportingGap(db: Database, p: Placement, today: string) {
  if (p.status !== "Ongoing" || today < p.startDate) return false;
  const last =
    db.reports
      .filter((r) => r.placementId === p.id)
      .map((r) => r.workDate)
      .sort()
      .at(-1) ?? p.startDate;
  const through = today < p.endDate ? today : p.endDate;
  return Date.parse(through) - Date.parse(last) > 7 * 86400000;
}
