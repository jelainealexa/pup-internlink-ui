# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: independent.spec.ts >> IV-11: unauthenticated contextual placement URL survives sign in
- Location: tests\e2e\independent.spec.ts:55:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Create placement', exact: true })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Create placement', exact: true }) with timeout 10000ms
  - waiting for getByRole('heading', { name: 'Create placement', exact: true })

```

```yaml
- link "Skip to main content":
  - /url: "#main-content"
- banner:
  - link "PUP INTERNLINK":
    - /url: /dashboard
  - paragraph: Internship Coordination Workspace
  - strong: Alex Demo
  - text: Coordinator · 2026-2027
  - button "Log out"
  - text: Demonstration mode · Synthetic data stored in this browser only · Simulated access controls
- complementary:
  - strong: Coordinator
  - button "Collapse navigation" [expanded]: ←
  - navigation "Workspace modules":
    - link "01 Overview":
      - /url: /dashboard
    - link "02 Students":
      - /url: /dashboard/students
    - link "03 Industry Partners":
      - /url: /dashboard/partners
    - link "04 Requirements":
      - /url: /dashboard/requirements
    - link "05 Opportunities":
      - /url: /dashboard/internships
    - link "06 Applications":
      - /url: /dashboard/applications
    - link "07 Placements":
      - /url: /dashboard/placements
    - link "08 Progress Monitoring":
      - /url: /dashboard/progress
    - link "09 Evaluations":
      - /url: /dashboard/evaluations
    - link "10 Reports & Analytics":
      - /url: /dashboard/reports
    - link "11 Settings":
      - /url: /dashboard/settings
- main:
  - text: INTERNSHIP COORDINATION
  - heading "Choose an accepted application" [level=1]
  - paragraph: Open an accepted application's Create Placement action to retrieve its related records.
  - link "Back to workspace":
    - /url: /dashboard/applications?status=Accepted
- alert: Choose an accepted application
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | const password = "InternLink!2026";
  3  | async function enter(
  4  |   page: import("@playwright/test").Page,
  5  |   email = "coordinator@example.test",
  6  | ) {
  7  |   await page.goto("/");
  8  |   await page.getByLabel("Email address").fill(email);
  9  |   await page.getByLabel("Password", { exact: false }).fill(password);
  10 |   await page.getByRole("button", { name: "Sign in", exact: true }).click();
  11 |   await expect(
  12 |     page.getByRole("button", { name: "Log out", exact: true }),
  13 |   ).toBeVisible();
  14 | }
  15 | test("IV-10: a stale edit must not overwrite another tab's persisted student changes", async ({
  16 |   page,
  17 |   context,
  18 | }) => {
  19 |   await enter(page);
  20 |   const peer = await context.newPage();
  21 |   await page.goto("/dashboard/students/2024-0001/edit");
  22 |   await peer.goto("/dashboard/students/2024-0001/edit");
  23 |   await expect(peer.getByLabel("Email *", { exact: true })).toHaveValue(
  24 |     "student@example.test",
  25 |   );
  26 |   await peer.getByLabel("Last name").fill("Peer Synthetic");
  27 |   await page
  28 |     .getByLabel("Email *", { exact: true })
  29 |     .fill("audit-preserved@example.test");
  30 |   await page.getByRole("button", { name: "Save Changes", exact: true }).click();
  31 |   await expect(
  32 |     page.getByRole("heading", { name: "Mira Demo", exact: true }),
  33 |   ).toBeVisible();
  34 |   const observer = await context.newPage();
  35 |   await observer.goto("/dashboard/students/2024-0001");
  36 |   await expect(observer.locator("dl")).toContainText(
  37 |     "audit-preserved@example.test",
  38 |   );
  39 |   await peer.bringToFront();
  40 |   await expect(peer.getByLabel("Email *", { exact: true })).toHaveValue(
  41 |     "student@example.test",
  42 |   );
  43 |   await peer.getByRole("button", { name: "Save Changes", exact: true }).click();
  44 |   await expect(peer.locator(".functional-form [role=alert]")).toContainText(
  45 |     /changed/i,
  46 |   );
  47 |   await expect(peer.getByLabel("Last name")).toHaveValue("Peer Synthetic");
  48 |   await observer.reload();
  49 |   await expect(observer.locator("dl")).toContainText(
  50 |     "audit-preserved@example.test",
  51 |   );
  52 |   await peer.close();
  53 |   await observer.close();
  54 | });
  55 | test("IV-11: unauthenticated contextual placement URL survives sign in", async ({
  56 |   page,
  57 | }) => {
  58 |   await page.goto("/dashboard/placements/create?application=app-002");
  59 |   await expect(
  60 |     page.getByRole("heading", { name: "Demonstration sign in" }),
  61 |   ).toBeVisible();
  62 |   await page.getByLabel("Email address").fill("coordinator@example.test");
  63 |   await page.getByLabel("Password", { exact: false }).fill(password);
  64 |   await page.getByRole("button", { name: "Sign in", exact: true }).click();
  65 |   await expect(
  66 |     page.getByRole("heading", { name: "Create placement", exact: true }),
> 67 |   ).toBeVisible();
     |     ^ Error: expect(locator).toBeVisible() failed
  68 |   await expect(page.getByLabel("Application ID", { exact: false })).toHaveValue(
  69 |     "app-002",
  70 |   );
  71 | });
  72 | test("IV-03: direct navigation does not reveal another draft posting to a student", async ({
  73 |   page,
  74 | }) => {
  75 |   await enter(page, "student@example.test");
  76 |   await page.goto("/dashboard/internships/opp-3");
  77 |   await expect(
  78 |     page.getByRole("heading", { name: "Record not found", exact: true }),
  79 |   ).toBeVisible();
  80 |   await page.goto("/dashboard/internships/opp-1");
  81 |   await expect(
  82 |     page.getByRole("heading", {
  83 |       name: "Software Development Intern",
  84 |       exact: true,
  85 |     }),
  86 |   ).toBeVisible();
  87 | });
  88 | 
```