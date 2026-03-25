import type { ResumeTemplateId } from "@/lib/resume-templates";

export interface TemplateStyleTokens {
  container: string;
  headerWrapper: string;
  headerName: string;
  contactRow: string;
  heading: string;
  section: string;
}

export const TEMPLATE_STYLES: Record<ResumeTemplateId, TemplateStyleTokens> = {
  classic: {
    container: "font-sans",
    headerWrapper: "text-center",
    headerName: "text-xl font-bold tracking-tight",
    contactRow: "flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground",
    heading: "text-xs font-bold uppercase tracking-widest text-primary border-b pb-1 mb-2",
    section: "mb-5",
  },
  modern: {
    container: "font-sans",
    headerWrapper: "flex gap-6 pb-5 border-l-4 border-blue-600 pl-6 mb-2 items-start",
    headerName: "text-3xl font-bold text-slate-900 tracking-tight",
    contactRow: "flex flex-col gap-y-1 text-xs text-slate-600 mt-1.5",
    heading: "text-sm font-bold uppercase tracking-wider text-white bg-blue-600 px-3 py-2 mb-3 inline-block",
    section: "mb-5",
  },
  minimal: {
    container: "font-sans",
    headerWrapper: "text-left",
    headerName: "text-xl font-semibold tracking-tight",
    contactRow: "flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground",
    heading: "text-[11px] font-semibold uppercase tracking-wide text-foreground/80 mb-1.5",
    section: "mb-4",
  },
  executive: {
    container: "font-serif",
    headerWrapper: "flex gap-8 pb-6 border-b-3 border-amber-800 mb-2 items-start",
    headerName: "text-4xl font-semibold text-slate-900 tracking-wide",
    contactRow: "flex flex-col gap-y-1 text-xs text-slate-700 mt-2",
    heading: "text-sm font-semibold uppercase tracking-widest text-white bg-amber-800 px-4 py-2.5 mb-4",
    section: "mb-6",
  },
  technical: {
    container: "font-sans",
    headerWrapper: "grid grid-cols-3 gap-6 pb-5 border-b-2 border-slate-300 mb-2 items-start",
    headerName: "col-span-2 text-3xl font-bold text-slate-900 tracking-tight",
    contactRow: "flex flex-col gap-y-1.5 text-xs text-slate-600 col-span-1 text-right",
    heading: "text-sm font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-2 mb-3 border-l-3 border-slate-900 inline-block",
    section: "mb-4",
  },
  creative: {
    container: "font-sans",
    headerWrapper: "pb-6 border-b-2 border-purple-300 mb-2 flex gap-6 items-start",
    headerName: "text-3xl font-semibold text-slate-900 tracking-tight flex-1",
    contactRow: "flex flex-col gap-y-1.5 text-xs text-slate-700",
    heading: "text-sm font-semibold uppercase tracking-wider text-purple-700 border-b-2 border-purple-200 pb-2 mb-3",
    section: "mb-5",
  },
  compact: {
    container: "font-sans",
    headerWrapper: "text-left border-b pb-2",
    headerName: "text-lg font-semibold tracking-tight",
    contactRow: "flex flex-wrap gap-x-2.5 gap-y-1 mt-1 text-[11px] text-muted-foreground",
    heading: "text-[11px] font-bold uppercase tracking-wide text-foreground/80 mb-1",
    section: "mb-3",
  },
  structured: {
    container: "font-sans",
    headerWrapper: "text-left border-b pb-3",
    headerName: "text-xl font-bold tracking-tight",
    contactRow: "grid grid-cols-2 gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground",
    heading: "text-xs font-bold uppercase tracking-wider text-primary border-b border-primary/40 pb-1 mb-2",
    section: "mb-4",
  },
  academic: {
    container: "font-serif",
    headerWrapper: "pb-4 border-t-2 border-b-2 border-slate-800 py-4 mb-2 flex gap-6 items-start",
    headerName: "text-3xl font-semibold text-slate-900 tracking-normal flex-1",
    contactRow: "flex flex-col gap-y-1 text-xs text-slate-700 mt-2",
    heading: "text-sm font-semibold uppercase tracking-widest text-slate-900 border-b-2 border-slate-800 pb-1.5 mb-3",
    section: "mb-5",
  },
  impact: {
    container: "font-sans",
    headerWrapper: "pb-5 border-b-4 border-teal-600 mb-2 flex gap-6 items-start",
    headerName: "text-3xl font-bold text-slate-900 tracking-tight flex-1",
    contactRow: "flex flex-col gap-y-1.5 text-xs text-slate-700",
    heading: "text-sm font-bold uppercase tracking-wider text-white bg-teal-600 px-3 py-2 mb-3",
    section: "mb-4",
  },
};
