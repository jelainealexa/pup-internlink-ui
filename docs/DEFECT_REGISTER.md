# Defect register

Original reviewed commit: **d71e7265dbb2d136a0ea7f5f08c13e6b24278ba2**. Initial source audit completed before application repairs. Entries below preserve the original observed behavior; current dispositions are recorded below. The original failing assertions and initial Open statuses remain in commit a147c0b and original-findings.json. No production backend absence is treated as a front-end defect.

Initial findings: **0 critical, 1 high, 11 medium, 1 low**. Additional audit findings IV-14–16 add two medium and one low: **16 total (0 critical, 1 high, 13 medium, 2 low)**. Status vocabulary: Open / Fixed / Partially fixed / Unverified / Accepted limitation / Outside front-end scope.

## IV-01 — MEDIUM — Persistence

- Status: **Fixed**; requirements: FND-002.
- Original location: `app/lib/storage.ts:81`.
- Reproduction: Seed an IndexedDbStore, make put throw QuotaExceededError, then read existing data.
- Expected: Existing records remain readable without a write.
- Observed: read() executes a readwrite transaction and put; a failed write prevents reading unchanged records.
- Impact: Read availability and unnecessary full-Blob rewrites.
- Recommended repair: Use validated readonly reads; initialize atomically only when absent.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Original failure preserved; passing repaired service/component/browser regression is linked in the verification matrix below.

## IV-02 — MEDIUM — Temporal state

- Status: **Fixed**; requirements: FND-001; OPP-005; SET-001.
- Original location: `app/lib/commands.ts:785`.
- Reproduction: Seed at 2032-04-15 and inject that clock into DemoService; inspect availability and a student default year.
- Expected: Availability uses the service clock; default year follows scoped records.
- Observed: Projection uses real current time; defaultPreferences falls back to2026 even when records belong to2032.
- Impact: Deterministic verification and future-year role views are inconsistent.
- Recommended repair: Pass clock through projection and derive unset year preferences from relevant records.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Original failure preserved; passing repaired service/component/browser regression is linked in the verification matrix below.

## IV-03 — MEDIUM — Student access

- Status: **Fixed**; requirements: AUTH-002; OPP-003.
- Original location: `app/lib/commands.ts:809`.
- Reproduction: Sign in as student@example.test and open /dashboard/internships/opp-3.
- Expected: Unapproved unrelated posting is unavailable; own application history remains accessible.
- Observed: Company-level projection includes another Pending Approval posting and detail URL displays it.
- Impact: Unapproved posting visibility through ordinary navigation.
- Recommended repair: Restrict student projection to eligible postings or their own application references.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Original failure preserved; passing repaired service/component/browser regression is linked in the verification matrix below.

## IV-04 — MEDIUM — Command boundary

- Status: **Fixed**; requirements: FND-003; FND-004.
- Original location: `app/lib/commands.ts:92`.
- Reproduction: Execute an unknown runtime command through DemoService.
- Expected: Reject with VALIDATION and leave state unchanged.
- Observed: Returns an empty successful result and writes revision/receipt/activity.
- Impact: False success at typed service runtime boundary.
- Recommended repair: Add a fail-closed default command branch.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Original failure preserved; passing repaired service/component/browser regression is linked in the verification matrix below.

## IV-05 — MEDIUM — Idempotency

- Status: **Fixed**; requirements: FND-002; FND-003.
- Original location: `app/lib/service.ts:169`.
- Reproduction: Save a requirement, then reuse its request key with a different requirement body.
- Expected: Reject incompatible reuse; unchanged retry returns its original result.
- Observed: Returns the first ID as success for a different operation that never occurred.
- Impact: Misleading service success and ambiguous retries.
- Recommended repair: Bind receipts to deterministic command fingerprints, including attachment bytes.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Original failure preserved; passing repaired service/component/browser regression is linked in the verification matrix below.

## IV-06 — MEDIUM — Hours/completion

