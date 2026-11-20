import { describe, expect, it } from "vitest";
import { DemoService, UnconnectedApiService } from "../../app/lib/service";
import { IndexedDbStore } from "../../app/lib/storage";
import { createSeed, DEMO_PASSWORD } from "../../app/lib/seed";
import { AppError, Database, StudentInput } from "../../app/lib/domain";
import { hours, remainingSlots } from "../../app/lib/rules";
import { fixture, MemorySession, now } from "../helpers";

const input: StudentInput = {
  studentNumber: "SYN-TEST-101",
  firstName: "Synthetic",
  lastName: "Integration",
  email: "integration@example.test",
  program: "BS Computer Science",
  yearLevel: "4th Year",
  section: "4-1",
  academicYear: "2026-2027",
};
const key = () => crypto.randomUUID();
async function persisted() {
  const name = `internlink-test-${key()}`;
  const store = new IndexedDbStore(name);
  await store.replace(await createSeed(now));
  const session = new MemorySession();
  const service = new DemoService(store, session, () => now);
  await service.signIn("coordinator@example.test", DEMO_PASSWORD);
  return { name, store, session, service };
}
describe("authentication and mode isolation", () => {
  it("preserves valid records when session storage fails during recovery reset", async () => {
    const { store, service } = await fixture();
    await service.signIn("coordinator@example.test", DEMO_PASSWORD);
    await service.execute({ type: "student.save", input }, key());
    const before = await store.read();
    const failedSession = new DemoService(
      store,
      {
        get() {
          throw new AppError("STORAGE_UNAVAILABLE", "Session storage blocked");
        },
        set() {},
      },
      () => now,
    );
    await expect(failedSession.reset("RESET DEMO")).rejects.toThrow(
      "Session storage blocked",
    );
    expect(await store.read()).toEqual(before);
  });
  it("verifies credentials, inactive accounts, logout and session expiry", async () => {
    const { service, session } = await fixture();
    await expect(service.signIn("", "")).rejects.toThrow(/required/);
    await expect(
      service.signIn("coordinator@example.test", "wrong"),
    ).rejects.toThrow(/Invalid/);
    await expect(
      service.signIn("student6@example.test", DEMO_PASSWORD),
    ).rejects.toThrow(/inactive/);
    await service.signIn("coordinator@example.test", DEMO_PASSWORD);
    expect((await service.currentAccount())?.role).toBe("Coordinator");
    expect(JSON.stringify(session.value)).not.toContain(DEMO_PASSWORD);
    session.value!.expiresAt = now.getTime() - 1;
    expect(await service.currentAccount()).toBeNull();
    await expect(service.read()).rejects.toThrow(/Sign in/);
    await service.signIn("coordinator@example.test", DEMO_PASSWORD);
    await service.signOut();
    expect(await service.currentAccount()).toBeNull();
  });
  it("scopes records and strips credential verifiers", async () => {
    const { service } = await fixture();
    await service.signIn("student@example.test", DEMO_PASSWORD);
    const view = await service.read();
    expect(view.students.map((s) => s.id)).toEqual(["2024-0001"]);
    expect(view.applications.every((a) => a.studentId === "2024-0001")).toBe(
      true,
    );
    expect(view.accounts.every((a) => !a.verifier)).toBe(true);
    expect(remainingSlots(view, "opp-1")).toBe(1);
    await expect(
      service.execute({ type: "student.save", input }, key()),
    ).rejects.toThrow(/cannot/);
  });
  it("restricts faculty and supervisors to assigned placements and attachments", async () => {
    const { service } = await fixture();
    await service.signIn("supervisor@example.test", DEMO_PASSWORD);
    expect((await service.read()).placements.map((p) => p.id).sort()).toEqual([
      "PL-001",
      "PL-002",
    ]);
    expect(
      (await service.attachment("file-sub-2024-0001-req-1")).blob.size,
    ).toBeGreaterThan(0);
    await expect(
      service.attachment("file-sub-2024-0003-req-1"),
    ).rejects.toThrow(/not exist/);
    await service.signIn("coordinator@example.test", DEMO_PASSWORD);
    const during = await service.execute(
      {
        type: "requirement.save",
        input: {
          name: "Private during proof",
          description: "Synthetic",
          classification: "Optional",
          phase: "During Internship",
        },
      },
      key(),
    );
    const blob = new Blob(["Synthetic during work"], { type: "text/plain" });
    const submissionId = await service.execute(
      {
        type: "submission.create",
        studentId: "2024-0001",
        requirementId: during,
        file: { name: "during.txt", mime: blob.type, size: blob.size, blob },
      },
      key(),
    );
    const fileId = (await service.read()).submissions.find(
      (s) => s.id === submissionId,
    )!.fileId;
    await service.signIn("supervisor@example.test", DEMO_PASSWORD);
    await expect(service.attachment(fileId)).rejects.toThrow(/not exist/);
    await expect(
      service.execute(
        {
          type: "evaluation.submit",
          id: "eval-PL-003-sup-2",
          grade: 90,
          comments: "Unassigned",
        },
        key(),
      ),
    ).rejects.toThrow(/ongoing|assigned/);
    await service.signIn("faculty2@example.test", DEMO_PASSWORD);
    expect((await service.read()).students.map((s) => s.id)).toEqual([
      "2024-0003",
    ]);
    await expect(
      service.execute(
        {
          type: "submission.review",
          id: "sub-2024-0005-req-1",
          decision: "Approved",
          reason: "",
        },
        key(),
      ),
    ).rejects.toThrow(/not assigned/);
  });
  it("never falls back to demo data in API mode", async () => {
    const api = new UnconnectedApiService();
    await expect(api.currentAccount()).rejects.toThrow(/not connected/);
    await expect(api.read()).rejects.toThrow(/no demonstration data/i);
    await expect(api.execute()).rejects.toThrow(/not connected/);
  });
});
describe("persisted commands and relational consistency", () => {
  it("serializes different applications racing for the last slot", async () => {
    const { service, store } = await persisted();
    const applicationId = await service.execute(
      {
        type: "application.create",
        studentId: "2024-0003",
        opportunityId: "opp-1",
      },
      key(),
    );
    await service.execute(
      {
        type: "application.decide",
        id: applicationId,
        decision: "Accepted",
        reason: "",
      },
      key(),
    );
    const placement = {
      adviserId: "fac-1",
      supervisorId: "supervisor-1",
      startDate: "2026-11-19",
      endDate: "2026-12-01",
      requiredHours: 8,
    };
    const results = await Promise.allSettled([
      service.execute(
        {
          type: "placement.create",
          input: { ...placement, applicationId: "app-002" },
        },
        key(),
      ),
      service.execute(
        { type: "placement.create", input: { ...placement, applicationId } },
        key(),
      ),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(remainingSlots(await store.read(), "opp-1")).toBe(0);
  });
  it("creates and edits a student/account across independent service instances", async () => {
    const { service, name, session } = await persisted();
    const id = await service.execute({ type: "student.save", input }, key());
    const reloaded = new DemoService(
      new IndexedDbStore(name),
      session,
      () => now,
    );
    expect(
      (await reloaded.read()).students.find((s) => s.id === id)?.email,
    ).toBe(input.email);
    await reloaded.execute(
      { type: "student.save", id, input: { ...input, firstName: "Updated" } },
      key(),
    );
    const view = await service.read();
    const s = view.students.find((s) => s.id === id)!;
    expect(view.accounts.find((a) => a.id === s.accountId)?.name).toBe(
      "Updated Integration",
    );
    await expect(
      service.execute({ type: "student.save", input }, key()),
    ).rejects.toThrow(/email|identifier/);
  });
  it("preserves new records rather than reseeding on ordinary reads", async () => {
    const { service, store } = await persisted();
    await service.execute({ type: "student.save", input }, key());
    expect((await store.read()).students).toHaveLength(7);
    expect((await store.read()).students).toHaveLength(7);
  });
  it("rolls back invalid writes and rejects stale revisions", async () => {
    const { service, store } = await persisted();
    const before = await store.read();
    await expect(
      service.execute(
        { type: "student.save", input: { ...input, firstName: " " } },
        key(),
      ),
    ).rejects.toThrow(/required/);
    expect((await store.read()).revision).toBe(before.revision);
    await service.execute(
      { type: "student.save", input },
      key(),
      before.revision,
    );
    await expect(
      service.execute(
        {
          type: "requirement.save",
          input: {
            name: "New",
            description: "Example",
            classification: "Optional",
          },
        },
        key(),
        before.revision,
      ),
    ).rejects.toThrow(/changed/);
  });
  it("deduplicates retried commands with the same request key", async () => {
    const { service } = await persisted();
    const request = key();
    const first = await service.execute(
      { type: "student.save", input },
      request,
    );
    const second = await service.execute(
      { type: "student.save", input },
      request,
    );
    expect(first).toBe(second);
    expect(
      (await service.read()).students.filter(
        (s) => s.studentNumber === input.studentNumber,
      ),
    ).toHaveLength(1);
  });
  it("stores actual attachment bytes, rejection history and resubmission", async () => {
    const { service, store, name, session } = await persisted();
    const blob = new Blob(["Synthetic attachment integration bytes"], {
      type: "text/plain",
    });
    await expect(
      service.execute(
        {
          type: "submission.review",
          id: "sub-2024-0005-req-1",
          decision: "Rejected",
          reason: " ",
        },
        key(),
      ),
    ).rejects.toThrow(/reason/);
    await service.execute(
      {
        type: "submission.review",
        id: "sub-2024-0005-req-1",
        decision: "Rejected",
        reason: "Replace demonstration file",
      },
      key(),
    );
    const id = await service.execute(
      {
        type: "submission.create",
        studentId: "2024-0005",
        requirementId: "req-1",
        file: {
          name: "synthetic.txt",
          mime: "text/plain",
          size: blob.size,
          blob,
        },
      },
      key(),
    );
    const other = new DemoService(new IndexedDbStore(name), session, () => now);
    const view = await other.read(),
      submission = view.submissions.find((s) => s.id === id)!;
    expect(submission.attempt).toBe(2);
    expect(await (await other.attachment(submission.fileId)).blob.text()).toBe(
      "Synthetic attachment integration bytes",
    );
    await other.execute(
      { type: "submission.review", id, decision: "Approved", reason: "" },
      key(),
    );
    expect(
      (await store.read()).submissions.find((s) => s.id === id)?.reviewerId,
    ).toBe("coord-1");
    expect(
      (await store.read()).submissions.filter(
        (s) => s.studentId === "2024-0005" && s.requirementId === "req-1",
      ),
    ).toHaveLength(2);
  });
  it("rejects unsupported and empty attachments", async () => {
    const { service } = await persisted();
    const blob = new Blob(["<script>synthetic</script>"], {
      type: "text/html",
    });
    await expect(
      service.execute(
        {
          type: "submission.create",
          studentId: "2024-0005",
          requirementId: "req-2",
          file: { name: "bad.html", mime: "text/html", size: blob.size, blob },
        },
        key(),
      ),
    ).rejects.toThrow(/Supported/);
  });
  it("saves company and supervisor account relationships and uniqueness", async () => {
    const { service } = await persisted();
    const company = await service.execute(
      {
        type: "company.save",
        input: {
          name: "Synthetic Integration Company",
          industry: "Technology",
          address: "1 Example Road",
          contactPerson: "Demo Contact",
          email: "company-integration@example.test",
          phone: "000-000-1234",
          moaStart: "2026-01-01",
          moaEnd: "2027-12-31",
          approved: true,
          academicYear: "2026-2027",
        },
      },
      key(),
    );
    const sup = await service.execute(
      {
        type: "supervisor.save",
        input: {
          companyId: company,
          name: "Synthetic Supervisor",
          email: "sup-integration@example.test",
          phone: "000-000-4321",
          active: true,
        },
      },
      key(),
    );
    const view = await service.read();
    expect(view.supervisors.find((s) => s.id === sup)?.companyId).toBe(company);
    await service.signOut();
    expect(
      (await service.signIn("sup-integration@example.test", DEMO_PASSWORD))
        .role,
    ).toBe("Intern Supervisor");
  });
  it("persists application decisions and disallows repeats", async () => {
    const { service, store } = await persisted();
    await service.execute(
      {
        type: "application.decide",
        id: "app-001",
        decision: "Rejected",
        reason: "Synthetic rejection reason",
      },
      key(),
    );
    expect(
      (await store.read()).applications
        .find((a) => a.id === "app-001")
        ?.history.at(-1)?.reason,
    ).toBe("Synthetic rejection reason");
    await expect(
      service.execute(
        {
          type: "application.decide",
          id: "app-001",
          decision: "Accepted",
          reason: "",
        },
        key(),
      ),
    ).rejects.toThrow(/already/);
  });
  it("does not accept an ineligible pending application", async () => {
    const { service } = await persisted();
    await expect(
      service.execute(
        {
          type: "application.decide",
          id: "app-001",
          decision: "Accepted",
          reason: "",
        },
        key(),
      ),
    ).rejects.toThrow(/mandatory/);
  });
  it("atomically prevents duplicate placement and over-allocation under concurrent commands", async () => {
    const { service, store } = await persisted();
    const input = {
      applicationId: "app-002",
      adviserId: "fac-1",
      supervisorId: "supervisor-1",
      startDate: "2026-11-19",
      endDate: "2026-12-01",
      requiredHours: 8,
    };
    const results = await Promise.allSettled([
      service.execute({ type: "placement.create", input }, key()),
      service.execute({ type: "placement.create", input }, key()),
    ]);
    expect(results.filter((x) => x.status === "fulfilled")).toHaveLength(1);
    const data = await store.read();
    expect(
      data.placements.filter((p) => p.applicationId === "app-002"),
    ).toHaveLength(1);
    expect(remainingSlots(data, "opp-1")).toBe(0);
    expect(
      data.evaluations.filter(
        (e) =>
          e.placementId ===
          data.placements.find((p) => p.applicationId === "app-002")!.id,
      ),
    ).toHaveLength(2);
  });
  it("maintains slot policy on termination, preserves history", async () => {
    const { service, store } = await persisted();
    await service.execute(
      {
        type: "placement.terminate",
        id: "PL-001",
        reason: "Synthetic termination",
      },
      key(),
    );
    expect(remainingSlots(await store.read(), "opp-1")).toBe(2);
    expect(
      (await store.read()).reports.some((r) => r.placementId === "PL-001"),
    ).toBe(true);
  });
  it("reviews hours exactly once and propagates the aggregate", async () => {
    const { service, store } = await persisted();
    await expect(
      service.execute(
        {
          type: "report.review",
          id: "PR-002",
          remarks: "Coordinator cannot approve new progress",
        },
        key(),
      ),
    ).rejects.toThrow(/cannot/);
    await service.signIn("supervisor@example.test", DEMO_PASSWORD);
    await service.execute(
      {
        type: "report.review",
        id: "PR-002",
        remarks: "Reviewed synthetic tasks",
      },
      key(),
    );
    expect(hours(await store.read(), "PL-001")).toMatchObject({
      submitted: 16,
      reviewed: 16,
      remaining: 64,
      percent: 20,
    });
    await expect(
      service.execute(
        { type: "report.review", id: "PR-002", remarks: "Repeat" },
        key(),
      ),
    ).rejects.toThrow(/already/);
  });
  it("rejects duplicate daily reports and out-of-range dates", async () => {
    const { service } = await persisted();
    await expect(
      service.execute(
        {
          type: "report.create",
          placementId: "PL-001",
          workDate: "2026-11-18",
          hours: 8,
          tasks: "Duplicate",
        },
        key(),
      ),
    ).rejects.toThrow(/already/);
    await expect(
      service.execute(
        {
          type: "report.create",
          placementId: "PL-001",
          workDate: "2030-01-01",
          hours: 8,
          tasks: "Future",
        },
        key(),
      ),
    ).rejects.toThrow(/date/);
  });
  it("does not silently reset damaged data; explicit recovery is required", async () => {
    const { service, store } = await persisted();
    await store.update((db) => {
      db.schemaVersion = 999 as Database["schemaVersion"];
    });
    await expect(store.read()).rejects.toThrow(/not been overwritten/);
    await expect(service.reset("wrong")).rejects.toThrow(/RESET DEMO/);
    await service.reset("RESET DEMO");
    expect((await store.read()).schemaVersion).toBe(2);
    expect(await service.currentAccount()).toBeNull();
  });
  it("reset requires coordinator and intentional phrase", async () => {
    const { service } = await persisted();
    await expect(service.reset("yes")).rejects.toThrow(/RESET DEMO/);
    await service.signIn("student@example.test", DEMO_PASSWORD);
    await expect(service.reset("RESET DEMO")).rejects.toThrow(/coordinator/);
  });
});
