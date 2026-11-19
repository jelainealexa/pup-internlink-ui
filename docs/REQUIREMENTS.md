# Functional requirements inventory

Baseline: `aae8d8781c3cbb44094e1aa8dcabc398d913514c`, 2026-11-19. No requirement was implemented during Phase 0. Status assesses the complete stated behavior, not whether a control exists. Demonstration fixture verification does not establish backend functionality. Each entry records description, source, location, status, missing behavior, acceptance criteria, required tests and dependencies. Test IDs below are **planned** except explicit Bxx browser observations in TEST_REPORT.

Sources: `PDF` = the user-supplied 23-page PUP INTERNLINK_System Flow.pdf (page numbers are physical PDF pages); `User` = this Phase 0 request. Recommended PDF features are inventory candidates requiring confirmation, not evidence of approved database design. Conditional approval and optional export remain conditional/optional. Existing prototype fields do not automatically become approved requirements. Full additional portals and self-evaluation are Proposed expansion. Secondary claims about approved ERD in PDF do not substitute for the missing ERD.

Classifications: Implemented and verified = defined bounded behavior actually observed; Implemented but unverified = code/display exists with incomplete runtime validation; Partially implemented = some required behavior works but gaps remain; Placeholder = illustrative UI or local feedback lacking intended effect; Missing = no implementation; Blocked by external dependency = complete behavior cannot be fixed without missing specification/service; Proposed expansion = requires scope approval. A blocked row may also lack code; its external blocker is primary.

## Coverage totals

Total: **86 requirements**. These are audit decomposition units, not the unavailable original nine approved functional requirements. They are not equal-weight effort or completion percentages.

| Classification | Count |
| --- | ---: |
| Implemented and verified | 2 |
| Implemented but unverified | 1 |
| Partially implemented | 31 |
| Placeholder | 15 |
| Missing | 25 |
| Blocked by external dependency | 7 |
| Proposed expansion | 5 |

[Traceability](REQUIREMENTS_TRACEABILITY.md) maps PDF sections, navigation scenarios and evidence. [Machine-readable inventory](evidence/requirements-inventory.json) contains identical entries. Current executed checks are recorded separately in TEST_REPORT.

## Authentication

### AUTH-001 — Authenticate credentials and active accounts

- **Source:** PDF p.1. **Location:** `app/page.tsx`.
- **Status:** Placeholder. **Missing:** Credentials and active flag never checked.
- **Acceptance:** Invalid or inactive account cannot enter; active account gets correct session and dashboard.
- **Required tests (T-AUTH-001):** Invalid/blank/inactive/valid sign-in and reload.
- **Dependencies:** FND-003; approved auth API. **Current evidence:** B01.

### AUTH-002 — Restrict routes and actions by role and assignment

- **Source:** PDF pp.1,20. **Location:** `app/dashboard/layout.tsx`.
- **Status:** Missing. **Missing:** No role, record or server checks.
- **Acceptance:** Direct URLs and commands deny wrong role/unassigned records; permitted coordinator works.
- **Required tests (T-AUTH-002):** Anonymous/wrong-role/cross-record UI and API negatives.
- **Dependencies:** AUTH-001; BR-Q03. **Current evidence:** B01; source.

### AUTH-003 — End session on Exit/sign-out

- **Source:** PDF p.1 login boundary; user Task 6. **Location:** `app/dashboard/layout.tsx`.
- **Status:** Placeholder. **Missing:** Exit only navigates.
- **Acceptance:** Sign-out clears actual session; protected URL unavailable after exit/back/reload.
- **Required tests (T-AUTH-003):** Session invalidation and cache/back tests.
- **Dependencies:** AUTH-001. **Current evidence:** source.

### AUTH-004 — Define account versus profile provisioning

- **Source:** PDF pp.1,7; user Task 7. **Location:** `none`.
- **Status:** Blocked by external dependency. **Missing:** Approved lifecycle and password/invite process absent.
- **Acceptance:** Approved account/profile mapping and active-role lifecycle are documented and integration-tested.
- **Required tests (T-AUTH-004):** Provision/disable and duplicate-account tests after agreement.
- **Dependencies:** BR-Q01; BR-Q02; approved ERD. **Current evidence:** source.

## Navigation

### NAV-001 — Expose eleven coordinator modules and collapsible navigation

- **Source:** PDF p.1. **Location:** `app/components/ModuleNav.tsx`.
- **Status:** Partially implemented. **Missing:** Requirements/Reports destinations absent; active semantics incomplete.
- **Acceptance:** Every module opens its intended page; accessible current/expanded state; collapse preserves usable labels.
- **Required tests (T-NAV-001):** All destinations, keyboard and collapse/reopen.
- **Dependencies:** REQ-001; RPT-001; FND-006. **Current evidence:** B13; route matrix.

### NAV-002 — Preserve student/company/opportunity/status URL context

- **Source:** PDF pp.2,5,12,21-22. **Location:** `app/dashboard/* pages`.
- **Status:** Partially implemented. **Missing:** Several query keys ignored; one-time effects; no URL sync.
- **Acceptance:** Deep links and UI filters agree after reload/back/forward and same-route query changes; no cross-student leakage.
- **Required tests (T-NAV-002):** Query parsing, invalid/repeated keys and all connection mappings.
- **Dependencies:** FND-001; FND-003. **Current evidence:** B11-B12.

### NAV-003 — Handle missing or forbidden records consistently

- **Source:** User Tasks 3,6. **Location:** `app/dashboard/*/[id]/page.tsx`.
- **Status:** Partially implemented. **Missing:** Several not-found headings return 200; no shared forbidden state.
- **Acceptance:** Unknown/forbidden IDs render safe correct state and consistent routing semantics.
- **Required tests (T-NAV-003):** Valid/unknown/malformed/forbidden IDs and HTTP/body checks.
- **Dependencies:** AUTH-002; FND-005. **Current evidence:** 48-route matrix.

## Dashboard

### DSH-001 — Show accurate current-program summary totals

