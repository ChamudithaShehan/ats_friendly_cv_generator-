import { createContext, useContext, useState, ReactNode } from "react";
import { DEFAULT_TEMPLATE_ID } from "@/lib/resume-templates";

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  profileImage?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export type SectionId = "personal" | "summary" | "experience" | "education" | "skills" | "projects" | "certifications";

export const DEFAULT_SECTION_ORDER: SectionId[] = ["personal", "summary", "experience", "education", "skills", "projects", "certifications"];

export interface ResumeData {
  id: string;
  title: string;
  templateId: string;
  lastModified: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
  interests: string[];
  projects: Project[];
  certifications: Certification[];
  completionPercent: number;
  sectionOrder: SectionId[];
}

const emptyResume: ResumeData = {
  id: "",
  title: "Untitled Resume",
  templateId: DEFAULT_TEMPLATE_ID,
  lastModified: new Date().toISOString(),
  personalInfo: { fullName: "", jobTitle: "", email: "", phone: "", location: "", linkedin: "", website: "", profileImage: undefined },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  interests: [],
  projects: [],
  certifications: [],
  completionPercent: 0,
  sectionOrder: [...DEFAULT_SECTION_ORDER],
};

const dummyResumes: ResumeData[] = [
  {
    id: "1",
    title: "Software Engineer Resume",
    templateId: "classic",
    lastModified: "2026-03-20T10:00:00Z",
    personalInfo: {
      fullName: "Alex Johnson",
      jobTitle: "Senior Software Engineer",
      email: "alex@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/alexjohnson",
      website: "alexjohnson.dev",
      profileImage: undefined,
    },
    summary: "Experienced software engineer with 5+ years building scalable web applications. Proficient in React, TypeScript, Node.js, and cloud infrastructure. Passionate about clean code and user-centric design.",
    experience: [
      {
        id: "e1",
        company: "TechCorp Inc.",
        position: "Senior Software Engineer",
        startDate: "2023-01",
        endDate: "",
        current: true,
        description: "Lead development of customer-facing dashboard serving 100K+ users. Reduced page load time by 40% through code splitting and lazy loading. Mentored 3 junior developers.",
      },
      {
        id: "e2",
        company: "StartupXYZ",
        position: "Full Stack Developer",
        startDate: "2021-03",
        endDate: "2022-12",
        current: false,
        description: "Built REST APIs and React frontend for an e-commerce platform. Implemented CI/CD pipelines reducing deployment time by 60%.",
      },
    ],
    education: [
      {
        id: "ed1",
        institution: "University of California, Berkeley",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2017",
        endDate: "2021",
        gpa: "3.8",
      },
    ],
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "PostgreSQL", "Docker", "Git", "REST APIs", "GraphQL"],
    languages: ["English", "Spanish"],
    interests: ["Mentorship", "Open Source", "AI Products"],
    projects: [
      {
        id: "p1",
        name: "TaskFlow",
        description: "Open-source project management tool with real-time collaboration features. 500+ GitHub stars.",
        technologies: "React, Node.js, Socket.io, MongoDB",
        link: "github.com/alex/taskflow",
      },
    ],
    certifications: [
      { id: "c1", name: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "2024-06" },
    ],
    completionPercent: 92,
    sectionOrder: [...DEFAULT_SECTION_ORDER],
  },
  {
    id: "2",
    title: "Product Manager Resume",
    templateId: "modern",
    lastModified: "2026-03-18T14:30:00Z",
    personalInfo: {
      fullName: "Sarah Chen",
      jobTitle: "Product Manager",
      email: "sarah@example.com",
      phone: "+1 (555) 987-6543",
      location: "New York, NY",
      linkedin: "linkedin.com/in/sarachen",
      website: "",
      profileImage: undefined,
    },
    summary: "Product manager with 4 years of experience driving product strategy and execution. Track record of launching features that increased user engagement by 35%.",
    experience: [
      {
        id: "e3",
        company: "BigTech Co.",
        position: "Product Manager",
        startDate: "2022-06",
        endDate: "",
        current: true,
        description: "Own product roadmap for analytics suite used by 50K+ businesses. Led cross-functional team of 12 to deliver quarterly releases.",
      },
    ],
    education: [
      {
        id: "ed2",
        institution: "Columbia University",
        degree: "MBA",
        field: "Technology Management",
        startDate: "2020",
        endDate: "2022",
        gpa: "3.9",
      },
    ],
    skills: ["Product Strategy", "Agile", "SQL", "Figma", "A/B Testing", "User Research", "Jira", "Data Analysis"],
    languages: ["English", "Mandarin"],
    interests: ["Consumer Research", "Design Systems", "Travel"],
    projects: [],
    certifications: [],
    completionPercent: 75,
    sectionOrder: [...DEFAULT_SECTION_ORDER],
  },
];

function calcCompletion(r: ResumeData): number {
  let score = 0;
  const total = 7;
  if (r.personalInfo.fullName && r.personalInfo.email) score++;
  if (r.summary.length > 20) score++;
  if (r.experience.length > 0) score++;
  if (r.education.length > 0) score++;
  if (r.skills.length >= 3) score++;
  if (r.projects.length > 0) score++;
  if (r.certifications.length > 0) score++;
  return Math.round((score / total) * 100);
}

interface ResumeContextType {
  resumes: ResumeData[];
  currentResume: ResumeData | null;
  setCurrentResume: (r: ResumeData | null) => void;
  updateResume: (r: ResumeData) => void;
  createResume: () => ResumeData;
  deleteResume: (id: string) => void;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumes, setResumes] = useState<ResumeData[]>(dummyResumes);
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);

  const updateResume = (updated: ResumeData) => {
    const withCompletion = { ...updated, completionPercent: calcCompletion(updated), lastModified: new Date().toISOString() };
    setResumes((prev) => prev.map((r) => (r.id === withCompletion.id ? withCompletion : r)));
    setCurrentResume(withCompletion);
  };

  const createResume = () => {
    const newResume: ResumeData = { ...emptyResume, id: Date.now().toString(), lastModified: new Date().toISOString() };
    setResumes((prev) => [newResume, ...prev]);
    setCurrentResume(newResume);
    return newResume;
  };

  const deleteResume = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
    if (currentResume?.id === id) setCurrentResume(null);
  };

  return (
    <ResumeContext.Provider value={{ resumes, currentResume, setCurrentResume, updateResume, createResume, deleteResume }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within ResumeProvider");
  return ctx;
}
