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
  Status,
  Table,
  options,
  text,
  useFilters,
} from "../components/ui";
import {
  companyFor,
  hours,
  missingRequirements,
  nameOf,
  placementsForStudent,
  studentStatus,
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
  if (action === "create" || action === "edit") {
    if (!coordinator) return <RecordState title="Access denied" />;
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
          description="A linked synthetic student account is created with the documented public demo password. No real personal information."
        />
        <SaveForm
          submit={student ? "Save Changes" : "Save Student"}
          cancel={
            student
              ? `/dashboard/students/${student.id}`
              : "/dashboard/students"
          }
          save={async (data) => {
            const result = await mutate({
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
            });
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
                "BS Computer Engineering",
                "BS Information Technology",
                "BS Computer Science",
              ])}
            />
            <Field
              label="Year level"
              name="yearLevel"
              value={student?.yearLevel}
              options={options(["3rd Year", "4th Year"])}
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
    const reviewed = ps.reduce((sum, p) => sum + hours(db, p.id).reviewed, 0);
    return (
      <>
        <Back href="/dashboard/students">Student directory</Back>
        <PageHeader
          title={nameOf(student)}
          description={`${student.studentNumber} · ${student.program} · ${student.yearLevel} / ${student.section}`}
        >
          {coordinator && (
            <Link
              className="secondary-action"
              href={`/dashboard/students/${id}/edit`}
            >
              Edit Profile
            </Link>
          )}
        </PageHeader>
        <Details
          items={[
            ["Email", student.email],
            [
              "Status",
              <Status key={3387}>{studentStatus(db, student.id)}</Status>,
            ],
            ["Reviewed hours (all placements)", reviewed],
            ["Academic year", student.academicYear],
            [
              "Current mandatory eligibility",
              account.role === "Company Supervisor"
                ? "Document checklist is not shared with this role"
                : missingRequirements(db, student.id).length
                  ? "Incomplete — approval needed"
                  : "Eligible under demo policy",
            ],
          ]}
        />
        <div className="record-links">
          {account.role !== "Company Supervisor" && (
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
        </div>
        {account.role !== "Company Supervisor" && (
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
      </>
    );
  }
  const totalHours = (studentId: string) =>
    placementsForStudent(db, studentId).reduce(
      (sum, p) => sum + hours(db, p.id).reviewed,
      0,
    );
  const rows = db.students
    .filter(
      (s) =>
        s.academicYear === year &&
        searchMatches(filters.value("q"), nameOf(s), s.studentNumber) &&
        matches(filters.value("program"), s.program) &&
        matches(filters.value("yearLevel"), s.yearLevel) &&
        matches(filters.value("section"), s.section) &&
        matches(filters.value("status"), studentStatus(db, s.id)),
    )
    .sort((a, b) =>
      filters.value("sort") === "hours"
        ? totalHours(b.id) - totalHours(a.id)
        : filters.value("sort") === "id"
          ? a.studentNumber.localeCompare(b.studentNumber)
          : nameOf(a).localeCompare(nameOf(b)),
    );
  return (
    <>
      <PageHeader
        title={coordinator ? "Students" : "Assigned students"}
        description={`Academic year ${year} · ${rows.length} records`}
      >
        {coordinator && (
          <Link className="primary-action" href="/dashboard/students/create">
            + Add Student
          </Link>
        )}
      </PageHeader>
      <Filters>
        <Search placeholder="Student name or ID" />
        <Filter
          name="program"
          label="Program"
          choices={options(db.students.map((s) => s.program))}
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
          ]}
        />
      </Filters>
      <Table
        headers={[
          "Student ID",
          "Student",
          "Program",
          "Year / Section",
          "Placement",
          "Status",
          "Reviewed Hours",
          "Actions",
        ]}
        rows={rows.map((s) => {
          const p = placementsForStudent(db, s.id)[0];
          return [
            s.studentNumber,
            nameOf(s),
            s.program,
            `${s.yearLevel} / ${s.section}`,
            p ? companyFor(db, p).name : "Not Yet Placed",
            studentStatus(db, s.id),
            totalHours(s.id),
            <Link href={`/dashboard/students/${s.id}`} key={6406}>
              Open student
            </Link>,
          ];
        })}
      />
    </>
  );
}
