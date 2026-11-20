# Updated front-end handover

Interface-update development candidate on `frontend/interface-update`, starting from `5daa83a96bd3b4c2afdf1821b8a7fcbd2764ca6a`. Implementation/test checkpoint 7f2873a60160060bae8140c0769e7545a3aa3154. Internal120 native/43 production browser, lint/typecheck/build and separate production smoke pass; TEST_REPORT records exact executed gates. **Internal verification only; final targeted independent review is postponed.** Previous certification/reports remain historical, not approval of these updates. No push, merge, backend or production deployment occurred.

## Launch and demonstration accounts

Node 24.x/npm 11.x; localhost/HTTPS, IndexedDB/localStorage/Web Crypto enabled. `npm ci --ignore-scripts`; `npm run dev` opens3000. Production: `npm run build`, then `npm start`; if overriding `INTERNLINK_DIST_DIR`, use the same value for build/start. Keep existing servers and choose a free port. Tests: `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:e2e`. Playwright automatically builds/starts an isolated production app on3105; install Chromium with `npx playwright install chromium` or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to a compatible installed binary.

Fresh seeded accounts use public synthetic password **InternLink!2026**: coordinator@example.test (OJT Coordinator); company@example.test/company2@example.test (Company Supervisor administrators); supervisor@example.test/supervisor2@example.test (Intern Supervisors); faculty@example.test/faculty2@example.test (Faculty Advisers); student@example.test through student6@example.test (Student; first account uses no number;6 is inactive). README lists scenarios. New students must activate an existing pre-registration using a generated local invitation and chosen password. New faculty/supervisor accounts use the public password until changed. No real credentials/personal information/email delivery.

## Architecture and data

Existing Next 16.4.6/React 19.3/TypeScript/CSS preserved. Explicit route adapters→PortalPage/features→AppProvider/InternLinkService→DemoService→commands/updates/rules→IndexedDbStore. Domain contracts: app/lib/domain.ts; migration: upgrade.ts; integrity: integrity.ts; projections/report CSV: commands.ts/reporting.ts. UI modules do not open IndexedDB. `execute(Mutation,requestId,expectedRevision?)` and public `access(AccessCommand,requestId)` perform real local writes, with validation, atomicity and content-bound retry receipts. Public account tokens also enforce purpose/expiry/binding/single use. `attachment(id)` returns the actual authorized Blob. API mode remains explicitly BACKEND_UNAVAILABLE.

Accounts identify students/faculty/supervisors; both supervisor roles reuse company-linked profiles. Students optionally reference a current adviser before placement. Opportunities reference company and assigned Intern supervisors; applications join student/opportunity; placements join accepted application, faculty and Intern profile. Attendance/reports/evaluations/certificates reference placements. Submissions retain attempts and real file references. Names, capacity, status summaries and rendered/approved hours derive from these relationships. DATA_MODEL documents fields/enums; API_CONTRACT proposes transport mapping, not working endpoints.

## Demonstration permissions

| Role | Permitted scope/actions | Explicit restrictions |
| --- | --- | --- |
| OJT Coordinator | All coordinator records/reports, pre-registration/invitations, company/faculty/accounts/assignments, posting coordinator decision, official placement/completion/certificate metadata, oversight application decision | Cannot bypass company posting stage, duplicate decisions/capacity/requirements/evaluation guards; no new progress approval authority. |
| Student | Own profile/documents/applications/placement/attendance/weekly or alternative daily reports/evaluations, eligible Active postings/company information, own account settings | No unrelated students/files, pending/draft/deactivated postings, document review/progress approval/evaluation submission. |
| Faculty Adviser | Current assigned students including pre-placement; own pre-registrations; relevant document review; assigned/historical placement monitoring; separate faculty remarks; assigned faculty evaluation | No faculty administration/reassignment, unrelated documents/placements, Intern progress decisions, company evaluation. Historical closed placement access gives no new-document review rights after reassignment. |
| Company Supervisor | Own company ordinary information, postings/company decision/activation, own Intern accounts/assignments/workloads, company placement monitoring | No unrelated companies, MOA approval/date editing, student application decisions, progress approval or evaluator submission. |
| Intern Supervisor | Assigned postings/applicants/relevant Before documents; one-way application decision; assigned interns/progress approvals/rejections/company evaluation; own contact/account settings | No company administration or unassigned opportunities/interns, unrelated student documents, faculty evaluation or third obligation. |

These are shared service guards plus route/UI restrictions in a browser-local simulation, not server security. Users controlling their browser can alter local data. Receiving backend must enforce every read/file/mutation.

## Upgrade, persistence and operations

Database name remains `pup-internlink-demo-v1` and IndexedDB object-store version 1; **snapshot format** upgrades1→2 atomically. This distinction avoids switching to an empty database. Legacy snapshots validate first; IDs, attachments, credentials, receipts, placements/evaluations/certificates/preferences remain. Every legacy operational Company Supervisor becomes Intern Supervisor; no administrator is added. Coordinator explicitly creates a company administrator via company profile→Add Supervisor Account. Fresh seed alone includes the new administrators. Legacy Reviewed reports retain approved totals and original reviewer with visible provenance. Unknown/damaged formats remain visible errors, never automatic reset.

