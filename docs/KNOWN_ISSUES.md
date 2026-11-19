# Known limitations and issue disposition

The original prototype's critical/high issues (placeholder login, disconnected data, nonpersistent decisions, absent requirements/reports, fake certificate/metrics, invalid links/context/relationships) have been replaced by functional browser-local workflows. Historical audit findings remain in REPOSITORY_AUDIT and commit d679d264. They are not current missing-feature assertions.

| Severity / deliverable | Status | Remaining limitation / action |
| --- | --- | --- |
| Production security/data sharing | NOT APPLICABLE to current front-end scope | No backend/auth/database/private server file storage. Browser profile owner can inspect/tamper with local data. Server enforcement required before real users/data. |
| Institutional model/policy approval | BLOCKED externally | Approved ERD/SQL/API/role matrix/rubric absent; implemented demo policies require receiving-team agreement. Front-end demonstration is independently operable. |
| Cross-browser/manual accessibility | UNVERIFIED | Automated desktop/mobile Chromium, selected axe and keyboard checks passed. Firefox/WebKit, assistive technology and exhaustive manual WCAG audit not executed. |
| Browser persistence scope | PASS within tested scope | Navigation/reload/cross-tab/supported Chromium profile restart tested. Origin/profile local only; browser clearing/eviction/private-mode restrictions can lose data. No cloud sync/backup/migration feature. |
| Storage scale/quota | UNVERIFIED at scale | Atomic snapshot including ≤5MB files is appropriate for academic fixtures, not benchmarked for large file/student volumes. Errors remain visible; no destructive automatic reseed. |
| Attachment processing | PASS for tested TXT bytes / constrained browser preview | Actual Blobs persist and download. PDF/image preview depends on browser support; download remains available. MIME metadata checks are not server content scanning. No production antivirus/OCR/upload service. |
| Reports/printing | PASS for tested snapshot CSV/print behavior | Export matches generated filtered rows; regenerate after mutations. Physical printing/page-break behavior across browsers/printers not certified. |
| Faculty/account administration | NOT APPLICABLE | Registered seed faculty/coordinators supported; no unapproved full admin/invitation/password-reset interface. New student/supervisor synthetic provisioning is functional. |
| Optional expansions | NOT APPLICABLE | Dedicated student-directory export (student report export exists), deadline/program/setup metadata policy, student self-evaluation, full additional role products and certificate document issuance are not approved requirements. |
| Dependency maintenance | LOW / disclosed | Clean npm install warns that ESLint 9.39.5 is no longer supported. Existing Next/ESLint major stack was preserved; lint still passes. Schedule a separately verified compatible upgrade. No dependency security certification is claimed. |

Run on localhost or HTTPS so browser Web Crypto is available. Remote plain HTTP is outside the supported demonstration environment. Session-storage read failures now propagate without treating valid saved records as damaged; a regression verifies the records remain unchanged.

No known unaddressed critical/high defect remains in the exercised front-end demonstration workflows. That statement is bounded by TEST_REPORT, not an assertion of exhaustive defect absence.

Repairs found during development: Node type peer mismatch resolved compatibly; component test locator type fixed; generated build dirs excluded from source lint; accessible navigation names and text contrast corrected after axe failures; fast filter reset/sort race repaired using current URL/native history; scoped availability derives before hiding other students' placements; audit actor names included in authorized projections; malformed session JSON clears safely; supervisor document eligibility avoids a misleading incomplete result when documents are outside its scope. Several initial E2E failures were ambiguous selectors/hydration timing; assertions were made specific to actual semantic controls and persisted outcomes rather than weakened.
