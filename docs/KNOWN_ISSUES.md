# Known issues and operating limits

Reviewed candidate **7ca502cc6260232619570b2ee945da5f5c13145b**. All sixteen reproduced audit product findings are Fixed with regression evidence. No known open critical/high/medium/low product defect prevents mandatory demonstration scope. This bounded assessment does not establish exhaustive defect absence; original symptoms remain in DEFECT_REGISTER.

| Item | Classification | Limit / receiving-team action |
| --- | --- | --- |
| Actual backend/database/security | Outside front-end scope / NOT APPLICABLE | No real shared server/security boundary. Implement server enforcement before real users/data. |
| Approved ERD/API/rubric/permissions/provisioning | UNVERIFIED; AUTH-004 BLOCKED externally | Exact compatibility cannot be established; reconcile proposed contracts and assumptions. |
| Origin/profile/device locality | Accepted limitation | Data/session are local; no cloud sync/backup. Clearing/eviction can lose data. |
| Whole-snapshot conflicts | Accepted limitation | Stale writes reject; unrelated changes may require warned reload/re-entry. No automatic field merge. |
| Legacy idempotency receipts | Accepted compatibility rule | Old snapshots remain readable; receipt without fingerprint cannot safely replay. Review saved records and use a new key. Bounded receipts/events are not permanent audit. |
| Reset cross-store failure | Accepted limitation | Session clears before destructive replacement; a later failed database write may leave the user signed out with records intact. |
| Numeric hours | Accepted demonstration precision | Shared compensated sums normalize twelve significant digits. Approved timekeeping precision/rubric still required. |
| Storage/file-volume/performance | UNVERIFIED beyond bounded checks | Native failed-write/corruption/retry simulations and 1,000-extra-student functional fixture pass; no OS quota exhaustion or file-volume endurance benchmark. |
| Files/viewers/scanning | Bounded PASS / unverified native viewer | TXT/PDF/PNG/JPEG bytes persist/download; image decoding checked. Native PDF plug-in varies; download available. MIME/size guards are not malware scanning/content authentication. |
| Browsers/manual accessibility/physical print | UNVERIFIED | Desktop/mobile Chromium and selected axe/keyboard/print-media pass. Firefox/WebKit/manual screen reader/full WCAG/physical paper not certified. |
| Parallel browser timing | UNVERIFIED | Exploratory two-worker39/40 failed background navigation. Foreground harness corrected, target3/3 and configured one-worker40/40 pass. Failure/trace retained. |
| Dependency maintenance | LOW accepted maintenance limitation | ESLint9.39.5 deprecated warning retained. Optional @emnapi/runtime1.11.3 and @img/sharp-wasm32@0.35.5 appear extraneous after build; npm ls exits0. No dependency security certification. |
| Full role/admin products, optional metadata/self-evaluation | NOT APPLICABLE | Minimal related role workflows are verified; no full unapproved invitation/password-reset/admin/self-evaluation/certificate document issuance claimed. Student report CSV exists; separate optional directory export not claimed. |

Use localhost or HTTPS with IndexedDB/localStorage/Web Crypto. API mode fails explicitly until an approved adapter is supplied; never silently falls back to demo data. BUSINESS_RULES and DECISION_LOG D-016–042 record reversible policies. Same agent repaired and verified changes; recommend targeted fresh-context review.