- **Source:** PDF pp.1-2 (unfinished/recommended). **Location:** `app/dashboard/page.tsx`.
- **Status:** Placeholder. **Missing:** Totals and current term hardcoded.
- **Acceptance:** Approved dashboard sections derive from same scoped records; sums reconcile.
- **Required tests (T-DSH-001):** Counts for empty/mixed/term datasets and mutation refresh.
- **Dependencies:** FND-001; BR-Q17. **Current evidence:** source.

### DSH-002 — Show applications, placements, requirements, progress and evaluation attention

- **Source:** PDF p.2 (recommended). **Location:** `app/dashboard/page.tsx`.
- **Status:** Placeholder. **Missing:** Illustrative counts, percent and incomplete summary categories.
- **Acceptance:** Counts by approved statuses and progress policy match module records.
- **Required tests (T-DSH-002):** Category/status/ratio selectors; all-update propagation.
- **Dependencies:** DSH-001; REQ-004; EVA-004; PRG-003. **Current evidence:** source.

### DSH-003 — Open correct filtered tasks and quick actions

- **Source:** PDF pp.2,21-22. **Location:** `app/dashboard/page.tsx`.
- **Status:** Partially implemented. **Missing:** Broken create/Requirements links and ignored evaluation filter.
- **Acceptance:** Every summary/attention/quick link opens matching data or specified form.
- **Required tests (T-DSH-003):** Click every dashboard link and compare visible records.
- **Dependencies:** NAV-002; PAR-003; OPP-002; REQ-001; EVA-002. **Current evidence:** route matrix; B11-B12.

### DSH-004 — Display recent program activity

- **Source:** PDF p.2 (recommended). **Location:** `app/dashboard/page.tsx`.
- **Status:** Placeholder. **Missing:** Names/actions/times static.
- **Acceptance:** Actual recent synthetic/API writes produce correctly ordered permission-scoped entries.
- **Required tests (T-DSH-004):** Create/decide/place then inspect timestamps and related links.
- **Dependencies:** FND-002; approved activity scope. **Current evidence:** source.

## Students

### STU-001 — List students and open profiles

- **Source:** PDF pp.3-5. **Location:** `app/dashboard/students/page.tsx`.
- **Status:** Partially implemented. **Missing:** Only immutable seed records.
- **Acceptance:** Directory shows saved ID/name/program/year/section/placement/status/hours; every row opens same student.
- **Required tests (T-STU-001):** List/detail consistency, empty list and saved-record reload.
- **Dependencies:** FND-001; FND-002. **Current evidence:** B02; route matrix.

### STU-002 — Search students by name or official ID

- **Source:** PDF p.3. **Location:** `app/dashboard/students/page.tsx`.
- **Status:** Implemented and verified. **Missing:** No gap in tested fixture search; production data future.
- **Acceptance:** Name/ID case-insensitive search narrows current dataset and explains no match.
- **Required tests (T-STU-002):** Name/ID/mixed-case/no-match and combined filters.
- **Dependencies:** STU-001. **Current evidence:** B02; source.

### STU-003 — Filter program/year/section/status

- **Source:** PDF p.3. **Location:** `app/dashboard/students/page.tsx`.
- **Status:** Partially implemented. **Missing:** Program/section/status verified; year filter lacks diverse fixture/browser case.
- **Acceptance:** All four filters combine correctly and return honest zero result.
- **Required tests (T-STU-003):** Each filter with diverse years and intersections.
- **Dependencies:** STU-001. **Current evidence:** B03; source.

### STU-004 — Sort by student name, ID or rendered hours

- **Source:** PDF p.3. **Location:** `app/dashboard/students/page.tsx`.
- **Status:** Implemented and verified. **Missing:** No gap in tested ID/hours and observed default name ordering; future aggregate source.
- **Acceptance:** Each sort orders the displayed set predictably.
- **Required tests (T-STU-004):** Name/ID/hours/ties/filtered records.
- **Dependencies:** STU-001. **Current evidence:** B03; default fixture order.

### STU-005 — Create a durable student and redirect to profile

- **Source:** PDF pp.3-4. **Location:** `app/dashboard/students/create/page.tsx`.
- **Status:** Partially implemented. **Missing:** Validates only; no save or redirect.
- **Acceptance:** Required fields saved once; success follows write and new profile opens; survives reload.
- **Required tests (T-STU-005):** Blank/valid/save-failure/double-submit/reload.
- **Dependencies:** STU-006; FND-002; AUTH-002. **Current evidence:** B04.

### STU-006 — Validate required student fields and unique ID/email

- **Source:** PDF pp.3-4. **Location:** `app/dashboard/students/create/page.tsx`.
- **Status:** Partially implemented. **Missing:** Truthiness/static duplicates only; no trim/durable/concurrency enforcement.
- **Acceptance:** Trimmed required ID/name/email/program/year/section; invalid email and duplicate normalized ID/email rejected without mutation.
- **Required tests (T-STU-006):** Whitespace, email normalization, duplicate after save and races.
- **Dependencies:** FND-002; FND-004; BR-Q01. **Current evidence:** B04.

### STU-007 — Edit student contact/academic information

- **Source:** PDF p.3. **Location:** `app/dashboard/students/[id]/edit/page.tsx`.
- **Status:** Placeholder. **Missing:** Input values unused; no write/required/duplicate checks.
- **Acceptance:** Changes persist across profile/directory/reload with same validated constraints and intended readonly ID.
- **Required tests (T-STU-007):** Edit/clear/duplicate/failed save and Cancel.
- **Dependencies:** STU-005; STU-006. **Current evidence:** B05.

### STU-008 — Use profile as student-specific internship record hub

- **Source:** PDF pp.4-5,21-22. **Location:** `app/dashboard/students/[id]/page.tsx`.
- **Status:** Partially implemented. **Missing:** Requirements missing/evaluation context lost; totals duplicated.
- **Acceptance:** Profile links open only that student's checklist, applications, placement/history, progress and evaluations.
- **Required tests (T-STU-008):** Scenario A for placed/unplaced students and unrelated-data exclusion.
- **Dependencies:** NAV-002; REQ-005; PLC-006; EVA-002. **Current evidence:** route matrix; B12.

