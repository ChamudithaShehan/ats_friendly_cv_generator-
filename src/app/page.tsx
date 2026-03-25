"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Sparkles, Zap, Star, ArrowRight } from "lucide-react";
import { RESUME_TEMPLATES } from "@/lib/resume-templates";
import { buildTemplatePreviewResume } from "@/lib/template-preview-data";
import ResumePreview from "@/components/ResumePreview";

const features = [
  { icon: CheckCircle, title: "ATS Optimized", desc: "Resumes pass automated screening systems with clean formatting and proper structure." },
  { icon: Zap, title: "Easy Editing", desc: "Intuitive form-based editor with live preview. No design skills needed." },
  { icon: FileText, title: "Professional Templates", desc: "Choose from curated, ATS-friendly templates that recruiters love." },
  { icon: Sparkles, title: "Smart Suggestions", desc: "Get tips to improve your resume's impact and ATS compatibility score." },
];

const templates = RESUME_TEMPLATES.slice(0, 3).map((template) => ({
  id: template.id,
  name: template.name,
  desc: template.description,
  previewResume: buildTemplatePreviewResume(template.id),
}));

const testimonials = [
  { name: "Jordan Rivera", role: "Software Engineer at Google", text: "CVHub helped me land 3 interviews in my first week. The ATS optimization made all the difference." },
  { name: "Priya Sharma", role: "Product Manager", text: "The live preview is incredible. I could see my resume take shape in real-time. Best builder I've used." },
  { name: "Marcus Lee", role: "Data Scientist", text: "Clean, professional templates that actually pass ATS screening. Highly recommend." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary/30">
        <div className="container py-24 md:py-32 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground mb-6 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Trusted by 10,000+ job seekers
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance max-w-3xl mx-auto animate-fade-in">
            Build ATS-Friendly Resumes{" "}
            <span className="text-primary">in Minutes</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Create professional, recruiter-approved resumes that pass automated screening systems. No design skills required.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 text-base px-8">
                Create Resume <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#templates">
              <Button variant="outline" size="lg" className="text-base px-8">
                View Templates
              </Button>
            </a>
          </div>
        </div>
        {/* Decorative gradient blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Features */}
      <section id="features" className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Everything you need to land the job</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Our builder is designed with one goal: getting your resume past ATS and into human hands.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div key={f.title} className="group rounded-xl border bg-card p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates Preview */}
      <section id="templates" className="bg-secondary/30 py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">ATS-Friendly Templates</h2>
            <p className="mt-4 text-muted-foreground">Clean, professional designs that pass automated screening.</p>
            <Link href="/templates">
              <Button variant="outline" size="sm" className="mt-5">
                See All Templates
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {templates.map((t) => (
              <div key={t.id} className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-[3/4] bg-muted/50 p-3">
                  <div className="h-full rounded-md border bg-background shadow-sm overflow-hidden">
                    <ResumePreview resume={t.previewResume} scale={0.42} />
                  </div>
                </div>
                <div className="p-4 border-t">
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
                  <Link href="/templates">
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      Use Template
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Loved by Job Seekers</h2>
          <p className="mt-4 text-muted-foreground">See what our users have to say about CVHub.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-xl border bg-card p-6 space-y-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to build your resume?</h2>
          <p className="mt-4 opacity-90 max-w-lg mx-auto">
            Join thousands of job seekers who landed their dream job with CVHub.
          </p>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="mt-8 text-base px-8">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold">
            <FileText className="h-5 w-5 text-primary" />
            CVHub
          </div>
          <p className="text-sm text-muted-foreground">© 2026 CVHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
