import { afterEach, describe, expect, it, vi } from "vitest";
import { IndexedDbStore } from "../../app/lib/storage";
import { DemoService, SessionStorage } from "../../app/lib/service";
import { Command, Database, Session } from "../../app/lib/domain";
import { createSeed, DEMO_PASSWORD } from "../../app/lib/seed";
import { completionProblems, hours, preferencesOf } from "../../app/lib/rules";
import { generateReport } from "../../app/lib/reporting";

const clock = new Date("2032-04-15T12:00:00Z");
const request = () => crypto.randomUUID();
class AuditSession implements SessionStorage {
  value: Session | null = null;
  get() {
    return this.value;
  }
  set(value: Session | null) {
    this.value = value;
  }
}
async function audit(seed?: Database) {
  const store = new IndexedDbStore(`independent-${request()}`);
  await store.replace(seed ?? (await createSeed(clock)));
  const service = new DemoService(store, new AuditSession(), () => clock);
  await service.signIn("coordinator@example.test", DEMO_PASSWORD);
  return { store, service };
}
afterEach(() => vi.restoreAllMocks());
describe("independent adversarial verification", () => {
  it("IV-02 derives the unsaved role year preference from its actual records", async () => {
    const { service } = await audit();
    await service.signIn("student@example.test", DEMO_PASSWORD);
    const view = await service.read();
    expect(preferencesOf(view, "student-1").academicYear).toBe("2032-2033");
  });
  it("IV-01 reads existing records without requiring a successful write", async () => {
    const { store } = await audit();
    vi.spyOn(IDBObjectStore.prototype, "put").mockImplementation(() => {
      throw new DOMException("Write quota exhausted", "QuotaExceededError");
    });
    await expect(store.read()).resolves.toMatchObject({
      revision: 0,
      students: expect.any(Array),
    });
  });
  it("IV-02 uses the injected business clock for scoped availability", async () => {
    const { service } = await audit();
    const view = await service.read();
    expect(view.availability?.["opp-1"].eligible).toBe(true);
    await service.signIn("student5@example.test", DEMO_PASSWORD);
    expect(
      (await service.read()).opportunities.some((o) => o.id === "opp-1"),
    ).toBe(true);
  });
  it("IV-03 hides unrelated unapproved postings from students, retaining own history", async () => {
    const { service } = await audit();
    await service.signIn("student@example.test", DEMO_PASSWORD);
    const view = await service.read();
    expect(view.opportunities.some((o) => o.id === "opp-3")).toBe(false);
    expect(view.opportunities.some((o) => o.id === "opp-1")).toBe(true);
  });
  it("IV-04 rejects unknown commands without success receipts or mutations", async () => {
    const { store, service } = await audit();
    const before = await store.read();
    await expect(
      service.execute(
        { type: "unknown.operation" } as unknown as Command,
        request(),
      ),
    ).rejects.toMatchObject({ code: "VALIDATION" });
    expect(await store.read()).toEqual(before);
  });
  it("IV-05 rejects an idempotency key reused for a different intent", async () => {
    const { store, service } = await audit();
    const key = request();
    const first: Command = {
      type: "requirement.save",
      input: {
        name: "Audit first",
        description: "Synthetic first",
        classification: "Optional",
      },
    };
    await service.execute(first, key);
    const before = await store.read();
    await expect(
      service.execute(
        { ...first, input: { ...first.input, name: "Audit second" } },
        key,
      ),
    ).rejects.toMatchObject({ code: "CONFLICT" });
    expect(await store.read()).toEqual(before);
  });
  it("IV-06 accepts mathematically complete fractional hours consistently", async () => {
    const seed = await createSeed(clock);
    const placement = seed.placements.find((p) => p.id === "PL-001")!;
    placement.requiredHours = 1;
    seed.reports = seed.reports.filter((r) => r.placementId !== placement.id);
    [0.7, 0.1, 0.1, 0.1].forEach((value, index) =>
      seed.reports.push({
        id: `audit-report-${index}`,
        placementId: placement.id,
        workDate: `2032-04-${11 + index}`,
        hours: value,
        tasks: "Synthetic fractional work",
        submittedAt: clock.toISOString(),
        status: "Reviewed",
        remarks: "Independently reviewed",
        reviewerId: "faculty-1",
        reviewedAt: clock.toISOString(),
      }),
    );
    seed.evaluations
      .filter((e) => e.placementId === placement.id)
      .forEach((e) =>
        Object.assign(e, {
          status: "Submitted",
          grade: 80,
          comments: "Independent synthetic assessment",
          submittedAt: clock.toISOString(),
        }),
      );
    const { store, service } = await audit(seed);
    const data = await store.read();
    await expect(
      service.execute(
        { type: "placement.complete", id: placement.id },
        request(),
      ),
    ).resolves.toBe(placement.id);
    expect(hours(data, placement.id)).toMatchObject({
      reviewed: 1,
      remaining: 0,
      percent: 100,
    });
    expect(completionProblems(data, placement.id)).toEqual([]);
    await expect(
      service.execute(
        { type: "placement.complete", id: placement.id },
        request(),
      ),
    ).resolves.toBe(placement.id);
    expect(
      (await store.read()).placements.find((p) => p.id === placement.id)
        ?.status,
    ).toBe("Completed");
  });
  it.each(["student", "company", "opportunity"])(
    "IV-07 rejects malformed academic year in %s maintenance",
    async (module) => {
      const { store, service } = await audit();
      const db = await store.read();
      const command =
        module === "student"
          ? {
              type: "student.save",
              id: db.students[0].id,
              input: { ...db.students[0], academicYear: "not-a-year" },
            }
          : module === "company"
            ? {
                type: "company.save",
                id: db.companies[0].id,
                input: { ...db.companies[0], academicYear: "not-a-year" },
              }
            : {
                type: "opportunity.save",
                id: db.opportunities[0].id,
                input: { ...db.opportunities[0], academicYear: "not-a-year" },
              };
      await expect(
        service.execute(command as Command, request()),
      ).rejects.toMatchObject({ code: "VALIDATION" });
      expect(await store.read()).toEqual(db);
    },
  );
  it("IV-08 rejects punctuation-only contact numbers", async () => {
    const { store, service } = await audit();
    const db = await store.read();
    await expect(
      service.execute(
        {
          type: "company.save",
          id: db.companies[0].id,
          input: { ...db.companies[0], phone: "-----" },
        },
        request(),
      ),
    ).rejects.toMatchObject({ code: "VALIDATION" });
    expect(await store.read()).toEqual(db);
  });
  it.each(["NaN grade", "invalid receipts", "duplicate profile"])(
    "IV-09 surfaces corrupt %s data as a storage error",
    async (kind) => {
      const seed = await createSeed(clock);
      if (kind === "NaN grade")
        seed.evaluations.find((e) => e.status === "Submitted")!.grade = NaN;
      if (kind === "invalid receipts")
        seed.receipts = [null] as unknown as Database["receipts"];
      if (kind === "duplicate profile")
        seed.students[1].accountId = seed.students[0].accountId;
      const store = new IndexedDbStore(`independent-corrupt-${request()}`);
      await store.replace(seed);
      await expect(store.read()).rejects.toMatchObject({
        code: "STORAGE_UNAVAILABLE",
      });
    },
  );
  it("independently reconciles seven report categories and filtered raw totals", async () => {
    const { service } = await audit();
    const db = await service.read();
    const counts: Record<string, number> = {
      Students: 6,
      "Industry Partners": 4,
      Opportunities: 4,
      Applications: 6,
      Placements: 3,
      Progress: 3,
      Evaluations: 6,
    };
    for (const category of Object.keys(counts)) {
      const report = generateReport(
        db,
        {
          category: category as Parameters<
            typeof generateReport
          >[1]["category"],
          academicYear: "2032-2033",
          companyId: "",
          status: "",
        },
        clock.toISOString(),
      );
      expect(report.rows).toHaveLength(counts[category]);
      expect(report.totals.Records).toBe(counts[category]);
    }
    const progress = generateReport(db, {
      category: "Progress",
      academicYear: "2032-2033",
      companyId: "company-1",
      status: "Ongoing",
    });
    expect(progress.rows).toHaveLength(1);
    expect(progress.totals).toMatchObject({
      "Required hours": 80,
      "Submitted hours": 16,
      "Reviewed hours": 8,
    });
  });
});
