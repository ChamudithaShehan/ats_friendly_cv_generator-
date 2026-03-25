import type { SectionId } from "@/context/ResumeContext";

export type ResumeTemplateId =
  | "classic"
  | "modern"
  | "minimal"
  | "executive"
  | "technical"
  | "creative"
  | "compact"
  | "structured"
  | "academic"
  | "impact";

export type TemplateCategory = "ATS Friendly" | "Normal CV";

export interface ResumeTemplate {
  id: ResumeTemplateId;
  name: string;
  description: string;
  tags: string[];
  atsScore: number;
  bestFor: string;
  category: TemplateCategory;
  defaultSectionOrder: SectionId[];
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout with clear section dividers and keyword-friendly headings.",
    tags: ["ATS Safe", "Traditional"],
    atsScore: 98,
    bestFor: "General applications, entry to mid-level roles",
    category: "ATS Friendly",
    defaultSectionOrder: ["personal", "summary", "experience", "education", "skills", "projects", "certifications"],
  },
  {
    id: "modern",
    name: "Modern",
    description: "Polished modern layout with a strong personal-branding style and visual sidebar presentation.",
    tags: ["Visual", "Popular"],
    atsScore: 97,
    category: "Normal CV",
    bestFor: "Product, marketing, operations, business roles",
    defaultSectionOrder: ["personal", "summary", "experience", "skills", "education", "projects", "certifications"],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Low-decoration format focused on readability and parser consistency.",
    tags: ["ATS Safe", "Clean"],
    atsScore: 99,
    category: "ATS Friendly",
    bestFor: "High-volume job applications and strict ATS pipelines",
    defaultSectionOrder: ["personal", "summary", "experience", "skills", "education", "projects", "certifications"],
  },
  {
    id: "executive",
    name: "Executive",
    description: "Premium executive look with elevated typography, elegant spacing, and leadership-focused storytelling.",
    tags: ["Premium", "Senior"],
    atsScore: 96,
    category: "Normal CV",
    bestFor: "Leadership, director, VP, and C-level roles",
    defaultSectionOrder: ["personal", "summary", "experience", "skills", "education", "certifications", "projects"],
  },
  {
    id: "technical",
    name: "Technical",
    description: "Modern technical profile with structured highlights, visual skill emphasis, and project-first readability.",
    tags: ["Visual", "Tech"],
    category: "Normal CV",
    atsScore: 98,
    bestFor: "Software, data, IT, and engineering positions",
    defaultSectionOrder: ["personal", "summary", "skills", "experience", "projects", "education", "certifications"],
  },
  {
    id: "creative",
    name: "Creative",
    description: "Canva-style creative presentation with clean cards, accent colors, and portfolio-friendly personality.",
    tags: ["Creative", "Design"],
    category: "Normal CV",
    atsScore: 95,
    bestFor: "Design, content, and brand-focused roles",
    defaultSectionOrder: ["personal", "summary", "experience", "projects", "skills", "education", "certifications"],
  },
  {
    id: "compact",
    name: "Compact",
    description: "High-density layout for one-page resumes without sacrificing ATS readability.",
    category: "ATS Friendly",
    tags: ["ATS Safe", "One Page"],
    atsScore: 97,
    bestFor: "Early-career professionals and concise applications",
    defaultSectionOrder: ["personal", "summary", "skills", "experience", "education", "projects", "certifications"],
  },
  {
    id: "structured",
    name: "Structured",
    description: "Grid-aligned contact and section rhythm for a clean, organized professional look.",
    category: "ATS Friendly",
    tags: ["ATS Safe", "Organized"],
    atsScore: 98,
    bestFor: "Operations, consulting, and analyst roles",
    defaultSectionOrder: ["personal", "summary", "experience", "skills", "projects", "education", "certifications"],
  },
  {
    id: "academic",
    name: "Academic",
    description: "Modern academic profile with refined hierarchy for research, teaching, and institutional applications.",
    category: "Normal CV",
    tags: ["Scholarly", "Research"],
    atsScore: 96,
    bestFor: "Teaching, research, and academic institutions",
    defaultSectionOrder: ["personal", "summary", "education", "experience", "projects", "skills", "certifications"],
  },
  {
    id: "impact",
    name: "Impact",
    category: "Normal CV",
    description: "Bold results-oriented template with business-ready cards and prominent achievement storytelling.",
    tags: ["Results", "Visual"],
    atsScore: 98,
    bestFor: "Sales, growth, and performance-driven roles",
    defaultSectionOrder: ["personal", "summary", "experience", "projects", "skills", "education", "certifications"],
  },
];

export const DEFAULT_TEMPLATE_ID: ResumeTemplateId = "classic";

export function getTemplateById(templateId: string): ResumeTemplate {
  return RESUME_TEMPLATES.find((template) => template.id === templateId) ?? RESUME_TEMPLATES[0];
}