### STU-009 — Export student directory records

- **Source:** PDF p.3 (explicitly optional). **Location:** `none`.
- **Status:** Proposed expansion. **Missing:** Optional export not approved/implemented.
- **Acceptance:** If approved, export selected fields/current filters using synthetic or authorized data.
- **Required tests (T-STU-009):** Export content/escaping/filter scope.
- **Dependencies:** RPT-004; scope approval. **Current evidence:** source.

## Industry Partners

### PAR-001 — List partner fields and computed partnership status

- **Source:** PDF pp.5-6 (recommended columns). **Location:** `app/dashboard/partners/page.tsx`.
- **Status:** Partially implemented. **Missing:** 3 fixtures; no address/MOA/phone IDs or computed status.
- **Acceptance:** Saved companies display contact/slots/MOA/status consistently.
- **Required tests (T-PAR-001):** List/detail totals and status-boundary fixtures.
- **Dependencies:** FND-001; BR-Q07. **Current evidence:** route matrix; source.

### PAR-002 — Search/filter/sort partners including expiring

- **Source:** PDF pp.5-6,21. **Location:** `app/dashboard/partners/page.tsx`.
- **Status:** Missing. **Missing:** No controls or query support.
- **Acceptance:** Name search; status/industry filters; name/MOA sort; expiring link uses approved window.
- **Required tests (T-PAR-002):** Each filter/sort/date boundary/query.
- **Dependencies:** PAR-001; BR-Q07. **Current evidence:** B12.

### PAR-003 — Register company with MOA details

- **Source:** PDF p.6,23 scenario B. **Location:** `none (/partners/create returns 404)`.
- **Status:** Missing. **Missing:** No form, uniqueness, save or redirect.
- **Acceptance:** Required company/industry/address/contact/email/phone/MOA dates validate, unique name/email save, profile opens.
- **Required tests (T-PAR-003):** Blank/duplicate/date/failure/success/reload.
- **Dependencies:** PAR-005; FND-002; BR-Q07. **Current evidence:** route matrix.

### PAR-004 — Edit company and partnership information

- **Source:** PDF p.6. **Location:** `none`.
- **Status:** Missing. **Missing:** No edit flow.
- **Acceptance:** Validated edits persist and update related views without changing record identity.
- **Required tests (T-PAR-004):** Edit/duplicate/date/permission/reload.
- **Dependencies:** PAR-003; BR-Q07. **Current evidence:** source.

### PAR-005 — Company Profile connects overview/MOA/supervisors/opportunities/placements

- **Source:** PDF pp.7-8,22. **Location:** `app/dashboard/partners/[id]/page.tsx`.
- **Status:** Partially implemented. **Missing:** MOA/supervisors/history absent and non-Accenture placeholders.
- **Acceptance:** Each company shows only its actual related records and direct detail links.
- **Required tests (T-PAR-005):** Scenario B plus empty company/cross-company isolation.
- **Dependencies:** PAR-001; PAR-006; OPP-004; PLC-006. **Current evidence:** route matrix; source.

### PAR-006 — Register/view/edit supervisors within company profile

- **Source:** PDF pp.7-8. **Location:** `none`.
- **Status:** Missing. **Missing:** No supervisor entities/forms/detail view.
- **Acceptance:** Supervisor belongs exactly one company and an account; contact/assigned placements editable/viewable with permissions.
- **Required tests (T-PAR-006):** Create/edit/account-required/cross-company rejection.
- **Dependencies:** AUTH-004; PAR-003; BR-Q02. **Current evidence:** source.

### PAR-007 — Show active/current and historical company placements

- **Source:** PDF p.7. **Location:** `app/dashboard/partners/[id]/page.tsx`.
- **Status:** Placeholder. **Missing:** Single hardcoded student link only.
- **Acceptance:** Company-scoped placement list and details include previous assignments under approved history policy.
- **Required tests (T-PAR-007):** Multiple companies/history/unrelated exclusion.
- **Dependencies:** PLC-006; PAR-005; BR-Q10. **Current evidence:** source.

## Requirements

### REQ-001 — Provide master requirement views and classification counts

- **Source:** PDF p.8. **Location:** `none`.
- **Status:** Missing. **Missing:** Route/master list absent.
- **Acceptance:** All/Mandatory/Optional master views show name/description/classification/submission count and actions.
- **Required tests (T-REQ-001):** Route/classification/count/empty tests.
- **Dependencies:** FND-001; FND-002. **Current evidence:** 404 matrix.

### REQ-002 — Create/edit requirement definitions

- **Source:** PDF pp.8-9. **Location:** `none`.
- **Status:** Missing. **Missing:** No configuration form.
- **Acceptance:** Name/description/classification save and return to updated master list; edit preserves submitted-record history policy.
- **Required tests (T-REQ-002):** Create/edit/invalid/retirement policy tests.
- **Dependencies:** REQ-001; BR-Q05. **Current evidence:** source.

### REQ-003 — List/search/filter student submissions and open files

- **Source:** PDF p.9. **Location:** `none`.
- **Status:** Missing. **Missing:** Submission data/view/upload preview absent.
- **Acceptance:** Student/requirement search, Pending/Approved/Rejected filters, dates/reviewer; authorized file and student details open.
- **Required tests (T-REQ-003):** File preview/denied/missing/filters/date/reviewer tests.
- **Dependencies:** REQ-001; FND-008; AUTH-002. **Current evidence:** source.

### REQ-004 — Approve/reject with required reason and reviewer

- **Source:** PDF p.9. **Location:** `none`.
- **Status:** Missing. **Missing:** Review and audit metadata absent.
- **Acceptance:** Authorized reviewer result persists; rejected reason nonblank; all checklists/queues refresh.
- **Required tests (T-REQ-004):** Approve/reject/blank/unauthorized/conflict/reload.
- **Dependencies:** REQ-003; BR-Q03; FND-004. **Current evidence:** source.

