"use client";

import { useRouter } from "next/navigation";
import { useResume } from "@/context/ResumeContext";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { RESUME_TEMPLATES, getTemplateById, type ResumeTemplateId, type TemplateCategory } from "@/lib/resume-templates";
import ResumePreview from "@/components/ResumePreview";
import { buildTemplatePreviewResume } from "@/lib/template-preview-data";
import { useState } from "react";
import { cn } from "@/lib/utils";

function getPreviewScale(category: TemplateCategory): number {
  return category === "Normal CV" ? 0.74 : 0.7;
}

function TemplateThumbnail({ templateId, category }: { templateId: ResumeTemplateId; category: TemplateCategory }) {
  const previewResume = buildTemplatePreviewResume(templateId);

  return (
    <div className="h-full rounded-lg border bg-background shadow-sm overflow-hidden">
      <ResumePreview resume={previewResume} scale={getPreviewScale(category)} />
    </div>
  );
}

export default function TemplatesPage() {
  const { currentResume, updateResume, createResume } = useResume();
  const router = useRouter();
  const navigate = router.push;
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "All">("All");

  const categories: (TemplateCategory | "All")[] = ["All", "ATS Friendly", "Normal CV"];
  
  const filteredTemplates = selectedCategory === "All" 
    ? RESUME_TEMPLATES 
    : RESUME_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleSelect = (templateId: string) => {
    const selectedTemplate = getTemplateById(templateId);

    if (currentResume) {
      updateResume({
        ...currentResume,
        templateId: selectedTemplate.id,
        sectionOrder: selectedTemplate.defaultSectionOrder,
      });
      toast.success(`Template "${selectedTemplate.name}" applied to ${currentResume.title}`);
      navigate("/builder");
    } else {
      const r = createResume();
      updateResume({
        ...r,
        templateId: selectedTemplate.id,
        sectionOrder: selectedTemplate.defaultSectionOrder,
      });
      navigate("/builder");
    }
  };

  return (
    <div className="container py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Resume Templates</h1>
        <p className="text-muted-foreground mt-2">Choose between ATS-friendly templates and visually rich professional CV designs.</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-muted-foreground/20 text-muted-foreground hover:border-muted-foreground/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Category Description */}
      <div className="mb-8 text-center">
        {selectedCategory === "ATS Friendly" && (
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            These templates prioritize machine readability and are optimized for automated screening systems. Perfect for high-volume applications and strict ATS pipelines.
          </p>
        )}
        {selectedCategory === "Normal CV" && (
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            These templates combine visual design with ATS safety. They're great for roles where visual presentation matters while maintaining recruiter compatibility.
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((t) => (
          <div key={t.id} className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300">
            <div
              className={cn(
                "aspect-[3/4] bg-muted/30",
                t.category === "Normal CV" ? "p-1" : "p-2"
              )}
            >
              <TemplateThumbnail templateId={t.id} category={t.category} />
            </div>
            <div className="p-4 border-t space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t.name}</h3>
                <div className="flex gap-1.5">
                  {t.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                      <Check className="h-2.5 w-2.5" /> {tag}
                    </span>
                  ))}
                  {t.tags.length > 2 && (
                    <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                      +{t.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{t.description}</p>
              <p className="text-[11px] text-muted-foreground/90">Best for: {t.bestFor}</p>
              <p className="text-[11px] font-medium text-primary">ATS score: {t.atsScore}/100</p>
              <Button size="sm" className="w-full mt-2" onClick={() => handleSelect(t.id)}>
                Use Template
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
