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
  number,
  options,
  text,
  useFilters,
} from "../components/ui";
import { available, get, remainingSlots, postingStatus } from "../lib/rules";
import { PostingControls } from "./PostingControls";
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
  const manager = coordinator || account.role === "Company Supervisor";
  const opportunity = db.opportunities.find((o) => o.id === id);
  if (action === "create" || action === "edit") {
    if (!manager) return <RecordState title="Access denied" />;
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
          description="Postings require company approval, coordinator approval and activation. Material edits restart both reviews. Capacity is consumed when a placement is created."
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
                  location: text(data, "location"),
                  modality: text(data, "modality") as
                    "On-site" | "Remote" | "Hybrid" | "Not specified",
                  requiredHours: number(data, "requiredHours"),
                  qualifications: text(data, "qualifications"),
                  skills: text(data, "skills"),
                  responsibilities: text(data, "responsibilities"),
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
            <Field
              label="Location"
              name="location"
              value={opportunity?.location}
            />
            <Field
              label="Modality"
              name="modality"
              value={opportunity?.modality}
              options={options([
                ...(opportunity?.modality === "Not specified"
                  ? ["Not specified"]
                  : []),
                "On-site",
                "Remote",
                "Hybrid",
              ])}
            />
            <Field
              label="Required internship hours"
              name="requiredHours"
              type="number"
              min={0}
              max={10000}
              step="any"
              value={opportunity?.requiredHours}
            />
            <Field
              label="Required qualifications"
              name="qualifications"
              type="textarea"
              value={opportunity?.qualifications}
            />
            <Field
              label="Required skills"
              name="skills"
              type="textarea"
              value={opportunity?.skills}
            />
            <Field
              label="Internship responsibilities"
              name="responsibilities"
              type="textarea"
              value={opportunity?.responsibilities}
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
          description={`${company.name} · ${postingStatus(db, opportunity.id)}`}
        >
          {manager && (
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
            ["Location", opportunity.location ?? "Not specified"],
            ["Modality", opportunity.modality ?? "Not specified"],
            ["Required hours", opportunity.requiredHours ?? "Not specified"],
            ["Qualifications", opportunity.qualifications ?? "Not specified"],
            ["Skills", opportunity.skills ?? "Not specified"],
            [
              "Responsibilities",
              opportunity.responsibilities ?? opportunity.description,
            ],
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
              db.availability?.[opportunity.id]?.applications ??
                db.applications.filter(
                  (a) => a.opportunityId === opportunity.id,
                ).length,
            ],
            ["Academic year", opportunity.academicYear],
          ]}
        />
        <PostingControls opportunity={opportunity} />
        <div className="action-bar">
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
        {account.role !== "Company Supervisor" && (
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
        )}
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
        (account.role !== "Student" || available(db, o.id)) &&
        searchMatches(
          filters.value("q"),
          o.title,
          get(db.companies, o.companyId).name,
        ) &&
        matches(filters.value("company"), o.companyId) &&
        (filters.value("status") === "Pending (all stages)"
          ? o.status.startsWith("Pending Approval")
          : matches(filters.value("status"), postingStatus(db, o.id))) &&
        (!filters.value("assigned") ||
          o.supervisorIds?.includes(
            db.supervisors.find((s) => s.accountId === account.id)?.id ?? "",
          )) &&
        matches(filters.value("location"), o.location ?? "Not specified") &&
        matches(filters.value("modality"), o.modality ?? "Not specified") &&
        (!filters.value("hours") ||
          String(o.requiredHours ?? "") === filters.value("hours")) &&
        (!filters.value("available") || available(db, o.id)),
    )
    .sort((a, b) => a.title.localeCompare(b.title));
  return (
    <>
      <PageHeader
        title={coordinator ? "Opportunities" : "Available opportunities"}
        description={`${rows.length} postings · ${year}`}
      >
        {manager && (
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
          choices={options([
            "Pending (all stages)",
            "Pending Approval - Company",
            "Pending Approval - Coordinator",
            "Approved",
            "Active",
            "Filled",
            "Deactivated",
            "Rejected",
          ])}
        />
        <Filter
          name="location"
          label="Location"
          choices={options(
            db.opportunities.map((o) => o.location ?? "Not specified"),
          )}
        />
        <Filter
          name="modality"
          label="Modality"
          choices={options(
            db.opportunities.map((o) => o.modality ?? "Not specified"),
          )}
        />
        <Filter
          name="hours"
          label="Required hours"
          choices={options(
            db.opportunities
              .filter((o) => o.requiredHours !== undefined)
              .map((o) => String(o.requiredHours)),
          )}
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
          db.availability?.[o.id]?.applications ??
            db.applications.filter((a) => a.opportunityId === o.id).length,
          postingStatus(db, o.id),
          <Link href={`/dashboard/internships/${o.id}`} key={5872}>
            Open opportunity
          </Link>,
        ])}
      />
    </>
  );
}
