"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ActionButton,
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
  number,
  options,
  text,
  useFilters,
} from "../components/ui";
import { available, get, remainingSlots } from "../lib/rules";
import {
  ApplicationRows,
  FeatureProps,
  PlacementRows,
  matches,
  searchMatches,
  useData,
  useYear,
} from "./shared";

export function Opportunities({ id, action }: FeatureProps) {
  const { db, account, mutate, prefs, setNotice } = useData();
  const filters = useFilters(),
    router = useRouter(),
    year = useYear();
  const coordinator = account.role === "Coordinator";
  const opportunity = db.opportunities.find((o) => o.id === id);
  if (action === "create" || action === "edit") {
    if (!coordinator) return <RecordState title="Access denied" />;
    if (action === "edit" && !opportunity) return <RecordState />;
    if (action === "create" && !db.companies.length)
      return (
        <RecordState
          title="No registered partners"
          message="Register an industry partner before creating an opportunity."
          back="/dashboard/partners/create"
        />
      );
    return (
      <>
        <Back href="/dashboard/internships">Opportunities</Back>
        <PageHeader
          title={opportunity ? "Edit opportunity" : "Create opportunity"}
          description="New postings require coordinator approval. Capacity is consumed once, when a placement is created."
        />
        <SaveForm
          revision={db.revision}
          submit="Save Opportunity"
          cancel={
            opportunity
              ? `/dashboard/internships/${opportunity.id}`
              : "/dashboard/internships"
          }
          save={async (data, revision) => {
            const result = await mutate(
              {
                type: "opportunity.save",
                id: opportunity?.id,
                input: {
                  companyId: text(data, "companyId"),
                  title: text(data, "title"),
                  description: text(data, "description"),
                  capacity: number(data, "capacity"),
                  academicYear: text(data, "academicYear"),
                },
              },
              undefined,
              revision,
            );
            setNotice("Opportunity saved.");
            router.push(`/dashboard/internships/${result}`);
          }}
        >
          <div className="form-grid">
            <Field
              label="Company"
              name="companyId"
              value={opportunity?.companyId ?? filters.value("company")}
              options={db.companies.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />
            <Field
              label="Position title"
              name="title"
              value={opportunity?.title}
            />
            <Field
              label="Description"
              name="description"
              type="textarea"
              value={opportunity?.description}
            />
            <Field
              label="Total capacity"
              name="capacity"
              type="number"
              min={1}
              max={10000}
              step={1}
              value={opportunity?.capacity}
            />
            <Field
              label="Academic year"
              name="academicYear"
              value={opportunity?.academicYear ?? prefs.academicYear}
            />
          </div>
        </SaveForm>
      </>
    );
  }
  if (id) {
    if (!opportunity) return <RecordState />;
    const company = get(db.companies, opportunity.companyId);
    return (
      <>
        <Back href="/dashboard/internships">Opportunities</Back>
        <PageHeader
          title={opportunity.title}
          description={`${company.name} · ${opportunity.status}`}
        >
          {coordinator && (
            <Link
              href={`/dashboard/internships/${opportunity.id}/edit`}
              className="secondary-action"
            >
              Edit Opportunity
            </Link>
          )}
        </PageHeader>
        <Details
          items={[
            [
              "Company",
              <Link href={`/dashboard/partners/${company.id}`} key={2788}>
                {company.name}
              </Link>,
            ],
            ["Description", opportunity.description],
            ["Total capacity", opportunity.capacity],
            ["Remaining slots", remainingSlots(db, opportunity.id)],
            [
              "Availability",
              available(db, opportunity.id)
                ? "Available"
                : "Unavailable — approval, MOA or capacity restriction",
            ],
            [
              "Applications",
              db.applications.filter((a) => a.opportunityId === opportunity.id)
                .length,
            ],
            ["Academic year", opportunity.academicYear],
          ]}
        />
        <div className="action-bar">
          {coordinator && opportunity.status !== "Approved" && (
            <ActionButton
              confirm="Approve or reopen this posting? New applications still require an eligible MOA and remaining capacity."
              action={async () => {
                await mutate({
                  type: "opportunity.status",
                  id: opportunity.id,
                  status: "Approved",
                });
              }}
            >
              Approve / Reopen Opportunity
            </ActionButton>
          )}
          {coordinator && opportunity.status !== "Closed" && (
            <ActionButton
              confirm="Close this opportunity to new applications and placements? Existing records will be retained."
              action={async () => {
                await mutate({
                  type: "opportunity.status",
                  id: opportunity.id,
                  status: "Closed",
                });
              }}
            >
              Close Opportunity
            </ActionButton>
          )}
          {["Coordinator", "Student"].includes(account.role) &&
            available(db, opportunity.id) && (
              <Link
                href={`/dashboard/applications/create?opportunity=${opportunity.id}`}
                className="primary-action"
              >
                Submit application
              </Link>
            )}
        </div>
        <section>
          <h2>Applicants</h2>
          <Link
            className="simple-action"
            href={`/dashboard/applications?opportunity=${opportunity.id}`}
          >
            View filtered applications
          </Link>
          <ApplicationRows opportunityId={opportunity.id} />
        </section>
        <section>
          <h2>Assigned placements</h2>
          <PlacementRows
            placements={db.placements.filter(
              (p) =>
                get(db.applications, p.applicationId).opportunityId ===
                opportunity.id,
            )}
          />
        </section>
      </>
    );
  }
  const rows = db.opportunities
    .filter(
      (o) =>
        o.academicYear === year &&
        (coordinator || available(db, o.id)) &&
        searchMatches(
          filters.value("q"),
          o.title,
          get(db.companies, o.companyId).name,
        ) &&
        matches(filters.value("company"), o.companyId) &&
        matches(filters.value("status"), o.status) &&
        (!filters.value("available") || available(db, o.id)),
    )
    .sort((a, b) => a.title.localeCompare(b.title));
  return (
    <>
      <PageHeader
        title={coordinator ? "Opportunities" : "Available opportunities"}
        description={`${rows.length} postings · ${year}`}
      >
        {coordinator && (
          <Link className="primary-action" href="/dashboard/internships/create">
            + Create Opportunity
          </Link>
        )}
      </PageHeader>
      <Filters>
        <Search placeholder="Position or company" />
        <Filter
          name="company"
          label="Company"
          choices={db.companies.map((c) => ({ value: c.id, label: c.name }))}
        />
        <Filter
          name="status"
          label="Status"
          choices={options(["Pending Approval", "Approved", "Closed"])}
        />
        <Filter
          name="available"
          label="Availability"
          choices={[{ value: "true", label: "Available only" }]}
        />
      </Filters>
      <Table
        headers={[
          "Position",
          "Company",
          "Remaining / Total",
          "Applications",
          "Status",
          "Actions",
        ]}
        rows={rows.map((o) => [
          o.title,
          get(db.companies, o.companyId).name,
          `${remainingSlots(db, o.id)} / ${o.capacity}`,
          db.applications.filter((a) => a.opportunityId === o.id).length,
          o.status,
          <Link href={`/dashboard/internships/${o.id}`} key={5872}>
            Open opportunity
          </Link>,
        ])}
      />
    </>
  );
}
