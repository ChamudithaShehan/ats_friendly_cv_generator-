"use client";

import { useResume, type ResumeData, type Experience, type Education, type Project, type Certification, type SectionId, DEFAULT_SECTION_ORDER } from "@/context/ResumeContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2, Eye, Save, Lightbulb, X, GripVertical } from "lucide-react";
import { toast } from "sonner";
import ResumePreview from "@/components/ResumePreview";
import ATSScorePanel from "@/components/ATSScorePanel";
import KeywordMatcher from "@/components/KeywordMatcher";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getTemplateById } from "@/lib/resume-templates";

function SortableSection({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group/sortable">
      <button
        {...attributes}
        {...listeners}
        className="absolute left-0 top-3 -translate-x-full pr-1 opacity-0 group-hover/sortable:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground z-10"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      {children}
    </div>
  );
}

export default function BuilderPage() {
  const { currentResume, updateResume, createResume } = useResume();
  const router = useRouter();
  const navigate = router.push;
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [saved, setSaved] = useState(true);
  const [skillInput, setSkillInput] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (currentResume) {
      setResume((prev) => (prev?.id === currentResume.id ? prev : currentResume));
    } else {
      const r = createResume();
      setResume(r);
    }
  }, [currentResume, createResume]);

  if (!resume) return null;

  const sectionOrder = resume.sectionOrder ?? DEFAULT_SECTION_ORDER;
  const activeTemplate = getTemplateById(resume.templateId);

  const update = (partial: Partial<ResumeData>) => {
    const updated = { ...resume, ...partial };
    setResume(updated);
    setSaved(false);
  };

  const updatePersonal = (field: string, value: string) => {
    update({ personalInfo: { ...resume.personalInfo, [field]: value } });
  };

  const parseList = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSave = () => {
    updateResume(resume);
    setSaved(true);
    toast.success("Resume saved successfully");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as SectionId);
      const newIndex = sectionOrder.indexOf(over.id as SectionId);
      const newOrder = [...sectionOrder];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, active.id as SectionId);
      update({ sectionOrder: newOrder });
    }
  };

  // --- CRUD helpers ---
  const addExperience = () => {
    const entry: Experience = { id: Date.now().toString(), company: "", position: "", startDate: "", endDate: "", current: false, description: "" };
    update({ experience: [...resume.experience, entry] });
  };
  const updateExperience = (id: string, field: string, value: string | boolean) => {
    update({ experience: resume.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)) });
  };
  const removeExperience = (id: string) => { update({ experience: resume.experience.filter((e) => e.id !== id) }); };

  const addEducation = () => {
    const entry: Education = { id: Date.now().toString(), institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" };
    update({ education: [...resume.education, entry] });
  };
  const updateEducation = (id: string, field: string, value: string) => {
    update({ education: resume.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)) });
  };
  const removeEducation = (id: string) => { update({ education: resume.education.filter((e) => e.id !== id) }); };

  const addSkill = () => {
    if (skillInput.trim() && !resume.skills.includes(skillInput.trim())) {
      update({ skills: [...resume.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };
  const removeSkill = (s: string) => { update({ skills: resume.skills.filter((sk) => sk !== s) }); };

  const addProject = () => {
    const entry: Project = { id: Date.now().toString(), name: "", description: "", technologies: "", link: "" };
    update({ projects: [...resume.projects, entry] });
  };
  const updateProject = (id: string, field: string, value: string) => {
    update({ projects: resume.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)) });
  };
  const removeProject = (id: string) => { update({ projects: resume.projects.filter((p) => p.id !== id) }); };

  const addCertification = () => {
    const entry: Certification = { id: Date.now().toString(), name: "", issuer: "", date: "" };
    update({ certifications: [...resume.certifications, entry] });
  };
  const updateCertification = (id: string, field: string, value: string) => {
    update({ certifications: resume.certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)) });
  };
  const removeCertification = (id: string) => { update({ certifications: resume.certifications.filter((c) => c.id !== id) }); };

  // --- Section renderers ---
  const sectionMap: Record<SectionId, ReactNode> = {
    personal: (
      <AccordionItem value="personal" className="border rounded-lg px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">Personal Information</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label className="text-xs">Full Name</Label><Input value={resume.personalInfo.fullName} onChange={(e) => updatePersonal("fullName", e.target.value)} placeholder="John Doe" /></div>
            <div><Label className="text-xs">Job Title</Label><Input value={resume.personalInfo.jobTitle} onChange={(e) => updatePersonal("jobTitle", e.target.value)} placeholder="Product Designer" /></div>
            <div><Label className="text-xs">Email</Label><Input value={resume.personalInfo.email} onChange={(e) => updatePersonal("email", e.target.value)} placeholder="john@example.com" /></div>
            <div><Label className="text-xs">Phone</Label><Input value={resume.personalInfo.phone} onChange={(e) => updatePersonal("phone", e.target.value)} placeholder="+1 (555) 123-4567" /></div>
            <div><Label className="text-xs">Location</Label><Input value={resume.personalInfo.location} onChange={(e) => updatePersonal("location", e.target.value)} placeholder="San Francisco, CA" /></div>
            <div><Label className="text-xs">LinkedIn</Label><Input value={resume.personalInfo.linkedin} onChange={(e) => updatePersonal("linkedin", e.target.value)} placeholder="linkedin.com/in/johndoe" /></div>
            <div><Label className="text-xs">Website</Label><Input value={resume.personalInfo.website} onChange={(e) => updatePersonal("website", e.target.value)} placeholder="johndoe.dev" /></div>
            <div><Label className="text-xs">Languages</Label><Input value={resume.languages.join(", ")} onChange={(e) => update({ languages: parseList(e.target.value) })} placeholder="English, Spanish" /></div>
            <div><Label className="text-xs">Interests</Label><Input value={resume.interests.join(", ")} onChange={(e) => update({ interests: parseList(e.target.value) })} placeholder="Branding, Photography" /></div>
          </div>
          <div className="pt-2 border-t">
            <Label className="text-xs font-semibold">Profile Photo (Normal CVs Only)</Label>
            <p className="text-xs text-muted-foreground mb-3">Upload a headshot for design-focused templates</p>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const dataUrl = event.target?.result as string;
                      updatePersonal("profileImage", dataUrl);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="text-xs flex-1"
              />
              {resume.personalInfo.profileImage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updatePersonal("profileImage", "")}
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              )}
            </div>
            {resume.personalInfo.profileImage && (
              <img src={resume.personalInfo.profileImage} alt="Profile" className="mt-3 w-20 h-20 rounded-lg border object-cover" />
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    ),
    summary: (
      <AccordionItem value="summary" className="border rounded-lg px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">Professional Summary</AccordionTrigger>
        <AccordionContent className="pt-2">
          <Textarea value={resume.summary} onChange={(e) => update({ summary: e.target.value })} placeholder="Brief professional summary highlighting your key qualifications..." rows={4} />
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Lightbulb className="h-3 w-3 text-warning" />
            Tip: Keep your summary to 2-3 sentences with relevant keywords.
          </p>
        </AccordionContent>
      </AccordionItem>
    ),
    experience: (
      <AccordionItem value="experience" className="border rounded-lg px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">Work Experience ({resume.experience.length})</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {resume.experience.map((exp, i) => (
            <div key={exp.id} className="border rounded-lg p-4 space-y-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Experience {i + 1}</span>
                <button onClick={() => removeExperience(exp.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label className="text-xs">Company</Label><Input value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} placeholder="Company name" /></div>
                <div><Label className="text-xs">Position</Label><Input value={exp.position} onChange={(e) => updateExperience(exp.id, "position", e.target.value)} placeholder="Job title" /></div>
                <div><Label className="text-xs">Start Date</Label><Input value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} placeholder="2023-01" /></div>
                <div><Label className="text-xs">End Date</Label><Input value={exp.endDate} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} placeholder="2024-06" disabled={exp.current} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked={exp.current} onCheckedChange={(c) => updateExperience(exp.id, "current", !!c)} />
                <Label className="text-xs">Currently working here</Label>
              </div>
              <div><Label className="text-xs">Description</Label><Textarea value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} placeholder="Key achievements and responsibilities..." rows={3} /></div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addExperience} className="gap-2 w-full"><Plus className="h-3.5 w-3.5" /> Add Experience</Button>
        </AccordionContent>
      </AccordionItem>
    ),
    education: (
      <AccordionItem value="education" className="border rounded-lg px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">Education ({resume.education.length})</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {resume.education.map((edu, i) => (
            <div key={edu.id} className="border rounded-lg p-4 space-y-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Education {i + 1}</span>
                <button onClick={() => removeEducation(edu.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label className="text-xs">Institution</Label><Input value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} placeholder="University name" /></div>
                <div><Label className="text-xs">Degree</Label><Input value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} placeholder="Bachelor of Science" /></div>
                <div><Label className="text-xs">Field of Study</Label><Input value={edu.field} onChange={(e) => updateEducation(edu.id, "field", e.target.value)} placeholder="Computer Science" /></div>
                <div><Label className="text-xs">GPA</Label><Input value={edu.gpa} onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)} placeholder="3.8" /></div>
                <div><Label className="text-xs">Start Year</Label><Input value={edu.startDate} onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)} placeholder="2017" /></div>
                <div><Label className="text-xs">End Year</Label><Input value={edu.endDate} onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)} placeholder="2021" /></div>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addEducation} className="gap-2 w-full"><Plus className="h-3.5 w-3.5" /> Add Education</Button>
        </AccordionContent>
      </AccordionItem>
    ),
    skills: (
      <AccordionItem value="skills" className="border rounded-lg px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">Skills ({resume.skills.length})</AccordionTrigger>
        <AccordionContent className="space-y-3 pt-2">
          <div className="flex gap-2">
            <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="Type a skill and press Enter" />
            <Button variant="outline" size="sm" onClick={addSkill}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                {s}
                <button onClick={() => removeSkill(s)}><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    ),
    projects: (
      <AccordionItem value="projects" className="border rounded-lg px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">Projects ({resume.projects.length})</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {resume.projects.map((proj, i) => (
            <div key={proj.id} className="border rounded-lg p-4 space-y-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Project {i + 1}</span>
                <button onClick={() => removeProject(proj.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label className="text-xs">Name</Label><Input value={proj.name} onChange={(e) => updateProject(proj.id, "name", e.target.value)} placeholder="Project name" /></div>
                <div><Label className="text-xs">Technologies</Label><Input value={proj.technologies} onChange={(e) => updateProject(proj.id, "technologies", e.target.value)} placeholder="React, Node.js" /></div>
              </div>
              <div><Label className="text-xs">Description</Label><Textarea value={proj.description} onChange={(e) => updateProject(proj.id, "description", e.target.value)} placeholder="What did you build?" rows={2} /></div>
              <div><Label className="text-xs">Link</Label><Input value={proj.link} onChange={(e) => updateProject(proj.id, "link", e.target.value)} placeholder="github.com/..." /></div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addProject} className="gap-2 w-full"><Plus className="h-3.5 w-3.5" /> Add Project</Button>
        </AccordionContent>
      </AccordionItem>
    ),
    certifications: (
      <AccordionItem value="certifications" className="border rounded-lg px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">Certifications ({resume.certifications.length})</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {resume.certifications.map((cert, i) => (
            <div key={cert.id} className="border rounded-lg p-4 space-y-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Certification {i + 1}</span>
                <button onClick={() => removeCertification(cert.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div><Label className="text-xs">Name</Label><Input value={cert.name} onChange={(e) => updateCertification(cert.id, "name", e.target.value)} placeholder="AWS Solutions Architect" /></div>
                <div><Label className="text-xs">Issuer</Label><Input value={cert.issuer} onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)} placeholder="Amazon" /></div>
                <div><Label className="text-xs">Date</Label><Input value={cert.date} onChange={(e) => updateCertification(cert.id, "date", e.target.value)} placeholder="2024-06" /></div>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addCertification} className="gap-2 w-full"><Plus className="h-3.5 w-3.5" /> Add Certification</Button>
        </AccordionContent>
      </AccordionItem>
    ),
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* Left: Form Editor */}
      <div className="w-full lg:w-1/2 xl:w-[45%] border-r overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <Input
                value={resume.title}
                onChange={(e) => update({ title: e.target.value })}
                className="font-semibold border-none shadow-none text-base px-0 h-auto focus-visible:ring-0"
                placeholder="Resume title..."
              />
              <button
                onClick={() => navigate("/templates")}
                className="text-[11px] text-primary hover:underline mt-0.5"
              >
                Template: {activeTemplate.name} · Change
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground">{saved ? "Saved" : "Unsaved"}</span>
            <Button variant="outline" size="sm" onClick={() => navigate(`/preview/${resume.id}`)}>
              <Eye className="h-4 w-4 mr-1" /> Preview
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        </div>

        {/* ATS Score & Keyword Matcher */}
        <div className="px-6 py-3 border-b bg-muted/30 space-y-3">
          <ATSScorePanel resume={resume} />
          <KeywordMatcher resume={resume} />
        </div>

        {/* Drag hint */}
        <div className="px-6 pt-4 pb-0">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <GripVertical className="h-3 w-3" />
            Drag sections to reorder them on your resume
          </p>
        </div>

        {/* Form sections with drag-and-drop */}
        <div className="p-6 pl-10">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
              <Accordion type="multiple" defaultValue={["personal", "summary", "experience", "education", "skills"]} className="space-y-3">
                {sectionOrder.map((sectionId) => (
                  <SortableSection key={sectionId} id={sectionId}>
                    {sectionMap[sectionId]}
                  </SortableSection>
                ))}
              </Accordion>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Right: Live Preview */}
      <div className="hidden lg:flex w-1/2 xl:w-[55%] bg-muted/30 flex-col">
        <div className="sticky top-0 z-10 bg-muted/50 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Live Preview</span>
          <Button variant="outline" size="sm" onClick={() => navigate(`/preview/${resume.id}`)}>
            <Eye className="h-4 w-4 mr-1" /> Full Preview
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          <div className="w-full max-w-[650px] bg-background rounded-lg shadow-lg border">
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
}
