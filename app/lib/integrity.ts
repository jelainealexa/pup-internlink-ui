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
            "Intern Supervisor",
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
    for (const profiles of [db.students, db.faculty, db.supervisors]) {
      if (new Set(profiles.map((p) => p.accountId)).size !== profiles.length)
        fail();
    }
    if (
      db.receipts.some(
        (r) =>
          !r ||
          typeof r.key !== "string" ||
          !r.key ||
          !account(r.actorId) ||
          typeof r.result !== "string" ||
          !r.result ||
          (r.commandFingerprint !== undefined &&
            !/^[a-f0-9]{64}$/.test(r.commandFingerprint)),
      )
    )
      fail();
    if (
      !db.preferences ||
      typeof db.preferences !== "object" ||
      Array.isArray(db.preferences)
    )
      fail();
    for (const [accountId, pref] of Object.entries(db.preferences)) {
      if (
        !account(accountId) ||
        !pref ||
        typeof pref.academicYear !== "string" ||
        typeof pref.landingPage !== "string" ||
        !["Comfortable", "Compact"].includes(pref.density) ||
        [
          pref.requirementAlerts,
          pref.evaluationAlerts,
          pref.progressAlerts,
          pref.partnershipAlerts,
          pref.largerText,
          pref.reduceMotion,
        ].some((value) => typeof value !== "boolean")
      )
        fail();
    }
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
          !db.accounts.some(
            (a) =>
              a.id === s.accountId &&
              ["Company Supervisor", "Intern Supervisor"].includes(a.role),
          ) || !db.companies.some((c) => c.id === s.companyId),
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
          ![
            "Approved",
            "Pending Approval",
            "Closed",
            "Pending Approval - Company",
            "Pending Approval - Coordinator",
            "Active",
            "Filled",
            "Deactivated",
            "Rejected",
          ].includes(o.status),
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
          ![
            "Pending Review",
            "Reviewed",
            "Pending",
            "Approved",
            "Rejected",
          ].includes(r.status) ||
          (r.kind !== "Weekly" && r.hours > 12),
      )
    )
      fail();
    if (
      new Set(
        db.reports
          .filter((r) => r.kind !== "Weekly" && r.status !== "Rejected")
          .map((r) => `${r.placementId}:${r.workDate}`),
      ).size !==
      db.reports.filter((r) => r.kind !== "Weekly" && r.status !== "Rejected")
        .length
    )
      fail();
    if (db.schemaVersion === 2) {
      if (!Array.isArray(db.attendance) || !Array.isArray(db.accountRequests))
        fail();
      if (
        db.accounts.some(
          (a) =>
            !["Active", "Pending Activation", "Deactivated"].includes(
              a.activationState ?? "",
            ) ||
            (a.activationState === "Active") !== a.active ||
            !Number.isInteger(a.credentialVersion) ||
            a.credentialVersion! < 1,
        )
      )
        fail();
      if (
        db.students.some(
          (s) => s.adviserId && !db.faculty.some((f) => f.id === s.adviserId),
        )
      )
        fail();
      if (
        db.requirements.some(
          (r) =>
            ![
              "Before Internship",
              "During Internship",
              "After Internship",
            ].includes(r.phase ?? ""),
        )
      )
        fail();
      for (const o of db.opportunities) {
        if (
          !Array.isArray(o.supervisorIds) ||
          new Set(o.supervisorIds).size !== o.supervisorIds.length ||
          o.supervisorIds.some(
            (id) =>
              !db.supervisors.some(
                (s) =>
                  s.id === id &&
                  s.companyId === o.companyId &&
                  account(s.accountId, "Intern Supervisor"),
              ),
          )
        )
          fail();
        if (
          o.requiredHours !== undefined &&
          (!Number.isFinite(o.requiredHours) ||
            o.requiredHours <= 0 ||
            o.requiredHours > 10000)
        )
          fail();
      }
      const attendance = db.attendance!;
      if (
        new Set(attendance.map((a) => a.id)).size !== attendance.length ||
        new Set(attendance.map((a) => `${a.placementId}:${a.date}`)).size !==
          attendance.length
      )
        fail();
      if (
        attendance.some(
          (a) =>
            !a.id ||
            !Number.isFinite(a.hours) ||
            a.hours <= 0 ||
            a.hours > 12 ||
            !db.placements.some(
              (p) =>
                p.id === a.placementId &&
                a.date >= p.startDate &&
                a.date <= p.endDate,
            ) ||
            db.reports.some(
              (r) =>
                r.kind !== "Weekly" &&
                r.placementId === a.placementId &&
                r.workDate === a.date,
            ) ||
            (a.reportId &&
              !db.reports.some(
                (r) => r.id === a.reportId && r.attendanceIds?.includes(a.id),
              )),
        )
      )
        fail();
      for (const r of db.reports.filter((r) => r.kind === "Weekly")) {
        if (
          !r.periodEnd ||
          r.periodEnd < r.workDate ||
          !r.attendanceIds?.length ||
          new Set(r.attendanceIds).size !== r.attendanceIds.length ||
          r.attendanceIds.some(
            (id) =>
              !attendance.some(
                (a) =>
                  a.id === id &&
                  a.placementId === r.placementId &&
                  a.date >= r.workDate &&
                  a.date <= r.periodEnd!,
              ),
          ) ||
          Math.abs(
            r.hours -
              r.attendanceIds.reduce(
                (sum, id) => sum + attendance.find((a) => a.id === id)!.hours,
                0,
              ),
          ) > 0.0000001
        )
          fail();
      }
      const approvedAttendance = db.reports
        .filter((r) => r.kind === "Weekly" && r.status === "Approved")
        .flatMap((r) => r.attendanceIds ?? []);
      if (new Set(approvedAttendance).size !== approvedAttendance.length)
        fail();
      if (
        db.accountRequests!.some(
          (r) =>
            !r ||
            !r.id ||
            !account(r.accountId) ||
            !["Activation", "Password Reset"].includes(r.purpose) ||
            !Number.isFinite(Date.parse(r.expiresAt)),
        )
      )
        fail();
    }
    if (
      db.evaluations.some(
        (e) =>
          !db.placements.some((p) => p.id === e.placementId) ||
          !account(e.evaluatorId) ||
          !["Pending", "Submitted"].includes(e.status) ||
          (e.status === "Submitted" &&
            (typeof e.grade !== "number" ||
              !Number.isFinite(e.grade) ||
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
