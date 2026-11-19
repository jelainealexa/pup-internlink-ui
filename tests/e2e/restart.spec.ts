import { chromium, expect, test } from "@playwright/test";
import { fillStudent, login } from "./helpers";
test("saved synthetic records and demonstration session survive a supported browser restart", async ({
  baseURL,
}) => {
  const directory = test.info().outputPath("restart-profile");
  const options = {
    headless: true,
    baseURL,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  };
  const first = await chromium.launchPersistentContext(directory, options);
  try {
    const page = await first.newPage();
    await login(page);
    await page.goto("/dashboard/students/create");
    await fillStudent(
      page,
      "SYN-RESTART-001",
      "restart@example.test",
      "Restart",
    );
    await page
      .getByRole("button", { name: "Save Student", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Restart Synthetic", exact: true }),
    ).toBeVisible();
  } finally {
    await first.close();
  }
  const second = await chromium.launchPersistentContext(directory, options);
  try {
    const page = await second.newPage();
    await page.goto("/dashboard/students?q=SYN-RESTART-001");
    await expect(page.locator("tbody tr")).toHaveCount(1);
    await expect(page.locator("tbody")).toContainText("Restart Synthetic");
    await expect(
      page.getByRole("button", { name: "Log out", exact: true }),
    ).toBeVisible();
  } finally {
    await second.close();
  }
});
