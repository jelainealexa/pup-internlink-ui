# Decision log

Date 2026-11-19. Statuses distinguish adopted audit handling from implementation proposals requiring later work. No proposed architecture was implemented in Phase 0.

| ID | Status | Decision / rationale | Consequences / revisit gate |
| --- | --- | --- | --- |
| D-001 | Adopted for Phase 0 | Documentation and audit evidence only; retain framework/UI and existing source. | No feature fixes, dependency upgrades, production integrations, push or merge into main. |
| D-002 | Adopted for Phase 0 | Create audit/phase-0-baseline from initial main; fetch and fast-forward only audit branch after discovering four newer commits. | Final application baseline aae8d87, local main stays 2d84677. Preserve older evidence as superseded. No existing tracked changes were overwritten. |
| D-003 | Proposed | Opaque internal IDs and normalized front-end relationships, DTO mapping rather than names as joins. | Final production mapping blocked on approved ERD; candidate entities are not approved tables. BR-Q01. |
| D-004 | Proposed | Small versioned IndexedDB demo snapshot/file adapter, explicit seed/reset/errors and transaction revision. | Validate complexity against academic needs in Phase 1; localStorage only for small preferences if needed. Test rollback/reload/quota/migration and isolation. |
| D-005 | Proposed | One typed async service seam; explicit demo/API composition with no fixture fallback. | Synthetic local behavior cannot impersonate real integration. API auth/DTO/transactions external. FND-003/009. |
| D-006 | Proposed | Keep App Router and current /dashboard/internships URLs; central route/query parser and service-owned business rules. | Resolve mount-only URL copying and contextual links using installed framework docs; avoid URL renames/redesign. |
| D-007 | Unresolved | Account/profile provisioning, role/assignment permissions and production session mechanism. | Approved lifecycle/matrix/API required. Demo identity is only a labelled simulation. BR-Q02/03. |
| D-008 | Unresolved | Mandatory submitted versus approved, opportunity approval, MOA eligibility, capacity consumption and multiple placements. | Owner/instructor/ERD agreement before encoding authoritative policies. BR-Q04/06/07/08/10. |
| D-009 | Unresolved | Hours/report schedule, grade rubric, completion, certificates, termination/cancellation. | Preserve explicit uncertainty; no invented passing grades, certificate issuance or 75% policy. BR-Q11..16. |
| D-010 | Proposed | Reuse current forms/filter/sort/review content, shared accessible fields/dialog/states; repair functional mobile defects without aesthetic redesign. | Unit/component/adapter/E2E tests cover meaningful workflows. |
| D-011 | Adopted for Phase 0 | Existing workspace server preserved; isolated git-archive copy used for clean lockfile/build/runtime checks after Windows EPERM. | Exact commands/warnings/paths retained. Scripts disabled on install; successful build does not erase failed lint. |
| D-012 | Adopted for Phase 0 | Native CUA unavailable; temporary external Playwright plus existing Chromium used for actual browser observation. | No application test dependency installed. Observation harness stored as .cjs.txt evidence so root lint does not treat it as product code. Native/cross-browser/accessibility limitations disclosed. |
| D-013 | Proposed / scope gate | Full student/adviser/supervisor portals, self-evaluation, detailed settings and optional student export require scope confirmation. | Related submissions/assigned evaluations specified by PDF are tracked separately; no unrelated portal features inferred. |
| D-014 | Adopted for Phase 0 | Preserve user PDF untracked; retain extraction/hash and provenance in docs rather than silently staging it. | PDF is required locally for visual rereview; approved document owner may later choose to version it. |
| D-015 | Adopted for Phase 0 | Assess audit completion separately from application readiness. | Phase 0 PASS with documented missing external specifications; application FAIL; backend integration blocked pending actual contract/environment. |

No decision above is recorded as owner-approved database design unless a later evidence link and approval date are added. Update this log when policies change and identify affected requirements/tests explicitly.
