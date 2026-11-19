import { AppError, Database } from "./domain";

/** Validates persisted references before use and before committing a transaction. */
export function assertIntegrity(db: Database) {
  const fail = () => {
    throw new AppError(
      "STORAGE_UNAVAILABLE",
      "The saved demonstration dataset has invalid records or relationships. It has not been overwritten; use the explicit recovery reset to discard it.",
    );
  };
  try {
    const collections = [
      db.accounts,
      db.students,
      db.faculty,
      db.companies,
      db.supervisors,
      db.requirements,
      db.submissions,
      db.files,
      db.opportunities,
      db.applications,
      db.placements,
      db.reports,
      db.evaluations,
      db.certificates,
      db.activities,
    ];
    for (const list of collections) {
      if (
        list.some((x) => !x || typeof x.id !== "string" || !x.id) ||
        new Set(list.map((x) => x.id)).size !== list.length
      )
        fail();
    }
    const account = (id: string, role?: string) =>
      db.accounts.some((a) => a.id === id && (!role || a.role === role));
    if (
      db.accounts.some(
        (a) =>
          ![
            "Coordinator",
            "Student",
            "Faculty Adviser",
            "Company Supervisor",
          ].includes(a.role) ||
          typeof a.active !== "boolean" ||
          typeof a.verifier !== "string" ||
          typeof a.email !== "string" ||
          typeof a.name !== "string",
      )
    )
      fail();
    if (
      new Set(db.accounts.map((a) => a.email.toLowerCase())).size !==
      db.accounts.length
    )
      fail();
    if (
      db.students.some(
        (s) =>
          !account(s.accountId, "Student") ||
          [
            s.studentNumber,
            s.firstName,
            s.lastName,
            s.email,
            s.program,
            s.yearLevel,
            s.section,
            s.academicYear,
          ].some((v) => typeof v !== "string" || !v.trim()),
      )
    )
      fail();
    if (
      new Set(db.students.map((s) => s.studentNumber.toLowerCase())).size !==
      db.students.length
    )
      fail();
    if (db.faculty.some((f) => !account(f.accountId, "Faculty Adviser")))
      fail();
    if (
      db.supervisors.some(
        (s) =>
          !account(s.accountId, "Company Supervisor") ||
          !db.companies.some((c) => c.id === s.companyId),
      )
    )
      fail();
    if (
      db.requirements.some(
        (r) =>
          !["Mandatory", "Optional"].includes(r.classification) ||
          !r.name ||
          !r.description,
      )
    )
      fail();
    if (
      db.companies.some(
        (c) =>
          [
            c.name,
            c.email,
            c.moaStart,
            c.moaEnd,
            c.address,
            c.industry,
            c.phone,
          ].some((v) => typeof v !== "string" || !v.trim()) ||
          c.moaEnd < c.moaStart,
      )
    )
      fail();
    if (
      db.opportunities.some(
        (o) =>
          !db.companies.some((c) => c.id === o.companyId) ||
          !Number.isInteger(o.capacity) ||
          o.capacity <= 0 ||
          !["Approved", "Pending Approval", "Closed"].includes(o.status),
      )
    )
      fail();
    if (
      db.applications.some(
        (a) =>
          !db.students.some((s) => s.id === a.studentId) ||
          !db.opportunities.some((o) => o.id === a.opportunityId) ||
          !["Pending", "Accepted", "Rejected"].includes(a.status) ||
          !Array.isArray(a.history),
      )
    )
      fail();
    if (
      new Set(db.applications.map((a) => `${a.studentId}:${a.opportunityId}`))
        .size !== db.applications.length
    )
      fail();
    for (const p of db.placements) {
      const a = db.applications.find((a) => a.id === p.applicationId),
        o = db.opportunities.find((o) => o.id === a?.opportunityId),
        supervisor = db.supervisors.find((s) => s.id === p.supervisorId);
      if (
        !a ||
        a.status !== "Accepted" ||
        !o ||
        !supervisor ||
        supervisor.companyId !== o.companyId ||
        !db.faculty.some((f) => f.id === p.adviserId) ||
        !Number.isFinite(p.requiredHours) ||
        p.requiredHours <= 0 ||
        p.endDate < p.startDate ||
        !["Ongoing", "Completed", "Terminated"].includes(p.status) ||
        !Array.isArray(p.requiredRequirementIds) ||
        p.requiredRequirementIds.some(
          (id) => !db.requirements.some((r) => r.id === id),
        )
      )
        fail();
      const evaluations = db.evaluations.filter((e) => e.placementId === p.id);
      if (
        evaluations.length !== 2 ||
        new Set(evaluations.map((e) => e.evaluatorId)).size !== 2
      )
        fail();
      if (
        evaluations.some(
          (e) =>
            e.evaluatorId !== supervisor?.accountId &&
            !db.faculty.some(
              (f) => f.id === p.adviserId && f.accountId === e.evaluatorId,
            ),
        )
      )
        fail();
    }
    if (
      new Set(db.placements.map((p) => p.applicationId)).size !==
      db.placements.length
    )
      fail();
    for (const o of db.opportunities)
      if (
        db.placements.filter(
          (p) =>
            p.status !== "Terminated" &&
            db.applications.find((a) => a.id === p.applicationId)
              ?.opportunityId === o.id,
        ).length > o.capacity
      )
        fail();
    if (
      db.submissions.some(
        (s) =>
          !db.students.some((x) => x.id === s.studentId) ||
          !db.requirements.some((r) => r.id === s.requirementId) ||
          !db.files.some((f) => f.id === s.fileId) ||
          !["Pending", "Approved", "Rejected"].includes(s.status) ||
          !Number.isInteger(s.attempt) ||
          s.attempt < 1,
      )
    )
      fail();
    if (
      db.files.some(
        (f) =>
          !(f.blob instanceof Blob) ||
          f.size !== f.blob.size ||
          !f.name ||
          !f.mime,
      )
    )
      fail();
    if (
      db.reports.some(
        (r) =>
          !db.placements.some(
            (p) =>
              p.id === r.placementId &&
              r.workDate >= p.startDate &&
              r.workDate <= p.endDate,
          ) ||
          !Number.isFinite(r.hours) ||
          r.hours <= 0 ||
          r.hours > 12 ||
          !["Pending Review", "Reviewed"].includes(r.status),
      )
    )
      fail();
    if (
      new Set(db.reports.map((r) => `${r.placementId}:${r.workDate}`)).size !==
      db.reports.length
    )
      fail();
    if (
      db.evaluations.some(
        (e) =>
          !db.placements.some((p) => p.id === e.placementId) ||
          !account(e.evaluatorId) ||
          !["Pending", "Submitted"].includes(e.status) ||
          (e.status === "Submitted" &&
            (typeof e.grade !== "number" ||
              e.grade < 0 ||
              e.grade > 100 ||
              !e.comments ||
              !e.submittedAt)),
      )
    )
      fail();
    if (
      db.certificates.some(
        (c) =>
          !db.placements.some(
            (p) => p.id === c.placementId && p.status === "Completed",
          ) ||
          !c.number ||
          !c.issueDate,
      )
    )
      fail();
  } catch (error) {
    if (error instanceof AppError) throw error;
    fail();
  }
}
