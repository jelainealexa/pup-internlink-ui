import { expect, Page } from "@playwright/test";
import type { Database } from "../../app/lib/domain";
import { createSeed } from "../../app/lib/seed";
export const auditPassword = "InternLink!2026";
export async function prepareEmptyCoordinator(page: Page) {
  const snapshot = await createSeed();
  snapshot.accounts = snapshot.accounts.filter((a) => a.role === "Coordinator");
  for (const key of [
    "students",
    "companies",
    "faculty",
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
  ] as const)
    snapshot[key] = [];
  await page.addInitScript((fixture) => {
    Reflect.set(
      window,
      "auditFixtureReady",
      new Promise<void>((resolve, reject) => {
        const request = indexedDB.open("pup-internlink-demo-v1", 1);
        request.onupgradeneeded = () =>
          request.result.createObjectStore("state");
        request.onerror = () =>
          reject(new Error("Fixture initialization failed"));
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction("state", "readwrite");
          const store = tx.objectStore("state");
          const get = store.get("snapshot");
          get.onsuccess = () => {
            if (get.result === undefined) store.put(fixture, "snapshot");
          };
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onabort = () => reject(new Error("Fixture transaction failed"));
        };
      }),
    );
  }, snapshot);
  await page.goto("/");
  expect(
    await page.evaluate(() => Reflect.has(window, "auditFixtureReady")),
  ).toBe(true);
  await page.evaluate(() => Reflect.get(window, "auditFixtureReady"));
}
export async function auditLogin(
  page: Page,
  email = "coordinator@example.test",
) {
  await page.goto("/");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: false }).fill(auditPassword);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Log out", exact: true }),
  ).toBeVisible();
}
export async function auditLogout(page: Page) {
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Demonstration sign in" }),
  ).toBeVisible();
}
export async function auditConfirm(page: Page) {
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Confirm", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
}
export const auditDay = (offset = 0) =>
  new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
export async function auditSnapshot(page: Page): Promise<Database> {
  return page.evaluate(
    () =>
      new Promise<Database>((resolve, reject) => {
        const open = indexedDB.open("pup-internlink-demo-v1", 1);
        open.onerror = () =>
          reject(new Error("Could not inspect persisted audit data"));
        open.onsuccess = () => {
          const db = open.result;
          const transaction = db.transaction("state", "readonly");
          const read = transaction.objectStore("state").get("snapshot");
          read.onerror = () =>
            reject(new Error("Could not read persisted audit data"));
          read.onsuccess = () => {
            const snapshot = read.result as Database;
            resolve({
              ...snapshot,
              files: [],
              accounts: snapshot.accounts.map((account) => ({
                ...account,
                verifier: "",
              })),
            });
          };
          transaction.oncomplete = () => db.close();
        };
      }),
  );
}
export async function downloadBytes(page: Page) {
  const pending = page.waitForEvent("download");
  await page.getByRole("link", { name: /^Download / }).click();
  const download = await pending;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}
