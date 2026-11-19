# Developer handover

This is a functional, independently demonstrable **front-end**, not a connected production system. Start with README for install/accounts/reset, ARCHITECTURE for code ownership, DATA_MODEL for relationships, BUSINESS_RULES/DECISION_LOG for assumptions, API_CONTRACT/BACKEND_INTEGRATION_GUIDE for replacement and TEST_REPORT for actual evidence.

## Route inventory

Every route is an explicit Next page; the module selector composes client features and does not implement server endpoints. Unknown/forbidden record IDs show a consistent record state; unknown routes use not-found. Async dynamic parameters follow installed Next documentation.

| Route group | Concrete supported patterns |
| --- | --- |
| Authentication/overview | `/`, `/dashboard` |
| Students | `/dashboard/students`, `/create`, `/[id]`, `/[id]/edit` |
| Partners | `/dashboard/partners`, `/create`, `/[id]`, `/[id]/edit`, `/[id]/supervisors/create`, `/[id]/supervisors/[supervisorId]`, `/[id]/supervisors/[supervisorId]/edit` |
| Requirements | `/dashboard/requirements`, `/create`, `/[id]/edit`, `/submissions/create`, `/submissions/[id]`; query view selects the submission directory |
| Opportunities | `/dashboard/internships`, `/create`, `/[id]`, `/[id]/edit` |
| Applications | `/dashboard/applications`, `/create`, `/[id]` |
| Placements | `/dashboard/placements`, `/create?application=<id>`, `/[id]` |
| Progress | `/dashboard/progress`, `/create?placement=<id>`, `/[id]` (placement context; legacy student context resolved), `/reports/[id]` |
| Evaluation/report/settings | `/dashboard/evaluations`, `/[id]`; `/dashboard/reports`; `/dashboard/settings` |

Suffixes in each row extend its first base path. Source inventory is the authoritative list under app/**/page.tsx. Filters are URL-based q/student/company/opportunity/adviser/status/program/year/section/sort where the relevant module exposes them; query keys are UI context, not an approved REST contract. Dashboard links set supported filter keys. Academic-year preference supplies the default module scope. Browser back/forward/detail refresh tested.

## Role permissions

| Role | Demonstration access/actions |
| --- | --- |
| Coordinator | All directories/maintenance, document review, posting approval/closure, application decisions, placement creation/termination/completion, report review, certificate metadata, seven reports, own settings/reset. Cannot submit an assigned evaluator's evaluation. |
| Student | Own profile/checklist/files/applications/placements/reports/evaluations/completion; available opportunities; own document/application/progress submission; own settings. |
| Faculty Adviser | Assigned student/placement/progress/checklist context, authorized requirement/progress review and own assigned faculty evaluations; own settings. |
| Company Supervisor | Own company/supervisor and assigned interns/placements/progress, own company evaluation and progress remarks; no unrelated companies/students/documents; own settings. |

Complementary views use shared routes and scoped service data and are clearly labelled demonstration extensions. Both UI and command services check roles/assignments. All client restrictions require server equivalents; they are not secure against browser-owner tampering.

## Data/service ownership

AppProvider owns asynchronous loading/errors/current account and shared snapshot; module state holds inputs/selection/generated report snapshots only. Domain writes go through InternLinkService.execute; rule/integrity modules validate. IndexedDbStore owns atomic transactions and Blob persistence. Sign-out clears the simulated session; it does not erase records. Eight-hour expiry is refreshed by provider checks. The same browser origin/profile shares one data store/session across tabs, not independent real users/devices.

Seed initialization is deliberate and idempotent on ordinary reads. Settings reset requires exact RESET DEMO and coordinator; corrupt-version recovery is explicit from login. Existing files/attempt/history are retained. Version 1 has no automatic migration; agree a versioned migration/export strategy before extending saved contracts. Receipts/events are bounded and are not permanent server audit logs.

## Receiving-team work

Actual backend endpoints, approved ERD/migrations/constraints, real authentication/authorization, account invitations, private file storage/scanning, server report scaling, institutional rubric/completion/certificates and deployment remain outside this front-end delivery. Follow BACKEND_INTEGRATION_GUIDE; never replace failed API calls with fixtures. The unavailable API adapter is intentional, not a connected implementation.

Before handover acceptance, independently run npm ci, typecheck, lint, npm test, npm run test:e2e and build/start; repeat the full lifecycle with role switching using only synthetic files. Check conflicting/stale/repeated submissions, invalid dates/hours/foreign keys, unavailable capacity, assignment restrictions, CSV injection/filters and persistence. Expand to Firefox/WebKit/manual assistive technology and real backend concurrency when available. See KNOWN_ISSUES for precise unverified boundaries.

Git checkpoints are local on frontend/complete-demo. Retrieve exact final HEAD with `git rev-parse HEAD` and implementation history with `git log --oneline audit/phase-0-baseline..HEAD`. No push or merge into main is authorized. The supplied PDF remains preserved untracked with its recorded hash.

Implementation history: `10d77a3` establishes the connected persistent front-end and tests; `5bec604` repairs dashboard/queue/year/near-completion filters; `b2282e6` preserves valid records on session-storage recovery errors; `251410a` fixes fast keyboard search synchronization with real-keystroke regressions. The subsequent documentation checkpoint carries the final handover and exact verification evidence. No application changes follow 251410a.

The owner-supplied PDF is preserved locally and remains untracked. The extracted 23-page specification text is versioned in docs/evidence; obtain the original PDF from its owner when reviewing original diagrams. Running the front-end does not require the PDF (fresh archive tests ran without it).
