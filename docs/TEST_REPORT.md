# Final updated-release test report

2026-11-20. Originally reviewed 3698d8d; final tested application/test candidate **59a5a5f5210c5803f14bda7fca9a0499cbd4ff0e** on frontend/interface-update. Functional handover PASS within synthetic browser-local scope. This root session has implementation history and authored repairs; fresh-context/personnel independence is UNVERIFIED. Historical reports below are retained as results of their own versions, not current evidence.

## Final actual gates

Windows PowerShell, Node 24.15.0/npm 11.12.1, Next 16.4.6/React 19.3/TypeScript 5.9.3. A unique isolated workspace was initialized from git archive; final application/tests/config were refreshed byte-for-byte from 59a5a5f and a fresh lockfile installation rerun. Source manifest and paths: evidence/final-review/candidate-source-check.json/final-clean-workspace.json. Root node_modules, existing servers and user demonstration data were preserved. No install lifecycle scripts executed under the requested ignore flag.

| Exact command | Actual result | Evidence in evidence/final-review |
| --- | --- | --- |
| npm ci --ignore-scripts --no-audit --no-fund | PASS exit 0; 427 packages | candidate-install.txt; candidate-gates.json |
| npm run lint | PASS exit 0, no lint diagnostics | candidate-lint.txt |
| npm run typecheck | PASS exit 0, Next typegen + tsc --noEmit | candidate-types.txt |
| npm test -- --reporter=default --reporter=json --outputFile=.../candidate-native.json | PASS 130/130, 10 files; 55 unit/5 component/70 integration; 0 failed/skipped | candidate-native.txt/json |
| npm run build | PASS exit 0 | candidate-build.txt |
| npm run test:e2e | PASS 49/49, 46 desktop/3 mobile Chromium; 0 failed/skipped/flaky; 226.213s | candidate-browser.txt/json |
| node .../production-review.cjs.txt | PASS 10 startup/HTTP/auth checks; 0 page errors, plus 7-step assignment journey | production-smoke.txt/json; production-start.txt |

Full unabridged command paths/exit codes/times are in candidate-gates.json. Playwright automatically builds .next-e2e and starts real production on 3105; production smoke starts the separate .next build on3127 and stops only its owned process. The Windows evidence utility uses the clean workspace's installed Playwright. Browser executable override actually used:

```powershell
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='C:/Users/User 1/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe'
npm run test:e2e
```

Standard receiving-team setup may install Chromium with npx playwright install chromium; that download is not claimed as executed in this review. The separate smoke command sets INTERNLINK_REVIEW_EVIDENCE to the root evidence directory and INTERNLINK_REVIEW_COMMIT to59a5a5f before running production-review.cjs.txt in the clean workspace.

## Test credibility, additions and failures

Original 120 native/43 browser cases retained. Added 10 native cases in tests/integration/final-review.test.ts and 6 browser cases in tests/e2e/final-review.spec.ts. No assertion/test was removed to obtain a pass. New coverage includes administrative revocation (four session cases plus recovery link), current-MOA activation, genuine original-seed migration/rollback, transaction concurrency/retry/stale assignment, new posting reports/CSV, cross-cohort My Interns, distinct Active/Available counters, rendered/approved directory hours, actual-browser genuine upgrade/admin provisioning and multi-tab password revocation.

Fresh suite split: 47 rules+8 session=55 unit; 3 forms+2 independent forms=5 component; 21 services+21 prior audit+8 interface update+6permissions+4 interface upgrade+10 final review=70 integration. Real fake-indexeddb transactions/Blobs and actual production browser UI/persisted-state assertions are used. Frozen seed/domain copied from 5daa83a establish genuine version-one initial data; acceptance workflows do not edit storage to bypass steps. The standalone assignment journey exercises company-admin provisioning/opportunity assignment/placement reassignment, retained report and 2 evaluation IDs, former supervisor denial, new supervisor approval/evaluation and submitted-evaluation freeze. These7 recorded steps are not extra suite test cases.

