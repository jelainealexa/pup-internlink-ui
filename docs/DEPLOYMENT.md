# Front-end publication and Vercel deployment

## Current publication and live deployment — 2026-11-21

**GitHub publication: PASS. Public Vercel deployment: PASS.** The GitHub permission was updated, the separate branch was pushed successfully, and Vercel CLI authorization completed as `rjcfajardo`. The initial access failures recorded later in this document are historical and superseded by this section.

| Item | Verified current value |
| --- | --- |
| Repository | https://github.com/jelainealexa/pup-internlink-ui |
| Published branch | https://github.com/jelainealexa/pup-internlink-ui/tree/frontend/final-release |
| Stable public production URL | **https://pup-internlink-frontend.vercel.app/** |
| Separate project / scope | `pup-internlink-frontend` / `rjcfajardo12` (existing Hobby allocation; no purchase) |
| Separate project ID | `prj_s26eQ5i0gcq9HmtB1hoN2RA9V60a` |
| Initial verified deployment | `dpl_5Hec8opezz7teDZMmYpPAvbXdy8p` |
| Initial deployed Git commit | `63d0e9fb8c3d0b8bca53238293c0d7d60b4d549c` |
| Initial immutable deployment URL | https://pup-internlink-frontend-99r83tajz-rjcfajardo12.vercel.app/ |
| Final deployed Git commit | `5aef1d3ca44c2dd40e34198843747bca9ce0424f` (verified from Vercel metadata; published on the release branch) |
| Final production deployment | `dpl_52yTRErceG6AVJVrjBBu7z3ywitq`, READY, production |
| Final immutable deployment URL | https://pup-internlink-frontend-d4lg41yh0-rjcfajardo12.vercel.app/ |
| Final repository HEAD | A later documentation/evidence-only descendant; no runtime/config/package changes after the deployed commit. Use `git log -1` for its identity. |
| Runtime source | Identical to refined port3000 release `9bfa4dc`; no application/business/authentication/persistence changes during publication |
| Framework / Node / root | Next.js /24.x /repository root |
| Install / build | `npm ci --ignore-scripts --no-audit --no-fund` / `npm run build` |
| App environment variables | None required. CLI-generated local OIDC environment file was removed; no token was committed or exposed. |
| Vercel login required for visitors | No; production and immutable URLs returned HTTP200 without redirects or credentials |
| Git integration / automatic deployments | **BLOCKED / NOT CONFIGURED**; CLI Git connection failed for this Vercel account. Current deployments are explicit CLI deployments. |

The first deployment of a new project was automatically assigned to production by Vercel, even without `--prod`; this occurred only in the newly created project. Deployment protection was set to `ssoProtection: null` only on this new public synthetic-demo project. The existing project serving `pup-internlink-ui.vercel.app` was not changed or promoted. GitHub's existing integration also built a login-protected branch preview under the old project; it is not the new public URL above.

### Live verification and deployment packaging

- Fresh unauthenticated HTTP requests to both returned URLs received HTTP200 and the PUP InternLink title without Vercel login redirects.
- `node scripts/deployment-smoke.mjs https://pup-internlink-frontend.vercel.app docs/evidence/publication/live-smoke.json`: **5/5 role journeys PASS, zero page errors**. Verified the actual inline Eye/Eye Off control, each published demo account, dashboards, direct navigation, saved preferences after refresh and390px layout in isolated browser contexts.
- Full production suite against this actual HTTPS origin: **52/52 PASS** (49 desktop Chromium/3 mobile,367.11 seconds,0 failed/skipped/flaky), executed against initial deployed commit `63d0e9f`. The final packaging revision changes no runtime source and receives a fresh cloud build, upload-input inspection and all-five-role smoke verification. The earlier local clean gates remain132 native/52 browser tests, lint, typecheck and production build PASS, with427 local packages installed.
- Vercel cloud build completed successfully with Next16.4.6 and the configured install/build commands. Linux installed426 packages; local Windows installed427. Existing non-failing warnings included ESLint9 deprecation and Vercel's npm `cache-dir` environment setting.
- Source-file inspection of the initial CLI deployment revealed generated `.next-e2e`, `test-results` and `playwright-report` inputs. These were synthetic test/build artifacts from the isolated release worktree, not owner browser data. Added explicit `.vercelignore` exclusions for generated build/test directories, environment/authentication files, logs and owner PDFs. The final source tree has **zero actual files under the excluded paths**, verified from the Vercel file API. Empty directory metadata remains for three paths; it contains no uploaded artifacts. Cloud download count changed from1933 to472 input files. No existing deployment was deleted.
- The final packaging deployment completed its own cloud production build. Fresh all-five-role smoke verification again passed with zero page errors. **All9 final route/password/desktop/mobile browser checks passed** (0 failed/skipped/flaky), recorded in `final-live-checks.log` and its summary. Full52-case live results remain attributed to the initial deployment, whose application/package/configuration source is identical to the final deployment except for the upload ignore rules and documentation/evidence.

