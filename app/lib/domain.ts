export type Role =
  "Coordinator" | "Student" | "Faculty Adviser" | "Company Supervisor";
export type ApplicationStatus = "Pending" | "Accepted" | "Rejected";
export type PlacementStatus = "Ongoing" | "Completed" | "Terminated";
export type SubmissionStatus = "Pending" | "Approved" | "Rejected";
export type OpportunityStatus = "Pending Approval" | "Approved" | "Closed";
export type ReviewStatus = "Pending Review" | "Reviewed";
export type PartnershipStatus =
  "Pending" | "Active" | "Expiring Soon" | "Expired";

export interface Account {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  verifier: string;
}
export interface Student {
  id: string;
  accountId: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  program: string;
  yearLevel: string;
  section: string;
  academicYear: string;
}
export interface Faculty {
  id: string;
  accountId: string;
}
export interface Company {
  id: string;
  name: string;
  industry: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  moaStart: string;
  moaEnd: string;
  approved: boolean;
  academicYear: string;
}
export interface Supervisor {
  id: string;
  accountId: string;
  companyId: string;
  phone: string;
}
export interface Requirement {
  id: string;
  name: string;
  description: string;
  classification: "Mandatory" | "Optional";
}
export interface Attachment {
  id: string;
  name: string;
  mime: string;
  size: number;
  blob: Blob;
}
export interface Submission {
  id: string;
  studentId: string;
  requirementId: string;
  fileId: string;
  attempt: number;
  submittedAt: string;
  status: SubmissionStatus;
  reviewerId?: string;
  reviewedAt?: string;
  reason?: string;
}
export interface Opportunity {
  id: string;
  companyId: string;
  title: string;
  description: string;
  capacity: number;
  status: OpportunityStatus;
  academicYear: string;
}
export interface Decision {
  status: ApplicationStatus;
  at: string;
  actorId: string;
  reason?: string;
}
export interface Application {
  id: string;
  studentId: string;
  opportunityId: string;
  submittedAt: string;
  status: ApplicationStatus;
  history: Decision[];
  academicYear: string;
}
export interface Placement {
  id: string;
  applicationId: string;
  adviserId: string;
  supervisorId: string;
  startDate: string;
  endDate: string;
  requiredHours: number;
  requiredRequirementIds: string[];
  status: PlacementStatus;
  approvedBy: string;
  createdAt: string;
  terminationReason?: string;
  completedAt?: string;
  academicYear: string;
}
export interface ProgressReport {
  id: string;
  placementId: string;
  workDate: string;
  hours: number;
  tasks: string;
  submittedAt: string;
  status: ReviewStatus;
  reviewerId?: string;
  reviewedAt?: string;
  remarks: string;
}
export interface Evaluation {
  id: string;
  placementId: string;
  evaluatorId: string;
  status: "Pending" | "Submitted";
  grade?: number;
  comments?: string;
  submittedAt?: string;
}
export interface Certificate {
  id: string;
  placementId: string;
  number: string;
  issueDate: string;
  recordedBy: string;
}
export interface Activity {
  id: string;
  actorId: string;
  at: string;
  message: string;
  href: string;
}
export interface Preferences {
  academicYear: string;
  landingPage: string;
  density: "Comfortable" | "Compact";
  requirementAlerts: boolean;
  evaluationAlerts: boolean;
  progressAlerts: boolean;
  partnershipAlerts: boolean;
  largerText: boolean;
  reduceMotion: boolean;
}
export const defaultPreferences: Preferences = {
  academicYear: "2026-2027",
  landingPage: "/dashboard",
  density: "Comfortable",
  requirementAlerts: true,
  evaluationAlerts: true,
  progressAlerts: true,
  partnershipAlerts: true,
  largerText: false,
  reduceMotion: false,
};

export interface Database {
  schemaVersion: 1;
  revision: number;
  accounts: Account[];
  students: Student[];
  faculty: Faculty[];
  companies: Company[];
  supervisors: Supervisor[];
  requirements: Requirement[];
  submissions: Submission[];
  files: Attachment[];
  opportunities: Opportunity[];
  applications: Application[];
  placements: Placement[];
  reports: ProgressReport[];
  evaluations: Evaluation[];
  certificates: Certificate[];
  activities: Activity[];
  preferences: Record<string, Preferences>;
  receipts: { key: string; actorId: string; result: string }[];
  /** Read projection only: authoritative availability without exposing other students' placements. */
  availability?: Record<string, { remaining: number; eligible: boolean }>;
}
export interface Session {
  accountId: string;
  expiresAt: number;
}
export type StudentInput = Omit<Student, "id" | "accountId">;
export type CompanyInput = Omit<Company, "id">;
export interface SupervisorInput {
  companyId: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
}
export type RequirementInput = Omit<Requirement, "id">;
export type OpportunityInput = Omit<Opportunity, "id" | "status">;
export type PlacementInput = Pick<
  Placement,
  | "applicationId"
  | "adviserId"
  | "supervisorId"
  | "startDate"
  | "endDate"
  | "requiredHours"
>;
export type Command =
  | { type: "student.save"; id?: string; input: StudentInput }
  | { type: "company.save"; id?: string; input: CompanyInput }
  | { type: "supervisor.save"; id?: string; input: SupervisorInput }
  | { type: "requirement.save"; id?: string; input: RequirementInput }
  | {
      type: "submission.create";
      studentId: string;
      requirementId: string;
      file: Pick<Attachment, "name" | "mime" | "size" | "blob">;
    }
  | {
      type: "submission.review";
      id: string;
      decision: "Approved" | "Rejected";
      reason: string;
    }
  | { type: "opportunity.save"; id?: string; input: OpportunityInput }
  | { type: "opportunity.status"; id: string; status: OpportunityStatus }
  | { type: "application.create"; studentId: string; opportunityId: string }
  | {
      type: "application.decide";
      id: string;
      decision: "Accepted" | "Rejected";
      reason: string;
    }
  | { type: "placement.create"; input: PlacementInput }
  | { type: "placement.terminate"; id: string; reason: string }
  | { type: "placement.complete"; id: string }
  | {
      type: "report.create";
      placementId: string;
      workDate: string;
      hours: number;
      tasks: string;
    }
  | { type: "report.review"; id: string; remarks: string }
  | { type: "evaluation.submit"; id: string; grade: number; comments: string }
  | {
      type: "certificate.record";
      placementId: string;
      number: string;
      issueDate: string;
    }
  | { type: "preferences.save"; input: Preferences };

export type ErrorCode =
  | "VALIDATION"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "STORAGE_UNAVAILABLE"
  | "BACKEND_UNAVAILABLE";
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
export interface DataStore {
  read(): Promise<Database>;
  update<T>(change: (database: Database) => T): Promise<T>;
}
export interface InternLinkService {
  readonly mode: "demo" | "api";
  signIn(email: string, password: string): Promise<Account>;
  signOut(): Promise<void>;
  currentAccount(): Promise<Account | null>;
  read(): Promise<Database>;
  execute(
    command: Command,
    requestId: string,
    expectedRevision?: number,
  ): Promise<string>;
  attachment(id: string): Promise<Attachment>;
  reset(confirmation: string): Promise<void>;
  subscribe(listener: () => void): () => void;
}
