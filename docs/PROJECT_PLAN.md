# Front-end project plan

The autonomous complete-front-end instruction supersedes the earlier Phase 0 stop and any plan for actual backend implementation. The original Phase 0 documentation checkpoint is `d679d264a80c5ebf88829488d0580e7c0eed2880`. Work is on `frontend/complete-demo`; local main is preserved. Functionality and consistency take priority over visual changes.

| Stage | Delivered result / boundary |
| --- | --- |
| 0. Repository audit and baseline | Entire supplied PDF and prototype audited; historical findings in REPOSITORY_AUDIT and baseline evidence. |
| 1. Core application foundation | Normalized types, integrity checks, IndexedDB transaction adapter, service boundary, validation, deterministic synthetic seed/reset. |
| 2. Authentication and navigation | Simulated active-account sign-in/session/logout, protected route shell, scoped views/actions, valid routes/URL filters. |
| 3. Students and industry partners | Durable create/edit, unique identifiers/contacts, linked profiles/accounts, company-scoped supervisors. |
| 4. Requirements management | Definitions, actual Blob submissions, immutable attempts, review attribution, checklists and eligibility. |
| 5. Opportunities and applications | Approval/closure, availability, student applications, durable decisions/history and contextual placement action. |
| 6. Placements | Accepted application context, registered assignments, duplicate/capacity guards, transactional obligations. |
| 7. Progress and evaluations | Daily reports/review, submitted/reviewed hours, assigned two-evaluation model, completion and certificate metadata. |
| 8. Dashboard, reports and settings | Derived summaries/links, seven reports/CSV/print, per-account effective preferences. |
| 9. Additional role interfaces | Minimal labelled demonstration extensions using the same services; full unapproved role products remain outside scope. |
| 10. Backend readiness | Typed service and proposed HTTP contracts, explicit unavailable API adapter, receiving-team replacement guide. Actual backend/server/database integration excluded. |
| 11. Final audit and handover | Automated suites, production-browser lifecycle, persistence, lint/type/build and clean-install evidence; documentation and local commits. |

Stage completion means front-end demonstration behavior supported by the recorded tests, not production security or database approval. See TEST_REPORT for exact gates and KNOWN_ISSUES for limits. No feature scope is hidden behind a rendering-only success claim.

Receiving-team priorities: approve ERD/rules/rubric/permissions; implement server transactions/auth/private storage; replace adapter and execute the same contract/lifecycle tests against the real service. Independently repeat browser and accessibility checks, including Firefox/WebKit and screen readers. Push, merge, backend work and production deployment require separate authorization.

## Verification release checkpoint

Original d71e726 challenged;16findings repaired/verified at 7ca502cc6260232619570b2ee945da5f5c13145b. Confirmed mandatory demonstration workflows complete under RELEASE_READINESS. Earlier roadmap backend implementation is superseded by the front-end-only boundary: future approved backend integration belongs to the receiving team, not hidden remaining work in this release.