Final evidence: `vercel-final.json` pins the exact deployed Git SHA/project/aliases, `final-upload-check.json` records file exclusions, `final-live-smoke.json` records actual account/persistence checks, and `preservation-live.json` records unchanged original/optimized worktrees and the original site's unchanged asset fingerprint. The final handover/evidence commit is intentionally not redeployed: it changes documentation and JSON/log evidence only. This distinction avoids claiming that evidence generated after deployment was present in that earlier build.

### Updating this separate project

Work only in `D:/Orca/Workspace/pup-internlink-ui-release` on `frontend/final-release`; preserve the two application worktrees. Run the documented clean install/lint/typecheck/native/build/browser gates for relevant changes, commit and push normally. Inspect `.vercel/project.json` before deployment: its project ID must match the new project ID above. The directory is ignored and must never be committed.

```powershell
Set-Location D:/Orca/Workspace/pup-internlink-ui-release
git push origin frontend/final-release
npm exec --yes --package=vercel@66.5.0 -- vercel whoami
npm exec --yes --package=vercel@66.5.0 -- vercel deploy --prod --scope rjcfajardo12
node scripts/deployment-smoke.mjs https://pup-internlink-frontend.vercel.app test-results/live-smoke.json
```

Record the returned deployment ID/URL and its `meta.gitCommitSha`; do not substitute a guessed host. For full live regression set `PLAYWRIGHT_BASE_URL=https://pup-internlink-frontend.vercel.app` before `npm run test:e2e` and remove that variable afterward. Do not deploy uncommitted runtime changes or use a dirty package/lockfile.

Automatic deployment is not implied by a GitHub push. The Vercel-connected Git account/app must first receive repository access; after that, connect **only this new project**, set its Production Branch Tracking to `frontend/final-release`, and verify a real push-to-deployment transition. The failed CLI Git connection was not bypassed with credentials, an alternate repository or changes to the original project.

The five public synthetic accounts below use **InternLink!2026** and have now been verified on the new live origin: coordinator@example.test, student@example.test, faculty@example.test, company@example.test and supervisor@example.test. IndexedDB/files/session state remain browser-profile/origin-local; production, immutable deployment URLs and localhost do not synchronize. No real email delivery, centralized database, backend integration or production security is claimed.

## Historical preparation status — 2026-11-20

**Publication: BLOCKED by GitHub write permission. Deployment: BLOCKED by missing Vercel authentication. No new project, production URL or preview URL has been created. No deployed commit exists for this release.**

| Item | Actual state |
| --- | --- |
| Repository | https://github.com/jelainealexa/pup-internlink-ui |
| Release branch | `frontend/final-release`, local only |
| Release worktree | `D:/Orca/Workspace/pup-internlink-ui-release` |
| Source candidate | `9bfa4dc8c8f6bfe7f556dc86169e80d985e2c7f9`, the refined port3000 version; runtime/test changes originally tested at `ceb64b7fc8647155993ada3ec67b42548dadf6b7` |
| Final local release commit | This document's commit, obtainable with `git rev-parse frontend/final-release`; only deployment documentation, evidence and read-only verification tools differ from the source candidate |
| Final deployed commit | None; publication/deployment blocked |
| Vercel project | `pup-internlink-frontend` is the preferred name, not an existing or reserved new project |
| Stable production URL | Not available; no URL invented |
| Preview URL | Not available |
| Git connection / automatic deployment | Not configured; requires authorized GitHub/Vercel access |

The release branch was created from the committed refinement in a separate worktree so clean installation/builds would not disturb the applications on3000/3001. Its application, package, lockfile, Next configuration and TypeScript configuration remain identical to `9bfa4dc`.

### Exact access blockers

The existing GitHub connection reports `push: false`, and CLI repository metadata also reports no push permission. The actual Git transport check:

```text
git -c credential.interactive=false push --dry-run origin frontend/final-release:refs/heads/frontend/final-release
remote: Permission to jelainealexa/pup-internlink-ui.git denied to lumilumiere.
fatal: unable to access 'https://github.com/jelainealexa/pup-internlink-ui/': The requested URL returned error: 403
```

No remote branch was created. GitHub permits forks, but no fork, alternate repository or pull request was created because the requested destination is this repository's separate release branch. The owner must grant repository Write access to the intended publishing identity (`lumilumiere` is the identity used by the denied transport), or sign in locally with another account already authorized to write. An owner can alternatively push this prepared local branch from an authorized environment. Never paste credentials or tokens into chat or tracked files.