Failures preserved before repairs:

- Original clean candidate120/120 passes; new adversarial8-case run 6 fails/2 passes, demonstrating gaps in former coverage. Initial findings and exact logs remain in initial-findings.json/initial-adversarial-confirmed.*; earlier7-case run 5 fails/2 passes also retained.
- First browser repro had an incorrect1-vs2 expected total for a supervisor with an ongoing and completed intern; corrected expected2 then reproduced actual2-vs1 directory omission. FR-03 metric and FR-05 missing rendered column are genuine failures. Initial browser/hours logs retained.
- First repair target 6/7 passes; the remaining test selector confused internal ID with displayed public student number after the real rendered column was restored. Correcting the selector gives1/1 targeted pass.
- First clean full browser run 47/48 retains an old expectation of approved ordering for sort=hours. Preserve that assertion under explicit approvedHours and additionally assert rendered order. Phase-one full48/48 then passes. No sort assertion weakened.
- Further FR-06 investigation finds old report enums/raw Active status. report-state-before has 1 failed/9 deliberately filtered skipped; report-browser-before fails missing Filled option. Both pass after shared status/filter/CSV repair. Final unfiltered 130/49 has 0skips.

Historical/failed phase evidence retained as phase1-*, candidate-*-first.*, report-*-before.*, repair-*. Scope-specific failures/skips are not counted as successful final tests. Six medium findings are Fixed; original 16 regression assertions execute again. Reports/DEFECT_REGISTER record original vs repaired commits and self-verification.

Warnings: inherited ESLint 9.39.5 deprecation during install; NO_COLOR ignored when FORCE_COLOR is set in browser workers. No dependency security certification. Clean lockfile installation/build/runtime succeeded with scripts ignored. Firefox/WebKit, exhaustive manual screen reader/WCAG, physical printer/native PDF plug-in, real OS quota/eviction endurance and parallel scheduling outside configured1 worker remain unverified. Actual backend/database/email/security are outside this front-end delivery.

---

## Historical incremental and original verification evidence

# Interface-update test report

2026-11-20, internal implementation verification. Source/test checkpoint **7f2873a60160060bae8140c0769e7545a3aa3154**, branch frontend/interface-update; original baseline5daa83a. Windows PowerShell, Node 24.15.0/npm 11.12.1, Next 16.4.6/React 19.3/TypeScript 5.9.3. Evidence directory: [interface-update](evidence/interface-update). Prior independent reports below remain historical; no postponed final independent review or production security certification was performed.

| Gate / exact command | Actual current result | Evidence |
| --- | --- | --- |
| `npm run typecheck` | PASS, exit0, Next typegen + tsc --noEmit | final-types.txt |
| `npm run lint` | PASS, exit0, no ESLint errors/warnings | final-lint.txt |
| `npm test -- --reporter=default --reporter=json --outputFile=docs/evidence/interface-update/final-vitest.json` | PASS120/120,9 files,0 failed/skipped:55 unit/5 component/60 integration | final-vitest.txt/json |
| `npm ls --depth=0` | PASS exit0;2 inherited optional build packages marked extraneous | dependencies.txt |
| Targeted updated+legacy journeys (`npm run test:e2e -- tests/e2e/interface-update.spec.ts tests/e2e/lifecycle.spec.ts tests/e2e/independent-lifecycle.spec.ts --reporter=list --output=test-results/updated-journeys`) | PASS4/4, actual production app;2.8min | browser-journeys.txt |
| Targeted metrics/maintenance (`npm run test:e2e -- tests/e2e/interface-dashboard.spec.ts tests/e2e/maintenance.spec.ts --reporter=list --output=test-results/interface-metrics`) | PASS7/7;48.6 sec | metrics-browser.txt |
| First full `npm run test:e2e` |41 pass/1fail,7.3min; stale14-card assertion versus16 required cards, corrected without removing destination checks | regression-browser-first.txt |
| Final full `npm run test:e2e` | PASS43/43 (40 desktop/3 mobile),0 failed/skipped/flaky;356.208 seconds | final-browser.txt; final-e2e.json |
| `$env:INTERNLINK_DIST_DIR='.next-interface-release'; npm run build` | PASS exit0; compilation14.8s, TypeScript 20.5s,31static pages generated | final-build.txt |
| Separate production startup | PASS; separate production 3127,5HTTP200 and5 browser checks,0page errors | production-smoke.txt/json; production-start.txt |
| New dependency install | NOT APPLICABLE: package/lock unchanged, existing dependencies used and checked | dependencies.txt; git diff package files |

