"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
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
  ActionButton,
  useFilters,
} from "../components/ui";
import { Pencil, UserPlus } from "lucide-react";
import {
  companyFor,
  hours,
  missingRequirements,
  nameOf,
  placementsForStudent,
  studentStatus,
  sumHours,
  canReviewStudent,
  get,
} from "../lib/rules";
import {
  FeatureProps,
  ApplicationRows,
  EvaluationRows,
  PlacementRows,
  matches,
  searchMatches,
  useData,
  useYear,
} from "./shared";
import { RequirementChecklist } from "./Requirements";

export function Students({ id, action }: FeatureProps) {
  const { db, account, mutate, prefs, setNotice } = useData();
  const router = useRouter(),
    filters = useFilters(),
    year = useYear();
  const student = db.students.find((s) => s.id === id);
  const coordinator = account.role === "Coordinator";
  const registrar = coordinator || account.role === "Faculty Adviser";
  if (action === "create" || action === "edit") {
    if (!registrar || (student && !canReviewStudent(db, account, student.id)))
      return <RecordState title="Access denied" />;
    if (action === "edit" && !student) return <RecordState />;
    return (
      <>
        <Back
          href={
            student
              ? `/dashboard/students/${student.id}`
              : "/dashboard/students"
          }
        >
          Students
        </Back>
        <PageHeader
          title={student ? "Edit student" : "Add student"}
          description="Pre-registration creates a pending account. Generate a local invitation from the profile; the student chooses demonstration credentials at activation."
        />
        <SaveForm
          revision={db.revision}
          submit={student ? "Save Changes" : "Save Student"}
          cancel={
            student
              ? `/dashboard/students/${student.id}`
              : "/dashboard/students"
          }
          save={async (data, revision) => {
            const result = await mutate(
              {
                type: "student.save",
                id: student?.id,
                input: {
                  studentNumber: text(data, "studentNumber"),
                  firstName: text(data, "firstName"),
                  lastName: text(data, "lastName"),
                  email: text(data, "email"),
                  program: text(data, "program"),
                  yearLevel: text(data, "yearLevel"),
                  section: text(data, "section"),
                  academicYear: text(data, "academicYear"),
                },
              },
              undefined,
              revision,
            );
            setNotice("Student record saved in this browser.");
            router.push(`/dashboard/students/${result}`);
          }}
        >
          <div className="form-grid">
            <Field
              label="Student ID"
              name="studentNumber"
              value={student?.studentNumber}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={student?.email}
            />
            <Field
              label="First name"
              name="firstName"
              value={student?.firstName}
            />
            <Field
              label="Last name"
              name="lastName"
              value={student?.lastName}
            />
            <Field
              label="Program"
              name="program"
              value={student?.program}
              options={options([
                ...db.students.map((s) => s.program),
                "BS Computer Engineering",
                "BS Information Technology",
                "BS Computer Science",
              ])}
            />
            <Field
              label="Year level"
              name="yearLevel"
              value={student?.yearLevel}
              options={options([
                ...db.students.map((s) => s.yearLevel),
                "3rd Year",
                "4th Year",
              ])}
            />
            <Field label="Section" name="section" value={student?.section} />
            <Field
              label="Academic year"
              name="academicYear"
              value={student?.academicYear ?? prefs.academicYear}
              hint="Format: 2026-2027"
            />
          </div>
        </SaveForm>
      </>
    );
  }
  if (id) {
    if (!student) return <RecordState back="/dashboard/students" />;
    const ps = placementsForStudent(db, student.id);
    const reviewed = sumHours(ps.map((p) => hours(db, p.id).reviewed));
    const documentAccess =
      account.role === "Coordinator" ||
      account.role === "Student" ||
      (account.role === "Faculty Adviser" &&
        canReviewStudent(db, account, student.id)) ||
      (account.role === "Intern Supervisor" &&
        db.applications.some(
          (a) =>
            a.studentId === student.id &&
            db.opportunities
              .find((o) => o.id === a.opportunityId)
              ?.supervisorIds?.includes(
                db.supervisors.find((s) => s.accountId === account.id)?.id ??
                  "",
              ),
        ));
    const canManage = registrar && canReviewStudent(db, account, student.id);
    const studentAccount = get(db.accounts, student.accountId);
    const adviserName =
      db.accounts.find(
        (a) =>
          a.id ===
          db.faculty.find((f) => f.id === student.adviserId)?.accountId,
      )?.name ?? "Not assigned";
    const eligibility = !documentAccess
      ? "Document checklist is not shared with this role"
      : missingRequirements(db, student.id).length
        ? "Incomplete — approval needed"
        : "Eligible under demo policy";
    const currentPlacement = ps.find((p) => p.status === "Ongoing") ?? ps[0];
    return (
      <>
        <Back href="/dashboard/students">Student directory</Back>
        <PageHeader
          title={nameOf(student)}
          description={`${student.studentNumber} · ${student.program} · ${student.yearLevel} / ${student.section}`}
        >
          {canManage && (
            <Link
              className="secondary-action"
              href={`/dashboard/students/${id}/edit`}
            >
              <Pencil size={16} aria-hidden="true" />
              Edit Profile
            </Link>
          )}
        </PageHeader>
        <div className="record-summary" aria-label="Student summary">
          <div>
            <span className="summary-label">Internship status</span>
            <Status>{studentStatus(db, student.id)}</Status>
          </div>
          <div>
            <span className="summary-label">Current placement</span>
            <span className="summary-value">
              {currentPlacement
                ? companyFor(db, currentPlacement).name
                : "Not yet placed"}
            </span>
          </div>
          <div>
            <span className="summary-label">Faculty adviser</span>
            <span className="summary-value">{adviserName}</span>
          </div>
          <div>
            <span className="summary-label">Approved hours</span>
            <span className="summary-value">{reviewed}</span>
          </div>
          <div>
            <span className="summary-label">Mandatory eligibility</span>
            <span className="summary-value">{eligibility}</span>
          </div>
        </div>
        <nav className="record-links" aria-label="Student records">
          {documentAccess && (
            <Link
              href={`/dashboard/requirements?student=${id}&view=submissions`}
            >
              Requirements and checklist
            </Link>
          )}
          <Link href={`/dashboard/applications?student=${id}`}>
            Application history
          </Link>
          <Link href={`/dashboard/placements?student=${id}`}>Placements</Link>
          <Link href={`/dashboard/progress?student=${id}`}>
            Progress reports
          </Link>
          <Link href={`/dashboard/evaluations?student=${id}`}>Evaluations</Link>
          {account.role === "Student" && (
            <Link href="/dashboard/settings">Account Settings</Link>
          )}
        </nav>
        <div className="record-layout">
          <div className="record-main">
            {documentAccess && (
              <section>
                <h2>Requirement checklist</h2>
                <RequirementChecklist studentId={student.id} />
              </section>
            )}
            <section>
              <h2>Applications</h2>
              <ApplicationRows studentId={id} />
            </section>
            <section>
              <h2>Placements and supervision</h2>
              <PlacementRows placements={ps} />
            </section>
            <section>
              <h2>Evaluations</h2>
              <EvaluationRows studentId={id} />
            </section>
          </div>
          <aside className="record-aside" aria-label="Profile and account">
            <section>
              <h2>Profile</h2>
              <Details
                items={[
                  ["Email", student.email],
                  ["Account status", studentAccount.activationState],
                  [
                    "Profile completion",
                    `${Math.round(([student.studentNumber, student.firstName, student.lastName, student.email, student.program, student.yearLevel, student.section, student.academicYear].filter((v) => !!v?.trim()).length / 8) * 100)}% (8 required identity and academic fields)`,
                  ],
                  ["Assigned Faculty Adviser", adviserName],
                  [
                    "Status",
                    <Status key={3387}>{studentStatus(db, student.id)}</Status>,
                  ],
                  ["Approved hours (all placements)", reviewed],
                  ["Academic year", student.academicYear],
                  ["Current mandatory eligibility", eligibility],
                ]}
              />
            </section>
            {canManage && (
              <section>
                <h2>Account activation</h2>
                <div className="panel">
                  <p>
                    Account status:{" "}
                    <Status>{studentAccount.activationState}</Status>
                  </p>
                  <div className="action-bar">
                    {studentAccount.activationState ===
                      "Pending Activation" && (
                      <ActionButton
                        action={async () => {
                          await mutate({
                            type: "account.invite",
                            studentId: student.id,
                          });
                          setNotice(
                            "Local invitation generated. No email was sent.",
                          );
                        }}
                      >
                        Generate Invitation
                      </ActionButton>
                    )}
                    {studentAccount.activationState !== "Deactivated" && (
                      <ActionButton
                        danger
                        confirm="Deactivate this student account and invalidate invitations? Historical internship records remain."
                        action={async () => {
                          await mutate({
                            type: "account.deactivate",
                            accountId: student.accountId,
                          });
                        }}
                      >
                        Deactivate Student Account
                      </ActionButton>
                    )}
                  </div>
                  {(db.accountRequests ?? [])
                    .filter(
                      (r) =>
                        r.accountId === student.accountId &&
                        r.purpose === "Activation" &&
                        !r.usedAt &&
                        r.expiresAt > new Date().toISOString(),
                    )
                    .map((r) => (
                      <p key={r.id} className="invite-note">
                        <Link
                          href={`/activate?token=${encodeURIComponent(r.id)}&email=${encodeURIComponent(student.email)}`}
                        >
                          Open demonstration activation link
                        </Link>{" "}
                        · Invitation code: <code>{r.id}</code> · Expires{" "}
                        {r.expiresAt}
                      </p>
                    ))}
                </div>
              </section>
            )}
            {coordinator && (
              <section>
                <h2>Faculty adviser</h2>
                <SaveForm
                  revision={db.revision}
                  submit="Assign Faculty Adviser"
                  save={async (data, revision) => {
                    await mutate(
                      {
                        type: "faculty.assign",
                        studentId: student.id,
                        adviserId: text(data, "adviserId"),
                      },
                      undefined,
                      revision,
                    );
                    setNotice("Faculty assignment saved.");
                  }}
                >
                  <Field
                    label="Faculty Adviser"
                    name="adviserId"
                    value={student.adviserId}
                    options={db.faculty
                      .filter((f) => get(db.accounts, f.accountId).active)
                      .map((f) => ({
                        value: f.id,
                        label: get(db.accounts, f.accountId).name,
                      }))}
                  />
                </SaveForm>
              </section>
            )}
          </aside>
        </div>
      </>
    );
  }
  const totalHours = (
    studentId: string,
    kind: "submitted" | "reviewed" = "reviewed",
  ) =>
    sumHours(
      placementsForStudent(db, studentId).map((p) => hours(db, p.id)[kind]),
    );
  const rows = db.students
    .filter(
      (s) =>
        (filters.value("interns")
          ? placementsForStudent(db, s.id).some((p) => p.academicYear === year)
          : s.academicYear === year) &&
        (account.role !== "Faculty Adviser" ||
          canReviewStudent(db, account, s.id)) &&
        searchMatches(filters.value("q"), nameOf(s), s.studentNumber) &&
        matches(filters.value("program"), s.program) &&
        matches(filters.value("yearLevel"), s.yearLevel) &&
        matches(filters.value("section"), s.section) &&
        matches(
          filters.value("activation"),
          get(db.accounts, s.accountId).activationState ?? "Active",
        ) &&
        matches(filters.value("adviser"), s.adviserId ?? "") &&
        (!filters.value("company") ||
          placementsForStudent(db, s.id).some(
            (p) => companyFor(db, p).id === filters.value("company"),
          )) &&
        (!filters.value("interns") ||
          placementsForStudent(db, s.id).length > 0) &&
        matches(filters.value("status"), studentStatus(db, s.id)),
    )
    .sort((a, b) =>
      filters.value("sort") === "hours"
        ? totalHours(b.id, "submitted") - totalHours(a.id, "submitted")
        : filters.value("sort") === "approvedHours"
          ? totalHours(b.id) - totalHours(a.id)
          : filters.value("sort") === "id"
            ? a.studentNumber.localeCompare(b.studentNumber)
            : nameOf(a).localeCompare(nameOf(b)),
    );
  return (
    <>
      <PageHeader
        title={
          coordinator
            ? "Students"
            : account.role === "Intern Supervisor"
              ? "Assigned Interns"
              : "Assigned students"
        }
        description={`Academic year ${year} · ${rows.length} records`}
      >
        {registrar && (
          <Link className="primary-action" href="/dashboard/students/create">
            <UserPlus size={16} aria-hidden="true" />
            Add / Pre-Register Student
          </Link>
        )}
      </PageHeader>
      {registrar && (
        <div className="metric-links metric-links--strip metric-links--pair">
          <MetricLink
            href="/dashboard/students"
            count={db.students.filter((s) => s.academicYear === year).length}
            label="Total Registered Students"
          />
          <MetricLink
            href="/dashboard/students?activation=Pending%20Activation"
            count={
              db.students.filter(
                (s) =>
                  s.academicYear === year &&
                  get(db.accounts, s.accountId).activationState ===
                    "Pending Activation",
              ).length
            }
            label="Pending Account Activations"
          />
        </div>
      )}
      <Filters>
        <Search placeholder="Student name or ID" />
        <Filter
          name="program"
          label="Program"
          choices={options(db.students.map((s) => s.program))}
        />
        <Filter
          name="activation"
          label="Activation status"
          choices={options(["Active", "Pending Activation", "Deactivated"])}
        />
        <Filter
          name="adviser"
          label="Assigned adviser"
          choices={db.faculty.map((f) => ({
            value: f.id,
            label: get(db.accounts, f.accountId).name,
          }))}
        />
        <Filter
          name="company"
          label="Company"
          choices={db.companies.map((c) => ({ value: c.id, label: c.name }))}
        />
        <Filter
          name="yearLevel"
          label="Year level"
          choices={options(db.students.map((s) => s.yearLevel))}
        />
        <Filter
          name="section"
          label="Section"
          choices={options(db.students.map((s) => s.section))}
        />
        <Filter
          name="status"
          label="Status"
          choices={options([
            "Not Yet Placed",
            "Applying",
            "Awaiting Placement",
            "Ongoing",
            "Completed",
            "Terminated",
          ])}
        />
        <Filter
          name="sort"
          label="Sort by"
          choices={[
            { value: "name", label: "Student Name" },
            { value: "id", label: "Student ID" },
            { value: "hours", label: "Rendered Hours" },
            { value: "approvedHours", label: "Approved Hours" },
          ]}
        />
      </Filters>
      <Table
        headers={[
          "Student ID",
          "Student",
          "Program",
          "Placement",
          "Status",
          "Activation",
          "Rendered Hours",
          "Approved Hours",
          "Actions",
        ]}
        numeric={[6, 7]}
        hrefs={rows.map((s) => `/dashboard/students/${s.id}`)}
        rows={rows.map((s) => {
          const p = placementsForStudent(db, s.id)[0];
          return [
            <Mono key="id">{s.studentNumber}</Mono>,
            <Identity key="who" name={nameOf(s)} meta={s.email} />,
            <Stack
              key="program"
              primary={s.program}
              secondary={`${s.yearLevel} / ${s.section}`}
            />,
            p ? companyFor(db, p).name : "Not Yet Placed",
            <Status key="status">{studentStatus(db, s.id)}</Status>,
            <Status key="activation">
              {get(db.accounts, s.accountId).activationState ?? "Active"}
            </Status>,
            totalHours(s.id, "submitted"),
            totalHours(s.id),
            <RowLink href={`/dashboard/students/${s.id}`} key={6406}>
              Open student
            </RowLink>,
          ];
        })}
      />
    </>
  );
}
