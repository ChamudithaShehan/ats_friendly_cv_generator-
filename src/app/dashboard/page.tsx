"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useResume } from "@/context/ResumeContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, FileText, Trash2, Edit, MoreVertical, LayoutDashboard, BookTemplate, User } from "lucide-react";
import ResumePreview from "@/components/ResumePreview";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardPage() {
  const { resumes, createResume, deleteResume, setCurrentResume } = useResume();
  const router = useRouter();
  const navigate = router.push;

  const handleCreate = () => {
    createResume();
    navigate("/builder");
  };

  const handleEdit = (id: string) => {
    const r = resumes.find((r) => r.id === id);
    if (r) {
      setCurrentResume(r);
      navigate("/builder");
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 border-r bg-card flex-col p-6 gap-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Navigation</p>
        <Link href="/dashboard" className="flex items-center gap-3 rounded-lg bg-primary/10 text-primary px-3 py-2 text-sm font-medium">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Link>
        <Link href="/templates" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
          <BookTemplate className="h-4 w-4" /> Templates
        </Link>
        <Link href="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
          <User className="h-4 w-4" /> Profile
        </Link>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Resumes</h1>
            <p className="text-sm text-muted-foreground mt-1">Create, edit, and manage your resumes</p>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Create New Resume
          </Button>
        </div>

        {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-lg">No resumes yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6">Create your first ATS-friendly resume in minutes.</p>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" /> Create Resume
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((r) => (
              <div key={r.id} className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                {/* Mini preview */}
                <div className="aspect-[4/3] bg-muted/30 p-3 relative cursor-pointer" onClick={() => handleEdit(r.id)}>
                  <div className="h-full rounded-md border bg-background shadow-sm overflow-hidden pointer-events-none">
                    <ResumePreview resume={r} scale={0.52} />
                  </div>
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 border-t space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">{r.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Modified {formatDate(r.lastModified)}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-muted transition-colors">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(r.id)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/preview/${r.id}`)}>
                          <FileText className="h-4 w-4 mr-2" /> Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteResume(r.id)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-medium">{r.completionPercent}%</span>
                    </div>
                    <Progress value={r.completionPercent} className="h-1.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
