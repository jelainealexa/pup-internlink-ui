# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: independent.spec.ts >> IV-10: a stale edit must not overwrite another tab's persisted student changes
- Location: tests\e2e\independent.spec.ts:74:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Mira Demo', exact: true })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Mira Demo', exact: true }) with timeout 10000ms
  - waiting for getByRole('heading', { name: 'Mira Demo', exact: true })

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
  - status:
    - text: Student record saved in this browser.
    - button "Dismiss saved message": Dismiss
  - link "← Students":
    - /url: /dashboard/students/2024-0001
  - text: INTERNSHIP COORDINATION
  - heading "Edit student" [level=1]
  - paragraph: A linked synthetic student account is created with the documented public demo password. No real personal information.
  - text: Student ID *
  - textbox "Student ID *": SYN-2026-001
  - text: Email *
  - textbox "Email *": audit-preserved@example.test
  - text: First name *
  - textbox "First name *": Mira
  - text: Last name *
  - textbox "Last name *": Demo
  - text: Program *
  - combobox "Program *":
    - option "Select program"
    - option "BS Computer Engineering" [selected]
    - option "BS Information Technology"
    - option "BS Computer Science"
  - text: Year level *
  - combobox "Year level *":
    - option "Select year level"
    - option "4th Year" [selected]
    - option "3rd Year"
  - text: Section *
  - textbox "Section *": 4-1
  - text: Academic year *
  - textbox "Academic year *": 2026-2027
  - text: "Format: 2026-2027"
  - status: Changes saved.
  - link "Cancel":
    - /url: /dashboard/students/2024-0001
  - button "Save Changes"
