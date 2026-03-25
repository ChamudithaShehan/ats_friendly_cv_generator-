import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  BorderStyle, TabStopType, TabStopPosition,
} from "docx";
import { saveAs } from "file-saver";
import type { ResumeData } from "@/context/ResumeContext";

function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC", space: 1 } },
    spacing: { after: 120 },
  });
}

function sectionHeading(text: string) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24, font: "Arial", color: "111827" })],
    spacing: { before: 240, after: 80 },
  });
}

function buildPersonalSection(r: ResumeData): Paragraph[] {
  const p = r.personalInfo;
  const paragraphs: Paragraph[] = [];

  if (p.fullName) {
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: p.fullName, bold: true, size: 32, font: "Arial", color: "111827" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    }));
  }

  if (p.jobTitle.trim()) {
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: p.jobTitle, bold: true, size: 22, font: "Arial", color: "374151" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }));
  }

  const contactParts = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);
  if (contactParts.length > 0) {
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: contactParts.join("  |  "), size: 18, font: "Arial", color: "6B7280" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }));
  }

  return paragraphs;
}

function buildSummarySection(summary: string): Paragraph[] {
  if (!summary.trim()) return [];
  return [
    sectionHeading("Professional Summary"),
    divider(),
    new Paragraph({
      children: [new TextRun({ text: summary, size: 20, font: "Arial", color: "374151" })],
      spacing: { after: 120 },
    }),
  ];
}

function buildExperienceSection(r: ResumeData): Paragraph[] {
  if (r.experience.length === 0) return [];
  const paragraphs: Paragraph[] = [sectionHeading("Work Experience"), divider()];

  r.experience.forEach((exp) => {
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({ text: exp.position, bold: true, size: 22, font: "Arial", color: "111827" }),
        new TextRun({ text: `\t${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`, size: 18, font: "Arial", color: "6B7280" }),
      ],
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      spacing: { before: 120, after: 40 },
    }));

    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: exp.company, size: 20, font: "Arial", color: "4B5563", italics: true })],
      spacing: { after: 60 },
    }));

    if (exp.description.trim()) {
      exp.description.split("\n").filter(Boolean).forEach((line) => {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: line.trim(), size: 20, font: "Arial", color: "374151" })],
          spacing: { after: 40 },
          indent: { left: 360 },
        }));
      });
    }
  });

  return paragraphs;
}

function buildEducationSection(r: ResumeData): Paragraph[] {
  if (r.education.length === 0) return [];
  const paragraphs: Paragraph[] = [sectionHeading("Education"), divider()];

  r.education.forEach((edu) => {
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({ text: `${edu.degree} in ${edu.field}`, bold: true, size: 22, font: "Arial", color: "111827" }),
        new TextRun({ text: `\t${edu.startDate} – ${edu.endDate}`, size: 18, font: "Arial", color: "6B7280" }),
      ],
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      spacing: { before: 120, after: 40 },
    }));

    const details = [edu.institution, edu.gpa ? `GPA: ${edu.gpa}` : ""].filter(Boolean).join("  |  ");
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: details, size: 20, font: "Arial", color: "4B5563", italics: true })],
      spacing: { after: 80 },
    }));
  });

  return paragraphs;
}

function buildSkillsSection(skills: string[]): Paragraph[] {
  if (skills.length === 0) return [];
  return [
    sectionHeading("Skills"),
    divider(),
    new Paragraph({
      children: [new TextRun({ text: skills.join("  •  "), size: 20, font: "Arial", color: "374151" })],
      spacing: { after: 120 },
    }),
  ];
}

function buildLanguagesSection(languages: string[]): Paragraph[] {
  if (languages.length === 0) return [];
  return [
    sectionHeading("Languages"),
    divider(),
    new Paragraph({
      children: [new TextRun({ text: languages.join("  •  "), size: 20, font: "Arial", color: "374151" })],
      spacing: { after: 120 },
    }),
  ];
}

function buildInterestsSection(interests: string[]): Paragraph[] {
  if (interests.length === 0) return [];
  return [
    sectionHeading("Interests"),
    divider(),
    new Paragraph({
      children: [new TextRun({ text: interests.join("  •  "), size: 20, font: "Arial", color: "374151" })],
      spacing: { after: 120 },
    }),
  ];
}

function buildProjectsSection(r: ResumeData): Paragraph[] {
  if (r.projects.length === 0) return [];
  const paragraphs: Paragraph[] = [sectionHeading("Projects"), divider()];

  r.projects.forEach((proj) => {
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: proj.name, bold: true, size: 22, font: "Arial", color: "111827" })],
      spacing: { before: 120, after: 40 },
    }));
    if (proj.description.trim()) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: proj.description, size: 20, font: "Arial", color: "374151" })],
        spacing: { after: 40 },
      }));
    }
    if (proj.technologies.trim()) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: `Technologies: ${proj.technologies}`, size: 18, font: "Arial", color: "6B7280", italics: true })],
        spacing: { after: 80 },
      }));
    }
  });

  return paragraphs;
}

function buildCertificationsSection(r: ResumeData): Paragraph[] {
  if (r.certifications.length === 0) return [];
  const paragraphs: Paragraph[] = [sectionHeading("Certifications"), divider()];

  r.certifications.forEach((cert) => {
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({ text: cert.name, bold: true, size: 20, font: "Arial", color: "111827" }),
        new TextRun({ text: ` – ${cert.issuer}`, size: 20, font: "Arial", color: "4B5563" }),
        ...(cert.date ? [new TextRun({ text: `  (${cert.date})`, size: 18, font: "Arial", color: "6B7280" })] : []),
      ],
      spacing: { before: 60, after: 60 },
    }));
  });

  return paragraphs;
}

const sectionBuilders: Record<string, (r: ResumeData) => Paragraph[]> = {
  personal: buildPersonalSection,
  summary: (r) => buildSummarySection(r.summary),
  experience: buildExperienceSection,
  education: buildEducationSection,
  skills: (r) => buildSkillsSection(r.skills),
  projects: buildProjectsSection,
  certifications: buildCertificationsSection,
};

export async function generateDOCX(resume: ResumeData, filename: string = "resume.docx") {
  const children: Paragraph[] = [];

  const order = resume.sectionOrder ?? ["personal", "summary", "experience", "education", "skills", "projects", "certifications"];

  order.forEach((sectionId) => {
    const builder = sectionBuilders[sectionId];
    if (builder) {
      children.push(...builder(resume));
    }
  });

  children.push(...buildLanguagesSection(resume.languages));
  children.push(...buildInterestsSection(resume.interests));

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      children,
    }],
  });

  const buffer = await Packer.toBlob(doc);
  saveAs(buffer, filename);
}
