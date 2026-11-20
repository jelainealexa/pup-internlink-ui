# Current functional requirements inventory

Updated 2026-11-20 at source/test checkpoint 7f2873a60160060bae8140c0769e7545a3aa3154. **131 IDs:126 PASS within bounded demonstration scope,1 externally BLOCKED (AUTH-004 institutional provisioning approval),4 NOT APPLICABLE.** Original 94 IDs are preserved;37 changed/new IU requirements are appended. Five42-row delta-analysis entries reuse existing IDs rather than create duplicate requirements. These are decomposition units, not effort/coverage percentages.

The complete23-page system-flow PDF controls unchanged functionality; the complete7-page DSI interface update controls explicit changes. Approved ERD/API/rubric/assignment/provisioning policy are absent; demonstration assumptions are in BUSINESS_RULES/D-043–052. ROLE-001/002/003 are now specified expanded portals. Local account workflows are delivered under IU-002–006 despite AUTH-004's remaining external agreement. Optional self-evaluation/export/deadline-program restrictions and actual server integration remain excluded; modality/location/hours are delivered.

**PASS is internal implementation verification supported by120 native and43 production Chromium cases, not exhaustive inputs/browsers or postponed independent certification.** Original 102 native/40 browser cases are retained; superseded expectations are explained in TEST_REPORT. Five-role scoped commands operate on shared persisted records/files; no real backend/security/database integration is claimed.

Canonical machine-readable fields, original Phase0 baseline fields and requirement-specific tests: [requirements-inventory.json](evidence/requirements-inventory.json). Previous 94-row release preserved verbatim in [prior-requirements-inventory.json](evidence/interface-update/prior-requirements-inventory.json); original independent evidence remains historical. New delta fields include page/role/original functionality/classification/required change/acceptance/test/backend limitation and final implementation in INTERFACE_UPDATE_GAP_ANALYSIS and its JSON.

Classifications: Implemented and verified / Implemented but unverified / Partially implemented / Placeholder / Missing / Blocked by external dependency / Proposed expansion. Deliverable verdicts: PASS/FAIL/BLOCKED/UNVERIFIED/NOT APPLICABLE. Test descriptions are required coverage; executed evidence names actual suite files and TEST_REPORT contains exact results.

## AUTH-001 — Authenticate credentials and active accounts

- Module: Authentication. Source: PDF p.1.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Login.tsx; app/lib/service.ts; app/components/Workspace.tsx.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Invalid or inactive account cannot enter; active account gets correct session and dashboard
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Invalid/blank/inactive/valid sign-in and reload
- Executed mapping: tests/e2e/auth.spec.ts; tests/integration/services.test.ts (credentials, scope, expiry, mode isolation)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## AUTH-002 — Restrict routes and actions by role and assignment

- Module: Authentication. Source: PDF pp.1,20.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Login.tsx; app/lib/service.ts; app/components/Workspace.tsx.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Direct URLs and commands deny wrong role/unassigned records; permitted coordinator works
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Anonymous/wrong-role/cross-record UI and API negatives
- Executed mapping: tests/e2e/auth.spec.ts; tests/integration/services.test.ts (credentials, scope, expiry, mode isolation)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## AUTH-003 — End session on Exit/sign-out

- Module: Authentication. Source: PDF p.1 login boundary; user Task 6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Login.tsx; app/lib/service.ts; app/components/Workspace.tsx.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Sign-out clears actual session; protected URL unavailable after exit/back/reload
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Session invalidation and cache/back tests
- Executed mapping: tests/e2e/auth.spec.ts; tests/integration/services.test.ts (credentials, scope, expiry, mode isolation)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## AUTH-004 — Define account versus profile provisioning

- Module: Authentication. Source: PDF pp.1,7; user Task 7.
- Classification: **Blocked by external dependency**. Verdict: **BLOCKED**.
- Implementation: app/features/Login.tsx; app/lib/service.ts; app/components/Workspace.tsx.
- Remaining behavior: Local pre-registration/invitation/activation/provisioning is implemented. Approved institutional provisioning/assignment policy and exact ERD mapping remain externally unconfirmed.
- Source acceptance: Approved account/profile mapping and active-role lifecycle are documented and integration-tested
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Synthetic linked accounts are implemented; approved real account/profile provisioning and invitation lifecycle still require external agreement.
- Required tests: Provision/disable and duplicate-account tests after agreement
- Executed mapping: tests/e2e/auth.spec.ts; tests/integration/services.test.ts (credentials, scope, expiry, mode isolation); tests/integration/interface-update.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: Approved ERD/account provisioning policy/backend owner; demo student/supervisor account linkage already functional.

## NAV-001 — Expose eleven coordinator modules and collapsible navigation

- Module: Navigation. Source: PDF p.1.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/components/Workspace.tsx; app/components/ui.tsx; app/features/PortalPage.tsx; app/dashboard/**/page.tsx.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Every module opens its intended page; accessible current/expanded state; collapse preserves usable labels
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: All destinations, keyboard and collapse/reopen
- Executed mapping: tests/e2e/smoke.spec.ts; tests/e2e/maintenance.spec.ts (valid/invalid routes, URL filters, back/forward)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## NAV-002 — Preserve student/company/opportunity/status URL context

- Module: Navigation. Source: PDF pp.2,5,12,21-22.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/components/Workspace.tsx; app/components/ui.tsx; app/features/PortalPage.tsx; app/dashboard/**/page.tsx.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Deep links and UI filters agree after reload/back/forward and same-route query changes; no cross-student leakage
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Query parsing, invalid/repeated keys and all connection mappings
- Executed mapping: tests/e2e/smoke.spec.ts; tests/e2e/maintenance.spec.ts (valid/invalid routes, URL filters, back/forward)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## NAV-003 — Handle missing or forbidden records consistently

- Module: Navigation. Source: User Tasks 3,6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/components/Workspace.tsx; app/components/ui.tsx; app/features/PortalPage.tsx; app/dashboard/**/page.tsx.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Unknown/forbidden IDs render safe correct state and consistent routing semantics
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Valid/unknown/malformed/forbidden IDs and HTTP/body checks
- Executed mapping: tests/e2e/smoke.spec.ts; tests/e2e/maintenance.spec.ts (valid/invalid routes, URL filters, back/forward)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## DSH-001 — Show accurate current-program summary totals

- Module: Dashboard. Source: PDF pp.1-2 (unfinished/recommended).
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Dashboard.tsx; app/lib/rules.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved dashboard sections derive from same scoped records; sums reconcile
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Counts for empty/mixed/term datasets and mutation refresh
- Executed mapping: tests/e2e/maintenance.spec.ts; tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/unit/rules.test.ts (derived totals)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## DSH-002 — Show applications, placements, requirements, progress and evaluation attention

- Module: Dashboard. Source: PDF p.2 (recommended).
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Dashboard.tsx; app/lib/rules.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Counts by approved statuses and progress policy match module records
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Category/status/ratio selectors; all-update propagation
- Executed mapping: tests/e2e/maintenance.spec.ts; tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/unit/rules.test.ts (derived totals)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## DSH-003 — Open correct filtered tasks and quick actions

- Module: Dashboard. Source: PDF pp.2,21-22.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Dashboard.tsx; app/lib/rules.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Every summary/attention/quick link opens matching data or specified form
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Click every dashboard link and compare visible records
- Executed mapping: tests/e2e/maintenance.spec.ts; tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/unit/rules.test.ts (derived totals)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## DSH-004 — Display recent program activity

