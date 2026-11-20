import { describe, it, expect, vi } from "vitest";
import { createSeed, DEMO_PASSWORD } from "../../app/lib/seed";
import { IndexedDbStore } from "../../app/lib/storage";
import { DemoService } from "../../app/lib/service";
import { AccessCommand, Database } from "../../app/lib/domain";
import { hours } from "../../app/lib/rules";
import { MemorySession, now } from "../helpers";

async function legacyFixture() {
  const db = await createSeed(now);
  db.schemaVersion = 1;
  db.revision = 42;
  db.accounts = db.accounts.filter((a) => a.role !== "Company Supervisor");
  db.supervisors = db.supervisors.filter((s) =>
    db.accounts.some((a) => a.id === s.accountId),
  );
  for (const a of db.accounts) {
    if (a.role === "Intern Supervisor") a.role = "Company Supervisor";
    delete a.activationState;
    delete a.credentialVersion;
  }
  db.students.forEach((s) => {
    delete s.adviserId;
    delete s.registeredBy;
  });
  db.requirements.forEach((r) => {
    delete r.phase;
  });
  for (const o of db.opportunities) {
    o.status =
      o.status === "Active"
        ? "Approved"
        : o.status === "Deactivated"
          ? "Closed"
          : "Pending Approval";
    delete o.supervisorIds;
    delete o.location;
    delete o.modality;
    delete o.requiredHours;
    delete o.qualifications;
    delete o.skills;
    delete o.responsibilities;
    delete o.decisions;
    delete o.legacyApproval;
  }
  for (const r of db.reports) {
    r.status = r.status === "Approved" ? "Reviewed" : "Pending Review";
    delete r.kind;
    delete r.legacyStatus;
    delete r.history;
    delete r.facultyRemarks;
  }
  db.evaluations.forEach((e) => {
    delete e.evaluationDate;
  });
  delete db.attendance;
  delete db.accountRequests;
  return db;
}
async function raw(name: string): Promise<Database> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(name, 1);
    r.onerror = () => reject(r.error);
    r.onsuccess = () => {
      const tx = r.result.transaction("state", "readonly"),
        get = tx.objectStore("state").get("snapshot");
      get.onsuccess = () => resolve(get.result);
      tx.oncomplete = () => r.result.close();
      tx.onabort = () => reject(tx.error);
    };
  });
}
describe("compatible versioned local upgrades", () => {
  it("preserves legacy IDs, attachments, assignments, credentials, evaluations and approved totals without granting company admin", async () => {
    const legacy = await legacyFixture(),
      store = new IndexedDbStore(`legacy-${crypto.randomUUID()}`);
    await store.replace(legacy);
    const db = await store.read();
    expect(db.schemaVersion).toBe(2);
    expect(db.revision).toBe(43);
    expect(db.accounts).toHaveLength(legacy.accounts.length);
    expect(
      db.accounts.filter((a) => a.role === "Company Supervisor"),
    ).toHaveLength(0);
    expect(db.accounts.find((a) => a.id === "sup-1")).toMatchObject({
      role: "Intern Supervisor",
      verifier: legacy.accounts.find((a) => a.id === "sup-1")!.verifier,
    });
    expect(db.placements).toEqual(legacy.placements);
    expect(
      db.evaluations.map((e) => [e.id, e.evaluatorId, e.grade, e.comments]),
    ).toEqual(
      legacy.evaluations.map((e) => [e.id, e.evaluatorId, e.grade, e.comments]),
    );
    expect(db.applications).toEqual(legacy.applications);
    for (const p of legacy.placements)
      expect(hours(db, p.id)).toEqual(hours(legacy, p.id));
    for (const file of legacy.files) {
      const saved = db.files.find((f) => f.id === file.id)!;
      expect(saved.name).toBe(file.name);
      expect(new Uint8Array(await saved.blob.arrayBuffer())).toEqual(
        new Uint8Array(await file.blob.arrayBuffer()),
      );
    }
    expect(db.reports.find((r) => r.id === "PR-001")).toMatchObject({
      status: "Approved",
      legacyStatus: "Reviewed",
    });
    expect((await store.read()).revision).toBe(43);
    const service = new DemoService(store, new MemorySession(), () => now);
    await service.signIn("supervisor@example.test", DEMO_PASSWORD);
    expect((await service.currentAccount())?.role).toBe("Intern Supervisor");
  });
  it("aborts a failed upgrade write without replacing the version-one snapshot or files", async () => {
    const legacy = await legacyFixture(),
      name = `legacy-quota-${crypto.randomUUID()}`,
      store = new IndexedDbStore(name);
    await store.replace(legacy);
    const fail = vi
      .spyOn(IDBObjectStore.prototype, "put")
      .mockImplementationOnce(() => {
        throw new DOMException("Synthetic quota", "QuotaExceededError");
      });
    try {
      await expect(store.read()).rejects.toThrow(/quota/i);
    } finally {
      fail.mockRestore();
    }
    expect(await raw(name)).toEqual(legacy);
    expect((await store.read()).schemaVersion).toBe(2);
  });
  it("rejects expired reset links, mismatched confirmation and unknown public commands without partial mutation", async () => {
    const store = new IndexedDbStore(`access-${crypto.randomUUID()}`);
    await store.replace(await createSeed(now));
    const session = new MemorySession(),
      service = new DemoService(store, session, () => now);
    const token = await service.access(
      { type: "password.request", email: "student@example.test" },
      crypto.randomUUID(),
    );
    const before = await store.read();
    const expired = new DemoService(
      store,
      session,
      () => new Date(now.getTime() + 16 * 60000),
    );
    await expect(
      expired.access(
        {
          type: "password.reset",
          token,
          email: "student@example.test",
          password: "New!2026",
          confirmPassword: "New!2026",
        },
        crypto.randomUUID(),
      ),
    ).rejects.toThrow(/expired/);
    await expect(
      service.access(
        {
          type: "password.reset",
          token,
          email: "student@example.test",
          password: "New!2026",
          confirmPassword: "Other!2026",
        },
        crypto.randomUUID(),
      ),
    ).rejects.toThrow(/match/);
    await expect(
      service.access(
        { type: "unknown" } as unknown as AccessCommand,
        crypto.randomUUID(),
      ),
    ).rejects.toMatchObject({ code: "VALIDATION" });
    expect(await store.read()).toEqual(before);
  });
  it("rejects combined password/email changes atomically when the email belongs to another account", async () => {
    const store = new IndexedDbStore(`credentials-${crypto.randomUUID()}`);
    await store.replace(await createSeed(now));
    const service = new DemoService(store, new MemorySession(), () => now);
    await service.signIn("student@example.test", DEMO_PASSWORD);
    const before = await store.read();
    await expect(
      service.execute(
        {
          type: "account.credentials",
          currentPassword: DEMO_PASSWORD,
          newPassword: "Changed!2026",
          email: "STUDENT2@EXAMPLE.TEST",
        },
        crypto.randomUUID(),
      ),
    ).rejects.toThrow(/already/);
    expect(await store.read()).toEqual(before);
    await service.signIn("student@example.test", DEMO_PASSWORD);
  });
});
