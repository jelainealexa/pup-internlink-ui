import {
  Account,
  AppError,
  Command,
  Database,
  Placement,
  Role,
} from "./domain";
import {
  allocated,
  applicationFor,
  available,
  canReviewStudent,
  canSeePlacement,
  companyFor,
  completionProblems,
  dateRange,
  email,
  get,
  latestSubmission,
  missingRequirements,
  nameOf,
  positive,
  remainingSlots,
  required,
  requireRole,
  studentFor,
  validDate,
  validAcademicYear,
  validatePhone,
} from "./rules";

export interface CommandContext {
  now: string;
  id: () => string;
  verifier: string;
}
function assert(
  condition: unknown,
  code: "VALIDATION" | "FORBIDDEN" | "CONFLICT",
  message: string,
): asserts condition {
  if (!condition) throw new AppError(code, message);
}
function uniqueEmail(db: Database, value: string, except?: string) {
  assert(
    !db.accounts.some(
      (a) => a.id !== except && a.email.toLowerCase() === value,
    ),
    "CONFLICT",
    "This email address already belongs to another demonstration account.",
  );
}
function activeProfile(db: Database, accountId: string, role: Role) {
  const a = get(db.accounts, accountId);
  assert(
    a.active && a.role === role,
    "VALIDATION",
    `Select an active registered ${role.toLowerCase()}.`,
  );
}
function ownStudent(db: Database, actor: Account, studentId: string) {
  const s = get(db.students, studentId);
  assert(
    actor.role === "Coordinator" ||
      (actor.role === "Student" && s.accountId === actor.id),
    "FORBIDDEN",
    "You may only submit records for your own student profile.",
  );
  activeProfile(db, s.accountId, "Student");
  return s;
}
function ongoing(p: Placement) {
  assert(
    p.status === "Ongoing",
    "CONFLICT",
    "Only ongoing placements can receive this change.",
  );
}
export function applyCommand(
  db: Database,
  actorId: string,
  command: Command,
  context: CommandContext,
): string {
  const actor = get(db.accounts, actorId);
  assert(actor.active, "FORBIDDEN", "This account is inactive.");
  const id = () => context.id();
  const coordinator = () => requireRole(actor, "Coordinator");
  const today = context.now.slice(0, 10);
  let result = "";
  let message = "";
  let href = "/dashboard";
  switch (command.type) {
    case "student.save": {
      coordinator();
      const input = command.input;
      const existing = command.id ? get(db.students, command.id) : undefined;
      const studentNumber = required(
        input.studentNumber,
        "Student identifier",
        50,
      );
      const firstName = required(input.firstName, "First name", 80),
        lastName = required(input.lastName, "Last name", 80);
      const contact = email(input.email);
      uniqueEmail(db, contact, existing?.accountId);
      assert(
        !db.students.some(
          (s) =>
            s.id !== existing?.id &&
            s.studentNumber.toLowerCase() === studentNumber.toLowerCase(),
        ),
        "CONFLICT",
        "This student identifier already exists.",
      );
      const data = {
        studentNumber,
        firstName,
        lastName,
        email: contact,
        program: required(input.program, "Program", 120),
        yearLevel: required(input.yearLevel, "Year level", 40),
        section: required(input.section, "Section", 40),
        academicYear: validAcademicYear(input.academicYear),
      };
      if (existing) {
        Object.assign(existing, data);
        Object.assign(get(db.accounts, existing.accountId), {
          name: nameOf(existing),
          email: contact,
        });
        result = existing.id;
      } else {
        const accountId = id();
        result = id();
        db.accounts.push({
          id: accountId,
          name: `${firstName} ${lastName}`,
          email: contact,
          role: "Student",
          active: true,
          verifier: context.verifier,
        });
        db.students.push({ id: result, accountId, ...data });
      }
      message = "Student record saved";
      href = `/dashboard/students/${result}`;
      break;
    }
    case "company.save": {
      coordinator();
      const input = command.input;
      const existing = command.id ? get(db.companies, command.id) : undefined;
      const name = required(input.name, "Company name", 120),
        contact = email(input.email);
      assert(
        !db.companies.some(
          (c) =>
            c.id !== existing?.id &&
            c.name.toLowerCase() === name.toLowerCase(),
        ),
        "CONFLICT",
        "This company name already exists.",
      );
      assert(
        !db.companies.some(
          (c) => c.id !== existing?.id && c.email.toLowerCase() === contact,
        ),
        "CONFLICT",
        "This company contact email already exists.",
      );
      const phone = validatePhone(input.phone);
      dateRange(input.moaStart, input.moaEnd);
      const data = {
        ...input,
        name,
        email: contact,
        phone,
        industry: required(input.industry, "Industry", 100),
        address: required(input.address, "Address", 300),
        contactPerson: required(input.contactPerson, "Contact person", 120),
        academicYear: validAcademicYear(input.academicYear),
        approved: Boolean(input.approved),
      };
      result = existing?.id ?? id();
      if (existing) Object.assign(existing, data);
      else db.companies.push({ id: result, ...data });
      message = "Industry partner saved";
      href = `/dashboard/partners/${result}`;
      break;
    }
    case "supervisor.save": {
      coordinator();
      const input = command.input;
      get(db.companies, input.companyId);
      const existing = command.id ? get(db.supervisors, command.id) : undefined;
      assert(
        !existing || existing.companyId === input.companyId,
        "VALIDATION",
        "A supervisor cannot be transferred to another company through this form.",
      );
      const name = required(input.name, "Supervisor name", 120),
        contact = email(input.email);
      uniqueEmail(db, contact, existing?.accountId);
      const phone = validatePhone(input.phone);
      const accountId = existing?.accountId ?? id();
      if (existing) {
        Object.assign(get(db.accounts, accountId), {
          name,
          email: contact,
          active: input.active,
        });
        existing.phone = phone;
      } else {
        db.accounts.push({
          id: accountId,
          name,
          email: contact,
          active: input.active,
          role: "Company Supervisor",
          verifier: context.verifier,
        });
      }
      result = existing?.id ?? id();
      if (!existing)
        db.supervisors.push({
          id: result,
          accountId,
          companyId: input.companyId,
          phone,
        });
      message = "Company supervisor saved";
      href = `/dashboard/partners/${input.companyId}/supervisors/${result}`;
      break;
    }
    case "requirement.save": {
      coordinator();
      const existing = command.id
        ? get(db.requirements, command.id)
        : undefined;
      const name = required(command.input.name, "Requirement name", 120);
      assert(
        !db.requirements.some(
          (r) =>
            r.id !== existing?.id &&
            r.name.toLowerCase() === name.toLowerCase(),
        ),
        "CONFLICT",
        "This requirement name already exists.",
      );
      assert(
        ["Mandatory", "Optional"].includes(command.input.classification),
        "VALIDATION",
        "Select Mandatory or Optional.",
      );
      const data = {
        ...command.input,
        name,
        description: required(command.input.description, "Description", 2000),
      };
      result = existing?.id ?? id();
      if (existing) Object.assign(existing, data);
      else db.requirements.push({ id: result, ...data });
      message = "Requirement definition saved";
      href = "/dashboard/requirements";
      break;
    }
    case "submission.create": {
      requireRole(actor, "Student", "Coordinator");
      ownStudent(db, actor, command.studentId);
      get(db.requirements, command.requirementId);
      const last = latestSubmission(
        db,
        command.studentId,
        command.requirementId,
      );
      assert(
        !last || last.status === "Rejected",
        "CONFLICT",
        "Only missing or rejected requirements can receive a new submission. Existing attempts are retained.",
      );
      const f = command.file;
      assert(
        f.blob instanceof Blob &&
          f.size === f.blob.size &&
          f.size > 0 &&
          f.size <= 5 * 1024 * 1024,
        "VALIDATION",
        "Select a nonempty file no larger than 5 MB.",
      );
      assert(
        ["text/plain", "application/pdf", "image/png", "image/jpeg"].includes(
          f.mime,
        ),
        "VALIDATION",
        "Supported demonstration files: TXT, PDF, PNG or JPEG.",
      );
      const fileId = id();
      db.files.push({
        ...f,
        name: required(f.name.replace(/[\\/]/g, "_"), "Filename", 180),
        id: fileId,
      });
      result = id();
      db.submissions.push({
        id: result,
        studentId: command.studentId,
        requirementId: command.requirementId,
        fileId,
        attempt: (last?.attempt ?? 0) + 1,
        submittedAt: context.now,
        status: "Pending",
      });
      message = "Requirement document stored locally and submitted";
      href = `/dashboard/requirements/submissions/${result}`;
      break;
    }
    case "submission.review": {
      requireRole(actor, "Coordinator", "Faculty Adviser");
      const s = get(db.submissions, command.id);
      assert(
        canReviewStudent(db, actor, s.studentId),
        "FORBIDDEN",
        "You are not assigned to review this student's requirements.",
      );
      assert(
        latestSubmission(db, s.studentId, s.requirementId)?.id === s.id &&
          s.status === "Pending",
        "CONFLICT",
        "Only the latest pending submission can be reviewed.",
      );
      assert(
        ["Approved", "Rejected"].includes(command.decision),
        "VALIDATION",
        "Select an approval or rejection decision.",
      );
      const reason =
        command.decision === "Rejected"
          ? required(command.reason, "Rejection reason", 2000)
          : command.reason.trim();
      Object.assign(s, {
        status: command.decision,
        reason,
        reviewerId: actor.id,
        reviewedAt: context.now,
      });
      result = s.id;
      message = `Requirement submission ${command.decision.toLowerCase()}`;
      href = `/dashboard/requirements/submissions/${s.id}`;
      break;
    }
    case "opportunity.save": {
      coordinator();
      const existing = command.id
        ? get(db.opportunities, command.id)
        : undefined;
      const input = command.input;
      get(db.companies, input.companyId);
      assert(
        !existing ||
          existing.companyId === input.companyId ||
          !db.applications.some((a) => a.opportunityId === existing.id),
        "CONFLICT",
        "An opportunity with applications cannot change its company.",
      );
      const capacity = positive(input.capacity, "Capacity", 10000, true);
      assert(
        !existing || capacity >= allocated(db, existing.id),
        "CONFLICT",
        "Capacity cannot be less than existing non-terminated placements.",
      );
      const data = {
        ...input,
        capacity,
        title: required(input.title, "Position title", 150),
        description: required(input.description, "Description", 4000),
        academicYear: validAcademicYear(input.academicYear),
      };
      result = existing?.id ?? id();
      if (existing) Object.assign(existing, data);
      else
        db.opportunities.push({
          id: result,
          ...data,
          status: "Pending Approval",
        });
      message = "Opportunity saved";
      href = `/dashboard/internships/${result}`;
      break;
    }
    case "opportunity.status": {
      coordinator();
      const o = get(db.opportunities, command.id);
      assert(
        ["Approved", "Closed"].includes(command.status),
        "VALIDATION",
        "Choose Approve/reopen or Close.",
      );
      assert(
        o.status !== command.status,
        "CONFLICT",
        "This opportunity already has the selected status.",
      );
      Object.assign(o, { status: command.status });
      result = o.id;
      message = `Opportunity ${command.status.toLowerCase()}`;
      href = `/dashboard/internships/${o.id}`;
      break;
    }
    case "application.create": {
      requireRole(actor, "Coordinator", "Student");
      ownStudent(db, actor, command.studentId);
      const o = get(db.opportunities, command.opportunityId);
      assert(
        available(db, o.id, today),
        "CONFLICT",
        "This opportunity is unavailable: check approval, MOA eligibility and remaining capacity.",
      );
      assert(
        !db.applications.some(
          (a) => a.studentId === command.studentId && a.opportunityId === o.id,
        ),
        "CONFLICT",
        "An application for this student and opportunity already exists. Its history is retained.",
      );
      result = id();
      db.applications.push({
        id: result,
        studentId: command.studentId,
        opportunityId: o.id,
        status: "Pending",
        submittedAt: context.now,
        history: [{ status: "Pending", at: context.now, actorId: actor.id }],
        academicYear: o.academicYear,
      });
      message = "Internship application submitted";
      href = `/dashboard/applications/${result}`;
      break;
    }
    case "application.decide": {
      coordinator();
      const a = get(db.applications, command.id);
      assert(
        a.status === "Pending",
        "CONFLICT",
        "This application has already been decided.",
      );
      assert(
        ["Accepted", "Rejected"].includes(command.decision),
        "VALIDATION",
        "Choose Accept or Reject.",
      );
      const reason =
        command.decision === "Rejected"
          ? required(command.reason, "Rejection reason", 2000)
          : "";
      if (command.decision === "Accepted") {
        activeProfile(db, get(db.students, a.studentId).accountId, "Student");
        assert(
          !missingRequirements(db, a.studentId).length,
          "VALIDATION",
          "All current mandatory requirements must be approved under the demonstration policy.",
        );
        assert(
          available(db, a.opportunityId, today),
          "CONFLICT",
          "The opportunity has no available capacity or its partnership/posting is unavailable.",
        );
      }
      a.status = command.decision;
      a.history.push({
        status: command.decision,
        reason,
        actorId: actor.id,
        at: context.now,
      });
      result = a.id;
      message = `Application ${command.decision.toLowerCase()}`;
      href = `/dashboard/applications/${a.id}`;
      break;
    }
    case "placement.create": {
      coordinator();
      const input = command.input;
      const a = get(db.applications, input.applicationId),
        o = get(db.opportunities, a.opportunityId);
      assert(
        a.status === "Accepted",
        "VALIDATION",
        "A placement requires an accepted application.",
      );
      activeProfile(db, get(db.students, a.studentId).accountId, "Student");
      assert(
        !db.placements.some((p) => p.applicationId === a.id),
        "CONFLICT",
        "A placement already exists for this application.",
      );
      assert(
        !db.placements.some(
          (p) =>
            p.status === "Ongoing" &&
            applicationFor(db, p).studentId === a.studentId,
        ),
        "CONFLICT",
        "This student already has an ongoing placement.",
      );
      assert(
        available(db, o.id, today),
        "CONFLICT",
        "No available capacity or eligible partnership/posting remains.",
      );
      assert(
        !missingRequirements(db, a.studentId).length,
        "VALIDATION",
        "All mandatory requirements must be approved before placement.",
      );
      dateRange(input.startDate, input.endDate);
      positive(input.requiredHours, "Required hours");
      const adviser = get(db.faculty, input.adviserId),
        supervisor = get(db.supervisors, input.supervisorId);
      activeProfile(db, adviser.accountId, "Faculty Adviser");
      activeProfile(db, supervisor.accountId, "Company Supervisor");
      assert(
        supervisor.companyId === o.companyId,
        "VALIDATION",
        "Select a supervisor who belongs to this opportunity's company.",
      );
      result = id();
      const p: Placement = {
        id: result,
        ...input,
        requiredRequirementIds: db.requirements
          .filter((r) => r.classification === "Mandatory")
          .map((r) => r.id),
        status: "Ongoing",
        approvedBy: actor.id,
        createdAt: context.now,
        academicYear: a.academicYear,
      };
      db.placements.push(p);
      for (const evaluatorId of [adviser.accountId, supervisor.accountId])
        db.evaluations.push({
          id: id(),
          placementId: p.id,
          evaluatorId,
          status: "Pending",
        });
      message = "Placement and its two evaluation obligations created";
      href = `/dashboard/placements/${result}`;
      break;
    }
    case "placement.terminate": {
      coordinator();
      const p = get(db.placements, command.id);
      ongoing(p);
      p.terminationReason = required(
        command.reason,
        "Termination reason",
        2000,
      );
      p.status = "Terminated";
      result = p.id;
      message = "Placement terminated; capacity released; history retained";
      href = `/dashboard/placements/${result}`;
      break;
    }
    case "placement.complete": {
      coordinator();
      const p = get(db.placements, command.id);
      ongoing(p);
      const problems = completionProblems(db, p.id);
      assert(!problems.length, "VALIDATION", problems.join(" "));
      p.status = "Completed";
      p.completedAt = context.now;
      result = p.id;
      message = "Placement marked complete under demonstration policy";
      href = `/dashboard/placements/${result}`;
      break;
    }
    case "report.create": {
      requireRole(actor, "Student", "Coordinator");
      const p = get(db.placements, command.placementId);
      ongoing(p);
      ownStudent(db, actor, studentFor(db, p).id);
      validDate(command.workDate);
      assert(
        command.workDate >= p.startDate &&
          command.workDate <= p.endDate &&
          command.workDate <= today,
        "VALIDATION",
        "Work date must be within the placement dates and cannot be in the future.",
      );
      positive(command.hours, "Report hours", 12);
      assert(
        !db.reports.some(
          (r) => r.placementId === p.id && r.workDate === command.workDate,
        ),
        "CONFLICT",
        "One daily report already exists for this placement and work date.",
      );
      result = id();
      db.reports.push({
        id: result,
        placementId: p.id,
        workDate: command.workDate,
        hours: command.hours,
        tasks: required(command.tasks, "Tasks", 4000),
        submittedAt: context.now,
        status: "Pending Review",
        remarks: "",
      });
      message = "Progress report submitted for review";
      href = `/dashboard/progress/reports/${result}`;
      break;
    }
    case "report.review": {
      requireRole(
        actor,
        "Coordinator",
        "Faculty Adviser",
        "Company Supervisor",
      );
      const r = get(db.reports, command.id),
        p = get(db.placements, r.placementId);
      ongoing(p);
      assert(
        canSeePlacement(db, actor, p),
        "FORBIDDEN",
        "You are not assigned to this placement.",
      );
      assert(
        r.status === "Pending Review",
        "CONFLICT",
        "This report has already been reviewed.",
      );
      Object.assign(r, {
        status: "Reviewed",
        remarks: required(command.remarks, "Reviewer remarks", 2000),
        reviewerId: actor.id,
        reviewedAt: context.now,
      });
      result = r.id;
      message = "Progress review saved; official reviewed hours updated";
      href = `/dashboard/progress/reports/${result}`;
      break;
    }
    case "evaluation.submit": {
      requireRole(actor, "Faculty Adviser", "Company Supervisor");
      const e = get(db.evaluations, command.id),
        p = get(db.placements, e.placementId);
      ongoing(p);
      assert(
        e.evaluatorId === actor.id && canSeePlacement(db, actor, p),
        "FORBIDDEN",
        "Only the assigned evaluator can submit this obligation.",
      );
      assert(
        e.status === "Pending",
        "CONFLICT",
        "This evaluation has already been submitted.",
      );
      assert(
        Number.isFinite(command.grade) &&
          command.grade >= 0 &&
          command.grade <= 100,
        "VALIDATION",
        "The demonstration score must be between 0 and 100.",
      );
      assert(
        db.evaluations.filter((x) => x.placementId === p.id).length === 2,
        "CONFLICT",
        "This placement must have exactly two assigned evaluation obligations.",
      );
      Object.assign(e, {
        status: "Submitted",
        grade: command.grade,
        comments: required(command.comments, "Evaluation comments", 4000),
        submittedAt: context.now,
      });
      result = e.id;
      message = "Assigned evaluation submitted";
      href = `/dashboard/evaluations/${result}`;
      break;
    }
    case "certificate.record": {
      coordinator();
      const p = get(db.placements, command.placementId);
      assert(
        p.status === "Completed" && !completionProblems(db, p.id).length,
        "VALIDATION",
        "A certificate record requires a completed eligible placement.",
      );
      assert(
        !db.certificates.some((c) => c.placementId === p.id),
        "CONFLICT",
        "This placement already has certificate information.",
      );
      const number = required(
        command.number,
        "Demonstration certificate number",
        100,
      );
      validDate(command.issueDate);
      assert(
        command.issueDate <= today &&
          command.issueDate >= (p.completedAt?.slice(0, 10) ?? p.startDate),
        "VALIDATION",
        "Issue date must be between completion and today.",
      );
      assert(
        !db.certificates.some(
          (c) => c.number.toLowerCase() === number.toLowerCase(),
        ),
        "CONFLICT",
        "This certificate number already exists.",
      );
      result = id();
      db.certificates.push({
        id: result,
        placementId: p.id,
        number,
        issueDate: command.issueDate,
        recordedBy: actor.id,
      });
      message =
        "Demonstration certificate information recorded (not an official issuance)";
      href = `/dashboard/placements/${p.id}`;
      break;
    }
    case "preferences.save": {
      const input = command.input;
      assert(
        !!validAcademicYear(input.academicYear),
        "VALIDATION",
        "Choose a valid academic year.",
      );
      assert(
        [
          "/dashboard",
          "/dashboard/students",
          "/dashboard/applications",
          "/dashboard/progress",
        ].includes(input.landingPage),
        "VALIDATION",
        "Choose an available landing page.",
      );
      assert(
        input.density === "Comfortable" || input.density === "Compact",
        "VALIDATION",
        "Choose a supported table density.",
      );
      if (actor.role !== "Coordinator")
        assert(
          input.landingPage === "/dashboard",
          "VALIDATION",
          "Role dashboards are the landing page for complementary portals.",
        );
      db.preferences[actor.id] = { ...input };
      result = actor.id;
      message = "Personal browser-local preferences saved";
      href = "/dashboard/settings";
      break;
    }
    default:
      throw new AppError(
        "VALIDATION",
        "Unsupported demonstration operation. No records were changed.",
      );
  }
  db.activities.unshift({
    id: id(),
    actorId: actor.id,
    at: context.now,
    message,
    href,
  });
  db.activities = db.activities.slice(0, 300);
  return result;
}

