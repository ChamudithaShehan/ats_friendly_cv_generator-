import { type ResumeData, type SectionId, DEFAULT_SECTION_ORDER } from "@/context/ResumeContext";
import { type ReactNode } from "react";
import { getTemplateById } from "@/lib/resume-templates";
import { TEMPLATE_STYLES } from "@/lib/template-styles";
import { Briefcase, Globe, Linkedin, Mail, MapPin, Phone } from "lucide-react";

interface Props {
  resume: ResumeData;
  scale?: number;
}

export default function ResumePreview({ resume, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, languages, interests } = resume;
  const order = resume.sectionOrder ?? DEFAULT_SECTION_ORDER;
  const template = getTemplateById(resume.templateId);
  const isNormalTemplate = template.category === "Normal CV";
  const isCardPreview = scale < 0.8;

  const styles = TEMPLATE_STYLES[template.id];

  const accentByTemplate: Record<string, { color: string; softBg: string; strongBg: string; iconTint: string }> = {
    modern: { color: "text-blue-700", softBg: "bg-blue-50", strongBg: "bg-blue-600", iconTint: "text-blue-600" },
    executive: { color: "text-amber-700", softBg: "bg-amber-50", strongBg: "bg-amber-700", iconTint: "text-amber-700" },
    technical: { color: "text-cyan-700", softBg: "bg-cyan-50", strongBg: "bg-cyan-700", iconTint: "text-cyan-700" },
    creative: { color: "text-violet-700", softBg: "bg-violet-50", strongBg: "bg-violet-700", iconTint: "text-violet-700" },
    academic: { color: "text-indigo-700", softBg: "bg-indigo-50", strongBg: "bg-indigo-700", iconTint: "text-indigo-700" },
    impact: { color: "text-emerald-700", softBg: "bg-emerald-50", strongBg: "bg-emerald-700", iconTint: "text-emerald-700" },
  };

  const normalVisualByTemplate: Record<
    string,
    {
      wrapper: string;
      sidebar: string;
      card: string;
      sectionTitle: string;
      avatar: string;
      skillVariant: "bars" | "chips";
      contactLayout: string;
    }
  > = {
    modern: {
      wrapper: "grid gap-6 grid-cols-[250px_minmax(0,1fr)]",
      sidebar: "rounded-2xl border shadow-sm p-5",
      card: "rounded-2xl border bg-white shadow-sm p-5",
      sectionTitle: "text-sm font-semibold uppercase tracking-wider mb-3",
      avatar: "h-28 w-28 rounded-full border-4 border-white object-cover shadow-md",
      skillVariant: "bars",
      contactLayout: "space-y-2.5",
    },
    executive: {
      wrapper: "grid gap-7 grid-cols-[270px_minmax(0,1fr)]",
      sidebar: "rounded-none border-2 border-amber-200 shadow-sm p-6",
      card: "rounded-none border-2 border-slate-200 bg-white shadow-sm p-6",
      sectionTitle: "text-sm font-semibold uppercase tracking-[0.18em] mb-3",
      avatar: "h-28 w-28 rounded-full border-2 border-amber-200 object-cover shadow",
      skillVariant: "chips",
      contactLayout: "space-y-3",
    },
    technical: {
      wrapper: "grid gap-6 grid-cols-[235px_minmax(0,1fr)]",
      sidebar: "rounded-xl border border-cyan-200 shadow-sm p-5",
      card: "rounded-xl border border-slate-200 bg-white shadow-sm p-5",
      sectionTitle: "text-sm font-bold uppercase tracking-wider mb-3",
      avatar: "h-24 w-24 rounded-xl border-2 border-cyan-200 object-cover shadow",
      skillVariant: "bars",
      contactLayout: "space-y-2",
    },
    creative: {
      wrapper: "grid gap-6 grid-cols-[245px_minmax(0,1fr)]",
      sidebar: "rounded-3xl border border-violet-200 shadow-sm p-5",
      card: "rounded-3xl border border-slate-200 bg-white shadow-sm p-5",
      sectionTitle: "text-sm font-semibold uppercase tracking-wider mb-3",
      avatar: "h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-md",
      skillVariant: "chips",
      contactLayout: "space-y-2.5",
    },
    academic: {
      wrapper: "grid gap-7 grid-cols-[260px_minmax(0,1fr)]",
      sidebar: "rounded-md border-2 border-indigo-200 shadow-sm p-5",
      card: "rounded-md border-2 border-slate-200 bg-white shadow-sm p-5",
      sectionTitle: "text-sm font-semibold uppercase tracking-[0.14em] mb-3",
      avatar: "h-28 w-28 rounded-full border-2 border-indigo-200 object-cover shadow",
      skillVariant: "chips",
      contactLayout: "space-y-2.5",
    },
    impact: {
      wrapper: "grid gap-6 grid-cols-[245px_minmax(0,1fr)]",
      sidebar: "rounded-2xl border border-emerald-200 shadow-sm p-5",
      card: "rounded-2xl border border-slate-200 bg-white shadow-sm p-5",
      sectionTitle: "text-sm font-bold uppercase tracking-wider mb-3",
      avatar: "h-24 w-24 rounded-full border-4 border-white object-cover shadow-md",
      skillVariant: "bars",
      contactLayout: "space-y-2.5",
    },
  };

  const accent = accentByTemplate[template.id] ?? accentByTemplate.modern;
  const normalVisual = normalVisualByTemplate[template.id] ?? normalVisualByTemplate.modern;
  const normalWrapperClass = isCardPreview ? "grid gap-4 grid-cols-[170px_minmax(0,1fr)]" : normalVisual.wrapper;

  const renderContactItem = (icon: ReactNode, value?: string) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-2 text-xs text-slate-700">
        <span className={`mt-0.5 ${accent.iconTint}`}>{icon}</span>
        <span className="break-all leading-snug">{value}</span>
      </div>
    );
  };

  if (isNormalTemplate) {
    return (
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top center" }} className={`${isCardPreview ? "p-4" : "p-6 md:p-8"} text-[13px] leading-relaxed font-sans text-slate-900`}>
        <div className={normalWrapperClass}>
          <aside className={`${normalVisual.sidebar} ${accent.softBg}`}>
            <div className="flex flex-col items-center text-center">
              {p.profileImage ? (
                <img src={p.profileImage} alt={p.fullName || "Profile"} className={normalVisual.avatar} />
              ) : (
                <div className={`${normalVisual.avatar} grid place-items-center text-3xl font-bold text-white ${accent.strongBg}`}>
                  {(p.fullName?.trim()?.[0] ?? "U").toUpperCase()}
                </div>
              )}
              {p.fullName && <h1 className="mt-4 text-xl font-bold tracking-tight">{p.fullName}</h1>}
              {p.jobTitle && <p className={`text-sm font-medium ${accent.color}`}>{p.jobTitle}</p>}
            </div>

            <div className="my-4 h-px bg-slate-200" />

            <div className={normalVisual.contactLayout}>
              {renderContactItem(<Phone className="h-3.5 w-3.5" />, p.phone)}
              {renderContactItem(<Mail className="h-3.5 w-3.5" />, p.email)}
              {renderContactItem(<MapPin className="h-3.5 w-3.5" />, p.location)}
              {renderContactItem(<Linkedin className="h-3.5 w-3.5" />, p.linkedin)}
              {renderContactItem(<Globe className="h-3.5 w-3.5" />, p.website)}
            </div>

            {skills.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Skills</h3>
                {normalVisual.skillVariant === "bars" ? (
                  <div className="mt-3 space-y-2.5">
                    {skills.slice(0, 8).map((skill, index) => {
                      const width = Math.max(52, 92 - index * 6);
                      return (
                        <div key={skill}>
                          <div className="mb-1 text-[11px] font-medium text-slate-700">{skill}</div>
                          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div className={`h-full rounded-full ${accent.strongBg}`} style={{ width: `${width}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {skills.slice(0, 10).map((skill) => (
                      <span key={skill} className="rounded-full border border-slate-300 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {languages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Languages</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {languages.map((language) => (
                    <span key={language} className="rounded-full border border-slate-300 bg-white/80 px-2.5 py-1 text-[11px] text-slate-700">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {interests.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Interests</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {interests.map((interest) => (
                    <span key={interest} className="rounded-md bg-white px-2.5 py-1 text-[11px] text-slate-700 shadow-sm border border-slate-200">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <main className="space-y-4">
            <section className={normalVisual.card}>
              {p.fullName && <h2 className="text-3xl font-bold tracking-tight text-slate-900">{p.fullName}</h2>}
              {p.jobTitle && (
                <div className="mt-1 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  <p className={`text-sm font-medium ${accent.color}`}>{p.jobTitle}</p>
                </div>
              )}
              <div className="mt-3 h-px bg-slate-200" />
              {summary && <p className="mt-3 text-sm leading-relaxed text-slate-700">{summary}</p>}
            </section>

            {experience.length > 0 && (
              <section className={normalVisual.card}>
                <h3 className={`${normalVisual.sectionTitle} ${accent.color}`}>Experience</h3>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{exp.position || "Position"}</p>
                          {exp.company && <p className="text-xs text-slate-600">{exp.company}</p>}
                        </div>
                        <p className="text-xs text-slate-500 shrink-0">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</p>
                      </div>
                      {exp.description && (
                        <ul className="mt-2 space-y-1.5 text-xs text-slate-700 list-disc pl-4">
                          {exp.description
                            .split("\n")
                            .map((line) => line.trim())
                            .filter(Boolean)
                            .map((line, idx) => (
                              <li key={`${exp.id}-${idx}`}>{line}</li>
                            ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {education.length > 0 && (
              <section className={normalVisual.card}>
                <h3 className={`${normalVisual.sectionTitle} ${accent.color}`}>Education</h3>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <p className="text-sm font-semibold text-slate-900">{edu.degree}{edu.field && ` in ${edu.field}`}</p>
                      <p className="text-xs text-slate-600">{edu.institution}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {projects.length > 0 && (
              <section className={normalVisual.card}>
                <h3 className={`${normalVisual.sectionTitle} ${accent.color}`}>Projects</h3>
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <p className="text-sm font-semibold text-slate-900">{proj.name || "Project"}</p>
                      {proj.description && <p className="text-xs text-slate-700 mt-1">{proj.description}</p>}
                      {proj.technologies && <p className="text-xs text-slate-500 mt-1">Tools: {proj.technologies}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {certifications.length > 0 && (
              <section className={normalVisual.card}>
                <h3 className={`${normalVisual.sectionTitle} ${accent.color}`}>Certifications</h3>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between gap-2 text-xs">
                      <span className="text-slate-800"><span className="font-medium">{cert.name}</span>{cert.issuer && ` · ${cert.issuer}`}</span>
                      {cert.date && <span className="text-slate-500 shrink-0">{cert.date}</span>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>

        {!p.fullName && !summary && experience.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">Start filling out the form to see your resume preview here.</p>
          </div>
        )}
      </div>
    );
  }

  const sectionRenderers: Record<SectionId, ReactNode> = {
    personal: (
      <div className={`${styles.headerWrapper} mb-5`} key="personal">
        <div className="flex-1">
          {p.fullName && <h1 className={styles.headerName}>{p.fullName}</h1>}
          {p.jobTitle && <p className="text-xs text-muted-foreground mt-0.5">{p.jobTitle}</p>}
          <div className={styles.contactRow}>
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.location && <span>{p.location}</span>}
            {p.linkedin && <span>{p.linkedin}</span>}
            {p.website && <span>{p.website}</span>}
          </div>
        </div>
      </div>
    ),
    summary: summary ? (
      <section className={styles.section} key="summary">
        <h2 className={styles.heading}>Summary</h2>
        <p className="text-xs leading-relaxed text-muted-foreground">{summary}</p>
      </section>
    ) : null,
    experience: experience.length > 0 ? (
      <section className={styles.section} key="experience">
        <h2 className={styles.heading}>Experience</h2>
        <div className="space-y-3">
          {experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-sm">{exp.position || "Position"}</span>
                  {exp.company && <span className="text-muted-foreground"> · {exp.company}</span>}
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.description && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{exp.description}</p>}
            </div>
          ))}
        </div>
      </section>
    ) : null,
    education: education.length > 0 ? (
      <section className={styles.section} key="education">
        <h2 className={styles.heading}>Education</h2>
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                  {edu.institution && <span className="text-muted-foreground"> · {edu.institution}</span>}
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              {edu.gpa && <p className="text-xs text-muted-foreground mt-0.5">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      </section>
    ) : null,
    skills: skills.length > 0 ? (
      <section className={styles.section} key="skills">
        <h2 className={styles.heading}>Skills</h2>
        <p className="text-xs text-muted-foreground">{skills.join(" · ")}</p>
      </section>
    ) : null,
    projects: projects.length > 0 ? (
      <section className={styles.section} key="projects">
        <h2 className={styles.heading}>Projects</h2>
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id}>
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-sm">{proj.name || "Project"}</span>
                {proj.link && <span className="text-xs text-primary">{proj.link}</span>}
              </div>
              {proj.description && <p className="text-xs text-muted-foreground mt-0.5">{proj.description}</p>}
              {proj.technologies && <p className="text-xs text-muted-foreground mt-0.5">Technologies: {proj.technologies}</p>}
            </div>
          ))}
        </div>
      </section>
    ) : null,
    certifications: certifications.length > 0 ? (
      <section className={styles.section} key="certifications">
        <h2 className={styles.heading}>Certifications</h2>
        <div className="space-y-1">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between">
              <span className="text-xs"><span className="font-medium">{cert.name}</span>{cert.issuer && ` · ${cert.issuer}`}</span>
              {cert.date && <span className="text-xs text-muted-foreground">{cert.date}</span>}
            </div>
          ))}
        </div>
      </section>
    ) : null,
  };

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: "top center" }} className={`p-8 md:p-10 text-foreground text-[13px] leading-relaxed ${styles.container}`}>
      {order.map((sectionId) => sectionRenderers[sectionId])}

      {/* Empty state */}
      {!p.fullName && !summary && experience.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">Start filling out the form to see your resume preview here.</p>
        </div>
      )}
    </div>
  );
}
