import { Database } from "./domain";

/** Version-one identities and historical outcomes are retained; no administrator is inferred. */
export function upgradeSnapshot(saved: Database): Database {
  if (saved.schemaVersion === 2) return saved;
  const db = structuredClone(saved);
  db.schemaVersion = 2;
  db.revision++;
  db.attendance = [];
  db.accountRequests = [];
  for (const a of db.accounts) {
    if (a.role === "Company Supervisor") a.role = "Intern Supervisor";
    a.activationState = a.active ? "Active" : "Deactivated";
    a.credentialVersion = 1;
  }
  for (const s of db.students) {
    const p = db.placements
      .filter(
        (p) =>
          db.applications.find((a) => a.id === p.applicationId)?.studentId ===
          s.id,
      )
      .sort(
        (a, b) =>
          Number(b.status === "Ongoing") - Number(a.status === "Ongoing") ||
          b.createdAt.localeCompare(a.createdAt),
      )[0];
    if (p) s.adviserId = p.adviserId;
  }
  db.requirements.forEach((r) => {
    r.phase = "Before Internship";
  });
  for (const o of db.opportunities) {
    o.supervisorIds = db.supervisors
      .filter(
        (s) =>
          s.companyId === o.companyId &&
          db.accounts.find((a) => a.id === s.accountId)?.role ===
            "Intern Supervisor",
      )
      .map((s) => s.id);
    o.location = "Not specified";
    o.modality = "Not specified";
    o.decisions = [];
    if (o.status === "Approved") {
      o.status = "Active";
      o.legacyApproval = true;
    } else if (o.status === "Closed") o.status = "Deactivated";
    else if (o.status === "Pending Approval")
      o.status = "Pending Approval - Company";
  }
  for (const r of db.reports) {
    r.kind = "Daily";
    r.legacyStatus = r.status;
    r.status = r.status === "Reviewed" ? "Approved" : "Pending";
    r.history = [
      {
        status: r.status,
        actorId:
          r.reviewerId ??
          db.students.find(
            (s) =>
              s.id ===
              db.applications.find(
                (a) =>
                  a.id ===
                  db.placements.find((p) => p.id === r.placementId)
                    ?.applicationId,
              )?.studentId,
          )!.accountId,
        at: r.reviewedAt ?? r.submittedAt,
        remarks:
          r.remarks ||
          "Imported version-one daily report; historical hours retained.",
      },
    ];
    r.facultyRemarks = [];
  }
  for (const e of db.evaluations)
    if (e.submittedAt) e.evaluationDate = e.submittedAt.slice(0, 10);
  return db;
}
