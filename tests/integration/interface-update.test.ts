import { describe, it, expect } from "vitest";
import { IndexedDbStore } from "../../app/lib/storage";
import { DemoService } from "../../app/lib/service";
import { createSeed, DEMO_PASSWORD } from "../../app/lib/seed";
import { MemorySession, now } from "../helpers";
import { hours } from "../../app/lib/rules";
const key = () => crypto.randomUUID();
async function setup() {
  const store = new IndexedDbStore(`interface-${key()}`);
  await store.replace(await createSeed(now));
  const session = new MemorySession();
  const service = new DemoService(store, session, () => now);
  await service.signIn("coordinator@example.test", DEMO_PASSWORD);
  return { store, session, service };
}
const studentInput = {
  studentNumber: "IU-001",
  firstName: "Interface",
  lastName: "Synthetic",
  email: "interface@example.test",
  program: "BS Computer Science",
  yearLevel: "4th Year",
  section: "4-I",
  academicYear: "2026-2027",
};
describe("interface update account and relationship boundaries", () => {
  it("pre-registers, binds an invitation, activates the existing account once and changes credentials without plaintext", async () => {
    const { store, service } = await setup();
    const id = await service.execute(
      { type: "student.save", input: studentInput },
      key(),
    );
    const before = await store.read();
    const account = before.accounts.find(
      (a) => a.id === before.students.find((s) => s.id === id)!.accountId,
    )!;
    expect(account).toMatchObject({
      active: false,
      activationState: "Pending Activation",
      verifier: "",
    });
    await expect(
      service.signIn(studentInput.email, DEMO_PASSWORD),
    ).rejects.toThrow(/pending activation/);
    const token = await service.execute(
      { type: "account.invite", studentId: id },
      key(),
    );
    const activation = {
      type: "account.activate" as const,
      token,
      studentNumber: studentInput.studentNumber,
      email: studentInput.email,
      password: "Updated!2026",
      confirmPassword: "Updated!2026",
    };
    await expect(
      service.access({ ...activation, email: "other@example.test" }, key()),
    ).rejects.toThrow(/match/);
    await service.access(activation, key());
    await expect(service.access(activation, key())).rejects.toThrow(/used/);
    expect((await store.read()).students).toHaveLength(before.students.length);
    await service.signIn(studentInput.email, activation.password);
    await service.execute(
      {
        type: "account.credentials",
        currentPassword: activation.password,
        newPassword: "Changed!2026",
        email: "changed-interface@example.test",
      },
      key(),
    );
    expect(await service.currentAccount()).toBeNull();
    await expect(
      service.signIn(studentInput.email, activation.password),
    ).rejects.toThrow(/Invalid/);
    await service.signIn("changed-interface@example.test", "Changed!2026");
    const after = await store.read();
    expect(after.students.find((s) => s.id === id)?.email).toBe(
      "changed-interface@example.test",
    );
    expect(JSON.stringify(after)).not.toContain("Changed!2026");
  });
  it("performs expiring single-use local reset without activating pending or deactivated accounts", async () => {
    const { store, service } = await setup();
    const token = await service.access(
      { type: "password.request", email: "student@example.test" },
      key(),
    );
    await service.access(
      {
        type: "password.reset",
        token,
        email: "student@example.test",
        password: "Recovered!2026",
        confirmPassword: "Recovered!2026",
      },
      key(),
    );
    await expect(
      service.access(
        {
          type: "password.reset",
          token,
          email: "student@example.test",
          password: "Recovered!2026",
          confirmPassword: "Recovered!2026",
        },
        key(),
      ),
    ).rejects.toThrow(/used/);
    await service.signIn("student@example.test", "Recovered!2026");
    await expect(
      service.access(
        { type: "password.request", email: "student6@example.test" },
        key(),
      ),
    ).rejects.toThrow(/active/);
    const id = await (async () => {
      await service.signIn("coordinator@example.test", DEMO_PASSWORD);
      return service.execute(
        { type: "student.save", input: studentInput },
        key(),
      );
    })();
    await expect(
      service.access(
        { type: "password.request", email: studentInput.email },
        key(),
      ),
    ).rejects.toThrow(/active/);
    const invitation = await service.execute(
      { type: "account.invite", studentId: id },
      key(),
    );
    const accountId = (await store.read()).students.find(
      (s) => s.id === id,
    )!.accountId;
    await service.execute({ type: "account.deactivate", accountId }, key());
    await expect(
      service.access(
        {
          type: "account.activate",
          token: invitation,
          email: studentInput.email,
          studentNumber: studentInput.studentNumber,
          password: "Valid!2026",
          confirmPassword: "Valid!2026",
        },
        key(),
      ),
    ).rejects.toThrow();
  });
  it("allows faculty pre-registration in its own scope and preserves placement adviser history", async () => {
    const { service, store } = await setup();
    await service.signIn("faculty@example.test", DEMO_PASSWORD);
    const id = await service.execute(
      { type: "student.save", input: studentInput },
      key(),
    );
    expect(
      (await service.read()).students.some(
        (s) => s.id === id && s.adviserId === "fac-1",
      ),
    ).toBe(true);
    await service.signIn("faculty2@example.test", DEMO_PASSWORD);
    await expect(
      service.execute({ type: "student.save", id, input: studentInput }, key()),
    ).rejects.toThrow(/assigned/);
    await expect(
      service.execute(
        { type: "faculty.assign", studentId: id, adviserId: "fac-2" },
        key(),
      ),
    ).rejects.toThrow(/cannot/);
    await service.signIn("coordinator@example.test", DEMO_PASSWORD);
    await service.execute(
      { type: "faculty.assign", studentId: id, adviserId: "fac-2" },
      key(),
    );
    await expect(
      service.execute(
        { type: "faculty.assign", studentId: "2024-0001", adviserId: "fac-2" },
        key(),
      ),
    ).rejects.toThrow(/ongoing/);
    expect(
      (await store.read()).placements.find((p) => p.id === "PL-001")?.adviserId,
    ).toBe("fac-1");
  });
  it("separates company administration, opportunity assignments and application decisions", async () => {
    const { service, store } = await setup();
    await service.signIn("supervisor@example.test", DEMO_PASSWORD);
    expect((await service.currentAccount())?.role).toBe("Intern Supervisor");
    const company = (await store.read()).companies[0];
    await expect(
      service.execute(
        { type: "company.save", id: company.id, input: company },
        key(),
      ),
    ).rejects.toThrow(/cannot/);
    await expect(
      service.execute(
        {
          type: "application.decide",
          id: "app-005",
          decision: "Rejected",
          reason: "Synthetic decision",
        },
        key(),
      ),
    ).rejects.toThrow();
    await service.signIn("company@example.test", DEMO_PASSWORD);
    await expect(
      service.execute(
        {
          type: "company.save",
          id: company.id,
          input: { ...company, approved: false },
        },
        key(),
      ),
    ).rejects.toThrow(/MOA/);
    await expect(
      service.execute(
        {
          type: "opportunity.assign",
          id: "opp-1",
          supervisorIds: ["supervisor-2"],
        },
        key(),
      ),
    ).rejects.toThrow(/same company/);
    await expect(
      service.execute(
        {
          type: "application.decide",
          id: "app-001",
          decision: "Rejected",
          reason: "Synthetic",
        },
        key(),
      ),
    ).rejects.toThrow(/Only/);
  });
  it("enforces company then coordinator approval then activation and preserves decisions after material edits", async () => {
    const { store, service } = await setup();
    await service.signIn("company@example.test", DEMO_PASSWORD);
    const id = await service.execute(
      {
        type: "opportunity.save",
        input: {
          companyId: "company-1",
          title: "Updated posting",
          description: "Synthetic work",
          capacity: 2,
          academicYear: "2026-2027",
          location: "Demo City",
          modality: "Remote",
          requiredHours: 120,
          qualifications: "Academic enrollment",
          skills: "Communication",
          responsibilities: "Synthetic project",
        },
      },
      key(),
    );
    await expect(
      service.execute(
        { type: "opportunity.activate", id, active: true },
        key(),
      ),
    ).rejects.toThrow(/Both/);
    await service.signIn("coordinator@example.test", DEMO_PASSWORD);
    await expect(
      service.execute(
        { type: "opportunity.status", id, status: "Approved" },
        key(),
      ),
    ).rejects.toThrow(/Company approval/);
    await service.signIn("company@example.test", DEMO_PASSWORD);
    await service.execute(
      {
        type: "opportunity.decide",
        id,
        stage: "Company",
        decision: "Approved",
        remarks: "Company checked",
      },
      key(),
    );
    await service.execute(
      { type: "opportunity.assign", id, supervisorIds: ["supervisor-1"] },
      key(),
    );
    await service.signIn("coordinator@example.test", DEMO_PASSWORD);
    await service.execute(
      {
        type: "opportunity.decide",
        id,
        stage: "Coordinator",
        decision: "Approved",
        remarks: "Academic checked",
      },
      key(),
    );
    await service.signIn("student4@example.test", DEMO_PASSWORD);
    expect((await service.read()).opportunities.some((o) => o.id === id)).toBe(
      false,
    );
    await service.signIn("company@example.test", DEMO_PASSWORD);
    await service.execute(
      { type: "opportunity.activate", id, active: true },
      key(),
    );
    await service.signIn("student4@example.test", DEMO_PASSWORD);
    expect((await service.read()).opportunities.some((o) => o.id === id)).toBe(
      true,
    );
    await service.signIn("company@example.test", DEMO_PASSWORD);
    const o = (await store.read()).opportunities.find((o) => o.id === id)!;
    await service.execute(
      {
        type: "opportunity.save",
        id,
        input: { ...o, title: "Materially updated" },
      },
      key(),
    );
    const updated = (await store.read()).opportunities.find(
      (o) => o.id === id,
    )!;
    expect(updated.status).toBe("Pending Approval - Company");
    expect(updated.decisions).toHaveLength(4);
  });
  it("links attendance to weekly decisions without double-counting and keeps faculty remarks separate", async () => {
    const { store, service } = await setup();
    await service.signIn("student@example.test", DEMO_PASSWORD);
    const existing = hours(await store.read(), "PL-001");
    const attendance = await service.execute(
      {
        type: "attendance.create",
        placementId: "PL-001",
        date: "2026-11-09",
        hours: 0.7,
        activity: "Synthetic attendance",
      },
      key(),
    );
    const report = await service.execute(
      {
        type: "report.weekly",
        placementId: "PL-001",
        fromDate: "2026-11-09",
        toDate: "2026-11-09",
        attendanceIds: [attendance],
        tasks: "Weekly synthetic work",
      },
      key(),
    );
    expect(hours(await store.read(), "PL-001").submitted).toBe(
      existing.submitted + 0.7,
    );
    await expect(
      service.execute(
        {
          type: "report.weekly",
          placementId: "PL-001",
          fromDate: "2026-11-09",
          toDate: "2026-11-09",
          attendanceIds: [attendance],
          tasks: "Duplicate",
        },
        key(),
      ),
    ).rejects.toThrow(/already/);
    await service.signIn("faculty@example.test", DEMO_PASSWORD);
    await service.execute(
      {
        type: "report.monitor",
        id: report,
        remarks: "Independent faculty monitoring",
      },
      key(),
    );
    await expect(
      service.execute(
        { type: "report.review", id: report, remarks: "Unauthorized approval" },
        key(),
      ),
    ).rejects.toThrow(/cannot/);
    expect(hours(await store.read(), "PL-001").reviewed).toBe(
      existing.reviewed,
    );
    await service.signIn("supervisor@example.test", DEMO_PASSWORD);
    await expect(
      service.execute(
        {
          type: "report.decide",
          id: report,
          decision: "Rejected",
          remarks: "",
        },
        key(),
      ),
    ).rejects.toThrow(/remarks/);
    await service.execute(
      {
        type: "report.decide",
        id: report,
        decision: "Rejected",
        remarks: "Resubmit with detail",
      },
      key(),
    );
    await service.signIn("student@example.test", DEMO_PASSWORD);
    const replacement = await service.execute(
      {
        type: "report.weekly",
        placementId: "PL-001",
        fromDate: "2026-11-09",
        toDate: "2026-11-09",
        attendanceIds: [attendance],
        tasks: "Corrected weekly work",
      },
      key(),
    );
    await service.signIn("supervisor@example.test", DEMO_PASSWORD);
    await service.execute(
      {
        type: "report.decide",
        id: replacement,
        decision: "Approved",
        remarks: "Validated work",
      },
      key(),
    );
    expect(hours(await store.read(), "PL-001").reviewed).toBe(
      existing.reviewed + 0.7,
    );
    await expect(
      service.execute(
        {
          type: "report.decide",
          id: replacement,
          decision: "Approved",
          remarks: "Duplicate approval",
        },
        key(),
      ),
    ).rejects.toThrow(/final/);
    expect(
      (await store.read()).reports.find((r) => r.id === report)?.facultyRemarks,
    ).toHaveLength(1);
  });
  it("gates placement on Before documents, preserving mandatory During/After completion obligations", async () => {
    const { service, store } = await setup();
    const during = await service.execute(
      {
        type: "requirement.save",
        input: {
          name: "During proof",
          description: "Synthetic",
          classification: "Mandatory",
          phase: "During Internship",
        },
      },
      key(),
    );
    const after = await service.execute(
      {
        type: "requirement.save",
        input: {
          name: "After proof",
          description: "Synthetic",
          classification: "Mandatory",
          phase: "After Internship",
        },
      },
      key(),
    );
    const id = await service.execute(
      {
        type: "placement.create",
        input: {
          applicationId: "app-002",
          adviserId: "fac-1",
          supervisorId: "supervisor-1",
          startDate: "2026-11-19",
          endDate: "2026-12-19",
          requiredHours: 8,
        },
      },
      key(),
    );
    expect(
      (await store.read()).placements.find((p) => p.id === id)
        ?.requiredRequirementIds,
    ).toEqual(expect.arrayContaining([during, after]));
  });
  it("binds public account retries to content and preserves single-use tokens across different commands", async () => {
    const { store, service } = await setup();
    const requestKey = key();
    const command = {
      type: "password.request" as const,
      email: "student@example.test",
    };
    const token = await service.access(command, requestKey);
    const before = await store.read();
    expect(await service.access(command, requestKey)).toBe(token);
    expect(await store.read()).toEqual(before);
    await expect(
      service.access(
        { ...command, email: "student2@example.test" },
        requestKey,
      ),
    ).rejects.toMatchObject({ code: "CONFLICT" });
    expect(await store.read()).toEqual(before);
    const resetKey = key(),
      reset = {
        type: "password.reset" as const,
        token,
        email: command.email,
        password: "Changed!2026",
        confirmPassword: "Changed!2026",
      };
    const id = await service.access(reset, resetKey);
    const after = await store.read();
    expect(await service.access(reset, resetKey)).toBe(id);
    expect(await store.read()).toEqual(after);
    await expect(service.access(reset, key())).rejects.toThrow(/used/);
    expect(JSON.stringify(after.receipts)).not.toContain(reset.password);
  });
});
