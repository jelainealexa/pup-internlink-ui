import { expect, test } from "@playwright/test";
import { login } from "./helpers";
import AxeBuilder from "@axe-core/playwright";

test("eye toggle preserves login input, supports keyboard and stays inside the field", async ({
  page,
}) => {
  await page.goto("/");
  const input = page.getByLabel("Password *", { exact: true });
  await input.fill("InternLink!2026");
  const toggle = input.locator("..").getByRole("button");
  await expect(toggle).toHaveAccessibleName("Show password");
  await expect(input).toHaveAttribute("type", "password");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(input).toHaveAttribute("type", "text");
  await expect(toggle).toHaveAccessibleName("Hide password");
  await expect(input).toHaveValue("InternLink!2026");
  await expect(page).toHaveURL(/\/$/);
  const field = (await input.boundingBox())!;
  const button = (await toggle.boundingBox())!;
  expect(button.x).toBeGreaterThan(field.x);
  expect(button.x + button.width).toBeLessThanOrEqual(field.x + field.width);
  expect(
    Math.abs(button.y + button.height / 2 - field.y - field.height / 2),
  ).toBeLessThan(1);
  expect(
    await toggle.evaluate((el) => getComputedStyle(el).outlineStyle),
  ).not.toBe("none");
  await page.keyboard.press("Space");
  await expect(input).toHaveAttribute("type", "password");
  await page.getByLabel("Email address").fill("coordinator@example.test");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Log out", exact: true }),
  ).toBeVisible();
});

test("all five portals retain accessible responsive navigation and contained tables", async ({
  browser,
}) => {
  test.setTimeout(180000);
  for (const email of [
    "coordinator",
    "student",
    "faculty",
    "company",
    "supervisor",
  ]) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await login(page, `${email}@example.test`);
    const groups = await page.locator(".sidebar-group-label").allTextContents();
    expect(new Set(groups).size).toBe(groups.length);
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibility.violations).toEqual([]);
    for (const width of [360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const collapse = page.getByRole("button", {
        name: "Collapse navigation",
        exact: true,
      });
      await collapse.focus();
      await page.keyboard.press("Enter");
      const expand = page.getByRole("button", {
        name: "Open navigation",
        exact: true,
      });
      await expect(expand).toHaveAttribute("aria-expanded", "false");
      await page.keyboard.press("Enter");
      await expect(
        page.getByRole("navigation", { name: "Workspace modules" }),
      ).toBeVisible();
    }
    await page.goto("/dashboard/placements");
    await expect(page.locator("#main-content h1")).toHaveCount(1);
    await page.setViewportSize({ width: 360, height: 800 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const table = page.locator(".table-shell").first();
    if (await table.count())
      expect(await table.evaluate((el) => getComputedStyle(el).overflowX)).toBe(
        "auto",
      );
    await context.close();
  }
});

test("activation, recovery and account settings use independent password controls", async ({
  page,
}) => {
  for (const route of ["/activate", "/reset-password"]) {
    await page.goto(route);
    const password = page.locator("input[name=password]");
    const confirmation = page.locator("input[name=confirmPassword]");
    await password.fill("Independent!2026");
    await confirmation.fill("Independent!2026");
    await page
      .getByRole("button", {
        name: route === "/activate" ? "Show password" : "Show new password",
        exact: true,
      })
      .click();
    await expect(password).toHaveAttribute("type", "text");
    await expect(confirmation).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: /Show confirm/ }).click();
    await expect(confirmation).toHaveAttribute("type", "text");
    await expect(password).toHaveValue("Independent!2026");
    await expect(confirmation).toHaveValue("Independent!2026");
  }
  await login(page);
  await page.goto("/dashboard/settings");
  const fields = page.locator(".password-input input");
  expect(await fields.count()).toBeGreaterThanOrEqual(4);
  for (const field of await fields.all())
    await expect(field).toHaveAttribute("type", "password");
  await page
    .getByRole("button", { name: "Show new password", exact: true })
    .click();
  await expect(page.locator("input[name=newPassword]")).toHaveAttribute(
    "type",
    "text",
  );
  await expect(page.locator("input[name=confirmPassword]")).toHaveAttribute(
    "type",
    "password",
  );
  await expect(
    page.locator(".password-input input[type=password]"),
  ).toHaveCount((await fields.count()) - 1);
});
