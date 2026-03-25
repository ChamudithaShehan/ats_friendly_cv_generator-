import type { ResumeData } from "@/context/ResumeContext";

export interface ATSCheck {
  id: string;
  label: string;
  category: "content" | "formatting" | "keywords" | "structure";
  passed: boolean;
  severity: "critical" | "warning" | "info";
  tip: string;
}

const ACTION_VERBS = [
  "achieved", "built", "created", "delivered", "developed", "designed",
  "established", "generated", "improved", "increased", "implemented",
  "launched", "led", "managed", "optimized", "reduced", "resolved",
  "scaled", "streamlined", "transformed",
];

const MEASURABLE_PATTERNS = /\d+[%+]|\$[\d,]+|\d+[xX]|\d+\s*(users|customers|clients|team|members|projects|features|endpoints)/i;

export function analyzeResume(resume: ResumeData): { score: number; checks: ATSCheck[] } {
  const checks: ATSCheck[] = [];

  // --- Content checks ---
  checks.push({
    id: "has-name",
    label: "Full name provided",
    category: "content",
    passed: resume.personalInfo.fullName.trim().length > 0,
    severity: "critical",
    tip: "ATS systems require a clear full name at the top of the resume.",
  });

  checks.push({
    id: "has-email",
    label: "Email address included",
    category: "content",
    passed: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.personalInfo.email),
    severity: "critical",
    tip: "Include a valid professional email address for recruiter contact.",
  });

  checks.push({
    id: "has-phone",
    label: "Phone number included",
    category: "content",
    passed: resume.personalInfo.phone.trim().length >= 7,
    severity: "warning",
    tip: "Most recruiters expect a phone number on your resume.",
  });

  checks.push({
    id: "has-location",
    label: "Location specified",
    category: "content",
    passed: resume.personalInfo.location.trim().length > 0,
    severity: "info",
    tip: "Adding location helps with geo-targeted job searches.",
  });

  checks.push({
    id: "has-linkedin",
    label: "LinkedIn profile linked",
    category: "content",
    passed: resume.personalInfo.linkedin.trim().length > 0,
    severity: "info",
    tip: "LinkedIn profiles add credibility and are expected by most recruiters.",
  });

  // --- Summary ---
  const summaryWords = resume.summary.trim().split(/\s+/).filter(Boolean).length;
  checks.push({
    id: "has-summary",
    label: "Professional summary present",
    category: "content",
    passed: summaryWords >= 10,
    severity: "critical",
    tip: "A 2-3 sentence summary with keywords helps ATS matching and recruiter scanning.",
  });

  checks.push({
    id: "summary-length",
    label: "Summary is concise (20-60 words)",
    category: "formatting",
    passed: summaryWords >= 20 && summaryWords <= 60,
    severity: "warning",
    tip: "Keep your summary between 20-60 words for optimal readability.",
  });

  // --- Experience ---
  checks.push({
    id: "has-experience",
    label: "Work experience added",
    category: "structure",
    passed: resume.experience.length > 0,
    severity: "critical",
    tip: "Work experience is the most weighted section by ATS systems.",
  });

  const allDescriptions = resume.experience.map((e) => e.description).join(" ").toLowerCase();

  const usedActionVerbs = ACTION_VERBS.filter((v) => allDescriptions.includes(v));
  checks.push({
    id: "action-verbs",
    label: "Uses strong action verbs",
    category: "keywords",
    passed: usedActionVerbs.length >= 2,
    severity: "warning",
    tip: `Use verbs like "${ACTION_VERBS.slice(0, 5).join('", "')}" to describe achievements.`,
  });

  checks.push({
    id: "measurable-results",
    label: "Includes measurable results",
    category: "keywords",
    passed: MEASURABLE_PATTERNS.test(allDescriptions),
    severity: "warning",
    tip: "Quantify achievements with numbers, percentages, or dollar amounts (e.g., 'increased sales by 30%').",
  });

  const experienceWithDates = resume.experience.filter((e) => e.startDate.trim().length > 0);
  checks.push({
    id: "experience-dates",
    label: "All experiences have dates",
    category: "formatting",
    passed: resume.experience.length > 0 && experienceWithDates.length === resume.experience.length,
    severity: "warning",
    tip: "ATS systems parse date ranges to calculate experience duration.",
  });

  // --- Education ---
  checks.push({
    id: "has-education",
    label: "Education section filled",
    category: "structure",
    passed: resume.education.length > 0,
    severity: "warning",
    tip: "Include your education even if you have extensive work experience.",
  });

  // --- Skills ---
  checks.push({
    id: "has-skills",
    label: "Skills section with 5+ skills",
    category: "keywords",
    passed: resume.skills.length >= 5,
    severity: "critical",
    tip: "List at least 5 relevant skills. ATS systems match skills against job descriptions.",
  });

  checks.push({
    id: "enough-skills",
    label: "Comprehensive skills (8+)",
    category: "keywords",
    passed: resume.skills.length >= 8,
    severity: "info",
    tip: "Having 8+ relevant skills increases your keyword match rate.",
  });

  // --- Structure ---
  checks.push({
    id: "has-sections",
    label: "All key sections present",
    category: "structure",
    passed:
      resume.personalInfo.fullName.trim().length > 0 &&
      resume.summary.trim().length > 0 &&
      resume.experience.length > 0 &&
      resume.education.length > 0 &&
      resume.skills.length > 0,
    severity: "critical",
    tip: "ATS-friendly resumes need: contact info, summary, experience, education, and skills.",
  });

  checks.push({
    id: "description-length",
    label: "Experience descriptions are detailed",
    category: "formatting",
    passed:
      resume.experience.length === 0 ||
      resume.experience.every((e) => e.description.trim().split(/\s+/).length >= 10),
    severity: "warning",
    tip: "Each experience should have at least 2-3 bullet-point-length descriptions.",
  });

  // --- Score ---
  const weights = { critical: 20, warning: 8, info: 3 };
  const maxScore = checks.reduce((s, c) => s + weights[c.severity], 0);
  const earnedScore = checks.filter((c) => c.passed).reduce((s, c) => s + weights[c.severity], 0);
  const score = Math.round((earnedScore / maxScore) * 100);

  return { score, checks };
}