### REQ-005 — Student checklist shows mandatory/optional/latest submission and direct detail

- **Source:** PDF pp.9-10. **Location:** `none (profile link exists)`.
- **Status:** Missing. **Missing:** No route/checklist; app requirements fabricated.
- **Acceptance:** Student-specific status/date/review results and Not Submitted correctly displayed; document opens directly.
- **Required tests (T-REQ-005):** Two-student separation/current-version/no-file/checklist tests.
- **Dependencies:** REQ-003; REQ-004; BR-Q05. **Current evidence:** source.

### REQ-006 — Identify incomplete mandatory submissions before placement

- **Source:** PDF p.10. **Location:** `none`.
- **Status:** Missing. **Missing:** Eligibility not computed.
- **Acceptance:** Every applicable mandatory requirement must be submitted per PDF; approval-versus-submission policy explicitly resolved.
- **Required tests (T-REQ-006):** Missing/optional/pending/rejected/approved permutations.
- **Dependencies:** REQ-005; BR-Q04; approved ERD. **Current evidence:** source.

### REQ-007 — Define resubmission and requirement version behavior

- **Source:** User Task 7; PDF pp.9-10 does not specify. **Location:** `none`.
- **Status:** Blocked by external dependency. **Missing:** Resubmission lifecycle unspecified.
- **Acceptance:** Approved attempt/current-status/reviewer history rules reflected consistently.
- **Required tests (T-REQ-007):** Reject/resubmit/review-again/history tests after decision.
- **Dependencies:** BR-Q05; approved rules. **Current evidence:** source.

### REQ-008 — Support related student's file submission workflow

- **Source:** PDF p.23 diagram; pp.9-10. **Location:** `none`.
- **Status:** Missing. **Missing:** No upload interaction/service.
- **Acceptance:** Authorized synthetic/API submission becomes visible in coordinator checklist/review queue with safe file reference.
- **Required tests (T-REQ-008):** Upload/oversize/type/ownership/reload/failure.
- **Dependencies:** FND-008; REQ-003; role UX approval. **Current evidence:** source.

## Opportunities

### OPP-001 — Search/filter opportunities by position/company/status

- **Source:** PDF pp.10-11. **Location:** `app/dashboard/internships/page.tsx`.
- **Status:** Partially implemented. **Missing:** Read-only list; no search/filters/status data.
- **Acceptance:** Directory displays saved title/company/description/slots/application counts/status and usable controls.
- **Required tests (T-OPP-001):** Search/company/status/empty/query tests.
- **Dependencies:** FND-001; PAR-001. **Current evidence:** route matrix.

### OPP-002 — Create opportunity for registered company

- **Source:** PDF p.11. **Location:** `none (/internships/create returns 404)`.
- **Status:** Missing. **Missing:** No form/save.
- **Acceptance:** Company/title/description/positive slots required; company exists; save redirects to detail.
- **Required tests (T-OPP-002):** Blank/zero/negative/nonexistent-company/success/reload.
- **Dependencies:** FND-002; PAR-003; OPP-003. **Current evidence:** route matrix.

### OPP-003 — Edit/approve opportunity according to approved policy

- **Source:** PDF p.11 (approval conditional). **Location:** `none`.
- **Status:** Blocked by external dependency. **Missing:** Edit missing; approval requirement/state authority unresolved.
- **Acceptance:** Edits persist; if required, pending listings unavailable to students until authorized approval.
- **Required tests (T-OPP-003):** Edit/approval/closed/denied tests for selected policy.
- **Dependencies:** BR-Q06; OPP-002; AUTH-002. **Current evidence:** source.

### OPP-004 — Opportunity Details links company/applicants/assigned placements

- **Source:** PDF pp.11-12,22. **Location:** `app/dashboard/internships/[id]/page.tsx`.
- **Status:** Partially implemented. **Missing:** Hardcoded count/applicants and incorrect person-link; no placement section.
- **Acceptance:** Actual ID-joined applicants and placements match this opportunity and open correct records.
- **Required tests (T-OPP-004):** All fixture opportunities and unrelated-data exclusion.
- **Dependencies:** APP-001; PLC-006; FND-001. **Current evidence:** route matrix; source.

### OPP-005 — Display and enforce real available capacity

- **Source:** PDF pp.10-11,14. **Location:** `app/dashboard/internships/[id]/page.tsx`.
- **Status:** Placeholder. **Missing:** Accepted/slots label misleading; no shared capacity accounting.
- **Acceptance:** Capacity and availability reflect approved reservation/consumption/release policy; no oversubscription.
- **Required tests (T-OPP-005):** Last slot/concurrent accept/place/cancel/failure rollback.
- **Dependencies:** BR-Q08; APP-003; PLC-004. **Current evidence:** source.

### OPP-006 — Retain deadline/program/setup only within approved rules

- **Source:** Existing opportunity UI; user scope constraint. **Location:** `app/dashboard/internships/[id]/page.tsx`.
- **Status:** Implemented but unverified. **Missing:** Static metadata; no approved eligibility/deadline enforcement.
- **Acceptance:** Retain useful display; do not invent mandatory eligibility rules from fixtures; approved metadata maps consistently.
- **Required tests (T-OPP-006):** Display fixtures and policy tests if later approved.
- **Dependencies:** BR-Q06; approved scope/ERD. **Current evidence:** source.

## Applications

### APP-001 — List application records and open details

- **Source:** PDF pp.12-13. **Location:** `app/dashboard/applications/page.tsx; [id]/page.tsx`.
- **Status:** Partially implemented. **Missing:** Immutable records; repeated profile/opportunity data.
- **Acceptance:** Rows/detail show correct student/number/program/year/section/opportunity/company/date/status and links.
- **Required tests (T-APP-001):** All statuses/list-detail agreement/missing IDs.
- **Dependencies:** FND-001; STU-001; OPP-001. **Current evidence:** route matrix.

