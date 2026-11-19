# Phase 0 test report

Date: 2026-11-19, Asia/Manila. Current source baseline **aae8d8781c3cbb44094e1aa8dcabc398d913514c**. Results characterize an incomplete prototype. A successful observation harness means observations completed; it does **not** mean business acceptance passed.

## Environment and isolation

Node v24.15.0, npm 11.12.1, PowerShell on Windows. The workspace already had `next dev`/server processes using its node_modules; these were preserved. Initial clone checks ran at 2d84677 before remote synchronization and are retained under `evidence/initial-clone/`; they are superseded for current source assessment. Local main was not advanced.

For the final baseline, `git archive --format=tar -o <temporary-dir>/baseline.tar HEAD` and `tar -xf <temporary-dir>/baseline.tar -C <temporary-dir>` copied tracked source to `C:\Users\User 1\AppData\Local\Temp\internlink-phase0-current-20261119`. This avoids `.next` and SWC collisions with the existing server. Package/config/source are identical to the audited commit; source hashes are in source-inventory.json. Copy did not contain Phase 0 documentation or the untracked user PDF. Installed/ran actual application from that source, not a rewritten fixture application.

## Exact commands and results

| Command / location | Result | Evidence and interpretation |
| --- | --- | --- |
| `node --version`; `npm --version` / workspace | v24.15.0 / 11.12.1 | Recorded environment. |
| `npm ls --depth=0` / workspace and first isolated copy | exit 0 | Versions in REPOSITORY_AUDIT; optional wasm packages reported extraneous. |
| `npm ci --ignore-scripts --no-audit --no-fund` / original workspace | exit 1 | EPERM -4048 unlink of `node_modules/@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node`; active pre-existing server observed. File lock is likely cause, not proven permission diagnosis. No processes stopped. |
| `npm install --ignore-scripts --no-audit --no-fund --package-lock=false` / workspace recovery | exit 0 | Added 285/changed 61 packages; cleanup EPERM warning for old locked SWC temporary directory; ESLint deprecated warning. Tracked package and lockfile unchanged. This recovery alone is not lockfile reproducibility proof. |
| `npm ci --ignore-scripts --no-audit --no-fund` / final isolated copy | **exit 0**, 346 packages/32s | [install.txt](evidence/install.txt); exact lockfile install succeeded. Scripts/audit/funding disabled deliberately, not a security audit or lifecycle-script test. |
| `npm run lint` / final isolated copy | **exit 1**, 3 errors / 0 warnings | [lint.txt](evidence/lint.txt); react-hooks/set-state-in-effect at applications/page.tsx:31, placements/page.tsx:40, placements/create/page.tsx:35. No fixes in Phase 0. |
| `npm run lint` / final workspace after documentation | **exit 1**, same 3 errors / 0 warnings | [workspace-lint.txt](evidence/workspace-lint.txt); confirms documentation/evidence add no extra lint errors. |
| `npm run build` / final isolated copy | **exit 0** | [build.txt](evidence/build.txt); Next 16.4.6/Turbopack, compilation 3.2s, TypeScript stage 4.9s, static generation 15 pages. Page-generation count differs from 20 authored route files and is not requirement coverage. |
| `npx --no-install tsc --noEmit` / final isolated copy, after build | **exit 0**, no diagnostics | [typescript.txt](evidence/typescript.txt) is empty because check succeeded; exit recorded by command orchestration. |
| `npm test -- --runInBand` / final isolated copy | **exit 1**, Missing script: test | [tests.txt](evidence/tests.txt). No test script/config/test files existed; zero existing automated suites executed, not a suite with passing tests. |
| `npm run start -- --port 3101` / final isolated copy | Ready in 302ms; actual requests served | Next 16.4.6. Audit session lifecycle and original workspace server preservation are recorded below. |
| `npm install --prefix 'C:/Users/User 1/AppData/Local/Temp/internlink-phase0-tools-20261119' --ignore-scripts --no-audit --no-fund playwright@1.61.1` | exit 0, 2 external tool packages | Outside project; package.json/lockfile not changed. Existing Chromium executable used. |
| `$env:AUDIT_CHROMIUM = 'C:/Users/User 1/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe'`; `node docs/evidence/run-browser-audit.cjs 'C:/Users/User 1/AppData/Local/Temp/internlink-phase0-tools-20261119/node_modules/playwright' 'http://localhost:3101' 'D:/Orca/Workspace/pup-internlink-ui/docs/evidence'` / workspace | **exit 0**, 48 route visits, 16 observation groups, no pageerror events or harness errors | [browser-run.txt](evidence/browser-run.txt), [browser-results.json](evidence/browser-results.json). Harness renamed `.cjs.txt` after execution so audit evidence does not become application/lint source. To rerun, copy text to a temporary .cjs and use that path. Chromium version is stored in results. |

Build warning: Next ignored `C:\Users\User 1\package-lock.json` because it would include the home directory; suggested `turbopack.root`. Start warned similarly and suggested `outputFileTracingRoot`. These are environment root-discovery warnings; no configuration was changed. Install warned ESLint 9.39.5 was deprecated/unsupported. No npm audit/security scan was executed; no dependency-security conclusion is claimed.

## Browser observations (actually executed)

