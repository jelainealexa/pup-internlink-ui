# Final release review

2026-11-20. **PASS for the verified browser-local front-end handover scope.** Originally reviewed **3698d8ddfd96cef39c80e1a18d127a45583a8cf3**, branch `frontend/interface-update`. Final tested application/test candidate **59a5a5f5210c5803f14bda7fca9a0499cbd4ff0e**. The final documentation/evidence commit is its descendant, identifiable with `git log`; it is intentionally distinguished from the application candidate. No push, merge, main change, backend implementation or owner-PDF modification.

**Independence assessment: UNVERIFIED for fresh context/personnel.** This root session contains implementation history and authored the repairs. New source/specification checks and negative tests challenged prior claims, but self-verification cannot be represented as a separate reviewer. The latest instruction authorized the final review; earlier postponement is superseded. Functional handover PASS does not certify personnel independence, production security or exact approved backend compatibility.

## Baseline and method

Verified the actual branch/HEAD/remotes and initially clean tracked tree; only two owner PDFs were untracked. Origin is https://github.com/jelainealexa/pup-internlink-ui. Main remains 2d846774c6dfbc61d675331145bd7b82b301e5a4. Original verified 5daa83a and incremental 7f2873a remain history. Next 16.4.6/React 19.3/TypeScript 5.9.3/Node 24.15.0/npm 11.12.1 and package/lock stack preserved. Installed Next client-boundary/layout/page guidance was consulted; no framework redesign or server endpoints added.

Both entire PDFs were read again: original 23 pages SHA-256 A8852A86F90EF6931D20B568F1E7EF3C86C000906520CB4F8BD5ABB0B7438458; updated 7 pages SHA-256 D471342919000A49DFEE9BF411336C1DCC58D63046F099E7141919D79EA3CADF. Text and 30 rendered pages are retained under evidence/final-review; the original page 23 flow is clipped by the page bounds, so its complete embedded image was extracted and inspected. Updated interfaces control explicit changes; old unchanged requirements remain. No approved ERD/API/rubric/assignment/provisioning specification was found.

Reviewed role/data/route guards, commands/updates, session/request handling, upgrade/storage/integrity, business/hour/posting selectors, changed feature controls and existing report/navigation behavior. Inspected assertions rather than trusting counts. Original 120 native tests passed in an isolated clean archive, despite new adversarial failures. Existing regression coverage supported unchanged functionality; additional risk-driven checks found six material partial defects. Initial findings and failures were committed before their respective repairs.

## Requirements reconciliation

All 131 tracked IDs and 42 delta rows reconciled. Original 94 IDs retained; 37 appended, 5 delta entries reuse existing IDs (AUTH, APP, EVA, PLC/PRG and FND mappings). No previously mandatory front-end requirement was removed. Current 126 scoped PASS, 1 external BLOCKED and 4 NOT APPLICABLE are decomposition units, not effort or exhaustive coverage percentages. Detailed row-by-row assessment: evidence/final-review/requirements-review.json and REQUIREMENTS_TRACEABILITY.

AUTH-004 is blocked only for approved institutional provisioning agreement; local pre-registration/invitation/activation/account linking is working and tested. Exclusions are STU-009 explicitly optional directory export (student report CSV exists); OPP-006 unspecified deadline/program restrictions (required modality/location/hours are delivered under IU-007); ROLE-004 self-evaluation absent from both specs and inconsistent with the two-obligation scope; FND-009 actual backend/database integration explicitly outside this delivery. Exact backend compatibility remains UNVERIFIED, not a failed front-end feature.

The previous 126-PASS claim was insufficient: affected account/session, intern navigation, summary, activation, rendered-sort and report rows required repair. Source acceptance remains traceable to both PDFs and reversible policies, not fabricated institutional approval.

## Initial findings and focused repairs

First five findings against 3698d8d were preserved in a3e370f. Additional FR-06 was first reproduced at fef06b8 on report code inherited unchanged from 3698d8d; 656b7b0 preserves it. Initial aggregate 0 critical/0 high/6 medium/0 low. Final 6 Fixed, 0 Open. Original 16 findings remain separate historical records.