### APP-002 — Search/filter/sort and contextual application navigation

- **Source:** PDF pp.12-13,22. **Location:** `app/dashboard/applications/page.tsx`.
- **Status:** Partially implemented. **Missing:** UI filters work; opportunity query absent; URL sync incomplete.
- **Acceptance:** Name/number/status/company/opportunity/date filters and source links preserve context.
- **Required tests (T-APP-002):** All controls, summary buttons, clear/back/reload/query tests.
- **Dependencies:** NAV-002; APP-001. **Current evidence:** B11.

### APP-003 — Accept eligible application durably

- **Source:** PDF pp.13-14,23. **Location:** `app/components/ApplicationDecision.tsx`.
- **Status:** Partially implemented. **Missing:** Local status only; checklist constant; no slot/eligibility/authorization.
- **Acceptance:** Approved checks run; one authoritative Accepted decision updates header/list/profile and enables usable placement command.
- **Required tests (T-APP-003):** Valid/ineligible/full-slot/unauthorized/conflict/reload.
- **Dependencies:** REQ-006; OPP-005; FND-002; BR-Q04. **Current evidence:** B06.

### APP-004 — Reject with confirmation and reason, retain history

- **Source:** PDF p.14,23. **Location:** `app/components/ApplicationDecision.tsx`.
- **Status:** Partially implemented. **Missing:** Local confirm/trim guard only; reason/state lost.
- **Acceptance:** Cancel preserves Pending; nonblank reason and authorized decision persist in history/related views.
- **Required tests (T-APP-004):** Blank/whitespace/cancel/confirm/reload/conflict.
- **Dependencies:** APP-001; FND-002; AUTH-002. **Current evidence:** B07.

### APP-005 — Prefill placement from accepted application

- **Source:** PDF p.14. **Location:** `app/dashboard/placements/create/page.tsx`.
- **Status:** Partially implemented. **Missing:** Query read works but accepted local decision not shared/default context unsafe.
- **Acceptance:** Selected application/student/opportunity/company readonly; accepted persisted record usable; invalid/missing context handled.
- **Required tests (T-APP-005):** Accepted/pending/rejected/unknown/missing query and Cancel.
- **Dependencies:** APP-003; PLC-002; NAV-002. **Current evidence:** B06; B08.

### APP-006 — Support related student's application submission

- **Source:** PDF p.23 flow diagram. **Location:** `none`.
- **Status:** Missing. **Missing:** No application-create service or student interaction.
- **Acceptance:** Authorized student application links student/opportunity and appears Pending in coordinator list; duplicate policy agreed.
- **Required tests (T-APP-006):** Valid/closed/duplicate/foreign-student submission tests.
- **Dependencies:** AUTH-002; OPP-003; BR-Q09; role UX approval. **Current evidence:** source.

## Placements

### PLC-001 — List/filter/sort official placements

- **Source:** PDF pp.14-15. **Location:** `app/dashboard/placements/page.tsx`.
- **Status:** Partially implemented. **Missing:** Read-only list with no empty explanation; durable writes absent.
- **Acceptance:** Saved student/company/opportunity/supervision/dates/hours/status listed; name/ID/company/adviser/status/date controls correct.
- **Required tests (T-PLC-001):** Each filter/sort/status button/query/empty/reload.
- **Dependencies:** FND-001; NAV-002. **Current evidence:** B11; B16; source.

### PLC-002 — Create only from Accepted application with unique placement per application

- **Source:** PDF pp.15-16. **Location:** `app/dashboard/placements/create/page.tsx`.
- **Status:** Partially implemented. **Missing:** Static Accepted guard; no duplicate relation/save.
- **Acceptance:** Application Accepted and no existing placement; system ID/status; valid context in summary.
- **Required tests (T-PLC-002):** Pending/rejected/duplicate/double-submit/missing application tests.
- **Dependencies:** APP-003; FND-002; BR-Q01. **Current evidence:** B06; B08.

### PLC-003 — Validate dates, required hours and registered assignments

- **Source:** PDF p.16. **Location:** `app/dashboard/placements/create/page.tsx`.
- **Status:** Partially implemented. **Missing:** Truthy fields/date order only; negative hours and unrelated supervisor accepted.
- **Acceptance:** Required valid dates, approved date order, finite positive hours, registered faculty and same-company supervisor.
- **Required tests (T-PLC-003):** Equal/reversed dates, zero/negative/NaN/fraction policy and wrong-company/unregistered assignment.
- **Dependencies:** PAR-006; FND-004; BR-Q11. **Current evidence:** B08.

### PLC-004 — Enforce placement eligibility/capacity atomically

- **Source:** PDF pp.10,14,16. **Location:** `none`.
- **Status:** Missing. **Missing:** Mandatory submissions, duplicate/capacity checks not centralized.
- **Acceptance:** One atomic transaction validates current eligibility/availability, writes assignment and approved slot effects or none.
- **Required tests (T-PLC-004):** Concurrent last-slot, duplicate application, failed write rollback.
- **Dependencies:** REQ-006; OPP-005; BR-Q08; BR-Q10. **Current evidence:** source.

### PLC-005 — Persist reviewed placement, generate ID, redirect

- **Source:** PDF p.16. **Location:** `app/dashboard/placements/create/page.tsx`.
- **Status:** Placeholder. **Missing:** Only validation message.
- **Acceptance:** Success follows actual write; generated stable ID/detail and all lists show assignment after reload.
- **Required tests (T-PLC-005):** Valid/save failure/retry/reload/related student consistency.
- **Dependencies:** PLC-002; PLC-003; PLC-004. **Current evidence:** B08.

### PLC-006 — Placement detail hub connects all related records

- **Source:** PDF p.17,22-23. **Location:** `app/dashboard/placements/[id]/page.tsx`.
- **Status:** Partially implemented. **Missing:** Student-linked reports not placement-linked; evaluation/certificate inferred.
- **Acceptance:** Overview, dates, supervision, real hours/reports/evaluations/completion link to this placement only.
- **Required tests (T-PLC-006):** Scenario D and multiple-history/unrelated-record tests.
- **Dependencies:** PRG-003; EVA-001; FND-001; BR-Q10. **Current evidence:** route matrix; source.

