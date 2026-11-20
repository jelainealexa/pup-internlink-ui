"use client";
import { Opportunity } from "../lib/domain";
import { get } from "../lib/rules";
import { ActionButton, Field, SaveForm, Table, text } from "../components/ui";
import { accountName, useData } from "./shared";

export function PostingControls({
  opportunity: o,
}: {
  opportunity: Opportunity;
}) {
  const { db, account, mutate, setNotice } = useData();
  const admin = account.role === "Company Supervisor",
    coordinator = account.role === "Coordinator";
  const stage = admin ? "Company" : "Coordinator";
  const canDecide =
    (admin &&
      ["Pending Approval - Company", "Rejected", "Deactivated"].includes(
        o.status,
      )) ||
    (coordinator && o.status === "Pending Approval - Coordinator");
  return (
    <>
      {canDecide && (
        <section>
          <h2>{stage} posting review</h2>
          <SaveForm
            revision={db.revision}
            submit={`Save ${stage} Posting Decision`}
            save={async (data, revision) => {
              await mutate(
                {
                  type: "opportunity.decide",
                  id: o.id,
                  stage,
                  decision: text(data, "decision") as "Approved" | "Rejected",
                  remarks: text(data, "remarks"),
                },
                undefined,
                revision,
              );
              setNotice("Posting decision saved with reviewer and timestamp.");
            }}
          >
            <Field
              label="Posting decision"
              name="decision"
              value="Approved"
              options={[
                {
                  value: "Approved",
                  label: admin
                    ? "Approve and submit to coordinator"
                    : "Approve posting",
                },
                { value: "Rejected", label: "Reject posting" },
              ]}
            />
            <Field
              label="Posting remarks"
              name="remarks"
              type="textarea"
              required={false}
              hint="Rejection requires remarks."
            />
          </SaveForm>
        </section>
      )}
      {(admin || coordinator) && (
        <section>
          <h2>Posting activation</h2>
          <p>
            Both approvals and an active assigned Intern Supervisor are required
            before new applications. Filled status derives from allocated
            capacity.
          </p>
          {["Approved", "Deactivated"].includes(o.status) && (
            <ActionButton
              confirm="Activate this approved posting for eligible student applications?"
              action={async () => {
                await mutate({
                  type: "opportunity.activate",
                  id: o.id,
                  active: true,
                });
              }}
            >
              Activate Posting
            </ActionButton>
          )}
          {["Approved", "Active", "Filled"].includes(o.status) && (
            <ActionButton
              confirm="Deactivate this posting? Historical applications and placements remain."
              action={async () => {
                await mutate({
                  type: "opportunity.activate",
                  id: o.id,
                  active: false,
                });
              }}
            >
              Deactivate Posting
            </ActionButton>
          )}
        </section>
      )}
      {(admin || coordinator) && (
        <section>
          <h2>Assigned Intern Supervisors</h2>
          <SaveForm
            revision={db.revision}
            submit="Save Opportunity Assignments"
            save={async (data, revision) => {
              await mutate(
                {
                  type: "opportunity.assign",
                  id: o.id,
                  supervisorIds: data.getAll("supervisorIds").map(String),
                },
                undefined,
                revision,
              );
              setNotice("Opportunity assignments saved.");
            }}
          >
            {db.supervisors
              .filter(
                (s) =>
                  s.companyId === o.companyId &&
                  get(db.accounts, s.accountId).role === "Intern Supervisor" &&
                  get(db.accounts, s.accountId).active,
              )
              .map((s) => (
                <label className="checkbox-field" key={s.id}>
                  <input
                    type="checkbox"
                    name="supervisorIds"
                    value={s.id}
                    defaultChecked={o.supervisorIds?.includes(s.id)}
                  />
                  {accountName(db, s.accountId)}
                </label>
              ))}
            <p>
              Manage Intern Supervisor accounts inside the company profile.
              Removing an assignment preserves historical placement assignments
              and decisions.
            </p>
          </SaveForm>
        </section>
      )}
      <section>
        <h2>Posting decision history</h2>
        {o.legacyApproval && (
          <p>
            Grandfathered version-one approval; no new company approval is
            fabricated.
          </p>
        )}
        <Table
          headers={["Stage", "Outcome", "Reviewer", "Date", "Remarks"]}
          rows={(o.decisions ?? []).map((d) => [
            d.stage,
            d.outcome,
            accountName(db, d.actorId),
            d.at,
            d.remarks,
          ])}
        />
      </section>
      {(admin || coordinator) && (
        <section>
          <h2>Opportunity assignment history</h2>
          <Table
            headers={[
              "Previous supervisors",
              "New supervisors",
              "Actor",
              "Date",
            ]}
            rows={(o.assignmentHistory ?? []).map((h) => [
              h.from
                .map((id) => db.supervisors.find((s) => s.id === id)?.accountId)
                .map((id) => accountName(db, id))
                .join(", "),
              h.to
                .map((id) => db.supervisors.find((s) => s.id === id)?.accountId)
                .map((id) => accountName(db, id))
                .join(", "),
              accountName(db, h.actorId),
              h.at,
            ])}
          />
        </section>
      )}
    </>
  );
}