| Finding | Severity | Original observed defect | Focused repair / verification |
| --- | --- | --- | --- |
| FR-01 | MEDIUM | Faculty activation leaves version unchanged; all three administrative email edit paths retain the old version and request. Prior session still returns account; old reset request succeeds with the changed email. | Apply shared revocation on changed administrative email or activation state, preserving harmless profile-only edits. Fixed; repair-native.json; final-review.test.ts account cases |
| FR-02 | MEDIUM | Directory filters Student.academicYear and shows 1, omitting Mira despite current assigned placement. | Use placement year for interns=true while retaining ordinary student-directory cohort filtering. Fixed; repair-browser.txt FR-02; final-review.spec.ts |
| FR-03 | MEDIUM | Card labeled Active internship opportunities displays 1 using availability and available=true. Original available summary was relabelled, not retained separately. | Count derived Active posting state with status filter; retain original Available opportunities card separately. Fixed; repair-browser.txt FR-03; maintenance17 cards and destinations |
| FR-04 | MEDIUM | Activation succeeds and writes Active despite documented current-MOA prerequisite. Student availability independently still blocks applications. | Enforce existing documented eligibility on activation using the service clock; retain deactivation and historical records. Fixed; repair-native.json FR-04; new activation guard uses service clock |
| FR-05 | MEDIUM | Only Approved Hours column/sort is exposed; hours sort computes approved, not rendered, despite STU-004 marked PASS. | Restore rendered column and hours sort; retain approved display/sort as separate choices with independent oracle. Fixed; repair-browser-hours.txt; independent-matrix student rendered/approved sorts |
| FR-06 | MEDIUM | Filled report returns 0 rows because filter/export use persisted Active; UI has old PendingApproval/Closed but no new stage/Filled/Deactivated choices. | Use shared postingStatus for filtering/export; add current state options and retain grouped pending/legacy closed compatibility. Fixed; report-state-after.txt; report-browser-after.txt actual filtered CSV |

Full reproduction, expected/observed behavior, impact, locations, requirement references, initial evidence and current repair commits are in DEFECT_REGISTER and findings-disposition.json. FR-01–05 repairs 54e9a11; fef06b8 strengthens both hour-order assertions; FR-06 repair 59a5a5f. No broad refactor, dependency change, schema reset or unrelated feature. Shared revocation centralizes existing behavior; report status now uses the existing selector.

## Portal, account and workflow assessment

All five roles use the same persistent services. OJT Coordinator retains original modules and official placement/completion/report authority plus faculty/account/posting controls. Faculty is scoped to current assignments for documents and its placement/evaluation responsibilities; historical visibility does not grant new document review. Company Supervisor administers only its company/postings/Intern accounts/assignments and cannot make Intern application/progress/evaluation decisions. Intern Supervisor sees assigned opportunities/applicants/relevant Before documents and assigned placements; student reads/actions remain own records. Both routes and service operations enforce supported restrictions; these are not a production security boundary.

Account tests exercise valid/invalid/inactive login, show/hide, scoped pre-registration, invitation regeneration/mismatch/expiry/use, existing-account activation, local reset, confirmation, old credentials, duplicate email/ID, deactivation and session version revocation. Administrative email/activation changes now revoke outstanding requests as well as session versions. Dormant-session cases use separate native session stores; actual same-account browser tabs revoke together after password change. Storage persists verifiers/fingerprints rather than newly entered plaintext passwords. All links are explicitly local demonstrations; no email delivery is claimed.

Posting journeys cover company/coordinator decisions, rejection remarks/history, resubmission, activation, material-edit reapproval, capacity/eligibility and visibility. Explicit activation enforces the existing current-MOA policy. Active state and Available eligibility are separate; natural MOA expiry does not delete history. Reports and CSV use derived Filled and current approval/deactivation states. Company/adviser/Intern metrics and filtered links are checked against saved records, including the 17 coordinator cards and cross-cohort intern directory.

Applications are shared single terminal decisions with identity/time/remarks; documented coordinator oversight remains a reversible policy, not institutional approval. Accepted application does not automatically create placement. Placement creation rechecks accepted state, unique application/student ongoing placement, Before requirements, dates/hours, active faculty, correct-company assigned Intern and capacity atomically. Negative/repeated operations preserve state. Exactly two evaluation obligations remain.

Requirements cover Before/During/After master phases and tabs, actual file storage/retrieval, authorized review/rejection reasons, immutable attempts/files and resubmission. Only Before mandatory approvals gate initial placement; all currently mandatory phase IDs frozen at placement creation gate completion. Current adviser review scope and applicant-only Before access are tested. The two evaluation obligations retain assigned faculty/Intern identity, grade/comments/date/history and duplicate/third/unassigned restrictions; completion and certificate metadata stay coordinator-controlled.