Chromium override used in actual runs:

```powershell
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='C:/Users/User 1/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe'
npm run test:e2e
```

Separate built-app smoke command actually executed: `node docs/evidence/interface-update/production-smoke.cjs.txt`. Its reproducible script starts the isolated release build on3127, checks5 HTTP routes and5UI/auth/module behaviors, captures errors/results and stops only its owned process tree. `production-smoke.json` records10successful checks. The explicit build temporarily added custom-dist TypeScript includes; only those generated local includes were restored to the committed tsconfig afterward. Application/test source remains7f2873a.

Playwright's existing launcher builds isolated .next-e2e and starts production 3105, preserving other servers. All original 40 browser cases are retained; new interface-update2 and interface-dashboard1 produce43 cases (40 desktop/3 mobile). Three large lifecycle cases cover many steps; raw test count is not a completeness percentage. Browser journeys use synthetic UI steps and role switching, with readonly persisted-state assertions; they do not edit storage to bypass approval/activation.

## Native suite credibility and additions

| Suite | Cases | Purpose |
| --- | --- | --- |
| unit/rules |47 | Original eligibility/relationships/hours/grade/report/CSV rules, unchanged case count; labels updated to rendered/approved. |
| unit/session |8 | Original storage/session/expiry/error behavior. |
| components/forms + independent-forms |3+2 | Original accessible async save/error/option preservation behavior. |
| integration/services |21 | Original real IndexedDB service/persistence/Blobs/revision/idempotency/rollback/authorization cases. |
| integration/independent-audit |21 | All 16 previous repair regressions plus edge/data-volume checks retained. |
| integration/interface-update |8 | New activation/invitation/password reset/credential and content-bound public retries; assignments/role separation/staged posting/phases/weekly calculations. |
| integration/interface-permissions |6 | Cross-company/role denies; account deactivation, evaluator-preserving reassignment, posting stage reasons, invalid attendance/authorization atomicity, stale adviser scope, unchanged material-save policy and bound daily replacement. |
| integration/interface-upgrade |4 | Native version 1 upgrade preserves IDs/files/verifiers/placements/evaluations/hours; failed write rollback; request expiry and atomic credential failure. |

Original 102 remain;18 new integration cases give120. Tests exercise actual implementation and native fake-indexeddb transactions, inspect stored objects/Blob bytes and compare snapshots after denied operations. Upgrade tests construct a valid legacy fixture, not an intended final lifecycle shortcut. No skipped tests or weakened assertions are claimed successful.

## Superseded expectations and retained failure evidence

