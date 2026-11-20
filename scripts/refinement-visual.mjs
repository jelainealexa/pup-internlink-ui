import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const phase = process.argv[2] ?? "before";
const reference = phase === "reference";
const origin = reference
  ? "https://pup-internlink-ui.vercel.app"
  : "http://127.0.0.1:3000";
const output = path.resolve("../pup-internlink-ui-refinement-artifacts", phase);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
    "C:/Users/User 1/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
});
const results = [];
const routes = [
  ["dashboard", "/dashboard"],
  ["students", "/dashboard/students"],
  ["partners", "/dashboard/partners"],
  ["opportunities", "/dashboard/internships"],
  ["applications", "/dashboard/applications"],
  ["placements", "/dashboard/placements"],
  ["requirements", "/dashboard/requirements"],
  ["progress", "/dashboard/progress"],
  ["evaluations", "/dashboard/evaluations"],
  ["reports", "/dashboard/reports"],
  ["settings", "/dashboard/settings"],
];
async function capture(page, name, route) {
  const response = await page.goto(origin + route);
  if (!reference && route.startsWith("/dashboard"))
    await page.locator("#main-content h1").waitFor();
  else await page.locator("h1").first().waitFor();
  await page.screenshot({
    path: path.join(output, `${name}.png`),
    fullPage: true,
  });
  const geometry = await page.evaluate(() => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
    title: document.querySelector("h1")?.textContent,
    background: getComputedStyle(document.body).backgroundColor,
    font: getComputedStyle(document.body).fontFamily,
    sidebar: document.querySelector(".sidebar-shell")?.getBoundingClientRect()
      .width,
  }));
  results.push({ name, route, status: response?.status(), ...geometry });
  if (
    phase === "after" &&
    [
      "dashboard",
      "settings",
      "login",
      "activation",
      "forgot-password",
    ].includes(name)
  ) {
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    results.push({
      name,
      axeViolations: scan.violations.map(({ id, impact, nodes }) => ({
        id,
        impact,
        targets: nodes.map((n) => n.target),
      })),
    });
  }
}
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  if (!reference) {
    await capture(page, "login", "/");
    await capture(page, "activation", "/activate");
    await capture(page, "forgot-password", "/forgot-password");
    await page.goto(origin);
    await page.getByLabel("Email address").fill("coordinator@example.test");
    await page.getByLabel("Password", { exact: false }).fill("InternLink!2026");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.getByRole("button", { name: "Log out", exact: true }).waitFor();
  }
  for (const [name, route] of routes) await capture(page, name, route);
  if (!reference) {
    await capture(page, "student-form", "/dashboard/students/create");
    await capture(page, "placement-detail", "/dashboard/placements/PL-001");
    await capture(
      page,
      "progress-review",
      "/dashboard/progress/reports/PR-002",
    );
    if (phase === "after") {
      await page.goto(origin + "/dashboard/internships/opp-1");
      await page
        .getByRole("button", { name: "Deactivate Posting", exact: true })
        .click();
      await page.getByRole("dialog").waitFor();
      await page.screenshot({
        path: path.join(output, "posting-dialog.png"),
        fullPage: false,
      });
      await page.keyboard.press("Escape");
      results.push({
        name: "dialog",
        dismissedWithEscape: (await page.getByRole("dialog").count()) === 0,
      });
    }
  }
  for (const width of [360, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await capture(page, `mobile-${width}`, "/dashboard");
    if (phase === "after" && width <= 390) {
      await page
        .getByRole("button", { name: "Collapse navigation", exact: true })
        .click();
      await page.screenshot({
        path: path.join(output, `mobile-${width}-navigation-closed.png`),
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Open navigation", exact: true })
        .click();
    }
  }
  await context.close();
  if (!reference) {
    for (const role of ["student", "faculty", "company", "supervisor"]) {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
      });
      const page = await context.newPage();
      await page.goto(origin);
      await page.getByLabel("Email address").fill(`${role}@example.test`);
      await page
        .getByLabel("Password", { exact: false })
        .fill("InternLink!2026");
      await page.getByRole("button", { name: "Sign in", exact: true }).click();
      await page
        .getByRole("button", { name: "Log out", exact: true })
        .waitFor();
      await capture(page, `${role}-dashboard`, "/dashboard");
      if (phase === "after") {
        const scan = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        results.push({
          role,
          axeViolations: scan.violations.map(({ id, impact, nodes }) => ({
            id,
            impact,
            targets: nodes.map((n) => n.target),
          })),
        });
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await capture(page, `${role}-mobile`, "/dashboard");
      await context.close();
    }
  }
} finally {
  await writeFile(
    path.join(output, "observations.json"),
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}
console.log(`${phase}: ${results.length} observations saved to ${output}`);
