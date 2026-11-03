export type ApplicationStatus =
  | "Pending Review"
  | "Under Review"
  | "Approved"
  | "Rejected";

export const APPLICATION_STATUSES: readonly ApplicationStatus[] = [
  "Pending Review",
  "Under Review",
  "Approved",
  "Rejected",
];

export const DEPARTMENTS = [
  "Computer Science and Engineering",
  "Information Science and Engineering",
  "Artificial Intelligence and Machine Learning",
  "Data Science",
  "Electronics and Communication Engineering",
  "Other",
] as const;

export const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"] as const;

export const STAGES = [
  "Idea Development",
  "Research and Validation",
  "Prototype Development",
  "Minimum Viable Product (MVP)",
  "Launched",
  "Generating Revenue",
] as const;

export const HOURS = [
  "Less than 5 hours",
  "5 to 10 hours",
  "10 to 20 hours",
  "More than 20 hours",
] as const;

export const SKILLS = [
  "Programming and Software Development",
  "Web Development",
  "App Development",
  "UI/UX Design",
  "Artificial Intelligence and Data Science",
  "Marketing and Sales",
  "Business Development",
  "Finance and Accounting",
  "Operations and Management",
  "Content Creation and Video Editing",
  "Research and Market Analysis",
  "Communication and Networking",
  "Other",
] as const;

export const EXPECTATIONS = [
  "Startup Mentorship",
  "Networking Opportunities",
  "Collaboration with Other Founders",
  "Startup Workspace",
  "Workshops and Events",
  "Investor and Funding Opportunities",
  "Business Development Support",
  "Technical Guidance",
  "Other",
] as const;

export type StartupEntry = {
  name: string;
  description: string;
  role: string;
  duration: string;
  stage: string;
  teamSize: string;
  progress: string;
  hasOnlinePresence: boolean;
  links: string;
};

export type PersonalInfo = {
  fullName: string;
  usn: string;
  department: string;
  year: string;
  phone: string;
  email: string;
};

export type MembershipPayload = {
  website?: string;
  activelyWorking: boolean;
  personal: PersonalInfo;
  startups: StartupEntry[];
  skills: string[];
  contribution: string;
  hoursPerWeek: string;
  challenges: string;
  whyJoin: string;
  expectations: string[];
  willingToParticipate: boolean;
  agreesToRules: boolean;
  confirmsStartup: boolean;
  declarationAccepted: boolean;
};

export type MembershipApplication = MembershipPayload & {
  id: string;
  submittedAt: string;
  status: ApplicationStatus;
  reviewNotes: string;
  reviewedAt: string | null;
};

export type ApplicationSummary = {
  id: string;
  submittedAt: string;
  status: ApplicationStatus;
  fullName: string;
  usn: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  startupName: string;
  stage: string;
};

export type FieldErrors = Record<string, string>;

export function normaliseIndianPhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const raw = value.replace(/\D/g, "").slice(0, 12);
  const local = raw.length === 12 && raw.startsWith("91") ? raw.slice(2) : raw;
  if (!/^[6-9]\d{9}$/.test(local)) return null;
  return local;
}