| ID | Observation | Functional conclusion |
| --- | --- | --- |
| B01 | Empty login enters dashboard; no session cookies. | Authentication absent; no active/role enforcement. |
| B02 | Student ID search reduces five rows to one, expected record; no-match message appears. | Bounded fixture search and empty state work. |
| B03 | IT program gives two, section 4-3 gives one, Ongoing gives two; hours sort starts 486-hour student; ID sort starts 2024-0001. Default alphabetical order also visible in captured directory. | Tested filter/sort behavior works; diverse year-level case not tested. |
| B04 | Blank create rejected; duplicate ID/email rejected (email case ignored); valid synthetic data only shows validated message, remains on create; new ID gives Student not found. | Validation partially works; no creation/persistence/redirect. |
| B05 | Editing first name shows prototype success, original name remains on profile. | No update. |
| B06 | Accept app-001 exposes correct placement URL; header remains Pending; placement save says accepted application required; revisit restores Accept. | Cross-page decision handoff broken; no persistent decision. |
| B07 | Empty/whitespace rejection disabled; nonblank confirm displays reason; header remains Pending; reload restores Accept. | Local confirmation works; no durable rejection/history. |
| B08 | Accepted fixture context; blank/date-order errors; negative required hours with selected unrelated supervisor accepted as validated; list remains three. | Required/date checks partial; positive-hours/assignment/write/ID/redirect absent. |
| B09 | PR-003 dialog becomes Reviewed, row stays Pending Review; reload enables Mark as Reviewed again. | Local dialog state only; no propagation/persistence. |
| B10 | Year/landing/density/text controls can change; text toggle only pressed state; body class unchanged; reload restores all defaults. | No persistent/effective application preferences. Source confirms no other consumer/effect. |
| B11 | Application status/student query returns one; search no-match returns zero; opportunity query returns all three, dropdown returns one; placement student/status query returns one. | Some context/filter behavior works; opportunity URL ignored. |
| B12 | Progress student query still three records; evaluation student/pending still three; partner expiring still three. | Query context lost. |
| B13 | Sidebar collapse/reopen classes change as expected. Desktop dashboard screenshot captured. | Local navigation toggle works. |
| B14 | At 390px: dashboard document 449px, student profile 423px, settings 391px. Directory document 390px but table viewport only 150px for 750px table. | Reproduced mobile usability/overflow defects; not full responsive certification. |
| B15 | Six settings switches lack names; three selects lack associated labels/ARIA labels. | Reproduced semantic accessibility defects; not a complete accessibility audit. |
| B16 | Applications no-match explains empty list; placements/progress return no records without explanatory empty element. | Empty-state gaps. |

Route sweep includes all 20 authored route patterns instantiated with fixture/unknown IDs, all five student profiles, one valid edit and unknown edit, three company/opportunity/application/placement/progress/evaluation records, missing Requirements/Reports, and nonexistent partner/opportunity creation. All valid fixtures render; no pageerror events observed. Requirements/Reports and partner/opportunity create return 404; unknown partner/opportunity/evaluation return 404. Unknown student/edit/application/placement/progress return HTTP 200 with not-found heading. This is an HTTP/UI observation, not proof of production authorization or database integrity.

Captured screenshot evidence: [desktop dashboard](evidence/dashboard-desktop.png) and [mobile students](evidence/students-mobile.png); visually inspected. Every captured main-content link and heading is retained in browser-results.json; not every link was clicked independently. Explicit interaction clicks are B01/B04-B13. No claim that every clickable element received a full acceptance test.

## Limitations and historical attempts

Native CUA browser creation failed: `Computer Use native pipe is unavailable ... The system cannot find the file specified (os error 2)`. No native UI interaction succeeded. Playwright headless Chromium supplied real-browser evidence instead. Initial old-commit browser attempt used networkidle and timed out navigating to dashboard; partial output in initial-clone is not a current result. Final harness uses DOMContentLoaded plus visible h1 and a short hydration allowance; a future acceptance suite needs explicit reliable UI/state assertions.

Final browser: Chromium **156.0.8078.4**. The 48 route responses comprise 41 HTTP 200 and seven HTTP 404. No browser pageerror or harness error was observed in the final run. These numbers are visit/response counts, not passing business requirements. The native connection failure, initial timeout and workspace dependency recovery were actual unsuccessful attempts and remain disclosed.

Both self-started isolated server sessions were ended with Ctrl+C after their checks. Final process inspection confirmed the original workspace dev processes (18500 and 19628) still existed; they were not stopped by the audit. This is process preservation, not a final health certification of that user-owned development session.

Documentation verification: local requirement/dependency/link checks completed with 86 unique IDs and no missing required fields, unresolved ID references or broken local document links. Source hashes differ from the baseline inventory only for intentionally appended AGENTS.md guidance; the PDF hash is unchanged. Root lint repeated the same three errors. Git warned that LF would convert to CRLF; staged whitespace checking initially found trailing spaces/extra final blank lines in captured build/lint logs. Only that trailing whitespace was normalized, with diagnostic text preserved, and the check then passed. Evidence collection also emitted Node DEP0190 for invoking npm.cmd with constant arguments through `shell: true`; this was a tooling warning, not an application test failure.

Not executed: real backend/database/auth/email/upload integration (not supplied); future unit/component/integration/Playwright acceptance suites; Firefox/WebKit, manual screen reader/keyboard/zoom, live Excel/native UI tests, security penetration test, performance/load or accessibility-conformance certification. Student form whitespace/invalid HTML email and all date/hour edge cases were assessed in source/planned tests, not all exercised in browser. Do not conflate TypeScript or compilation success with these checks.

Verdict: **production build/typechecking pass; lint fails; existing tests unavailable; browser characterization completed with significant functional defects.** Application acceptance is FAIL. Phase 0 is complete because the failures and external limitations are documented rather than concealed.
