import {
  Account,
  AppError,
  Attachment,
  Command,
  Database,
  DataStore,
  InternLinkService,
  Session,
} from "./domain";
import { applyCommand, scopedDatabase } from "./commands";
import { createSeed, DEMO_PASSWORD, passwordVerifier } from "./seed";
import { get } from "./rules";
import { IndexedDbStore } from "./storage";

export const SESSION_KEY = "pup-internlink-demo-session-v1";
export interface SessionStorage {
  get(): Session | null;
  set(session: Session | null): void;
}
export class BrowserSessionStorage implements SessionStorage {
  get() {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (!data) return null;
      const value = JSON.parse(data);
      if (
        !value ||
        typeof value !== "object" ||
        typeof value.accountId !== "string" ||
        typeof value.expiresAt !== "number" ||
        !Number.isFinite(value.expiresAt)
      ) {
        this.set(null);
        return null;
      }
      return value as Session;
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.set(null);
        return null;
      }
      throw new AppError(
        "STORAGE_UNAVAILABLE",
        "The local demonstration session cannot be read. Enable browser storage or use the explicit recovery reset.",
      );
    }
  }
  set(value: Session | null) {
    try {
      if (value) localStorage.setItem(SESSION_KEY, JSON.stringify(value));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      throw new AppError(
        "STORAGE_UNAVAILABLE",
        "The demonstration session could not be saved or cleared.",
      );
    }
  }
}
export class DemoService implements InternLinkService {
  readonly mode = "demo" as const;
  private listeners = new Set<() => void>();
  private channel?: BroadcastChannel;
  constructor(
    private store: DataStore,
    private sessions: SessionStorage,
    private clock = () => new Date(),
    private makeId = () => crypto.randomUUID(),
  ) {}
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    if (
      !this.channel &&
      typeof window !== "undefined" &&
      typeof BroadcastChannel !== "undefined"
    ) {
      this.channel = new BroadcastChannel("pup-internlink-demo-updates-v1");
      this.channel.onmessage = () => this.listeners.forEach((fn) => fn());
    }
    const storage = (event: StorageEvent) => {
      if (event.key === SESSION_KEY) listener();
    };
    if (typeof window !== "undefined")
      window.addEventListener("storage", storage);
    return () => {
      this.listeners.delete(listener);
      if (typeof window !== "undefined")
        window.removeEventListener("storage", storage);
      if (!this.listeners.size) {
        this.channel?.close();
        this.channel = undefined;
      }
    };
  }
  private notify() {
    this.listeners.forEach((fn) => fn());
    this.channel?.postMessage("changed");
  }
  async signIn(email: string, password: string): Promise<Account> {
    if (!email.trim() || !password)
      throw new AppError("VALIDATION", "Email and password are required.");
    const db = await this.store.read();
    const account = db.accounts.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!account || account.verifier !== (await passwordVerifier(password)))
      throw new AppError(
        "UNAUTHENTICATED",
        "Invalid demonstration email or password.",
      );
    if (!account.active)
      throw new AppError(
        "FORBIDDEN",
        "This demonstration account is inactive.",
      );
    this.sessions.set({
      accountId: account.id,
      expiresAt: this.clock().getTime() + 8 * 3600000,
    });
    this.notify();
    return { ...account, verifier: "" };
  }
  async signOut() {
    this.sessions.set(null);
    this.notify();
  }
  private actor(db: Database): Account | null {
    const session = this.sessions.get();
    if (!session) return null;
    const account = db.accounts.find((a) => a.id === session.accountId);
    if (session.expiresAt <= this.clock().getTime() || !account?.active) {
      this.sessions.set(null);
      return null;
    }
    return account;
  }
  async currentAccount() {
    if (!this.sessions.get()) return null;
    const actor = this.actor(await this.store.read());
    return actor ? { ...actor, verifier: "" } : null;
  }
  async read() {
    const db = await this.store.read();
    const actor = this.actor(db);
    if (!actor)
      throw new AppError(
        "UNAUTHENTICATED",
        "Sign in with an active demonstration account. Your previous session may have expired.",
      );
    return scopedDatabase(db, actor);
  }
  async execute(
    command: Command,
    requestId: string,
    expectedRevision?: number,
  ) {
    const verifier = await passwordVerifier(DEMO_PASSWORD);
    const result = await this.store.update((db) => {
      const actor = this.actor(db);
      if (!actor)
        throw new AppError(
          "UNAUTHENTICATED",
          "The demonstration session has expired. Sign in again.",
        );
      const receipt = db.receipts.find(
        (r) => r.key === requestId && r.actorId === actor.id,
      );
      if (receipt) return receipt.result;
      if (expectedRevision !== undefined && expectedRevision !== db.revision)
        throw new AppError(
          "CONFLICT",
          "Records changed in another view or tab. Refresh the data and review your inputs before retrying.",
        );
      const value = applyCommand(db, actor.id, command, {
        verifier,
        now: this.clock().toISOString(),
        id: this.makeId,
      });
      db.revision++;
      db.receipts.push({ key: requestId, actorId: actor.id, result: value });
      db.receipts = db.receipts.slice(-200);
      return value;
    });
    this.notify();
    return result;
  }
  async attachment(id: string): Promise<Attachment> {
    return get((await this.read()).files, id);
  }
  async reset(confirmation: string) {
    if (confirmation !== "RESET DEMO")
      throw new AppError(
        "VALIDATION",
        "Type RESET DEMO exactly to discard browser-local demonstration data.",
      );
    let damaged = false;
    let saved: Database | undefined;
    try {
      saved = await this.store.read();
    } catch (error) {
      if (error instanceof AppError && error.code === "STORAGE_UNAVAILABLE")
        damaged = true;
      else throw error;
    }
    if (!damaged) {
      const actor = this.actor(saved!);
      if (actor?.role !== "Coordinator")
        throw new AppError(
          "FORBIDDEN",
          "Only a coordinator can reset valid demonstration data.",
        );
    }
    const seed = await createSeed(this.clock());
    if (damaged && this.store instanceof IndexedDbStore)
      await this.store.replace(seed);
    else
      await this.store.update((db) => {
        Object.assign(db, seed);
      });
    this.sessions.set(null);
    this.notify();
  }
}

/** A deliberately unavailable client boundary; never silently falls back to demo storage. */
export class UnconnectedApiService implements InternLinkService {
  readonly mode = "api" as const;
  private unavailable(): never {
    throw new AppError(
      "BACKEND_UNAVAILABLE",
      "API mode is not connected. Supply an approved backend adapter; no demonstration data was read or written.",
    );
  }
  async signIn(): Promise<Account> {
    return this.unavailable();
  }
  async signOut(): Promise<void> {
    return this.unavailable();
  }
  async currentAccount(): Promise<Account | null> {
    return this.unavailable();
  }
  async read(): Promise<Database> {
    return this.unavailable();
  }
  async execute(): Promise<string> {
    return this.unavailable();
  }
  async attachment(): Promise<Attachment> {
    return this.unavailable();
  }
  async reset(): Promise<void> {
    return this.unavailable();
  }
  subscribe() {
    return () => {};
  }
}
export function createService(
  mode = process.env.NEXT_PUBLIC_DATA_MODE ?? "demo",
): InternLinkService {
  if (mode === "api") return new UnconnectedApiService();
  if (mode !== "demo")
    throw new AppError(
      "BACKEND_UNAVAILABLE",
      "Invalid data mode. Configure demo or provide an approved API adapter.",
    );
  return new DemoService(new IndexedDbStore(), new BrowserSessionStorage());
}