- Status: **Fixed**; requirements: PRG-003; PLC-007.
- Original location: `app/lib/rules.ts:146`.
- Reproduction: Create four reviewed reports of0.7/0.1/0.1/0.1 hours for a1-hour placement with other obligations fulfilled.
- Expected: Total1, remaining0, completion allowed.
- Observed: Binary addition leaves0.9999999999999999; percent displays100 while completion rejects. UI also rejects non-quarter fractions the service accepts.
- Impact: Inconsistent totals and blocked fractional completion.
- Recommended repair: Use a shared stable hour sum and consistent positive-fraction form constraints.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Original failure preserved; passing repaired service/component/browser regression is linked in the verification matrix below.

## IV-07 — MEDIUM — Maintenance validation

- Status: **Fixed**; requirements: STU-006; PAR-003; OPP-002; SET-001.
- Original location: `app/lib/commands.ts:123`.
- Reproduction: Save student/company/opportunity with academicYear not-a-year.
- Expected: Reject a malformed year before persistence.
- Observed: Record is saved despite format hint and cannot be selected as a valid preference.
- Impact: Malformed data and inconsistent filtering/settings.
- Recommended repair: Share academic-year format/consecutive-year validation across writes.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Original failure preserved; passing repaired service/component/browser regression is linked in the verification matrix below.

## IV-08 — MEDIUM — Contact validation

- Status: **Fixed**; requirements: PAR-003; PAR-006.
- Original location: `app/lib/commands.ts:173`.
- Reproduction: Save company/supervisor telephone ----- .
- Expected: Require a usable digit-bearing contact value.
- Observed: Punctuation-only text passes the phone expression.
- Impact: Invalid contact information advertised as validated.
- Recommended repair: Centralize a documented basic phone-format guard including digit count.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Original failure preserved; passing repaired service/component/browser regression is linked in the verification matrix below.

## IV-09 — MEDIUM — Storage integrity

- Status: **Fixed**; requirements: FND-001; FND-002.
- Original location: `app/lib/integrity.ts:4`.
- Reproduction: Persist a NaN submitted grade, null receipt, or duplicate account/profile association in separate corrupted fixtures.
- Expected: Read fails explicitly as STORAGE_UNAVAILABLE, without reseeding.
- Observed: Integrity accepts these structures; invalid grades or later raw exceptions reach application behavior.
- Impact: Corruption recognition and error handling gaps.
- Recommended repair: Validate numeric finiteness, receipt structure and profile uniqueness before use.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Original failure preserved; passing repaired service/component/browser regression is linked in the verification matrix below.

## IV-10 — HIGH — Concurrent forms

- Status: **Fixed**; requirements: FND-002; STU-007.
- Original location: `app/components/AppProvider.tsx:92`.
- Reproduction: Open same student edit form in two tabs; A changes email and saves, B changes surname and saves stale values after broadcast refresh.
- Expected: Reject stale save, preserve input, allow deliberate reload/retry.
- Observed: Provider refresh advances mutation revision while uncontrolled form inputs stay old; B saves successfully and overwrites A email.
- Impact: Silent loss of another supported tab edit, including linked login contact.
- Recommended repair: Keep form snapshot revision independent of background refresh, advance only after own successful mutation, provide explicit reload.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Original failure preserved; passing repaired service/component/browser regression is linked in the verification matrix below.

## IV-11 — MEDIUM — Authentication navigation

- Status: **Fixed**; requirements: AUTH-001; NAV-002; APP-005.
- Original location: `app/components/Workspace.tsx:18`.
- Reproduction: While signed out open /dashboard/placements/create?application=app-002 and sign in.
- Expected: Return to the same contextual placement form.
- Observed: Redirect drops query, then shows Choose an accepted application.
- Impact: Broken contextual login/deep-link flow.
- Recommended repair: Preserve pathname and complete query in the sign-in destination.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Original failure preserved; passing repaired service/component/browser regression is linked in the verification matrix below.

