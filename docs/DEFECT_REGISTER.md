# Defect register

Original reviewed commit: **d71e7265dbb2d136a0ea7f5f08c13e6b24278ba2**. Initial source audit completed before application repairs. Entries below preserve the original observed behavior; current dispositions will be appended after verification. No production backend absence is treated as a front-end defect.

Initial findings: **0 critical,1 high,11 medium,1 low**. Status vocabulary: Open / Fixed / Partially fixed / Unverified / Accepted limitation / Outside front-end scope.

## IV-01 — MEDIUM — Persistence

- Status: **Open**; requirements: FND-002.
- Original location: `app/lib/storage.ts:81`.
- Reproduction: Seed an IndexedDbStore, make put throw QuotaExceededError, then read existing data.
- Expected: Existing records remain readable without a write.
- Observed: read() executes a readwrite transaction and put; a failed write prevents reading unchanged records.
- Impact: Read availability and unnecessary full-Blob rewrites.
- Recommended repair: Use validated readonly reads; initialize atomically only when absent.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Reproduced against original reviewed source; repairs not yet applied.

## IV-02 — MEDIUM — Temporal state

- Status: **Open**; requirements: FND-001; OPP-005; SET-001.
- Original location: `app/lib/commands.ts:785`.
- Reproduction: Seed at 2032-04-15 and inject that clock into DemoService; inspect availability and a student default year.
- Expected: Availability uses the service clock; default year follows scoped records.
- Observed: Projection uses real current time; defaultPreferences falls back to2026 even when records belong to2032.
- Impact: Deterministic verification and future-year role views are inconsistent.
- Recommended repair: Pass clock through projection and derive unset year preferences from relevant records.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Reproduced against original reviewed source; repairs not yet applied.

## IV-03 — MEDIUM — Student access

- Status: **Open**; requirements: AUTH-002; OPP-003.
- Original location: `app/lib/commands.ts:809`.
- Reproduction: Sign in as student@example.test and open /dashboard/internships/opp-3.
- Expected: Unapproved unrelated posting is unavailable; own application history remains accessible.
- Observed: Company-level projection includes another Pending Approval posting and detail URL displays it.
- Impact: Unapproved posting visibility through ordinary navigation.
- Recommended repair: Restrict student projection to eligible postings or their own application references.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Reproduced against original reviewed source; repairs not yet applied.

## IV-04 — MEDIUM — Command boundary

- Status: **Open**; requirements: FND-003; FND-004.
- Original location: `app/lib/commands.ts:92`.
- Reproduction: Execute an unknown runtime command through DemoService.
- Expected: Reject with VALIDATION and leave state unchanged.
- Observed: Returns an empty successful result and writes revision/receipt/activity.
- Impact: False success at typed service runtime boundary.
- Recommended repair: Add a fail-closed default command branch.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Reproduced against original reviewed source; repairs not yet applied.

## IV-05 — MEDIUM — Idempotency

- Status: **Open**; requirements: FND-002; FND-003.
- Original location: `app/lib/service.ts:169`.
- Reproduction: Save a requirement, then reuse its request key with a different requirement body.
- Expected: Reject incompatible reuse; unchanged retry returns its original result.
- Observed: Returns the first ID as success for a different operation that never occurred.
- Impact: Misleading service success and ambiguous retries.
- Recommended repair: Bind receipts to deterministic command fingerprints, including attachment bytes.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Reproduced against original reviewed source; repairs not yet applied.

## IV-06 — MEDIUM — Hours/completion

- Status: **Open**; requirements: PRG-003; PLC-007.
- Original location: `app/lib/rules.ts:146`.
- Reproduction: Create four reviewed reports of0.7/0.1/0.1/0.1 hours for a1-hour placement with other obligations fulfilled.
- Expected: Total1, remaining0, completion allowed.
- Observed: Binary addition leaves0.9999999999999999; percent displays100 while completion rejects. UI also rejects non-quarter fractions the service accepts.
- Impact: Inconsistent totals and blocked fractional completion.
- Recommended repair: Use a shared stable hour sum and consistent positive-fraction form constraints.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Reproduced against original reviewed source; repairs not yet applied.

## IV-07 — MEDIUM — Maintenance validation