Attendance/weekly journeys independently calculate rendered, approved, remaining and percentage totals. Attendance supplies rendered work; weekly approval supplies approval once. Rejected/resubmitted attempts preserve history without duplicate work or approval. Legacy daily reports cannot overlap attendance; fractional sums and overrun/zero/negative/date guards remain. Faculty remarks are separate history and never add approved hours. Original rendered-hour directory display/sort is restored alongside approved hours. Pending work cannot incorrectly satisfy official approved-hour completion.

## Genuine version-one upgrade and persistence

Frozen seed.ts/domain.ts are byte-for-byte from 5daa83a, not down-converted updated seed. Native and actual-browser tests install that legitimate initial snapshot before application startup, then exercise the real upgrade. IDs, related records, credential verifiers, original official hour totals, evaluations/certificates and actual downloaded attachment bytes are checked. Old operational supervisors become Interns; no administrator is invented. Coordinator explicitly provisions an administrator through the documented company-profile UI, then that account logs in. Repeated reads/reloads are stable; injected failed upgrade write leaves the raw original version-one snapshot intact. Schema remains2; no new upgrade/reset requirement.

Refresh, navigation, same-origin tabs and persistent Chromium profile reopen pass. Existing schema/reference/file checks, readonly reads/retry, explicit recovery/reset and failed-session-clear protections remain. Original 16 findings all VERIFIED FIXED at their tested boundaries; none regressed. DEFECT_REGISTER maps each to fresh native/browser evidence. Browser-local data has no cross-device/shared-server/eviction-durability guarantee.

## Executed acceptance journeys

| Journey | Executed evidence |
| --- | --- |
| A Activation | interface-update A–B; final account native adversaries/concurrency and browser tab revocation |
| B Posting | interface-update C–H company/coordinator rejection/approval/activation; FR-03 metrics; FR-06 report states |
| C Assignments | interface-update faculty/Intern provisioning and opportunity assignment; production-review additional reassignment workflow with preserved evaluation IDs and denied former-supervisor access |
| D Application/placement | full updated and original fractional lifecycles; native duplicate/last-slot/affiliation/stale assignment guards |
| E Phased documents | updated C–H three phases/reject/resubmit/approve; real TXT/PDF/PNG/JPEG downloads in existing lifecycle |
| F Attendance/progress | updated weekly rejection/resubmission/approval/separate faculty remarks; native concurrent approval/attendance and exact fractional totals |
| G Evaluations/completion | updated and fractional lifecycle, two assigned evaluations then guarded completion/certificate; production reassignment/evaluation freeze |
| H Reports/credentials/persistence | seven-category reports/CSV formula escaping/print-media; FR-06 actual filtered CSV; settings, restart, multi-tab credential changes |
| I Genuine old data | final-review native two original-seed upgrade/rollback cases and actual-browser attachment/admin provisioning journey |

No acceptance end state was manufactured by editing storage. Fixtures establish legitimate initial empty/corrupt/legacy conditions; browser lifecycle mutations use UI, with readonly persisted-state checks.

## Final technical evidence

Clean candidate source/config/tests verified against git archive59a5a5f in an isolated workspace; no user files/data used. The final dependency install uses the original lockfile and installs427 packages. Final commands/gate exit codes: candidate-gates.json; exact outputs candidate-*.txt/json. Application build and E2E production startup are real, not mocked screenshots.

| Gate | Actual result |
| --- | --- |
| npm ci --ignore-scripts --no-audit --no-fund | PASS exit 0; 427 packages; install lifecycle scripts intentionally not executed |
| npm run lint | PASS exit 0 |
| npm run typecheck | PASS exit 0; installed Next typegen and tsc --noEmit |
| npm test | PASS 130/130, 10 files:55 unit/5 component/70 integration; 0 failed/skipped |
| npm run build | PASS exit 0 |
| npm run test:e2e | PASS 49/49, 46 desktop/3 mobile Chromium; 0 failed/skipped/flaky; 226.213s |
| Separate production startup | PASS 10 HTTP/route/auth/module checks, 0 page errors; own server process stopped |
| Additional production assignment journey | PASS 7 recorded workflow steps; not counted as extra suite test cases |

