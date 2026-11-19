# Test plan

This plan describes future implementation gates. Actual Phase 0 executions are only in [TEST_REPORT](TEST_REPORT.md). `T-<requirement ID>` identifies the tests required for each inventory row; none of those future suites is claimed to exist now.

## Baseline and reproduction

Use Node/npm versions recorded in REPOSITORY_AUDIT and the existing lockfile. Run in a clean isolated copy/worktree when an existing Windows Next server locks SWC or `.next`; do not terminate unrelated processes. Commands: `npm ci --ignore-scripts --no-audit --no-fund`, `npm run lint`, `npm run build`, `npx --no-install tsc --noEmit`, and existing tests if available. Ignoring lifecycle scripts is the audited installation variant; if future dependencies require scripts, review and document them before changing it. Build before standalone typecheck to generate Next route types. Do not hide lint failures behind a successful build.

Browser: production `npm run start -- --port <free-port>`; fresh isolated synthetic browser context. Audit observation source is retained as text in `evidence/run-browser-audit.cjs.txt`; copy it to a temporary `.cjs` file to execute with externally installed Playwright. It records behavior and known failures, not an assertion-based regression suite. Preserve source commit/hash and distinct output directory on every rerun.

## Tests by layer

| Layer | Required coverage | Gate |
| --- | --- | --- |
| Unit | Trimmed required/unique fields; finite hours/dates; legal state transitions; ID joins; eligibility/slot/hour/evaluation/completion selectors after policy approval | Deterministic synthetic cases, edge/negative inputs and meaningful expected outcomes. |
| Component | Create/edit forms, rejection nonblank/cancel, disabled/double submission, error feedback, effective settings, labelled controls, dialog focus/Escape/return | User-level interactions; avoid assertions coupled to private implementation. |
| Demo adapter integration | Seed/FKs, read/create/update/decide/place/review, atomic rollback, duplicate/conflict/retry, reload, version/corruption/quota/reset, Blob reference integrity, multi-tab conflicts | New state visible across all consumers and after new browser/session reads; no silent reset. |
| API adapter contract | DTO validation/mapping, errors/cancellation, authorization/401/403/404/409/5xx, no demo fallback, idempotency | Same service contract cases where applicable; mocked API checks labelled mocks. Real backend checks separate and blocked until supplied. |
| E2E | Real routes in production build, scenarios A-D, requirements upload/review, reports, effective settings, direct URL permissions and reload | Seed/reset isolated per test; real outcomes and stored state checked, not merely success-message presence. |
| Accessibility/responsiveness | Associated labels, switch names/state, dialog keyboard, focus indication, zoom, viewport overflow, table scroll, collapsed/mobile nav | Automated checks plus keyboard/manual assistive technology review; headless width checks alone insufficient. |

Suggested lightweight tooling for later consideration: one unit/component runner with React Testing Library, IndexedDB test environment for storage, API request mocks, and Playwright for browser tests. Choose compatible versions from actual installed/tool documentation when implementing. No runner or library is installed into the application in Phase 0.

## Critical workflow acceptance

1. Authenticate permitted active coordinator; deny anonymous/inactive/wrong role and direct commands. Verify sign-out and own/assigned-record boundaries for related roles. Synthetic demo session must be labelled and separate from real backend auth.
2. Student create: invalid/whitespace/email/duplicates rejected; valid synthetic record saved, profile opens and directory/reload agree. Edit changes durable; canceled/failed writes preserve original. Existing search/filter/sort remains functional.
3. Partner create: required fields and uniqueness/MOA dates; profile → supervisor/account relation → opportunity create; all companies have correct scoped opportunities and placements. Test expiry boundaries after approved policy.
4. Requirements: master create/edit; correct student's checklist; file upload/preview persists; authorized approval/rejection with reason/reviewer; resubmission under approved rules; mandatory eligibility permutations.
5. Application: actual checklist and slot availability; pending → accepted updates header/list/history and placement form; pending → confirmed rejection retains reason. Deny invalid transition/unauthorized/ineligible/full capacity; repeat/conflicting requests do not oversubscribe.
6. Placement: readonly ID context from correct accepted application; required dates/hours/registered faculty/company supervisor; one placement per application; atomic save/ID/redirect and reload. Negative/zero hours and unrelated supervisors must fail. Multiple placements follow approved policy.
7. Progress: per-placement dated reports/tasks/hours; durable review with table/queue propagation; totals reflect approved counting and correction policy; 243/486=50%; invalid/overrun/missing/late cases; dialog keyboard access.
8. Evaluations: only assigned company/faculty actor, no third evaluation, approved rubric grade/comments/date; both submitted summary derived from actual records; internship completion/certificate only under approved wider predicate and actual issuance record.
9. Reports: all seven categories; term/company/status filters; results match module totals/hours/grades; approved export/print scope, escaping and privacy. Settings persist and affect year/default route/density/reminders/text/motion if approved.

## Environment matrix and release gates

Begin Chromium desktop and 390px mobile; add representative tablet, keyboard and zoom checks. Before handover include Firefox/WebKit and actual accessibility review. API tests need a synthetic test environment, reset protocol and nonproduction identities with each role/assignment. Never use real students as fixtures.

Per change run only relevant tests plus required lint/typecheck/build checks. Before final handover run fresh installation and all suites, compare requirements statuses, reconcile reports/data and perform a new route/link audit. Known failures are not acceptance passes. Capture command/commit/runtime versions, exit code, warning/error text, browser versions and skipped/blocker reasons. No numerical coverage target is invented; prioritize central rules, cross-page persistence and authorization over trivial rendering coverage.
