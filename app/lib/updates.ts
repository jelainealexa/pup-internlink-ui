import { Account, AccessCommand, AppError, Database, Mutation } from "./domain";
import type { CommandContext } from "./commands";
import {
  canReviewStudent,
  assert,
  uniqueEmail,
  dateRange,
  email,
  get,
  positive,
  required,
  requireRole,
  studentFor,
  companyFor,
  sumHours,
  validDate,
  invalidateRequests,
  revokeAccountAccess,
  eligibleCompany,
} from "./rules";

const companyAdmin = (db: Database, a: Account, companyId: string) =>
  a.role === "Coordinator" ||
  (a.role === "Company Supervisor" &&
    db.supervisors.some(
      (s) => s.accountId === a.id && s.companyId === companyId,
    ));
export function passwordPolicy(password: string, confirmation?: string) {
  assert(
    password.length >= 8 &&
      password.length <= 128 &&
      /[A-Za-z]/.test(password) &&
      /\d/.test(password),
    "VALIDATION",
    "Use 8–128 characters including a letter and a number.",
  );
  if (confirmation !== undefined)
    assert(
      password === confirmation,
      "VALIDATION",
      "Password confirmation does not match.",
    );
}
export function applyAccess(
  db: Database,
  command: AccessCommand,
  context: CommandContext,
): string {
  const now = context.now;
  if (command.type === "password.request") {
    const account = db.accounts.find((a) => a.email === email(command.email));
    assert(
      account?.active && account.activationState === "Active",
      "VALIDATION",
      "Password recovery requires an active, activated demonstration account.",
    );
    invalidateRequests(db, account.id, now);
    const id = context.id();
    db.accountRequests!.push({
      id,
      accountId: account.id,
      purpose: "Password Reset",
      createdAt: now,
      expiresAt: new Date(Date.parse(now) + 15 * 60000).toISOString(),
    });
    return id;
  }
  passwordPolicy(command.password, command.confirmPassword);
  const request = db.accountRequests?.find((r) => r.id === command.token);
  const purpose =
    command.type === "account.activate" ? "Activation" : "Password Reset";
  assert(
    request &&
      request.purpose === purpose &&
      !request.usedAt &&
      request.expiresAt > now,
    "VALIDATION",
    "This local link is invalid, expired or already used.",
  );
  const a = get(db.accounts, request.accountId);
  assert(
    a.email === email(command.email),
    "VALIDATION",
    "The registered email does not match this local request.",
  );
  if (command.type === "account.activate") {
    assert(
      !a.active && a.activationState === "Pending Activation",
      "FORBIDDEN",
      "Only a pending pre-registered account may be activated.",
    );
    assert(
      db.students.some(
        (s) =>
          s.accountId === a.id &&
          s.studentNumber.toLowerCase() ===
            command.studentNumber.trim().toLowerCase(),
      ),
      "VALIDATION",
      "Student number and registered email must match the invitation.",
    );
    a.active = true;
    a.activationState = "Active";
  } else
    assert(
      a.active && a.activationState === "Active",
      "FORBIDDEN",
      "Recovery cannot activate a pending or deactivated account.",
    );
  assert(
    context.newVerifier,
    "VALIDATION",
    "The new credential could not be processed.",
  );
  a.verifier = context.newVerifier;
  a.credentialVersion = (a.credentialVersion ?? 1) + 1;
  invalidateRequests(db, a.id, now);
  db.activities.unshift({
    id: context.id(),
    actorId: a.id,
    at: now,
    message:
      purpose === "Activation"
        ? "Pre-registered account activated locally"
        : "Local demonstration password reset",
    href: "/dashboard/settings",
  });
  return a.id;
}