## IV-12 — LOW — Documentation

- Status: **Fixed**; requirements: FND-007.
- Original location: `docs/TEST_REPORT.md:60`.
- Reproduction: Compare output excerpt with retained Vitest JSON.
- Expected: Excerpt and counts agree.
- Observed: Excerpt says79 passed (78); actual run reports79 of79.
- Impact: Inaccurate verification documentation.
- Recommended repair: Correct typo and distinguish historical implementation evidence from current audit runs.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Original failure preserved; passing repaired service/component/browser regression is linked in the verification matrix below.

## IV-13 — MEDIUM — Edit/contract compatibility

- Status: **Fixed**; requirements: STU-007; FND-003.
- Original location: `app/features/Students.tsx:118`.
- Reproduction: Render edit form for a valid string-contract program/year absent from the three/two hardcoded options.
- Expected: Existing metadata remains selected and can be preserved.
- Observed: Select becomes empty; required edit cannot preserve the existing program/year.
- Impact: Loss-prone maintenance and unnecessary coupling to seed options.
- Recommended repair: Include current/registered values in option lists without inventing an approved academic catalog.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Original failure preserved; passing repaired service/component/browser regression is linked in the verification matrix below.

## Additional findings and repair verification

These findings were recorded after the initial audit checkpoint; they are not retroactively included in the initial thirteen.

### IV-14 — MEDIUM — Confirmed actions

- Status: **Fixed**; requirements: NAV-003; PLC-007.
- Original location: app/components/ui.tsx:419.
- Reproduction: Open PL-001; Confirm completion; Confirm before hours/evaluations are complete.
- Expected: The active dialog exposes the rejected-operation reason to sighted and assistive-technology users.
- Observed before repair: The alert is rendered outside the modal, behind the backdrop/inert content.
- Impact: The mutation correctly rejects but its failure explanation is inaccessible.
- Repair: Render the error inside the open dialog and clear it on a deliberate new attempt.
- Evidence/verification: baseline-additional-browser-corrected.txt; tests/e2e/independent.spec.ts IV-14; final candidate regression evidence is in TEST_REPORT.

### IV-15 — LOW — Empty prerequisite flows

- Status: **Fixed**; requirements: FND-004; APP-001; OPP-002; REQ-003; PRG-002.
- Original location: app/features/Opportunities.tsx:42; Applications.tsx:53; Progress.tsx:54; Requirements.tsx:168.
- Reproduction: Use a valid empty starting dataset with a coordinator; open opportunity, application, progress and document submission creation.
- Expected: Explain missing prerequisites and link to the appropriate next step.
- Observed before repair: Forms render empty required selectors and cannot succeed.
- Impact: Recoverable confusing empty-state behavior; ordinary populated workflows still work.
- Repair: Show actionable prerequisite states before rendering impossible forms.
- Evidence/verification: baseline-additional-browser-corrected.txt; tests/e2e/independent.spec.ts IV-15; final candidate regression evidence is in TEST_REPORT.

### IV-16 — MEDIUM — Deliberate data reset failure

- Status: **Fixed**; requirements: FND-002; SET-003.
- Original location: app/lib/service.ts:214.
- Reproduction: Sign in with valid data; make the separate session store reject clearing; intentionally reset with RESET DEMO.
- Expected: Report failure while preserving saved database records.
- Observed before repair: Database replacement completes before session clearing fails; reset rejects after erasing saved records.
- Impact: A failed operation hides the fact that destructive replacement already occurred.
- Repair: Prepare seed and clear the session before database replacement. A later failed database write can leave the account signed out with records intact.
- Evidence/verification: reset-pre-repair.txt (unchanged original reset method); tests/integration/independent-audit.test.ts IV-16; final candidate regression evidence is in TEST_REPORT.

### Verification matrix

