# Requirements traceability

Baseline aae8d87. Requirement statuses/acceptance are canonical in REQUIREMENTS.md and evidence/requirements-inventory.json. `T-*` IDs are planned tests, not executed test passes. B01-B16 are executed characterization observations. Source inspection establishes absence/local-state behavior but is not equivalent to a runtime acceptance test.

## Specification coverage

| Specification section / pages | Requirements | Existing coverage / important gaps |
| --- | --- | --- |
| Login/roles/navigation p.1 | AUTH-001..004; NAV-001..003; SET-001..003 | Login placeholder; coordinator unguarded; eleven nav items but two missing routes. Settings details provisional. |
| Dashboard pp.1-2 | DSH-001..004 | Static data; recommended sections not final. |
| Students pp.3-5, illustration p.4 | STU-001..009 | Search/sort/filter/read hub; create/edit not durable; export optional. |
| Partners pp.5-8, illustration p.7 | PAR-001..007 | Read fixtures; MOA/supervisors/company maintenance absent. |
| Requirements pp.8-10 | REQ-001..008 | Missing entire module; submission eligibility versus approval unresolved. |
| Opportunities pp.10-12 | OPP-001..006 | Local read pages; no create/edit/approval; applicant link wrong. |
| Applications pp.12-14, illustration p.13 | APP-001..006 | Read/filter and temporary decisions; no durable write. |
| Placements pp.14-17 | PLC-001..008 | Read/filter/create validation; no persistence/assignment transaction/certificate record. |
| Progress pp.17-19, equation p.18 | PRG-001..006 | Read/filter/review UI; totals independent; schedule absent. |
| Evaluations pp.19-20 | EVA-001..005 | Checklist substitutes for individual evaluations; missing grades/assignments/max-two enforcement. |
| Reports pp.20-21 | RPT-001..004 | Missing route and all categories/outputs. |
| Connections pp.21-22 | NAV-002; DSH-003; STU-008; PAR-005; OPP-004; APP-005; PLC-006 | Partial valid links; context ignored in progress/evaluations/partners and opportunity query. |
| Scenarios A-D pp.22-23; flow diagram p.23 | Related module IDs above; ROLE-001..004 | Student applies/submits reports and assigned evaluators contribute; full portal UX unspecified; self-evaluation absent. |
| User Tasks 3-7 / architecture and reliability | FND-001..009; AUTH-004; REQ-007; PLC-008 | Cross-cutting enabling requirements and unresolved external policies explicitly identified. |

## Scenario and connection checks

| Scenario / navigation | Current conclusion | Executed / required evidence |
| --- | --- | --- |
| A: dashboard → student search/profile → applications/placement/progress/evaluations | Search/read/direct placement/progress links work for fixtures; Requirements missing and evaluation context lost. | B02-B03/B11-B12, full route matrix; future T-STU-008 and T-NAV-002. |
| B: company create → profile → supervisors → opportunity create | Blocked at create (404); supervisor workflow absent. | 404 matrix/source; future T-PAR-003/005/006 and T-OPP-002. |
| C: pending application → checklist/slots → accept/reject | UI decision works locally, header/list/placement do not share result; mandatory checklist fabricated. | B06-B07; future T-APP-003/004 and T-REQ-006. |
| D: accepted application → placement setup/save → progress/evaluations/completion/certificate | Setup basic checks work; no save/ID/redirect; review nonpersistent and completion/certificate not actual records. | B08-B09/source; future T-PLC-002..007, T-PRG-004, T-EVA-004. |
| Dashboard summary/attention/quick actions | Some destinations work; Requirements, Partner create, Opportunity create fail; evaluation pending query ignored. | All route results and B11-B12; future T-DSH-003. |
| Company profile → supervisor/opportunity/placements | Only Accenture example links; no supervisor detail or complete scoped lists. | Source/route links; future T-PAR-005..007. |
| Opportunity → Applicants → application | Software Angela label opens Joshua's record; other related records omitted. | Source and browser captured hrefs/headings; future T-OPP-004. |
| Application → student; accepted → matching create/cancel | Student link matches shared studentId; query context supported, but status handoff fails. | B06/B08 and recorded hrefs; future T-APP-005. |
| Placement → student/progress/evaluations | Student/progress correct; evaluations shows all students despite query. | Route matrix/B12; future T-PLC-006. |
| Progress → report review/student/placement | Correct fixtures; review changes only dialog and resets. | B09/route matrix; future T-PRG-004. |
| Reports → generated results/export/print | Missing. | 404 matrix; future T-RPT-001..004. |

