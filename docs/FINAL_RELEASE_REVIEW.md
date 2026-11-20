# Final release review — initial findings checkpoint

Reviewed3698d8ddfd96cef39c80e1a18d127a45583a8cf3, branch frontend/interface-update. Source unmodified during initial audit. Both specifications read in entirety; rendered30pages and extracted full embedded original-page23 flow (clipped by PDF page bounds) for visual inspection. Exact hashes/page counts in evidence/final-review/baseline.json. No approved ERD/API supplied.

**Independence limitation:** this root conversation contains implementation/repair history. A fresh-context/personnel-independent review cannot truthfully be claimed. New hypotheses/tests challenged previous claims; future repairs are self-verified. This limitation is separate from functional front-end readiness.

Clean isolated git archive installation: npm ci --ignore-scripts --no-audit --no-fund installed427packages; original native120/120 passed. New native adversarial checks:6failed/2passed (account revocation/current-MOA policy vs genuine migration preservation/rollback). New browser checks: genuine old-data upgrade/attachment downloads/explicit admin provisioning and same-account multi-tab password revocation pass; active metric fails. Cross-cohort test first had an incorrect1-vs2 fixture count; corrected expected count then reproduced real2-vs1 directory mismatch. Rendered-hour omission independently reproduced. Failure logs remain before repairs.

Initial findings:0critical/0high/5medium/0low. All Open at this checkpoint. Full machine-readable reproduction/expected-observed/evidence/impact/repair: evidence/final-review/initial-findings.json. Canonical131 requirements and42delta mappings inspected; five reused mappings and37 appended IDs are consistent as decomposition, but initial PASS claims for affected rows require repair. AUTH-004 institutional provisioning approval stays external; four exclusions match optional export, unapproved deadline/program restrictions, absent self-evaluation and intentional actual backend exclusion.

## FR-01 — MEDIUM — Account lifecycle

- Location: app/lib/updates.ts:249; app/lib/commands.ts:120,283. Requirements: AUTH-005, IU-006, IU-019, IU-032.
- Reproduce: Use a separate signed-in faculty session. Coordinator deactivates/reactivates the unassigned faculty before that session refreshes. Also edit a student/faculty/supervisor email administratively after generating recovery.
- Expected: Activation/email changes advance credential version and revoke outstanding requests; old supported sessions and requests cannot revive.
- Observed: Faculty activation leaves version unchanged; all three administrative email edit paths retain the old version and request. Prior session still returns account; old reset request succeeds with the changed email.
- Impact: Inconsistent documented session/request revocation; inactive accounts are denied while inactive, so no system-wide role escalation.
- Repair: Apply shared revocation on changed administrative email or activation state, preserving harmless profile-only edits.
- Evidence: initial-adversarial-confirmed.txt/json. Status: Open.

## FR-02 — MEDIUM — Intern Supervisor directory

- Location: app/features/Students.tsx:360-379. Requirements: IU-035, IU-038, DSH-003.
- Reproduce: Coordinator changes Mira academic year to prior year; Intern dashboard in current placement year shows2 assigned interns. Follow Total assigned interns.
- Expected: My Interns lists the2 authorized placements in selected placement year regardless of registration cohort.
- Observed: Directory filters Student.academicYear and shows1, omitting Mira despite current assigned placement.
- Impact: Assigned intern and dashboard directory disagree across legitimate cohorts.
- Repair: Use placement year for interns=true while retaining ordinary student-directory cohort filtering.
- Evidence: initial-browser-corrected.txt. Status: Open.

## FR-03 — MEDIUM — Coordinator dashboard

- Location: app/features/Dashboard.tsx:34-36. Requirements: DSH-001, DSH-003, IU-015.
- Reproduce: Expire company1 MOA through partner form; both posting records remain Active with slots, only1 remains eligible.
- Expected: Active status summary2; distinct Available summary1, each links to corresponding filter.
- Observed: Card labeled Active internship opportunities displays1 using availability and available=true. Original available summary was relabelled, not retained separately.
- Impact: Incorrect required metric and conflation of posting state with eligibility.
- Repair: Count derived Active posting state with status filter; retain original Available opportunities card separately.
- Evidence: initial-browser.txt. Status: Open.

## FR-04 — MEDIUM — Posting activation

- Location: app/lib/updates.ts:407-448; docs/BUSINESS_RULES.md updated policy. Requirements: IU-031, OPP-003.
- Reproduce: Deactivate previously approved opp1, expire its company MOA, request activation.
- Expected: Published demo activation policy rejects expired/unapproved MOA without mutation.
- Observed: Activation succeeds and writes Active despite documented current-MOA prerequisite. Student availability independently still blocks applications.
- Impact: Posting lifecycle violates published demonstration rule; no student availability bypass.
- Repair: Enforce existing documented eligibility on activation using the service clock; retain deactivation and historical records.
- Evidence: initial-adversarial-confirmed.txt/json. Status: Open.

## FR-05 — MEDIUM — Student directory hours

- Location: app/features/Students.tsx:354-357,387,481-514. Requirements: STU-004, STU-001.
- Reproduce: Open student directory containing pending reports, inspect hour columns and sort modes.
- Expected: Original specified rendered-hour display/sort remains alongside updated approved-hour accounting.
- Observed: Only Approved Hours column/sort is exposed; hours sort computes approved, not rendered, despite STU-004 markedPASS.
- Impact: Previously required rendered-hour functionality omitted rather than explicitly superseded.
- Repair: Restore rendered column and hours sort; retain approved display/sort as separate choices with independent oracle.
- Evidence: initial-browser-hours.txt. Status: Open.