| Finding | Repaired location | Executed regression |
| --- | --- | --- |
| IV-01 | storage.ts readonly read/retry | independent-audit: quota-independent reads and retry |
| IV-02 | commands.ts projection; rules.ts preferences | independent-audit: injected 2032 clock/year |
| IV-03 | commands.ts student projection | independent-audit plus independent.spec direct URL |
| IV-04 | commands.ts default rejection | independent-audit unknown command/no mutation |
| IV-05 | service.ts; fingerprint.ts; domain.ts | independent-audit changed payload, actual file bytes, genuine retry, legacy receipt |
| IV-06 | rules.ts; reporting.ts; Students/Dashboard/Progress/Placements | independent-audit decimal/near-complete/aggregate; independent-lifecycle actual 0.7+0.1+0.1+0.1 |
| IV-07 | commands.ts; rules.ts | independent-audit malformed student/company/opportunity year |
| IV-08 | commands.ts; rules.ts | independent-audit punctuation; independent-lifecycle actual company form |
| IV-09 | integrity.ts | independent-audit corrupted grade/receipt/profile fixtures |
| IV-10 | ui.tsx; AppProvider.tsx; sixteen domain SaveForms | independent.spec student rejection/reload/retry plus independent-concurrency four entity forms |
| IV-11 | Workspace.tsx | independent.spec anonymous contextual placement URL/login |
| IV-12 | TEST_REPORT historical excerpt | actual original Vitest JSON 79/79 versus corrected excerpt |
| IV-13 | Students.tsx dynamic options | independent-forms two existing contract-value cases |
| IV-14 | ui.tsx ActionButton | independent.spec failed completion alert within active dialog |
| IV-15 | Opportunities/Applications/Progress/Requirements | independent.spec empty starting fixture |
| IV-16 | service.ts reset ordering | independent-audit denied session clear preserves exact database |

No finding is marked fixed solely from source presence. No open critical/high findings remain in the verified demo scope. No known mandatory front-end failure is accepted merely because a backend is absent.

### Non-defects and limitations

- The hypothesis that an accepted unplaced student could see Create Placement was disproved: the original coordinator guard already hid it. The corrected baseline assertion passes. It is not a repaired defect.
- Early lifecycle/matrix selectors were wrong (label text, meta-description ambiguity, multiple detail lists, generated select IDs); corrected harness checks retain all meaningful assertions. Failed runs are preserved and excluded from product severity counts.
- Accepted limitation: browser-local numeric precision, whole-snapshot optimistic conflicts, bounded receipts/activities and single-origin data.
- Unverified externally: approved ERD/API and institutional policy compatibility; Firefox/WebKit/manual assistive technology.
- Outside front-end scope: actual backend/database/migrations/authentication/authorization/private file storage/security certification.

## Final updated-release review (2026-11-20)

Originally reviewed3698d8d. Initial findings checkpointa3e370f preserves5medium findings and failed assertions before repairs. Additional FR-06 was first reproduced at fef06b8, inherited unchanged from the reviewed report implementation; checkpoint656b7b0 preserves that failure. New total:0critical/0high/6medium/0low. These are separate from the original 16 findings above. Repair commit54e9a11 addressesFR-01–05;59a5a5f addressesFR-06. All six are Fixed with targeted and complete final clean regression evidence (130 native/49 browser plus production smoke).

Independence limit: the current root session has implementation history and authored repairs. New adversarial evidence challenges prior claims, but fresh-context/personnel-independent certification is not claimed. Original evidence remains unchanged in evidence/final-review/initial-findings.json and additional-findings.json; findings-disposition.json contains current repairs.

### FR-01 — MEDIUM — Account lifecycle

