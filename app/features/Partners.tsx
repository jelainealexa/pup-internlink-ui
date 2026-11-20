"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Back,
  Details,
  Field,
  Filter,
  Filters,
  PageHeader,
  RecordState,
  SaveForm,
  Search,
  Table,
  options,
  text,
  useFilters,
} from "../components/ui";
import {
  available,
  companyFor,
  get,
  partnership,
  remainingSlots,
} from "../lib/rules";
import {
  FeatureProps,
  PlacementRows,
  accountName,
  matches,
  searchMatches,
  useData,
  useYear,
} from "./shared";

export function Partners({ id, action, parentId }: FeatureProps) {
  const { db, account, mutate, prefs, setNotice } = useData();
  const router = useRouter(),
    filters = useFilters(),
    year = useYear();
  const coordinator = account.role === "Coordinator";
  const administrator = coordinator || account.role === "Company Supervisor";
  const company = db.companies.find((c) => c.id === (parentId ?? id));
  if (action?.startsWith("supervisor")) {
    if (!company) return <RecordState />;
    const supervisor = db.supervisors.find(
      (s) => s.id === id && s.companyId === company.id,
    );
    const person = supervisor
      ? get(db.accounts, supervisor.accountId)
      : undefined;
    if (action === "supervisor-detail") {
      if (!supervisor || !person) return <RecordState />;
      return (
        <>
          <Back href={`/dashboard/partners/${company.id}`}>{company.name}</Back>
          <PageHeader title={person.name} description={person.role}>
            {(coordinator ||
              (person.role === "Intern Supervisor" &&
                (administrator || supervisor.accountId === account.id))) && (
              <Link
                className="secondary-action"
                href={`/dashboard/partners/${company.id}/supervisors/${supervisor.id}/edit`}
              >
                Edit supervisor
              </Link>
            )}
          </PageHeader>
          <Details
            items={[
              ["Company", company.name],
              ["Email", person.email],
              ["Contact number", supervisor.phone],
              ["Account status", person.active ? "Active" : "Inactive"],
            ]}
          />
          <h2>Assigned placements</h2>
          <PlacementRows
            placements={db.placements.filter(
              (p) => p.supervisorId === supervisor.id,
            )}
          />
          <h2>Assigned opportunities</h2>
          <Table
            headers={["Opportunity", "Status", "Actions"]}
            rows={db.opportunities
              .filter((o) => o.supervisorIds?.includes(supervisor.id))
              .map((o) => [
                o.title,
                o.status,
                <Link key={o.id} href={`/dashboard/internships/${o.id}`}>
                  Open opportunity
                </Link>,
              ])}
          />
        </>
      );
    }
    if (
      !administrator &&
      !(action === "supervisor-edit" && supervisor?.accountId === account.id)
    )
      return <RecordState title="Access denied" />;
    if (!coordinator && person?.role === "Company Supervisor")
      return <RecordState title="Access denied" />;
    if (action === "supervisor-edit" && !supervisor) return <RecordState />;
    return (
      <>
        <Back href={`/dashboard/partners/${company.id}`}>{company.name}</Back>
        <PageHeader
          title={
            supervisor
              ? "Edit supervisor"
              : coordinator
                ? "Add supervisor account"
                : "Add Intern Supervisor"
          }
          description="The supervisor belongs to this company and receives a linked synthetic account."
        />
        <SaveForm
          revision={db.revision}
          submit="Save supervisor"
          cancel={`/dashboard/partners/${company.id}`}
          save={async (data, revision) => {
            const result = await mutate(
              {
                type: "supervisor.save",
                id: supervisor?.id,
                input: {
                  companyId: company.id,
                  name: text(data, "name"),
                  email: text(data, "email"),
                  phone: text(data, "phone"),
                  active: text(data, "active") === "true",
                  role: (person?.role ??
                    text(data, "role") ??
                    "Intern Supervisor") as
                    "Company Supervisor" | "Intern Supervisor",
                },
              },
              undefined,
              revision,
            );
            setNotice("Supervisor and linked account saved.");
            router.push(
              `/dashboard/partners/${company.id}/supervisors/${result}`,
            );
          }}
        >
          <div className="form-grid">
            <Field
              label="Supervisor role"
              name="role"
              value={person?.role ?? "Intern Supervisor"}
              options={
                !person && coordinator
                  ? [
                      {
                        value: "Company Supervisor",
                        label: "Company Supervisor (administrator)",
                      },
                      {
                        value: "Intern Supervisor",
                        label: "Intern Supervisor",
                      },
                    ]
                  : undefined
              }
              readOnly={!!person || !coordinator}
            />
            <Field label="Supervisor name" name="name" value={person?.name} />
            <Field
              label="Email"
              name="email"
              type="email"
              value={person?.email}
            />
            <Field
              label="Contact number"
              name="phone"
              value={supervisor?.phone}
            />
            <Field
              label="Account status"
              name="active"
              value={person?.active === false ? "false" : "true"}
              options={
                administrator
                  ? [
                      { value: "true", label: "Active" },
                      { value: "false", label: "Inactive" },
                    ]
                  : undefined
              }
              readOnly={!administrator}
            />
          </div>
        </SaveForm>
      </>
    );
  }
  if (action === "create" || action === "edit") {
    if (!administrator) return <RecordState title="Access denied" />;
    if (action === "edit" && !company) return <RecordState />;
    return (
      <>
        <Back
          href={
            company
              ? `/dashboard/partners/${company.id}`
              : "/dashboard/partners"
          }
        >
          Industry partners
        </Back>
        <PageHeader
          title={company ? "Edit industry partner" : "Add industry partner"}
        />
        <SaveForm
          revision={db.revision}
          submit="Save Partner"
          cancel={
            company
              ? `/dashboard/partners/${company.id}`
              : "/dashboard/partners"
          }
          save={async (data, revision) => {
            const result = await mutate(
              {
                type: "company.save",
                id: company?.id,
                input: {
                  name: text(data, "name"),
                  industry: text(data, "industry"),
                  address: text(data, "address"),
                  contactPerson: text(data, "contactPerson"),
                  email: text(data, "email"),
                  phone: text(data, "phone"),
                  moaStart: text(data, "moaStart"),
                  moaEnd: text(data, "moaEnd"),
                  approved: text(data, "approved") === "true",
                  academicYear: text(data, "academicYear"),
                },
              },
              undefined,
              revision,
            );
            setNotice("Industry partner saved.");
            router.push(`/dashboard/partners/${result}`);
          }}
        >
          <div className="form-grid">
            <Field label="Company name" name="name" value={company?.name} />
            <Field label="Industry" name="industry" value={company?.industry} />
            <Field label="Address" name="address" value={company?.address} />
            <Field
              label="Contact person"
              name="contactPerson"
              value={company?.contactPerson}
            />
            <Field
              label="Contact email"
              name="email"
              type="email"
              value={company?.email}
            />
            <Field label="Contact number" name="phone" value={company?.phone} />
            <Field
              label="MOA start date"
              name="moaStart"
              type="date"
              value={company?.moaStart}
              readOnly={!coordinator}
            />
            <Field
              label="MOA end date"
              name="moaEnd"
              type="date"
              value={company?.moaEnd}
              readOnly={!coordinator}
            />
            <Field
              label="Partnership approval"
              name="approved"
              value={String(company?.approved ?? false)}
              options={
                coordinator
                  ? [
                      { value: "false", label: "Pending" },
                      { value: "true", label: "Approved" },
                    ]
                  : undefined
              }
              readOnly={!coordinator}
            />
            <Field
              label="Academic year"
              name="academicYear"
              value={company?.academicYear ?? prefs.academicYear}
              readOnly={!coordinator}
            />
          </div>
        </SaveForm>
      </>
    );
  }
  if (id) {
    if (!company) return <RecordState />;
    const opportunities = db.opportunities.filter(
      (o) => o.companyId === company.id,
    );
    return (
      <>
        <Back href={coordinator ? "/dashboard/partners" : "/dashboard"}>
          Workspace
        </Back>
        <PageHeader
          title={company.name}
          description={`${company.industry} · ${partnership(db, company.id)}`}
        >
          {administrator && (
            <Link
              className="secondary-action"
              href={`/dashboard/partners/${company.id}/edit`}
            >
              Edit Partner
            </Link>
          )}
        </PageHeader>
        <Details
          items={[
            ["Company ID", company.id],
            ["Address", company.address],
            ["Contact person", company.contactPerson],
            ["Email", company.email],
            ["Phone", company.phone],
            ["MOA start", company.moaStart],
            ["MOA expiration", company.moaEnd],
            [
              "Available eligible slots",
              opportunities
                .filter((o) => available(db, o.id))
                .reduce((sum, o) => sum + remainingSlots(db, o.id), 0),
            ],
          ]}
        />
        <p className="scope-note">
          Demo policy: approved MOAs ending within 30 days are Expiring Soon.
          Expired/pending partnerships cannot receive new placements.
        </p>
        <section id="supervisors">
          <h2>Company supervisors</h2>
          {administrator && (
            <Link
              className="simple-action"
              href={`/dashboard/partners/${company.id}/supervisors/create`}
            >
              {coordinator ? "Add Supervisor Account" : "Add Intern Supervisor"}
            </Link>
          )}
          <Table
            headers={[
              "Name",
              "Email",
              "Role",
              "Account",
              "Assigned opportunities",
              "Ongoing interns",
              "Actions",
            ]}
            rows={db.supervisors
              .filter((s) => s.companyId === company.id)
              .map((s) => [
                accountName(db, s.accountId),
                get(db.accounts, s.accountId).email,
                get(db.accounts, s.accountId).role,
                get(db.accounts, s.accountId).active ? "Active" : "Inactive",
                db.opportunities.filter((o) => o.supervisorIds?.includes(s.id))
                  .length,
                db.placements.filter(
                  (p) => p.supervisorId === s.id && p.status === "Ongoing",
                ).length,
                <Link
                  href={`/dashboard/partners/${company.id}/supervisors/${s.id}`}
                  key={6443}
                >
                  Open supervisor
                </Link>,
              ])}
          />
        </section>
        <section>
          <h2>Opportunities</h2>
          {administrator && (
            <Link
              className="simple-action"
              href={`/dashboard/internships/create?company=${company.id}`}
            >
              Create Opportunity
            </Link>
          )}
          <Table
            headers={["Position", "Capacity", "Remaining", "Status", "Actions"]}
            rows={opportunities.map((o) => [
              o.title,
              o.capacity,
              remainingSlots(db, o.id),
              o.status,
              <Link href={`/dashboard/internships/${o.id}`} key={6879}>
                Open opportunity
              </Link>,
            ])}
          />
        </section>
        <section>
          <h2>Current and historical placements</h2>
          <PlacementRows
            placements={db.placements.filter(
              (p) => companyFor(db, p).id === company.id,
            )}
          />
        </section>
      </>
    );
  }
  const rows = db.companies
    .filter(
      (c) =>
        c.academicYear === year &&
        searchMatches(filters.value("q"), c.name) &&
        matches(filters.value("industry"), c.industry) &&
        matches(
          filters.value("status").toLowerCase() === "eligible"
            ? ""
            : filters.value("status") === "expiring"
              ? "Expiring Soon"
              : filters.value("status"),
          partnership(db, c.id),
        ) &&
        (filters.value("status").toLowerCase() !== "eligible" ||
          ["Active", "Expiring Soon"].includes(partnership(db, c.id))),
    )
    .sort((a, b) =>
      filters.value("sort") === "expiration"
        ? a.moaEnd.localeCompare(b.moaEnd)
        : a.name.localeCompare(b.name),
    );
  return (
    <>
      <PageHeader
        title="Industry Partners"
        description={`${rows.length} registered companies · ${year}`}
      >
        <Link href="/dashboard/partners/create" className="primary-action">
          + Add Partner
        </Link>
      </PageHeader>
      <Filters>
        <Search placeholder="Company name" />
        <Filter
          name="industry"
          label="Industry"
          choices={options(db.companies.map((c) => c.industry))}
        />
        <Filter
          name="status"
          label="Partnership status"
          choices={options([
            "Active",
            "Pending",
            "Expiring Soon",
            "Expired",
            "Eligible",
          ])}
        />
        <Filter
          name="sort"
          label="Sort by"
          choices={[
            { value: "name", label: "Company name" },
            { value: "expiration", label: "MOA expiration" },
          ]}
        />
      </Filters>
      <Table
        headers={[
          "Company",
          "Industry",
          "Contact",
          "Available slots",
          "MOA expiration",
          "Status",
          "Actions",
        ]}
        rows={rows.map((c) => [
          c.name,
          c.industry,
          <span key={8302}>
            {c.contactPerson}
            <br />
            {c.email}
            <br />
            {c.phone}
          </span>,
          db.opportunities
            .filter((o) => o.companyId === c.id && available(db, o.id))
            .reduce((n, o) => n + remainingSlots(db, o.id), 0),
          c.moaEnd,
          partnership(db, c.id),
          <Link href={`/dashboard/partners/${c.id}`} key={8514}>
            Open company
          </Link>,
        ])}
      />
    </>
  );
}
