"use client";

import { useParams, useRouter } from "next/navigation";
import { useResume } from "@/context/ResumeContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, ZoomIn, ZoomOut, FileText } from "lucide-react";
import ResumePreview from "@/components/ResumePreview";
import ATSScorePanel from "@/components/ATSScorePanel";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { generatePDF } from "@/lib/pdf";
import { generateDOCX } from "@/lib/docx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PreviewPage() {
  const { id } = useParams();
  const { resumes } = useResume();
  const router = useRouter();
  const navigate = router.push;
  const [zoom, setZoom] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const resume = resumes.find((r) => r.id === id);
  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-4">
        <p className="text-muted-foreground">Resume not found</p>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  const safeName = resume.title.replace(/\s+/g, "_");

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      await generatePDF(previewRef.current, `${safeName}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadDOCX = async () => {
    setDownloading(true);
    try {
      await generateDOCX(resume, `${safeName}.docx`);
      toast.success("DOCX downloaded successfully!");
    } catch {
      toast.error("Failed to generate DOCX. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      {/* Toolbar */}
      <div className="no-print sticky top-16 z-10 bg-background border-b">
        <div className="container flex items-center justify-between py-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" /> Print
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" disabled={downloading} className="gap-2">
                  <Download className="h-4 w-4" /> {downloading ? "Generating..." : "Download"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" /> Download as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadDOCX}>
                  <FileText className="h-4 w-4 mr-2" /> Download as DOCX
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Preview */}
          <div className="lg:col-span-2">
            <div className="flex justify-center px-4">
              <div className="bg-background shadow-2xl border rounded-lg overflow-hidden" style={{ width: `${650 * zoom}px` }}>
                <div ref={previewRef}>
                  <ResumePreview resume={resume} scale={zoom} />
                </div>
              </div>
            </div>
          </div>

          {/* ATS Score Sidebar */}
          <div className="no-print">
            <div className="sticky top-32 space-y-4">
              <div className="bg-card rounded-lg border p-4">
                <h3 className="font-semibold mb-3 text-sm">ATS Compatibility</h3>
                <ATSScorePanel resume={resume} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
