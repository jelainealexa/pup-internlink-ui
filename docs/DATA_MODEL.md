# Data model assessment and proposal

**No approved ERD or SQL schema was supplied.** This is a front-end domain proposal for review, not a database schema, migration, or approved table list. PDF page references identify evidence; external ERD references in the PDF are secondary. Backend names, key types, nullability, indexes, cascade/delete policies and cardinalities must be mapped after receipt of the approved design.

## Current model

`app/lib/mockData.ts` exports Student, Application, Placement and ProgressReport types plus five/three/three/five fixtures. Student.id doubles as official student number; full name repeats first/last name. Student placement/company/position/status/hour fields repeat Placement information. Application has studentId but company/opportunity names rather than foreign keys and repeated profile fields. Placement has studentId but no applicationId, companyId, opportunityId, adviserId, supervisorId, approver or certificate relation. ProgressReport has studentId, not placementId, and only a string date, hours, task, remarks and reviewStatus.

Company/Opportunity/Evaluation live in independent page-level arrays/maps. Evaluation is a per-student checklist, not a scored record by an assigned evaluator. Several display and sort dates duplicate each other as strings. Term/account/role/document/requirement/submission/MOA/faculty/supervisor/certificate entities are absent. No persistence, primary-key enforcement or relationship validation exists.

## Candidate entities and relationships

| Candidate | Fields needed by observed specification | Evidence / unresolved constraints |
| --- | --- | --- |
| UserAccount | opaque id, email, active state, role reference(s) | PDF p.1; credentials/session representation backend-owned. One versus multiple roles unresolved. Never store plaintext passwords in demo/domain snapshots. |
| Student | id, studentNumber, firstName, lastName, email, program reference/name, yearLevel, section, optional account reference | pp.3-4; studentNumber/email unique. Whether id equals official number and when account is created unresolved. Display name derived. |
| FacultyMember / Coordinator identity | id, userAccount reference, display/contact info, role assignments | pp.9,16,20; faculty must be registered. Faculty directory fields and coordinator relationship not specified. Do not invent a new approved faculty table. |
| Company | id, name, industry, address, contactPerson/email/number | pp.5-7; name/contact email unique. Partnership relation/status policy below. |
| Partnership/MOA | id if separately modeled, companyId, startDate, endDate, optional document reference | pp.6-7; embedding one MOA versus agreement history unconfirmed. Status derived using approved policy/clock, not fixture strings. |
| CompanySupervisor | id, companyId, userAccountId, name/contact data | p.7: exactly one registered company and associated user account. Account/profile lifecycle unknown. |
| Requirement | id, name, description, classification Mandatory/Optional | pp.8-10; uniqueness, required-per-program/term and retirement/version policy unknown. |
| Submission | id, studentId, requirementId, fileId, submittedAt, status Pending/Approved/Rejected, reviewerId, reviewedAt, rejectionReason | pp.9-10; one current submission versus immutable attempts needs decision. Retain versions if resubmission approved. |
| File reference | opaque id, safe filename, MIME, size, storage reference, owner/context | Needed for uploaded documents p.9; provider/limits/access URL rules external. Blob only in local demo adapter. |
| Opportunity | id, companyId, positionTitle, description, slots/capacity, approved/status info | pp.10-12; slots >0 on creation; approval conditional. Deadline/program/setup fields currently in UI are not explicit required creation fields in PDF. Treat them as retained provisional metadata. |
| Application | id, studentId, opportunityId, submittedAt, status Pending/Accepted/Rejected, rejectionReason, decisionBy/At | pp.12-14; company derived from opportunity; uniqueness across student/opportunity and state reversal policies unknown. Decision actor/time proposed audit metadata. |
| Placement | id, applicationId, startDate, endDate, requiredHours, status Ongoing/Completed/Terminated, facultyAdviserId, companySupervisorId, approvedBy if recorded | pp.15-17: unique application placement, system ID/status. Student/opportunity/company derived from application. Multiple student placements/assignment history unresolved. |
| ProgressReport | id, placementId, submissionDate/time, hours, tasks, supervisorRemarks, review info | pp.18-19; placement foreign key proposed to avoid mixing repeat placements. Approved/submitted hours policy and review states not fully defined. No undocumented opening balance. |
| Evaluation | id, placementId, evaluatorAccount/profile reference, evaluationDate, grade, comments, status Pending/Submitted | pp.19-20: max two per placement; authorized assigned company supervisor/faculty adviser. Type derived from role/relation, not an extra evaluatorType field. One per role needs explicit confirmation. |
| Completion / Certificate | placementId, eligibility/completion metadata; certificate number and issueDate when issued | p.17,23; separate completion/certificate tables versus embedded fields and issuing authority unconfirmed. Never derive existence from Completed status alone. |
| AcademicTerm | id/year/term boundaries if approved | Year-filtered reports p.21 and prototype year display imply scope; exact ownership and term enrollment model unspecified. |
| Preferences | actorId, approved term/landing/density/reminder/accessibility choices | Settings listed p.1 only; details are prototype/proposed, not approved business fields. |

Store demo collections keyed by opaque stable IDs with explicit references. Treat backend IDs as opaque strings at the UI boundary until mapped; do not assume UUIDs, auto-increment numbers, slug keys or official student numbers. Distinguish public/student/certificate numbers from internal IDs. No production identifier format is approved by this document.

## Derived views and integrity

Student placement/hours/status, company intern counts, opportunity applicants/capacity, dashboard totals, progress percentages and evaluation completion must be selectors over related records scoped to term and actor. Render dates from a single ISO value, not separate sort strings. Date-only internship/MOA boundaries remain `YYYY-MM-DD`; audit timestamps use timezone-aware instants. Confirm business timezone and inclusive date boundaries before implementation.

Use positive finite required hours; remaining = max(required minus counted rendered, 0). Completion = counted rendered / required * 100 for valid positive required hours. The PDF example 243/486 = 50% is explicit; rounding, overrun, daily caps, opening balances and counting reviewed versus submitted reports remain open. Preserve raw aggregate even if visual bars cap at 100%. Never hide inconsistent historical data with arbitrary defaults.

Validate every foreign key on demo commands; production database/API enforces equivalent authoritative constraints. Duplicate student/email/company/application-placement and evaluation-limit constraints must survive concurrent requests. No cascade deletes are proposed: deletion/archival and retention rules require approval. Do not use names as joins or mutable profile values as foreign keys.

Before backend work, produce an approved mapping with front-end field, ERD entity/column, API DTO, key/type/nullability, status enumeration, ownership and migration decision. If the ERD conflicts with this candidate model, document the conflict and revise this proposal rather than silently altering approved schema.
