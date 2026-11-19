# Business rules and demonstration policies

The complete 23-page **PUP INTERNLINK_System Flow.pdf** is the supplied primary source. Its text is retained in [specification-text.txt](evidence/specification-text.txt), hash recorded in REPOSITORY_AUDIT. It refers to an unavailable approved ERD. No separate approved SQL/API/permission matrix/rubric exists locally. The following distinction is essential: source-supported requirements are implemented using explicitly reversible demonstration policies where the source is incomplete.

| Source-supported rule | PDF / implementation |
| --- | --- |
| Credentials/active accounts/role restrictions | p.1; service.ts / scopedDatabase / Workspace / PortalPage. Simulated only. |
| Required unique student number/email, academic identity and successful profile redirect | pp.3–4; student.save / Students. |
| Unique company name/contact email, required contact/address/MOA; supervisor belongs to company and account | pp.6–7; company.save / supervisor.save. |
| Mandatory/Optional requirements; Pending/Approved/Rejected submissions; rejection reason/reviewer | pp.8–10; submission commands, Blob persistence and attempt history. |
| Mandatory documents submitted before placement | p.10, references absent ERD; stricter approved-latest policy below is a demo assumption. |
| Registered company, required title/description, positive slots; conditional opportunity approval | p.11; opportunity commands; approval adopted in demo. |
| Pending/Accepted/Rejected applications, reason/history, accepted-to-placement | pp.12–14; persistent application commands/history. |
| Accepted application, unique placement per application, readonly derived context, required dates/hours/registered faculty/same-company supervisor | pp.15–16; placement.create. |
| Ongoing/Completed/Terminated states; actual certificate information | pp.14–17,23; placement commands / Certificate records. |
| Completion = rendered / required ×100; 243/486=50%; report details/review | pp.18–19; rules.hours and report commands. |
| At most two evaluations by assigned company supervisor/faculty; Pending/Submitted; completion summary | pp.19–20; exactly two obligations at placement creation, authorized submission only. |
| Seven report categories, filters, generation, export/print | pp.20–21; reporting.ts / Reports. |

## Adopted demonstration policies

These resolve BR-Q01–18 from the historical audit for independent front-end operation; institutional approval is still required before real integration. Decisions D-016–026 contain rationale.

| Topic / former question | Reversible implemented policy |
| --- | --- |
| IDs/entities BR-Q01 | Opaque internal IDs, separate public student number; normalized front-end types, not SQL assertions. |
| Accounts BR-Q02 | Student/supervisor maintenance provisions linked synthetic accounts with public demo verifier. Faculty/coordinator seed accounts only; no production invites/password reset/admin. Active account required. |
| Roles BR-Q03 | Coordinator manages records/decisions/completion; students submit own documents/applications/reports; assigned faculty review requirements/progress and submit their evaluation; assigned supervisors review progress and submit theirs, no student document access. Read scopes and command scopes both checked. |
| Mandatory requirements BR-Q04 | All current mandatory requirements' latest attempts must be Approved for acceptance and placement. This is intentionally stricter than PDF 'submitted'; not an approved ERD fact. |
| Resubmission/version BR-Q05 | Only missing/rejected documents resubmitted; immutable prior attempts, latest pending reviewed once, reason/time/reviewer retained. Requirement definitions can be edited; required IDs frozen on placement creation to avoid retroactive mandatory additions. No review reversal. |
| Opportunity BR-Q06 | New postings Pending Approval; coordinator approve/reopen or close; students see available approved postings. Company cannot change after applications exist; capacity cannot fall below allocation. No invented deadline/program/work-setup policy. |
| Partnership BR-Q07 | Unapproved/future-start = Pending; end before today = Expired; approved date-valid agreement within inclusive 30 days of end = Expiring Soon, otherwise Active. Active/Expiring eligible. Existing placements retained after expiry; new acceptance/placement blocked when unavailable. |
| Capacity BR-Q08 | Non-terminated placements consume one slot, including Completed; Accepted applications reserve none. Creation rechecks atomically. Termination releases; no deletion/double decrement. Last-slot race tested. |
| Applications BR-Q09 | One application per student/opportunity, no withdrawals/reapply/reversal. Pending → Accepted or Rejected once; mandatory rejection reason. Receipt/id/domain guards prevent repeated decision effects. |
| Multiple placements BR-Q10 | At most one Ongoing placement per student and one placement per application; later nonoverlapping lifecycle possible via a different application after completion/termination. No assignment transfer UI. |
| Hours BR-Q11 | One daily report per placement/date, positive finite hours ≤12, within placement dates and not future; fractional allowed. Only Reviewed hours count officially; submitted total shown separately. Review once with remarks. Equal start/end dates allowed; required hours positive. Percent is reviewed/required×100, remaining clamped ≥0; overrun visible numerically. |
| Reporting BR-Q12 | Daily report records; a gap exceeding seven days since start/latest work date is a local reminder, not institutional attendance adjudication. Near completion =75%+ reviewed. Reporting window ends at placement end. |
| Grades BR-Q13 | Exactly one assigned faculty and company obligation; score 0–100 with comments, immutable Submitted state. No third/self evaluation, no weighted final grade or passing threshold. |
| Completion BR-Q14 | Coordinator marks Ongoing complete only when reviewed hours meet required, no pending reports, frozen mandatory documents Approved and both evaluations Submitted. End date/grade pass threshold not prerequisites under demo policy. |
| Certificate BR-Q15 | Coordinator explicitly records unique synthetic number/date after eligible completion. Date between completion and today. No automatic issuance, PDF certificate generation, revocation or official authority claim. |
| Termination BR-Q16 | Coordinator terminates Ongoing with reason, preserves reports/evaluations/history and releases slot; no further reports/evaluations/completion on terminated placement. No extra Cancelled state. |
| Term/settings BR-Q17 | Academic-year strings and per-account default filter preference, not institutional term administration. Original seed 2026–2027; user can select/add appropriate year in maintenance. |
| Outputs/files/roles BR-Q18 | CSV and print; TXT/PDF/PNG/JPEG nonempty ≤5 MB real local Blobs; private scope simulated; no production scanning. Minimal additional role screens are labelled demo extensions. Local reminders only, no email/SMS. |

Every production invariant, permission and relationship must be enforced again by the server/database, including idempotent duplicate prevention and transactional capacity. Browser-local data and client guards cannot protect data from their profile owner. No unresolved policy is silently claimed as owner-approved.

Engineering bounds are demonstration choices: capacity and required hours cannot exceed 10,000; daily report hours cannot exceed 12. Date-only comparisons use the UTC ISO calendar day, while audit timestamps display in the browser's locale. The receiving team must agree institutional timezone/calendar and maximum values before real integration.
