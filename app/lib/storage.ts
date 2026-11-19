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
    if (!this.connection)
      this.connection = new Promise((resolve, reject) => {
        if (typeof indexedDB === "undefined")
          return reject(
            new AppError(
              "STORAGE_UNAVAILABLE",
              "This browser does not provide IndexedDB. Enable browser storage to use demonstration mode.",
            ),
          );
        const request = indexedDB.open(this.name, 1);
        request.onupgradeneeded = () =>
          request.result.createObjectStore("state");
        request.onsuccess = () => {
          request.result.onversionchange = () => {
            request.result.close();
            this.connection = undefined;
          };
          resolve(request.result);
        };
        request.onerror = () => {
          this.connection = undefined;
          reject(
            new AppError(
              "STORAGE_UNAVAILABLE",
              "Could not open browser-local demonstration storage.",
            ),
          );
        };
        request.onblocked = () =>
          reject(
            new AppError(
              "STORAGE_UNAVAILABLE",
              "Another tab is blocking the demonstration storage update. Close it and retry.",
            ),
          );
      });
    return this.connection;
  }
  async read(): Promise<Database> {
    return this.update((db) => structuredClone(db));
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
