"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ActionButton,
  Back,
  Details,
  Field,
  Filter,
  Filters,
  Identity,
  MetricLink,
  Mono,
  PageHeader,
  RecordState,
  RowLink,
  SaveForm,
  Search,
  Stack,
  Status,
  Table,
  options,
  text,
  useFilters,
} from "../components/ui";
import {
  available,
  get,
  missingRequirements,
  nameOf,
  remainingSlots,
  canDecideApplication,
} from "../lib/rules";
import {
  FeatureProps,
  accountName,
  matches,
  searchMatches,
  useData,
  useYear,
} from "./shared";
import { RequirementChecklist } from "./Requirements";

export function Applications({ id, action }: FeatureProps) {
  const { db, account, mutate, setNotice } = useData();
  const router = useRouter(),
    filters = useFilters(),
    year = useYear();
  const coordinator = account.role === "Coordinator";
  const [acceptRemarks, setAcceptRemarks] = useState("");
  if (action === "create") {
    const ownStudent =
      account.role === "Student"
        ? db.students.find((s) => s.accountId === account.id)
        : undefined;
    if (!coordinator && !ownStudent)
      return <RecordState title="Access denied" />;
    if (!db.students.some((s) => get(db.accounts, s.accountId).active))
      return (
        <RecordState
          title="No active students"
          message="Register an active student before creating an application."
          back="/dashboard/students/create"
        />
      );
    if (!db.opportunities.some((o) => available(db, o.id)))
      return (
        <RecordState
          title="No available opportunities"
          message="There are no approved, eligible postings with remaining capacity."
          back="/dashboard/internships"
        />
      );
    return (
      <>
        <Back href="/dashboard/applications">Applications</Back>
        <PageHeader
          title="Submit internship application"
          description="Only approved, eligible postings with remaining placement capacity can receive new applications. Mandatory documents must be approved before acceptance."
        />
        <SaveForm
          revision={db.revision}
          submit="Submit Application"
          cancel="/dashboard/applications"
          save={async (data, revision) => {
            const result = await mutate(
              {
                type: "application.create",
                studentId: text(data, "studentId"),
                opportunityId: text(data, "opportunityId"),
              },
              undefined,
              revision,
            );
            setNotice("Application submitted and stored locally.");
            router.push(`/dashboard/applications/${result}`);
          }}
        >
          <div className="form-grid">
            <Field
              label="Student"
              name="studentId"
              value={ownStudent?.id ?? filters.value("student")}
              options={(ownStudent ? [ownStudent] : db.students).map((s) => ({
                value: s.id,
                label: `${nameOf(s)} (${s.studentNumber})`,
              }))}
            />
            <Field
              label="Opportunity"
              name="opportunityId"
              value={filters.value("opportunity")}
              options={db.opportunities
                .filter((o) => available(db, o.id))
                .map((o) => ({
                  value: o.id,
                  label: `${o.title} — ${get(db.companies, o.companyId).name} (${remainingSlots(db, o.id)} remaining)`,
                }))}
            />
          </div>
        </SaveForm>
      </>
    );
  }
  const application = db.applications.find((a) => a.id === id);
  if (id) {
    if (!application) return <RecordState />;
    const student = get(db.students, application.studentId),
      opportunity = get(db.opportunities, application.opportunityId),
      company = get(db.companies, opportunity.companyId);
    const placement = db.placements.find(
      (p) => p.applicationId === application.id,
    );
    const mayDecide =
      canDecideApplication(db, account, application.opportunityId) &&
      application.status === "Pending";
    const showChecklist =
      account.role !== "Company Supervisor" &&
      (account.role !== "Intern Supervisor" ||
        canDecideApplication(db, account, opportunity.id));
    return (
      <>
        <Back href="/dashboard/applications">Applications</Back>
        <PageHeader
          title={nameOf(student)}
          description={`${opportunity.title} · ${company.name} · ${application.status}`}
        />
        <div className="record-summary" aria-label="Application summary">
          <div>
            <span className="summary-label">Decision</span>
            <Status>{application.status}</Status>
          </div>
          <div>
            <span className="summary-label">Opportunity</span>
            <span className="summary-value">{opportunity.title}</span>
          </div>
          <div>
            <span className="summary-label">Company</span>
            <span className="summary-value">{company.name}</span>
          </div>
          <div>
            <span className="summary-label">Remaining slots</span>
            <span className="summary-value">
              {remainingSlots(db, opportunity.id)}
            </span>
          </div>
          <div>
            <span className="summary-label">Submitted</span>
            <span className="summary-value">
              {new Date(application.submittedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="record-layout">
          <div className="record-main">
            {showChecklist && (
              <section>
                <h2>Mandatory requirement checklist</h2>
                <RequirementChecklist
                  studentId={student.id}
                  phase="Before Internship"
                />
                <p
                  className={`gate-note ${missingRequirements(db, student.id).length ? "is-blocked" : "is-clear"}`}
                >
                  {missingRequirements(db, student.id).length
                    ? "Acceptance is blocked until all mandatory requirements are approved (demonstration policy)."
                    : "Mandatory requirement eligibility satisfied."}
                </p>
              </section>
            )}
            {mayDecide && (
              <section>
                <h2>Application decision</h2>
                <div className="decision-grid">
                  <div className="panel decision-accept">
                    <h3>Accept</h3>
                    <label className="field">
                      Acceptance remarks (optional)
                      <textarea
                        value={acceptRemarks}
                        onChange={(e) => setAcceptRemarks(e.target.value)}
                        maxLength={2000}
                      />
                    </label>
                    <div className="action-bar">
                      <ActionButton
                        confirm="Accept this application after reviewing its requirements and availability? Capacity will be consumed only when a placement is saved."
                        action={async () => {
                          await mutate({
                            type: "application.decide",
                            id: application.id,
                            decision: "Accepted",
                            reason: acceptRemarks,
                          });
                          setNotice(
                            "Application accepted; related views updated.",
                          );
                        }}
                      >
                        Accept Application
                      </ActionButton>
                    </div>
                  </div>
                  <div className="decision-reject">
                    <h3>Reject</h3>
                    <SaveForm
                      revision={db.revision}
                      submit="Confirm Rejection"
                      save={async (data, revision) => {
                        if (text(data, "confirm") !== "reject")
                          throw new Error(
                            "Select the rejection confirmation before saving.",
                          );
                        await mutate(
                          {
                            type: "application.decide",
                            id: application.id,
                            decision: "Rejected",
                            reason: text(data, "reason"),
                          },
                          undefined,
                          revision,
                        );
                        setNotice(
                          "Application rejected; reason and history saved.",
                        );
                      }}
                    >
                      <Field
                        label="Rejection reason"
                        name="reason"
                        type="textarea"
                      />
                      <div className="checkbox-field">
                        <input
                          id="reject-confirm"
                          type="checkbox"
                          name="confirm"
                          value="reject"
                          required
                        />
                        <label htmlFor="reject-confirm">
                          I confirm rejection of this application.
                        </label>
                      </div>
                    </SaveForm>
                  </div>
                </div>
              </section>
            )}
            {application.status === "Accepted" && (
              <div className="action-bar">
                {placement ? (
                  <Link
                    className="simple-action"
                    href={`/dashboard/placements/${placement.id}`}
                  >
                    Open existing placement
                  </Link>
                ) : (
                  coordinator && (
                    <Link
                      className="primary-action"
                      href={`/dashboard/placements/create?application=${application.id}`}
                    >
                      Create Placement
                    </Link>
                  )
                )}
              </div>
            )}
            <section>
              <h2>Decision history</h2>
              <Table
                headers={["Status", "Date", "Actor / Role", "Reason"]}
                rows={application.history.map((h) => [
                  <Status key="s">{h.status}</Status>,
                  new Date(h.at).toLocaleString(),
                  `${accountName(db, h.actorId)} / ${db.accounts.find((a) => a.id === h.actorId)?.role ?? "Historical actor"}`,
                  h.reason ?? "—",
                ])}
              />
            </section>
          </div>
          <aside className="record-aside" aria-label="Application facts">
            <section>
              <h2>Application record</h2>
              <Details
                items={[
                  ["Application ID", application.id],
                  [
                    "Status",
                    <span data-testid="application-status" key={2771}>
                      <Status>{application.status}</Status>
                    </span>,
                  ],
                  [
                    "Student",
                    <Link href={`/dashboard/students/${student.id}`} key={2856}>
                      {nameOf(student)} ({student.studentNumber})
                    </Link>,
                  ],
                  [
                    "Program / Year / Section",
                    `${student.program} · ${student.yearLevel} / ${student.section}`,
                  ],
                  [
                    "Opportunity",
                    <Link
                      href={`/dashboard/internships/${opportunity.id}`}
                      key={3070}
                    >
                      {opportunity.title}
                    </Link>,
                  ],
                  ["Description", opportunity.description],
                  [
                    "Company",
                    <Link href={`/dashboard/partners/${company.id}`} key={3209}>
                      {company.name}
                    </Link>,
                  ],
                  ["Remaining slots", remainingSlots(db, opportunity.id)],
                  [
                    "Submitted",
                    new Date(application.submittedAt).toLocaleString(),
                  ],
                ]}
              />
            </section>
          </aside>
        </div>
      </>
    );
  }
  const rows = db.applications
    .filter(
      (a) =>
        a.academicYear === year &&
        searchMatches(
          filters.value("q"),
          nameOf(get(db.students, a.studentId)),
          get(db.students, a.studentId).studentNumber,
        ) &&
        matches(filters.value("student"), a.studentId) &&
        matches(filters.value("status"), a.status) &&
        matches(
          filters.value("company"),
          get(db.opportunities, a.opportunityId).companyId,
        ) &&
        matches(filters.value("opportunity"), a.opportunityId) &&
        (!filters.value("assigned") ||
          get(db.opportunities, a.opportunityId).supervisorIds?.includes(
            db.supervisors.find((s) => s.accountId === account.id)?.id ?? "",
          )),
    )
    .sort((a, b) =>
      filters.value("sort") === "oldest"
        ? a.submittedAt.localeCompare(b.submittedAt)
        : b.submittedAt.localeCompare(a.submittedAt),
    );
  return (
    <>
      <PageHeader
        title="Applications"
        description={`${rows.length} records · ${year}`}
      >
        {["Coordinator", "Student"].includes(account.role) && (
          <Link
            className="primary-action"
            href="/dashboard/applications/create"
          >
            Submit Application
          </Link>
        )}
      </PageHeader>
      <div className="metric-links metric-links--strip metric-links--pair">
        {["Pending", "Accepted", "Rejected"].map((status) => (
          <MetricLink
            key={status}
            href={`/dashboard/applications?status=${status}`}
            count={
              db.applications.filter(
                (a) => a.academicYear === year && a.status === status,
              ).length
            }
            label={status}
          />
        ))}
      </div>
      <Filters>
        <Search placeholder="Student name or number" />
        <Filter
          name="student"
          label="Student"
          choices={db.students.map((s) => ({ value: s.id, label: nameOf(s) }))}
        />
        <Filter
          name="status"
          label="Status"
          choices={options(["Pending", "Accepted", "Rejected"])}
        />
        <Filter
          name="company"
          label="Company"
          choices={db.companies.map((c) => ({ value: c.id, label: c.name }))}
        />
        <Filter
          name="opportunity"
          label="Opportunity"
          choices={db.opportunities.map((o) => ({
            value: o.id,
            label: o.title,
          }))}
        />
        <Filter
          name="sort"
          label="Submission date"
          choices={[
            { value: "newest", label: "Newest first" },
            { value: "oldest", label: "Oldest first" },
          ]}
        />
      </Filters>
      <Table
        headers={[
          "Application",
          "Student",
          "Opportunity",
          "Submitted",
          "Status",
          "Actions",
        ]}
        hrefs={rows.map((a) => `/dashboard/applications/${a.id}`)}
        tones={rows.map((a) =>
          a.status === "Pending" ? "warning" : undefined,
        )}
        rows={rows.map((a) => {
          const s = get(db.students, a.studentId),
            o = get(db.opportunities, a.opportunityId);
          return [
            <Mono key="id">{a.id}</Mono>,
            <Identity key="who" name={nameOf(s)} meta={s.studentNumber} />,
            <Stack
              key="opp"
              primary={o.title}
              secondary={get(db.companies, o.companyId).name}
            />,
            a.submittedAt.slice(0, 10),
            <Status key="st">{a.status}</Status>,
            <RowLink href={`/dashboard/applications/${a.id}`} key={7459}>
              Open application
            </RowLink>,
          ];
        })}
      />
    </>
  );
}