## Requirement-to-test index

Every row below has a required future test and evidence pointer. No automated acceptance suite existed at baseline. Bounded verified statuses apply only to stated fixture behavior; other gaps remain in their own requirements.

| Requirement | Source | Status | Planned test | Baseline evidence |
| --- | --- | --- | --- | --- |
| AUTH-001 | PDF p.1 | Placeholder | T-AUTH-001 | B01 |
| AUTH-002 | PDF pp.1,20 | Missing | T-AUTH-002 | B01; source |
| AUTH-003 | PDF p.1 login boundary; user Task 6 | Placeholder | T-AUTH-003 | source |
| AUTH-004 | PDF pp.1,7; user Task 7 | Blocked by external dependency | T-AUTH-004 | source |
| NAV-001 | PDF p.1 | Partially implemented | T-NAV-001 | B13; route matrix |
| NAV-002 | PDF pp.2,5,12,21-22 | Partially implemented | T-NAV-002 | B11-B12 |
| NAV-003 | User Tasks 3,6 | Partially implemented | T-NAV-003 | 48-route matrix |
| DSH-001 | PDF pp.1-2 (unfinished/recommended) | Placeholder | T-DSH-001 | source |
| DSH-002 | PDF p.2 (recommended) | Placeholder | T-DSH-002 | source |
| DSH-003 | PDF pp.2,21-22 | Partially implemented | T-DSH-003 | route matrix; B11-B12 |
| DSH-004 | PDF p.2 (recommended) | Placeholder | T-DSH-004 | source |
| STU-001 | PDF pp.3-5 | Partially implemented | T-STU-001 | B02; route matrix |
| STU-002 | PDF p.3 | Implemented and verified | T-STU-002 | B02; source |
| STU-003 | PDF p.3 | Partially implemented | T-STU-003 | B03; source |
| STU-004 | PDF p.3 | Implemented and verified | T-STU-004 | B03; default fixture order |
| STU-005 | PDF pp.3-4 | Partially implemented | T-STU-005 | B04 |
| STU-006 | PDF pp.3-4 | Partially implemented | T-STU-006 | B04 |
| STU-007 | PDF p.3 | Placeholder | T-STU-007 | B05 |
| STU-008 | PDF pp.4-5,21-22 | Partially implemented | T-STU-008 | route matrix; B12 |
| STU-009 | PDF p.3 (explicitly optional) | Proposed expansion | T-STU-009 | source |
| PAR-001 | PDF pp.5-6 (recommended columns) | Partially implemented | T-PAR-001 | route matrix; source |
| PAR-002 | PDF pp.5-6,21 | Missing | T-PAR-002 | B12 |
| PAR-003 | PDF p.6,23 scenario B | Missing | T-PAR-003 | route matrix |
| PAR-004 | PDF p.6 | Missing | T-PAR-004 | source |
| PAR-005 | PDF pp.7-8,22 | Partially implemented | T-PAR-005 | route matrix; source |
| PAR-006 | PDF pp.7-8 | Missing | T-PAR-006 | source |
| PAR-007 | PDF p.7 | Placeholder | T-PAR-007 | source |
| REQ-001 | PDF p.8 | Missing | T-REQ-001 | 404 matrix |
| REQ-002 | PDF pp.8-9 | Missing | T-REQ-002 | source |
| REQ-003 | PDF p.9 | Missing | T-REQ-003 | source |
| REQ-004 | PDF p.9 | Missing | T-REQ-004 | source |
| REQ-005 | PDF pp.9-10 | Missing | T-REQ-005 | source |
| REQ-006 | PDF p.10 | Missing | T-REQ-006 | source |
| REQ-007 | User Task 7; PDF pp.9-10 does not specify | Blocked by external dependency | T-REQ-007 | source |
| REQ-008 | PDF p.23 diagram; pp.9-10 | Missing | T-REQ-008 | source |
| OPP-001 | PDF pp.10-11 | Partially implemented | T-OPP-001 | route matrix |
| OPP-002 | PDF p.11 | Missing | T-OPP-002 | route matrix |
| OPP-003 | PDF p.11 (approval conditional) | Blocked by external dependency | T-OPP-003 | source |
| OPP-004 | PDF pp.11-12,22 | Partially implemented | T-OPP-004 | route matrix; source |
| OPP-005 | PDF pp.10-11,14 | Placeholder | T-OPP-005 | source |
| OPP-006 | Existing opportunity UI; user scope constraint | Implemented but unverified | T-OPP-006 | source |
| APP-001 | PDF pp.12-13 | Partially implemented | T-APP-001 | route matrix |
| APP-002 | PDF pp.12-13,22 | Partially implemented | T-APP-002 | B11 |
| APP-003 | PDF pp.13-14,23 | Partially implemented | T-APP-003 | B06 |
| APP-004 | PDF p.14,23 | Partially implemented | T-APP-004 | B07 |
| APP-005 | PDF p.14 | Partially implemented | T-APP-005 | B06; B08 |
| APP-006 | PDF p.23 flow diagram | Missing | T-APP-006 | source |
| PLC-001 | PDF pp.14-15 | Partially implemented | T-PLC-001 | B11; B16; source |
| PLC-002 | PDF pp.15-16 | Partially implemented | T-PLC-002 | B06; B08 |
| PLC-003 | PDF p.16 | Partially implemented | T-PLC-003 | B08 |
| PLC-004 | PDF pp.10,14,16 | Missing | T-PLC-004 | source |
| PLC-005 | PDF p.16 | Placeholder | T-PLC-005 | B08 |
| PLC-006 | PDF p.17,22-23 | Partially implemented | T-PLC-006 | route matrix; source |
| PLC-007 | PDF p.17,23 | Placeholder | T-PLC-007 | source |
| PLC-008 | PDF pp.14-15 status; user Task 7 | Blocked by external dependency | T-PLC-008 | source |
| PRG-001 | PDF pp.17-19 | Partially implemented | T-PRG-001 | B12; B16 |
| PRG-002 | PDF pp.18-19 | Partially implemented | T-PRG-002 | B09; route matrix |
| PRG-003 | PDF p.18 | Partially implemented | T-PRG-003 | source; B08 |
| PRG-004 | PDF p.19 | Partially implemented | T-PRG-004 | B09 |
| PRG-005 | PDF p.19 | Blocked by external dependency | T-PRG-005 | source |
| PRG-006 | PDF p.23 diagram; pp.18-19 | Missing | T-PRG-006 | source |
| EVA-001 | PDF pp.19-20 | Placeholder | T-EVA-001 | route matrix; source |
| EVA-002 | PDF pp.19-20,22 | Missing | T-EVA-002 | B12 |
| EVA-003 | PDF p.20 | Missing | T-EVA-003 | source |
| EVA-004 | PDF p.20 | Placeholder | T-EVA-004 | source |
| EVA-005 | PDF pp.19-20,23 diagram | Blocked by external dependency | T-EVA-005 | source |
| RPT-001 | PDF pp.20-21 | Missing | T-RPT-001 | 404 matrix |
| RPT-002 | PDF p.21 | Missing | T-RPT-002 | source |
| RPT-003 | PDF p.21; user reliability objective | Missing | T-RPT-003 | source |
| RPT-004 | PDF p.21 | Missing | T-RPT-004 | source |
| SET-001 | PDF p.1 lists Settings; detailed UI provisional | Placeholder | T-SET-001 | B10 |
| SET-002 | Existing prototype; user Task 3/6 | Placeholder | T-SET-002 | B10; B15 |
| SET-003 | PDF p.1 role rules; existing Settings UI | Placeholder | T-SET-003 | source |
| ROLE-001 | PDF p.23 limited flows; user Phase 9 scope | Proposed expansion | T-ROLE-001 | source |
| ROLE-002 | PDF pp.19-20; user Phase 9 scope | Proposed expansion | T-ROLE-002 | source |
| ROLE-003 | PDF pp.7,19-20; user Phase 9 scope | Proposed expansion | T-ROLE-003 | source |
| ROLE-004 | Existing evaluation checklist only; absent from primary PDF | Proposed expansion | T-ROLE-004 | source |
| FND-001 | User Tasks 5-6 | Partially implemented | T-FND-001 | source |
| FND-002 | User Task 6 | Missing | T-FND-002 | B04-B10 |
| FND-003 | User Task 6 | Missing | T-FND-003 | source |
| FND-004 | User Task 6; PDF pp.4,6,11,16,20 | Partially implemented | T-FND-004 | B04; B08 |
| FND-005 | User Task 6 | Partially implemented | T-FND-005 | B04-B10; B16 |
| FND-006 | User Tasks 3,6 | Partially implemented | T-FND-006 | B14-B15; source |
| FND-007 | User Task 4/6 | Partially implemented | T-FND-007 | current logs |
| FND-008 | PDF p.9; user Task 6 | Missing | T-FND-008 | source |
| FND-009 | User objective and Phase 10 | Blocked by external dependency | T-FND-009 | source |
