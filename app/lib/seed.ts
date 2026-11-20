import { Account, Database, Role, defaultPreferences } from "./domain";
import { upgradeSnapshot } from "./upgrade";

export const DEMO_PASSWORD = "InternLink!2026";
// This verifier is only for the publicly documented synthetic password, never a production credential.
export async function passwordVerifier(password: string): Promise<string> {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`internlink-demo-only:${password}`),
  );
  return Array.from(new Uint8Array(buffer), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
export async function createSeed(now = new Date()): Promise<Database> {
  const verifier = await passwordVerifier(DEMO_PASSWORD);
  const day = (offset: number) =>
    new Date(now.getTime() + offset * 86400000).toISOString().slice(0, 10);
  const at = (offset: number) => `${day(offset)}T09:00:00.000Z`;
  const year = `${now.getUTCFullYear()}-${now.getUTCFullYear() + 1}`;
  const account = (
    id: string,
    name: string,
    email: string,
    role: Role,
    active = true,
  ): Account => ({ id, name, email, role, active, verifier });
  const accounts = [
    account("coord-1", "Alex Demo", "coordinator@example.test", "Coordinator"),
    account(
      "faculty-1",
      "Robin Demo",
      "faculty@example.test",
      "Faculty Adviser",
    ),
    account(
      "faculty-2",
      "Casey Sample",
      "faculty2@example.test",
      "Faculty Adviser",
    ),
    account(
      "sup-1",
      "Morgan Demo",
      "supervisor@example.test",
      "Company Supervisor",
    ),
    account(
      "sup-2",
      "Jordan Sample",
      "supervisor2@example.test",
      "Company Supervisor",
    ),
  ];
  const names = [
    ["Mira", "Demo"],
    ["Theo", "Sample"],
    ["Luna", "Example"],
    ["Nico", "Demo"],
    ["Ari", "Sample"],
    ["Inactive", "Example"],
  ];
  const students = names.map(([firstName, lastName], i) => {
    const accountId = `student-${i + 1}`;
    accounts.push(
      account(
        accountId,
        `${firstName} ${lastName}`,
        i === 0 ? "student@example.test" : `student${i + 1}@example.test`,
        "Student",
        i !== 5,
      ),
    );
    return {
      id: `2024-000${i + 1}`,
      accountId,
      studentNumber: `SYN-2026-00${i + 1}`,
      firstName,
      lastName,
      email: accounts.at(-1)!.email,
      program: [
        "BS Computer Engineering",
        "BS Information Technology",
        "BS Computer Science",
      ][i % 3],
      yearLevel: i === 4 ? "3rd Year" : "4th Year",
      section: `4-${(i % 3) + 1}`,
      academicYear: year,
    };
  });
  const db: Database = {
    schemaVersion: 1,
    revision: 0,
    accounts,
    students,
    faculty: [
      { id: "fac-1", accountId: "faculty-1" },
      { id: "fac-2", accountId: "faculty-2" },
    ],
    companies: [
      {
        id: "company-1",
        name: "Copper Finch Labs",
        industry: "Technology",
        address: "1 Synthetic Avenue, Demo City",
        contactPerson: "Morgan Demo",
        email: "partners@copperfinch.example",
        phone: "000-000-0001",
        moaStart: day(-365),
        moaEnd: day(365),
        approved: true,
        academicYear: year,
      },
      {
        id: "company-2",
        name: "Riverstone Studio",
        industry: "Design",
        address: "2 Sample Road, Demo City",
        contactPerson: "Jordan Sample",
        email: "partners@riverstone.example",
        phone: "000-000-0002",
        moaStart: day(-100),
        moaEnd: day(20),
        approved: true,
        academicYear: year,
      },
      {
        id: "company-3",
        name: "Paper Kite Services",
        industry: "Services",
        address: "3 Example Street, Demo City",
        contactPerson: "Sam Example",
        email: "partners@paperkite.example",
        phone: "000-000-0003",
        moaStart: day(-100),
        moaEnd: day(200),
        approved: false,
        academicYear: year,
      },
      {
        id: "company-4",
        name: "Old Oak Demo",
        industry: "Technology",
        address: "4 Fictional Lane, Demo City",
        contactPerson: "Lee Example",
        email: "partners@oldoak.example",
        phone: "000-000-0004",
        moaStart: day(-365),
        moaEnd: day(-10),
        approved: true,
        academicYear: year,
      },
    ],
    supervisors: [
      {
        id: "supervisor-1",
        accountId: "sup-1",
        companyId: "company-1",
        phone: "000-000-0001",
      },
      {
        id: "supervisor-2",
        accountId: "sup-2",
        companyId: "company-2",
        phone: "000-000-0002",
      },
    ],
    requirements: [
      {
        id: "req-1",
        name: "Resume",
        description: "A synthetic resume for internship screening.",
        classification: "Mandatory",
      },
      {
        id: "req-2",
        name: "Enrollment Clearance",
        description: "A synthetic academic clearance.",
        classification: "Mandatory",
      },
      {
        id: "req-3",
        name: "Additional Document",
        description: "Optional supporting material.",
        classification: "Optional",
      },
    ],
    submissions: [],
    files: [],
    opportunities: [
      {
        id: "opp-1",
        companyId: "company-1",
        title: "Software Development Intern",
        description: "Build and test demonstration applications.",
        capacity: 3,
        status: "Approved",
        academicYear: year,
      },
      {
        id: "opp-2",
        companyId: "company-2",
        title: "Design Intern",
        description: "Practice accessible interface design.",
        capacity: 1,
        status: "Approved",
        academicYear: year,
      },
      {
        id: "opp-3",
        companyId: "company-1",
        title: "Data Support Intern",
        description: "Prepare synthetic data reports.",
        capacity: 2,
        status: "Pending Approval",
        academicYear: year,
      },
      {
        id: "opp-4",
        companyId: "company-4",
        title: "Archived Support Intern",
        description: "An unavailable posting at an expired partner.",
        capacity: 1,
        status: "Closed",
        academicYear: year,
      },
    ],
    applications: [
      {
        id: "app-001",
        studentId: "2024-0005",
        opportunityId: "opp-1",
        submittedAt: at(-3),
        status: "Pending",
        history: [{ status: "Pending", at: at(-3), actorId: "student-5" }],
        academicYear: year,
      },
      {
        id: "app-002",
        studentId: "2024-0004",
        opportunityId: "opp-1",
        submittedAt: at(-5),
        status: "Accepted",
        history: [
          { status: "Pending", at: at(-5), actorId: "student-4" },
          { status: "Accepted", at: at(-4), actorId: "coord-1" },
        ],
        academicYear: year,
      },
      ...[1, 2, 3].map((i) => ({
        id: `app-placed-${i}`,
        studentId: `2024-000${i}`,
        opportunityId: i === 3 ? "opp-2" : "opp-1",
        submittedAt: at(-65),
        status: "Accepted" as const,
        history: [
          { status: "Pending" as const, at: at(-65), actorId: `student-${i}` },
          { status: "Accepted" as const, at: at(-64), actorId: "coord-1" },
        ],
        academicYear: year,
      })),
      {
        id: "app-003",
        studentId: "2024-0005",
        opportunityId: "opp-2",
        submittedAt: at(-10),
        status: "Rejected",
        history: [
          { status: "Pending", at: at(-10), actorId: "student-5" },
          {
            status: "Rejected",
            at: at(-9),
            actorId: "coord-1",
            reason:
              "Synthetic screening example: posting requirements not met.",
          },
        ],
        academicYear: year,
      },
    ],
    placements: [
      {
        id: "PL-001",
        applicationId: "app-placed-1",
        adviserId: "fac-1",
        supervisorId: "supervisor-1",
        startDate: day(-60),
        endDate: day(60),
        requiredHours: 80,
        requiredRequirementIds: ["req-1", "req-2"],
        status: "Ongoing",
        approvedBy: "coord-1",
        createdAt: at(-63),
        academicYear: year,
      },
      {
        id: "PL-002",
        applicationId: "app-placed-2",
        adviserId: "fac-1",
        supervisorId: "supervisor-1",
        startDate: day(-60),
        endDate: day(-30),
        requiredHours: 16,
        requiredRequirementIds: ["req-1", "req-2"],
        status: "Completed",
        approvedBy: "coord-1",
        createdAt: at(-63),
        completedAt: at(-31),
        academicYear: year,
      },
      {
        id: "PL-003",
        applicationId: "app-placed-3",
        adviserId: "fac-2",
        supervisorId: "supervisor-2",
        startDate: day(-60),
        endDate: day(30),
        requiredHours: 80,
        requiredRequirementIds: ["req-1", "req-2"],
        status: "Terminated",
        approvedBy: "coord-1",
        createdAt: at(-63),
        terminationReason: "Synthetic placement ended by mutual agreement.",
        academicYear: year,
      },
    ],
    reports: [
      {
        id: "PR-001",
        placementId: "PL-001",
        workDate: day(-7),
        hours: 8,
        tasks: "Synthetic application testing",
        submittedAt: at(-7),
        status: "Reviewed",
        reviewerId: "faculty-1",
        reviewedAt: at(-6),
        remarks: "Checked against the demonstration task log.",
      },
      {
        id: "PR-002",
        placementId: "PL-001",
        workDate: day(-1),
        hours: 8,
        tasks: "Documented demonstration test cases",
        submittedAt: at(-1),
        status: "Pending Review",
        remarks: "",
      },
      ...[40, 39].map((n, i) => ({
        id: `PR-completed-${i}`,
        placementId: "PL-002",
        workDate: day(-n),
        hours: 8,
        tasks: "Completed synthetic internship tasks",
        submittedAt: at(-n),
        status: "Reviewed" as const,
        reviewerId: "faculty-1",
        reviewedAt: at(-n + 1),
        remarks: "Reviewed synthetic evidence.",
      })),
      {
        id: "PR-terminated",
        placementId: "PL-003",
        workDate: day(-40),
        hours: 8,
        tasks: "Synthetic design orientation",
        submittedAt: at(-40),
        status: "Reviewed",
        reviewerId: "faculty-2",
        reviewedAt: at(-39),
        remarks: "Historical reviewed report.",
      },
    ],
    evaluations: [],
    certificates: [
      {
        id: "cert-seed",
        placementId: "PL-002",
        number: "DEMO-CERT-001",
        issueDate: day(-30),
        recordedBy: "coord-1",
      },
    ],
    activities: [
      {
        id: "activity-seed",
        actorId: "coord-1",
        at: now.toISOString(),
        message: "Synthetic demonstration dataset initialized",
        href: "/dashboard",
      },
    ],
    preferences: { "coord-1": { ...defaultPreferences, academicYear: year } },
    receipts: [],
  };
  for (const p of db.placements) {
    const adviser = db.faculty.find((f) => f.id === p.adviserId)!;
    const supervisor = db.supervisors.find((s) => s.id === p.supervisorId)!;
    for (const evaluatorId of [adviser.accountId, supervisor.accountId])
      db.evaluations.push({
        id: `eval-${p.id}-${evaluatorId}`,
        placementId: p.id,
        evaluatorId,
        status: p.status === "Completed" ? "Submitted" : "Pending",
        ...(p.status === "Completed"
          ? {
              grade: 90,
              comments:
                "Synthetic evaluation: completed the assigned demonstration tasks.",
              submittedAt: at(-32),
            }
          : {}),
      });
  }
  for (const student of students)
    for (const requirement of db.requirements.filter(
      (r) => r.classification === "Mandatory",
    )) {
      const id = `sub-${student.id}-${requirement.id}`;
      const blob = new Blob(
        [
          `Synthetic ${requirement.name}\nFor ${student.studentNumber}. No real personal information.`,
        ],
        { type: "text/plain" },
      );
      db.files.push({
        id: `file-${id}`,
        name: `${requirement.name.toLowerCase().replaceAll(" ", "-")}-demo.txt`,
        mime: "text/plain",
        size: blob.size,
        blob,
      });
      const status =
        student.id === "2024-0005"
          ? requirement.id === "req-1"
            ? "Pending"
            : "Rejected"
          : "Approved";
      db.submissions.push({
        id,
        studentId: student.id,
        requirementId: requirement.id,
        fileId: `file-${id}`,
        attempt: 1,
        submittedAt: at(-70),
        status,
        ...(status !== "Pending"
          ? {
              reviewerId: "coord-1",
              reviewedAt: at(-69),
              reason:
                status === "Rejected"
                  ? "Replace this synthetic document with an updated version."
                  : "",
            }
          : {}),
      });
    }
  const updated = upgradeSnapshot(db);
  updated.revision = 0;
  for (const [i, companyId] of ["company-1", "company-2"].entries()) {
    const id = `company-admin-${i + 1}`;
    updated.accounts.push({
      ...account(
        id,
        `Company Administrator ${i + 1}`,
        i ? "company2@example.test" : "company@example.test",
        "Company Supervisor",
      ),
      activationState: "Active",
      credentialVersion: 1,
    });
    updated.supervisors.push({
      id: `company-admin-profile-${i + 1}`,
      accountId: id,
      companyId,
      phone: `000-000-010${i + 1}`,
    });
  }
  updated.students.find((s) => s.id === "2024-0005")!.adviserId = "fac-1";
  for (const o of updated.opportunities)
    Object.assign(o, {
      location: "Demo City",
      modality: "Hybrid",
      requiredHours: 486,
      qualifications: "Synthetic academic internship eligibility",
      skills: "Communication and academic project skills",
      responsibilities: o.description,
    });
  return updated;
}
