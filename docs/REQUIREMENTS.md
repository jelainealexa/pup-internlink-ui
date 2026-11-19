# Functional requirements inventory

Updated 2026-11-19 for the implemented front-end demonstration. The 86 original audit IDs are retained; eight additional requirements explicitly trace the autonomous instruction. Original classifications/locations/gaps remain in baseline fields and [phase0-requirements-inventory.json](evidence/phase0-requirements-inventory.json). Current machine-readable source: [requirements-inventory.json](evidence/requirements-inventory.json).

**PASS means bounded synthetic front-end behavior supported by the mapped automated/browser suites. It does not mean approved ERD, connected backend, production security, every edge case or every browser.** The original source acceptance wording is preserved separately from the front-end scope interpretation. Test strings describe required coverage; executed files/evidence identify actual runs. Legacy planned T-* labels are retained identifiers, not separate executed tests.

Classifications: Implemented and verified; Implemented but unverified; Partially implemented; Placeholder; Missing; Blocked by external dependency; Proposed expansion. Deliverable verdicts additionally distinguish PASS/FAIL/BLOCKED/UNVERIFIED/NOT APPLICABLE.

Inventory: **94** audit/development requirements: BLOCKED 1, NOT APPLICABLE 7, PASS 86. IDs are decomposition units, not equal effort percentages. No currently in-scope demo row is Placeholder/Missing. One external approval and seven excluded expansions/integration rows are explicit.

Sources: PDF physical pages 1–23 plus the autonomous user instruction. Source recommendations/conditional functions do not constitute an approved database design. BUSINESS_RULES/DECISION_LOG reconcile uncertainties without claiming owner approval. Additional role products and self-evaluation remain excluded; minimal necessary demonstration views have distinct delivered IDs.

## AUTH-001 — Authenticate credentials and active accounts

- Module: Authentication. Source: PDF p.1.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Login.tsx; app/lib/service.ts; app/components/Workspace.tsx`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Invalid or inactive account cannot enter; active account gets correct session and dashboard
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Invalid/blank/inactive/valid sign-in and reload
- Executed evidence: tests/e2e/auth.spec.ts; tests/integration/services.test.ts (credentials, scope, expiry, mode isolation)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## AUTH-002 — Restrict routes and actions by role and assignment

- Module: Authentication. Source: PDF pp.1,20.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Login.tsx; app/lib/service.ts; app/components/Workspace.tsx`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Direct URLs and commands deny wrong role/unassigned records; permitted coordinator works
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Anonymous/wrong-role/cross-record UI and API negatives
- Executed evidence: tests/e2e/auth.spec.ts; tests/integration/services.test.ts (credentials, scope, expiry, mode isolation)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## AUTH-003 — End session on Exit/sign-out

- Module: Authentication. Source: PDF p.1 login boundary; user Task 6.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Login.tsx; app/lib/service.ts; app/components/Workspace.tsx`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Sign-out clears actual session; protected URL unavailable after exit/back/reload
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Session invalidation and cache/back tests
- Executed evidence: tests/e2e/auth.spec.ts; tests/integration/services.test.ts (credentials, scope, expiry, mode isolation)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## AUTH-004 — Define account versus profile provisioning

- Module: Authentication. Source: PDF pp.1,7; user Task 7.
- Classification: **Blocked by external dependency**. Deliverable: **BLOCKED**.
- Implementation: `app/features/Login.tsx; app/lib/service.ts; app/components/Workspace.tsx`.
- Remaining behavior: Synthetic linked accounts are implemented; approved real account/profile provisioning and invitation lifecycle still require external agreement.
- Source acceptance: Approved account/profile mapping and active-role lifecycle are documented and integration-tested
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Synthetic linked accounts are implemented; approved real account/profile provisioning and invitation lifecycle still require external agreement.
- Required tests: Provision/disable and duplicate-account tests after agreement
- Executed evidence: tests/e2e/auth.spec.ts; tests/integration/services.test.ts (credentials, scope, expiry, mode isolation)
- Dependencies: Approved ERD/account provisioning policy/backend owner; demo student/supervisor account linkage already functional.

## NAV-001 — Expose eleven coordinator modules and collapsible navigation

- Module: Navigation. Source: PDF p.1.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/components/Workspace.tsx; app/components/ui.tsx; app/features/PortalPage.tsx; app/dashboard/**/page.tsx`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Every module opens its intended page; accessible current/expanded state; collapse preserves usable labels
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: All destinations, keyboard and collapse/reopen
- Executed evidence: tests/e2e/smoke.spec.ts; tests/e2e/maintenance.spec.ts (valid/invalid routes, URL filters, back/forward)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## NAV-002 — Preserve student/company/opportunity/status URL context

- Module: Navigation. Source: PDF pp.2,5,12,21-22.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/components/Workspace.tsx; app/components/ui.tsx; app/features/PortalPage.tsx; app/dashboard/**/page.tsx`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Deep links and UI filters agree after reload/back/forward and same-route query changes; no cross-student leakage
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Query parsing, invalid/repeated keys and all connection mappings
- Executed evidence: tests/e2e/smoke.spec.ts; tests/e2e/maintenance.spec.ts (valid/invalid routes, URL filters, back/forward)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## NAV-003 — Handle missing or forbidden records consistently

- Module: Navigation. Source: User Tasks 3,6.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/components/Workspace.tsx; app/components/ui.tsx; app/features/PortalPage.tsx; app/dashboard/**/page.tsx`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Unknown/forbidden IDs render safe correct state and consistent routing semantics
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Valid/unknown/malformed/forbidden IDs and HTTP/body checks
- Executed evidence: tests/e2e/smoke.spec.ts; tests/e2e/maintenance.spec.ts (valid/invalid routes, URL filters, back/forward)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## DSH-001 — Show accurate current-program summary totals

