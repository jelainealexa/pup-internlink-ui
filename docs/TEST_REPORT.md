# Executed test and build report

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
     Tests  79 passed (78)

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
