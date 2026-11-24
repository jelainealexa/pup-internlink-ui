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
  MetricLink,
  PageHeader,
  RecordState,
  SaveForm,
  Search,
  Table,
  options,
  number,
  text,
  useFilters,
} from "../components/ui";
import {
  available,
  companyFor,
  completionProblems,
  get,
  hours,
  missingRequirements,
  nameOf,
  opportunityFor,
  remainingSlots,
  studentFor,
} from "../lib/rules";
import {
  EvaluationRows,
  FeatureProps,
  PlacementRows,
  accountName,
  matches,
  searchMatches,
  useData,
  useYear,
} from "./shared";

export function Placements({ id, action }: FeatureProps) {
  const { db, account, mutate, setNotice } = useData();
  const router = useRouter(),
    filters = useFilters(),
    year = useYear();
  const coordinator = account.role === "Coordinator";
  if (action === "create") {
    if (!coordinator) return <RecordState title="Access denied" />;
    const a = db.applications.find(
      (a) => a.id === filters.value("application"),
    );
    if (!a)
      return (
        <RecordState
          title="Choose an accepted application"
          message="Open an accepted application's Create Placement action to retrieve its related records."
          back="/dashboard/applications?status=Accepted"
        />
      );
    const o = get(db.opportunities, a.opportunityId),
      s = get(db.students, a.studentId),
      c = get(db.companies, o.companyId);
    const existing = db.placements.find((p) => p.applicationId === a.id);
    if (existing)
      return (
        <>
          <RecordState
            title="Placement already exists"
            message="A second placement cannot be created for the same application."
          />
          <Link
            className="simple-action"
            href={`/dashboard/placements/${existing.id}`}
          >
            Open existing placement
          </Link>
        </>
      );
    return (
      <>
        <Back href={`/dashboard/applications/${a.id}`}>
          Application details
        </Back>
        <PageHeader
          title="Create placement"
          description="Review the related application, dates, hours and registered supervisors before confirming the save."
        />
        <p className="scope-note">
          Capacity is allocated atomically on save. One ongoing placement per
          student; an accepted application alone does not reserve a slot.
        </p>
        <SaveForm
          revision={db.revision}
          submit="Review and Save Placement"
          cancel={`/dashboard/applications/${a.id}`}
          save={async (data, revision) => {
            if (text(data, "confirmation") !== "reviewed")
              throw new Error(
                "Confirm that you reviewed the placement information.",
              );
            const result = await mutate(
              {
                type: "placement.create",
                input: {
                  applicationId: a.id,
                  adviserId: text(data, "adviserId"),
                  supervisorId: text(data, "supervisorId"),
                  startDate: text(data, "startDate"),
                  endDate: text(data, "endDate"),
                  requiredHours: number(data, "requiredHours"),
                },
              },
              undefined,
              revision,
            );
            setNotice(
              "Placement saved, capacity allocated, and two evaluation obligations created.",
            );
            router.push(`/dashboard/placements/${result}`);
          }}
        >
          <section>
            <h2>Application information</h2>
            <div className="form-grid">
              <Field
                label="Application ID"
                name="application"
                value={a.id}
                readOnly
              />
              <Field
                label="Student ID"
                name="student"
                value={s.studentNumber}
                readOnly
              />
              <Field
                label="Student name"
                name="studentName"
                value={nameOf(s)}
                readOnly
              />
              <Field label="Company" name="company" value={c.name} readOnly />
              <Field
                label="Opportunity"
                name="opportunity"
                value={o.title}
                readOnly
              />
              <Field
                label="Application status"
                name="applicationStatus"
                value={a.status}
                readOnly
              />
            </div>
            <Details
              items={[
                ["Remaining slots", remainingSlots(db, o.id)],
                [
                  "Eligibility",
                  missingRequirements(db, s.id).length
                    ? "Mandatory approvals incomplete"
                    : "Mandatory requirements approved",
                ],
                [
                  "Posting availability",
                  available(db, o.id) ? "Available" : "Unavailable",
                ],
              ]}
            />
          </section>
          <section>
            <h2>Placement information and assignments</h2>
            <div className="form-grid">
              <Field label="Start date" name="startDate" type="date" />
              <Field label="End date" name="endDate" type="date" />
              <Field
                label="Required hours"
                name="requiredHours"
                type="number"
                min={0}
                max={10000}
                step="any"
                value={486}
              />
              <Field
                label="Faculty adviser"
                name="adviserId"
                options={db.faculty
                  .filter((f) => get(db.accounts, f.accountId).active)
                  .map((f) => ({
                    value: f.id,
                    label: accountName(db, f.accountId),
                  }))}
              />
              <Field
                label="Intern Supervisor"
                name="supervisorId"
                options={db.supervisors
                  .filter(
                    (s) =>
                      s.companyId === c.id &&
                      get(db.accounts, s.accountId).active &&
                      get(db.accounts, s.accountId).role ===
                        "Intern Supervisor" &&
                      !!o.supervisorIds?.includes(s.id),
                  )
                  .map((s) => ({
                    value: s.id,
                    label: accountName(db, s.accountId),
                  }))}
              />
            </div>
          </section>
          <div className="checkbox-field">
            <input
              id="placement-confirm"
              name="confirmation"
              value="reviewed"
              type="checkbox"
              required
            />
            <label htmlFor="placement-confirm">
              I reviewed the displayed application, dates, required hours and
              assignments.
            </label>
          </div>
        </SaveForm>
      </>
    );
  }
  const placement = db.placements.find((p) => p.id === id);
  if (id) {
    if (!placement) return <RecordState />;
    const p = placement,
      h = hours(db, p.id),
      student = studentFor(db, p),
      company = companyFor(db, p),
      problems = completionProblems(db, p.id),
      cert = db.certificates.find((c) => c.placementId === p.id);
    return (
      <>
        <Back href="/dashboard/placements">Placements</Back>
        <PageHeader
          title={p.id}
          description={`${nameOf(student)} · ${company.name} · ${p.status}`}
        />
        <Details
          items={[
            [
              "Student",
              <Link href={`/dashboard/students/${student.id}`} key={5018}>
                {nameOf(student)} ({student.studentNumber})
              </Link>,
            ],
            [
              "Application",
              <Link
                href={`/dashboard/applications/${p.applicationId}`}
                key={5136}
              >
                {p.applicationId}
              </Link>,
            ],
            [
              "Company",
              <Link href={`/dashboard/partners/${company.id}`} key={5233}>
                {company.name}
              </Link>,
            ],
            [
              "Opportunity",
              <Link
                href={`/dashboard/internships/${opportunityFor(db, p).id}`}
                key={5322}
              >
                {opportunityFor(db, p).title}
              </Link>,
            ],
            [
              "Faculty adviser",
              accountName(db, get(db.faculty, p.adviserId).accountId),
            ],
            [
              "Intern Supervisor",
              accountName(db, get(db.supervisors, p.supervisorId).accountId),
            ],
            ["Start / End", `${p.startDate} – ${p.endDate}`],
            ["Rendered hours", h.submitted],
            ["Approved / Required hours", `${h.reviewed} / ${p.requiredHours}`],
            ["Remaining / Completion", `${h.remaining} hours / ${h.percent}%`],
            ["Status", p.status],
            ["Termination reason", p.terminationReason],
            ["Academic year", p.academicYear],
          ]}
        />
        <div className="record-links">
          <Link href={`/dashboard/progress/${p.id}`}>
            Progress details and reports
          </Link>
          <Link href={`/dashboard/evaluations?placement=${p.id}`}>
            Related evaluations
          </Link>
        </div>
        {(coordinator || account.role === "Company Supervisor") &&
          p.status === "Ongoing" && (
            <section>
              <h2>Intern Supervisor assignment</h2>
              <SaveForm
                revision={db.revision}
                submit="Assign Intern Supervisor"
                save={async (data, revision) => {
                  await mutate(
                    {
                      type: "placement.supervisor.assign",
                      id: p.id,
                      supervisorId: text(data, "supervisorId"),
                    },
                    undefined,
                    revision,
                  );
                  setNotice(
                    "Intern Supervisor assignment saved; historical decisions retained.",
                  );
                }}
              >
                <Field
                  label="Assigned Intern Supervisor"
                  name="supervisorId"
                  value={p.supervisorId}
                  options={db.supervisors
                    .filter(
                      (s) =>
                        s.companyId === company.id &&
                        get(db.accounts, s.accountId).role ===
                          "Intern Supervisor" &&
                        get(db.accounts, s.accountId).active &&
                        opportunityFor(db, p).supervisorIds?.includes(s.id),
                    )
                    .map((s) => ({
                      value: s.id,
                      label: accountName(db, s.accountId),
                    }))}
                />
                <p>
                  A submitted company evaluation freezes the assignment until
                  the placement closes. Pending obligations can transfer without
                  adding a third evaluation.
                </p>
              </SaveForm>
              <Table
                headers={[
                  "Previous supervisor",
                  "New supervisor",
                  "Actor",
                  "Date",
                ]}
                rows={(p.assignmentHistory ?? []).map((h) => [
                  accountName(
                    db,
                    db.supervisors.find((s) => s.id === h.from)?.accountId,
                  ),
                  accountName(
                    db,
                    db.supervisors.find((s) => s.id === h.to)?.accountId,
                  ),
                  accountName(db, h.actorId),
                  h.at,
                ])}
              />
            </section>
          )}
        <section>
          <h2>Required evaluations</h2>
          <EvaluationRows placementId={p.id} />
        </section>
        <section>
          <h2>Completion eligibility</h2>
          {problems.length ? (
            <ul>
              {problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          ) : (
            <p>
              Both evaluations and required reviewed hours are complete.
              Creation-time mandatory documents are approved.
            </p>
          )}
          <p className="scope-note">
            Demonstration policy only: scores use a 0–100 example scale, with no
            invented institutional passing threshold. Completion is a
            coordinator confirmation after all obligations are met.
          </p>
          {coordinator && p.status === "Ongoing" && (
            <ActionButton
              confirm="Confirm demonstration completion? This preserves the placement and its capacity allocation."
              action={async () => {
                await mutate({ type: "placement.complete", id: p.id });
                setNotice("Placement completed under demonstration policy.");
              }}
            >
              Confirm completion
            </ActionButton>
          )}
        </section>
        <section>
          <h2>Certificate information</h2>
          {cert ? (
            <Details
              items={[
                ["Demonstration certificate number", cert.number],
                ["Issue date", cert.issueDate],
                ["Recorded by", accountName(db, cert.recordedBy)],
              ]}
            />
          ) : (
            <p>
              No certificate information has been recorded. Completion does not
              automatically issue a certificate.
            </p>
          )}
          {coordinator && p.status === "Completed" && !cert && (
            <SaveForm
              revision={db.revision}
              submit="Record demonstration certificate"
              save={async (data, revision) => {
                await mutate(
                  {
                    type: "certificate.record",
                    placementId: p.id,
                    number: text(data, "number"),
                    issueDate: text(data, "issueDate"),
                  },
                  undefined,
                  revision,
                );
                setNotice(
                  "Demonstration certificate information saved; no official certificate was issued.",
                );
              }}
            >
              <p>
                This records synthetic certificate metadata only; it does not
                issue an official PUP certificate.
              </p>
              <div className="form-grid">
                <Field label="Demonstration certificate number" name="number" />
                <Field label="Issue date" name="issueDate" type="date" />
              </div>
            </SaveForm>
          )}
        </section>
        {coordinator && p.status === "Ongoing" && (
          <section>
            <h2>Terminate placement</h2>
            <SaveForm
              revision={db.revision}
              submit="Confirm termination"
              save={async (data, revision) => {
                if (text(data, "confirm") !== "terminate")
                  throw new Error("Confirm the termination first.");
                await mutate(
                  {
                    type: "placement.terminate",
                    id: p.id,
                    reason: text(data, "reason"),
                  },
                  undefined,
                  revision,
                );
                setNotice(
                  "Placement terminated; history retained and capacity released.",
                );
              }}
            >
              <Field label="Termination reason" name="reason" type="textarea" />
              <div className="checkbox-field">
                <input
                  type="checkbox"
                  name="confirm"
                  value="terminate"
                  id="terminate-confirm"
                  required
                />
                <label htmlFor="terminate-confirm">
                  I confirm termination and release of this placement&apos;s
                  slot.
                </label>
              </div>
            </SaveForm>
          </section>
        )}
      </>
    );
  }
  const rows = db.placements
    .filter(
      (p) =>
        p.academicYear === year &&
        searchMatches(filters.value("q"), p.id, nameOf(studentFor(db, p))) &&
        matches(filters.value("student"), studentFor(db, p).id) &&
        matches(filters.value("company"), companyFor(db, p).id) &&
        matches(filters.value("adviser"), p.adviserId) &&
        matches(filters.value("status"), p.status),
    )
    .sort((a, b) =>
      filters.value("sort") === "start-oldest"
        ? a.startDate.localeCompare(b.startDate)
        : filters.value("sort") === "end-newest"
          ? b.endDate.localeCompare(a.endDate)
          : filters.value("sort") === "end-oldest"
            ? a.endDate.localeCompare(b.endDate)
            : b.startDate.localeCompare(a.startDate),
    );
  return (
    <>
      <PageHeader
        title="Placements"
        description={`${rows.length} official demonstration assignments · ${year}`}
      />
      <div className="metric-links metric-links--strip">
        {["Ongoing", "Completed", "Terminated"].map((status) => (
          <MetricLink
            key={status}
            href={`/dashboard/placements?status=${status}`}
            count={
              db.placements.filter(
                (p) => p.academicYear === year && p.status === status,
              ).length
            }
            label={status}
          />
        ))}
      </div>
      <Filters>
        <Search placeholder="Student name or placement ID" />
        <Filter
          name="student"
          label="Student"
          choices={db.students.map((s) => ({ value: s.id, label: nameOf(s) }))}
        />
        <Filter
          name="company"
          label="Company"
          choices={db.companies.map((c) => ({ value: c.id, label: c.name }))}
        />
        <Filter
          name="adviser"
          label="Faculty adviser"
          choices={db.faculty.map((f) => ({
            value: f.id,
            label: accountName(db, f.accountId),
          }))}
        />
        <Filter
          name="status"
          label="Placement status"
          choices={options(["Ongoing", "Completed", "Terminated"])}
        />
        <Filter
          name="sort"
          label="Sort dates"
          choices={[
            { value: "start-newest", label: "Start newest" },
            { value: "start-oldest", label: "Start oldest" },
            { value: "end-newest", label: "End latest" },
            { value: "end-oldest", label: "End earliest" },
          ]}
        />
      </Filters>
      <PlacementRows placements={rows} />
    </>
  );
}
