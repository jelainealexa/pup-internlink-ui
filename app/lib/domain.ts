export type Role =
  | "Coordinator"
  | "Student"
  | "Faculty Adviser"
  | "Company Supervisor"
  | "Intern Supervisor";
export type ActivationState = "Pending Activation" | "Active" | "Deactivated";
export type RequirementPhase =
  "Before Internship" | "During Internship" | "After Internship";
export type ApplicationStatus = "Pending" | "Accepted" | "Rejected";
export type PlacementStatus = "Ongoing" | "Completed" | "Terminated";
export type SubmissionStatus = "Pending" | "Approved" | "Rejected";
export type OpportunityStatus =
  | "Pending Approval"
  | "Approved"
  | "Closed"
  | "Pending Approval - Company"
  | "Pending Approval - Coordinator"
  | "Active"
  | "Filled"
  | "Deactivated"
  | "Rejected";
export type ReviewStatus =
  "Pending Review" | "Reviewed" | "Pending" | "Approved" | "Rejected";
export type PartnershipStatus =
  "Pending" | "Active" | "Expiring Soon" | "Expired";

export interface Account {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  verifier: string;
  activationState?: ActivationState;
  credentialVersion?: number;
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
  adviserId?: string;
  registeredBy?: string;
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
  phase?: RequirementPhase;
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
  location?: string;
  modality?: "On-site" | "Remote" | "Hybrid" | "Not specified";
  requiredHours?: number;
  qualifications?: string;
  skills?: string;
  responsibilities?: string;
  supervisorIds?: string[];
  decisions?: {
    stage: "Company" | "Coordinator" | "Legacy";
    outcome: "Approved" | "Rejected" | "Activated" | "Deactivated" | "Edited";
    actorId: string;
    at: string;
    remarks: string;
  }[];
  legacyApproval?: boolean;
  assignmentHistory?: {
    from: string[];
    to: string[];
    actorId: string;
    at: string;
  }[];
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
  assignmentHistory?: {
    from: string;
    to: string;
    actorId: string;
    at: string;
  }[];
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
  kind?: "Daily" | "Weekly";
  periodEnd?: string;
  attendanceIds?: string[];
  attempt?: number;
  history?: {
    status: ReviewStatus;
    actorId: string;
    at: string;
    remarks: string;
  }[];
  facultyRemarks?: { id: string; actorId: string; at: string; text: string }[];
  legacyStatus?: ReviewStatus;
  replacesId?: string;
}
export interface Evaluation {
  id: string;
  placementId: string;
  evaluatorId: string;
  status: "Pending" | "Submitted";
  grade?: number;
  comments?: string;
  submittedAt?: string;
  evaluationDate?: string;
}
export interface Attendance {
  id: string;
  placementId: string;
  date: string;
  hours: number;
  activity: string;
  createdAt: string;
  reportId?: string;
}
export interface AccountRequest {
  id: string;
  accountId: string;
  purpose: "Activation" | "Password Reset";
  expiresAt: string;
  createdAt: string;
  createdBy?: string;
  usedAt?: string;
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
  schemaVersion: 1 | 2;
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
  receipts: {
    key: string;
    actorId: string;
    result: string;
    commandFingerprint?: string;
  }[];
  attendance?: Attendance[];
  accountRequests?: AccountRequest[];
  /** Read projection only: authoritative availability without exposing other students' placements. */
  availability?: Record<
    string,
    { remaining: number; eligible: boolean; applications?: number }
  >;
}
export interface Session {
  accountId: string;
  expiresAt: number;
  credentialVersion?: number;
}
export type StudentInput = Omit<Student, "id" | "accountId">;
export type CompanyInput = Omit<Company, "id">;
export interface SupervisorInput {
  companyId: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  role?: "Company Supervisor" | "Intern Supervisor";
}
export type RequirementInput = Omit<Requirement, "id">;
export type OpportunityInput = Pick<
  Opportunity,
  | "companyId"
  | "title"
  | "description"
  | "capacity"
  | "academicYear"
  | "location"
  | "modality"
  | "requiredHours"
  | "qualifications"
  | "skills"
  | "responsibilities"
>;
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
      replacesId?: string;
    }
  | { type: "report.review"; id: string; remarks: string }
  | {
      type: "evaluation.submit";
      id: string;
      grade: number;
      comments: string;
      evaluationDate?: string;
    }
  | {
      type: "certificate.record";
      placementId: string;
      number: string;
      issueDate: string;
    }
  | { type: "preferences.save"; input: Preferences };
export type UpdateCommand =
  | { type: "account.invite"; studentId: string }
  | { type: "account.deactivate"; accountId: string }
  | {
      type: "account.credentials";
      currentPassword: string;
      newPassword?: string;
      email?: string;
    }
  | {
      type: "faculty.save";
      id?: string;
      name: string;
      email: string;
      active: boolean;
    }
  | { type: "faculty.assign"; studentId: string; adviserId: string }
  | { type: "opportunity.assign"; id: string; supervisorIds: string[] }
  | {
      type: "opportunity.decide";
      id: string;
      stage: "Company" | "Coordinator";
      decision: "Approved" | "Rejected";
      remarks: string;
    }
  | { type: "opportunity.activate"; id: string; active: boolean }
  | { type: "placement.supervisor.assign"; id: string; supervisorId: string }
  | {
      type: "attendance.create";
      placementId: string;
      date: string;
      hours: number;
      activity: string;
    }
  | {
      type: "report.weekly";
      placementId: string;
      fromDate: string;
      toDate: string;
      attendanceIds: string[];
      tasks: string;
    }
  | {
      type: "report.decide";
      id: string;
      decision: "Approved" | "Rejected";
      remarks: string;
    }
  | { type: "report.monitor"; id: string; remarks: string };
export type AccessCommand =
  | { type: "password.request"; email: string }
  | {
      type: "account.activate";
      token: string;
      studentNumber: string;
      email: string;
      password: string;
      confirmPassword: string;
    }
  | {
      type: "password.reset";
      token: string;
      email: string;
      password: string;
      confirmPassword: string;
    };
export type Mutation = Command | UpdateCommand;

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
    command: Mutation,
    requestId: string,
    expectedRevision?: number,
  ): Promise<string>;
  access(command: AccessCommand, requestId: string): Promise<string>;
  attachment(id: string): Promise<Attachment>;
  reset(confirmation: string): Promise<void>;
  subscribe(listener: () => void): () => void;
}
