"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import {
  DEPARTMENTS,
  EXPECTATIONS,
  HOURS,
  SKILLS,
  STAGES,
  YEARS,
  normaliseIndianPhone,
  type FieldErrors,
  type StartupEntry,
} from "@/lib/membership/options";
import { apiUrl } from "@/lib/api";
import {
  getSession,
  getServerSession,
  subscribeSession,
} from "@/lib/clientAuth";

const DRAFT_KEY = "blieve-membership-draft-v1";

const STEPS = [
  "Personal Information",
  "Startup Information",
  "Skills & Contributions",
  "BLIEVE Membership",
  "Declaration",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USN_RE = /^[A-Za-z0-9]{4,20}$/;
const MAX_STARTUPS = 5;

const inputClass =
  "w-full px-4 py-3 min-h-11 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-navy dark:text-white placeholder:text-text-light focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 transition-all disabled:opacity-60";

type FormState = {
  website: string;
  activelyWorking: boolean | null;
  personal: {
    fullName: string;
    usn: string;
    department: string;
    year: string;
    phone: string;
    email: string;
  };
  startups: StartupEntry[];
  skills: string[];
  contribution: string;
  hoursPerWeek: string;
  challenges: string;
  whyJoin: string;
  expectations: string[];
  willingToParticipate: boolean | null;
  agreesToRules: boolean | null;
  confirmsStartup: boolean;
  declarationAccepted: boolean;
};

const emptyStartup = (): StartupEntry => ({
  name: "",
  description: "",
  role: "",
  duration: "",
  stage: "",
  teamSize: "",
  progress: "",
  hasOnlinePresence: false,
  links: "",
});

const initialState = (): FormState => ({
  website: "",
  activelyWorking: null,
  personal: {
    fullName: "",
    usn: "",
    department: "",
    year: "",
    phone: "",
    email: "",
  },
  startups: [emptyStartup()],
  skills: [],
  contribution: "",
  hoursPerWeek: "",
  challenges: "",
  whyJoin: "",
  expectations: [],
  willingToParticipate: null,
  agreesToRules: null,
  confirmsStartup: false,
  declarationAccepted: false,
});

type Draft = { step: number; form: FormState };

function loadDraft(): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    if (!parsed || typeof parsed.step !== "number" || !parsed.form?.personal) {
      return null;
    }
    return {
      step: Math.min(Math.max(parsed.step, 0), STEPS.length - 1),
      form: { ...initialState(), ...parsed.form },
    };
  } catch {
    return null;
  }
}

function saveDraft(draft: Draft) {
  try {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    return;
  }
}

function clearDraft() {
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    return;
  }
}

function stepForField(key: string): number {
  if (key.startsWith("personal.")) return 0;
  if (key.startsWith("startups") || key === "activelyWorking") return 1;
  if (
    ["skills", "contribution", "hoursPerWeek", "challenges"].includes(key)
  ) {
    return 2;
  }
  if (
    [
      "whyJoin",
      "expectations",
      "willingToParticipate",
      "agreesToRules",
      "confirmsStartup",
    ].includes(key)
  ) {
    return 3;
  }
  return 4;
}

