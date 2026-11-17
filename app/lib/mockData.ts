export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  program: string;
  yearLevel: string;
  section: string;
  placement: string;
  placementId?: string;
  position: string;
  status: string;
  hours: number;
  requiredHours: number;
};

export type Application = {
  id: string;
  studentId: string;
  student: string;
  program: string;
  yearLevel: string;
  section: string;
  opportunity: string;
  company: string;
  description: string;
  slots: number;
  status: "Pending" | "Accepted" | "Rejected";
  submissionDate: string;
  sortDate: string;
  rejectionReason?: string;
};

export type Placement = {
  id: string;
  studentId: string;
  student: string;
  company: string;
  opportunity: string;
  adviser: string;
  supervisor: string;
  startDate: string;
  endDate: string;
  sortStartDate: string;
  sortEndDate: string;
  requiredHours: number;
  renderedHours: number;
  status: "Ongoing" | "Completed" | "Terminated";
};

export type ProgressReport = {
  id: string;
  studentId: string;
  date: string;
  hours: number;
  task: string;
  remarks: string;
  reviewStatus: "Reviewed" | "Pending Review";
};

export const students: Student[] = [
  {
    id: "2024-0001",
    firstName: "Angela",
    lastName: "Reyes",
    name: "Angela Reyes",
    email: "angela.reyes@example.com",
    program: "BS Computer Engineering",
    yearLevel: "4th Year",
    section: "4-1",
    placement: "Accenture Philippines",
    placementId: "PL-003",
    position: "Software Development Intern",
    status: "Ongoing",
    hours: 320,
    requiredHours: 486,
  },
  {
    id: "2024-0002",
    firstName: "Miguel",
    lastName: "Santos",
    name: "Miguel Santos",
    email: "miguel.santos@example.com",
    program: "BS Information Technology",
    yearLevel: "4th Year",
    section: "4-2",
    placement: "IBM Philippines",
    placementId: "PL-001",
    position: "IT Support Intern",
    status: "Ongoing",
    hours: 280,
    requiredHours: 486,
  },
  {
    id: "2024-0003",
    firstName: "Sofia",
    lastName: "Cruz",
    name: "Sofia Cruz",
    email: "sofia.cruz@example.com",
    program: "BS Computer Science",
    yearLevel: "4th Year",
    section: "4-1",
    placement: "Globe Telecom",
    placementId: "PL-002",
    position: "Data Analytics Intern",
    status: "Completed",
    hours: 486,
    requiredHours: 486,
  },
  {
    id: "2024-0004",
    firstName: "Joshua",
    lastName: "Tan",
    name: "Joshua Tan",
    email: "joshua.tan@example.com",
    program: "BS Information Technology",
    yearLevel: "4th Year",
    section: "4-3",
    placement: "Not Yet Placed",
    position: "None",
    status: "Applying",
    hours: 0,
    requiredHours: 486,
  },
  {
    id: "2024-0005",
    firstName: "Nicole",
    lastName: "Garcia",
    name: "Nicole Garcia",
    email: "nicole.garcia@example.com",
    program: "BS Computer Science",
    yearLevel: "4th Year",
    section: "4-2",
    placement: "Not Yet Placed",
    position: "None",
    status: "Awaiting Placement",
    hours: 0,
    requiredHours: 486,
  },
];

export const applications: Application[] = [
  {
    id: "app-001",
    studentId: "2024-0004",
    student: "Joshua Tan",
    program: "BS Information Technology",
    yearLevel: "4th Year",
    section: "4-3",
    opportunity: "Software Development Intern",
    company: "Accenture Philippines",
    description:
      "Software development and application support internship.",
    slots: 4,
    status: "Pending",
    submissionDate: "November 10, 2026",
    sortDate: "2026-11-10",
  },
  {
    id: "app-002",
    studentId: "2024-0005",
    student: "Nicole Garcia",
    program: "BS Computer Science",
    yearLevel: "4th Year",
    section: "4-2",
    opportunity: "IT Support Intern",
    company: "IBM Philippines",
    description:
      "Technical support and infrastructure internship.",
    slots: 2,
    status: "Accepted",
    submissionDate: "November 8, 2026",
    sortDate: "2026-11-08",
  },
  {
    id: "app-003",
    studentId: "2024-0003",
    student: "Sofia Cruz",
    program: "BS Computer Science",
    yearLevel: "4th Year",
    section: "4-1",
    opportunity: "Junior Data Analyst",
    company: "Maya Philippines",
    description:
      "Data reporting and analytics internship opportunity.",
    slots: 1,
    status: "Rejected",
    submissionDate: "November 2, 2026",
    sortDate: "2026-11-02",
    rejectionReason:
      "Required criteria for the selected opportunity were not met.",
  },
];

export const placements: Placement[] = [
  {
    id: "PL-001",
    studentId: "2024-0002",
    student: "Miguel Santos",
    company: "IBM Philippines",
    opportunity: "IT Support Intern",
    adviser: "Prof. Maria Santos",
    supervisor: "John Reyes",
    startDate: "November 15, 2026",
    endDate: "February 15, 2027",
    sortStartDate: "2026-11-15",
    sortEndDate: "2027-02-15",
    requiredHours: 486,
    renderedHours: 280,
    status: "Ongoing",
  },
  {
    id: "PL-002",
    studentId: "2024-0003",
    student: "Sofia Cruz",
    company: "Globe Telecom",
    opportunity: "Data Analytics Intern",
    adviser: "Prof. Carlo Mendoza",
    supervisor: "Patricia Lim",
    startDate: "August 10, 2026",
    endDate: "November 10, 2026",
    sortStartDate: "2026-08-10",
    sortEndDate: "2026-11-10",
    requiredHours: 486,
    renderedHours: 486,
    status: "Completed",
  },
  {
    id: "PL-003",
    studentId: "2024-0001",
    student: "Angela Reyes",
    company: "Accenture Philippines",
    opportunity: "Software Development Intern",
    adviser: "Prof. Maria Santos",
    supervisor: "Daniel Cruz",
    startDate: "September 15, 2026",
    endDate: "December 20, 2026",
    sortStartDate: "2026-09-15",
    sortEndDate: "2026-12-20",
    requiredHours: 486,
    renderedHours: 320,
    status: "Ongoing",
  },
];

export const progressReports: ProgressReport[] = [
  {
    id: "PR-001",
    studentId: "2024-0001",
    date: "October 10, 2026",
    hours: 40,
    task: "Website development",
    remarks: "Good progress",
    reviewStatus: "Reviewed",
  },
  {
    id: "PR-002",
    studentId: "2024-0001",
    date: "October 17, 2026",
    hours: 40,
    task: "Database testing",
    remarks: "Satisfactory",
    reviewStatus: "Reviewed",
  },
  {
    id: "PR-003",
    studentId: "2024-0001",
    date: "October 24, 2026",
    hours: 35,
    task: "Documentation",
    remarks: "Under review",
    reviewStatus: "Pending Review",
  },
  {
    id: "PR-004",
    studentId: "2024-0002",
    date: "October 12, 2026",
    hours: 40,
    task: "Technical support",
    remarks: "Completed assigned tasks",
    reviewStatus: "Reviewed",
  },
  {
    id: "PR-005",
    studentId: "2024-0002",
    date: "October 19, 2026",
    hours: 35,
    task: "Network troubleshooting",
    remarks: "For adviser review",
    reviewStatus: "Pending Review",
  },
];