- Module: Dashboard. Source: PDF p.2 (recommended).
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Dashboard.tsx; app/lib/rules.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Actual recent synthetic/API writes produce correctly ordered permission-scoped entries
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Create/decide/place then inspect timestamps and related links
- Executed mapping: tests/e2e/maintenance.spec.ts; tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/unit/rules.test.ts (derived totals)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-001 — List students and open profiles

- Module: Students. Source: PDF pp.3-5.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Students.tsx; app/lib/commands.ts (student.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Directory shows saved ID/name/program/year/section/placement/status/hours; every row opens same student
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: List/detail consistency, empty list and saved-record reload
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (account sync/uniqueness/persistence)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-002 — Search students by name or official ID

- Module: Students. Source: PDF p.3.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Students.tsx; app/lib/commands.ts (student.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Name/ID case-insensitive search narrows current dataset and explains no match
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Name/ID/mixed-case/no-match and combined filters
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (account sync/uniqueness/persistence)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-003 — Filter program/year/section/status

- Module: Students. Source: PDF p.3.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Students.tsx; app/lib/commands.ts (student.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: All four filters combine correctly and return honest zero result
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Each filter with diverse years and intersections
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (account sync/uniqueness/persistence)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-004 — Sort by student name, ID or rendered hours

- Module: Students. Source: PDF p.3.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Students.tsx; app/lib/commands.ts (student.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Each sort orders the displayed set predictably
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Name/ID/hours/ties/filtered records
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (account sync/uniqueness/persistence)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-005 — Create a durable student and redirect to profile

- Module: Students. Source: PDF pp.3-4.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Students.tsx; app/lib/commands.ts (student.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Required fields saved once; success follows write and new profile opens; survives reload
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Blank/valid/save-failure/double-submit/reload
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (account sync/uniqueness/persistence)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-006 — Validate required student fields and unique ID/email

- Module: Students. Source: PDF pp.3-4.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Students.tsx; app/lib/commands.ts (student.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Trimmed required ID/name/email/program/year/section; invalid email and duplicate normalized ID/email rejected without mutation
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Whitespace, email normalization, duplicate after save and races
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (account sync/uniqueness/persistence)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-007 — Edit student contact/academic information

- Module: Students. Source: PDF p.3.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Students.tsx; app/lib/commands.ts (student.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Changes persist across profile/directory/reload with same validated constraints and intended readonly ID
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Edit/clear/duplicate/failed save and Cancel
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (account sync/uniqueness/persistence)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-008 — Use profile as student-specific internship record hub

- Module: Students. Source: PDF pp.4-5,21-22.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Students.tsx; app/lib/commands.ts (student.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Profile links open only that student's checklist, applications, placement/history, progress and evaluations
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Scenario A for placed/unplaced students and unrelated-data exclusion
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (account sync/uniqueness/persistence)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-009 — Export student directory records

- Module: Students. Source: PDF p.3 (explicitly optional).
- Classification: **Proposed expansion**. Verdict: **NOT APPLICABLE**.
- Implementation: app/features/Students.tsx; app/lib/commands.ts (student.save).
- Remaining behavior: Dedicated directory export is optional; Students report CSV is delivered. Export of every directory-specific program/section filter is a proposed expansion.
- Source acceptance: If approved, export selected fields/current filters using synthetic or authorized data
- Current front-end acceptance: Dedicated directory export is optional; Students report CSV is delivered. Export of every directory-specific program/section filter is a proposed expansion.
- Required tests: Export content/escaping/filter scope
- Executed mapping: Scope reconciliation; see BUSINESS_RULES and HANDOVER. Not claimed as implemented full expansion/backend.
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PAR-001 — List partner fields and computed partnership status

- Module: Industry Partners. Source: PDF pp.5-6 (recommended columns).
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Partners.tsx; app/lib/commands.ts (company.save/supervisor.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Saved companies display contact/slots/MOA/status consistently
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: List/detail totals and status-boundary fixtures
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (MOA boundaries)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PAR-002 — Search/filter/sort partners including expiring

- Module: Industry Partners. Source: PDF pp.5-6,21.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Partners.tsx; app/lib/commands.ts (company.save/supervisor.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Name search; status/industry filters; name/MOA sort; expiring link uses approved window
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Each filter/sort/date boundary/query
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (MOA boundaries)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PAR-003 — Register company with MOA details

- Module: Industry Partners. Source: PDF p.6,23 scenario B.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Partners.tsx; app/lib/commands.ts (company.save/supervisor.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Required company/industry/address/contact/email/phone/MOA dates validate, unique name/email save, profile opens
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Blank/duplicate/date/failure/success/reload
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (MOA boundaries)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PAR-004 — Edit company and partnership information

- Module: Industry Partners. Source: PDF p.6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Partners.tsx; app/lib/commands.ts (company.save/supervisor.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Validated edits persist and update related views without changing record identity
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Edit/duplicate/date/permission/reload
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (MOA boundaries)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PAR-005 — Company Profile connects overview/MOA/supervisors/opportunities/placements

- Module: Industry Partners. Source: PDF pp.7-8,22.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Partners.tsx; app/lib/commands.ts (company.save/supervisor.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Each company shows only its actual related records and direct detail links
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Scenario B plus empty company/cross-company isolation
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (MOA boundaries)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PAR-006 — Register/view/edit supervisors within company profile

- Module: Industry Partners. Source: PDF pp.7-8.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Partners.tsx; app/lib/commands.ts (company.save/supervisor.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Supervisor belongs exactly one company and an account; contact/assigned placements editable/viewable with permissions
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Create/edit/account-required/cross-company rejection
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (MOA boundaries)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PAR-007 — Show active/current and historical company placements

- Module: Industry Partners. Source: PDF p.7.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Partners.tsx; app/lib/commands.ts (company.save/supervisor.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Company-scoped placement list and details include previous assignments under approved history policy
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Multiple companies/history/unrelated exclusion
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (MOA boundaries)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## REQ-001 — Provide master requirement views and classification counts

- Module: Requirements. Source: PDF p.8.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: All/Mandatory/Optional master views show name/description/classification/submission count and actions
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Route/classification/count/empty tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (Blob bytes/reviews/attempts)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## REQ-002 — Create/edit requirement definitions

- Module: Requirements. Source: PDF pp.8-9.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Name/description/classification save and return to updated master list; edit preserves submitted-record history policy
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Create/edit/invalid/retirement policy tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (Blob bytes/reviews/attempts)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## REQ-003 — List/search/filter student submissions and open files

- Module: Requirements. Source: PDF p.9.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Student/requirement search, Pending/Approved/Rejected filters, dates/reviewer; authorized file and student details open
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: File preview/denied/missing/filters/date/reviewer tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (Blob bytes/reviews/attempts)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## REQ-004 — Approve/reject with required reason and reviewer

- Module: Requirements. Source: PDF p.9.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Authorized reviewer result persists; rejected reason nonblank; all checklists/queues refresh
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Approve/reject/blank/unauthorized/conflict/reload
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (Blob bytes/reviews/attempts)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## REQ-005 — Student checklist shows mandatory/optional/latest submission and direct detail

- Module: Requirements. Source: PDF pp.9-10.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Student-specific status/date/review results and Not Submitted correctly displayed; document opens directly
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Two-student separation/current-version/no-file/checklist tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (Blob bytes/reviews/attempts)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## REQ-006 — Identify incomplete mandatory submissions before placement

- Module: Requirements. Source: PDF p.10.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Every applicable mandatory requirement must be submitted per PDF; approval-versus-submission policy explicitly resolved
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Latest mandatory attempts must be Approved before acceptance/placement (stricter demo assumption, not approved ERD rule).
- Required tests: Missing/optional/pending/rejected/approved permutations
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (Blob bytes/reviews/attempts)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## REQ-007 — Define resubmission and requirement version behavior

- Module: Requirements. Source: User Task 7; PDF pp.9-10 does not specify.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved attempt/current-status/reviewer history rules reflected consistently
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Only missing/rejected resubmission, immutable attempts; placements snapshot required IDs; no review reversal.
- Required tests: Reject/resubmit/review-again/history tests after decision
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (Blob bytes/reviews/attempts)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## REQ-008 — Support related student's file submission workflow

- Module: Requirements. Source: PDF p.23 diagram; pp.9-10.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Authorized synthetic/API submission becomes visible in coordinator checklist/review queue with safe file reference
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Upload/oversize/type/ownership/reload/failure
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (Blob bytes/reviews/attempts)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## OPP-001 — Search/filter opportunities by position/company/status

- Module: Opportunities. Source: PDF pp.10-11.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Opportunities.tsx; app/lib/commands.ts (opportunity commands); app/lib/rules.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Directory displays saved title/company/description/slots/application counts/status and usable controls
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Search/company/status/empty/query tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## OPP-002 — Create opportunity for registered company

- Module: Opportunities. Source: PDF p.11.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Opportunities.tsx; app/lib/commands.ts (opportunity commands); app/lib/rules.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Company/title/description/positive slots required; company exists; save redirects to detail
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Blank/zero/negative/nonexistent-company/success/reload
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## OPP-003 — Edit/approve opportunity according to approved policy

- Module: Opportunities. Source: PDF p.11 (approval conditional).
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Opportunities.tsx; app/lib/commands.ts (opportunity commands); app/lib/rules.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Edits persist; if required, pending listings unavailable to students until authorized approval
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Coordinator approval adopted in demo; Pending Approval → Approved/Closed and coordinator reopen.
- Required tests: Edit/approval/closed/denied tests for selected policy
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## OPP-004 — Opportunity Details links company/applicants/assigned placements

- Module: Opportunities. Source: PDF pp.11-12,22.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Opportunities.tsx; app/lib/commands.ts (opportunity commands); app/lib/rules.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Actual ID-joined applicants and placements match this opportunity and open correct records
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: All fixture opportunities and unrelated-data exclusion
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## OPP-005 — Display and enforce real available capacity

- Module: Opportunities. Source: PDF pp.10-11,14.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Opportunities.tsx; app/lib/commands.ts (opportunity commands); app/lib/rules.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Capacity and availability reflect approved reservation/consumption/release policy; no oversubscription
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Non-terminated placements consume slots; acceptance reserves none; atomically rechecked on placement creation.
- Required tests: Last slot/concurrent accept/place/cancel/failure rollback
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## OPP-006 — Optional deadline/program restrictions beyond specified posting fields

- Module: Opportunities. Source: Existing opportunity UI; user scope constraint.
- Classification: **Proposed expansion**. Verdict: **NOT APPLICABLE**.
- Implementation: app/features/Opportunities.tsx; app/lib/commands.ts (opportunity commands); app/lib/rules.ts.
- Remaining behavior: Only optional deadline/program metadata remains excluded; modality/location/required hours are now specified and delivered under IU-007.
- Source acceptance: Retain useful display; do not invent mandatory eligibility rules from fixtures; approved metadata maps consistently
- Current front-end acceptance: Deadline/program/work-setup fields have no approved policy and were not retained as misleading controls.
- Required tests: Display fixtures and policy tests if later approved
- Executed mapping: Scope reconciliation; see BUSINESS_RULES and HANDOVER. Not claimed as implemented full expansion/backend.
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## APP-001 — List application records and open details

- Module: Applications. Source: PDF pp.12-13.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Applications.tsx; app/lib/commands.ts (application commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Rows/detail show correct student/number/program/year/section/opportunity/company/date/status and links
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: All statuses/list-detail agreement/missing IDs
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (decision/history/eligibility)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## APP-002 — Search/filter/sort and contextual application navigation

- Module: Applications. Source: PDF pp.12-13,22.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Applications.tsx; app/lib/commands.ts (application commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Name/number/status/company/opportunity/date filters and source links preserve context
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: All controls, summary buttons, clear/back/reload/query tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (decision/history/eligibility)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## APP-003 — Accept eligible application durably

- Module: Applications. Source: PDF pp.13-14,23.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Applications.tsx; app/lib/commands.ts (application commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved checks run; one authoritative Accepted decision updates header/list/profile and enables usable placement command
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Valid/ineligible/full-slot/unauthorized/conflict/reload
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (decision/history/eligibility)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## APP-004 — Reject with confirmation and reason, retain history

- Module: Applications. Source: PDF p.14,23.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Applications.tsx; app/lib/commands.ts (application commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Cancel preserves Pending; nonblank reason and authorized decision persist in history/related views
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Blank/whitespace/cancel/confirm/reload/conflict
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (decision/history/eligibility)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## APP-005 — Prefill placement from accepted application

- Module: Applications. Source: PDF p.14.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Applications.tsx; app/lib/commands.ts (application commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Selected application/student/opportunity/company readonly; accepted persisted record usable; invalid/missing context handled
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Accepted/pending/rejected/unknown/missing query and Cancel
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (decision/history/eligibility)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## APP-006 — Support related student's application submission

- Module: Applications. Source: PDF p.23 flow diagram.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Applications.tsx; app/lib/commands.ts (application commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Authorized student application links student/opportunity and appears Pending in coordinator list; duplicate policy agreed
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Valid/closed/duplicate/foreign-student submission tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (decision/history/eligibility)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PLC-001 — List/filter/sort official placements

- Module: Placements. Source: PDF pp.14-15.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Saved student/company/opportunity/supervision/dates/hours/status listed; name/ID/company/adviser/status/date controls correct
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Each filter/sort/status button/query/empty/reload
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (duplicate/last-slot race/termination); tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PLC-002 — Create only from Accepted application with unique placement per application

- Module: Placements. Source: PDF pp.15-16.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Application Accepted and no existing placement; system ID/status; valid context in summary
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Pending/rejected/duplicate/double-submit/missing application tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (duplicate/last-slot race/termination); tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PLC-003 — Validate dates, required hours and registered assignments

- Module: Placements. Source: PDF p.16.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Required valid dates, approved date order, finite positive hours, registered faculty and same-company supervisor
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Equal/reversed dates, zero/negative/NaN/fraction policy and wrong-company/unregistered assignment
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (duplicate/last-slot race/termination); tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PLC-004 — Enforce placement eligibility/capacity atomically

- Module: Placements. Source: PDF pp.10,14,16.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: One atomic transaction validates current eligibility/availability, writes assignment and approved slot effects or none
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Approved mandatory documents, available approved posting/date-valid MOA, accepted application, one ongoing placement and same-company supervisor.
- Required tests: Concurrent last-slot, duplicate application, failed write rollback
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (duplicate/last-slot race/termination); tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PLC-005 — Persist reviewed placement, generate ID, redirect

- Module: Placements. Source: PDF p.16.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Success follows actual write; generated stable ID/detail and all lists show assignment after reload
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Valid/save failure/retry/reload/related student consistency
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (duplicate/last-slot race/termination); tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PLC-006 — Placement detail hub connects all related records

- Module: Placements. Source: PDF p.17,22-23.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Overview, dates, supervision, real hours/reports/evaluations/completion link to this placement only
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Scenario D and multiple-history/unrelated-record tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (duplicate/last-slot race/termination); tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PLC-007 — Display actual completion and certificate number/issue date

- Module: Placements. Source: PDF p.17,23.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Only actual issued certificate displays number/date after approved completion; unavailable state otherwise
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Actual separately recorded synthetic certificate metadata after eligible completion; no official document issuance.
- Required tests: No certificate/issued/terminated/incomplete/unauthorized tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (duplicate/last-slot race/termination); tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PLC-008 — Handle termination/cancellation and capacity consequences

- Module: Placements. Source: PDF pp.14-15 status; user Task 7.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved transition matrix preserves history and resolves hours/slots/evaluations/certificate effects
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Ongoing → Terminated with reason; history retained, capacity released; no separate Cancelled state.
- Required tests: Terminate/cancel/retry/forbidden/reversal tests after decision
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (duplicate/last-slot race/termination); tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PRG-001 — Show monitoring summaries, filters and student details

- Module: Progress Monitoring. Source: PDF pp.17-19.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Progress.tsx; app/lib/rules.ts; app/lib/commands.ts (report commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Counts/scoped filters link correct record; reporting/near-complete definitions approved
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Search/company/adviser/status/context/empty and summary tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (hours/reporting gaps)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PRG-002 — Display per-placement report history and details

- Module: Progress Monitoring. Source: PDF pp.18-19.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Progress.tsx; app/lib/rules.ts; app/lib/commands.ts (report commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Tasks/date/hours/remarks/review status belong to selected placement; empty history explicit
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Two placements for one student, report detail and no-history tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (hours/reporting gaps)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PRG-003 — Compute accumulated/remaining hours and completion

- Module: Progress Monitoring. Source: PDF p.18.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Progress.tsx; app/lib/rules.ts; app/lib/commands.ts (report commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved counted reports/opening balance policy yields consistent sums; 243/486=50%; zero-invalid input handled
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Official reviewed hours distinct from submitted; percent=reviewed/required×100 and remaining≥0.
- Required tests: Report inclusion/review/resubmit/overrun/zero/date/rounding tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (hours/reporting gaps)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PRG-004 — Review report durably and refresh queues

- Module: Progress Monitoring. Source: PDF p.19.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Progress.tsx; app/lib/rules.ts; app/lib/commands.ts (report commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Authorized review result recorded, consistent table/queue/reload and optional hour effects per policy
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Pending/reviewed/denied/reload/queue refresh/dialog keyboard
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (hours/reporting gaps)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PRG-005 — Identify missing or delayed reports

- Module: Progress Monitoring. Source: PDF p.19.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Progress.tsx; app/lib/rules.ts; app/lib/commands.ts (report commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved schedule flags genuinely missing/late periods without inventing reports
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Local >7-day gap reminder and ≥75% near-completion heuristic, not an approved institutional reporting schedule.
- Required tests: Clock/term/holiday/grace/absence boundary tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (hours/reporting gaps)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PRG-006 — Support related student's progress report submission

- Module: Progress Monitoring. Source: PDF p.23 diagram; pp.18-19.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Progress.tsx; app/lib/rules.ts; app/lib/commands.ts (report commands).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Assigned student submits dated tasks/hours; correct placement history/review queue and totals update per policy
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Wrong student/date/hour/duplicate/reload tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (hours/reporting gaps)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## EVA-001 — Represent individual company/faculty evaluation records

- Module: Evaluations. Source: PDF pp.19-20.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Evaluations.tsx; app/lib/commands.ts (evaluation.submit); app/lib/rules.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Each record shows student/company/placement/evaluator/date/grade/comments and Pending/Submitted
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Per-record field and list/detail mapping tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/unit/rules.test.ts (assigned/duplicate/invalid grade)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## EVA-002 — Filter evaluations by pending/submitted and evaluator role/context

- Module: Evaluations. Source: PDF pp.19-20,22.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Evaluations.tsx; app/lib/commands.ts (evaluation.submit); app/lib/rules.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Company/faculty and status filters plus contextual links show only intended records; role inferred from relation
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: All filter combinations/URLs/cross-student exclusion
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/unit/rules.test.ts (assigned/duplicate/invalid grade)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## EVA-003 — Restrict evaluator to assigned faculty/supervisor and at most two per placement

- Module: Evaluations. Source: PDF p.20.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Evaluations.tsx; app/lib/commands.ts (evaluation.submit); app/lib/rules.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Wrong/unassigned actor denied; third evaluation rejected transactionally; one-per-role policy confirmed
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Wrong company/student/role, duplicates/race/third attempt
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/unit/rules.test.ts (assigned/duplicate/invalid grade)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## EVA-004 — Compute both-required-evaluations completion summary

- Module: Evaluations. Source: PDF p.20.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Evaluations.tsx; app/lib/commands.ts (evaluation.submit); app/lib/rules.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Summary reflects actual company and faculty submission independently; internship completion follows approved wider conditions
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: None/one/both submitted, grade/incomplete-hours cases
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/unit/rules.test.ts (assigned/duplicate/invalid grade)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## EVA-005 — Accept scored/commented submissions from assigned evaluators

- Module: Evaluations. Source: PDF pp.19-20,23 diagram.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Evaluations.tsx; app/lib/commands.ts (evaluation.submit); app/lib/rules.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved rubric validates grade/comments; authorized assigned actor's submission persists with date
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Demo score 0–100/comments; no final grade weights/pass threshold.
- Required tests: Boundary score/missing comment/unauthorized/resubmit tests
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/unit/rules.test.ts (assigned/duplicate/invalid grade)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## RPT-001 — Offer seven consolidated report categories

- Module: Reports & Analytics. Source: PDF pp.20-21.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Reports.tsx; app/lib/reporting.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Student/partner/opportunity/application/placement/progress/evaluation categories use actual related data
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Route/category/empty/permission tests
- Executed mapping: tests/e2e/smoke.spec.ts; tests/e2e/lifecycle.spec.ts (filtered CSV bytes); tests/unit/rules.test.ts (CSV/formula/rows/totals)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## RPT-002 — Generate report with year/company/status filters

- Module: Reports & Analytics. Source: PDF p.21.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Reports.tsx; app/lib/reporting.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Selected valid category/filters produce scoped readable results and generation context
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Every category/filter combination/no-result/failure
- Executed mapping: tests/e2e/smoke.spec.ts; tests/e2e/lifecycle.spec.ts (filtered CSV bytes); tests/unit/rules.test.ts (CSV/formula/rows/totals)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## RPT-003 — Reconcile report totals and grades with module data

- Module: Reports & Analytics. Source: PDF p.21; user reliability objective.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Reports.tsx; app/lib/reporting.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Export/display summaries match same authorized snapshot, counted-hours policy and evaluation rubric
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Known fixture counts/join/grade/hour/term reconciliation
- Executed mapping: tests/e2e/smoke.spec.ts; tests/e2e/lifecycle.spec.ts (filtered CSV bytes); tests/unit/rules.test.ts (CSV/formula/rows/totals)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## RPT-004 — Export or print generated report

- Module: Reports & Analytics. Source: PDF p.21.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Reports.tsx; app/lib/reporting.ts.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved export/print contains selected results/filters and no unrelated personal data
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Escaping/CSV injection if CSV, print layout, filtered counts, permissions
- Executed mapping: tests/e2e/smoke.spec.ts; tests/e2e/lifecycle.spec.ts (filtered CSV bytes); tests/unit/rules.test.ts (CSV/formula/rows/totals)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## SET-001 — Persist effective workspace preferences

- Module: Settings. Source: PDF p.1 lists Settings; detailed UI provisional.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Settings.tsx; app/components/AppProvider.tsx; app/lib/commands.ts (preferences.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved year/default landing/density changes affect intended views and survive reload; per-user scope defined
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Browser-local per-account preferences, not institutional term administration.
- Required tests: Change/navigation/reload/reset/different identity tests
- Executed mapping: tests/e2e/maintenance.spec.ts; tests/e2e/smoke.spec.ts (persisted effects/reset/axe)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## SET-002 — Make approved reminders and accessibility preferences effective

- Module: Settings. Source: Existing prototype; user Task 3/6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Settings.tsx; app/components/AppProvider.tsx; app/lib/commands.ts (preferences.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: If retained, reminders use real queues and text/motion settings visibly apply and persist
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Alert flags affect dashboard reminders, not email/SMS; text/motion/density have actual CSS effects.
- Required tests: All toggles/off states/rendered style/motion/reminder tests
- Executed mapping: tests/e2e/maintenance.spec.ts; tests/e2e/smoke.spec.ts (persisted effects/reset/axe)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## SET-003 — Display actual authenticated account read-only

- Module: Settings. Source: PDF p.1 role rules; existing Settings UI.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Settings.tsx; app/components/AppProvider.tsx; app/lib/commands.ts (preferences.save).
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Signed-in active account info displayed; no unauthorized identity/role editing
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Two identities/sign-out/inactive account
- Executed mapping: tests/e2e/maintenance.spec.ts; tests/e2e/smoke.spec.ts (persisted effects/reset/axe)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## ROLE-001 — Specified Student portal

- Module: Additional portals. Source: PDF p.23 limited flows; user Phase 9 scope; DSI Interface Content pp.1–7 (expanded explicit role scope).
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Students/Requirements/Applications/Attendance/Progress/Evaluations; RoleDashboard; shared services.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Approve portal UX/requirements before implementation; own-record boundaries preserved
- Current front-end acceptance: Specified five-role scope operates on shared records with assignment/company restrictions; see IU delta requirements.
- Required tests: Role E2E after approved scope
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts; tests/e2e/interface-dashboard.spec.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## ROLE-002 — Specified Faculty Adviser portal

- Module: Additional portals. Source: PDF pp.19-20; user Phase 9 scope; DSI Interface Content pp.1–7 (expanded explicit role scope).
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Students/Requirements/Progress/Evaluations; Faculty/RoleDashboard; shared assignment guards.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Approve adviser UX/permissions; assigned-only access and required evaluation work
- Current front-end acceptance: Specified five-role scope operates on shared records with assignment/company restrictions; see IU delta requirements.
- Required tests: Assigned/unassigned role E2E after scope
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts; tests/e2e/interface-dashboard.spec.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## ROLE-003 — Specified Company Supervisor administrative portal

- Module: Additional portals. Source: PDF pp.7,19-20; user Phase 9 scope; DSI Interface Content pp.1–7 (expanded explicit role scope).
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Partners/Opportunities/PostingControls/Placements/RoleDashboard; shared company guards.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Approve supervisor UX; company/assignment isolation and required evaluation work
- Current front-end acceptance: Specified five-role scope operates on shared records with assignment/company restrictions; see IU delta requirements.
- Required tests: Cross-company role E2E after scope
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts; tests/e2e/interface-dashboard.spec.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## ROLE-004 — Student self-evaluation

- Module: Additional portals. Source: Existing evaluation checklist only; absent from primary PDF.
- Classification: **Proposed expansion**. Verdict: **NOT APPLICABLE**.
- Implementation: app/features/PortalPage.tsx; app/lib/commands.ts (scopedDatabase/role guards); app/components/Workspace.tsx.
- Remaining behavior: Student self-evaluation is unapproved and conflicts with the two required assigned evaluation obligations; intentionally excluded.
- Source acceptance: Do not count as required evaluation; retain only after explicit scope/rubric agreement
- Current front-end acceptance: Student self-evaluation is unapproved and conflicts with the two required assigned evaluation obligations; intentionally excluded.
- Required tests: Two-evaluation cap and approved expansion tests
- Executed mapping: Scope reconciliation; see BUSINESS_RULES and HANDOVER. Not claimed as implemented full expansion/backend.
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-001 — Normalize synthetic model and validate seed references

- Module: Foundation. Source: User Tasks 5-6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Single shared ID model; no orphan joins, duplicated authoritative totals or accidental real personal data
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Seed FK/status/uniqueness/aggregate integrity tests
- Executed mapping: tests/unit/rules.test.ts; tests/components/forms.test.tsx; tests/integration/services.test.ts; tests/e2e/smoke.spec.ts; tests/e2e/restart.spec.ts; test/build/type/lint logs
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-002 — Persist synthetic demo data with explicit mode/reset/version

- Module: Foundation. Source: User Task 6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Synthetic transactions survive reload; version/reset/corruption/quota states explicit; all consumers update
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Adapter transaction/reload/rollback/version/reset/storage-denied tests
- Executed mapping: tests/unit/rules.test.ts; tests/components/forms.test.tsx; tests/integration/services.test.ts; tests/e2e/smoke.spec.ts; tests/e2e/restart.spec.ts; test/build/type/lint logs
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-003 — Typed service seam and isolated backend adapter

- Module: Foundation. Source: User Task 6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Async typed commands/reads; API errors never read or write demo state; actual API adapter maps approved DTOs
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Service conformance/mode-isolation/network/shape/authorization tests
- Executed mapping: tests/unit/rules.test.ts; tests/components/forms.test.tsx; tests/integration/services.test.ts; tests/e2e/smoke.spec.ts; tests/e2e/restart.spec.ts; test/build/type/lint logs
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-004 — Central input validation and business invariants

- Module: Foundation. Source: User Task 6; PDF pp.4,6,11,16,20.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: UI and service reject invalid values; production backend repeats authoritative checks; unknown policies explicit
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Boundary/transition/relationship/concurrent-write tests
- Executed mapping: tests/unit/rules.test.ts; tests/components/forms.test.tsx; tests/integration/services.test.ts; tests/e2e/smoke.spec.ts; tests/e2e/restart.spec.ts; test/build/type/lint logs
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-005 — Provide loading/empty/error/success states

- Module: Foundation. Source: User Task 6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Reads/commands expose correct loading, failure/retry, no-match and success-after-write behavior
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Injected failures/slow requests/empty/save conflict/retry
- Executed mapping: tests/unit/rules.test.ts; tests/components/forms.test.tsx; tests/integration/services.test.ts; tests/e2e/smoke.spec.ts; tests/e2e/restart.spec.ts; test/build/type/lint logs
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-006 — Accessible reusable forms/dialogs/status and usable mobile flows

- Module: Foundation. Source: User Tasks 3,6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Associated names/errors; keyboard-operable dialogs/actions; mobile content usable without page overflow
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Keyboard/name/focus/390px/desktop/zoom checks
- Executed mapping: tests/unit/rules.test.ts; tests/components/forms.test.tsx; tests/integration/services.test.ts; tests/e2e/smoke.spec.ts; tests/e2e/restart.spec.ts; test/build/type/lint logs
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-007 — Reproducible lint/build/typecheck and meaningful tests

- Module: Foundation. Source: User Task 4/6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Fresh lockfile install plus lint/typecheck/build and required unit/component/integration/E2E checks run reproducibly
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Actual recorded commands; intentional failing fixture verifies harness
- Executed mapping: tests/unit/rules.test.ts; tests/components/forms.test.tsx; tests/integration/services.test.ts; tests/e2e/smoke.spec.ts; tests/e2e/restart.spec.ts; test/build/type/lint logs
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-008 — Private file storage/preview interface in demo and API

- Module: Foundation. Source: PDF p.9; user Task 6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Synthetic demo files persist locally; API files use approved private upload/access; validate metadata/ownership
- Current front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Blob reload/type/size/unauthorized/missing/storage-failure tests
- Executed mapping: tests/unit/rules.test.ts; tests/components/forms.test.tsx; tests/integration/services.test.ts; tests/e2e/smoke.spec.ts; tests/e2e/restart.spec.ts; test/build/type/lint logs
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-009 — Integrate approved backend/database with real auth and constraints

- Module: Foundation. Source: User objective and Phase 10.
- Classification: **Blocked by external dependency**. Verdict: **NOT APPLICABLE**.
- Implementation: app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx.
- Remaining behavior: Actual backend/database/authentication integration is explicitly outside the current front-end-only authorization.
- Source acceptance: Approved DTO mapping and real test backend demonstrate all workflows; no fixture fallback
- Current front-end acceptance: Actual backend/database/authentication integration is explicitly outside the current front-end-only authorization.
- Required tests: Real contract/transaction/permission/concurrency/upload integration suite
- Executed mapping: Scope reconciliation; see BUSINESS_RULES and HANDOVER. Not claimed as implemented full expansion/backend.
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## AUTH-005 — Handle invalid/expired persisted demonstration sessions

- Module: Authentication. Source: User complete-front-end instruction §§7–15; related PDF workflow (minimal role UI explicitly demo extension).
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Login.tsx; app/lib/service.ts; app/components/Workspace.tsx.
- Remaining behavior: None in tested synthetic workflow; see KNOWN_ISSUES for scope boundaries.
- Source acceptance: Invalid/malformed/expired session returns sign-in; no stale role bypass.
- Current front-end acceptance: Invalid/malformed/expired session returns sign-in; no stale role bypass.
- Required tests: tests/integration/services.test.ts; app/lib/service.ts
- Executed mapping: tests/unit/session.test.ts; tests/integration/services.test.ts (malformed/unavailable/expired sessions)
- Dependencies: Shared domain/services, simulated role policy D-016–026

## REQ-009 — Store actual synthetic attachment bytes and authorize preview/download

- Module: Requirements. Source: User complete-front-end instruction §§7–15; related PDF workflow (minimal role UI explicitly demo extension).
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands).
- Remaining behavior: None in tested synthetic workflow; see KNOWN_ISSUES for scope boundaries.
- Source acceptance: Supported nonempty ≤5MB Blob persists and downloads; failed processing never reports success.
- Current front-end acceptance: Supported nonempty ≤5MB Blob persists and downloads; failed processing never reports success.
- Required tests: tests/integration/services.test.ts; tests/e2e/maintenance.spec.ts; tests/e2e/lifecycle.spec.ts
- Executed mapping: tests/integration/services.test.ts; tests/e2e/maintenance.spec.ts; tests/e2e/lifecycle.spec.ts
- Dependencies: Shared domain/services, simulated role policy D-016–026

## PLC-009 — Complete eligible placement and explicitly record synthetic certificate metadata

- Module: Placements. Source: User complete-front-end instruction §§7–15; related PDF workflow (minimal role UI explicitly demo extension).
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands).
- Remaining behavior: None in tested synthetic workflow; see KNOWN_ISSUES for scope boundaries.
- Source acceptance: Missing reviewed hours/documents/evaluations block completion; assigned submissions and completion permit explicit unique metadata.
- Current front-end acceptance: Missing reviewed hours/documents/evaluations block completion; assigned submissions and completion permit explicit unique metadata.
- Required tests: tests/unit/rules.test.ts; tests/e2e/lifecycle.spec.ts
- Executed mapping: tests/unit/rules.test.ts; tests/e2e/lifecycle.spec.ts
- Dependencies: Shared domain/services, simulated role policy D-016–026

## SET-004 — Deliberately reset synthetic data with confirmation and sign-out

- Module: Settings. Source: User complete-front-end instruction §§7–15; related PDF workflow (minimal role UI explicitly demo extension).
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/Settings.tsx; app/components/AppProvider.tsx; app/lib/commands.ts (preferences.save).
- Remaining behavior: None in tested synthetic workflow; see KNOWN_ISSUES for scope boundaries.
- Source acceptance: Incorrect phrase/noncoordinator blocked; coordinator RESET DEMO reinitializes coherent records; corrupt schema recovery explicit.
- Current front-end acceptance: Incorrect phrase/noncoordinator blocked; coordinator RESET DEMO reinitializes coherent records; corrupt schema recovery explicit.
- Required tests: tests/integration/services.test.ts; tests/e2e/smoke.spec.ts
- Executed mapping: tests/integration/services.test.ts; tests/e2e/smoke.spec.ts
- Dependencies: Shared domain/services, simulated role policy D-016–026

## ROLE-005 — Minimal student demonstration lifecycle extension

- Module: Additional portals. Source: User complete-front-end instruction §§7–15; related PDF workflow (minimal role UI explicitly demo extension).
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/PortalPage.tsx; app/lib/commands.ts (scopedDatabase/role guards); app/components/Workspace.tsx.
- Remaining behavior: None in tested synthetic workflow; see KNOWN_ISSUES for scope boundaries.
- Source acceptance: Own profile/requirements/available opportunities/application/placement/progress/evaluations; unrelated records denied.
- Current front-end acceptance: Own profile/requirements/available opportunities/application/placement/progress/evaluations; unrelated records denied.
- Required tests: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/integration/services.test.ts
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/integration/services.test.ts
- Dependencies: Shared domain/services, simulated role policy D-016–026

## ROLE-006 — Minimal assigned faculty demonstration extension

- Module: Additional portals. Source: User complete-front-end instruction §§7–15; related PDF workflow (minimal role UI explicitly demo extension).
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/PortalPage.tsx; app/lib/commands.ts (scopedDatabase/role guards); app/components/Workspace.tsx.
- Remaining behavior: None in tested synthetic workflow; see KNOWN_ISSUES for scope boundaries.
- Source acceptance: Assigned students/placements/documents/progress and own evaluation; unrelated modifications denied.
- Current front-end acceptance: Assigned students/placements/documents/progress and own evaluation; unrelated modifications denied.
- Required tests: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/integration/services.test.ts
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/integration/services.test.ts
- Dependencies: Shared domain/services, simulated role policy D-016–026

## ROLE-007 — Preserved operational supervisor lifecycle, now Intern Supervisor

- Module: Additional portals. Source: User complete-front-end instruction §§7–15; related PDF workflow (minimal role UI explicitly demo extension); DSI Interface Content pp.6–7 role separation.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/features/PortalPage.tsx; app/lib/commands.ts (scopedDatabase/role guards); app/components/Workspace.tsx.
- Remaining behavior: None in tested synthetic workflow; see KNOWN_ISSUES for scope boundaries.
- Source acceptance: Own company/assigned interns/progress remarks/own company evaluation; unrelated records and student files denied.
- Current front-end acceptance: Legacy operational supervisor accounts migrate to Intern Supervisor without privilege escalation; existing assigned progress/company evaluation workflow remains functional under the updated rules.
- Required tests: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/integration/services.test.ts
- Executed mapping: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/integration/services.test.ts
- Dependencies: Shared domain/services, simulated role policy D-016–026

## FND-010 — Synchronize persisted state across modules/tabs and supported browser restart

- Module: Foundation. Source: User complete-front-end instruction §§7–15; related PDF workflow (minimal role UI explicitly demo extension).
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx.
- Remaining behavior: None in tested synthetic workflow; see KNOWN_ISSUES for scope boundaries.
- Source acceptance: Normal reads never reseed; related names/totals update; reload/cross-tab/reopened Chromium profile retain saved data and valid session.
- Current front-end acceptance: Normal reads never reseed; related names/totals update; reload/cross-tab/reopened Chromium profile retain saved data and valid session.
- Required tests: tests/e2e/maintenance.spec.ts; tests/e2e/restart.spec.ts; tests/integration/services.test.ts
- Executed mapping: tests/e2e/maintenance.spec.ts; tests/e2e/restart.spec.ts; tests/integration/services.test.ts
- Dependencies: Shared domain/services, simulated role policy D-016–026

## IU-002 — Create Pending Activation; permitted faculty auto-assigned; edit scoped students

- Module: Pre-registration. Source: DSI - Interface Content.pdf physical page(s) 1.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Students; Faculty; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: No duplicate ID/email; pending distinct from deactivated
- Current front-end acceptance: No duplicate ID/email; pending distinct from deactivated
- Required tests: account integration/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-003 — Bound expiring invitation/code and copied local link; status/deactivation

- Module: Invitations. Source: DSI - Interface Content.pdf physical page(s) 1.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Students; AccountAccess; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Only scoped pending student can activate once; inactive cannot bypass
- Current front-end acceptance: Only scoped pending student can activate once; inactive cannot bypass
- Required tests: account integration/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-004 — Existing account activation with number/email/password/confirmation/invitation

- Module: Activation. Source: DSI - Interface Content.pdf physical page(s) 1.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: AccountAccess; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Bound match; password policy; no duplicate profile; reject reused/expired
- Current front-end acceptance: Bound match; password policy; no duplicate profile; reject reused/expired
- Required tests: account integration/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-005 — Local reset request/link and bound expiring single-use reset page

- Module: Recovery. Source: DSI - Interface Content.pdf physical page(s) 1.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: AccountAccess; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Reject inactive/pending/reused/mismatched/expired; no plaintext password persistence
- Current front-end acceptance: Reject inactive/pending/reused/mismatched/expired; no plaintext password persistence
- Required tests: account integration/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-006 — Current-credential password/email changes; linked student email synchronization

- Module: Account settings. Source: DSI - Interface Content.pdf physical page(s) 1.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Settings; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Old credentials fail; duplicate email rejected; sessions invalidated
- Current front-end acceptance: Old credentials fail; duplicate email rejected; sessions invalidated
- Required tests: account integration/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-007 — Location/modality/hours/qualifications/skills/responsibilities fields and filters

- Module: Opportunities. Source: DSI - Interface Content.pdf physical page(s) 1–2.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Opportunities; PostingControls; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Only Active eligible postings available; filters reset/persist URL; MOA link
- Current front-end acceptance: Only Active eligible postings available; filters reset/persist URL; MOA link
- Required tests: posting tests/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-008 — Derived profile completion; pre-placement assigned adviser; account settings

- Module: Profile. Source: DSI - Interface Content.pdf physical page(s) 2.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Students; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Actual required fields determine percent; adviser shared
- Current front-end acceptance: Actual required fields determine percent; adviser shared
- Required tests: assignment tests/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-009 — Before/During/After tabs and definition phase; approval remarks

- Module: Requirement phases. Source: DSI - Interface Content.pdf physical page(s) 2.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Requirements; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Only Before mandatory gates placement; frozen all-phase obligations gate completion; history retained
- Current front-end acceptance: Only Before mandatory gates placement; frozen all-phase obligations gate completion; history retained
- Required tests: phase/migration/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-011 — Explicit rendered versus approved labels; assigned Intern Supervisor

- Module: Placement. Source: DSI - Interface Content.pdf physical page(s) 2.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Placements; Progress; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Same submitted/approved/remaining/percent across views
- Current front-end acceptance: Same submitted/approved/remaining/percent across views
- Required tests: progress integration/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-012 — Placement/date/hours attendance creation/list/history

- Module: Attendance. Source: DSI - Interface Content.pdf physical page(s) 2.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Attendance; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: One record/date; valid positive bounded hours; dates/ownership; no legacy overlap
- Current front-end acceptance: One record/date; valid positive bounded hours; dates/ownership; no legacy overlap
- Required tests: attendance integration/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-013 — Weekly period/tasks linked attendance; review state/history/resubmission

- Module: Weekly reports. Source: DSI - Interface Content.pdf physical page(s) 2.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Attendance; Progress; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: 1–7day period; derived hours; one active attempt; no double counting
- Current front-end acceptance: 1–7day period; derived hours; one active attempt; no double counting
- Required tests: weekly integration/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-015 — Add Active Companies/Expired MOAs/Active Opportunities/ongoing applications aliases

- Module: Dashboard. Source: DSI - Interface Content.pdf physical page(s) 3.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Dashboard; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Counts match current shared scoped/year data and filters
- Current front-end acceptance: Counts match current shared scoped/year data and filters
- Required tests: dashboard browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts; tests/e2e/interface-dashboard.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-016 — Total/pending activation counts/status filter/invitation/deactivate

- Module: Students. Source: DSI - Interface Content.pdf physical page(s) 3.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Students; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Records/activation filters and links reflect shared mutations
- Current front-end acceptance: Records/activation filters and links reflect shared mutations
- Required tests: account browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-017 — Separate company decision then coordinator approval/rejection with remarks/actor/time

- Module: Posting decisions. Source: DSI - Interface Content.pdf physical page(s) 3.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: PostingControls; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Cannot skip company approval; histories persist
- Current front-end acceptance: Cannot skip company approval; histories persist
- Required tests: posting integration/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-018 — Separate explicit company-admin account provisioning and Intern profiles

- Module: Companies. Source: DSI - Interface Content.pdf physical page(s) 3.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Partners; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: No legacy privilege escalation; profile links coherent
- Current front-end acceptance: No legacy privilege escalation; profile links coherent
- Required tests: roles/migration/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-019 — Register/view/edit faculty account/profile and assignment counts

- Module: Faculty records. Source: DSI - Interface Content.pdf physical page(s) 3.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Faculty; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Coordinator-only; unique email; active registered adviser
- Current front-end acceptance: Coordinator-only; unique email; active registered adviser
- Required tests: faculty tests/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-020 — Student adviser before placement; controlled reassignment preserving history

- Module: Faculty assignments. Source: DSI - Interface Content.pdf physical page(s) 3–4.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Faculty; Students; Placements; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Faculty scoped to assigned students; ongoing placement adviser stays consistent
- Current front-end acceptance: Faculty scoped to assigned students; ongoing placement adviser stays consistent
- Required tests: assignment integration/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-021 — Intern decides assigned opportunity; documented coordinator oversight uses same terminal transition

- Module: Application authority. Source: DSI - Interface Content.pdf physical page(s) 3–4.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Applications; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: No contradictory final statuses; reasons/history; no automatic placement
- Current front-end acceptance: No contradictory final statuses; reasons/history; no automatic placement
- Required tests: authority integration/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-023 — Pre-placement assigned count, reviews, near/completed/evaluation metrics

- Module: Dashboard. Source: DSI - Interface Content.pdf physical page(s) 4.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: RoleDashboard; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Only current/historical authorized scope; correct links
- Current front-end acceptance: Only current/historical authorized scope; correct links
- Required tests: dashboard/assignment browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts; tests/e2e/interface-dashboard.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-024 — Pre-register scoped students; pre-placement scope; company grouping/filter; review remarks

- Module: Student management. Source: DSI - Interface Content.pdf physical page(s) 4.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Students; Requirements; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Cannot edit/review unrelated students; historical placement scope retained
- Current front-end acceptance: Cannot edit/review unrelated students; historical placement scope retained
- Required tests: assignment/phase browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-025 — Independent timestamped monitoring history; no supervisor approval authority

- Module: Monitoring remarks. Source: DSI - Interface Content.pdf physical page(s) 4–5.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Progress; ProgressReports; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Remarks never alter approved totals/status; company-filtered reports
- Current front-end acceptance: Remarks never alter approved totals/status; company-filtered reports
- Required tests: progress authority/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-026 — Explicit evaluation date input; retain two obligations/history

- Module: Evaluations. Source: DSI - Interface Content.pdf physical page(s) 5.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Evaluations; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Valid date/grade/assignment/uniqueness
- Current front-end acceptance: Valid date/grade/assignment/uniqueness
- Required tests: evaluation integration/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-027 — Distinct admin versus Intern role using shared profile infrastructure

- Module: Administrative role. Source: DSI - Interface Content.pdf physical page(s) 5.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Partners; Workspace; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: No old account silently receives admin permissions
- Current front-end acceptance: No old account silently receives admin permissions
- Required tests: migration/role tests
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-028 — Company postings/pending/approved/active/slots/intern-supervisors/interns/MOA summaries

- Module: Dashboard. Source: DSI - Interface Content.pdf physical page(s) 5.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: RoleDashboard; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Company only; metrics derive shared records
- Current front-end acceptance: Company only; metrics derive shared records
- Required tests: company browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts; tests/e2e/interface-dashboard.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-029 — Own company ordinary info edit; MOA authority stays coordinator

- Module: Company editing. Source: DSI - Interface Content.pdf physical page(s) 5.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Partners; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Reject unrelated company and MOA tampering at service boundary
- Current front-end acceptance: Reject unrelated company and MOA tampering at service boundary
- Required tests: company permissions/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-030 — Own create/edit/details and full attributes; material edit reapproval

- Module: Posting management. Source: DSI - Interface Content.pdf physical page(s) 5.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Opportunities; PostingControls; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Shared records; validated fields/capacity; historical records kept
- Current front-end acceptance: Shared records; validated fields/capacity; historical records kept
- Required tests: posting/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-031 — Company pending -> Coordinator pending -> Approved -> Active; Filled derived; Deactivated; rejection history

- Module: Posting transitions. Source: DSI - Interface Content.pdf physical page(s) 5.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: PostingControls; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: No activation before both approvals; no filled application; retain history
- Current front-end acceptance: No activation before both approvals; no filled application; retain history
- Required tests: posting/migration/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-032 — Own-company Intern account creation/activation/deactivation and workloads

- Module: Intern accounts. Source: DSI - Interface Content.pdf physical page(s) 6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Partners; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: No cross-company creation; active assignment policy; retain historical account IDs
- Current front-end acceptance: No cross-company creation; active assignment policy; retain historical account IDs
- Required tests: supervisor integration/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-033 — Registered active own-company Intern Supervisor IDs on opportunity

- Module: Opportunity assignment. Source: DSI - Interface Content.pdf physical page(s) 6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: PostingControls; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Unassigned intern cannot see/decide apps; preserve past decision history
- Current front-end acceptance: Unassigned intern cannot see/decide apps; preserve past decision history
- Required tests: assignment/role browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-034 — Own-company assignment/reassignment with unchanged two evaluation obligations

- Module: Intern assignment. Source: DSI - Interface Content.pdf physical page(s) 6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Placements; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Same company; submitted eval assignment immutable; pending changes audited
- Current front-end acceptance: Same company; submitted eval assignment immutable; pending changes audited
- Required tests: assignment/evaluation tests
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-035 — Dedicated assigned opportunity/application/intern/report/evaluation summaries and profile

- Module: Dashboard/navigation. Source: DSI - Interface Content.pdf physical page(s) 6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: RoleDashboard; Workspace; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: No company-wide data outside assigned scope
- Current front-end acceptance: No company-wide data outside assigned scope
- Required tests: role browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts; tests/e2e/interface-dashboard.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-036 — Own contact update, company/assigned postings, account settings

- Module: Profile. Source: DSI - Interface Content.pdf physical page(s) 6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Partners; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: No role/company reassignment or unrelated account edits
- Current front-end acceptance: No role/company reassignment or unrelated account edits
- Required tests: profile browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-037 — Assigned posting applications/applicants/academic info/relevant Before documents/decisions/history

- Module: Applications. Source: DSI - Interface Content.pdf physical page(s) 6.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Applications; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: One terminal decision; eligibility/status/capacity; unrelated docs denied
- Current front-end acceptance: One terminal decision; eligibility/status/capacity; unrelated docs denied
- Required tests: application authority/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-038 — Reuse directory/profile/filters/adviser/dates/required-approved hours/status

- Module: My interns. Source: DSI - Interface Content.pdf physical page(s) 6–7.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Students; Placements; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Operational access only assigned placement interns
- Current front-end acceptance: Operational access only assigned placement interns
- Required tests: role/progress browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-039 — Explicit Pending/Approved/Rejected and immutable decisions; remarks; rejected resubmission

- Module: Progress decisions. Source: DSI - Interface Content.pdf physical page(s) 7.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Progress; Attendance; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Only assigned Intern can approve/reject; repeated approval cannot double count
- Current front-end acceptance: Only assigned Intern can approve/reject; repeated approval cannot double count
- Required tests: weekly/approval tests/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-040 — Move company obligation to Intern role; explicit date

- Module: Company evaluation. Source: DSI - Interface Content.pdf physical page(s) 7.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: Evaluations; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: Assigned evaluator only; no third/duplicate evaluation; historic submissions retained
- Current front-end acceptance: Assigned evaluator only; no third/duplicate evaluation; historic submissions retained
- Required tests: migration/evaluation/browser
- Executed mapping: tests/integration/interface-update.test.ts; tests/integration/interface-permissions.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.

## IU-041 — Atomic v1->v2 upgrade; legacy role maps to Intern; reviewed totals grandfathered; unknown versions fail

- Module: Saved-data upgrade. Source: DSI - Interface Content.pdf physical page(s) 1–7.
- Classification: **Implemented and verified**. Verdict: **PASS**.
- Implementation: upgrade.ts; storage.ts; integrity.ts; app/lib/domain.ts,commands.ts,updates.ts,rules.ts.
- Remaining behavior: None in the bounded implemented synthetic workflow; institutional/backend limits remain in BUSINESS_RULES and KNOWN_ISSUES.
- Source acceptance: No reset; IDs/files/history/totals preserved; read-only after upgrade; stale revisions reject
- Current front-end acceptance: No reset; IDs/files/history/totals preserved; read-only after upgrade; stale revisions reject
- Required tests: native migration regression
- Executed mapping: tests/integration/interface-upgrade.test.ts; tests/e2e/interface-update.spec.ts
- Dependencies: All operations are browser-local demonstrations. Server permissions/constraints/tokens/email/files and approved policy mapping remain receiving-team responsibilities.; demonstration policies D-043–052.
