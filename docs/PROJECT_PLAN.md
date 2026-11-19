# PUP InternLink project plan

Phase 0 completed 2026-11-19 against upstream `aae8d87`. This plan authorizes no feature changes by itself. Functionality and linked records take precedence over redesign. Preserve the Next/React/TypeScript stack and reuse verified interactions.

## Roadmap and exit gates

| Phase | Scope | Exit evidence / dependencies |
| --- | --- | --- |
| 0. Repository audit and baseline | Source/PDF/browser audit, requirements, model/contract proposals, test baseline and local documentation commit | This document set, exact commands/logs, preserved user PDF and local main. Complete with external specification limitations recorded. |
| 1. Core application foundation | Explicit demo/API mode boundary, normalized synthetic seed, typed async services, persistence/version/reset handling, shared validation and business-rule interfaces, foundational tests | Same synthetic mutation survives reload and updates all consumers; API mode cannot read demo storage; storage failures visible; no unsupported database schema asserted. Resolve ID/mapping and persistence design first. |
| 2. Authentication and navigation | Demo identity explicitly labelled, production auth adapter seam, active-account/role/record guards, sign-out, all module destinations and URL contract | Anonymous/inactive/incorrect-role and direct-URL cases tested. API authentication remains externally blocked until actual service exists. Missing modules may show truthful status until their phase. |
| 3. Students and industry partners | Durable create/edit/detail, uniqueness, filters, profile hubs, MOA details, supervisor registration inside Company Profile | Reload and duplicate tests; company/account associations; student/company related-record isolation. |
| 4. Requirements management | Master requirements, submission files/checklists, review/rejection reason/reviewer, incomplete mandatory indicator | File read/reload and ownership checks; resubmission/eligibility decision approved. |
| 5. Opportunities and applications | Durable opportunities, approved conditional policy, related applicants, contextual filters, accepted/rejected transaction and reason | Persist decision; consistent header/list/profile; actual availability/eligibility; audit metadata. Resolve slot/approval policy. |
| 6. Placements | Accepted-application creation, correct readonly context, assignment/date/positive-hour/duplicate checks, detail hub | Atomic save/ID/redirect; same-company supervisor; no duplicate application placement; capacity policy tested. |
| 7. Progress monitoring and evaluations | Placement-specific reports/reviews, computed hours and review queues, assigned company/faculty evaluations, completion summary | Review propagates; two-evaluation cap; hour/grade/completion rules approved and tested. |
| 8. Dashboard, reports and settings | Derived dashboard/link filters; seven report categories and filter/export/print; approved persistent effective settings | Report totals reconcile with records; term boundaries; privacy-safe exports; settings visibly affect application. |
| 9. Additional role portals within approved scope | Student submissions/applications/reports; adviser/supervisor assigned records and evaluation submission | First approve portal acceptance requirements/permission matrix. Full portals are proposed scope, not implied by coordinator screens. |
| 10. Backend integration | Agreed ERD/IDs/DTOs/auth/upload/API adapter, server-enforced rules, real integration tests | Approved contract; test API/environment; no fallback to fixtures; mapping/reconciliation and concurrent-write tests. |
| 11. Final audit and handover | End-to-end scenarios A-D, security/accessibility/regression checks, seed/reset/setup documentation, limitations | Reproducible fresh install/lint/typecheck/build/tests; zero unresolved release-blocking findings; demo/production claims accurate. |

Phases are ordered priorities, not estimates. No dates or effort totals are fabricated. Use small dedicated branches; no work or merges into main without a later explicit instruction. Each phase should update requirement status, test evidence, decisions and development status together.

## Work management

Coordinator is primary scope. The project owner/instructor provides approved ERD and policy decisions; front-end implementer owns service/UI tests; backend team owns server authorization, database constraints and API contract approval. These are proposed responsibilities, not assigned named individuals. Track issues by stable IDs in KNOWN_ISSUES and requirements IDs. Complete a vertical workflow through persistent demo storage before expanding to the next module. Keep public demo data entirely synthetic. Do not add notifications, student self-evaluation, account self-registration, certificates issuance or third-party integrations without approved scope.

## Recommended Phase 1 slice

Start with missing baseline lint fixes, domain IDs and seed integrity, explicit `demo`/`api` composition root, a small typed service/result contract, transactional demo snapshot persistence and schema version, reset and corrupt/quota error handling, validation, and isolated persistence/selector tests. Convert one read plus a synthetic mutation as a foundation proof; defer full student CRUD to Phase 3. Decide authoritative eligibility/hour rules before encoding them. Do not implement production login against fake credentials or present simulated session guards as backend security.

Phase 1 entry: review decisions D-003 through D-008 and questions BR-Q01 through BR-Q18. Unresolved backend details block production integration, not isolated demo infrastructure. Any temporary demo policy must be explicitly labelled, configurable, tested and recorded in DECISION_LOG rather than described as approved ERD behavior.
