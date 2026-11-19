"use client";
import Link from "next/link";
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
import {
  applicationFor,
  companyFor,
  get,
  nameOf,
  studentFor,
} from "../lib/rules";
import {
  FeatureProps,
  accountName,
  matches,
  searchMatches,
  useData,
  useYear,
} from "./shared";

export function Evaluations({ id }: FeatureProps) {
  const { db, account, mutate, setNotice } = useData();
  const filters = useFilters(),
    year = useYear();
  if (id) {
    const e = db.evaluations.find((e) => e.id === id);
    if (!e) return <RecordState />;
    const p = get(db.placements, e.placementId),
      student = studentFor(db, p),
      evaluator = get(db.accounts, e.evaluatorId);
    return (
      <>
        <Back href={`/dashboard/evaluations?placement=${p.id}`}>
          Placement evaluations
        </Back>
        <PageHeader
          title="Evaluation details"
          description={`${nameOf(student)} · ${evaluator.role} · ${e.status}`}
        />
        <Details
          items={[
            ["Evaluation ID", e.id],
            [
              "Student",
              <Link href={`/dashboard/students/${student.id}`} key={1020}>
                {nameOf(student)}
              </Link>,
            ],
            [
              "Placement",
              <Link href={`/dashboard/placements/${p.id}`} key={1110}>
                {p.id}
              </Link>,
            ],
            ["Company", companyFor(db, p).name],
            ["Evaluator", evaluator.name],
            ["Evaluator role", evaluator.role],
            [
              "Submission date",
              e.submittedAt ? new Date(e.submittedAt).toLocaleString() : "—",
            ],
            ["Demonstration score", e.grade ?? "Not submitted"],
            ["Comments", e.comments],
            ["Status", e.status],
          ]}
        />
        <p className="scope-note">
          Demo score scale: 0–100. This is not an approved PUP grading rubric.
          Exactly two assigned obligations exist per placement, one per
          evaluator role.
        </p>
        {e.evaluatorId === account.id &&
        e.status === "Pending" &&
        p.status === "Ongoing" ? (
          <SaveForm
            submit="Submit Evaluation"
            save={async (data) => {
              await mutate({
                type: "evaluation.submit",
                id: e.id,
                grade: number(data, "grade"),
                comments: text(data, "comments"),
              });
              setNotice("Assigned evaluation saved.");
            }}
          >
            <div className="form-grid">
              <Field
                label="Demonstration score (0–100)"
                name="grade"
                type="number"
                min={0}
                max={100}
                step={0.01}
              />
              <Field
                label="Evaluation comments"
                name="comments"
                type="textarea"
              />
            </div>
          </SaveForm>
        ) : (
          <p>
            {e.status === "Submitted"
              ? "This obligation has been submitted and cannot be submitted again."
              : "Only the assigned active faculty adviser or company supervisor may submit this evaluation for an ongoing placement."}
          </p>
        )}
        <h2>Placement evaluation obligations</h2>
        <Table
          headers={["Evaluator", "Role", "Status", "Actions"]}
          rows={db.evaluations
            .filter((x) => x.placementId === p.id)
            .map((x) => [
              accountName(db, x.evaluatorId),
              get(db.accounts, x.evaluatorId).role,
              x.status,
              <Link href={`/dashboard/evaluations/${x.id}`} key={2636}>
                Open obligation
              </Link>,
            ])}
        />
      </>
    );
  }
  const rows = db.evaluations.filter((e) => {
    const p = get(db.placements, e.placementId);
    return (
      p.academicYear === year &&
      matches(filters.value("student"), applicationFor(db, p).studentId) &&
      matches(filters.value("placement"), p.id) &&
      matches(filters.value("status"), e.status) &&
      matches(filters.value("role"), get(db.accounts, e.evaluatorId).role) &&
      matches(filters.value("evaluator"), e.evaluatorId) &&
      searchMatches(
        filters.value("q"),
        nameOf(studentFor(db, p)),
        accountName(db, e.evaluatorId),
        p.id,
      )
    );
  });
  return (
    <>
      <PageHeader
        title="Evaluations"
        description={`${rows.length} individual obligations · ${year}. Completion depends on both required submissions, not a hardcoded placement label.`}
      />
      <Filters>
        <Search placeholder="Student, placement or evaluator" />
        <Filter
          name="status"
          label="Evaluation status"
          choices={options(["Pending", "Submitted"])}
        />
        <Filter
          name="role"
          label="Evaluator role"
          choices={options(["Faculty Adviser", "Company Supervisor"])}
        />
        <Filter
          name="evaluator"
          label="Assigned evaluator"
          choices={db.accounts
            .filter((a) =>
              ["Faculty Adviser", "Company Supervisor"].includes(a.role),
            )
            .map((a) => ({ value: a.id, label: a.name }))}
        />
        <Filter
          name="student"
          label="Student"
          choices={db.students.map((s) => ({ value: s.id, label: nameOf(s) }))}
        />
      </Filters>
      <Table
        headers={[
          "Evaluation",
          "Student",
          "Company",
          "Placement",
          "Evaluator",
          "Date",
          "Score",
          "Status",
          "Actions",
        ]}
        rows={rows.map((e) => {
          const p = get(db.placements, e.placementId);
          return [
            e.id,
            nameOf(studentFor(db, p)),
            companyFor(db, p).name,
            p.id,
            `${accountName(db, e.evaluatorId)} (${get(db.accounts, e.evaluatorId).role})`,
            e.submittedAt?.slice(0, 10) ?? "—",
            e.grade ?? "—",
            e.status,
            <Link href={`/dashboard/evaluations/${e.id}`} key={4397}>
              Open evaluation
            </Link>,
          ];
        })}
      />
    </>
  );
}