- Legacy Company Supervisor is operational Intern Supervisor; relevant Before applicant documents are now permitted while unrelated phase/student files remain denied. New progress approval belongs to assigned Intern rather than coordinator/faculty. Schema-reset expectation is version 2. All 21 original service cases remain.
- Newly registered students require real UI invitation/activation before login. New postings require actual company decision/assignment→coordinator decision→company activation. Original lifecycle tests keep their file/duplicate/placement/hour/CSV assertions and now exercise these prerequisites using update-helpers.
- Directory matrix independently computes Active/Filled/staged/Eligible statuses, new location/modality/hours and activation/adviser filters from saved records. Former Reviewed/Pending Review expectations map to Approved/Pending. Report display totals use rendered/approved terminology. Coordinator metric count changes14→16, retaining checks for every destination count.
- Early target failures were harness issues: invitation regeneration was read before the new saved link arrived; notice exact text included a Dismiss button; the dialog accessible name is Close dialog; a synthetic work date overlapped seeded daily work; initial seed revision was normalized to0 while real upgrades increment. Failed logs foundation-tests/browser-first/second/third/regression-first remain evidence, followed by passing reruns. No product failure is silently counted as passing.
- Fingerprint/revision/reset/file-integrity/clock/precision/contextual navigation/empty-state tests are retained. New public requests use namespaced content-bound receipts: same key/intent is retry-safe without another write; changed intent conflicts; used token under a new key fails.

## Verification limitations

No fresh clean install repeated the prior complete audit because dependencies/lock are unchanged. Existing installed graph/build/runtime are actually exercised. Browser messages warn NO_COLOR is ignored when FORCE_COLOR is set; no product warning is hidden. Inherited ESLint deprecation/optional extraneous build dependencies remain documented maintenance limits, not waived errors. Exact final build/runtime outputs are retained.

Firefox/WebKit, exhaustive manual screen reader/WCAG, physical printer/PDF native viewer, true OS quota exhaustion/eviction endurance, secure email delivery, real backend/database/API/security and multi-device synchronization are not tested/certified. The version-one upgrade fixture matches the former contracts; arbitrary unsupported manually altered snapshots are rejected rather than guessed. This is internal verification by the implementation agent, not an independent review.

---

## Historical previous-release evidence (unchanged results)

# Executed release candidate test report

Reviewed **7ca502cc6260232619570b2ee945da5f5c13145b**; application repair **dcad283780f3b7ab3ca2ee25c792924d695106a5**; original **d71e7265dbb2d136a0ea7f5f08c13e6b24278ba2**. Windows/Node24.15.0/npm11.12.1. Results below actually executed; repair verification is by its author. Historical implementation report follows separately.

| Gate | Actual result | Evidence under docs/evidence/independent |
| --- | --- | --- |
| Original clean baseline |ci/lint/typecheck/79tests/build exit0; original18browser pass |baseline-clean-*; baseline-e2e* |
| Unit |55/55 (47 rules,8 session) |candidate-vitest.json/text |
| Component |5/5 (3 shared forms,2 independent options) |candidate-vitest.json/text |
| Integration |42/42 (21 existing,21 independent native adapter) |candidate-vitest.json/text |
| Combined Vitest |102pass,0failed/skipped,6files |candidate-gates.json; candidate-vitest.json/text |
| ESLint |exit0,0errors/warnings |candidate-lint.txt; candidate-gates.json |
| TypeScript |next typegen +tsc --noEmit exit0 |candidate-typecheck.txt; candidate-gates.json |
| Production E2E |40pass,0failed/skipped/flaky;37desktop/3mobile;301.164s |candidate-e2e.json/text/exit.txt |
| Repeated stale-student regression |3/3 same assertions/timeouts |foreground-repeat.txt/exit.txt |
| Dashboard oracle |14cards+5progress values match raw saved data |dashboard-oracle.json/text/cjs.txt |
| Clean repair archive |427 packages; ci/lint/typecheck/102tests/build/npm ls all0 |candidate-clean-*.txt/results.json |
| Development startup |isolated3119 HTTP200/login/dashboard |development-start.txt |
| Production startup/routes |actual next build/start on3105; valid/invalid/history/refresh |E2E build/launcher output and smoke/matrix/independent suites |

Exact commands executed in appropriate workspaces/shells:

~~~powershell
npm ci --ignore-scripts --no-audit --no-fund
npm run lint
npm run typecheck
npm test -- --reporter=default --reporter=json --outputFile=docs/evidence/independent/candidate-vitest.json
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='C:/Users/User 1/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe'
npx playwright test tests/e2e/independent.spec.ts --grep IV-10 --repeat-each=3 --project=chromium --reporter=list --output=test-results/foreground-repeat
npm run test:e2e
npm run build
npm ls --depth=0
~~~