### PLC-007 — Display actual completion and certificate number/issue date

- **Source:** PDF p.17,23. **Location:** `app/dashboard/placements/[id]/page.tsx`.
- **Status:** Placeholder. **Missing:** Fabricated certificate ID/status; no issue date/record.
- **Acceptance:** Only actual issued certificate displays number/date after approved completion; unavailable state otherwise.
- **Required tests (T-PLC-007):** No certificate/issued/terminated/incomplete/unauthorized tests.
- **Dependencies:** BR-Q14; BR-Q15; EVA-004; PRG-003. **Current evidence:** source.

### PLC-008 — Handle termination/cancellation and capacity consequences

- **Source:** PDF pp.14-15 status; user Task 7. **Location:** `none`.
- **Status:** Blocked by external dependency. **Missing:** Transitions/authority/reasons/release rules absent.
- **Acceptance:** Approved transition matrix preserves history and resolves hours/slots/evaluations/certificate effects.
- **Required tests (T-PLC-008):** Terminate/cancel/retry/forbidden/reversal tests after decision.
- **Dependencies:** BR-Q16; BR-Q08; approved rules. **Current evidence:** source.

## Progress Monitoring

### PRG-001 — Show monitoring summaries, filters and student details

- **Source:** PDF pp.17-19. **Location:** `app/dashboard/progress/page.tsx`.
- **Status:** Partially implemented. **Missing:** UI filters work in source; no student query/empty message; near-completion threshold unapproved.
- **Acceptance:** Counts/scoped filters link correct record; reporting/near-complete definitions approved.
- **Required tests (T-PRG-001):** Search/company/adviser/status/context/empty and summary tests.
- **Dependencies:** NAV-002; PRG-003; BR-Q12. **Current evidence:** B12; B16.

### PRG-002 — Display per-placement report history and details

- **Source:** PDF pp.18-19. **Location:** `app/dashboard/progress/[id]/page.tsx`.
- **Status:** Partially implemented. **Missing:** Filtered by student; no placement history association.
- **Acceptance:** Tasks/date/hours/remarks/review status belong to selected placement; empty history explicit.
- **Required tests (T-PRG-002):** Two placements for one student, report detail and no-history tests.
- **Dependencies:** FND-001; BR-Q10. **Current evidence:** B09; route matrix.

### PRG-003 — Compute accumulated/remaining hours and completion

- **Source:** PDF p.18. **Location:** `app/dashboard/progress/page.tsx; placement/student details`.
- **Status:** Partially implemented. **Missing:** Totals hardcoded independently from reports; most ratios unguarded.
- **Acceptance:** Approved counted reports/opening balance policy yields consistent sums; 243/486=50%; zero-invalid input handled.
- **Required tests (T-PRG-003):** Report inclusion/review/resubmit/overrun/zero/date/rounding tests.
- **Dependencies:** BR-Q11; PRG-002; FND-004. **Current evidence:** source; B08.

### PRG-004 — Review report durably and refresh queues

- **Source:** PDF p.19. **Location:** `app/components/ProgressReportReview.tsx`.
- **Status:** Partially implemented. **Missing:** Only child state; row/summary stale; no reviewer/time.
- **Acceptance:** Authorized review result recorded, consistent table/queue/reload and optional hour effects per policy.
- **Required tests (T-PRG-004):** Pending/reviewed/denied/reload/queue refresh/dialog keyboard.
- **Dependencies:** AUTH-002; PRG-003; FND-002. **Current evidence:** B09.

### PRG-005 — Identify missing or delayed reports

- **Source:** PDF p.19. **Location:** `none`.
- **Status:** Blocked by external dependency. **Missing:** Reporting interval/due-date/grace rules unspecified.
- **Acceptance:** Approved schedule flags genuinely missing/late periods without inventing reports.
- **Required tests (T-PRG-005):** Clock/term/holiday/grace/absence boundary tests.
- **Dependencies:** BR-Q12; PRG-002. **Current evidence:** source.

### PRG-006 — Support related student's progress report submission

- **Source:** PDF p.23 diagram; pp.18-19. **Location:** `none`.
- **Status:** Missing. **Missing:** No authoring service/workflow.
- **Acceptance:** Assigned student submits dated tasks/hours; correct placement history/review queue and totals update per policy.
- **Required tests (T-PRG-006):** Wrong student/date/hour/duplicate/reload tests.
- **Dependencies:** AUTH-002; BR-Q11; role UX approval. **Current evidence:** source.

## Evaluations

### EVA-001 — Represent individual company/faculty evaluation records

- **Source:** PDF pp.19-20. **Location:** `app/dashboard/evaluations/page.tsx; [id]/page.tsx`.
- **Status:** Placeholder. **Missing:** Checklist only, no actual evaluator/placement/date/grade/comments.
- **Acceptance:** Each record shows student/company/placement/evaluator/date/grade/comments and Pending/Submitted.
- **Required tests (T-EVA-001):** Per-record field and list/detail mapping tests.
- **Dependencies:** FND-001; approved ERD/rubric. **Current evidence:** route matrix; source.

### EVA-002 — Filter evaluations by pending/submitted and evaluator role/context

- **Source:** PDF pp.19-20,22. **Location:** `app/dashboard/evaluations/page.tsx`.
- **Status:** Missing. **Missing:** No filters; student/status URL ignored.
- **Acceptance:** Company/faculty and status filters plus contextual links show only intended records; role inferred from relation.
- **Required tests (T-EVA-002):** All filter combinations/URLs/cross-student exclusion.
- **Dependencies:** NAV-002; EVA-001. **Current evidence:** B12.

### EVA-003 — Restrict evaluator to assigned faculty/supervisor and at most two per placement

