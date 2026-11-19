<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## PUP InternLink project guidance

- Read `docs/DEVELOPMENT_STATUS.md`, `docs/HANDOVER.md`, `docs/REQUIREMENTS.md`, `docs/BUSINESS_RULES.md` and `docs/DECISION_LOG.md` before changes. Complete-front-end authorization superseded the historical Phase 0 stop; actual backend/server/database implementation remains outside scope.
- Preserve the generated Next block. Read relevant installed node_modules/next/dist/docs guides before framework-dependent changes, including async params and navigation/history conventions.
- Preserve user changes and the supplied PDF; use a dedicated branch. No push, force-push, destructive Git operation or merge/changes to main without explicit authorization. Do not stage the supplied untracked PDF silently.
- Keep Next/React/TypeScript/CSS and existing /dashboard/internships URLs. Prioritize interconnected functionality over redesign.
- Domain contracts live in app/lib/domain.ts; all domain writes go through InternLinkService/commands.ts. Do not add page-local mutable fixture arrays, duplicate derived counters or pretend success.
- IndexedDbStore is demo-only. Preserve existing saved data; validate schema/references, use atomic writes and visible errors; reset only after the deliberate confirmed action. Never silently fall back from API failures to demo data.
- No approved ERD/API/rubric/permission matrix was supplied. Keep proposed contracts and demo policies explicitly labelled; update decision log and tests when changing assumptions. Use only fictional records/public synthetic credentials, never real student data or secrets.
- Role-aware UI is simulated access control. Backend must enforce every permission/constraint/file access before real use. API mode must remain explicitly unavailable until a real approved adapter exists.
- Preserve existing server processes. Use INTERNLINK_DIST_DIR for isolated build/start directories and free ports for tests. Never run recursive deletes against unchecked paths.
- Run npm run typecheck, npm run lint, npm test, relevant Playwright tests and production build after changes. Do not disable meaningful checks or weaken assertions. Update requirement traceability/status/issues/test evidence together; report only executed results.

- Domain SaveForms must receive the loaded database revision and pass the captured revision into mutate; never authorize stale uncontrolled inputs using a newer background snapshot. Preserve conflict input and deliberate reload behavior.
- Preserve readonly storage access and command-bound idempotency receipts. Run the independent audit regressions in addition to the existing suites. Verification reports must distinguish original d71e726 findings from repaired candidate evidence and disclose self-verification.
