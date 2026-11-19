<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## PUP InternLink project guidance

- Read `docs/DEVELOPMENT_STATUS.md`, `docs/PROJECT_PLAN.md`, `docs/REQUIREMENTS.md`, `docs/BUSINESS_RULES.md`, and `docs/DECISION_LOG.md` before further development. Phase 0 is audit/documentation only; begin later phases only when requested.
- Preserve this generated Next.js block. Consult installed `node_modules/next/dist/docs/` for the APIs being changed; do not assume older routing, params, or configuration conventions.
- Preserve user changes and the supplied specification. Work on a dedicated branch; do not modify/merge into main, force-push, or push without explicit authorization.
- Reuse working Next/React/TypeScript/CSS code; prioritize linked functionality over redesign. Keep Opportunities under existing `/dashboard/internships` URLs unless explicitly approved otherwise.
- The approved ERD, schema, API specification, permission matrix and evaluation rubric were not available at Phase 0. Candidate models/contracts in docs are proposals. Record conflicts/questions rather than inventing approved database rules.
- Keep synthetic demonstration data/storage and production API behavior explicitly isolated. Never fall back to mock success on API failure. Component state or validation messages are not persistent functionality. Use synthetic contacts/data only; keep credentials and real personal data out of fixtures/logs.
- Keep business rules and relationship validation in typed services when implemented. Preserve student/company/opportunity/placement context through navigation. Only report successful writes after real adapter persistence.
- Run checks appropriate to changes and record exact outcomes. Baseline lint fails three errors; build/typecheck pass; no test suite existed. Never label unexecuted or unavailable tests as passed. Update requirement status, traceability, issues and test evidence together.
- Preserve existing server processes. On Windows, isolated source copies/worktrees avoid SWC and `.next` locks during installation/build checks. Audit harnesses under `docs/evidence/*.cjs.txt` are documentation; copy to a temporary `.cjs` to run with external Playwright tooling.