Clean archive: git archive dcad283 into C:/Users/User 1/AppData/Local/Temp/internlink-independent-dcad283, fresh npm ci. Final7ca502c differs only in foreground browser interactions/decision; app/package/lock/unit files identical. Explicit --ignore-scripts means no install lifecycle scripts ran; actual build/runtime succeeded. README normal npm ci is standard setup, not a claim every postinstall environment was separately tested. Development command: node node_modules/next/dist/bin/next dev --port 3119 --hostname 127.0.0.1 with INTERNLINK_DIST_DIR=.next-audit-dev. Generated temporary includes removed. E2E builds .next-e2e then starts production3105; browser executable override is machine-specific, receiving developers can install Chromium normally.

Failures are preserved: initial adversarial/component/browser defects before repairs; early wrong year/selector/lint harness attempts; expanded96/100/102 unit runs and21/15/39browser runs. The exploratory npm run test:e2e -- --workers=2 finished39pass/1failure: a hidden-tab first-save navigation wait. Snapshot/trace show saved email/success/HTTP200 RSC responses. Foregrounding before interaction corrects unrealistic background interaction; all persisted values/conflict/retry assertions and timeouts retained. Target3/3 then configured full40/40 pass. Parallel scheduling/performance remains UNVERIFIED; see parallel-probe-e2e.json/text/context and parallel-navigation-trace.json. No failure/skipped test counted as passed.

Warnings retained: ESLint9.39.5 deprecated; optional @emnapi/runtime1.11.3/@img/sharp-wasm32@0.35.5 extraneous after build though npm ls0; NO_COLOR ignored when FORCE_COLOR set. No checks disabled/dependency security certification claimed. Actual TXT/PDF/PNG/JPEG bytes, decoded images, escaped TXT markup, filtered CSV formula/comma/quote/newline bytes and print invocation/media styles verified. Native PDF plug-in/physical printing/Firefox/WebKit/manual AT/OS quota exhaustion remain unverified. Actual backend/database/security out of scope.

# Historical implementation test and build report

Date: **2026-11-19**, Windows / Asia-Manila. Implementation checkpoint **251410a697333dd08a5a11fa4f6b6f4f6e90e72a**, branch **frontend/complete-demo**. Subsequent changes are documentation/evidence only. No backend integration or production security certification is claimed.

## Final results

