"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useResume } from "@/context/ResumeContext";
import { User, FileText, Settings } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { resumes } = useResume();

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Profile Settings</h1>

      <div className="rounded-xl border bg-card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Alex Johnson</h2>
            <p className="text-sm text-muted-foreground">alex@example.com</p>
          </div>
        </div>

        <Separator />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Full Name</Label>
            <Input defaultValue="Alex Johnson" />
          </div>
          <div>
            <Label className="text-xs">Email</Label>
            <Input defaultValue="alex@example.com" type="email" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="sm">Save Changes</Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 mt-6">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-primary" /> Saved Resumes
        </h3>
        <div className="space-y-2">
          {resumes.map((r) => (
            <Link href="/dashboard" key={r.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div>
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">Modified {new Date(r.lastModified).toLocaleDateString()}</p>
              </div>
              <span className="text-xs text-muted-foreground">{r.completionPercent}% complete</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 mt-6">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <Settings className="h-4 w-4 text-primary" /> Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto-save</p>
              <p className="text-xs text-muted-foreground">Automatically save changes while editing</p>
            </div>
            <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">Enabled</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">ATS Tips</p>
              <p className="text-xs text-muted-foreground">Show ATS optimization hints while editing</p>
            </div>
            <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