- alert
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | import { prepareEmptyCoordinator, auditLogin } from "./audit-helpers";
  3   | const password = "InternLink!2026";
  4   | test("invalid edit and nested record identifiers remain explicit not-found states", async ({
  5   |   page,
  6   | }) => {
  7   |   await enter(page);
  8   |   for (const route of [
  9   |     "/dashboard/students/unknown/edit",
  10  |     "/dashboard/partners/unknown/edit",
  11  |     "/dashboard/partners/company-1/supervisors/unknown",
  12  |     "/dashboard/partners/company-1/supervisors/unknown/edit",
  13  |     "/dashboard/partners/company-2/supervisors/supervisor-1",
  14  |     "/dashboard/partners/company-2/supervisors/supervisor-1/edit",
  15  |     "/dashboard/requirements/unknown/edit",
  16  |     "/dashboard/internships/unknown/edit",
  17  |     "/dashboard/progress/reports/unknown",
  18  |   ]) {
  19  |     await page.goto(route);
  20  |     await expect(
  21  |       page.getByRole("heading", { name: "Record not found", exact: true }),
  22  |     ).toBeVisible();
  23  |   }
  24  |   await page.goto("/dashboard/placements/create?application=unknown");
  25  |   await expect(page.getByRole("heading",{name:"Choose an accepted application",exact:true})).toBeVisible();
  26  | });
  27  | test("accepted unplaced students have an accurate status and no forbidden placement action", async ({
  28  |   page,
  29  | }) => {
  30  |   await enter(page, "student4@example.test");
  31  |   await page.goto("/dashboard/applications/app-002");
  32  |   await expect(
  33  |     page.getByRole("link", { name: "Create Placement", exact: true }),
  34  |   ).toHaveCount(0);
  35  |   await expect(page.getByTestId("application-status")).toHaveText("Accepted");
  36  | });
  37  | test("IV-15: empty eligible data has actionable empty states rather than impossible forms", async ({
  38  |   page,
  39  | }) => {
  40  |   await prepareEmptyCoordinator(page);
  41  |   await auditLogin(page);
  42  |   await page.goto("/dashboard/internships/create");
  43  |   await expect(
  44  |     page.getByRole("heading", { name: "No registered partners", exact: true }),
  45  |   ).toBeVisible();
  46  |   await page.goto("/dashboard/applications/create");
  47  |   await expect(
  48  |     page.getByRole("heading", { name: "No active students", exact: true }),
  49  |   ).toBeVisible();
  50  |   await page.goto("/dashboard/progress/create");
  51  |   await expect(
  52  |     page.getByRole("heading", { name: "No ongoing placement", exact: true }),
  53  |   ).toBeVisible();
  54  |   await page.goto("/dashboard/requirements/submissions/create");
  55  |   await expect(
  56  |     page.getByRole("heading", {
  57  |       name: "No requirements configured",
  58  |       exact: true,
  59  |     }),
  60  |   ).toBeVisible();
  61  | });
  62  | async function enter(
  63  |   page: import("@playwright/test").Page,
  64  |   email = "coordinator@example.test",
  65  | ) {
  66  |   await page.goto("/");
  67  |   await page.getByLabel("Email address").fill(email);
  68  |   await page.getByLabel("Password", { exact: false }).fill(password);
  69  |   await page.getByRole("button", { name: "Sign in", exact: true }).click();
  70  |   await expect(
  71  |     page.getByRole("button", { name: "Log out", exact: true }),
  72  |   ).toBeVisible();
  73  | }
  74  | test("IV-10: a stale edit must not overwrite another tab's persisted student changes", async ({
  75  |   page,
  76  |   context,
  77  | }) => {
  78  |   await enter(page);
  79  |   const peer = await context.newPage();
  80  |   await page.goto("/dashboard/students/2024-0001/edit");
  81  |   await peer.goto("/dashboard/students/2024-0001/edit");
  82  |   await expect(peer.getByLabel("Email *", { exact: true })).toHaveValue(
  83  |     "student@example.test",
  84  |   );
  85  |   await peer.getByLabel("Last name").fill("Peer Synthetic");
  86  |   await page
  87  |     .getByLabel("Email *", { exact: true })
  88  |     .fill("audit-preserved@example.test");
  89  |   await page.getByRole("button", { name: "Save Changes", exact: true }).click();
  90  |   await expect(
  91  |     page.getByRole("heading", { name: "Mira Demo", exact: true }),
> 92  |   ).toBeVisible();
      |     ^ Error: expect(locator).toBeVisible() failed
  93  |   const observer = await context.newPage();
  94  |   await observer.goto("/dashboard/students/2024-0001");
  95  |   await expect(observer.locator("dl")).toContainText(
  96  |     "audit-preserved@example.test",
  97  |   );
  98  |   await peer.bringToFront();
  99  |   await expect(peer.getByLabel("Email *", { exact: true })).toHaveValue(
  100 |     "student@example.test",
  101 |   );
  102 |   await peer.getByRole("button", { name: "Save Changes", exact: true }).click();
  103 |   await expect(peer.locator(".functional-form [role=alert]")).toContainText(
  104 |     /changed/i,
  105 |   );
  106 |   await expect(peer.getByLabel("Last name")).toHaveValue("Peer Synthetic");
  107 |   await observer.reload();
  108 |   await expect(observer.locator("dl")).toContainText(
  109 |     "audit-preserved@example.test",
  110 |   );
  111 |   await peer
  112 |     .getByRole("button", { name: "Reload latest form", exact: true })
  113 |     .click();
  114 |   await expect(peer.getByLabel("Email *", { exact: true })).toHaveValue(
  115 |     "audit-preserved@example.test",
  116 |   );
  117 |   await peer.getByLabel("Last name").fill("Peer Synthetic");
  118 |   await peer.getByRole("button", { name: "Save Changes", exact: true }).click();
  119 |   await expect(peer.locator("h1")).toHaveText("Mira Peer Synthetic");
  120 |   await observer.reload();
  121 |   await expect(observer.locator("dl")).toContainText(
  122 |     "audit-preserved@example.test",
  123 |   );
  124 |   await peer.close();
  125 |   await observer.close();
  126 | });
  127 | test("IV-14: failed confirmed mutation explains the failure inside its active dialog", async ({
  128 |   page,
  129 | }) => {
  130 |   await enter(page);
  131 |   await page.goto("/dashboard/placements/PL-001");
  132 |   await page
  133 |     .getByRole("button", { name: "Confirm completion", exact: true })
  134 |     .click();
  135 |   const dialog = page.getByRole("dialog");
  136 |   await dialog.getByRole("button", { name: "Confirm", exact: true }).click();
  137 |   await expect(dialog.getByRole("alert")).toContainText(
  138 |     "Required reviewed hours",
  139 |   );
  140 | });
  141 | test("IV-11: unauthenticated contextual placement URL survives sign in", async ({
  142 |   page,
  143 | }) => {
  144 |   await page.goto("/dashboard/placements/create?application=app-002");
  145 |   await expect(
  146 |     page.getByRole("heading", { name: "Demonstration sign in" }),
  147 |   ).toBeVisible();
  148 |   await page.getByLabel("Email address").fill("coordinator@example.test");
  149 |   await page.getByLabel("Password", { exact: false }).fill(password);
  150 |   await page.getByRole("button", { name: "Sign in", exact: true }).click();
  151 |   await expect(
  152 |     page.getByRole("heading", { name: "Create placement", exact: true }),
  153 |   ).toBeVisible();
  154 |   await expect(page.getByLabel("Application ID", { exact: false })).toHaveValue(
  155 |     "app-002",
  156 |   );
  157 | });
  158 | test("IV-03: direct navigation does not reveal another draft posting to a student", async ({
  159 |   page,
  160 | }) => {
  161 |   await enter(page, "student@example.test");
  162 |   await page.goto("/dashboard/internships/opp-3");
  163 |   await expect(
  164 |     page.getByRole("heading", { name: "Record not found", exact: true }),
  165 |   ).toBeVisible();
  166 |   await page.goto("/dashboard/internships/opp-1");
  167 |   await expect(
  168 |     page.getByRole("heading", {
  169 |       name: "Software Development Intern",
  170 |       exact: true,
  171 |     }),
  172 |   ).toBeVisible();
  173 | });
  174 |
```