| Deliverable | Verdict | Actual result / evidence |
| --- | --- | --- |
| Dependency/lockfile verification | PASS | `npm install --package-lock-only --ignore-scripts --no-audit --no-fund` exit 0; fresh archive `npm ci --ignore-scripts --no-audit --no-fund` exit 0, 427 packages added. |
| TypeScript | PASS | `npm run typecheck` exit 0; Next route type generation followed by `tsc --noEmit`. Workspace and clean archive. |
| ESLint | PASS | `npm run lint` exit 0; no lint errors/warnings. Workspace and clean archive. |
| Unit | PASS | **55 tests**: rules 47 + browser-session 8. |
| Component | PASS | **3 tests**: associated labels, preserved input/error focus, pending dedup and genuine asynchronous success. |
| Integration | PASS | **21 tests**: service plus actual fake-indexeddb transactions/Blob persistence, auth/scoping, races/rollback/revisions/duplicates and lifecycle rules. |
| Combined Vitest | PASS | **79 passed, 0 failed, 0 skipped; 4 files**. `npm test -- --reporter=default --reporter=json --outputFile=docs/evidence/development/vitest.json`. Fresh archive `npm test` also 79/79. |
| Playwright production E2E | PASS | **18 passed, 0 failed, 0 skipped, 0 flaky**: 15 desktop Chromium + 3 mobile viewport. Final run 74.187s. |
| Next production build | PASS | `INTERNLINK_DIST_DIR=.next-frontend npm run build` (PowerShell environment syntax below) exit 0; Next 16.4.6, compiled, TypeScript and 23 static-page generation completed. Default build in clean archive also exit 0. |
| Production start/smoke | PASS | Playwright webServer builds `.next-e2e` and starts actual `next start` on 3105; navigates36 concrete route/query examples, invalid record states and all coordinator modules on desktop/mobile. No pageerror in smoke sweep. |
| Persistence | PASS | Shared record propagation, refresh, second service instance, cross-tab BroadcastChannel and actual close/reopen persistent Chromium profile all asserted. Normal reads do not reseed. |
| Accessibility/usability | PASS within tested subset | Zero axe violations on login/settings in desktop/mobile; modal Escape/focus restoration; labelled fields/error focus; six-page390px overflow assertions; text/motion/density effects. Screenshots inspected. |
| Clean installation | PASS | Git-archive of 251410a into fresh temp directory; ci/lint/typecheck/tests/build/dependency listing all exit 0. |
| Firefox/WebKit/manual screen reader | UNVERIFIED | Not executed. Automated Chromium does not certify all WCAG criteria or browsers. |
| Real backend/database/security | NOT APPLICABLE | Explicitly outside current front-end scope; no server endpoints or real auth/database configured. |
| Approved institutional policies/ERD | BLOCKED externally | Not supplied; documented demo assumptions allow all front-end workflows to operate. |

## Environment and exact commands

Workspace `D:\Orca\Workspace\pup-internlink-ui`; Node **v24.15.0**, npm **11.12.1**, Next 16.4.6, React/ReactDOM 19.3.0, TypeScript 5.9.3, ESLint 9.39.5. Test stack: Vitest 5.1.1, Testing Library React 16.3.3, jsdom 31.0.1, fake-indexeddb 6.2.8, Playwright 1.65.1, axe 4.14.0. Existing Chromium executable version **156.0.8078.4** was used; no real browser profile/student data involved.

```powershell
npm install --package-lock-only --ignore-scripts --no-audit --no-fund
npm test -- --reporter=default --reporter=json --outputFile=docs/evidence/development/vitest.json
npm run lint
npm run typecheck
$env:INTERNLINK_DIST_DIR='.next-frontend'
npm run build
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='C:/Users/User 1/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe'
npm run test:e2e
```

The separate commands ran in suitable shells; the E2E launcher explicitly sets its own `.next-e2e` directory. Receiving developers normally run `npx playwright install chromium` and omit the machine-specific executable override. No test browser installation result is claimed for that unexecuted receiving-team command.

Clean verification used `git archive --format=zip --output=<temp>/internlink-clean-251410a.zip HEAD` at 251410a and `Expand-Archive` into `C:/Users/User 1/AppData/Local/Temp/internlink-clean-251410a`. Inside that fresh directory:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run lint
npm run typecheck
npm test
npm run build
npm ls --depth=0
```

Every command exited0; see [results-clean.json](evidence/development/results-clean.json) and the corresponding `*-clean.txt` files. Dependency listing exits0 but labels `@emnapi/runtime@1.11.3` and `@img/sharp-wasm32@0.35.5` extraneous after build in both workspace and clean copy. They are not direct declared product dependencies; no claim of an empty extraneous listing is made. No user workspace dependencies/processes were deleted to hide this result.

Final output excerpts:

```text
Test Files  4 passed (4)
     Tests  79 passed (79)

18 passed (1.2m)

