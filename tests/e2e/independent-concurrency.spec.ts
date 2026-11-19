import { expect, test } from "@playwright/test";
import { auditLogin, auditSnapshot } from "./audit-helpers";

for (const item of [
  {
    route: "partners/company-1/edit",
    field: "name",
    value: "Preserved Audit Company",
    other: "address",
    otherValue: "Peer synthetic address",
    save: "Save Partner",
    collection: "companies",
    id: "company-1",
  },
  {
    route: "partners/company-1/supervisors/supervisor-1/edit",
    field: "name",
    value: "Preserved Audit Supervisor",
    other: "phone",
    otherValue: "+1 555 0197",
    save: "Save supervisor",
    collection: "accounts",
    id: "sup-1",
  },
  {
    route: "requirements/req-1/edit",
    field: "name",
    value: "Preserved Audit Requirement",
    other: "description",
    otherValue: "Peer synthetic description",
    save: "Save Requirement",
    collection: "requirements",
    id: "req-1",
  },
  {
    route: "internships/opp-1/edit",
    field: "title",
    value: "Preserved Audit Opportunity",
    other: "description",
    otherValue: "Peer synthetic description",
    save: "Save Opportunity",
    collection: "opportunities",
    id: "opp-1",
  },
]) {
  test(`independent stale ${item.collection} edit cannot overwrite another tab`, async ({
    page,
    context,
  }) => {
    await auditLogin(page);
    const peer = await context.newPage();
    await page.goto(`/dashboard/${item.route}`);
    await peer.goto(`/dashboard/${item.route}`);
    await peer.locator(`form [name=${item.other}]`).fill(item.otherValue);
    await page.bringToFront();
    await page.locator(`form [name=${item.field}]`).fill(item.value);
    await page.getByRole("button", { name: item.save, exact: true }).click();
    await expect(page.locator("h1")).not.toHaveText(/Edit /);
    await expect
      .poll(async () => {
        const db = await auditSnapshot(page);
        const rows =
          db[
            item.collection as
              "companies" | "accounts" | "requirements" | "opportunities"
          ];
        const record = rows.find((r) => r.id === item.id)!;
        return Reflect.get(record, item.field);
      })
      .toBe(item.value);
    await peer.bringToFront();
    await peer.getByRole("button", { name: item.save, exact: true }).click();
    await expect(peer.locator("form [role=alert]")).toContainText(/changed/i);
    await expect(peer.locator(`form [name=${item.other}]`)).toHaveValue(
      item.otherValue,
    );
    const db = await auditSnapshot(page);
    const record = db[
      item.collection as
        "companies" | "accounts" | "requirements" | "opportunities"
    ].find((r) => r.id === item.id)!;
    expect(Reflect.get(record, item.field)).toBe(item.value);
    await peer.close();
  });
}