Fresh data initializes only when absent. Refresh/navigation/reopened supported Chromium profile retain changes; same-origin tabs synchronize. Separate ports/profiles/devices do not share data. Clearing/eviction loses browser data; no cloud backup. Intentional coordinator Settings reset requires Prepare reset and exact RESET DEMO, discards local data/files and signs out. Session-clear failure leaves data intact; database replacement failure after session clear may sign out without erasing records. Do not reset just to install this update.

Forms capture their loaded revision; background refresh does not authorize stale writes. Conflicts preserve input and require deliberate reload/review. Transactions reject failed operations without partial records. Fingerprint-bound receipts cover recent200 authenticated/public retry keys; changed-content replay conflicts; domain uniqueness remains after receipt expiry. Local activities retain bounded recent history; embedded decision/submission histories persist with their records. This is not production multi-client transaction/security certification.

## Workflow and policy handoff

Pre-register→invite→activate existing student; coordinator faculty assignment→faculty/student share adviser; company posting decision→coordinator decision→activation; admin assigns active Intern; student applies→assigned Intern decides→coordinator creates official placement; phased document submission→faculty review/rejection/resubmission; attendance→weekly report→Intern approve/reject→separate faculty remark; two assigned evaluations→coordinator completion/certificate metadata. All portals read the same records.

BUSINESS_RULES and D-043–052 distinguish specified interfaces from demo assumptions. Before mandatory approval gates placement; frozen all-phase mandatory obligations gate completion. Accepted applications reserve no slot; non-terminated placements consume one including completed. Approved hours count officially; attendance plus weekly never doubles rendered work. Coordinator oversight application authority is retained pending policy confirmation. Current adviser reassignment cannot conflict with ongoing placement. Pending company evaluation transfers in-place on Intern reassignment; submitted evaluation freezes ongoing transfer. No weighted final grade, official pass threshold or real certificate issuance is invented.

## Route inventory

All dashboard routes require active simulated authentication and scoped records. Public activation/recovery routes validate bound local requests. Dynamic invalid IDs return explicit not-found/access states. Existing `/dashboard/internships` paths are preserved.

- `/`
- `/activate`
- `/dashboard`
- `/dashboard/applications`
- `/dashboard/applications/[id]`
- `/dashboard/applications/create`
- `/dashboard/attendance`
- `/dashboard/attendance/create`
- `/dashboard/evaluations`
- `/dashboard/evaluations/[id]`
- `/dashboard/faculty`
- `/dashboard/faculty/[id]`
- `/dashboard/faculty/[id]/edit`
- `/dashboard/faculty/create`
- `/dashboard/internships`
- `/dashboard/internships/[id]`
- `/dashboard/internships/[id]/edit`
- `/dashboard/internships/create`
- `/dashboard/partners`
- `/dashboard/partners/[id]`
- `/dashboard/partners/[id]/edit`
- `/dashboard/partners/[id]/supervisors/[supervisorId]`
- `/dashboard/partners/[id]/supervisors/[supervisorId]/edit`
- `/dashboard/partners/[id]/supervisors/create`
- `/dashboard/partners/create`
- `/dashboard/placements`
- `/dashboard/placements/[id]`
- `/dashboard/placements/create`
- `/dashboard/progress`
- `/dashboard/progress/[id]`
- `/dashboard/progress/create`
- `/dashboard/progress/reports/[id]`
- `/dashboard/progress/weekly/create`
- `/dashboard/reports`
- `/dashboard/requirements`
- `/dashboard/requirements/[id]/edit`
- `/dashboard/requirements/create`
- `/dashboard/requirements/submissions/[id]`
- `/dashboard/requirements/submissions/create`
- `/dashboard/settings`
- `/dashboard/students`
- `/dashboard/students/[id]`
- `/dashboard/students/[id]/edit`
- `/dashboard/students/create`
- `/forgot-password`
- `/reset-password`

Query-driven views: requirements `view=submissions`, `phase`, `student`, `status`, `attempt`; progress `view=reports`, `reportStatus`, `company`, `adviser`, `status`; directory search/filter/sort; company/opportunity/application/placement context; `assigned=true` on Intern opportunity/application links, `interns=true` on My Interns. Generated invitation/reset URLs contain local request codes and emails, only usable within the same origin/profile.

## Backend replacement and remaining responsibilities

Follow BACKEND_INTEGRATION_GUIDE/API_CONTRACT. Supply approved ERD/DTOs/roles/assignment rules/rubric, real authentication/password hashing/email/token delivery/rate limits/session revocation, server-side authorization, private file storage/scanning, transactional constraints/capacity/idempotency/history and concurrency. Implement a client API adapter satisfying InternLinkService; map DTOs once, retain visible failures/conflicts, never silently use synthetic data on API error. Actual server/database implementation and security certification are outside this delivery; exact compatibility remains UNVERIFIED.

## Verification handoff

Use TEST_REPORT for current test counts/results and INTERFACE_UPDATE_GAP_ANALYSIS for each updated interface. Original 16 defect repairs remain in DEFECT_REGISTER; historical independent reports/evidence are preserved. Internal tests include new native account/permissions/upgrade/attendance cases plus original regressions and real cross-role browser journeys without storage-edit shortcuts. Coverage is bounded; Firefox/WebKit, exhaustive screen-reader/manual WCAG, OS quota/eviction endurance, physical printing, real email and multi-device synchronization are not verified. The owner will request the separate final targeted independent review; it has not been performed here.