✓ Compiled successfully
✓ Generating static pages using 7 workers (23/23)
```

## Browser evidence and required workflows

`auth.spec.ts`: valid/invalid/inactive accounts, direct protected URLs, unauthorized role/assignment access and logout. `lifecycle.spec.ts`: B–J register/edit/search/reload/duplicate student → company/supervisor/opportunity → mandatory definition and actual TXT submission → blank-reason rejection guard → rejection/resubmission/approval → student application → acceptance → contextual placement/assignments → student report → faculty review and evaluation → assigned company evaluation → completion → explicit certificate metadata → filtered CSV and persistent rejection history. Every step uses supported UI/role switching, without editing underlying storage to bypass prerequisites.

`guards.spec.ts`: invalid placement date/hour/company supervisor, duplicate/capacity and acceptance/document/rejection prerequisites. `maintenance.spec.ts`: edits propagate to related views, actual attachment download bytes, program/year/sort/reset filters, dashboard URLs/back/forward, effective academic year/landing preference and cross-tab updates. `restart.spec.ts`: create a record in a persistent browser context, close it, relaunch the same profile and verify saved data/valid session. `smoke.spec.ts` runs desktop and mobile: route/query/invalid-ID coverage, settings/accessibility/keyboard, seven report categories, empty results, CSV/print and intentional reset.

CSV checks include actual downloaded bytes and filtered row inclusion/exclusion; unit cases cover commas/quotes/newlines and spreadsheet formula prefixes. Print verification observes window.print invocation and print-media hiding of navigation; no physical printer output was produced. File acceptance used genuine synthetic TXT bytes; native PDF/image rendering is browser-dependent and not exhaustively certified. The cycle uses8 required hours for a compact reproducible demonstration; the PDF243/486=50% calculation is separately asserted in unit tests.

## Failures investigated and repaired

- Initial dependency installation encountered Vitest's Node type peer mismatch; aligned @types/node to running Node 24 without force/legacy-peer-deps.
- First build exposed a test option typing mismatch; fixed the typed accessible-name query, then reran build successfully.
- An intermediate lint scanned custom generated Next/Playwright directories. Ignored generated output paths only; retained all product lint rules and clean source lint passes.
- Initial browser runs exposed low-contrast text and navigation visible-label/accessibility-name mismatches. Repaired CSS and names; final axe checks have zero violations.
- Some initial browser failures were ambiguous selectors or assertions before navigation completed. Scoped to actual labelled controls and awaited resulting persisted state; workflow assertions remain substantive.
- Rapid reset then sort intermittently reused stale filter parameters. Fixed current-URL native-history handling; final complete suite passes this regression.
- Scoped availability originally risked ignoring other students' allocations. It is now computed from full records before projection; relation/race tests exercise authoritative capacity.
- Malformed session JSON/null and hidden document eligibility were corrected and regression checked.
- Recovery reset now separates record-store corruption from session-storage failure; an integration regression verifies valid records remain unchanged. A duplicate Database import introduced during that repair caused four Vitest files to fail before executing tests and prevented the E2E server build. It was corrected before commit; the full runs of 79 tests and 18 browser tests and clean build then passed. Failed runs are not counted as passes; their outputs are retained as repair-duplicate-import-*.txt.
- A separate real-keystroke browser probe exposed search character loss despite fill/paste checks passing. The field now retains input while URL transitions settle and synchronizes reset/history from current location. The expanded maintenance browser test asserts zero-delay complete ID/name input, exact matching records and immediate reset. The original failed probe is retained as repair-keyboard-search-before.txt.

Non-failing warnings: clean installation reports ESLint9 deprecation; browser subprocesses report NO_COLOR ignored because FORCE_COLOR is set. Existing dev processes were preserved; no native CUA/signed-in personal browser was required. No browser/storage/backend limitation was converted into an invented test pass.

## Evidence inventory

Current raw outputs/machine results: [development/](evidence/development/) (`vitest.json`, `e2e-results.json`, build/lint/typecheck/Vitest/E2E logs, clean-install outputs/results, source inventory and self-review). Desktop/mobile screenshots are retained there. Historical Phase0 outputs remain at `docs/evidence/` and `initial-clone/`; they describe the original prototype and must not be confused with current results. Final documentation/requirement validation is recorded in development/self-review.json.