function validateStep(index: number, form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (index === 0) {
    const { fullName, usn, department, year, phone, email } = form.personal;
    if (!fullName.trim()) errors["personal.fullName"] = "Full name is required.";
    if (!usn.trim()) {
      errors["personal.usn"] = "USN is required.";
    } else if (!USN_RE.test(usn.trim())) {
      errors["personal.usn"] = "Enter a valid USN (letters and numbers only).";
    }
    if (!department) errors["personal.department"] = "Select your department.";
    if (!year) errors["personal.year"] = "Select your year of study.";
    if (!normaliseIndianPhone(phone)) {
      errors["personal.phone"] =
        "Enter a valid 10-digit Indian mobile number.";
    }
    if (!email.trim()) {
      errors["personal.email"] = "College email ID is required.";
    } else if (!EMAIL_RE.test(email.trim())) {
      errors["personal.email"] = "Enter a valid email address.";
    }
  }

  if (index === 1) {
    if (form.startups.length === 0) {
      errors["startups"] = "Add at least one startup entry.";
    }
    form.startups.forEach((startup, i) => {
      if (!startup.name.trim())
        errors[`startups.${i}.name`] = "Startup name is required.";
      if (!startup.description.trim())
        errors[`startups.${i}.description`] =
          "Describe your startup and the problem it solves.";
      if (!startup.role.trim())
        errors[`startups.${i}.role`] = "Your role in the startup is required.";
      if (!startup.duration.trim())
        errors[`startups.${i}.duration`] =
          "How long you have worked on it is required.";
      if (!startup.stage)
        errors[`startups.${i}.stage`] = "Select the current startup stage.";
      if (!startup.teamSize.trim())
        errors[`startups.${i}.teamSize`] =
          "Number of team members is required.";
      if (!startup.progress.trim())
        errors[`startups.${i}.progress`] =
          "Describe the progress you have made so far.";
    });
  }

  if (index === 2) {
    if (form.skills.length === 0)
      errors["skills"] = "Select at least one skill you can contribute.";
    if (!form.contribution.trim())
      errors["contribution"] =
        "Explain how you can contribute to BLIEVE E-Cell.";
    if (!form.hoursPerWeek)
      errors["hoursPerWeek"] =
        "Select how many hours per week you can dedicate.";
  }

  if (index === 3) {
    if (!form.whyJoin.trim())
      errors["whyJoin"] = "Tell us why you want to join BLIEVE E-Cell.";
    if (form.expectations.length === 0)
      errors["expectations"] =
        "Select at least one thing you expect from BLIEVE E-Cell.";
    if (form.willingToParticipate !== true)
      errors["willingToParticipate"] =
        "You must be willing to actively participate in E-Cell activities.";
    if (form.agreesToRules !== true)
      errors["agreesToRules"] =
        "You must agree to follow BLIEVE E-Cell's rules and guidelines.";
    if (!form.confirmsStartup)
      errors["confirmsStartup"] =
        "Confirm that you are actively working on at least one startup.";
  }

  if (index === 4 && !form.declarationAccepted) {
    errors["declarationAccepted"] =
      "You must accept the declaration before submitting.";
  }

  return errors;
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-navy dark:text-white mb-1.5"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-orange">
            {" "}
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-xs text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-text-light dark:text-white/40">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function YesNo({
  name,
  value,
  onChange,
  disabled,
}: {
  name: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className="grid grid-cols-2 gap-3 max-w-xs"
    >
      {[true, false].map((option) => (
        <label
          key={String(option)}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold cursor-pointer transition-colors ${
            value === option
              ? "border-orange bg-orange/10 text-orange"
              : "border-gray-200 dark:border-white/10 text-text-grey dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <input
            type="radio"
            name={name}
            checked={value === option}
            onChange={() => onChange(option)}
            disabled={disabled}
            className="sr-only"
          />
          {option ? "Yes" : "No"}
        </label>
      ))}
    </div>
  );
}