- **Source:** PDF p.20. **Location:** `none`.
- **Status:** Missing. **Missing:** No assignment checks or limit enforcement.
- **Acceptance:** Wrong/unassigned actor denied; third evaluation rejected transactionally; one-per-role policy confirmed.
- **Required tests (T-EVA-003):** Wrong company/student/role, duplicates/race/third attempt.
- **Dependencies:** AUTH-002; BR-Q03; BR-Q13. **Current evidence:** source.

### EVA-004 — Compute both-required-evaluations completion summary

- **Source:** PDF p.20. **Location:** `app/dashboard/placements/[id]/page.tsx`.
- **Status:** Placeholder. **Missing:** Uses placement Completed/static evaluation counts.
- **Acceptance:** Summary reflects actual company and faculty submission independently; internship completion follows approved wider conditions.
- **Required tests (T-EVA-004):** None/one/both submitted, grade/incomplete-hours cases.
- **Dependencies:** EVA-001; EVA-003; BR-Q14. **Current evidence:** source.

### EVA-005 — Accept scored/commented submissions from assigned evaluators

- **Source:** PDF pp.19-20,23 diagram. **Location:** `none`.
- **Status:** Blocked by external dependency. **Missing:** Submission missing; grade scale/rubric/edit/finalization unspecified.
- **Acceptance:** Approved rubric validates grade/comments; authorized assigned actor's submission persists with date.
- **Required tests (T-EVA-005):** Boundary score/missing comment/unauthorized/resubmit tests.
- **Dependencies:** EVA-003; BR-Q13; approved rubric. **Current evidence:** source.

## Reports & Analytics

### RPT-001 — Offer seven consolidated report categories

- **Source:** PDF pp.20-21. **Location:** `none`.
- **Status:** Missing. **Missing:** Entire route missing.
- **Acceptance:** Student/partner/opportunity/application/placement/progress/evaluation categories use actual related data.
- **Required tests (T-RPT-001):** Route/category/empty/permission tests.
- **Dependencies:** FND-001; FND-002. **Current evidence:** 404 matrix.

### RPT-002 — Generate report with year/company/status filters

- **Source:** PDF p.21. **Location:** `none`.
- **Status:** Missing. **Missing:** No filters/query/results.
- **Acceptance:** Selected valid category/filters produce scoped readable results and generation context.
- **Required tests (T-RPT-002):** Every category/filter combination/no-result/failure.
- **Dependencies:** RPT-001; BR-Q17; AUTH-002. **Current evidence:** source.

### RPT-003 — Reconcile report totals and grades with module data

- **Source:** PDF p.21; user reliability objective. **Location:** `none`.
- **Status:** Missing. **Missing:** No report data model/aggregation.
- **Acceptance:** Export/display summaries match same authorized snapshot, counted-hours policy and evaluation rubric.
- **Required tests (T-RPT-003):** Known fixture counts/join/grade/hour/term reconciliation.
- **Dependencies:** RPT-002; PRG-003; EVA-001. **Current evidence:** source.

### RPT-004 — Export or print generated report

- **Source:** PDF p.21. **Location:** `none`.
- **Status:** Missing. **Missing:** No output flow; formats unspecified.
- **Acceptance:** Approved export/print contains selected results/filters and no unrelated personal data.
- **Required tests (T-RPT-004):** Escaping/CSV injection if CSV, print layout, filtered counts, permissions.
- **Dependencies:** RPT-002; BR-Q18. **Current evidence:** source.

## Settings

### SET-001 — Persist effective workspace preferences

- **Source:** PDF p.1 lists Settings; detailed UI provisional. **Location:** `app/dashboard/settings/page.tsx`.
- **Status:** Placeholder. **Missing:** Only local selected values; no behavior or persistence.
- **Acceptance:** Approved year/default landing/density changes affect intended views and survive reload; per-user scope defined.
- **Required tests (T-SET-001):** Change/navigation/reload/reset/different identity tests.
- **Dependencies:** FND-002; BR-Q17; settings scope approval. **Current evidence:** B10.

### SET-002 — Make approved reminders and accessibility preferences effective

- **Source:** Existing prototype; user Task 3/6. **Location:** `app/dashboard/settings/page.tsx`.
- **Status:** Placeholder. **Missing:** Six toggles affect only pressed state.
- **Acceptance:** If retained, reminders use real queues and text/motion settings visibly apply and persist.
- **Required tests (T-SET-002):** All toggles/off states/rendered style/motion/reminder tests.
- **Dependencies:** SET-001; FND-006; settings scope approval. **Current evidence:** B10; B15.

### SET-003 — Display actual authenticated account read-only

- **Source:** PDF p.1 role rules; existing Settings UI. **Location:** `app/dashboard/settings/page.tsx`.
- **Status:** Placeholder. **Missing:** Account email/role constant.
- **Acceptance:** Signed-in active account info displayed; no unauthorized identity/role editing.
- **Required tests (T-SET-003):** Two identities/sign-out/inactive account.
- **Dependencies:** AUTH-001; AUTH-002. **Current evidence:** source.

## Additional portals

### ROLE-001 — Provide full student portal beyond specified related submissions

- **Source:** PDF p.23 limited flows; user Phase 9 scope. **Location:** `none`.
- **Status:** Proposed expansion. **Missing:** Full student pages/navigation not specified.
- **Acceptance:** Approve portal UX/requirements before implementation; own-record boundaries preserved.
- **Required tests (T-ROLE-001):** Role E2E after approved scope.
- **Dependencies:** APP-006; REQ-008; PRG-006; scope approval. **Current evidence:** source.

### ROLE-002 — Provide full faculty adviser portal beyond assigned review/evaluation

- **Source:** PDF pp.19-20; user Phase 9 scope. **Location:** `none`.
- **Status:** Proposed expansion. **Missing:** Full portal/navigation unspecified.
- **Acceptance:** Approve adviser UX/permissions; assigned-only access and required evaluation work.
- **Required tests (T-ROLE-002):** Assigned/unassigned role E2E after scope.
- **Dependencies:** EVA-005; PRG-004; scope approval. **Current evidence:** source.

