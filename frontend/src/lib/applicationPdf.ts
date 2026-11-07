import type { MembershipApplication } from "@/lib/membership/options";

const NAVY: [number, number, number] = [11, 31, 58];
const ORANGE: [number, number, number] = [224, 106, 32];
const TEXT: [number, number, number] = [74, 74, 74];
const MUTED: [number, number, number] = [122, 122, 122];

function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

function yesNo(value: boolean): string {
  return value ? "Yes" : "No";
}

function joined(values: string[]): string {
  return values.length > 0 ? values.join(", ") : "";
}

function fileNameFor(application: MembershipApplication): string {
  const slug = application.personal.fullName
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `BLIEVE-Membership-${application.id}${slug ? `-${slug}` : ""}.pdf`;
}

export async function downloadApplicationPdf(
  application: MembershipApplication
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const bottom = pageHeight - 22;
  let y = 0;

  const newPage = () => {
    doc.addPage();
    y = 18;
  };

  const ensure = (height: number) => {
    if (y + height > bottom) newPage();
  };

  const heading = (title: string) => {
    ensure(13);
    doc.setFillColor(...ORANGE);
    doc.rect(margin, y + 1, 2.5, 5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text(title, margin + 6, y + 5.5);
    y += 10;
  };

  const field = (label: string, value: string) => {
    if (!value) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(value, contentWidth) as string[];
    const height = 4 + lines.length * 4.6 + 3;
    ensure(height);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(label.toUpperCase(), margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...TEXT);
    doc.text(lines, margin, y + 4);
    y += height;
  };

  const pair = (
    left: { label: string; value: string } | null,
    right: { label: string; value: string } | null
  ) => {
    if (!left?.value && !right?.value) return;
    const columnWidth = contentWidth / 2 - 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const leftLines =
      left?.value !== undefined
        ? (doc.splitTextToSize(left.value, columnWidth) as string[])
        : [];
    const rightLines =
      right?.value !== undefined
        ? (doc.splitTextToSize(right.value, columnWidth) as string[])
        : [];
    const height =
      4 + Math.max(leftLines.length, rightLines.length) * 4.6 + 3;
    ensure(height);

    const drawAt = (item: { label: string; value: string } | null, x: number) => {
      if (!item?.value) return;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      doc.text(item.label.toUpperCase(), x, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...TEXT);
      const lines = doc.splitTextToSize(item.value, columnWidth) as string[];
      doc.text(lines, x, y + 4);
    };

    drawAt(left, margin);
    drawAt(right, margin + contentWidth / 2 + 4);
    y += height;
  };

  const divider = () => {
    ensure(5);
    doc.setDrawColor(228, 228, 228);
    doc.line(margin, y + 1, pageWidth - margin, y + 1);
    y += 5;
  };

  /* ------------------------------ header ------------------------------ */

  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setFillColor(...ORANGE);
  doc.rect(0, 0, pageWidth, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...ORANGE);
  doc.text("BLIEVE E-CELL", margin, 14);

  doc.setFontSize(19);
  doc.setTextColor(255, 255, 255);
  doc.text("Membership Application", margin, 23);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`Application ${application.id}`, margin, 31);
  doc.text(
    `Submitted ${formatDate(application.submittedAt)}`,
    margin,
    36
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  const statusLabel = application.status;
  const statusWidth = doc.getTextWidth(statusLabel) + 8;
  doc.setFillColor(...ORANGE);
  doc.roundedRect(
    pageWidth - margin - statusWidth,
    25,
    statusWidth,
    7,
    3.5,
    3.5,
    "F"
  );
  doc.setTextColor(255, 255, 255);
  doc.text(statusLabel, pageWidth - margin - statusWidth / 2, 29.7, {
    align: "center",
  });

  y = 50;

  /* ----------------------------- applicant ---------------------------- */

  heading("Applicant");
  pair(
    { label: "Full name", value: application.personal.fullName },
    { label: "USN", value: application.personal.usn }
  );
  pair(
    { label: "Department", value: application.personal.department },
    { label: "Year of study", value: application.personal.year }
  );
  pair(
    { label: "Contact number", value: application.personal.phone },
    { label: "College email", value: application.personal.email }
  );
  field(
    "Actively working on a startup",
    yesNo(application.activelyWorking)
  );

  /* ----------------------------- startups ----------------------------- */

  heading("Startup Information");
  application.startups.forEach((startup, index) => {
    ensure(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...NAVY);
    doc.text(
      `${index + 1}. ${startup.name || "Untitled startup"}`,
      margin,
      y + 4
    );
    y += 8;
    pair(
      { label: "Stage", value: startup.stage },
      { label: "Your role", value: startup.role }
    );
    pair(
      { label: "Duration", value: startup.duration },
      { label: "Team members", value: startup.teamSize }
    );
    field(
      "Online presence",
      startup.hasOnlinePresence
        ? `Yes${startup.links ? ` — ${startup.links}` : ""}`
        : "No"
    );
    field("Startup description", startup.description);
    field("Progress so far", startup.progress);
    if (index < application.startups.length - 1) divider();
  });

  /* ------------------------ skills & contribution --------------------- */

  heading("Skills & Contribution");
  field("Skills", joined(application.skills));
  field("Hours per week", application.hoursPerWeek);
  field("Contribution", application.contribution);
  field("Current challenges", application.challenges);

  /* ---------------------- membership motivation ----------------------- */

  heading("BLIEVE E-Cell Membership");
  field("Why join BLIEVE E-Cell", application.whyJoin);
  field("Expectations", joined(application.expectations));
  pair(
    {
      label: "Willing to participate",
      value: yesNo(application.willingToParticipate),
    },
    {
      label: "Follows rules and guidelines",
      value: yesNo(application.agreesToRules),
    }
  );
  pair(
    {
      label: "Confirmed active startup",
      value: yesNo(application.confirmsStartup),
    },
    {
      label: "Declaration accepted",
      value: yesNo(application.declarationAccepted),
    }
  );

  /* ------------------------------- review ----------------------------- */

  heading("Review");
  pair(
    { label: "Application status", value: application.status },
    { label: "Reviewed at", value: formatDate(application.reviewedAt) }
  );
  field("Internal review notes", application.reviewNotes);

  if (application.meeting) {
    heading("Meeting with the E-Cell team");
    field("Date & time", formatDate(application.meeting.at));
    field("Venue or online link", application.meeting.link);
    field("Message for the member", application.meeting.notes);
  }

  /* ------------------------------- footer ----------------------------- */

  const generatedAt = formatDate(new Date().toISOString());
  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(228, 228, 228);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(
      `BLIEVE E-Cell · Membership Application · ${application.id}`,
      margin,
      pageHeight - 9
    );
    doc.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 9, {
      align: "right",
    });
    doc.text(`Generated ${generatedAt}`, pageWidth / 2, pageHeight - 9, {
      align: "center",
    });
  }

  doc.setProperties({
    title: `BLIEVE Membership Application ${application.id}`,
    subject: `Membership application for ${application.personal.fullName}`,
    author: "BLIEVE E-Cell",
    creator: "BLIEVE E-Cell administrator console",
  });

  doc.save(fileNameFor(application));
}
