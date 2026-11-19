# Front-end handover

**PASS for the verified synthetic browser-local front-end.** Reviewed application/test candidate **7ca502cc6260232619570b2ee945da5f5c13145b**; application repair **dcad283780f3b7ab3ca2ee25c792924d695106a5**; original challenged commit **d71e7265dbb2d136a0ea7f5f08c13e6b24278ba2**. Branch audit/independent-front-end. Final documentation/evidence commit is its descendant, shown by git log. Main remains2d846774c6dfbc61d675331145bd7b82b301e5a4; owner PDF preserved untracked; no push/merge. Same agent authored repairs and their verification; targeted fresh-context review recommended.

## Run and verify

Node24/npm11, localhost/HTTPS and modern storage-enabled browser. npm ci; npm run dev. Production: npm run build then npm start (same INTERNLINK_DIST_DIR if overridden). npm run lint; npm run typecheck; npm test; npm run test:e2e. Receiving developers can install Chromium via npx playwright install chromium; that machine-specific installation is not claimed as executed here. Exact recorded executable override/results: TEST_REPORT.

Public synthetic password **InternLink!2026** for all demo accounts. coordinator@example.test: eleven modules; student@example.test: ongoing intern; student4@example.test: accepted unplaced; faculty@example.test/faculty2@example.test: assigned advisers; supervisor@example.test/supervisor2@example.test: company supervisors. student6@example.test is intentionally inactive. README lists all 11accounts. New student/supervisor registrations create linked synthetic accounts with this public password. Never enter real credentials/student information.

Initial data seeds only when absent. Never auto-reset during ordinary navigation/refresh/error. Settings reset requires coordinator, Prepare reset and exact RESET DEMO; cancel/login recovery supported. Reset replaces this origin/profile's synthetic records/files/preferences and clears session. Failed session clearing preserves records; a later failed replacement may leave the user signed out with records intact. Browser clearing/eviction can lose data; no shared server/backup exists.

## Architecture and contracts

Next App Router adapters -> PortalPage/features -> AppProvider/InternLinkService -> DemoService commands/rules -> IndexedDbStore. Domain contracts: app/lib/domain.ts; business validation: rules.ts/commands.ts; integrity: integrity.ts; report generation/export: reporting.ts. Views do not write storage directly. Explicit demo/API composition; UnconnectedApiService fails without fallback. Authentication/session is simulated, never production security.

Accounts link student/faculty/supervisor profiles; supervisors belong to companies; opportunities belong to companies; applications join students/opportunities; placements reference accepted applications and assigned faculty/supervisor. Reports/evaluations/certificate metadata reference placements. Submission attempts reference student/definition/actual Blob file. Names/counts/hours/slots derive from relations. Preferences belong to accounts. DATA_MODEL lists fields/statuses; API_CONTRACT proposes transport DTOs/errors/filtering/pagination/files/concurrency; BACKEND_INTEGRATION_GUIDE explains replacement. No approved ERD/API mapping is supplied.

All domain writes use execute(command, requestId, expectedRevision). SaveForms retain their loaded revision across background refresh; never silently overwrite stale inputs with a newer provider revision. Conflict preserves input and offers warned deliberate reload/retry; unrelated changes can conflict too. After one own successful command the form revision advances once. Native writes validate/commit atomically; readonly reads validate without rewriting. Optional SHA256 commandFingerprint binds actor/key/intent/file bytes. Legacy receipts without it remain readable but ambiguous replay conflicts; review existing records/use a fresh key. Receipts/events bounded. These are local simulation mechanisms, not server security/audit/durability.

## Route inventory

| Area | Route families |
| --- | --- |
| Login/overview | / and /dashboard |
| Students | /dashboard/students, /create, /[id], /[id]/edit |
| Partners/supervisors | /dashboard/partners, /create, /[id], /[id]/edit; /[companyId]/supervisors/create, /[supervisorId], /[supervisorId]/edit |
| Requirements | /dashboard/requirements master/submission query views; /create; /[id]/edit; /submissions/create and /submissions/[id] |
| Opportunities | /dashboard/internships, /create, /[id], /[id]/edit |
| Applications | /dashboard/applications, /create, /[id] |
| Placements | /dashboard/placements, /create?application=[id], /[id] |
| Progress | /dashboard/progress, /create?placement=[id], /[placementId], /reports/[id] |
| Evaluation/reports/settings | /dashboard/evaluations and /[id]; /dashboard/reports; /dashboard/settings |

These suffixes extend each base route. Thirty-six actual template paths/JSX controls: evidence/independent/source-inventory.json. Query keys are UI context, not approved REST names. Invalid/nested wrong-company IDs, context-preserving login, refresh/history are tested.

## Role permissions

Coordinator: directory/definition/posting maintenance, document/application decisions, placement assignment/review/termination/completion, certificate metadata, reports/settings/reset; cannot impersonate an evaluator. Student: own profile/checklist/files/apps/placement/reports/evaluation context and own submissions/settings. Faculty: assigned students/documents/placements/reports and own assigned evaluation. Supervisor: own company/assigned interns/reports, review remarks and own company evaluation. No unassigned evaluation or unrelated record access through supported flows. Minimal related portals are demonstration extensions, not full unapproved products. Both read projections and commands guard supported actions; real server equivalents required.

## Business policies and backend replacement

BUSINESS_RULES and D-016–042 distinguish confirmed PDF rules from reversible assumptions: latest mandatory approvals; posting approval;30-day MOA warning; placement-time slot consumption/completed retains/terminated releases; one ongoing placement; reviewed daily hours/seven-day gap;0–100 grade without institutional passing threshold; two assigned evaluations; guarded completion and deliberate synthetic certificate metadata. Shared compensated hour sums normalize12significant digits. No official certificate document issuance is invented.

Backend receiving team owns approved IDs/schema/DTO mapping, account/auth/session/authorization, unique/FK/assignment/capacity/status transactions, durable idempotency/concurrency/audit, secure file storage/access/scanning, rubric/certificate authority. Replace the service adapter and map DTOs without UI rewrites; never hide API failures with demonstration success. Exact approved ERD/API compatibility remains UNVERIFIED. Actual backend/database/security certification expressly excluded.

Evidence:102 Vitest,40 configured production browser tests,3 repeated concurrency checks, independent dashboard/report oracles, actual file/CSV bytes, clean install/build/lint/typecheck and development login. TEST_REPORT and INDEPENDENT_VERIFICATION_REPORT record exact results and failed exploratory/harness runs. DEFECT_REGISTER preserves original 16findings/repairs. KNOWN_ISSUES lists unverified browsers/manual AT/PDFviewer/physical print/quota endurance/parallel timing. Fresh-context review should target stale edits, idempotency/legacy receipts/reset and approved policy mapping. Do not manually edit storage to bypass workflow acceptance.
