import { describe, it, expect } from "vitest";
import { DemoService } from "../../app/lib/service";
import { IndexedDbStore } from "../../app/lib/storage";
import { createSeed, DEMO_PASSWORD } from "../../app/lib/seed";
import { Mutation } from "../../app/lib/domain";
import { MemorySession, now } from "../helpers";
const key = () => crypto.randomUUID();
async function setup() {
  const store = new IndexedDbStore(`permissions-${key()}`);
  await store.replace(await createSeed(now));
  const service = new DemoService(store, new MemorySession(), () => now);
  return { store, service };
}
describe("five-role operation permissions and atomic failures", () => {
  it("creates Intern accounts only in the own company and audits reassignment without a third evaluation", async () => {
    const { store, service } = await setup();
    await service.signIn("company@example.test", DEMO_PASSWORD);
    const input = {
      companyId: "company-1",
      name: "New Synthetic Mentor",
      email: "mentor@example.test",
      phone: "000-555-0123",
      active: true,
      role: "Intern Supervisor" as const,
    };
    const before = await store.read();
    await expect(
      service.execute(
        {
          type: "supervisor.save",
          input: { ...input, companyId: "company-2" },
        },
        key(),
      ),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      service.execute(
        {
          type: "supervisor.save",
          input: { ...input, role: "Company Supervisor" },
        },
        key(),
      ),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(await store.read()).toEqual(before);
    const id = await service.execute({ type: "supervisor.save", input }, key());
    await expect(
      service.execute(
        {
          type: "supervisor.save",
          id: "supervisor-1",
          input: {
            ...input,
            name: "Morgan Demo",
            email: "supervisor@example.test",
            active: false,
          },
        },
        key(),
      ),
    ).rejects.toThrow(/ongoing/);
    await service.execute(
      {
        type: "opportunity.assign",
        id: "opp-1",
        supervisorIds: ["supervisor-1", id],
      },
      key(),
    );
    const oldReports = (await store.read()).reports.filter(
      (r) => r.placementId === "PL-001",
    );
    await service.execute(
      { type: "placement.supervisor.assign", id: "PL-001", supervisorId: id },
      key(),
    );
    let db = await store.read();
    const accountId = db.supervisors.find((s) => s.id === id)!.accountId;
    expect(
      db.placements.find((p) => p.id === "PL-001")?.assignmentHistory,
    ).toHaveLength(1);
    expect(
      db.evaluations.filter((e) => e.placementId === "PL-001"),
    ).toHaveLength(2);
    expect(
      db.evaluations.find((e) => e.id === "eval-PL-001-sup-1")?.evaluatorId,
    ).toBe(accountId);
    expect(db.reports.filter((r) => r.placementId === "PL-001")).toEqual(
      oldReports,
    );
    await service.execute(
      {
        type: "supervisor.save",
        id: "supervisor-1",
        input: {
          ...input,
          name: "Morgan Demo",
          email: "supervisor@example.test",
          active: false,
        },
      },
      key(),
    );
    await expect(
      service.signIn("supervisor@example.test", DEMO_PASSWORD),
    ).rejects.toThrow(/inactive/);
    await service.signIn("mentor@example.test", DEMO_PASSWORD);
    expect((await service.read()).placements.map((p) => p.id)).toEqual([
      "PL-001",
    ]);
    await service.execute(
      {
        type: "evaluation.submit",
        id: "eval-PL-001-sup-1",
        grade: 90,
        comments: "Synthetic company assessment",
        evaluationDate: "2026-11-19",
      },
      key(),
    );
    await service.signIn("company@example.test", DEMO_PASSWORD);
    await service.execute(
      {
        type: "supervisor.save",
        id: "supervisor-1",
        input: {
          ...input,
          name: "Morgan Demo",
          email: "supervisor@example.test",
          active: true,
        },
      },
      key(),
    );
    const frozen = await store.read();
    await expect(
      service.execute(
        {
          type: "placement.supervisor.assign",
          id: "PL-001",
          supervisorId: "supervisor-1",
        },
        key(),
      ),
    ).rejects.toThrow(/freezes/);
    await expect(
      service.execute(
        {
          type: "evaluation.submit",
          id: "eval-PL-001-faculty-1",
          grade: 90,
          comments: "Impersonation",
        },
        key(),
      ),
    ).rejects.toThrow(/cannot/);
    db = await store.read();
    expect(db).toEqual(frozen);
  });
  it("keeps posting decisions terminal by stage, rejects blank reasons and prevents coordinator bypass", async () => {
    const { service, store } = await setup();
    await service.signIn("coordinator@example.test", DEMO_PASSWORD);
    const before = await store.read();
    await expect(
      service.execute(
        {
          type: "opportunity.decide",
          id: "opp-3",
          stage: "Company",
          decision: "Approved",
          remarks: "Bypass",
        },
        key(),
      ),
    ).rejects.toThrow(/stage/);
    expect(await store.read()).toEqual(before);
    await service.signIn("company@example.test", DEMO_PASSWORD);
    await expect(
      service.execute(
        {
          type: "opportunity.decide",
          id: "opp-3",
          stage: "Company",
          decision: "Rejected",
          remarks: " ",
        },
        key(),
      ),
    ).rejects.toThrow(/remarks/);
    await service.execute(
      {
        type: "opportunity.decide",
        id: "opp-3",
        stage: "Company",
        decision: "Rejected",
        remarks: "Synthetic revision request",
      },
      key(),
    );
    await service.execute(
      {
        type: "opportunity.decide",
        id: "opp-3",
        stage: "Company",
        decision: "Approved",
        remarks: "Resubmitted",
      },
      key(),
    );
    await expect(
      service.execute(
        {
          type: "opportunity.decide",
          id: "opp-3",
          stage: "Company",
          decision: "Approved",
          remarks: "Repeat",
        },
        key(),
      ),
    ).rejects.toThrow(/awaiting/);
    expect(
      (await store.read()).opportunities.find((o) => o.id === "opp-3")
        ?.decisions,
    ).toHaveLength(2);
  });
  it("leaves persisted records unchanged after invalid attendance, overlapping work, wrong reviewer and invalid dates", async () => {
    const { store, service } = await setup();
    await service.signIn("student@example.test", DEMO_PASSWORD);
    const commands: Mutation[] = [
      ...[-1, 0, 13, NaN].map((hours) => ({
        type: "attendance.create" as const,
        placementId: "PL-001",
        date: "2026-11-09",
        hours,
        activity: "Synthetic",
      })),
      {
        type: "attendance.create",
        placementId: "PL-001",
        date: "2027-01-01",
        hours: 1,
        activity: "Future",
      },
      {
        type: "attendance.create",
        placementId: "PL-003",
        date: "2026-11-09",
        hours: 1,
        activity: "Unrelated",
      },
      {
        type: "report.weekly",
        placementId: "PL-001",
        fromDate: "2026-11-09",
        toDate: "2026-11-01",
        attendanceIds: [],
        tasks: "Invalid",
      },
    ];
    const before = await store.read();
    for (const command of commands) {
      await expect(service.execute(command, key())).rejects.toThrow();
      expect(await store.read()).toEqual(before);
    }
    const id = await service.execute(
      {
        type: "attendance.create",
        placementId: "PL-001",
        date: "2026-11-09",
        hours: 1,
        activity: "Synthetic",
      },
      key(),
    );
    await expect(
      service.execute(
        {
          type: "attendance.create",
          placementId: "PL-001",
          date: "2026-11-09",
          hours: 1,
          activity: "Duplicate",
        },
        key(),
      ),
    ).rejects.toThrow(/already/);
    await expect(
      service.execute(
        {
          type: "report.create",
          placementId: "PL-001",
          workDate: "2026-11-09",
          hours: 1,
          tasks: "Double count",
        },
        key(),
      ),
    ).rejects.toThrow(/Attendance/);
    const report = await service.execute(
      {
        type: "report.weekly",
        placementId: "PL-001",
        fromDate: "2026-11-09",
        toDate: "2026-11-09",
        attendanceIds: [id],
        tasks: "Synthetic",
      },
      key(),
    );
    await service.signIn("supervisor2@example.test", DEMO_PASSWORD);
    const frozen = await store.read();
    await expect(
      service.execute(
        {
          type: "report.decide",
          id: report,
          decision: "Approved",
          remarks: "Unassigned",
        },
        key(),
      ),
    ).rejects.toThrow(/assigned/);
    expect(await store.read()).toEqual(frozen);
  });
  it("removes document review authority after student reassignment while retaining historical placement relationships", async () => {
    const { store, service } = await setup();
    await service.signIn("coordinator@example.test", DEMO_PASSWORD);
    await service.execute(
      { type: "faculty.assign", studentId: "2024-0003", adviserId: "fac-1" },
      key(),
    );
    await service.signIn("faculty2@example.test", DEMO_PASSWORD);
    expect(
      (await service.read()).placements.some((p) => p.id === "PL-003"),
    ).toBe(true);
    await expect(
      service.execute(
        {
          type: "submission.review",
          id: "sub-2024-0003-req-1",
          decision: "Rejected",
          reason: "No longer assigned",
        },
        key(),
      ),
    ).rejects.toThrow(/not assigned/);
    expect(
      (await store.read()).placements.find((p) => p.id === "PL-003")?.adviserId,
    ).toBe("fac-2");
  });
  it("preserves approval on an unchanged posting save and requires reapproval for a material edit", async () => {
    const { store, service } = await setup();
    await service.signIn("coordinator@example.test", DEMO_PASSWORD);
    const original = (await store.read()).opportunities.find(
      (o) => o.id === "opp-1",
    )!;
    const input = {
      companyId: original.companyId,
      title: original.title,
      description: original.description,
      capacity: original.capacity,
      academicYear: original.academicYear,
    };
    await service.execute(
      { type: "opportunity.save", id: original.id, input },
      key(),
    );
    let saved = (await store.read()).opportunities.find(
      (o) => o.id === original.id,
    )!;
    expect(saved).toEqual(original);
    await service.execute(
      {
        type: "opportunity.save",
        id: original.id,
        input: { ...input, title: "Changed synthetic posting" },
      },
      key(),
    );
    saved = (await store.read()).opportunities.find(
      (o) => o.id === original.id,
    )!;
    expect(saved.status).toBe("Pending Approval - Company");
    expect(saved.legacyApproval).toBe(false);
    expect(saved.decisions?.at(-1)?.outcome).toBe("Edited");
    expect(saved.modality).toBe(original.modality);
  });
  it("binds a daily report replacement to its rejected placement and date without losing the earlier attempt", async () => {
    const { store, service } = await setup();
    await service.signIn("student@example.test", DEMO_PASSWORD);
    const input = {
      type: "report.create" as const,
      placementId: "PL-001",
      workDate: "2026-11-09",
      hours: 0.7,
      tasks: "Synthetic daily task",
    };
    const id = await service.execute(input, key());
    await service.signIn("supervisor@example.test", DEMO_PASSWORD);
    await service.execute(
      {
        type: "report.decide",
        id,
        decision: "Rejected",
        remarks: "Correct activities",
      },
      key(),
    );
    await service.signIn("student@example.test", DEMO_PASSWORD);
    const before = await store.read();
    for (const invalid of [
      { ...input, workDate: "2026-11-10", replacesId: id },
      { ...input, replacesId: "unknown" },
    ]) {
      await expect(service.execute(invalid, key())).rejects.toThrow(
        /replacement/,
      );
      expect(await store.read()).toEqual(before);
    }
    const replacement = await service.execute(
      { ...input, replacesId: id, tasks: "Corrected synthetic task" },
      key(),
    );
    const db = await store.read();
    expect(db.reports.find((r) => r.id === id)?.status).toBe("Rejected");
    expect(db.reports.find((r) => r.id === replacement)).toMatchObject({
      replacesId: id,
      attempt: 2,
      status: "Pending",
      hours: 0.7,
    });
  });
});
