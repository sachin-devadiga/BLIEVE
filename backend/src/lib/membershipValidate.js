import {
  DEPARTMENTS,
  EXPECTATIONS,
  HOURS,
  SKILLS,
  STAGES,
  YEARS,
  normaliseIndianPhone,
} from "./membershipOptions.js";

const USN_RE = /^[A-Za-z0-9]{4,20}$/;

const LIMITS = {
  fullName: 100,
  usn: 20,
  phone: 20,
  email: 254,
  startupName: 150,
  role: 150,
  duration: 100,
  teamSize: 20,
  textarea: 3000,
  challenges: 2000,
  links: 500,
  contribution: 3000,
  whyJoin: 3000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_STARTUPS = 5;

function text(value, max) {
  if (typeof value !== "string") return "";
  return value.replace(/\0/g, "").trim().slice(0, max);
}

function inList(value, list) {
  const candidate = text(value, 200);
  return list.includes(candidate) ? candidate : "";
}

function validateStartup(raw, index, errors) {
  const source = raw ?? {};
  const prefix = `startups.${index}`;
  const entry = {
    name: text(source.name, LIMITS.startupName),
    description: text(source.description, LIMITS.textarea),
    role: text(source.role, LIMITS.role),
    duration: text(source.duration, LIMITS.duration),
    stage: inList(source.stage, STAGES),
    teamSize: text(source.teamSize, LIMITS.teamSize),
    progress: text(source.progress, LIMITS.textarea),
    hasOnlinePresence: source.hasOnlinePresence === true,
    links: text(source.links, LIMITS.links),
  };

  let valid = true;
  if (!entry.name) {
    errors[`${prefix}.name`] = "Startup name is required.";
    valid = false;
  }
  if (!entry.description) {
    errors[`${prefix}.description`] =
      "Describe your startup and the problem it solves.";
    valid = false;
  }
  if (!entry.role) {
    errors[`${prefix}.role`] = "Your role in the startup is required.";
    valid = false;
  }
  if (!entry.duration) {
    errors[`${prefix}.duration`] =
      "How long you have worked on it is required.";
    valid = false;
  }
  if (!entry.stage) {
    errors[`${prefix}.stage`] = "Select the current startup stage.";
    valid = false;
  }
  if (!entry.teamSize) {
    errors[`${prefix}.teamSize`] = "Number of team members is required.";
    valid = false;
  }
  if (!entry.progress) {
    errors[`${prefix}.progress`] =
      "Describe the progress you have made so far.";
    valid = false;
  }

  return valid ? entry : null;
}

function stringArray(value, allowed) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  for (const item of value) {
    const candidate = text(item, 200);
    if (candidate && allowed.includes(candidate)) seen.add(candidate);
  }
  return [...seen];
}

export function validateMembership(raw) {
  const errors = {};
  const source = raw ?? {};

  if (source.activelyWorking !== true) {
    return {
      ok: false,
      formError:
        "BLIEVE E-Cell is a platform for students who are serious about building startups. Applicants must be actively working on at least one startup to be eligible for membership.",
      fieldErrors: {},
    };
  }

  const personalSource = source.personal ?? {};
  const personal = {
    fullName: text(personalSource.fullName, LIMITS.fullName),
    usn: text(personalSource.usn, LIMITS.usn).toUpperCase(),
    department: inList(personalSource.department, DEPARTMENTS),
    year: inList(personalSource.year, YEARS),
    phone: normaliseIndianPhone(personalSource.phone) ?? "",
    email: text(personalSource.email, LIMITS.email).toLowerCase(),
  };

  if (!personal.fullName) {
    errors["personal.fullName"] = "Full name is required.";
  }
  if (!personal.usn) {
    errors["personal.usn"] = "USN is required.";
  } else if (!USN_RE.test(personal.usn)) {
    errors["personal.usn"] = "Enter a valid USN (letters and numbers only).";
  }
  if (!personal.department) {
    errors["personal.department"] = "Select your department.";
  }
  if (!personal.year) {
    errors["personal.year"] = "Select your year of study.";
  }
  if (!personal.phone) {
    errors["personal.phone"] =
      "Enter a valid 10-digit Indian mobile number.";
  }
  if (!personal.email) {
    errors["personal.email"] = "College email ID is required.";
  } else if (
    !EMAIL_RE.test(personal.email) ||
    personal.email.length > LIMITS.email
  ) {
    errors["personal.email"] = "Enter a valid email address.";
  }

  const startupSource = Array.isArray(source.startups) ? source.startups : [];
  const startups = [];
  if (startupSource.length === 0) {
    errors["startups"] = "Add at least one startup entry.";
  } else if (startupSource.length > MAX_STARTUPS) {
    errors["startups"] = `You can add up to ${MAX_STARTUPS} startup entries.`;
  } else {
    startupSource.forEach((entry, index) => {
      const validated = validateStartup(entry, index, errors);
      if (validated) startups.push(validated);
    });
  }

  const skills = stringArray(source.skills, SKILLS);
  if (skills.length === 0) {
    errors["skills"] = "Select at least one skill you can contribute.";
  }

  const contribution = text(source.contribution, LIMITS.contribution);
  if (!contribution) {
    errors["contribution"] =
      "Explain how you can contribute to BLIEVE E-Cell.";
  }

  const hoursPerWeek = inList(source.hoursPerWeek, HOURS);
  if (!hoursPerWeek) {
    errors["hoursPerWeek"] =
      "Select how many hours per week you can dedicate.";
  }

  const challenges = text(source.challenges, LIMITS.challenges);

  const whyJoin = text(source.whyJoin, LIMITS.whyJoin);
  if (!whyJoin) {
    errors["whyJoin"] = "Tell us why you want to join BLIEVE E-Cell.";
  }

  const expectations = stringArray(source.expectations, EXPECTATIONS);
  if (expectations.length === 0) {
    errors["expectations"] =
      "Select at least one thing you expect from BLIEVE E-Cell.";
  }

  if (source.willingToParticipate !== true) {
    errors["willingToParticipate"] =
      "You must be willing to actively participate in E-Cell activities.";
  }
  if (source.agreesToRules !== true) {
    errors["agreesToRules"] =
      "You must agree to follow BLIEVE E-Cell's rules and guidelines.";
  }
  if (source.confirmsStartup !== true) {
    errors["confirmsStartup"] =
      "Confirm that you are actively working on at least one startup.";
  }
  if (source.declarationAccepted !== true) {
    errors["declarationAccepted"] =
      "You must accept the declaration before submitting.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      formError: "Please correct the highlighted fields before submitting.",
      fieldErrors: errors,
    };
  }

  return {
    ok: true,
    data: {
      id: "",
      submittedAt: "",
      status: "Pending Review",
      reviewNotes: "",
      reviewedAt: null,
      activelyWorking: true,
      personal,
      startups,
      skills,
      contribution,
      hoursPerWeek,
      challenges,
      whyJoin,
      expectations,
      willingToParticipate: true,
      agreesToRules: true,
      confirmsStartup: true,
      declarationAccepted: true,
    },
  };
}