- Requirements: AUTH-005, IU-006, IU-019, IU-032. Original location: app/lib/updates.ts:249; app/lib/commands.ts:120,283.
- Reproduction: Use a separate signed-in faculty session. Coordinator deactivates/reactivates the unassigned faculty before that session refreshes. Also edit a student/faculty/supervisor email administratively after generating recovery.
- Expected: Activation/email changes advance credential version and revoke outstanding requests; old supported sessions and requests cannot revive.
- Observed before repair: Faculty activation leaves version unchanged; all three administrative email edit paths retain the old version and request. Prior session still returns account; old reset request succeeds with the changed email.
- Impact: Inconsistent documented session/request revocation; inactive accounts are denied while inactive, so no system-wide role escalation.
- Focused repair: Apply shared revocation on changed administrative email or activation state, preserving harmless profile-only edits.
- Status: **Fixed**, supported by targeted persisted-state/browser assertions; complete final regression passes.
- Repair commit: 54e9a11cbeba774e6e9fc6e0384d474a49854eca. Evidence: repair-native.json; final-review.test.ts account cases.

### FR-02 — MEDIUM — Intern Supervisor directory

- Requirements: IU-035, IU-038, DSH-003. Original location: app/features/Students.tsx:360-379.
- Reproduction: Coordinator changes Mira academic year to prior year; Intern dashboard in current placement year shows2 assigned interns. Follow Total assigned interns.
- Expected: My Interns lists the2 authorized placements in selected placement year regardless of registration cohort.
- Observed before repair: Directory filters Student.academicYear and shows 1, omitting Mira despite current assigned placement.
- Impact: Assigned intern and dashboard directory disagree across legitimate cohorts.
- Focused repair: Use placement year for interns=true while retaining ordinary student-directory cohort filtering.
- Status: **Fixed**, supported by targeted persisted-state/browser assertions; complete final regression passes.
- Repair commit: 54e9a11cbeba774e6e9fc6e0384d474a49854eca. Evidence: repair-browser.txt FR-02; final-review.spec.ts.

### FR-03 — MEDIUM — Coordinator dashboard

- Requirements: DSH-001, DSH-003, IU-015. Original location: app/features/Dashboard.tsx:34-36.
- Reproduction: Expire company1 MOA through partner form; both posting records remain Active with slots, only1 remains eligible.
- Expected: Active status summary2; distinct Available summary1, each links to corresponding filter.
- Observed before repair: Card labeled Active internship opportunities displays1 using availability and available=true. Original available summary was relabelled, not retained separately.
- Impact: Incorrect required metric and conflation of posting state with eligibility.
- Focused repair: Count derived Active posting state with status filter; retain original Available opportunities card separately.
- Status: **Fixed**, supported by targeted persisted-state/browser assertions; complete final regression passes.
- Repair commit: 54e9a11cbeba774e6e9fc6e0384d474a49854eca. Evidence: repair-browser.txt FR-03; maintenance17cards and destinations.

### FR-04 — MEDIUM — Posting activation

- Requirements: IU-031, OPP-003. Original location: app/lib/updates.ts:407-448; docs/BUSINESS_RULES.md updated policy.
- Reproduction: Deactivate previously approved opp1, expire its company MOA, request activation.
- Expected: Published demo activation policy rejects expired/unapproved MOA without mutation.
- Observed before repair: Activation succeeds and writes Active despite documented current-MOA prerequisite. Student availability independently still blocks applications.
- Impact: Posting lifecycle violates published demonstration rule; no student availability bypass.
- Focused repair: Enforce existing documented eligibility on activation using the service clock; retain deactivation and historical records.
- Status: **Fixed**, supported by targeted persisted-state/browser assertions; complete final regression passes.
- Repair commit: 54e9a11cbeba774e6e9fc6e0384d474a49854eca. Evidence: repair-native.json FR-04; new activation guard uses service clock.

### FR-05 — MEDIUM — Student directory hours

