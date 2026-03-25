import type { ResumeData } from "@/context/ResumeContext";
import { getTemplateById, type ResumeTemplateId } from "@/lib/resume-templates";

export function buildTemplatePreviewResume(templateId: ResumeTemplateId): ResumeData {
  const template = getTemplateById(templateId);

  return {
    id: `preview-${templateId}`,
    title: `${template.name} Preview`,
    templateId,
    lastModified: "2026-03-24T00:00:00.000Z",
    personalInfo: {
      fullName: "Jordan Rivera",
      jobTitle: "Product Designer",
      email: "jordan.rivera@email.com",
      phone: "+1 (555) 214-9876",
      location: "Austin, TX",
      linkedin: "linkedin.com/in/jordanrivera",
      website: "jordanrivera.dev",
      profileImage: undefined,
    },
    summary:
      "Designed and launched user-centered digital products across B2B and consumer platforms. Known for translating business goals into elegant user journeys, improving conversion, and elevating brand consistency.",
    experience: [
      {
        id: `exp-${templateId}`,
        company: "Northstar Labs",
        position: "Senior Analyst",
        startDate: "2023-01",
        endDate: "",
        current: true,
        description:
          "Designed end-to-end dashboard experiences used by 40K+ monthly users.\nDeveloped a scalable design system that reduced design-to-dev handoff time by 32%.\nManaged stakeholder workshops to align product roadmap with customer pain points.",
      },
    ],
    education: [
      {
        id: `edu-${templateId}`,
        institution: "State University",
        degree: "Bachelor of Science",
        field: "Information Systems",
        startDate: "2017",
        endDate: "2021",
        gpa: "3.8",
      },
    ],
    skills: ["UI Design", "UX Research", "Product Strategy", "Figma", "Design Systems", "Prototyping"],
    languages: ["English", "Spanish"],
    interests: ["Brand Identity", "Photography", "Human-Centered AI"],
    projects: [
      {
        id: `proj-${templateId}`,
        name: "TalentHub Career Platform",
        description: "Built a modern job-seeker experience that increased completed profile rate by 24% in the first release.",
        technologies: "Figma, React, TypeScript, Hotjar",
        link: "behance.net/jordanrivera/talenthub",
      },
    ],
    certifications: [
      {
        id: `cert-${templateId}`,
        name: "Google Data Analytics",
        issuer: "Google",
        date: "2024-05",
      },
    ],
    completionPercent: 100,
    sectionOrder: template.defaultSectionOrder,
  };
}