### ROLE-003 — Provide full company supervisor portal beyond assigned evaluation

- **Source:** PDF pp.7,19-20; user Phase 9 scope. **Location:** `none`.
- **Status:** Proposed expansion. **Missing:** Full company portal/navigation unspecified.
- **Acceptance:** Approve supervisor UX; company/assignment isolation and required evaluation work.
- **Required tests (T-ROLE-003):** Cross-company role E2E after scope.
- **Dependencies:** PAR-006; EVA-005; scope approval. **Current evidence:** source.

### ROLE-004 — Student self-evaluation

- **Source:** Existing evaluation checklist only; absent from primary PDF. **Location:** `app/dashboard/evaluations/[id]/page.tsx`.
- **Status:** Proposed expansion. **Missing:** Unsupported third evaluation concept conflicts with two-evaluation scope.
- **Acceptance:** Do not count as required evaluation; retain only after explicit scope/rubric agreement.
- **Required tests (T-ROLE-004):** Two-evaluation cap and approved expansion tests.
- **Dependencies:** EVA-003; scope approval. **Current evidence:** source.

## Foundation

### FND-001 — Normalize synthetic model and validate seed references

- **Source:** User Tasks 5-6. **Location:** `app/lib/mockData.ts; page-level fixtures`.
- **Status:** Partially implemented. **Missing:** Partial shared types, duplicated/no foreign keys across modules.
- **Acceptance:** Single shared ID model; no orphan joins, duplicated authoritative totals or accidental real personal data.
- **Required tests (T-FND-001):** Seed FK/status/uniqueness/aggregate integrity tests.
- **Dependencies:** BR-Q01; approved ERD for production mapping. **Current evidence:** source.

### FND-002 — Persist synthetic demo data with explicit mode/reset/version

- **Source:** User Task 6. **Location:** `none`.
- **Status:** Missing. **Missing:** No persistent demo mode.
- **Acceptance:** Synthetic transactions survive reload; version/reset/corruption/quota states explicit; all consumers update.
- **Required tests (T-FND-002):** Adapter transaction/reload/rollback/version/reset/storage-denied tests.
- **Dependencies:** FND-001; D-004. **Current evidence:** B04-B10.

### FND-003 — Typed service seam and isolated backend adapter

- **Source:** User Task 6. **Location:** `none`.
- **Status:** Missing. **Missing:** UI imports fixtures directly; no service/API mode.
- **Acceptance:** Async typed commands/reads; API errors never read or write demo state; actual API adapter maps approved DTOs.
- **Required tests (T-FND-003):** Service conformance/mode-isolation/network/shape/authorization tests.
- **Dependencies:** API agreement for real integration. **Current evidence:** source.

### FND-004 — Central input validation and business invariants

- **Source:** User Task 6; PDF pp.4,6,11,16,20. **Location:** `Scattered form handlers`.
- **Status:** Partially implemented. **Missing:** No shared rules/transaction guards.
- **Acceptance:** UI and service reject invalid values; production backend repeats authoritative checks; unknown policies explicit.
- **Required tests (T-FND-004):** Boundary/transition/relationship/concurrent-write tests.
- **Dependencies:** BUSINESS_RULES decisions. **Current evidence:** B04; B08.

### FND-005 — Provide loading/empty/error/success states

- **Source:** User Task 6. **Location:** `Some .empty-directory and prototype messages`.
- **Status:** Partially implemented. **Missing:** No async/error/loading model; false durable success risks.
- **Acceptance:** Reads/commands expose correct loading, failure/retry, no-match and success-after-write behavior.
- **Required tests (T-FND-005):** Injected failures/slow requests/empty/save conflict/retry.
- **Dependencies:** FND-003. **Current evidence:** B04-B10; B16.

### FND-006 — Accessible reusable forms/dialogs/status and usable mobile flows

- **Source:** User Tasks 3,6. **Location:** `app/components/*; app/globals.css`.
- **Status:** Partially implemented. **Missing:** Unassociated labels/unnamed switches, overlay keyboard gaps, mobile overflow.
- **Acceptance:** Associated names/errors; keyboard-operable dialogs/actions; mobile content usable without page overflow.
- **Required tests (T-FND-006):** Keyboard/name/focus/390px/desktop/zoom checks.
- **Dependencies:** Shared component design; retain visual identity. **Current evidence:** B14-B15; source.

### FND-007 — Reproducible lint/build/typecheck and meaningful tests

- **Source:** User Task 4/6. **Location:** `package.json; eslint.config.mjs; tsconfig.json`.
- **Status:** Partially implemented. **Missing:** Lint fails; no tests/CI or environment pin.
- **Acceptance:** Fresh lockfile install plus lint/typecheck/build and required unit/component/integration/E2E checks run reproducibly.
- **Required tests (T-FND-007):** Actual recorded commands; intentional failing fixture verifies harness.
- **Dependencies:** No baseline errors concealed. **Current evidence:** current logs.

### FND-008 — Private file storage/preview interface in demo and API

- **Source:** PDF p.9; user Task 6. **Location:** `none`.
- **Status:** Missing. **Missing:** No file handling.
- **Acceptance:** Synthetic demo files persist locally; API files use approved private upload/access; validate metadata/ownership.
- **Required tests (T-FND-008):** Blob reload/type/size/unauthorized/missing/storage-failure tests.
- **Dependencies:** Approved upload limits/retention; AUTH-002. **Current evidence:** source.

### FND-009 — Integrate approved backend/database with real auth and constraints

- **Source:** User objective and Phase 10. **Location:** `none`.
- **Status:** Blocked by external dependency. **Missing:** ERD/API/environment/credentials not supplied.
- **Acceptance:** Approved DTO mapping and real test backend demonstrate all workflows; no fixture fallback.
- **Required tests (T-FND-009):** Real contract/transaction/permission/concurrency/upload integration suite.
- **Dependencies:** Approved ERD/API/rubric/policy/test environment. **Current evidence:** source.