- Requirements: STU-004, STU-001. Original location: app/features/Students.tsx:354-357,387,481-514.
- Reproduction: Open student directory containing pending reports, inspect hour columns and sort modes.
- Expected: Original specified rendered-hour display/sort remains alongside updated approved-hour accounting.
- Observed before repair: Only Approved Hours column/sort is exposed; hours sort computes approved, not rendered, despite STU-004 marked PASS.
- Impact: Previously required rendered-hour functionality omitted rather than explicitly superseded.
- Focused repair: Restore rendered column and hours sort; retain approved display/sort as separate choices with independent oracle.
- Status: **Fixed**, supported by targeted persisted-state/browser assertions; complete final regression passes.
- Repair commit: 54e9a11cbeba774e6e9fc6e0384d474a49854eca. Evidence: repair-browser-hours.txt; independent-matrix student rendered/approved sorts.

### FR-06 — MEDIUM — Opportunity reports

- Requirements: RPT-002, RPT-003, RPT-004, IU-031. Original location: app/lib/reporting.ts:128-145; app/features/Reports.tsx:112-126.
- Reproduction: Create placement from accepted app-002 to consume the last opp1 slot; generate opportunity report filtered Filled. Inspect stage/deactivated status options and CSV.
- Expected: Reports share derived Filled status with directory/details, expose both approval stages and Deactivated, export the filtered displayed status.
- Observed before repair: Filled report returns 0 rows because filter/export use persisted Active; UI has old PendingApproval/Closed but no new stage/Filled/Deactivated choices.
- Impact: Required reports are inconsistent with updated posting lifecycle and cannot filter important current states.
- Focused repair: Use shared postingStatus for filtering/export; add current state options and retain grouped pending/legacy closed compatibility.
- Status: **Fixed**, supported by targeted persisted-state/browser assertions; complete final regression passes.
- Repair commit: 59a5a5f5210c5803f14bda7fca9a0499cbd4ff0e. Evidence: report-state-after.txt; report-browser-after.txt actual filtered CSV.

### Original 16 regression dispositions for the updated release

Every original finding remains VERIFIED FIXED at the tested boundaries, based on the original regression assertions executed again plus source inspection. Complete final 130 native/49 browser suite passes; fresh evidence is linked in TEST_REPORT. IV-12 is a documentation-count reconciliation, not a product behavior test. No claim of exhaustive defect absence.

| Original finding | Final assessment | Fresh evidence / unchanged protection |
| --- | --- | --- |
| IV-01 | VERIFIED FIXED | independent-audit readonly/quota/retry; real version1 failed-upgrade rollback |
| IV-02 | VERIFIED FIXED | independent-audit injected clock/year; availability service clock; activation explicitly passes context date |
| IV-03 | VERIFIED FIXED | independent.spec student draft direct URL and native scoped projection |
| IV-04 | VERIFIED FIXED | independent-audit unknown command leaves exact state unchanged |
| IV-05 | VERIFIED FIXED | byte/content-bound key reuse, legacy receipt tests; new concurrent command/retry tests |
| IV-06 | VERIFIED FIXED | fractional rules/native reports and full fractional lifecycle; shared compensated hour selector retained |
| IV-07 | VERIFIED FIXED | malformed consecutive academic-year checks unchanged |
| IV-08 | VERIFIED FIXED | native phone format and actual lifecycle invalid contact rejection |
| IV-09 | VERIFIED FIXED | malformed stored grade/receipt/profile validation; genuine snapshot validation |
| IV-10 | VERIFIED FIXED | student plus 4 entity cross-tab stale forms/reload/input preservation; new stale assignment command |
| IV-11 | VERIFIED FIXED | contextual anonymous placement login query preserved |
| IV-12 | VERIFIED FIXED | baseline120 and current fresh counts reconciled separately; historical79 remains historical |
| IV-13 | VERIFIED FIXED | both custom program/year-level preservation component regressions |
| IV-14 | VERIFIED FIXED | failed completion error remains inside active dialog |
| IV-15 | VERIFIED FIXED | empty prerequisite records show actionable states in independent.spec |
| IV-16 | VERIFIED FIXED | failed session clear preserves database; reset ordering unchanged |
