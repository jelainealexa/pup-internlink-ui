"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Back,
  Details,
  Field,
  PageHeader,
  RecordState,
  SaveForm,
  Table,
  text,
} from "../components/ui";
import { get, nameOf } from "../lib/rules";
import { FeatureProps, useData } from "./shared";

export function Faculty({ id, action }: FeatureProps) {
  const { db, account, mutate, setNotice } = useData(),
    router = useRouter();
  if (account.role !== "Coordinator")
    return <RecordState title="Access denied" />;
  const faculty = db.faculty.find((f) => f.id === id),
    person = faculty ? get(db.accounts, faculty.accountId) : undefined;
  if (action === "create" || action === "edit") {
    if (action === "edit" && !faculty) return <RecordState />;
    return (
      <>
        <Back href="/dashboard/faculty">Faculty records</Back>
        <PageHeader
          title={faculty ? "Edit Faculty Account" : "Register Faculty Account"}
        />
        <SaveForm
          revision={db.revision}
          submit="Save Faculty"
          cancel="/dashboard/faculty"
          save={async (data, revision) => {
            const result = await mutate(
              {
                type: "faculty.save",
                id: faculty?.id,
                name: text(data, "name"),
                email: text(data, "email"),
                active: text(data, "active") === "true",
              },
              undefined,
              revision,
            );
            setNotice("Faculty account saved.");
            router.push(`/dashboard/faculty/${result}`);
          }}
        >
          <Field label="Faculty name" name="name" value={person?.name} />
          <Field
            label="Registered email"
            name="email"
            type="email"
            value={person?.email}
          />
          <Field
            label="Account status"
            name="active"
            value={String(person?.active ?? true)}
            options={[
              { value: "true", label: "Active" },
              { value: "false", label: "Deactivated" },
            ]}
          />
          <p>
            New faculty accounts use the public demonstration password.
            Deactivation requires resolving active assignments.
          </p>
        </SaveForm>
      </>
    );
  }
  if (id) {
    if (!faculty || !person) return <RecordState />;
    const assigned = db.students.filter((s) => s.adviserId === id);
    return (
      <>
        <Back href="/dashboard/faculty">Faculty records</Back>
        <PageHeader
          title={person.name}
          description="Faculty Adviser account and student assignments"
        >
          <Link href={`/dashboard/faculty/${id}/edit`}>
            Edit Faculty Account
          </Link>
        </PageHeader>
        <Details
          items={[
            ["Email", person.email],
            ["Status", person.active ? "Active" : "Deactivated"],
            ["Assigned students", assigned.length],
            [
              "Ongoing placements",
              db.placements.filter(
                (p) => p.adviserId === id && p.status === "Ongoing",
              ).length,
            ],
          ]}
        />
        <h2>Assign a student</h2>
        <SaveForm
          revision={db.revision}
          submit="Assign Student"
          save={async (data, revision) => {
            await mutate(
              {
                type: "faculty.assign",
                studentId: text(data, "studentId"),
                adviserId: id,
              },
              undefined,
              revision,
            );
            setNotice("Student assignment saved.");
          }}
        >
          <Field
            label="Student"
            name="studentId"
            options={db.students.map((s) => ({
              value: s.id,
              label: `${nameOf(s)} (${s.studentNumber})`,
            }))}
          />
          <p>
            Ongoing placements retain their original adviser. Historical
            placements and evaluations are preserved.
          </p>
        </SaveForm>
        <Table
          headers={[
            "Student number",
            "Student",
            "Program / Year / Section",
            "Actions",
          ]}
          rows={assigned.map((s) => [
            s.studentNumber,
            nameOf(s),
            `${s.program} / ${s.yearLevel} / ${s.section}`,
            <Link key={s.id} href={`/dashboard/students/${s.id}`}>
              Open student
            </Link>,
          ])}
        />
      </>
    );
  }
  return (
    <>
      <PageHeader
        title="Faculty Management"
        description="Registered advisers and pre-placement student assignments"
      >
        <Link className="primary-action" href="/dashboard/faculty/create">
          Register Faculty Account
        </Link>
      </PageHeader>
      <Table
        headers={[
          "Faculty Adviser",
          "Email",
          "Status",
          "Assigned students",
          "Ongoing placements",
          "Actions",
        ]}
        rows={db.faculty.map((f) => {
          const a = get(db.accounts, f.accountId);
          return [
            a.name,
            a.email,
            a.active ? "Active" : "Deactivated",
            db.students.filter((s) => s.adviserId === f.id).length,
            db.placements.filter(
              (p) => p.adviserId === f.id && p.status === "Ongoing",
            ).length,
            <Link key={f.id} href={`/dashboard/faculty/${f.id}`}>
              Open faculty
            </Link>,
          ];
        })}
      />
    </>
  );
}