function CheckGrid({
  options,
  selected,
  onToggle,
  columns = "sm:grid-cols-2",
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
  columns?: string;
}) {
  return (
    <div className={`grid grid-cols-1 ${columns} gap-2`}>
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <label
            key={option}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm cursor-pointer transition-colors ${
              checked
                ? "border-orange bg-orange/5 text-navy dark:text-white"
                : "border-gray-200 dark:border-white/10 text-text-grey dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(option)}
              className="mt-0.5 h-4 w-4 accent-orange flex-shrink-0"
            />
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );
}

export default function MembershipForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const restoredRef = useRef(false);
  const session = useSyncExternalStore(
    subscribeSession,
    getSession,
    getServerSession
  );

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const draft = loadDraft();
    if (draft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring a saved draft from sessionStorage, an external system
      setForm(draft.form);
      setStep(draft.step);
    }
  }, []);

  useEffect(() => {
    if (session?.role !== "member" || !session.email) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill from the signed-in session, an external system
    setForm((previous) =>
      previous.personal.email.trim()
        ? previous
        : {
            ...previous,
            personal: { ...previous.personal, email: session.email },
          }
    );
  }, [session]);

  useEffect(() => {
    if (!restoredRef.current) return;
    saveDraft({ step, form });
  }, [step, form]);

  const focusForm = () => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setFieldErrors((previous) => {
      if (!previous[key as string]) return previous;
      const next = { ...previous };
      delete next[key as string];
      return next;
    });
  };

  const setPersonal = (key: keyof FormState["personal"], value: string) => {
    setForm((previous) => ({
      ...previous,
      personal: { ...previous.personal, [key]: value },
    }));
    const errorKey = `personal.${key}`;
    setFieldErrors((previous) => {
      if (!previous[errorKey]) return previous;
      const next = { ...previous };
      delete next[errorKey];
      return next;
    });
  };

  const setStartup = (
    index: number,
    key: keyof StartupEntry,
    value: StartupEntry[keyof StartupEntry]
  ) => {
    setForm((previous) => ({
      ...previous,
      startups: previous.startups.map((startup, i) =>
        i === index ? { ...startup, [key]: value } : startup
      ),
    }));
    const errorKey = `startups.${index}.${key}`;
    setFieldErrors((previous) => {
      if (!previous[errorKey]) return previous;
      const next = { ...previous };
      delete next[errorKey];
      return next;
    });
  };

  const toggleInList = (
    key: "skills" | "expectations",
    value: string
  ) => {
    setForm((previous) => {
      const list = previous[key];
      return {
        ...previous,
        [key]: list.includes(value)
          ? list.filter((item) => item !== value)
          : [...list, value],
      };
    });
    setFieldErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const goTo = (next: number) => {
    setStep(next);
    setFieldErrors({});
    setFormError(null);
    focusForm();
  };

  const goNext = () => {
    const errors = validateStep(step, form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError("Please correct the highlighted fields to continue.");
      focusForm();
      return;
    }
    setFieldErrors({});
    setFormError(null);
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
    focusForm();
  };

  const goBack = () => {
    setFieldErrors({});
    setFormError(null);
    setStep((current) => Math.max(current - 1, 0));
    focusForm();
  };

  const submit = async () => {
    const errors = validateStep(4, form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError("Please accept the declaration before submitting.");
      return;
    }

    const earlier: FieldErrors = {};
    for (let index = 0; index < STEPS.length - 1; index += 1) {
      Object.assign(earlier, validateStep(index, form));
    }
    if (Object.keys(earlier).length > 0) {
      const firstKey = Object.keys(earlier)[0];
      setFieldErrors(earlier);
      setFormError(
        "Some earlier answers are incomplete. Please review the highlighted fields."
      );
      setStep(stepForField(firstKey));
      focusForm();
      return;
    }

    setLoading(true);
    setFormError(null);
    try {
      const response = await fetch(apiUrl("/api/membership"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          website: form.website,
          activelyWorking: form.activelyWorking === true,
          personal: form.personal,
          startups: form.startups,
          skills: form.skills,
          contribution: form.contribution,
          hoursPerWeek: form.hoursPerWeek,
          challenges: form.challenges,
          whyJoin: form.whyJoin,
          expectations: form.expectations,
          willingToParticipate: form.willingToParticipate === true,
          agreesToRules: form.agreesToRules === true,
          confirmsStartup: form.confirmsStartup,
          declarationAccepted: form.declarationAccepted,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        fieldErrors?: FieldErrors;
        applicationId?: string;
      };

      if (response.status === 201 && data.applicationId) {
        clearDraft();
        setReferenceId(data.applicationId);
        setFieldErrors({});
        setLoading(false);
        return;
      }

      if (response.status === 400 && data.fieldErrors) {
        setFieldErrors(data.fieldErrors);
        setFormError(
          data.error ?? "Please correct the highlighted fields before submitting."
        );
        const firstKey = Object.keys(data.fieldErrors)[0];
        if (firstKey) setStep(stepForField(firstKey));
      } else if (response.status === 422) {
        setFormError(
          data.error ??
            "You must be actively working on at least one startup to be eligible."
        );
        setStep(1);
      } else if (response.status === 409) {
        setFormError(data.error ?? "An application has already been submitted.");
      } else {
        setFormError(
          data.error ??
            "Something went wrong while submitting. Please try again, or email president@blieve.in."
        );
      }
      focusForm();
    } catch {
      setFormError(
        "Something went wrong while submitting. Please try again, or email president@blieve.in."
      );
    }
    setLoading(false);
  };

  const restart = () => {
    clearDraft();
    setForm(initialState());
    setStep(0);
    setFieldErrors({});
    setFormError(null);
    setReferenceId(null);
    focusForm();
  };

  if (referenceId) {
    return (
      <div
        ref={containerRef}
        role="status"
        className="bg-white dark:bg-[#1A1A2E] rounded-2xl border border-green-200 dark:border-green-800 p-8 md:p-10 text-center"
      >
        <span className="mx-auto mb-5 w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <Check size={28} aria-hidden="true" className="text-green-600" />
        </span>
        <h3 className="font-serif text-2xl md:text-3xl font-bold text-navy dark:text-white mb-3">
          Application Submitted Successfully!
        </h3>
        <p className="text-text-grey dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-6">
          Thank you for your interest in joining BLIEVE E-Cell. Your startup
          membership application has been received and is pending review. Our
          team will verify your eligibility and review your application. For
          assistance, contact{" "}
          <a
            href="mailto:president@blieve.in"
            className="text-orange underline underline-offset-2"
          >
            president@blieve.in
          </a>
          .
        </p>
        <div className="inline-block bg-pale dark:bg-white/5 border border-orange/20 rounded-xl px-6 py-4 mb-6">
          <p className="text-xs uppercase tracking-wider text-text-light dark:text-white/40 mb-1">
            Application Reference ID
          </p>
          <p className="font-mono text-lg font-semibold text-navy dark:text-white">
            {referenceId}
          </p>
        </div>
        <p className="text-sm text-text-light dark:text-white/40 mb-6">
          Status: Pending Review. Membership is not confirmed until an
          authorised administrator approves your application.
        </p>
        <button
          type="button"
          onClick={restart}
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors"
        >
          Submit another application
        </button>
      </div>
    );
  }

  const startupBlocked = step === 1 && form.activelyWorking === false;

  return (
    <div ref={containerRef} className="scroll-mt-24">
      <div className="bg-white dark:bg-[#1A1A2E] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
        <div className="border-b border-gray-100 dark:border-white/10 px-5 md:px-8 py-5 bg-surface dark:bg-white/[0.03]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange">
              Step {step + 1} of {STEPS.length}
            </p>
            <p className="text-xs text-text-light dark:text-white/40 hidden sm:block">
              {STEPS[step]}
            </p>
          </div>
          <ol className="flex items-center gap-1.5 md:gap-2">
            {STEPS.map((label, index) => {
              const state =
                index < step ? "done" : index === step ? "current" : "todo";
              return (
                <li key={label} className="flex items-center gap-1.5 md:gap-2 flex-1">
                  <button
                    type="button"
                    onClick={() => index < step && goTo(index)}
                    disabled={index > step}
                    aria-current={state === "current" ? "step" : undefined}
                    aria-label={`Step ${index + 1}: ${label}`}
                    className={`flex items-center gap-2 min-w-0 min-h-11 ${
                      index < step ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        state === "done"
                          ? "bg-orange text-white"
                          : state === "current"
                            ? "bg-navy dark:bg-white text-white dark:text-navy"
                            : "bg-gray-200 dark:bg-white/10 text-text-light dark:text-white/40"
                      }`}
                    >
                      {state === "done" ? (
                        <Check size={14} aria-hidden="true" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span
                      className={`hidden lg:block text-xs truncate ${
                        state === "current"
                          ? "text-navy dark:text-white font-semibold"
                          : "text-text-light dark:text-white/40"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={`flex-1 h-px min-w-3 ${
                        index < step ? "bg-orange" : "bg-gray-200 dark:bg-white/10"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="p-5 md:p-8" aria-live="polite">
          {formError && (
            <div
              role="alert"
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-300 mb-6 flex items-start gap-2"
            >
              <AlertCircle size={16} aria-hidden="true" className="mt-0.5 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                id="m-fullName"
                label="Full Name"
                required
                error={fieldErrors["personal.fullName"]}
              >
                <input
                  id="m-fullName"
                  type="text"
                  value={form.personal.fullName}
                  onChange={(event) => setPersonal("fullName", event.target.value)}
                  maxLength={100}
                  autoComplete="name"
                  disabled={loading}
                  aria-invalid={Boolean(fieldErrors["personal.fullName"])}
                  aria-describedby={
                    fieldErrors["personal.fullName"] ? "m-fullName-error" : undefined
                  }
                  className={inputClass}
                  placeholder="Enter your full name"
                />
              </Field>

              <Field
                id="m-usn"
                label="USN"
                required
                error={fieldErrors["personal.usn"]}
                hint="Your University Seat Number"
              >
                <input
                  id="m-usn"
                  type="text"
                  value={form.personal.usn}
                  onChange={(event) => setPersonal("usn", event.target.value)}
                  maxLength={20}
                  disabled={loading}
                  aria-invalid={Boolean(fieldErrors["personal.usn"])}
                  aria-describedby={
                    fieldErrors["personal.usn"] ? "m-usn-error" : undefined
                  }
                  className={inputClass}
                  placeholder="e.g. 1AM21CS045"
                />
              </Field>

              <Field
                id="m-department"
                label="Department"
                required
                error={fieldErrors["personal.department"]}
              >
                <select
                  id="m-department"
                  value={form.personal.department}
                  onChange={(event) => setPersonal("department", event.target.value)}
                  disabled={loading}
                  aria-invalid={Boolean(fieldErrors["personal.department"])}
                  className={inputClass}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="m-year"
                label="Year of Study"
                required
                error={fieldErrors["personal.year"]}
              >
                <select
                  id="m-year"
                  value={form.personal.year}
                  onChange={(event) => setPersonal("year", event.target.value)}
                  disabled={loading}
                  aria-invalid={Boolean(fieldErrors["personal.year"])}
                  className={inputClass}
                >
                  <option value="">Select year</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="m-phone"
                label="Contact Number"
                required
                error={fieldErrors["personal.phone"]}
                hint="10-digit Indian mobile number"
              >
                <input
                  id="m-phone"
                  type="tel"
                  value={form.personal.phone}
                  onChange={(event) => setPersonal("phone", event.target.value)}
                  maxLength={20}
                  autoComplete="tel"
                  disabled={loading}
                  aria-invalid={Boolean(fieldErrors["personal.phone"])}
                  aria-describedby={
                    fieldErrors["personal.phone"] ? "m-phone-error" : undefined
                  }
                  className={inputClass}
                  placeholder="98765 43210"
                />
              </Field>

              <Field
                id="m-email"
                label="College Email ID"
                required
                error={fieldErrors["personal.email"]}
              >
                <input
                  id="m-email"
                  type="email"
                  value={form.personal.email}
                  onChange={(event) => setPersonal("email", event.target.value)}
                  maxLength={254}
                  autoComplete="email"
                  disabled={loading}
                  aria-invalid={Boolean(fieldErrors["personal.email"])}
                  aria-describedby={
                    fieldErrors["personal.email"] ? "m-email-error" : undefined
                  }
                  className={inputClass}
                  placeholder="you@acet.edu.in"
                />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className="block text-sm font-medium text-navy dark:text-white mb-2">
                  Are you currently working on at least one startup?{" "}
                  <span aria-hidden="true" className="text-orange">
                    *
                  </span>
                </p>
                <YesNo
                  name="activelyWorking"
                  value={form.activelyWorking}
                  onChange={(value) => setField("activelyWorking", value)}
                  disabled={loading}
                />
                {form.activelyWorking === false && (
                  <div
                    role="alert"
                    className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-200"
                  >
                    You are not eligible to apply. BLIEVE E-Cell is a platform
                    for students who are serious about building startups.
                    Applicants must be actively working on at least one startup
                    to be eligible for membership.
                  </div>
                )}
                {form.activelyWorking === null && (
                  <p className="mt-2 text-xs text-text-light dark:text-white/40">
                    Select Yes to continue with the application.
                  </p>
                )}
              </div>

              {fieldErrors["startups"] && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {fieldErrors["startups"]}
                </p>
              )}

              {form.startups.map((startup, index) => (
                <fieldset
                  key={index}
                  className="border border-gray-100 dark:border-white/10 rounded-2xl p-5 md:p-6"
                >
                  <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-orange">
                    Startup {index + 1}
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                    <Field
                      id={`m-startup-${index}-name`}
                      label="Startup Name"
                      required
                      error={fieldErrors[`startups.${index}.name`]}
                    >
                      <input
                        id={`m-startup-${index}-name`}
                        type="text"
                        value={startup.name}
                        onChange={(event) =>
                          setStartup(index, "name", event.target.value)
                        }
                        maxLength={150}
                        disabled={loading}
                        className={inputClass}
                        placeholder="Your startup name"
                      />
                    </Field>

                    <Field
                      id={`m-startup-${index}-role`}
                      label="Your role in the startup"
                      required
                      error={fieldErrors[`startups.${index}.role`]}
                    >
                      <input
                        id={`m-startup-${index}-role`}
                        type="text"
                        value={startup.role}
                        onChange={(event) =>
                          setStartup(index, "role", event.target.value)
                        }
                        maxLength={150}
                        disabled={loading}
                        className={inputClass}
                        placeholder="e.g. Founder, CTO"
                      />
                    </Field>

                    <div className="md:col-span-2">
                      <Field
                        id={`m-startup-${index}-description`}
                        label="Describe your startup and the problem it solves"
                        required
                        error={fieldErrors[`startups.${index}.description`]}
                      >
                        <textarea
                          id={`m-startup-${index}-description`}
                          value={startup.description}
                          onChange={(event) =>
                            setStartup(index, "description", event.target.value)
                          }
                          rows={3}
                          maxLength={3000}
                          disabled={loading}
                          className={`${inputClass} resize-none`}
                          placeholder="What does your startup do, and which problem does it solve?"
                        />
                      </Field>
                    </div>

                    <Field
                      id={`m-startup-${index}-duration`}
                      label="How long have you been working on this startup?"
                      required
                      error={fieldErrors[`startups.${index}.duration`]}
                    >
                      <input
                        id={`m-startup-${index}-duration`}
                        type="text"
                        value={startup.duration}
                        onChange={(event) =>
                          setStartup(index, "duration", event.target.value)
                        }
                        maxLength={100}
                        disabled={loading}
                        className={inputClass}
                        placeholder="e.g. 6 months"
                      />
                    </Field>

                    <Field
                      id={`m-startup-${index}-stage`}
                      label="Current Startup Stage"
                      required
                      error={fieldErrors[`startups.${index}.stage`]}
                    >
                      <select
                        id={`m-startup-${index}-stage`}
                        value={startup.stage}
                        onChange={(event) =>
                          setStartup(index, "stage", event.target.value)
                        }
                        disabled={loading}
                        className={inputClass}
                      >
                        <option value="">Select stage</option>
                        {STAGES.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field
                      id={`m-startup-${index}-teamSize`}
                      label="Number of Startup Team Members"
                      required
                      error={fieldErrors[`startups.${index}.teamSize`]}
                    >
                      <input
                        id={`m-startup-${index}-teamSize`}
                        type="text"
                        inputMode="numeric"
                        value={startup.teamSize}
                        onChange={(event) =>
                          setStartup(index, "teamSize", event.target.value)
                        }
                        maxLength={20}
                        disabled={loading}
                        className={inputClass}
                        placeholder="e.g. 4"
                      />
                    </Field>

                    <div className="md:col-span-2">
                      <Field
                        id={`m-startup-${index}-progress`}
                        label="What progress have you made so far?"
                        required
                        error={fieldErrors[`startups.${index}.progress`]}
                      >
                        <textarea
                          id={`m-startup-${index}-progress`}
                          value={startup.progress}
                          onChange={(event) =>
                            setStartup(index, "progress", event.target.value)
                          }
                          rows={3}
                          maxLength={3000}
                          disabled={loading}
                          className={`${inputClass} resize-none`}
                          placeholder="Traction, users, prototypes, revenue, partnerships..."
                        />
                      </Field>
                    </div>

                    <div className="md:col-span-2">
                      <p className="block text-sm font-medium text-navy dark:text-white mb-2">
                        Does your startup have an online presence?
                      </p>
                      <YesNo
                        name={`onlinePresence-${index}`}
                        value={startup.hasOnlinePresence}
                        onChange={(value) =>
                          setStartup(index, "hasOnlinePresence", value)
                        }
                        disabled={loading}
                      />
                    </div>

                    {startup.hasOnlinePresence && (
                      <div className="md:col-span-2">
                        <Field
                          id={`m-startup-${index}-links`}
                          label="Website, LinkedIn, Instagram, GitHub, or other relevant links"
                          hint="Optional — separate multiple links with commas"
                        >
                          <input
                            id={`m-startup-${index}-links`}
                            type="text"
                            value={startup.links}
                            onChange={(event) =>
                              setStartup(index, "links", event.target.value)
                            }
                            maxLength={500}
                            disabled={loading}
                            className={inputClass}
                            placeholder="https://..."
                          />
                        </Field>
                      </div>
                    )}
                  </div>

                  {form.startups.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          startups: previous.startups.filter(
                            (_, i) => i !== index
                          ),
                        }))
                      }
                      disabled={loading}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:underline"
                    >
                      <Trash2 size={15} aria-hidden="true" />
                      Remove this startup
                    </button>
                  )}
                </fieldset>
              ))}

              {form.startups.length < MAX_STARTUPS && (
                <button
                  type="button"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      startups: [...previous.startups, emptyStartup()],
                    }))
                  }
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-3 border border-dashed border-orange/50 text-orange font-semibold rounded-xl hover:bg-orange/5 transition-colors text-sm"
                >
                  <Plus size={16} aria-hidden="true" />
                  Add another startup
                </button>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="block text-sm font-medium text-navy dark:text-white mb-1.5">
                  What skills can you contribute to your startup and BLIEVE
                  E-Cell?{" "}
                  <span aria-hidden="true" className="text-orange">
                    *
                  </span>
                  <span className="sr-only"> (required)</span>
                </p>
                {fieldErrors["skills"] && (
                  <p className="mb-2 text-xs text-red-600 dark:text-red-400">
                    {fieldErrors["skills"]}
                  </p>
                )}
                <CheckGrid
                  options={SKILLS}
                  selected={form.skills}
                  onToggle={(value) => toggleInList("skills", value)}
                />
              </div>

              <Field
                id="m-contribution"
                label="Explain how you can contribute to BLIEVE E-Cell"
                required
                error={fieldErrors["contribution"]}
              >
                <textarea
                  id="m-contribution"
                  value={form.contribution}
                  onChange={(event) => setField("contribution", event.target.value)}
                  rows={4}
                  maxLength={3000}
                  disabled={loading}
                  aria-invalid={Boolean(fieldErrors["contribution"])}
                  className={`${inputClass} resize-none`}
                  placeholder="Mentoring juniors, building demos, running workshops..."
                />
              </Field>

              <Field
                id="m-hours"
                label="How many hours per week can you dedicate to startup activities?"
                required
                error={fieldErrors["hoursPerWeek"]}
              >
                <select
                  id="m-hours"
                  value={form.hoursPerWeek}
                  onChange={(event) => setField("hoursPerWeek", event.target.value)}
                  disabled={loading}
                  aria-invalid={Boolean(fieldErrors["hoursPerWeek"])}
                  className={inputClass}
                >
                  <option value="">Select hours per week</option>
                  {HOURS.map((hours) => (
                    <option key={hours} value={hours}>
                      {hours}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="m-challenges"
                label="What are the biggest challenges you currently face in building your startup?"
                hint="Optional"
              >
                <textarea
                  id="m-challenges"
                  value={form.challenges}
                  onChange={(event) => setField("challenges", event.target.value)}
                  rows={3}
                  maxLength={2000}
                  disabled={loading}
                  className={`${inputClass} resize-none`}
                  placeholder="Funding, time, technical skills, finding co-founders..."
                />
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <Field
                id="m-whyJoin"
                label="Why do you want to join BLIEVE E-Cell?"
                required
                error={fieldErrors["whyJoin"]}
              >
                <textarea
                  id="m-whyJoin"
                  value={form.whyJoin}
                  onChange={(event) => setField("whyJoin", event.target.value)}
                  rows={4}
                  maxLength={3000}
                  disabled={loading}
                  aria-invalid={Boolean(fieldErrors["whyJoin"])}
                  className={`${inputClass} resize-none`}
                  placeholder="What draws you to the E-Cell community?"
                />
              </Field>

              <div>
                <p className="block text-sm font-medium text-navy dark:text-white mb-1.5">
                  What do you expect from BLIEVE E-Cell?{" "}
                  <span aria-hidden="true" className="text-orange">
                    *
                  </span>
                  <span className="sr-only"> (required)</span>
                </p>
                {fieldErrors["expectations"] && (
                  <p className="mb-2 text-xs text-red-600 dark:text-red-400">
                    {fieldErrors["expectations"]}
                  </p>
                )}
                <CheckGrid
                  options={EXPECTATIONS}
                  selected={form.expectations}
                  onToggle={(value) => toggleInList("expectations", value)}
                />
              </div>

              <div>
                <p className="block text-sm font-medium text-navy dark:text-white mb-2">
                  Are you willing to actively participate in E-Cell activities?{" "}
                  <span aria-hidden="true" className="text-orange">
                    *
                  </span>
                </p>
                <YesNo
                  name="willingToParticipate"
                  value={form.willingToParticipate}
                  onChange={(value) => setField("willingToParticipate", value)}
                  disabled={loading}
                />
                {fieldErrors["willingToParticipate"] && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {fieldErrors["willingToParticipate"]}
                  </p>
                )}
              </div>

              <div>
                <p className="block text-sm font-medium text-navy dark:text-white mb-2">
                  Are you willing to follow BLIEVE E-Cell&apos;s rules and
                  guidelines?{" "}
                  <span aria-hidden="true" className="text-orange">
                    *
                  </span>
                </p>
                <YesNo
                  name="agreesToRules"
                  value={form.agreesToRules}
                  onChange={(value) => setField("agreesToRules", value)}
                  disabled={loading}
                />
                {fieldErrors["agreesToRules"] && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {fieldErrors["agreesToRules"]}
                  </p>
                )}
              </div>

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                  form.confirmsStartup
                    ? "border-orange bg-orange/5"
                    : "border-gray-200 dark:border-white/10"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.confirmsStartup}
                  onChange={(event) =>
                    setField("confirmsStartup", event.target.checked)
                  }
                  disabled={loading}
                  className="mt-0.5 h-4 w-4 accent-orange flex-shrink-0"
                />
                <span className="text-sm text-text-grey dark:text-gray-400">
                  Confirm that you are actively working on at least one startup.{" "}
                  <span aria-hidden="true" className="text-orange">
                    *
                  </span>
                </span>
              </label>
              {fieldErrors["confirmsStartup"] && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {fieldErrors["confirmsStartup"]}
                </p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-pale dark:bg-white/5 rounded-2xl p-5 md:p-6 border border-orange/10">
                <p className="text-sm leading-relaxed text-text-grey dark:text-gray-400">
                  I confirm that the information provided in this application is
                  accurate and complete. I understand that BLIEVE E-Cell
                  membership is intended for students actively working on at
                  least one startup. I agree to follow the organization&apos;s
                  rules and guidelines. I understand that submitting this
                  application does not guarantee membership and that my
                  eligibility is subject to verification and approval.
                </p>
              </div>

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                  form.declarationAccepted
                    ? "border-orange bg-orange/5"
                    : "border-gray-200 dark:border-white/10"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.declarationAccepted}
                  onChange={(event) =>
                    setField("declarationAccepted", event.target.checked)
                  }
                  disabled={loading}
                  aria-invalid={Boolean(fieldErrors["declarationAccepted"])}
                  className="mt-0.5 h-4 w-4 accent-orange flex-shrink-0"
                />
                <span className="text-sm text-text-grey dark:text-gray-400">
                  I have read and accept the declaration above.{" "}
                  <span aria-hidden="true" className="text-orange">
                    *
                  </span>
                </span>
              </label>
              {fieldErrors["declarationAccepted"] && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {fieldErrors["declarationAccepted"]}
                </p>
              )}

              <div className="hidden" aria-hidden="true">
                <label htmlFor="m-website">Leave this field empty</label>
                <input
                  id="m-website"
                  type="text"
                  value={form.website}
                  onChange={(event) => setField("website", event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-white/10 px-5 md:px-8 py-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface dark:bg-white/[0.03]">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0 || loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 dark:border-white/15 text-navy dark:text-white font-semibold rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={loading || (step === 1 && form.activelyWorking !== true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {startupBlocked ? "Select Yes to continue" : "Next"}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange text-white font-semibold rounded-xl hover:bg-orange-light transition-colors shadow-lg shadow-orange/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} aria-hidden="true" className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <Send size={16} aria-hidden="true" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
