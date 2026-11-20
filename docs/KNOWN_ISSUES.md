# Current known issues and operating limits

Interface-update source checkpoint 7f2873a on frontend/interface-update. Current internal gates are in TEST_REPORT; final independent review is postponed. Previous 16 findings remain historically Fixed in DEFECT_REGISTER with their original evidence; this does not automatically certify the update. Final full regression/build passed (TEST_REPORT); internal readiness is limited to tested demonstration scope.

| Item | Classification | Limit / receiving-team action |
| --- | --- | --- |
| Approved ERD/API/rubric/assignment/provisioning policy | BLOCKED externally / exact compatibility UNVERIFIED | AUTH-004 requires institutional agreement; local invitation/activation is functional. Resolve D-043–052 before real integration. |
| Actual backend/database/production security | NOT APPLICABLE to front-end delivery | No server/database/production auth/email/private file infrastructure; implement and validate externally. |
| Local invitation/reset mechanism | Accepted demonstration limitation | Links/codes work only in the same origin/profile, not email. Inspectable local UUID requests/verifiers cannot prove ownership. No production token-security claim. |
| Password verifier | Accepted demonstration limitation | No plaintext new password persisted; existing lightweight verifier is not a production adaptive password hash. Public seeded/new staff credentials are synthetic. |
| Legacy supervisor migration | Accepted explicit compatibility policy | Old operational accounts become Intern; no privilege escalation. Upgraded data has no auto-inserted admin; coordinator creates one deliberately without resetting. Reviewed hours retain original attribution/provenance. |
| Coordinator application authority | Specification conflict / reversible policy | Retained oversight uses same terminal decision; updated PDF does not clearly revoke it. Backend/institution must confirm authority. |
| Current adviser/Intern reassignment | Accepted demo policy | One current adviser; ongoing adviser conflict blocked. Pending company evaluation transfers in-place; submitted company evaluation freezes ongoing supervisor transfer. Historical records retained. |
| Attendance/report correction | Accepted bounded workflow | Reject/resubmit reports retains history; no silent attendance edits/deletion. Official attendance details, correction authority and frequency remain unapproved. |
| Origin/profile/device locality | Accepted limitation | Browser-local persistence, no shared server/cloud backup. Clearing/eviction can lose data. Supported same-origin tab/restart persistence is tested, cross-device is not claimed. |
| Whole-snapshot stale conflicts | Accepted limitation | Unrelated changes can require warned reload/re-entry. No automatic stale field merge. |
| Legacy/bounded receipts and activities | Accepted compatibility/retention rule | Old receipts without fingerprints readable but cannot safely replay; latest 200 receipts/300 normal activity events are not permanent production audit. Embedded attempts/decisions preserved. |
| Reset cross-store failure | Accepted limitation | Session clears first; failed later replacement may sign out with records intact. Never auto-reseed valid data. |
| Hours/grades/calendar | Accepted reversible demo precision | Shared compensated12-significant-digit hours; approved hours for completion; grade 0–100 without pass/weight policy; UTC date boundaries. Agree institutional rules. |
| Files/viewers/scanning | Bounded tested behavior | Real TXT/PDF/PNG/JPEG Blobs/bytes, metadata and download; MIME/content guards are not malware scanning. Native PDF viewer varies; download available. |
| Volume/quota/endurance | UNVERIFIED beyond bounded regressions | Native failed-write/corrupt/upgrade rollback and1000-extra-student fixture exercised; no real OS quota exhaustion or endurance guarantee. |
| Browsers/accessibility/printing | UNVERIFIED beyond configured checks | Chromium desktop/mobile, selected axe/keyboard/print-media only. No Firefox/WebKit/manual screen-reader/full WCAG/physical paper certification. |
| Dependencies | LOW accepted maintenance limit | ESLint9.39.5 inherited deprecation; optional @emnapi/runtime1.11.3/@img/sharp-wasm32@0.35.5 marked extraneous by npm ls, which exits0. No new dependency/security certification. |
| Optional excluded functions | NOT APPLICABLE | Student self-evaluation, separate directory export, optional deadline/program restrictions and actual server integration remain excluded; updated role portals and modality filters are now specified, not excluded. |

Use only synthetic data on localhost/HTTPS. API mode fails explicitly, with no fallback. Current source has no known unresolved reproduced mandatory front-end defect after targeted repairs; final full regression43/43 and build passed. This statement does not assert defect absence or independent certification.