- Module: Dashboard. Source: PDF pp.1-2 (unfinished/recommended).
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Dashboard.tsx; app/lib/rules.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved dashboard sections derive from same scoped records; sums reconcile
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Counts for empty/mixed/term datasets and mutation refresh
- Executed evidence: tests/e2e/maintenance.spec.ts; tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/unit/rules.test.ts (derived totals)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## DSH-002 — Show applications, placements, requirements, progress and evaluation attention

- Module: Dashboard. Source: PDF p.2 (recommended).
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Dashboard.tsx; app/lib/rules.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Counts by approved statuses and progress policy match module records
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Category/status/ratio selectors; all-update propagation
- Executed evidence: tests/e2e/maintenance.spec.ts; tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/unit/rules.test.ts (derived totals)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## DSH-003 — Open correct filtered tasks and quick actions

- Module: Dashboard. Source: PDF pp.2,21-22.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Dashboard.tsx; app/lib/rules.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Every summary/attention/quick link opens matching data or specified form
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Click every dashboard link and compare visible records
- Executed evidence: tests/e2e/maintenance.spec.ts; tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/unit/rules.test.ts (derived totals)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## DSH-004 — Display recent program activity

- Module: Dashboard. Source: PDF p.2 (recommended).
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Dashboard.tsx; app/lib/rules.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Actual recent synthetic/API writes produce correctly ordered permission-scoped entries
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Create/decide/place then inspect timestamps and related links
- Executed evidence: tests/e2e/maintenance.spec.ts; tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/unit/rules.test.ts (derived totals)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-001 — List students and open profiles