- Status: **Open**; requirements: STU-006; PAR-003; OPP-002; SET-001.
- Original location: `app/lib/commands.ts:123`.
- Reproduction: Save student/company/opportunity with academicYear not-a-year.
- Expected: Reject a malformed year before persistence.
- Observed: Record is saved despite format hint and cannot be selected as a valid preference.
- Impact: Malformed data and inconsistent filtering/settings.
- Recommended repair: Share academic-year format/consecutive-year validation across writes.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Reproduced against original reviewed source; repairs not yet applied.

## IV-08 — MEDIUM — Contact validation

- Status: **Open**; requirements: PAR-003; PAR-006.
- Original location: `app/lib/commands.ts:173`.
- Reproduction: Save company/supervisor telephone ----- .
- Expected: Require a usable digit-bearing contact value.
- Observed: Punctuation-only text passes the phone expression.
- Impact: Invalid contact information advertised as validated.
- Recommended repair: Centralize a documented basic phone-format guard including digit count.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Reproduced against original reviewed source; repairs not yet applied.

## IV-09 — MEDIUM — Storage integrity

- Status: **Open**; requirements: FND-001; FND-002.
- Original location: `app/lib/integrity.ts:4`.
- Reproduction: Persist a NaN submitted grade, null receipt, or duplicate account/profile association in separate corrupted fixtures.
- Expected: Read fails explicitly as STORAGE_UNAVAILABLE, without reseeding.
- Observed: Integrity accepts these structures; invalid grades or later raw exceptions reach application behavior.
- Impact: Corruption recognition and error handling gaps.
- Recommended repair: Validate numeric finiteness, receipt structure and profile uniqueness before use.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Reproduced against original reviewed source; repairs not yet applied.

## IV-10 — HIGH — Concurrent forms

- Status: **Open**; requirements: FND-002; STU-007.
- Original location: `app/components/AppProvider.tsx:92`.
- Reproduction: Open same student edit form in two tabs; A changes email and saves, B changes surname and saves stale values after broadcast refresh.
- Expected: Reject stale save, preserve input, allow deliberate reload/retry.
- Observed: Provider refresh advances mutation revision while uncontrolled form inputs stay old; B saves successfully and overwrites A email.
- Impact: Silent loss of another supported tab edit, including linked login contact.
- Recommended repair: Keep form snapshot revision independent of background refresh, advance only after own successful mutation, provide explicit reload.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Reproduced against original reviewed source; repairs not yet applied.

## IV-11 — MEDIUM — Authentication navigation

- Status: **Open**; requirements: AUTH-001; NAV-002; APP-005.
- Original location: `app/components/Workspace.tsx:18`.
- Reproduction: While signed out open /dashboard/placements/create?application=app-002 and sign in.
- Expected: Return to the same contextual placement form.
- Observed: Redirect drops query, then shows Choose an accepted application.
- Impact: Broken contextual login/deep-link flow.
- Recommended repair: Preserve pathname and complete query in the sign-in destination.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Reproduced against original reviewed source; repairs not yet applied.

## IV-12 — LOW — Documentation

- Status: **Open**; requirements: FND-007.
- Original location: `docs/TEST_REPORT.md:60`.
- Reproduction: Compare output excerpt with retained Vitest JSON.
- Expected: Excerpt and counts agree.
- Observed: Excerpt says79 passed (78); actual run reports79 of79.
- Impact: Inaccurate verification documentation.
- Recommended repair: Correct typo and distinguish historical implementation evidence from current audit runs.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Reproduced against original reviewed source; repairs not yet applied.

## IV-13 — MEDIUM — Edit/contract compatibility

- Status: **Open**; requirements: STU-007; FND-003.
- Original location: `app/features/Students.tsx:118`.
- Reproduction: Render edit form for a valid string-contract program/year absent from the three/two hardcoded options.
- Expected: Existing metadata remains selected and can be preserved.
- Observed: Select becomes empty; required edit cannot preserve the existing program/year.
- Impact: Loss-prone maintenance and unnecessary coupling to seed options.
- Recommended repair: Include current/registered values in option lists without inventing an approved academic catalog.
- Evidence: `docs/evidence/independent/baseline-adversarial-final.json; baseline-component.json; baseline-independent-browser.json; source inspection as applicable`.
- Verification: Reproduced against original reviewed source; repairs not yet applied.