Vercel CLI was not globally installed. Ran the scoped, pinned CLI through npm's cache:

```powershell
npm exec --yes --package=vercel@66.5.0 -- vercel whoami
```

Result: `Logged out.` The dashboard opened at `https://vercel.com/login?next=%2Fdashboard`, not an authenticated project list. GitHub's browser page also showed Sign in. No `.vercel/project.json` existed in the selected source/release workspace; no original project was linked or modified. An owner must sign in to the intended existing Vercel account/team before creating the new project. No temporary/claim-later deployment, new service account, paid plan or subscription was used as a workaround.

## Local release checks

Freshly executed in the release worktree, Node24.15.0/npm11.12.1, Next16.4.6/React19.3.0. Playwright uses installed Chromium1248. Logs and machine results are in [evidence/publication/](evidence/publication/).

| Command/check | Actual result |
| --- | --- |
| `npm ci --ignore-scripts --no-audit --no-fund` | PASS;427 packages installed from existing lockfile |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS;132 tests across11 files:55 unit/7 component/70 integration |
| `npm run build` | PASS; production build |
| `npm run test:e2e` | PASS;52/52 production browser tests in4.7 minutes,49 desktop Chromium/3 mobile;0 failed/skipped/flaky |
| `node scripts/deployment-smoke.mjs http://localhost:3000 docs/evidence/publication/target-3000-smoke.json` | PASS;5 role journeys,0 page errors; actual inline eye toggle, credentials, dashboard, direct navigation, saved preferences after refresh and390px layout |
| New public HTTPS origin | UNVERIFIED; no deployment exists |

The full existing browser suite includes the persisted internship lifecycle, five-role posting/assignment/application decisions, activation/recovery, requirements/files, placements, attendance/weekly approval, faculty remarks, evaluations/completion, reports, upgrade, concurrency and responsive checks. Local results are not represented as tests of an unavailable Vercel deployment. Warnings: existing ESLint9 deprecation during install and `NO_COLOR`/`FORCE_COLOR` subprocess notices; no dependency upgrade was needed or introduced.

### Publication hygiene and preservation

`node scripts/publication-audit.mjs` checks tracked paths, selected token/private-key patterns, preserved worktrees and the original deployed asset manifest. It never prints matched secret contents. The initial scan found no tracked dependency/build directories, environment files, Vercel configuration/authentication files, keys or token-pattern matches. Only `tests/fixtures/audit-document.pdf` is tracked: this is the synthetic attachment test fixture, not an owner PDF. Both owner-supplied PDFs remain untracked in the original workspace and are absent from this clean release worktree. No real personal data was introduced; active seed records use fictional names and `example.test` email addresses. Pattern scanning is not an exhaustive privacy/security certification.

Protected state:

- Original localhost:3000 worktree: `frontend/reference-refinement`, HEAD `9bfa4dc8c8f6bfe7f556dc86169e80d985e2c7f9`, no tracked changes; still running.
- Original functional baseline: `frontend/interface-update` at `e9028f9f05d6a6de0cd387701b0089a6f2d626ae`.
- Optimized localhost:3001 worktree: `frontend/ui-ux-optimized`, HEAD `8963402b81c6b297b25b3102e6408125a574efeb`, clean; existing process preserved.
- Local main: `2d846774c6dfbc61d675331145bd7b82b301e5a4`; actual remote main at review start: `aae8d8781c3cbb44094e1aa8dcabc398d913514c`. Remote main was already ahead; it was not fetched into or merged with local main, and no write to main was attempted.
- Existing Vercel site: https://pup-internlink-ui.vercel.app/dashboard . Only read-only requests were made. Before/after public asset-manifest fingerprints are recorded; account-level deployment identity/settings cannot be independently inspected while logged out.

## Resume publication after access is supplied

1. Sign in locally with repository Write access and the intended Vercel account/team. Verify both identities and permissions before publishing. Vercel authentication: `npm exec --yes --package=vercel@66.5.0 -- vercel login`, then `vercel whoami` through the same scoped invocation. The login requires the owner's authentication; do not pass tokens in shell text or commit them.
2. Enter the release worktree. Review `git status`, `git log -1`, `git remote -v` and `git ls-remote --heads origin frontend/final-release`. If the remote branch appeared independently, inspect its history and choose a unique release branch if needed. Do not overwrite it.
3. Push only the intended new branch:

```powershell
Set-Location D:/Orca/Workspace/pup-internlink-ui-release
git push --set-upstream origin frontend/final-release
git rev-parse HEAD
git ls-remote origin refs/heads/frontend/final-release
```

