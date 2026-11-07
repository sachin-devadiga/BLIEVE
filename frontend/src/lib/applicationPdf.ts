import type { MembershipApplication } from "@/lib/membership/options";

const NAVY: [number, number, number] = [11, 31, 58];
const ORANGE: [number, number, number] = [224, 106, 32];
const TEXT: [number, number, number] = [74, 74, 74];
const MUTED: [number, number, number] = [122, 122, 122];
const RULE: [number, number, number] = [226, 226, 226];

const INSTITUTION = "ADITYA COLLEGE OF ENGINEERING & TECHNOLOGY";
const LOCATION = "BENGALURU, KARNATAKA";
const SITE = "www.blieve.in";
const EMAIL = "president@blieve.in";

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

async function loadImageDataUrl(src: string): Promise<string | null> {
  try {
    const response = await fetch(src, { cache: "force-cache" });
    if (!response.ok) return null;
    const blob = await response.blob();
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = "";
    const chunkSize = 0x8000;
    for (let index = 0; index < bytes.length; index += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }
    return `data:${blob.type || "image/png"};base64,${btoa(binary)}`;
  } catch {
    return null;
  }
}

export type ApplicationPdfOptions = {
  audience?: "admin" | "member";
};

export async function downloadApplicationPdf(
  application: MembershipApplication,
  options: ApplicationPdfOptions = {}
): Promise<void> {
  const memberCopy = options.audience === "member";
  const [{ jsPDF }, acetLogo, blieveLogo] = await Promise.all([
    import("jspdf"),
    loadImageDataUrl("/acet-logo.png"),
    loadImageDataUrl("/blieve-logo.png"),
  ]);

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
    doc.setFillColor(...ORANGE);
    doc.rect(0, 0, pageWidth, 1.2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text("BLIEVE E-CELL", margin, 10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(`Membership Application · ${application.id}`, margin + 28, 10);
    doc.text("(continued)", pageWidth - margin, 10, { align: "right" });
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.3);
    doc.line(margin, 12.5, pageWidth - margin, 12.5);
    y = 20;
  };

  const ensure = (height: number) => {
    if (y + height > bottom) newPage();
  };

  const heading = (title: string) => {
    ensure(35);
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
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 1, pageWidth - margin, y + 1);
    y += 5;
  };

  const drawLogo = (
    dataUrl: string | null,
    x: number,
    box: number,
    fallback: string
  ) => {
    const top = 8;
    if (dataUrl) {
      try {
        const props = doc.getImageProperties(dataUrl);
        const ratio = Math.min(box / props.width, box / props.height);
        const width = props.width * ratio;
        const height = props.height * ratio;
        doc.addImage(
          dataUrl,
          "PNG",
          x + (box - width) / 2,
          top + (box - height) / 2,
          width,
          height,
          undefined,
          "FAST"
        );
        return;
      } catch {
        /* fall back to the text mark below */
      }
    }
    doc.setDrawColor(...NAVY);
    doc.setLineWidth(0.4);
    doc.circle(x + box / 2, top + box / 2, box / 2 - 0.5, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...NAVY);
    doc.text(fallback, x + box / 2, top + box / 2 + 2, { align: "center" });
  };

  doc.setFillColor(...ORANGE);
  doc.rect(0, 0, pageWidth, 1.6, "F");

  drawLogo(acetLogo, margin, 20, "ACET");
  drawLogo(blieveLogo, pageWidth - margin - 20, 20, "B");

  const centerX = pageWidth / 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...NAVY);
  doc.text(INSTITUTION, centerX, 13, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  doc.text(LOCATION, centerX, 17, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ORANGE);
  doc.text("BLIEVE E-CELL", centerX, 24, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  doc.text("ENTREPRENEURSHIP CELL", centerX, 27.5, { align: "center" });

  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(0.3);
  doc.line(centerX - 16, 30.5, centerX + 16, 30.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...NAVY);
  doc.text("MEMBERSHIP APPLICATION", centerX, 37.5, { align: "center" });

  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.5);
  doc.line(margin, 42.5, pageWidth - margin, 42.5);
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(0.3);
  doc.line(margin, 43.5, pageWidth - margin, 43.5);

  doc.setFillColor(247, 245, 240);
  doc.roundedRect(margin, 47, contentWidth, 14, 1.5, 1.5, "F");
  const metaColumns = [
    { label: "APPLICATION NO.", value: application.id },
    { label: "SUBMITTED", value: formatDate(application.submittedAt) },
    { label: "STATUS", value: application.status },
  ];
  const metaWidth = contentWidth / 3;
  metaColumns.forEach((item, index) => {
    const x = margin + 6 + index * metaWidth;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text(item.label, x, 53);
    doc.setFontSize(9);
    doc.setTextColor(...(index === 2 ? ORANGE : NAVY));
    doc.text(item.value, x, 58.5);
  });

  y = 70;

  heading("01. Applicant Details");
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
  field("Actively working on a startup", yesNo(application.activelyWorking));

  heading("02. Startup Information");
  application.startups.forEach((startup, index) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    const title = `${index + 1}. ${startup.name || "Untitled startup"}`;
    const titleLines = doc.splitTextToSize(title, contentWidth) as string[];
    ensure(titleLines.length * 5 + 5);
    doc.setTextColor(...NAVY);
    doc.text(titleLines, margin, y + 4);
    y += titleLines.length * 5 + 3;
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

  heading("03. Skills & Contribution");
  field("Skills", joined(application.skills));
  field("Hours per week", application.hoursPerWeek);
  field("Contribution", application.contribution);
  field("Current challenges", application.challenges);

  heading("04. BLIEVE E-Cell Membership");
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

  heading(memberCopy ? "05. Application Status" : "05. Review & Decision");
  pair(
    { label: "Application status", value: application.status },
    memberCopy
      ? null
      : { label: "Reviewed at", value: formatDate(application.reviewedAt) }
  );
  if (!memberCopy) {
    field("Internal review notes", application.reviewNotes);
  }

  if (application.meeting) {
    heading("Meeting with the E-Cell Team");
    field("Date & time", formatDate(application.meeting.at));
    field("Venue or online link", application.meeting.link);
    field("Message for the member", application.meeting.notes);
  }

  heading("06. Declaration");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT);
  const declarationLines = doc.splitTextToSize(
    "I hereby declare that the information furnished in this application is true, complete and correct to the best of my knowledge. I agree to abide by the rules, guidelines and code of conduct of BLIEVE E-Cell.",
    contentWidth
  ) as string[];
  ensure(declarationLines.length * 4.6 + 30);
  doc.text(declarationLines, margin, y);
  y += declarationLines.length * 4.6 + 18;

  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + 62, y);
  doc.line(pageWidth - margin - 62, y, pageWidth - margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text("Date & Signature of Applicant", margin, y + 4);
  doc.text("For BLIEVE E-Cell", pageWidth - margin, y + 4, {
    align: "right",
  });

  const generatedAt = formatDate(new Date().toISOString());
  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...NAVY);
    doc.text(
      "BLIEVE E-Cell · Aditya College of Engineering & Technology",
      margin,
      pageHeight - 11
    );
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(
      `Page ${page} of ${pageCount}`,
      pageWidth - margin,
      pageHeight - 11,
      { align: "right" }
    );
    doc.text(`${SITE} · ${EMAIL}`, margin, pageHeight - 6.5);
    doc.text(`Generated ${generatedAt}`, pageWidth - margin, pageHeight - 6.5, {
      align: "right",
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
