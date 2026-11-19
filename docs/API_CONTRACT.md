# API contract — draft for backend agreement

**There is no existing API integration or approved API specification in this repository.** All routes/payloads below are proposed interface examples, not working endpoints or database facts. Do not build production behavior against them until the backend owner confirms the ERD/DTO/session/upload contract. An unavailable API must produce an error, never synthetic success.

## Interface and transport conventions

Use typed asynchronous services shared by demo and API adapters. Proposed result: `{ ok: true, data, revision? }` or `{ ok: false, error: { code, message, fieldErrors?, requestId? } }`. Proposed stable codes include VALIDATION, UNAUTHENTICATED, FORBIDDEN, NOT_FOUND, CONFLICT, POLICY_UNCONFIGURED, STORAGE_UNAVAILABLE and NETWORK_ERROR. UI should not parse English text for decisions. REST transport candidates use JSON, opaque IDs, ISO dates/timestamps and `{items,total,page,pageSize}` list responses; pagination limits and endpoint prefix/version remain unapproved. Decode/validate unknown JSON, map DTOs once, and never trust TypeScript annotations as runtime validation.

List query proposal: `q`, `studentId`, `companyId`, `opportunityId`, `placementId`, `status`, `academicYear/termId`, `sort`, `page`, `pageSize`. UI URL keys may differ; one explicit mapper translates them. Specify allowed enum values, invalid-query response and sort tie-breaker. Distinguish total filtered records from global summary totals. Use cancellation for superseded reads and visible retry for failed reads. Do not automatically retry a mutation without idempotency support.

## Candidate resource operations

| Candidate HTTP operation | Intent / minimum payload / important response |
| --- | --- |
| `POST /auth/session`, `GET /auth/session`, `DELETE /auth/session` | Sign in/current active account/sign out. Email/password only over backend-approved transport; session response exposes identity, role and permitted scope, never password/hash. Provider, cookies, expiry, CSRF and refresh unapproved. |
| `GET/POST /students`, `GET/PATCH /students/{id}` | Create fields: studentNumber, firstName, lastName, email, program, yearLevel, section. Server unique constraints; returns saved Student and id. Account creation separate until agreed. |
| `GET/POST /companies`, `GET/PATCH /companies/{id}` | Name, industry, address, contact person/email/number, MOA dates or approved agreement DTO; return saved record and computed partnership info. |
| `GET/POST /companies/{id}/supervisors`, `PATCH /supervisors/{id}` | Company-scoped supervisor profile/account association; never allow assignment to unrelated company. Provisioning invitation/credentials out of scope until approved. |
| `GET /faculty` | Registered faculty choices scoped to coordinator permissions; precise registration/edit API not specified by PDF. |
| `GET/POST /requirements`, `GET/PATCH /requirements/{id}` | Name, description, Mandatory/Optional; classification/version/term ownership needs agreement. |
| `GET/POST /submissions`, `GET /submissions/{id}` | Student, requirement, approved upload reference and version; return metadata/current status and permission-safe preview mechanism. Submission/resubmission ownership must be specified. |
| `POST /submissions/{id}/review` | `{decision: Approved|Rejected, reason?, expectedRevision}`; reject requires reason, authenticated authorized reviewer derived from session; response includes reviewer/time and updated submission/checklist. |
| `GET/POST /opportunities`, `GET/PATCH /opportunities/{id}` | CompanyId, positionTitle, description, positive slots; approval/state managed according to approved policy. |
| `POST /opportunities/{id}/approve` | Conditional operation only if approval required. Authenticated approver, expected revision; pending items unavailable to students. |
| `GET/POST /applications`, `GET /applications/{id}` | Student/opportunity relationship and real checklist/capacity; creation required for related student flow, portal UX still unapproved. |
| `POST /applications/{id}/decision` | `{decision: Accepted|Rejected, reason?, expectedRevision}`; backend validates permissions, legal transition/eligibility/availability and atomically writes decision/slot effects per policy. Return authoritative application and affected revision. |
| `GET/POST /placements`, `GET /placements/{id}` | Create: applicationId, startDate, endDate, requiredHours, facultyAdviserId, companySupervisorId, expected revision/idempotency key. Server derives student/company/opportunity/approver/status/id; validates accepted/duplicate/relationship/date/eligibility/capacity constraints transactionally. |
| `GET/POST /placements/{id}/progress-reports`, `GET /progress-reports/{id}` | Date/period, tasks, hours, optional attachment reference if approved; current assignment permissions. Avoid studentId-only association. |
| `POST /progress-reports/{id}/review` | Approved review command shape pending policy; authenticated reviewer/time, expected revision, updated report plus authoritative aggregate. Review is not implicitly hours approval until agreed. |
| `GET/POST /placements/{id}/evaluations`, `GET /evaluations/{id}` | Evaluator from session/assignment, grade/comments/date according to rubric; Pending/Submitted; at most two and authorized assigned evaluator. No student self-evaluation endpoint without scope approval. |
| `GET /placements/{id}/completion`, `GET /placements/{id}/certificate` | Read actual completion/certificate data; certificate number and issueDate only when record exists. Issuance endpoint intentionally undecided because authority/conditions unavailable. |
| `GET /dashboard`, `POST /reports/query` | Derived summaries or filtered category/term/company/status dataset plus generation timestamp. Seven categories in PDF p.21. Export format/server versus browser generation to agree. |
| `GET/PATCH /me/preferences` | Only approved effective preferences; authorization and per-user/term scope. No user role/account identity edits through preferences. |

These examples may become backend routes, same-origin Next route handlers or service calls; choose after backend topology is known. Do not add both a redundant Next CRUD API and a separate backend without reason.

## Transaction examples and failures

CreatePlacement command example (synthetic opaque identifiers):

```json
{
  "applicationId": "demo-application-accepted-1",
  "startDate": "2027-01-04",
  "endDate": "2027-04-30",
  "requiredHours": 486,
  "facultyAdviserId": "demo-faculty-1",
  "companySupervisorId": "demo-supervisor-1",
  "expectedRevision": 7
}
```

486 is an example from the PDF, not a universal required-hours policy. Request must not carry trusted `approvedBy`, derived company, synthetic certificate number or arbitrary status. Server must reject non-accepted application, existing placement for that application, unrelated supervisor, unregistered faculty, invalid hours/dates and policy violations. A 409 should include a safe conflict code and allow reread. The same command repeated with an agreed idempotency key returns the existing result or defined conflict, never a duplicate placement. Define rollback/slot restoration for every failed transaction.

## Uploads, authorization and agreement checklist

Agree multipart versus signed upload, file size/MIME allowlist, scanning, private storage/access, preview/download authorization, expiring URL lifetime, failed-upload cleanup and retention. API file URLs are not permanent public links. Backend validates all file metadata/content and access; demo Blob previews do not prove production upload works.

Every list/detail/command enforces active account, role and assigned record/company/student scope on the server. Proposed HTTP semantics: 400/422 invalid input, 401 no session, 403 unauthorized, 404 absent, 409 constraint/revision conflict, 5xx safe service error. Confirm exact status/envelope and avoid leaking existence of forbidden records where policy forbids it. Grade/evaluation permissions and reviewer authority remain subject to approved matrix.

External agreement needed: base URL/version; schema and identifiers; auth/session/CORS/CSRF; role matrix; transaction/slot/eligibility policies; dates and timezone; rubric; term scoping; pagination; upload/retention; idempotency/revisions; error DTOs; export formats; test environment and synthetic accounts. No credentials should be committed to satisfy any of these dependencies.
