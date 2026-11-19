# Reproducible front-end test plan

Run with Node 24 / npm 11 using the committed lockfile. `npm ci --ignore-scripts` is the verified install variant. Preserve the supplied PDF and pre-existing dev processes. Automated fixtures use only synthetic data and isolated IndexedDB databases/browser contexts.

| Gate | Command / meaningful assertions |
| --- | --- |
| TypeScript | `npm run typecheck`: Next route type generation and tsc --noEmit. |
| Lint | `npm run lint`: Next core-web-vitals and TypeScript flat config, no product rules disabled. Generated output directories ignored. |
| Unit | `npm run test:unit`: fields/dates/numbers, partnership boundaries, slot/hours/completion math, seed relationships, report totals/CSV injection and evaluator restrictions. |
| Component | `npm run test:component`: labelled required fields, error focus/input preservation, pending repeated-submission guard, success only after promise resolves. |
| Integration | `npm run test:integration`: service auth/scope, real IndexedDB adapter and Blob bytes, rollback/revision/idempotency, cross-instance persistence, application/placement/race/termination/review/reset. |
| Combined | `npm test`: all three Vitest suites. |
| Production build | `npm run build`; custom INTERNLINK_DIST_DIR supported to preserve existing server locks. |
| Browser E2E | `npx playwright install chromium`, `npm run test:e2e`: fresh production build/start on 3105, desktop and390px mobile Chromium. |
| Clean install | Archive the implementation checkpoint to a new temp directory, npm ci --ignore-scripts, lint/typecheck/tests/build. No recursive delete of user's workspace. |

## Mandatory workflows mapped to browser tests

| Workflow | Executable evidence |
| --- | --- |
| A Authentication | auth.spec.ts: invalid/inactive/valid, wrong role/direct URL/unrelated records, logout; integration tests expiry. |
| B Student | lifecycle.spec.ts: register/search/profile/edit/reload/duplicate rejection. |
| C Partner | lifecycle: company → supervisor → opportunity, approval and related records; maintenance edits propagate. |
| D Requirements | lifecycle: definition → actual synthetic TXT file → blocked blank reason → reject → resubmit → approve → checklist. Download bytes also verified in maintenance. |
| E Application | lifecycle and guards: own student apply, checklist/availability, acceptance and persistent rejection history; missing approvals blocked. |
| F Placement | lifecycle and guards: accepted context/prepopulation, assignments/dates/hours/review/create, refresh/duplicate/wrong-company/date/hour/capacity negatives; last-slot concurrency integration. |
| G Progress | lifecycle: submit as student, assigned faculty review, exact hours/remaining/100%, refresh and related placement/student/report views. |
| H Evaluations/completion | lifecycle: assigned faculty and supervisor submit, wrong evaluator UI denied, completion then explicit certificate metadata. Unit tests duplicate/third/unassigned/invalid score. |
| I Reports | smoke: all seven categories, real rows/empty filters, CSV download/print invocation and print CSS; lifecycle checks filtered CSV content/exclusion/totals. |
| J Full lifecycle | lifecycle.spec.ts follows all supported screens with role switching; no underlying storage edits bypass workflow steps. |
| Regression | maintenance: company/supervisor/opportunity/requirement editing, rapid URL filters/reset/sort, back/forward, default year/landing, BroadcastChannel cross-tab changes. restart.spec.ts closes/reopens an actual persistent Chromium profile. |
| Usability | smoke: all concrete route variants, invalid identifiers, login/settings axe zero violations, dialog Escape/focus restoration, larger text/motion/density, horizontal-overflow checks and mobile screenshots. |

Tests assert actual persisted results and relations, not just visible button labels. Service/unit tests may construct isolated fixtures to test invalid records; browser acceptance tests never manipulate saved data to bypass prerequisite steps (DOM select tampering tests a rejected affiliation). Print tests intercept window.print and emulate print CSS; they do not certify a physical printer or every browser's pagination.

Independent verification still recommended: Firefox/WebKit, screen-reader/manual keyboard sweep of every form, large datasets/quota exhaustion/OS storage eviction, real backend contract/security/concurrency and institutional policy approval. Current evidence is not a production security or universal accessibility certification.
