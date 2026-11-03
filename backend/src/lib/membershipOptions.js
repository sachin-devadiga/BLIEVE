/** Membership application option lists and document shape. */

export const APPLICATION_STATUSES = [
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
];

export const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export const STAGES = [
  "Idea Development",
  "Research and Validation",
  "Prototype Development",
  "Minimum Viable Product (MVP)",
  "Launched",
  "Generating Revenue",
];

export const HOURS = [
  "Less than 5 hours",
  "5 to 10 hours",
  "10 to 20 hours",
  "More than 20 hours",
];

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
];

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
];

export function normaliseIndianPhone(value) {
  if (typeof value !== "string") return null;
  const raw = value.replace(/\D/g, "").slice(0, 12);
  const local = raw.length === 12 && raw.startsWith("91") ? raw.slice(2) : raw;
  if (!/^[6-9]\d{9}$/.test(local)) return null;
  return local;
}

export function isApplicationStatus(value) {
  return typeof value === "string" && APPLICATION_STATUSES.includes(value);
}
