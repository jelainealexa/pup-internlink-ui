# PUP InternLink

A functional internship-management **front-end demonstration** for PUP's Database Systems Implementation subject. Next.js 16.4.6, React 19.3, TypeScript and the existing CSS design. All saved records and attachments belong to the current browser profile and origin. There is no connected backend, production authentication or shared database.

## Run locally

Prerequisites: Node.js 24.x, npm 11.x, a modern browser with IndexedDB/localStorage, and available local ports. Use synthetic information only.

Use localhost or HTTPS: the demonstration verifier and generated IDs use browser Web Crypto APIs, which require a secure browser context. Remote plain HTTP is unsupported.

```sh
npm ci --ignore-scripts
npm run dev
```

Open http://localhost:3000. IndexedDB initializes synthetic data only when no saved dataset exists. Refresh and normal navigation retain changes; browser data clearing removes them. Development and production use the same data only when their browser origin (scheme, host and port) matches.

```sh
npm run build
npm run start
```

For isolated build output, set `INTERNLINK_DIST_DIR` consistently for both build and start (PowerShell: `$env:INTERNLINK_DIST_DIR='.next-frontend'`). Keep pre-existing development processes running; choose a different port with `npm run start -- --port 3100` if necessary.

## Synthetic accounts

All accounts use the public demonstration password **InternLink!2026**. It is intentionally not a secret. No plaintext password is stored in browser data; the verifier and simulated session are inspectable client data, not security.

| Email | Role / useful scenario |
| --- | --- |
| coordinator@example.test | Coordinator; all eleven modules |
| student@example.test | Mira Demo; ongoing PL-001 |
| student2@example.test | Theo Sample; completed PL-002 |
| student3@example.test | Luna Example; terminated PL-003 |
| student4@example.test | Nico Demo; accepted application app-002, ready for placement |
| student5@example.test | Ari Sample; pending/rejected documents and application |
| student6@example.test | Inactive account; sign-in is rejected |
| faculty@example.test | Assigned faculty adviser Robin Demo |
| faculty2@example.test | Faculty adviser Casey Sample |
| supervisor@example.test | Copper Finch Labs supervisor Morgan Demo |
| supervisor2@example.test | Riverstone Studio supervisor Jordan Sample |

New student and supervisor forms create linked synthetic accounts using the same public password. Switch roles by logging out and signing in. One simulated session is shared by tabs on the same origin; it expires after eight hours.

Reset deliberately from Coordinator Settings: enter **RESET DEMO** and submit the reset form. This discards local records/files and signs out. Invalid saved schemas are never silently reseeded; the login recovery control supports explicit destructive recovery. Valid saved data can only be reset by a coordinator through supported workflows.

## Functionality

Coordinator dashboard; student and partner maintenance; nested supervisor management; requirement definitions and real local file submissions/reviews; opportunity approval/closure and capacity; application history/decisions; accepted-application placement creation; daily progress submission/review and calculated hours; assigned faculty/company evaluations; completion and synthetic certificate metadata; seven filtered reports with CSV/print; effective per-account preferences. Minimal complementary student/faculty/supervisor interfaces exercise the same lifecycle and are labelled demonstration extensions.

All domain writes use shared typed services and transactional IndexedDB. Cross-module names, availability and totals derive from relationships. Form errors preserve inputs. Role restrictions are simulated client behavior and require server enforcement in any real deployment.

## Verify

```sh
npm run typecheck
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
```

Separate scripts: `test:unit`, `test:component`, `test:integration`. Playwright builds and starts an isolated production front-end on port 3105; keep it free. It runs desktop Chromium plus a 390px mobile Chromium viewport. `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` optionally selects an installed compatible browser; `PLAYWRIGHT_BASE_URL` targets an already running server and skips automatic startup. Browser tests use isolated synthetic profiles, not your normal demonstration data. Reports are generated in ignored `playwright-report/` and `test-results/`.

See [actual test results](docs/TEST_REPORT.md), [handover](docs/HANDOVER.md), [architecture](docs/ARCHITECTURE.md), [requirements](docs/REQUIREMENTS.md), [business policies](docs/BUSINESS_RULES.md), [known limitations](docs/KNOWN_ISSUES.md), and the [backend replacement guide](docs/BACKEND_INTEGRATION_GUIDE.md).

## Boundaries

The 23-page system-flow PDF is the available primary specification; approved ERD, SQL schema, API, institutional permission matrix and grading rubric were not supplied. Reversible demo policies are documented, not presented as institutional approval. API mode (`NEXT_PUBLIC_DATA_MODE=api`) explicitly reports unavailable operations and never falls back to demonstration success. Backend implementation/integration is outside this delivery. Certificate entries are metadata, not official issued documents; alerts are local dashboard reminders, not emails/SMS. Data is not shared across devices/profiles. Firefox/WebKit, manual screen-reader certification and production security are not verified.

## Verified release candidate

Reviewed **7ca502cc6260232619570b2ee945da5f5c13145b**, branch audit/independent-front-end:102unit/component/integration and40 configured production browser tests pass. See [release readiness](docs/RELEASE_READINESS.md), [verification report](docs/INDEPENDENT_VERIFICATION_REPORT.md), [defects](docs/DEFECT_REGISTER.md), [test evidence](docs/TEST_REPORT.md). The same agent authored repairs and verification; this is not third-party/security certification. Exact approved backend compatibility remains unverified.

Multi-tab edits retain their loaded revision. On conflict, preserve input and deliberately reload latest records before retrying. Old version1 snapshots remain readable; idempotency receipts without fingerprints cannot safely replay. Normal navigation never resets data.