- Module: Students. Source: PDF pp.3-5.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Students.tsx; app/lib/commands.ts (student.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Directory shows saved ID/name/program/year/section/placement/status/hours; every row opens same student
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: List/detail consistency, empty list and saved-record reload
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (account sync/uniqueness/persistence)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-002 — Search students by name or official ID

- Module: Students. Source: PDF p.3.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Students.tsx; app/lib/commands.ts (student.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Name/ID case-insensitive search narrows current dataset and explains no match
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Name/ID/mixed-case/no-match and combined filters
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (account sync/uniqueness/persistence)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-003 — Filter program/year/section/status

- Module: Students. Source: PDF p.3.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Students.tsx; app/lib/commands.ts (student.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: All four filters combine correctly and return honest zero result
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Each filter with diverse years and intersections
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (account sync/uniqueness/persistence)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-004 — Sort by student name, ID or rendered hours

- Module: Students. Source: PDF p.3.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Students.tsx; app/lib/commands.ts (student.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Each sort orders the displayed set predictably
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Name/ID/hours/ties/filtered records
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (account sync/uniqueness/persistence)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-005 — Create a durable student and redirect to profile

- Module: Students. Source: PDF pp.3-4.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Students.tsx; app/lib/commands.ts (student.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Required fields saved once; success follows write and new profile opens; survives reload
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Blank/valid/save-failure/double-submit/reload
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (account sync/uniqueness/persistence)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-006 — Validate required student fields and unique ID/email

- Module: Students. Source: PDF pp.3-4.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Students.tsx; app/lib/commands.ts (student.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Trimmed required ID/name/email/program/year/section; invalid email and duplicate normalized ID/email rejected without mutation
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Whitespace, email normalization, duplicate after save and races
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (account sync/uniqueness/persistence)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-007 — Edit student contact/academic information

- Module: Students. Source: PDF p.3.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Students.tsx; app/lib/commands.ts (student.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Changes persist across profile/directory/reload with same validated constraints and intended readonly ID
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Edit/clear/duplicate/failed save and Cancel
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (account sync/uniqueness/persistence)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-008 — Use profile as student-specific internship record hub

- Module: Students. Source: PDF pp.4-5,21-22.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Students.tsx; app/lib/commands.ts (student.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Profile links open only that student's checklist, applications, placement/history, progress and evaluations
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Scenario A for placed/unplaced students and unrelated-data exclusion
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (account sync/uniqueness/persistence)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## STU-009 — Export student directory records

- Module: Students. Source: PDF p.3 (explicitly optional).
- Classification: **Proposed expansion**. Deliverable: **NOT APPLICABLE**.
- Implementation: `app/features/Students.tsx; app/lib/commands.ts (student.save)`.
- Remaining behavior: Dedicated directory export is optional; Students report CSV is delivered. Export of every directory-specific program/section filter is a proposed expansion.
- Source acceptance: If approved, export selected fields/current filters using synthetic or authorized data
- Front-end acceptance: Dedicated directory export is optional; Students report CSV is delivered. Export of every directory-specific program/section filter is a proposed expansion.
- Required tests: Export content/escaping/filter scope
- Executed evidence: Scope reconciliation; see BUSINESS_RULES and HANDOVER. Not claimed as implemented full expansion/backend.
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PAR-001 — List partner fields and computed partnership status

- Module: Industry Partners. Source: PDF pp.5-6 (recommended columns).
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Partners.tsx; app/lib/commands.ts (company.save/supervisor.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Saved companies display contact/slots/MOA/status consistently
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: List/detail totals and status-boundary fixtures
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (MOA boundaries)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PAR-002 — Search/filter/sort partners including expiring

- Module: Industry Partners. Source: PDF pp.5-6,21.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Partners.tsx; app/lib/commands.ts (company.save/supervisor.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Name search; status/industry filters; name/MOA sort; expiring link uses approved window
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Each filter/sort/date boundary/query
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (MOA boundaries)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PAR-003 — Register company with MOA details

- Module: Industry Partners. Source: PDF p.6,23 scenario B.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Partners.tsx; app/lib/commands.ts (company.save/supervisor.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Required company/industry/address/contact/email/phone/MOA dates validate, unique name/email save, profile opens
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Blank/duplicate/date/failure/success/reload
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (MOA boundaries)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PAR-004 — Edit company and partnership information

- Module: Industry Partners. Source: PDF p.6.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Partners.tsx; app/lib/commands.ts (company.save/supervisor.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Validated edits persist and update related views without changing record identity
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Edit/duplicate/date/permission/reload
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (MOA boundaries)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PAR-005 — Company Profile connects overview/MOA/supervisors/opportunities/placements

- Module: Industry Partners. Source: PDF pp.7-8,22.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Partners.tsx; app/lib/commands.ts (company.save/supervisor.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Each company shows only its actual related records and direct detail links
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Scenario B plus empty company/cross-company isolation
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (MOA boundaries)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PAR-006 — Register/view/edit supervisors within company profile

- Module: Industry Partners. Source: PDF pp.7-8.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Partners.tsx; app/lib/commands.ts (company.save/supervisor.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Supervisor belongs exactly one company and an account; contact/assigned placements editable/viewable with permissions
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Create/edit/account-required/cross-company rejection
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (MOA boundaries)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PAR-007 — Show active/current and historical company placements

- Module: Industry Partners. Source: PDF p.7.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Partners.tsx; app/lib/commands.ts (company.save/supervisor.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Company-scoped placement list and details include previous assignments under approved history policy
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Multiple companies/history/unrelated exclusion
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (MOA boundaries)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## REQ-001 — Provide master requirement views and classification counts

- Module: Requirements. Source: PDF p.8.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: All/Mandatory/Optional master views show name/description/classification/submission count and actions
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Route/classification/count/empty tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (Blob bytes/reviews/attempts)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## REQ-002 — Create/edit requirement definitions

- Module: Requirements. Source: PDF pp.8-9.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Name/description/classification save and return to updated master list; edit preserves submitted-record history policy
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Create/edit/invalid/retirement policy tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (Blob bytes/reviews/attempts)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## REQ-003 — List/search/filter student submissions and open files

- Module: Requirements. Source: PDF p.9.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Student/requirement search, Pending/Approved/Rejected filters, dates/reviewer; authorized file and student details open
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: File preview/denied/missing/filters/date/reviewer tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (Blob bytes/reviews/attempts)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## REQ-004 — Approve/reject with required reason and reviewer

- Module: Requirements. Source: PDF p.9.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Authorized reviewer result persists; rejected reason nonblank; all checklists/queues refresh
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Approve/reject/blank/unauthorized/conflict/reload
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (Blob bytes/reviews/attempts)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## REQ-005 — Student checklist shows mandatory/optional/latest submission and direct detail

- Module: Requirements. Source: PDF pp.9-10.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Student-specific status/date/review results and Not Submitted correctly displayed; document opens directly
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Two-student separation/current-version/no-file/checklist tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (Blob bytes/reviews/attempts)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## REQ-006 — Identify incomplete mandatory submissions before placement

- Module: Requirements. Source: PDF p.10.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Every applicable mandatory requirement must be submitted per PDF; approval-versus-submission policy explicitly resolved
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Latest mandatory attempts must be Approved before acceptance/placement (stricter demo assumption, not approved ERD rule).
- Required tests: Missing/optional/pending/rejected/approved permutations
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (Blob bytes/reviews/attempts)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## REQ-007 — Define resubmission and requirement version behavior

- Module: Requirements. Source: User Task 7; PDF pp.9-10 does not specify.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved attempt/current-status/reviewer history rules reflected consistently
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Only missing/rejected resubmission, immutable attempts; placements snapshot required IDs; no review reversal.
- Required tests: Reject/resubmit/review-again/history tests after decision
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (Blob bytes/reviews/attempts)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## REQ-008 — Support related student's file submission workflow

- Module: Requirements. Source: PDF p.23 diagram; pp.9-10.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Authorized synthetic/API submission becomes visible in coordinator checklist/review queue with safe file reference
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Upload/oversize/type/ownership/reload/failure
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/e2e/maintenance.spec.ts; tests/integration/services.test.ts (Blob bytes/reviews/attempts)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## OPP-001 — Search/filter opportunities by position/company/status

- Module: Opportunities. Source: PDF pp.10-11.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Opportunities.tsx; app/lib/commands.ts (opportunity commands); app/lib/rules.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Directory displays saved title/company/description/slots/application counts/status and usable controls
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Search/company/status/empty/query tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## OPP-002 — Create opportunity for registered company

- Module: Opportunities. Source: PDF p.11.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Opportunities.tsx; app/lib/commands.ts (opportunity commands); app/lib/rules.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Company/title/description/positive slots required; company exists; save redirects to detail
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Blank/zero/negative/nonexistent-company/success/reload
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## OPP-003 — Edit/approve opportunity according to approved policy

- Module: Opportunities. Source: PDF p.11 (approval conditional).
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Opportunities.tsx; app/lib/commands.ts (opportunity commands); app/lib/rules.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Edits persist; if required, pending listings unavailable to students until authorized approval
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Coordinator approval adopted in demo; Pending Approval → Approved/Closed and coordinator reopen.
- Required tests: Edit/approval/closed/denied tests for selected policy
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## OPP-004 — Opportunity Details links company/applicants/assigned placements

- Module: Opportunities. Source: PDF pp.11-12,22.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Opportunities.tsx; app/lib/commands.ts (opportunity commands); app/lib/rules.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Actual ID-joined applicants and placements match this opportunity and open correct records
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: All fixture opportunities and unrelated-data exclusion
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## OPP-005 — Display and enforce real available capacity

- Module: Opportunities. Source: PDF pp.10-11,14.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Opportunities.tsx; app/lib/commands.ts (opportunity commands); app/lib/rules.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Capacity and availability reflect approved reservation/consumption/release policy; no oversubscription
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Non-terminated placements consume slots; acceptance reserves none; atomically rechecked on placement creation.
- Required tests: Last slot/concurrent accept/place/cancel/failure rollback
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/maintenance.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## OPP-006 — Retain deadline/program/setup only within approved rules

- Module: Opportunities. Source: Existing opportunity UI; user scope constraint.
- Classification: **Proposed expansion**. Deliverable: **NOT APPLICABLE**.
- Implementation: `app/features/Opportunities.tsx; app/lib/commands.ts (opportunity commands); app/lib/rules.ts`.
- Remaining behavior: Deadline/program/work-setup fields have no approved policy and were not retained as misleading controls.
- Source acceptance: Retain useful display; do not invent mandatory eligibility rules from fixtures; approved metadata maps consistently
- Front-end acceptance: Deadline/program/work-setup fields have no approved policy and were not retained as misleading controls.
- Required tests: Display fixtures and policy tests if later approved
- Executed evidence: Scope reconciliation; see BUSINESS_RULES and HANDOVER. Not claimed as implemented full expansion/backend.
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## APP-001 — List application records and open details

- Module: Applications. Source: PDF pp.12-13.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Applications.tsx; app/lib/commands.ts (application commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Rows/detail show correct student/number/program/year/section/opportunity/company/date/status and links
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: All statuses/list-detail agreement/missing IDs
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (decision/history/eligibility)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## APP-002 — Search/filter/sort and contextual application navigation

- Module: Applications. Source: PDF pp.12-13,22.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Applications.tsx; app/lib/commands.ts (application commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Name/number/status/company/opportunity/date filters and source links preserve context
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: All controls, summary buttons, clear/back/reload/query tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (decision/history/eligibility)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## APP-003 — Accept eligible application durably

- Module: Applications. Source: PDF pp.13-14,23.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Applications.tsx; app/lib/commands.ts (application commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved checks run; one authoritative Accepted decision updates header/list/profile and enables usable placement command
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Valid/ineligible/full-slot/unauthorized/conflict/reload
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (decision/history/eligibility)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## APP-004 — Reject with confirmation and reason, retain history

- Module: Applications. Source: PDF p.14,23.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Applications.tsx; app/lib/commands.ts (application commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Cancel preserves Pending; nonblank reason and authorized decision persist in history/related views
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Blank/whitespace/cancel/confirm/reload/conflict
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (decision/history/eligibility)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## APP-005 — Prefill placement from accepted application

- Module: Applications. Source: PDF p.14.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Applications.tsx; app/lib/commands.ts (application commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Selected application/student/opportunity/company readonly; accepted persisted record usable; invalid/missing context handled
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Accepted/pending/rejected/unknown/missing query and Cancel
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (decision/history/eligibility)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## APP-006 — Support related student's application submission

- Module: Applications. Source: PDF p.23 flow diagram.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Applications.tsx; app/lib/commands.ts (application commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Authorized student application links student/opportunity and appears Pending in coordinator list; duplicate policy agreed
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Valid/closed/duplicate/foreign-student submission tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (decision/history/eligibility)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PLC-001 — List/filter/sort official placements

- Module: Placements. Source: PDF pp.14-15.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Saved student/company/opportunity/supervision/dates/hours/status listed; name/ID/company/adviser/status/date controls correct
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Each filter/sort/status button/query/empty/reload
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (duplicate/last-slot race/termination); tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PLC-002 — Create only from Accepted application with unique placement per application

- Module: Placements. Source: PDF pp.15-16.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Application Accepted and no existing placement; system ID/status; valid context in summary
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Pending/rejected/duplicate/double-submit/missing application tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (duplicate/last-slot race/termination); tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PLC-003 — Validate dates, required hours and registered assignments

- Module: Placements. Source: PDF p.16.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Required valid dates, approved date order, finite positive hours, registered faculty and same-company supervisor
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Equal/reversed dates, zero/negative/NaN/fraction policy and wrong-company/unregistered assignment
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (duplicate/last-slot race/termination); tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PLC-004 — Enforce placement eligibility/capacity atomically

- Module: Placements. Source: PDF pp.10,14,16.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: One atomic transaction validates current eligibility/availability, writes assignment and approved slot effects or none
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Approved mandatory documents, available approved posting/date-valid MOA, accepted application, one ongoing placement and same-company supervisor.
- Required tests: Concurrent last-slot, duplicate application, failed write rollback
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (duplicate/last-slot race/termination); tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PLC-005 — Persist reviewed placement, generate ID, redirect

- Module: Placements. Source: PDF p.16.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Success follows actual write; generated stable ID/detail and all lists show assignment after reload
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Valid/save failure/retry/reload/related student consistency
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (duplicate/last-slot race/termination); tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PLC-006 — Placement detail hub connects all related records

- Module: Placements. Source: PDF p.17,22-23.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Overview, dates, supervision, real hours/reports/evaluations/completion link to this placement only
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Scenario D and multiple-history/unrelated-record tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (duplicate/last-slot race/termination); tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PLC-007 — Display actual completion and certificate number/issue date

- Module: Placements. Source: PDF p.17,23.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Only actual issued certificate displays number/date after approved completion; unavailable state otherwise
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Actual separately recorded synthetic certificate metadata after eligible completion; no official document issuance.
- Required tests: No certificate/issued/terminated/incomplete/unauthorized tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (duplicate/last-slot race/termination); tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PLC-008 — Handle termination/cancellation and capacity consequences

- Module: Placements. Source: PDF pp.14-15 status; user Task 7.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved transition matrix preserves history and resolves hours/slots/evaluations/certificate effects
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Ongoing → Terminated with reason; history retained, capacity released; no separate Cancelled state.
- Required tests: Terminate/cancel/retry/forbidden/reversal tests after decision
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/guards.spec.ts; tests/integration/services.test.ts (duplicate/last-slot race/termination); tests/unit/rules.test.ts
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PRG-001 — Show monitoring summaries, filters and student details

- Module: Progress Monitoring. Source: PDF pp.17-19.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Progress.tsx; app/lib/rules.ts; app/lib/commands.ts (report commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Counts/scoped filters link correct record; reporting/near-complete definitions approved
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Search/company/adviser/status/context/empty and summary tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (hours/reporting gaps)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PRG-002 — Display per-placement report history and details

- Module: Progress Monitoring. Source: PDF pp.18-19.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Progress.tsx; app/lib/rules.ts; app/lib/commands.ts (report commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Tasks/date/hours/remarks/review status belong to selected placement; empty history explicit
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Two placements for one student, report detail and no-history tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (hours/reporting gaps)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PRG-003 — Compute accumulated/remaining hours and completion

- Module: Progress Monitoring. Source: PDF p.18.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Progress.tsx; app/lib/rules.ts; app/lib/commands.ts (report commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved counted reports/opening balance policy yields consistent sums; 243/486=50%; zero-invalid input handled
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Official reviewed hours distinct from submitted; percent=reviewed/required×100 and remaining≥0.
- Required tests: Report inclusion/review/resubmit/overrun/zero/date/rounding tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (hours/reporting gaps)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PRG-004 — Review report durably and refresh queues

- Module: Progress Monitoring. Source: PDF p.19.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Progress.tsx; app/lib/rules.ts; app/lib/commands.ts (report commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Authorized review result recorded, consistent table/queue/reload and optional hour effects per policy
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Pending/reviewed/denied/reload/queue refresh/dialog keyboard
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (hours/reporting gaps)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PRG-005 — Identify missing or delayed reports

- Module: Progress Monitoring. Source: PDF p.19.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Progress.tsx; app/lib/rules.ts; app/lib/commands.ts (report commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved schedule flags genuinely missing/late periods without inventing reports
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Local >7-day gap reminder and ≥75% near-completion heuristic, not an approved institutional reporting schedule.
- Required tests: Clock/term/holiday/grace/absence boundary tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (hours/reporting gaps)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## PRG-006 — Support related student's progress report submission

- Module: Progress Monitoring. Source: PDF p.23 diagram; pp.18-19.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Progress.tsx; app/lib/rules.ts; app/lib/commands.ts (report commands)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Assigned student submits dated tasks/hours; correct placement history/review queue and totals update per policy
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Wrong student/date/hour/duplicate/reload tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/smoke.spec.ts; tests/integration/services.test.ts; tests/unit/rules.test.ts (hours/reporting gaps)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## EVA-001 — Represent individual company/faculty evaluation records

- Module: Evaluations. Source: PDF pp.19-20.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Evaluations.tsx; app/lib/commands.ts (evaluation.submit); app/lib/rules.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Each record shows student/company/placement/evaluator/date/grade/comments and Pending/Submitted
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Per-record field and list/detail mapping tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/unit/rules.test.ts (assigned/duplicate/invalid grade)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## EVA-002 — Filter evaluations by pending/submitted and evaluator role/context

- Module: Evaluations. Source: PDF pp.19-20,22.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Evaluations.tsx; app/lib/commands.ts (evaluation.submit); app/lib/rules.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Company/faculty and status filters plus contextual links show only intended records; role inferred from relation
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: All filter combinations/URLs/cross-student exclusion
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/unit/rules.test.ts (assigned/duplicate/invalid grade)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## EVA-003 — Restrict evaluator to assigned faculty/supervisor and at most two per placement

- Module: Evaluations. Source: PDF p.20.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Evaluations.tsx; app/lib/commands.ts (evaluation.submit); app/lib/rules.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Wrong/unassigned actor denied; third evaluation rejected transactionally; one-per-role policy confirmed
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Wrong company/student/role, duplicates/race/third attempt
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/unit/rules.test.ts (assigned/duplicate/invalid grade)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## EVA-004 — Compute both-required-evaluations completion summary

- Module: Evaluations. Source: PDF p.20.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Evaluations.tsx; app/lib/commands.ts (evaluation.submit); app/lib/rules.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Summary reflects actual company and faculty submission independently; internship completion follows approved wider conditions
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: None/one/both submitted, grade/incomplete-hours cases
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/unit/rules.test.ts (assigned/duplicate/invalid grade)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## EVA-005 — Accept scored/commented submissions from assigned evaluators

- Module: Evaluations. Source: PDF pp.19-20,23 diagram.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Evaluations.tsx; app/lib/commands.ts (evaluation.submit); app/lib/rules.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved rubric validates grade/comments; authorized assigned actor's submission persists with date
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Demo score 0–100/comments; no final grade weights/pass threshold.
- Required tests: Boundary score/missing comment/unauthorized/resubmit tests
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/unit/rules.test.ts (assigned/duplicate/invalid grade)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## RPT-001 — Offer seven consolidated report categories

- Module: Reports & Analytics. Source: PDF pp.20-21.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Reports.tsx; app/lib/reporting.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Student/partner/opportunity/application/placement/progress/evaluation categories use actual related data
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Route/category/empty/permission tests
- Executed evidence: tests/e2e/smoke.spec.ts; tests/e2e/lifecycle.spec.ts (filtered CSV bytes); tests/unit/rules.test.ts (CSV/formula/rows/totals)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## RPT-002 — Generate report with year/company/status filters

- Module: Reports & Analytics. Source: PDF p.21.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Reports.tsx; app/lib/reporting.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Selected valid category/filters produce scoped readable results and generation context
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Every category/filter combination/no-result/failure
- Executed evidence: tests/e2e/smoke.spec.ts; tests/e2e/lifecycle.spec.ts (filtered CSV bytes); tests/unit/rules.test.ts (CSV/formula/rows/totals)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## RPT-003 — Reconcile report totals and grades with module data

- Module: Reports & Analytics. Source: PDF p.21; user reliability objective.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Reports.tsx; app/lib/reporting.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Export/display summaries match same authorized snapshot, counted-hours policy and evaluation rubric
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Known fixture counts/join/grade/hour/term reconciliation
- Executed evidence: tests/e2e/smoke.spec.ts; tests/e2e/lifecycle.spec.ts (filtered CSV bytes); tests/unit/rules.test.ts (CSV/formula/rows/totals)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## RPT-004 — Export or print generated report

- Module: Reports & Analytics. Source: PDF p.21.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Reports.tsx; app/lib/reporting.ts`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved export/print contains selected results/filters and no unrelated personal data
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Escaping/CSV injection if CSV, print layout, filtered counts, permissions
- Executed evidence: tests/e2e/smoke.spec.ts; tests/e2e/lifecycle.spec.ts (filtered CSV bytes); tests/unit/rules.test.ts (CSV/formula/rows/totals)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## SET-001 — Persist effective workspace preferences

- Module: Settings. Source: PDF p.1 lists Settings; detailed UI provisional.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Settings.tsx; app/components/AppProvider.tsx; app/lib/commands.ts (preferences.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Approved year/default landing/density changes affect intended views and survive reload; per-user scope defined
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Browser-local per-account preferences, not institutional term administration.
- Required tests: Change/navigation/reload/reset/different identity tests
- Executed evidence: tests/e2e/maintenance.spec.ts; tests/e2e/smoke.spec.ts (persisted effects/reset/axe)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## SET-002 — Make approved reminders and accessibility preferences effective

- Module: Settings. Source: Existing prototype; user Task 3/6.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Settings.tsx; app/components/AppProvider.tsx; app/lib/commands.ts (preferences.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: If retained, reminders use real queues and text/motion settings visibly apply and persist
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent. Alert flags affect dashboard reminders, not email/SMS; text/motion/density have actual CSS effects.
- Required tests: All toggles/off states/rendered style/motion/reminder tests
- Executed evidence: tests/e2e/maintenance.spec.ts; tests/e2e/smoke.spec.ts (persisted effects/reset/axe)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## SET-003 — Display actual authenticated account read-only

- Module: Settings. Source: PDF p.1 role rules; existing Settings UI.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Settings.tsx; app/components/AppProvider.tsx; app/lib/commands.ts (preferences.save)`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Signed-in active account info displayed; no unauthorized identity/role editing
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Two identities/sign-out/inactive account
- Executed evidence: tests/e2e/maintenance.spec.ts; tests/e2e/smoke.spec.ts (persisted effects/reset/axe)
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## ROLE-001 — Provide full student portal beyond specified related submissions

- Module: Additional portals. Source: PDF p.23 limited flows; user Phase 9 scope.
- Classification: **Proposed expansion**. Deliverable: **NOT APPLICABLE**.
- Implementation: `app/features/PortalPage.tsx; app/lib/commands.ts (scopedDatabase/role guards); app/components/Workspace.tsx`.
- Remaining behavior: Full additional student product is unapproved; minimal connected demonstration extension is delivered under ROLE-005.
- Source acceptance: Approve portal UX/requirements before implementation; own-record boundaries preserved
- Front-end acceptance: Full additional student product is unapproved; minimal connected demonstration extension is delivered under ROLE-005.
- Required tests: Role E2E after approved scope
- Executed evidence: Scope reconciliation; see BUSINESS_RULES and HANDOVER. Not claimed as implemented full expansion/backend.
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## ROLE-002 — Provide full faculty adviser portal beyond assigned review/evaluation

- Module: Additional portals. Source: PDF pp.19-20; user Phase 9 scope.
- Classification: **Proposed expansion**. Deliverable: **NOT APPLICABLE**.
- Implementation: `app/features/PortalPage.tsx; app/lib/commands.ts (scopedDatabase/role guards); app/components/Workspace.tsx`.
- Remaining behavior: Full additional faculty product is unapproved; assigned-work demonstration extension is delivered under ROLE-006.
- Source acceptance: Approve adviser UX/permissions; assigned-only access and required evaluation work
- Front-end acceptance: Full additional faculty product is unapproved; assigned-work demonstration extension is delivered under ROLE-006.
- Required tests: Assigned/unassigned role E2E after scope
- Executed evidence: Scope reconciliation; see BUSINESS_RULES and HANDOVER. Not claimed as implemented full expansion/backend.
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## ROLE-003 — Provide full company supervisor portal beyond assigned evaluation

- Module: Additional portals. Source: PDF pp.7,19-20; user Phase 9 scope.
- Classification: **Proposed expansion**. Deliverable: **NOT APPLICABLE**.
- Implementation: `app/features/PortalPage.tsx; app/lib/commands.ts (scopedDatabase/role guards); app/components/Workspace.tsx`.
- Remaining behavior: Full additional supervisor product is unapproved; company/assigned-work demonstration extension is delivered under ROLE-007.
- Source acceptance: Approve supervisor UX; company/assignment isolation and required evaluation work
- Front-end acceptance: Full additional supervisor product is unapproved; company/assigned-work demonstration extension is delivered under ROLE-007.
- Required tests: Cross-company role E2E after scope
- Executed evidence: Scope reconciliation; see BUSINESS_RULES and HANDOVER. Not claimed as implemented full expansion/backend.
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## ROLE-004 — Student self-evaluation

- Module: Additional portals. Source: Existing evaluation checklist only; absent from primary PDF.
- Classification: **Proposed expansion**. Deliverable: **NOT APPLICABLE**.
- Implementation: `app/features/PortalPage.tsx; app/lib/commands.ts (scopedDatabase/role guards); app/components/Workspace.tsx`.
- Remaining behavior: Student self-evaluation is unapproved and conflicts with the two required assigned evaluation obligations; intentionally excluded.
- Source acceptance: Do not count as required evaluation; retain only after explicit scope/rubric agreement
- Front-end acceptance: Student self-evaluation is unapproved and conflicts with the two required assigned evaluation obligations; intentionally excluded.
- Required tests: Two-evaluation cap and approved expansion tests
- Executed evidence: Scope reconciliation; see BUSINESS_RULES and HANDOVER. Not claimed as implemented full expansion/backend.
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-001 — Normalize synthetic model and validate seed references

- Module: Foundation. Source: User Tasks 5-6.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Single shared ID model; no orphan joins, duplicated authoritative totals or accidental real personal data
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Seed FK/status/uniqueness/aggregate integrity tests
- Executed evidence: tests/unit/rules.test.ts; tests/components/forms.test.tsx; tests/integration/services.test.ts; tests/e2e/smoke.spec.ts; tests/e2e/restart.spec.ts; test/build/type/lint logs
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-002 — Persist synthetic demo data with explicit mode/reset/version

- Module: Foundation. Source: User Task 6.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Synthetic transactions survive reload; version/reset/corruption/quota states explicit; all consumers update
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Adapter transaction/reload/rollback/version/reset/storage-denied tests
- Executed evidence: tests/unit/rules.test.ts; tests/components/forms.test.tsx; tests/integration/services.test.ts; tests/e2e/smoke.spec.ts; tests/e2e/restart.spec.ts; test/build/type/lint logs
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-003 — Typed service seam and isolated backend adapter

- Module: Foundation. Source: User Task 6.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Async typed commands/reads; API errors never read or write demo state; actual API adapter maps approved DTOs
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Service conformance/mode-isolation/network/shape/authorization tests
- Executed evidence: tests/unit/rules.test.ts; tests/components/forms.test.tsx; tests/integration/services.test.ts; tests/e2e/smoke.spec.ts; tests/e2e/restart.spec.ts; test/build/type/lint logs
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-004 — Central input validation and business invariants

- Module: Foundation. Source: User Task 6; PDF pp.4,6,11,16,20.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: UI and service reject invalid values; production backend repeats authoritative checks; unknown policies explicit
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Boundary/transition/relationship/concurrent-write tests
- Executed evidence: tests/unit/rules.test.ts; tests/components/forms.test.tsx; tests/integration/services.test.ts; tests/e2e/smoke.spec.ts; tests/e2e/restart.spec.ts; test/build/type/lint logs
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-005 — Provide loading/empty/error/success states

- Module: Foundation. Source: User Task 6.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Reads/commands expose correct loading, failure/retry, no-match and success-after-write behavior
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Injected failures/slow requests/empty/save conflict/retry
- Executed evidence: tests/unit/rules.test.ts; tests/components/forms.test.tsx; tests/integration/services.test.ts; tests/e2e/smoke.spec.ts; tests/e2e/restart.spec.ts; test/build/type/lint logs
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-006 — Accessible reusable forms/dialogs/status and usable mobile flows

- Module: Foundation. Source: User Tasks 3,6.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Associated names/errors; keyboard-operable dialogs/actions; mobile content usable without page overflow
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Keyboard/name/focus/390px/desktop/zoom checks
- Executed evidence: tests/unit/rules.test.ts; tests/components/forms.test.tsx; tests/integration/services.test.ts; tests/e2e/smoke.spec.ts; tests/e2e/restart.spec.ts; test/build/type/lint logs
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-007 — Reproducible lint/build/typecheck and meaningful tests

- Module: Foundation. Source: User Task 4/6.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Fresh lockfile install plus lint/typecheck/build and required unit/component/integration/E2E checks run reproducibly
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Actual recorded commands; intentional failing fixture verifies harness
- Executed evidence: tests/unit/rules.test.ts; tests/components/forms.test.tsx; tests/integration/services.test.ts; tests/e2e/smoke.spec.ts; tests/e2e/restart.spec.ts; test/build/type/lint logs
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-008 — Private file storage/preview interface in demo and API

- Module: Foundation. Source: PDF p.9; user Task 6.
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx`.
- Remaining behavior: None within the implemented front-end demonstration scope; production server responsibilities are excluded.
- Source acceptance: Synthetic demo files persist locally; API files use approved private upload/access; validate metadata/ownership
- Front-end acceptance: Persisted synthetic behavior satisfies the described workflow under documented demo policies; roles/relations/errors remain consistent.
- Required tests: Blob reload/type/size/unauthorized/missing/storage-failure tests
- Executed evidence: tests/unit/rules.test.ts; tests/components/forms.test.tsx; tests/integration/services.test.ts; tests/e2e/smoke.spec.ts; tests/e2e/restart.spec.ts; test/build/type/lint logs
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## FND-009 — Integrate approved backend/database with real auth and constraints

- Module: Foundation. Source: User objective and Phase 10.
- Classification: **Blocked by external dependency**. Deliverable: **NOT APPLICABLE**.
- Implementation: `app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx`.
- Remaining behavior: Actual backend/database/authentication integration is explicitly outside the current front-end-only authorization.
- Source acceptance: Approved DTO mapping and real test backend demonstrate all workflows; no fixture fallback
- Front-end acceptance: Actual backend/database/authentication integration is explicitly outside the current front-end-only authorization.
- Required tests: Real contract/transaction/permission/concurrency/upload integration suite
- Executed evidence: Scope reconciliation; see BUSINESS_RULES and HANDOVER. Not claimed as implemented full expansion/backend.
- Dependencies: Typed domain/service/rules and documented D-016–026 demo policies. Production agreement only needed for future real integration.

## AUTH-005 — Handle invalid/expired persisted demonstration sessions

- Module: Authentication. Source: User complete-front-end instruction §§7–15; related PDF workflow (minimal role UI explicitly demo extension).
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Login.tsx; app/lib/service.ts; app/components/Workspace.tsx`.
- Remaining behavior: None in tested synthetic workflow; see KNOWN_ISSUES for scope boundaries.
- Source acceptance: Invalid/malformed/expired session returns sign-in; no stale role bypass.
- Front-end acceptance: Invalid/malformed/expired session returns sign-in; no stale role bypass.
- Required tests: tests/integration/services.test.ts; app/lib/service.ts
- Executed evidence: tests/unit/session.test.ts; tests/integration/services.test.ts (malformed/unavailable/expired sessions)
- Dependencies: Shared domain/services, simulated role policy D-016–026

## REQ-009 — Store actual synthetic attachment bytes and authorize preview/download

- Module: Requirements. Source: User complete-front-end instruction §§7–15; related PDF workflow (minimal role UI explicitly demo extension).
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Requirements.tsx; app/lib/commands.ts (requirement/submission commands)`.
- Remaining behavior: None in tested synthetic workflow; see KNOWN_ISSUES for scope boundaries.
- Source acceptance: Supported nonempty ≤5MB Blob persists and downloads; failed processing never reports success.
- Front-end acceptance: Supported nonempty ≤5MB Blob persists and downloads; failed processing never reports success.
- Required tests: tests/integration/services.test.ts; tests/e2e/maintenance.spec.ts; tests/e2e/lifecycle.spec.ts
- Executed evidence: tests/integration/services.test.ts; tests/e2e/maintenance.spec.ts; tests/e2e/lifecycle.spec.ts
- Dependencies: Shared domain/services, simulated role policy D-016–026

## PLC-009 — Complete eligible placement and explicitly record synthetic certificate metadata

- Module: Placements. Source: User complete-front-end instruction §§7–15; related PDF workflow (minimal role UI explicitly demo extension).
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Placements.tsx; app/lib/commands.ts (placement/certificate commands)`.
- Remaining behavior: None in tested synthetic workflow; see KNOWN_ISSUES for scope boundaries.
- Source acceptance: Missing reviewed hours/documents/evaluations block completion; assigned submissions and completion permit explicit unique metadata.
- Front-end acceptance: Missing reviewed hours/documents/evaluations block completion; assigned submissions and completion permit explicit unique metadata.
- Required tests: tests/unit/rules.test.ts; tests/e2e/lifecycle.spec.ts
- Executed evidence: tests/unit/rules.test.ts; tests/e2e/lifecycle.spec.ts
- Dependencies: Shared domain/services, simulated role policy D-016–026

## SET-004 — Deliberately reset synthetic data with confirmation and sign-out

- Module: Settings. Source: User complete-front-end instruction §§7–15; related PDF workflow (minimal role UI explicitly demo extension).
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/Settings.tsx; app/components/AppProvider.tsx; app/lib/commands.ts (preferences.save)`.
- Remaining behavior: None in tested synthetic workflow; see KNOWN_ISSUES for scope boundaries.
- Source acceptance: Incorrect phrase/noncoordinator blocked; coordinator RESET DEMO reinitializes coherent records; corrupt schema recovery explicit.
- Front-end acceptance: Incorrect phrase/noncoordinator blocked; coordinator RESET DEMO reinitializes coherent records; corrupt schema recovery explicit.
- Required tests: tests/integration/services.test.ts; tests/e2e/smoke.spec.ts
- Executed evidence: tests/integration/services.test.ts; tests/e2e/smoke.spec.ts
- Dependencies: Shared domain/services, simulated role policy D-016–026

## ROLE-005 — Minimal student demonstration lifecycle extension

- Module: Additional portals. Source: User complete-front-end instruction §§7–15; related PDF workflow (minimal role UI explicitly demo extension).
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/PortalPage.tsx; app/lib/commands.ts (scopedDatabase/role guards); app/components/Workspace.tsx`.
- Remaining behavior: None in tested synthetic workflow; see KNOWN_ISSUES for scope boundaries.
- Source acceptance: Own profile/requirements/available opportunities/application/placement/progress/evaluations; unrelated records denied.
- Front-end acceptance: Own profile/requirements/available opportunities/application/placement/progress/evaluations; unrelated records denied.
- Required tests: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/integration/services.test.ts
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/integration/services.test.ts
- Dependencies: Shared domain/services, simulated role policy D-016–026

## ROLE-006 — Minimal assigned faculty demonstration extension

- Module: Additional portals. Source: User complete-front-end instruction §§7–15; related PDF workflow (minimal role UI explicitly demo extension).
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/PortalPage.tsx; app/lib/commands.ts (scopedDatabase/role guards); app/components/Workspace.tsx`.
- Remaining behavior: None in tested synthetic workflow; see KNOWN_ISSUES for scope boundaries.
- Source acceptance: Assigned students/placements/documents/progress and own evaluation; unrelated modifications denied.
- Front-end acceptance: Assigned students/placements/documents/progress and own evaluation; unrelated modifications denied.
- Required tests: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/integration/services.test.ts
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/integration/services.test.ts
- Dependencies: Shared domain/services, simulated role policy D-016–026

## ROLE-007 — Minimal company supervisor demonstration extension

- Module: Additional portals. Source: User complete-front-end instruction §§7–15; related PDF workflow (minimal role UI explicitly demo extension).
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/features/PortalPage.tsx; app/lib/commands.ts (scopedDatabase/role guards); app/components/Workspace.tsx`.
- Remaining behavior: None in tested synthetic workflow; see KNOWN_ISSUES for scope boundaries.
- Source acceptance: Own company/assigned interns/progress remarks/own company evaluation; unrelated records and student files denied.
- Front-end acceptance: Own company/assigned interns/progress remarks/own company evaluation; unrelated records and student files denied.
- Required tests: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/integration/services.test.ts
- Executed evidence: tests/e2e/lifecycle.spec.ts; tests/e2e/auth.spec.ts; tests/integration/services.test.ts
- Dependencies: Shared domain/services, simulated role policy D-016–026

## FND-010 — Synchronize persisted state across modules/tabs and supported browser restart

- Module: Foundation. Source: User complete-front-end instruction §§7–15; related PDF workflow (minimal role UI explicitly demo extension).
- Classification: **Implemented and verified**. Deliverable: **PASS**.
- Implementation: `app/lib/domain.ts; app/lib/service.ts; app/lib/storage.ts; app/lib/integrity.ts; app/lib/commands.ts; app/components/ui.tsx`.
- Remaining behavior: None in tested synthetic workflow; see KNOWN_ISSUES for scope boundaries.
- Source acceptance: Normal reads never reseed; related names/totals update; reload/cross-tab/reopened Chromium profile retain saved data and valid session.
- Front-end acceptance: Normal reads never reseed; related names/totals update; reload/cross-tab/reopened Chromium profile retain saved data and valid session.
- Required tests: tests/e2e/maintenance.spec.ts; tests/e2e/restart.spec.ts; tests/integration/services.test.ts
- Executed evidence: tests/e2e/maintenance.spec.ts; tests/e2e/restart.spec.ts; tests/integration/services.test.ts
- Dependencies: Shared domain/services, simulated role policy D-016–026