Original 120 native/43 browser cases retained, 10 native/6 browser added. No meaningful assertion removed. Failures remain: initial native 6 failed/2 passed; initial browser hypothesis count/selector mistakes plus actual defects; first repair target 6/7 until public-vs-internal-ID selector correction; phase-one full 47/48 due obsolete approved-order expectation, then 48/48 after checking both orders. Subsequent report-state reproducer failed 1 native (9 deliberately filtered/skipped) and 1 browser before repair. Final unfiltered 130/49 has no skipped tests. Counts are not proof of exhaustive coverage.

Warnings/limits: inherited ESLint 9.39.5 deprecation; browser NO_COLOR/FORCE_COLOR notices. No dependency security certification. Selected axe/keyboard/mobile/print-media checks do not certify full WCAG/manual screen reader, Firefox/WebKit, physical printing/native PDF viewers, OS quota/eviction endurance or parallel scheduling beyond configured one worker.

## Readiness

All PASS entries below are limited to verified synthetic browser-local behavior and documented reversible policies.

| Deliverable | Verdict |
| --- | --- |
| OJT Coordinator portal | PASS |
| Student portal | PASS |
| Faculty Adviser portal | PASS |
| Company Supervisor portal | PASS |
| Intern Supervisor portal | PASS |
| Account lifecycle | PASS |
| Demonstration authentication | PASS |
| Role restrictions | PASS |
| Posting approval | PASS |
| Application decisions | PASS |
| Faculty and supervisor assignments | PASS |
| Phased requirements | PASS |
| Placement management | PASS |
| Attendance | PASS |
| Progress approval | PASS |
| Hour calculations | PASS |
| Evaluations | PASS |
| Completion and certificate metadata | PASS |
| Reports and settings | PASS |
| Existing-data upgrade | PASS |
| Data consistency | PASS |
| Data persistence | PASS |
| Previous16 defect regressions | PASS |
| Automated native tests | PASS |
| Browser verification | PASS |
| Production build | PASS |
| Documentation | PASS |
| Backend integration readiness (typed seam/proposed contracts) | PASS |
| Exact approved backend compatibility | UNVERIFIED |
| Front-end handover readiness | PASS |
| Fresh-context/personnel independence | UNVERIFIED |
| Institutional provisioning-policy approval (AUTH-004) | BLOCKED |
| Actual backend/database/production security certification | NOT APPLICABLE |

## Backend responsibilities and handover

Typed interfaces/data contracts and the isolated demo/API boundary are ready for receiving developers; proposed endpoints remain proposals. No actual backend, database, migrations, production authentication/authorization/email/reset/private storage/deployment or security certification is delivered. Exact approved ERD/API compatibility is UNVERIFIED. Backend team owns secure hashing/tokens/email/session revocation, all read/file/write permissions, schema/keys/constraints, transactional capacity/status/assignment/history/idempotency/concurrency, private file validation/storage and full-stack integration tests. Never silently fall back to demo data after API failure.

Institutional provisioning/adviser scope/reassignment, coordinator decision oversight, submitted-vs-approved phase eligibility, MOA thresholds, slot reservation/completed consumption, attendance/report correction/frequency/precision, grading/completion/certificate authority remain explicitly reversible assumptions (BUSINESS_RULES D-043–056). No rule is silently presented as an approved institutional ERD fact.

README/HANDOVER provide Node 24/npm 11 prerequisites, install/dev/build/start, 13 synthetic accounts/public password, pending student activation, deliberate version-one admin provisioning, no-reset upgrade and confirmed RESET DEMO behavior. DATA_MODEL/API_CONTRACT/BACKEND_INTEGRATION_GUIDE explain replacement. Complete source/package/lock/tests/documentation are committed; node_modules/build/test-results/private files remain ignored. Both supplied PDFs remain unchanged/untracked; no need to reset saved demo data.

Publication is prepared only, not performed:

```powershell
git push --set-upstream origin frontend/interface-update
```

Final repository HEAD is the documentation/evidence descendant of the tested candidate, printed in the final response and `git log`. Tracked work should be clean apart from preserved untracked owner PDFs. No merge/main modification, force-push or production release. A truly fresh-context/personnel-independent certification cannot be supplied by this same session; targeted re-review of the six repairs is appropriate if such independence is required.
