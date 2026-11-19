import { Database, DataStore, Session } from "../app/lib/domain";
import { createSeed } from "../app/lib/seed";
import { DemoService, SessionStorage } from "../app/lib/service";
export const now = new Date("2026-11-19T08:00:00.000Z");
export class MemoryStore implements DataStore {
  constructor(public state: Database) {}
  async read() {
    return structuredClone(this.state);
  }
  async update<T>(fn: (db: Database) => T) {
    const copy = structuredClone(this.state);
    const result = fn(copy);
    this.state = copy;
    return result;
  }
}
export class MemorySession implements SessionStorage {
  value: Session | null = null;
  get() {
    return this.value;
  }
  set(value: Session | null) {
    this.value = value;
  }
}
export async function fixture() {
  const store = new MemoryStore(await createSeed(now)),
    session = new MemorySession();
  let sequence = 0;
  const service = new DemoService(
    store,
    session,
    () => now,
    () => `test-${++sequence}`,
  );
  return { store, session, service };
}