export function applyUpdate(
  db: Database,
  actor: Account,
  command: Mutation,
  ctx: CommandContext,
): string {
  let result = "",
    message = "",
    href = "/dashboard";
  const today = ctx.now.slice(0, 10);
  const placement = (id: string) => {
    const p = get(db.placements, id);
    assert(
      p.status === "Ongoing",
      "CONFLICT",
      "Only an ongoing placement can be changed.",
    );
    return p;
  };
  const studentPlacement = (id: string) => {
    const p = placement(id);
    assert(
      actor.role === "Coordinator" ||
        (actor.role === "Student" && studentFor(db, p).accountId === actor.id),
      "FORBIDDEN",
      "Only this student may submit attendance or weekly reports.",
    );
    return p;
  };
  switch (command.type) {
    case "account.invite": {
      requireRole(actor, "Coordinator", "Faculty Adviser");
      const s = get(db.students, command.studentId),
        a = get(db.accounts, s.accountId);
      assert(
        canReviewStudent(db, actor, s.id),
        "FORBIDDEN",
        "This student is outside your assignment scope.",
      );
      assert(
        a.activationState === "Pending Activation" && !a.active,
        "CONFLICT",
        "Only a pending account can receive an activation invitation.",
      );
      invalidateRequests(db, a.id, ctx.now);
      result = ctx.id();
      db.accountRequests!.push({
        id: result,
        accountId: a.id,
        purpose: "Activation",
        createdBy: actor.id,
        createdAt: ctx.now,
        expiresAt: new Date(Date.parse(ctx.now) + 24 * 3600000).toISOString(),
      });
      message = "Local activation invitation generated; no email sent";
      href = `/dashboard/students/${s.id}`;
      break;
    }
    case "account.deactivate": {
      requireRole(actor, "Coordinator", "Faculty Adviser");
      const a = get(db.accounts, command.accountId),
        s = db.students.find((s) => s.accountId === a.id);
      assert(
        s && canReviewStudent(db, actor, s.id),
        "FORBIDDEN",
        "Only an authorized adviser or coordinator may deactivate this student.",
      );
      assert(
        a.activationState !== "Deactivated",
        "CONFLICT",
        "This student is already deactivated.",
      );
      a.active = false;
      a.activationState = "Deactivated";
      a.credentialVersion = (a.credentialVersion ?? 1) + 1;
      invalidateRequests(db, a.id, ctx.now);
      result = a.id;
      message = "Student account administratively deactivated";
      href = `/dashboard/students/${s.id}`;
      break;
    }
    case "account.credentials": {
      assert(
        ctx.currentVerifier === actor.verifier,
        "UNAUTHENTICATED",
        "The current password is incorrect.",
      );
      assert(
        command.newPassword !== undefined || command.email !== undefined,
        "VALIDATION",
        "Choose a credential change.",
      );
      if (command.newPassword !== undefined) {
        passwordPolicy(command.newPassword);
        assert(ctx.newVerifier, "VALIDATION", "Unable to process credential.");
        actor.verifier = ctx.newVerifier;
      }
      if (command.email !== undefined) {
        const value = email(command.email);
        uniqueEmail(db, value, actor.id);
        actor.email = value;
        db.students
          .filter((s) => s.accountId === actor.id)
          .forEach((s) => {
            s.email = value;
          });
      }
      actor.credentialVersion = (actor.credentialVersion ?? 1) + 1;
      invalidateRequests(db, actor.id, ctx.now);
      result = actor.id;
      message = "Local credentials changed; prior sessions revoked";
      href = "/dashboard/settings";
      break;
    }
    case "faculty.save": {
      requireRole(actor, "Coordinator");
      const f = command.id ? get(db.faculty, command.id) : undefined;
      const value = email(command.email);
      uniqueEmail(db, value, f?.accountId);
      const name = required(command.name, "Faculty name", 120);
      if (f) {
        const a = get(db.accounts, f.accountId);
        if (!command.active)
          assert(
            !db.placements.some(
              (p) => p.adviserId === f.id && p.status === "Ongoing",
            ) && !db.students.some((s) => s.adviserId === f.id),
            "CONFLICT",
            "Reassign current students and resolve ongoing placements before deactivating this adviser.",
          );
        if (a.active !== command.active || a.email.toLowerCase() !== value)
          revokeAccountAccess(db, a, ctx.now);
        Object.assign(a, {
          name,
          email: value,
          active: command.active,
          activationState: command.active ? "Active" : "Deactivated",
        });
        result = f.id;
      } else {
        const accountId = ctx.id();
        db.accounts.push({
          id: accountId,
          name,
          email: value,
          role: "Faculty Adviser",
          active: command.active,
          activationState: command.active ? "Active" : "Deactivated",
          credentialVersion: 1,
          verifier: ctx.verifier,
        });
        result = ctx.id();
        db.faculty.push({ id: result, accountId });
      }
      message = "Faculty account saved";
      href = `/dashboard/faculty/${result}`;
      break;
    }
    case "faculty.assign": {
      requireRole(actor, "Coordinator");
      const s = get(db.students, command.studentId),
        f = get(db.faculty, command.adviserId);
      assert(
        get(db.accounts, f.accountId).active,
        "VALIDATION",
        "Select an active faculty adviser.",
      );
      assert(
        !db.placements.some(
          (p) =>
            p.status === "Ongoing" &&
            studentFor(db, p).id === s.id &&
            p.adviserId !== f.id,
        ),
        "CONFLICT",
        "An ongoing placement fixes its adviser. Resolve it before reassigning the student.",
      );
      s.adviserId = f.id;
      result = s.id;
      message =
        "Student faculty assignment saved; historical placements preserved";
      href = `/dashboard/students/${s.id}`;
      break;
    }
    case "opportunity.assign": {
      const o = get(db.opportunities, command.id);
      assert(
        companyAdmin(db, actor, o.companyId),
        "FORBIDDEN",
        "Only the associated company administrator or coordinator may assign postings.",
      );
      assert(
        new Set(command.supervisorIds).size === command.supervisorIds.length,
        "VALIDATION",
        "Duplicate supervisor assignment.",
      );
      assert(
        command.supervisorIds.every((id) =>
          db.supervisors.some(
            (s) =>
              s.id === id &&
              s.companyId === o.companyId &&
              get(db.accounts, s.accountId).role === "Intern Supervisor" &&
              get(db.accounts, s.accountId).active,
          ),
        ),
        "VALIDATION",
        "Choose active Intern Supervisors from the same company.",
      );
      o.assignmentHistory ??= [];
      o.assignmentHistory.push({
        from: [...(o.supervisorIds ?? [])],
        to: [...command.supervisorIds],
        actorId: actor.id,
        at: ctx.now,
      });
      o.supervisorIds = [...command.supervisorIds];
      result = o.id;
      message = "Opportunity Intern Supervisor assignments saved";
      href = `/dashboard/internships/${o.id}`;
      break;
    }
    case "opportunity.decide": {
      const o = get(db.opportunities, command.id);
      assert(
        ["Company", "Coordinator"].includes(command.stage),
        "VALIDATION",
        "Choose a valid posting approval stage.",
      );
      assert(
        command.stage === "Company"
          ? actor.role === "Company Supervisor" &&
              companyAdmin(db, actor, o.companyId)
          : actor.role === "Coordinator",
        "FORBIDDEN",
        "This posting approval stage belongs to the associated company administrator or OJT Coordinator.",
      );
      assert(
        ["Approved", "Rejected"].includes(command.decision),
        "VALIDATION",
        "Choose approval or rejection.",
      );
      assert(
        command.stage === "Company"
          ? ["Pending Approval - Company", "Rejected", "Deactivated"].includes(
              o.status,
            )
          : o.status === "Pending Approval - Coordinator",
        "CONFLICT",
        "Posting is not awaiting this approval stage. Company approval must precede coordinator approval.",
      );
      const remarks =
        command.decision === "Rejected"
          ? required(command.remarks, "Rejection remarks", 2000)
          : command.remarks.trim();
      o.decisions ??= [];
      o.decisions.push({
        stage: command.stage,
        outcome: command.decision,
        actorId: actor.id,
        at: ctx.now,
        remarks,
      });
      o.status =
        command.decision === "Rejected"
          ? "Rejected"
          : command.stage === "Company"
            ? "Pending Approval - Coordinator"
            : "Approved";
      result = o.id;
      message = `${command.stage} posting decision recorded`;
      href = `/dashboard/internships/${o.id}`;
      break;
    }
    case "opportunity.activate": {
      const o = get(db.opportunities, command.id);
      assert(
        companyAdmin(db, actor, o.companyId),
        "FORBIDDEN",
        "Only the company administrator or coordinator may activate or deactivate this posting.",
      );
      const cycle = (o.decisions ?? []).slice(
        (o.decisions ?? []).findLastIndex((d) => d.outcome === "Edited") + 1,
      );
      assert(
        o.legacyApproval ||
          (cycle.some(
            (d) => d.stage === "Company" && d.outcome === "Approved",
          ) &&
            cycle.some(
              (d) => d.stage === "Coordinator" && d.outcome === "Approved",
            )),
        "CONFLICT",
        "Both approval stages are required before activation.",
      );
      assert(
        command.active
          ? ["Approved", "Deactivated"].includes(o.status)
          : ["Active", "Approved", "Filled"].includes(o.status),
        "CONFLICT",
        "This posting cannot make the requested activation transition.",
      );
      if (command.active) {
        assert(
          eligibleCompany(db, o.companyId, today),
          "CONFLICT",
          "A current approved MOA is required before activating this posting.",
        );
        assert(
          o.supervisorIds?.some((id) =>
            db.supervisors.some(
              (s) => s.id === id && get(db.accounts, s.accountId).active,
            ),
          ),
          "CONFLICT",
          "Assign an active Intern Supervisor before activating the posting.",
        );
      }
      o.status = command.active ? "Active" : "Deactivated";
      o.decisions ??= [];
      o.decisions.push({
        stage: actor.role === "Coordinator" ? "Coordinator" : "Company",
        outcome: command.active ? "Activated" : "Deactivated",
        actorId: actor.id,
        at: ctx.now,
        remarks: "Historical applications and placements retained.",
      });
      result = o.id;
      message = "Posting activation state updated";
      href = `/dashboard/internships/${o.id}`;
      break;
    }
    case "placement.supervisor.assign": {
      const p = placement(command.id),
        s = get(db.supervisors, command.supervisorId);
      assert(
        companyAdmin(db, actor, companyFor(db, p).id),
        "FORBIDDEN",
        "This placement belongs to another company.",
      );
      const a = get(db.accounts, s.accountId),
        o = get(
          db.opportunities,
          get(db.applications, p.applicationId).opportunityId,
        );
      assert(
        s.companyId === o.companyId &&
          a.active &&
          a.role === "Intern Supervisor" &&
          o.supervisorIds?.includes(s.id),
        "VALIDATION",
        "Select an active assigned Intern Supervisor from this company.",
      );
      const old = get(db.supervisors, p.supervisorId),
        obligation = db.evaluations.find(
          (e) => e.placementId === p.id && e.evaluatorId === old.accountId,
        )!;
      assert(
        obligation.status === "Pending",
        "CONFLICT",
        "A submitted company evaluation freezes the supervisor assignment until the placement closes.",
      );
      p.assignmentHistory ??= [];
      p.assignmentHistory.push({
        from: p.supervisorId,
        to: s.id,
        actorId: actor.id,
        at: ctx.now,
      });
      p.supervisorId = s.id;
      obligation.evaluatorId = a.id;
      result = p.id;
      message =
        "Intern reassigned; pending obligation transferred without adding an evaluation";
      href = `/dashboard/placements/${p.id}`;
      break;
    }
    case "attendance.create": {
      const p = studentPlacement(command.placementId);
      validDate(command.date);
      positive(command.hours, "Attendance hours", 12);
      assert(
        command.date >= p.startDate &&
          command.date <= p.endDate &&
          command.date <= today,
        "VALIDATION",
        "Attendance date must be within the placement and not in the future.",
      );
      assert(
        !db.attendance!.some(
          (a) => a.placementId === p.id && a.date === command.date,
        ) &&
          !db.reports.some(
            (r) =>
              r.kind !== "Weekly" &&
              r.placementId === p.id &&
              r.workDate === command.date,
          ),
        "CONFLICT",
        "Attendance or a legacy daily report already records this work date.",
      );
      result = ctx.id();
      db.attendance!.push({
        id: result,
        placementId: p.id,
        date: command.date,
        hours: command.hours,
        activity: required(command.activity, "Attendance activities", 2000),
        createdAt: ctx.now,
      });
      message = "Daily attendance recorded; hours await weekly approval";
      href = `/dashboard/attendance?placement=${p.id}`;
      break;
    }
    case "report.weekly": {
      const p = studentPlacement(command.placementId);
      dateRange(command.fromDate, command.toDate);
      assert(
        command.fromDate >= p.startDate &&
          command.toDate <= p.endDate &&
          command.toDate <= today &&
          Date.parse(command.toDate) - Date.parse(command.fromDate) <=
            6 * 86400000,
        "VALIDATION",
        "Weekly period must span 1–7 days within the placement and not extend into the future.",
      );
      const previous = db.reports.filter(
        (r) =>
          r.kind === "Weekly" &&
          r.placementId === p.id &&
          r.workDate === command.fromDate &&
          r.periodEnd === command.toDate,
      );
      assert(
        !previous.some((r) => r.status !== "Rejected"),
        "CONFLICT",
        "This weekly period already has a pending or approved report.",
      );
      assert(
        command.attendanceIds.length > 0 &&
          new Set(command.attendanceIds).size === command.attendanceIds.length,
        "VALIDATION",
        "Select unique daily attendance records.",
      );
      const entries = command.attendanceIds.map((id) =>
        get(db.attendance!, id),
      );
      assert(
        entries.every(
          (a) =>
            a.placementId === p.id &&
            a.date >= command.fromDate &&
            a.date <= command.toDate &&
            (!a.reportId || get(db.reports, a.reportId).status === "Rejected"),
        ),
        "CONFLICT",
        "Attendance must belong to this placement/period and cannot be reused from pending or approved reports.",
      );
      result = ctx.id();
      entries.forEach((a) => {
        a.reportId = result;
      });
      db.reports.push({
        id: result,
        placementId: p.id,
        kind: "Weekly",
        workDate: command.fromDate,
        periodEnd: command.toDate,
        attendanceIds: entries.map((a) => a.id),
        hours: sumHours(entries.map((a) => a.hours)),
        tasks: required(command.tasks, "Weekly tasks", 4000),
        submittedAt: ctx.now,
        status: "Pending",
        remarks: "",
        attempt: previous.length + 1,
        history: [
          {
            status: "Pending",
            actorId: actor.id,
            at: ctx.now,
            remarks: "Weekly attendance submitted",
          },
        ],
        facultyRemarks: [],
      });
      message =
        "Weekly report stored with linked attendance; no duplicate hours counted";
      href = `/dashboard/progress/reports/${result}`;
      break;
    }
    case "report.decide": {
      requireRole(actor, "Intern Supervisor");
      const r = get(db.reports, command.id),
        p = placement(r.placementId);
      assert(
        get(db.supervisors, p.supervisorId).accountId === actor.id,
        "FORBIDDEN",
        "Only this intern's assigned Intern Supervisor may decide progress.",
      );
      assert(
        ["Pending", "Pending Review"].includes(r.status),
        "CONFLICT",
        "This report already has a final decision.",
      );
      assert(
        ["Approved", "Rejected"].includes(command.decision),
        "VALIDATION",
        "Choose approval or rejection.",
      );
      const remarks = required(command.remarks, "Supervisor remarks", 2000);
      r.status = command.decision;
      r.remarks = remarks;
      r.reviewerId = actor.id;
      r.reviewedAt = ctx.now;
      r.history ??= [];
      r.history.push({
        status: r.status,
        actorId: actor.id,
        at: ctx.now,
        remarks,
      });
      result = r.id;
      message =
        "Supervisor report decision saved; approved totals recalculated";
      href = `/dashboard/progress/reports/${r.id}`;
      break;
    }
    case "report.monitor": {
      requireRole(actor, "Faculty Adviser");
      const r = get(db.reports, command.id),
        p = get(db.placements, r.placementId);
      assert(
        get(db.faculty, p.adviserId).accountId === actor.id,
        "FORBIDDEN",
        "Only the assigned placement adviser may add monitoring remarks.",
      );
      r.facultyRemarks ??= [];
      r.facultyRemarks.push({
        id: ctx.id(),
        actorId: actor.id,
        at: ctx.now,
        text: required(command.remarks, "Faculty monitoring remarks", 2000),
      });
      result = r.id;
      message = "Faculty monitoring remark saved; approved hours unchanged";
      href = `/dashboard/progress/reports/${r.id}`;
      break;
    }
    default:
      throw new AppError(
        "VALIDATION",
        "Unsupported demonstration operation. No records were changed.",
      );
  }
  db.activities.unshift({
    id: ctx.id(),
    actorId: actor.id,
    at: ctx.now,
    message,
    href,
  });
  db.activities = db.activities.slice(0, 300);
  return result;
}
