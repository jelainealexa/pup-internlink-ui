import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

if (!process.argv[2])
  throw new Error(
    "Usage: node scripts/deployment-smoke.mjs <actual-origin> [result.json]",
  );
const origin = new URL(process.argv[2]).origin;
if (!/^https?:/.test(origin))
  throw new Error("An HTTP or HTTPS origin is required.");
const output = process.argv[3] ?? "test-results/deployment-smoke.json";
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
});
const result = {
  origin,
  startedAt: new Date().toISOString(),
  roles: [],
  pageErrors: [],
  status: "UNVERIFIED",
};
try {
  for (const [account, heading] of [
    ["coordinator", "Coordinator overview"],
    ["student", "Student dashboard"],
    ["faculty", "Faculty Adviser dashboard"],
    ["company", "Company Supervisor dashboard"],
    ["supervisor", "Intern Supervisor dashboard"],
  ]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => result.pageErrors.push(error.message));
    const response = await page.goto(origin);
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: "Demonstration sign in" }),
    ).toBeVisible();
    const password = page.getByLabel("Password *", { exact: true });
    await password.fill("InternLink!2026");
    await expect(password).toHaveAttribute("type", "password");
    await page
      .getByRole("button", { name: "Show password", exact: true })
      .click();
    await expect(password).toHaveAttribute("type", "text");
    await expect(password).toHaveValue("InternLink!2026");
    await page
      .getByRole("button", { name: "Hide password", exact: true })
      .click();
    await page.getByLabel("Email address").fill(`${account}@example.test`);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
    expect(await page.locator(".metric-links a").count()).toBeGreaterThan(0);
    await page.goto(origin + "/dashboard/settings");
    await page.getByLabel("Larger interface text", { exact: true }).check();
    await page
      .getByRole("button", { name: "Save Preferences", exact: true })
      .click();
    await expect(page.locator(".application")).toHaveClass(/larger-text/);
    await page.reload();
    await expect(
      page.getByLabel("Larger interface text", { exact: true }),
    ).toBeChecked();
    await page.goto(origin + "/dashboard");
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole("button", { name: "Collapse navigation", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Open navigation", exact: true }),
    ).toHaveAttribute("aria-expanded", "false");
    result.roles.push({
      account: `${account}@example.test`,
      heading,
      eyeToggle: true,
      login: true,
      dashboard: true,
      savedPreferenceAfterRefresh: true,
      directNavigation: true,
      mobile: true,
    });
    await context.close();
  }
  expect(result.pageErrors).toEqual([]);
  result.status = "PASS";
} catch (error) {
  result.status = "FAIL";
  result.error = error instanceof Error ? error.message : String(error);
  throw error;
} finally {
  result.finishedAt = new Date().toISOString();
  await writeFile(output, JSON.stringify(result, null, 2) + "\n");
  await browser.close();
}
console.log(
  `${origin}: ${result.roles.length} role smoke journeys passed; ${result.pageErrors.length} page errors.`,
);
