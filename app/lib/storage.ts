import { AppError, Database, DataStore } from "./domain";
import { createSeed } from "./seed";
import { assertIntegrity } from "./integrity";

export const DATABASE_NAME = "pup-internlink-demo-v1";
function check(value: unknown): asserts value is Database {
  const s = value as Partial<Database> | null;
  const arrays = [
    "accounts",
    "students",
    "faculty",
    "companies",
    "supervisors",
    "requirements",
    "submissions",
    "files",
    "opportunities",
    "applications",
    "placements",
    "reports",
    "evaluations",
    "certificates",
    "activities",
    "receipts",
  ] as const;
  if (
    !s ||
    s.schemaVersion !== 1 ||
    !Number.isInteger(s.revision) ||
    !s.preferences ||
    arrays.some((key) => !Array.isArray(s[key]))
  )
    throw new AppError(
      "STORAGE_UNAVAILABLE",
      "Saved demonstration data has an unsupported or damaged format. It has not been overwritten. Use the deliberate recovery reset if you want to discard it.",
    );
}
export class IndexedDbStore implements DataStore {
  private connection?: Promise<IDBDatabase>;
  constructor(private name = DATABASE_NAME) {}
  private open(): Promise<IDBDatabase> {
    if (!this.connection) {
      let blocked = false;
      const pending = new Promise<IDBDatabase>((resolve, reject) => {
        if (typeof indexedDB === "undefined")
          return reject(
            new AppError(
              "STORAGE_UNAVAILABLE",
              "This browser does not provide IndexedDB. Enable browser storage to use demonstration mode.",
            ),
          );
        let request: IDBOpenDBRequest;
        try {
          request = indexedDB.open(this.name, 1);
        } catch {
          reject(
            new AppError(
              "STORAGE_UNAVAILABLE",
              "Browser storage is currently blocked. Enable storage and retry loading.",
            ),
          );
          return;
        }
        request.onupgradeneeded = () =>
          request.result.createObjectStore("state");
        request.onsuccess = () => {
          if (blocked) {
            request.result.close();
            return;
          }
          request.result.onversionchange = () => {
            request.result.close();
            this.connection = undefined;
          };
          resolve(request.result);
        };
        request.onerror = () => {
          reject(
            new AppError(
              "STORAGE_UNAVAILABLE",
              "Could not open browser-local demonstration storage.",
            ),
          );
        };
        request.onblocked = () => {
          blocked = true;
          reject(
            new AppError(
              "STORAGE_UNAVAILABLE",
              "Another tab is blocking the demonstration storage update. Close it and retry.",
            ),
          );
        };
      });
      this.connection = pending;
      void pending.catch(() => {
        if (this.connection === pending) this.connection = undefined;
      });
    }
    return this.connection;
  }
  async read(): Promise<Database> {
    const connection = await this.open();
    const existing = await new Promise<Database | undefined>(
      (resolve, reject) => {
        const tx = connection.transaction("state", "readonly");
        const request = tx.objectStore("state").get("snapshot");
        let value: Database | undefined;
        let failure: unknown;
        request.onsuccess = () => {
          try {
            if (request.result !== undefined) {
              check(request.result);
              assertIntegrity(request.result);
              value = request.result;
            }
          } catch (error) {
            failure = error;
            tx.abort();
          }
        };
        tx.oncomplete = () => resolve(value);
        tx.onabort = () =>
          reject(
            failure ??
              new AppError(
                "STORAGE_UNAVAILABLE",
                "Saved demonstration records could not be read. They have not been overwritten.",
              ),
          );
      },
    );
    return existing ?? this.update((db) => structuredClone(db));
  }
  async update<T>(change: (database: Database) => T): Promise<T> {
    const seed = await createSeed();
    const connection = await this.open();
    return new Promise((resolve, reject) => {
      const tx = connection.transaction("state", "readwrite");
      const store = tx.objectStore("state");
      const read = store.get("snapshot");
      let result: T;
      let failure: unknown;
      read.onsuccess = () => {
        try {
          const state: unknown = read.result === undefined ? seed : read.result;
          check(state);
          assertIntegrity(state);
          result = change(state);
          assertIntegrity(state);
          store.put(state, "snapshot");
        } catch (error) {
          failure = error;
          tx.abort();
        }
      };
      tx.oncomplete = () => resolve(result);
      tx.onabort = () =>
        reject(
          failure ??
            new AppError(
              "STORAGE_UNAVAILABLE",
              "The change could not be saved. Storage may be full or unavailable. No partial change was committed.",
            ),
        );
      tx.onerror = () => {
        /* onabort provides the transaction-level result */
      };
    });
  }
  async replace(seed: Database): Promise<void> {
    const connection = await this.open();
    return new Promise((resolve, reject) => {
      const tx = connection.transaction("state", "readwrite");
      tx.objectStore("state").put(seed, "snapshot");
      tx.oncomplete = () => resolve();
      tx.onabort = () =>
        reject(
          new AppError(
            "STORAGE_UNAVAILABLE",
            "The deliberate reset could not be saved.",
          ),
        );
    });
  }
}