The two commit identifiers must agree. Only then is `https://github.com/jelainealexa/pup-internlink-ui/tree/frontend/final-release` a real published branch URL; it is currently an intended destination, not a published deliverable.

### New Vercel project only

Create a separate project in the authenticated account, using `pup-internlink-frontend` only if available. If unavailable, choose an unused distinct name; do not reuse an existing project without verifying ownership and purpose. Do not change the project serving `pup-internlink-ui.vercel.app` or move its domains.

| Setting | Intended value |
| --- | --- |
| Framework | Next.js |
| GitHub repository | `jelainealexa/pup-internlink-ui` |
| Production branch / Production environment Branch Tracking | Actual published release branch, normally `frontend/final-release` |
| Root directory | Repository root (`.`) |
| Node.js |24.x, compatible with existing `engines` range |
| Install command | `npm ci --ignore-scripts --no-audit --no-fund` |
| Build command | `npm run build` |
| Output directory | Framework default `.next` |
| Environment variables | None required for browser-local demonstration mode; do not supply production secrets or enable an unavailable API adapter |
| Plan | Existing free allocation only; stop if a purchase is required |

Connect only this new project to GitHub and set its Production environment Branch Tracking to the release branch. Verify the selected branch/SHA before the first deployment or promotion, since Vercel's default production branch may be main. [Official Git deployment/branch documentation](https://vercel.com/docs/git).

For CLI deployment, use `vercel link` through the pinned scoped invocation from the release worktree and explicitly select the new project. Inspect the resulting ignored `.vercel/project.json` and authenticated scope before running a deployment. If it identifies the original project, stop; do not deploy there. Deploy a preview with `vercel deploy`, verify its actual returned URL, and only then deploy the same reviewed release to the new project with `vercel deploy --prod`. [Official CLI deployment workflow](https://vercel.com/docs/projects/deploy-from-cli).

Do not assume a name implies a particular URL; use the actual alias/URL returned by Vercel. Public access must be checked without a signed-in Vercel account. If protection blocks public access, adjust only the new project's settings within its existing free-plan permissions; do not purchase an upgrade or bypass another project's access controls.

### Live acceptance and automatic updates

After a real successful deployment, replace the unavailable metadata above with the returned project identity, production/preview URLs and exact deployed Git SHA. Confirm that SHA equals the remote release branch. Run in a clean browser profile:

```powershell
node scripts/deployment-smoke.mjs https://ACTUAL-RETURNED-HOST test-results/live-smoke.json
$env:PLAYWRIGHT_BASE_URL = 'https://ACTUAL-RETURNED-HOST'
npm run test:e2e
Remove-Item Env:PLAYWRIGHT_BASE_URL
```

The host in this example is deliberately a placeholder, not a claimed deployment URL. Verify unauthenticated public access, all five logins/navigation, eye icons, IndexedDB initialization, real saved operations after refresh, attachments, representative forms, direct routes, styling, console errors and responsive layouts. Review the full suite and actual live logs before marking production PASS. Never substitute protected CLI access for the requested public-browser check.

Once the Git connection and Production Branch Tracking are actually configured, pushes to that branch should trigger this new project's production deployments. That behavior is currently NOT CONFIGURED/UNVERIFIED; confirm it with a real subsequent push and matching deployment SHA. Future changes must stay on the release branch, pass the checks above, be committed and pushed normally; no force push or main merge. Keep deployment metadata accurate after each promotion.

## Demonstration accounts and backend boundary

Public synthetic password for these fresh seeded accounts: **InternLink!2026**.

| Role | Email |
| --- | --- |
| OJT Coordinator | `coordinator@example.test` |
| Student | `student@example.test` |
| Faculty Adviser | `faculty@example.test` |
| Company Supervisor | `company@example.test` |
| Intern Supervisor | `supervisor@example.test` |

These accounts were verified locally, including the actual running target on3000. They have not been verified on a new HTTPS deployment because none exists. New accounts/activation and reset links remain simulated local operations; no email is delivered. HTTPS supports the required browser APIs, but actual Vercel-origin behavior remains unverified until deployed.

IndexedDB records/files and demonstration sessions belong to one browser profile and origin. Localhost3000, localhost3001, a preview domain and a production domain do not share data automatically. Clearing browser storage deletes that local demonstration data. Do not enter real student information or production credentials into this public demonstration.

The backend team remains responsible for real authentication/authorization, provisioning policies, secure invitations/recovery/email, schema/API reconciliation, database constraints and transactions, concurrency/idempotency, private file storage and full-stack/security testing. Existing proposed contracts in API_CONTRACT/BACKEND_INTEGRATION_GUIDE remain proposed; this deployment task adds no backend or database.