export function scopedDatabase(
  db: Database,
  actor: Account,
  today = new Date().toISOString().slice(0, 10),
): Database {
  const out = structuredClone(db);
  if (actor.role !== "Coordinator") {
    out.placements = db.placements.filter((p) => canSeePlacement(db, actor, p));
    const applications = new Set(out.placements.map((p) => p.applicationId));
    out.applications = db.applications.filter(
      (a) =>
        applications.has(a.id) ||
        (actor.role === "Student" &&
          get(db.students, a.studentId).accountId === actor.id),
    );
    const students = new Set(out.applications.map((a) => a.studentId));
    out.students = db.students.filter(
      (s) => students.has(s.id) || s.accountId === actor.id,
    );
    const companyIds = new Set([
      ...out.placements.map((p) => companyFor(db, p).id),
      ...out.applications.map(
        (a) => get(db.opportunities, a.opportunityId).companyId,
      ),
      ...db.supervisors
        .filter((s) => s.accountId === actor.id)
        .map((s) => s.companyId),
    ]);
    out.opportunities = db.opportunities.filter((o) =>
      actor.role === "Student"
        ? out.applications.some((a) => a.opportunityId === o.id) ||
          available(db, o.id, today)
        : companyIds.has(o.companyId),
    );
    out.companies = db.companies.filter(
      (c) =>
        companyIds.has(c.id) ||
        out.opportunities.some((o) => o.companyId === c.id),
    );
    out.supervisors = db.supervisors.filter(
      (s) =>
        out.placements.some((p) => p.supervisorId === s.id) ||
        s.accountId === actor.id,
    );
    out.faculty = db.faculty.filter(
      (f) =>
        out.placements.some((p) => p.adviserId === f.id) ||
        f.accountId === actor.id,
    );
    out.submissions = db.submissions.filter(
      (s) =>
        out.students.some((x) => x.id === s.studentId) &&
        actor.role !== "Company Supervisor",
    );
    out.files = db.files.filter((f) =>
      out.submissions.some((s) => s.fileId === f.id),
    );
    out.reports = db.reports.filter((r) =>
      out.placements.some((p) => p.id === r.placementId),
    );
    out.evaluations = db.evaluations.filter((e) =>
      out.placements.some((p) => p.id === e.placementId),
    );
    out.certificates = db.certificates.filter((c) =>
      out.placements.some((p) => p.id === c.placementId),
    );
    const accountIds = new Set([
      actor.id,
      ...out.students.map((s) => s.accountId),
      ...out.supervisors.map((s) => s.accountId),
      ...out.faculty.map((f) => f.accountId),
      ...out.submissions.map((s) => s.reviewerId),
      ...out.reports.map((r) => r.reviewerId),
      ...out.evaluations.map((e) => e.evaluatorId),
      ...out.applications.flatMap((a) => a.history.map((h) => h.actorId)),
      ...out.placements.map((p) => p.approvedBy),
      ...out.certificates.map((c) => c.recordedBy),
    ]);
    out.accounts = db.accounts.filter((a) => accountIds.has(a.id));
    out.activities = db.activities.filter((a) => a.actorId === actor.id);
  }
  out.accounts.forEach((a) => {
    a.verifier = "";
  });
  out.availability = Object.fromEntries(
    out.opportunities.map((o) => [
      o.id,
      {
        remaining: remainingSlots(db, o.id),
        eligible: available(db, o.id, today),
      },
    ]),
  );
  out.preferences = { [actor.id]: db.preferences[actor.id] };
  out.receipts = [];
  return out;
}
