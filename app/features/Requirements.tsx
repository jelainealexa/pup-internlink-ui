"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  options,
  text,
  useFilters,
} from "../components/ui";
import {
  canReviewStudent,
  get,
  latestSubmission,
  missingRequirements,
  nameOf,
} from "../lib/rules";
import {
  FeatureProps,
  accountName,
  matches,
  searchMatches,
  useData,
  useYear,
} from "./shared";

export function RequirementChecklist({ studentId }: { studentId: string }) {
  const { db, account } = useData();
  return (
    <>
      <p>
        {missingRequirements(db, studentId).length
          ? `${missingRequirements(db, studentId).length} mandatory requirement(s) still need approval.`
          : "All current mandatory requirements are approved under the demonstration policy."}
      </p>
      <Table
        headers={[
          "Requirement",
          "Classification",
          "Latest status",
          "Submission date",
          "Reviewer / Remarks",
          "Actions",
        ]}
        rows={db.requirements.map((r) => {
          const s = latestSubmission(db, studentId, r.id);
          return [
            r.name,
            r.classification,
            s?.status ?? "Not Submitted",
            s?.submittedAt.slice(0, 10) ?? "—",
            s ? (
              <>
                {accountName(db, s.reviewerId)}
                <br />
                {s.reason}
              </>
            ) : (
              "—"
            ),
            <div className="action-bar" key={1239}>
              {s && (
                <Link href={`/dashboard/requirements/submissions/${s.id}`}>
                  Open submission
                </Link>
              )}
              {["Coordinator", "Student"].includes(account.role) &&
                (!s || s.status === "Rejected") && (
                  <Link
                    href={`/dashboard/requirements/submissions/create?student=${studentId}&requirement=${r.id}`}
                  >
                    {s ? "Resubmit" : "Submit document"}
                  </Link>
                )}
            </div>,
          ];
        })}
      />
    </>
  );
}
export function AttachmentPreview({ fileId }: { fileId: string }) {
  const { service } = useData();
  const [preview, setPreview] = useState<{
      url: string;
      name: string;
      mime: string;
      content: string;
    } | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let canceled = false;
    let url: string | undefined;
    void service
      .attachment(fileId)
      .then(async (file) => {
        url = URL.createObjectURL(file.blob);
        const content =
          file.mime === "text/plain" ? await file.blob.text() : "";
        if (!canceled)
          setPreview({ url, name: file.name, mime: file.mime, content });
        else URL.revokeObjectURL(url);
      })
      .catch((e) => {
        if (!canceled)
          setError(e instanceof Error ? e.message : "Attachment unavailable.");
      });
    return () => {
      canceled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [service, fileId]);
  if (error) return <p role="alert">{error}</p>;
  if (!preview) return <p role="status">Loading saved attachment…</p>;
  return (
    <section className="attachment-preview">
      <h2>Stored document</h2>
      <a href={preview.url} download={preview.name} className="simple-action">
        Download {preview.name}
      </a>
      {preview.mime === "text/plain" ? (
        <pre>{preview.content}</pre>
      ) : preview.mime.startsWith("image/") ? (
        <Image
          src={preview.url}
          alt={`Submitted document: ${preview.name}`}
          width={600}
          height={600}
          unoptimized
          style={{ objectFit: "contain", maxWidth: "100%", height: "auto" }}
        />
      ) : (
        <iframe
          title={`PDF preview: ${preview.name}`}
          src={preview.url}
          sandbox=""
          className="document-frame"
        />
      )}
      <p>Browser-local attachment. If preview is unsupported, use Download.</p>
    </section>
  );
}
export function Requirements({ id, action }: FeatureProps) {
  const { db, account, mutate, setNotice } = useData();
  const router = useRouter(),
    filters = useFilters(),
    year = useYear();
  const coordinator = account.role === "Coordinator";
  const studentId =
    account.role === "Student"
      ? (db.students.find((s) => s.accountId === account.id)?.id ?? "")
      : filters.value("student");
  if (action === "submission-create") {
    if (!["Coordinator", "Student"].includes(account.role))
      return <RecordState title="Access denied" />;
    return (
      <>
        <Back
          href={`/dashboard/requirements?view=submissions${studentId ? `&student=${studentId}` : ""}`}
        >
          Requirement submissions
        </Back>
        <PageHeader
          title="Submit requirement"
          description="TXT, PDF, PNG or JPEG, up to 5 MB. The actual file is stored in this browser. Only missing or rejected requirements may be submitted again."
        />
        <SaveForm
          submit="Store and submit document"
          cancel="/dashboard/requirements?view=submissions"
          save={async (data) => {
            const file = data.get("attachment") as File | null;
            if (!file || !file.size)
              throw new Error("Select a nonempty document.");
            const result = await mutate({
              type: "submission.create",
              studentId: text(data, "studentId"),
              requirementId: text(data, "requirementId"),
              file: {
                name: file.name,
                mime: file.type,
                size: file.size,
                blob: file,
              },
            });
            setNotice("The file and submission were saved in this browser.");
            router.push(`/dashboard/requirements/submissions/${result}`);
          }}
        >
          <div className="form-grid">
            <Field
              label="Student"
              name="studentId"
              value={studentId}
              options={db.students.map((s) => ({
                value: s.id,
                label: `${nameOf(s)} (${s.studentNumber})`,
              }))}
            />
            <Field
              label="Requirement"
              name="requirementId"
              value={filters.value("requirement")}
              options={db.requirements.map((r) => ({
                value: r.id,
                label: `${r.name} (${r.classification})`,
              }))}
            />
            <div className="field">
              <label htmlFor="submission-file">Document *</label>
              <input
                id="submission-file"
                name="attachment"
                type="file"
                accept=".txt,.pdf,.png,.jpg,.jpeg"
                required
              />
            </div>
          </div>
        </SaveForm>
      </>
    );
  }
  if (action === "submission-detail") {
    const s = db.submissions.find((s) => s.id === id);
    if (!s) return <RecordState />;
    const student = get(db.students, s.studentId),
      requirement = get(db.requirements, s.requirementId);
    const isLatest =
      latestSubmission(db, s.studentId, s.requirementId)?.id === s.id;
    return (
      <>
        <Back
          href={`/dashboard/requirements?view=submissions&student=${s.studentId}`}
        >
          Student submissions
        </Back>
        <PageHeader
          title={requirement.name}
          description={`${nameOf(student)} · Attempt ${s.attempt} · ${s.status}`}
        />
        <Details
          items={[
            [
              "Student",
              <Link href={`/dashboard/students/${student.id}`} key={5750}>
                {nameOf(student)} — {student.studentNumber}
              </Link>,
            ],
            ["Submission ID", s.id],
            ["Submitted", new Date(s.submittedAt).toLocaleString()],
            ["Reviewer", accountName(db, s.reviewerId)],
            [
              "Reviewed",
              s.reviewedAt ? new Date(s.reviewedAt).toLocaleString() : "—",
            ],
            ["Remarks / Rejection reason", s.reason],
            [
              "Current attempt",
              isLatest ? "Yes" : "Historical attempt — retained",
            ],
          ]}
        />
        <AttachmentPreview key={s.fileId} fileId={s.fileId} />
        {s.status === "Pending" &&
          isLatest &&
          canReviewStudent(db, account, student.id) && (
            <section>
              <h2>Review submission</h2>
              <div className="action-bar">
                <ActionButton
                  confirm="Approve this stored document? Your identity and review time will be recorded."
                  action={async () => {
                    await mutate({
                      type: "submission.review",
                      id: s.id,
                      decision: "Approved",
                      reason: "",
                    });
                    setNotice("Submission approved.");
                  }}
                >
                  Approve submission
                </ActionButton>
              </div>
              <SaveForm
                submit="Reject submission"
                save={async (data) => {
                  await mutate({
                    type: "submission.review",
                    id: s.id,
                    decision: "Rejected",
                    reason: text(data, "reason"),
                  });
                  setNotice("Submission rejected; reason retained.");
                }}
              >
                <Field label="Rejection reason" name="reason" type="textarea" />
              </SaveForm>
            </section>
          )}
        {s.status === "Rejected" &&
          isLatest &&
          ["Student", "Coordinator"].includes(account.role) && (
            <Link
              className="primary-action"
              href={`/dashboard/requirements/submissions/create?student=${s.studentId}&requirement=${s.requirementId}`}
            >
              Resubmit document
            </Link>
          )}
        <h2>Attempt history</h2>
        <Table
          headers={["Attempt", "Submitted", "Status", "Actions"]}
          rows={db.submissions
            .filter(
              (x) =>
                x.studentId === s.studentId &&
                x.requirementId === s.requirementId,
            )
            .sort((a, b) => b.attempt - a.attempt)
            .map((x) => [
              x.attempt,
              x.submittedAt.slice(0, 10),
              x.status,
              <Link
                href={`/dashboard/requirements/submissions/${x.id}`}
                key={7513}
              >
                Open attempt {x.attempt}
              </Link>,
            ])}
        />
      </>
    );
  }
  const definition = db.requirements.find((r) => r.id === id);
  if (action === "create" || action === "edit") {
    if (!coordinator) return <RecordState title="Access denied" />;
    if (action === "edit" && !definition) return <RecordState />;
    return (
      <>
        <Back href="/dashboard/requirements">Master requirements</Back>
        <PageHeader
          title={definition ? "Edit requirement" : "Add requirement"}
          description="Classification changes apply to eligibility for future placements. Existing placement obligations retain their creation-time requirement set."
        />
        <SaveForm
          submit="Save Requirement"
          cancel="/dashboard/requirements"
          save={async (data) => {
            await mutate({
              type: "requirement.save",
              id: definition?.id,
              input: {
                name: text(data, "name"),
                description: text(data, "description"),
                classification: text(data, "classification") as
                  "Mandatory" | "Optional",
              },
            });
            setNotice("Requirement definition saved.");
            router.push("/dashboard/requirements");
          }}
        >
          <div className="form-grid">
            <Field
              label="Requirement name"
              name="name"
              value={definition?.name}
            />
            <Field
              label="Classification"
              name="classification"
              value={definition?.classification ?? "Mandatory"}
              options={options(["Mandatory", "Optional"])}
            />
            <Field
              label="Description"
              name="description"
              type="textarea"
              value={definition?.description}
            />
          </div>
        </SaveForm>
      </>
    );
  }
  const submissionsView =
    !coordinator ||
    filters.value("view") === "submissions" ||
    !!studentId ||
    !!filters.value("status");
  const query = filters.value("q");
  const submissions = db.submissions
    .filter(
      (s) =>
        get(db.students, s.studentId).academicYear === year &&
        (filters.value("attempt") !== "latest" ||
          latestSubmission(db, s.studentId, s.requirementId)?.id === s.id) &&
        (!studentId || s.studentId === studentId) &&
        searchMatches(
          query,
          nameOf(get(db.students, s.studentId)),
          get(db.students, s.studentId).studentNumber,
          get(db.requirements, s.requirementId).name,
        ) &&
        matches(filters.value("status"), s.status),
    )
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  return (
    <>
      <PageHeader
        title="Requirements"
        description={`Connected master definitions, stored documents, review history and student eligibility. Submission year: ${year}.`}
      >
        {coordinator && (
          <Link
            href="/dashboard/requirements/create"
            className="primary-action"
          >
            + Add Requirement
          </Link>
        )}
        {["Coordinator", "Student"].includes(account.role) && (
          <Link
            href={`/dashboard/requirements/submissions/create${studentId ? `?student=${studentId}` : ""}`}
            className="secondary-action"
          >
            Submit document
          </Link>
        )}
      </PageHeader>
      <div className="record-links">
        {coordinator && (
          <Link
            href="/dashboard/requirements"
            aria-current={!submissionsView ? "page" : undefined}
          >
            Master requirements
          </Link>
        )}
        <Link
          href="/dashboard/requirements?view=submissions"
          aria-current={submissionsView ? "page" : undefined}
        >
          Student submissions
        </Link>
        <Link href="/dashboard/requirements?view=submissions&status=Pending">
          Pending reviews
        </Link>
        <Link href="/dashboard/requirements?view=submissions&status=Rejected">
          Rejected submissions
        </Link>
      </div>
      {studentId && db.students.some((s) => s.id === studentId) && (
        <section>
          <h2>{nameOf(get(db.students, studentId))}: checklist</h2>
          <RequirementChecklist studentId={studentId} />
        </section>
      )}
      <Filters>
        <Search placeholder="Student or requirement" />
        {submissionsView && (
          <Filter
            name="attempt"
            label="Submission attempts"
            choices={[{ value: "latest", label: "Latest per requirement" }]}
          />
        )}
        {submissionsView ? (
          <Filter
            name="status"
            label="Submission status"
            choices={options(["Pending", "Approved", "Rejected"])}
          />
        ) : (
          <Filter
            name="classification"
            label="Classification"
            choices={options(["Mandatory", "Optional"])}
          />
        )}
      </Filters>
      {submissionsView ? (
        <Table
          headers={[
            "Submission",
            "Student",
            "Requirement",
            "Attempt",
            "Date",
            "Status",
            "Reviewed by",
            "Actions",
          ]}
          rows={submissions.map((s) => [
            s.id,
            nameOf(get(db.students, s.studentId)),
            get(db.requirements, s.requirementId).name,
            s.attempt,
            s.submittedAt.slice(0, 10),
            s.status,
            accountName(db, s.reviewerId),
            <Link
              href={`/dashboard/requirements/submissions/${s.id}`}
              key={11216}
            >
              View submission
            </Link>,
          ])}
        />
      ) : (
        <Table
          headers={[
            "Requirement",
            "Description",
            "Classification",
            "Submissions",
            "Actions",
          ]}
          rows={db.requirements
            .filter(
              (r) =>
                searchMatches(query, r.name, r.description) &&
                matches(filters.value("classification"), r.classification),
            )
            .map((r) => [
              r.name,
              r.description,
              r.classification,
              db.submissions.filter((s) => s.requirementId === r.id).length,
              <Link href={`/dashboard/requirements/${r.id}/edit`} key={11651}>
                Edit requirement
              </Link>,
            ])}
        />
      )}
    </>
  );
}
