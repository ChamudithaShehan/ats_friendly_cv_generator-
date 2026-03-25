import { useMemo, useState } from "react";
import type { ResumeData } from "@/context/ResumeContext";
import { analyzeResume, type ATSCheck } from "@/lib/ats-analyzer";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertTriangle, Info, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryLabels: Record<string, string> = {
  content: "Content",
  formatting: "Formatting",
  keywords: "Keywords & Impact",
  structure: "Structure",
};

const severityIcon = {
  critical: XCircle,
  warning: AlertTriangle,
  info: Info,
};

function scoreColor(score: number) {
  if (score >= 80) return "text-accent";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}

function scoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Needs Work";
  return "Poor";
}

export default function ATSScorePanel({ resume }: { resume: ResumeData }) {
  const { score, checks } = useMemo(() => analyzeResume(resume), [resume]);
  const [expanded, setExpanded] = useState(true);

  const failed = checks.filter((c) => !c.passed);
  const passed = checks.filter((c) => c.passed);

  const categories = Object.keys(categoryLabels);

  return (
    <div className="border rounded-xl bg-card overflow-hidden">
      {/* Header with score */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn("flex items-center justify-center w-10 h-10 rounded-full border-2", scoreColor(score))}>
            <Shield className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">ATS Score</p>
            <p className="text-xs text-muted-foreground">
              {failed.length === 0 ? "All checks passed!" : `${failed.length} issue${failed.length > 1 ? "s" : ""} found`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className={cn("text-2xl font-bold", scoreColor(score))}>{score}</span>
            <span className="text-xs text-muted-foreground ml-1">/ 100</span>
            <p className={cn("text-xs font-medium", scoreColor(score))}>{scoreLabel(score)}</p>
          </div>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t">
          {/* Progress bar */}
          <div className="px-4 pt-3 pb-2">
            <Progress value={score} className="h-2" />
          </div>

          {/* Issues first */}
          {failed.length > 0 && (
            <div className="px-4 pb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Issues to Fix</p>
              <div className="space-y-1.5">
                {failed.map((check) => (
                  <CheckRow key={check.id} check={check} />
                ))}
              </div>
            </div>
          )}

          {/* Passed by category */}
          {passed.length > 0 && (
            <div className="px-4 pb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Passed Checks</p>
              <div className="space-y-1.5">
                {categories.map((cat) => {
                  const catPassed = passed.filter((c) => c.category === cat);
                  if (catPassed.length === 0) return null;
                  return catPassed.map((check) => (
                    <CheckRow key={check.id} check={check} />
                  ));
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CheckRow({ check }: { check: ATSCheck }) {
  const [showTip, setShowTip] = useState(false);

  if (check.passed) {
    return (
      <div className="flex items-center gap-2 py-1 px-2 rounded text-xs">
        <CheckCircle className="h-3.5 w-3.5 text-accent shrink-0" />
        <span className="text-muted-foreground">{check.label}</span>
      </div>
    );
  }

  const Icon = severityIcon[check.severity];
  const color = check.severity === "critical" ? "text-destructive" : check.severity === "warning" ? "text-warning" : "text-muted-foreground";

  return (
    <div>
      <button
        onClick={() => setShowTip(!showTip)}
        className="w-full flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/50 transition-colors text-xs text-left"
      >
        <Icon className={cn("h-3.5 w-3.5 shrink-0", color)} />
        <span className="text-foreground flex-1">{check.label}</span>
        <span className={cn("text-[10px] font-medium uppercase px-1.5 py-0.5 rounded-full", {
          "bg-destructive/10 text-destructive": check.severity === "critical",
          "bg-warning/10 text-warning": check.severity === "warning",
          "bg-muted text-muted-foreground": check.severity === "info",
        })}>
          {check.severity}
        </span>
      </button>
      {showTip && (
        <p className="text-xs text-muted-foreground pl-8 pb-2 animate-fade-in">{check.tip}</p>
      )}
    </div>
  );
}
