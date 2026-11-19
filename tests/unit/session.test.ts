// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { BrowserSessionStorage, SESSION_KEY } from "../../app/lib/service";

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});
it.each([
  "null",
  "[]",
  "{}",
  '"text"',
  "{invalid JSON",
  '{"accountId":"coord-1","expiresAt":"bad"}',
])("clears malformed session marker %s without granting access", (marker) => {
  localStorage.setItem(SESSION_KEY, marker);
  expect(new BrowserSessionStorage().get()).toBeNull();
  expect(localStorage.getItem(SESSION_KEY)).toBeNull();
});
it("round trips a nonsecret account/expiry marker and clears it on logout", () => {
  const store = new BrowserSessionStorage();
  const session = { accountId: "coord-1", expiresAt: Date.now() + 3600000 };
  store.set(session);
  expect(store.get()).toEqual(session);
  expect(localStorage.getItem(SESSION_KEY)).not.toContain("password");
  store.set(null);
  expect(store.get()).toBeNull();
});
it("reports unavailable browser session storage instead of fake success", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new DOMException("Storage disabled", "SecurityError");
  });
  expect(() => new BrowserSessionStorage().get()).toThrow(/cannot be read/);
});
