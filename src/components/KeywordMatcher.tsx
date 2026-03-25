import { useState, useMemo } from "react";
import type { ResumeData } from "@/context/ResumeContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Search, ChevronDown, ChevronUp, CheckCircle, XCircle, Sparkles, X } from "lucide-react";

// Common filler words to ignore
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of",
  "with", "by", "is", "are", "was", "were", "be", "been", "being", "have",
  "has", "had", "do", "does", "did", "will", "would", "could", "should",
  "may", "might", "shall", "can", "need", "must", "it", "its", "you", "your",
  "we", "our", "they", "their", "this", "that", "these", "those", "not", "no",
  "all", "each", "every", "both", "few", "more", "most", "other", "some",
  "such", "than", "too", "very", "just", "also", "about", "up", "out", "so",
  "if", "as", "from", "into", "through", "during", "before", "after", "above",
  "below", "between", "under", "over", "any", "who", "what", "which", "how",
  "when", "where", "why", "able", "etc", "e.g", "i.e", "per", "via",
]);

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-/\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function extractPhrases(text: string): string[] {
  // Extract 2-3 word meaningful phrases
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-/\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);

  const phrases: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    if (!STOP_WORDS.has(words[i]) && !STOP_WORDS.has(words[i + 1])) {
      phrases.push(`${words[i]} ${words[i + 1]}`);
    }
  }
  return phrases;
}

function getResumeText(resume: ResumeData): string {
  const parts = [
    resume.personalInfo.fullName,
    resume.summary,
    ...resume.experience.map((e) => `${e.position} ${e.company} ${e.description}`),
    ...resume.education.map((e) => `${e.degree} ${e.field} ${e.institution}`),
    ...resume.skills,
    ...resume.projects.map((p) => `${p.name} ${p.description} ${p.technologies}`),
    ...resume.certifications.map((c) => `${c.name} ${c.issuer}`),
  ];
  return parts.join(" ");
}

interface MatchResult {
  score: number;
  matched: string[];
  missing: string[];
  totalKeywords: number;
}

function analyzeMatch(resume: ResumeData, jobDescription: string): MatchResult {
  const resumeText = getResumeText(resume).toLowerCase();
  const jdKeywords = extractKeywords(jobDescription);
  const jdPhrases = extractPhrases(jobDescription);

  // Count frequency of JD keywords to find important ones
  const freq: Record<string, number> = {};
  jdKeywords.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });

  // Get unique keywords sorted by frequency (most important first)
  const uniqueKeywords = Array.from(new Set(jdKeywords)).sort((a, b) => (freq[b] || 0) - (freq[a] || 0));

  // Also check phrases
  const uniquePhrases = Array.from(new Set(jdPhrases));

  const matched = new Set<string>();
  const missing = new Set<string>();

  // Check single keywords
  uniqueKeywords.forEach((kw) => {
    if (resumeText.includes(kw)) {
      matched.add(kw);
    } else {
      missing.add(kw);
    }
  });

  // Check phrases (boost matched phrases, move from missing if phrase matches)
  uniquePhrases.forEach((phrase) => {
    if (resumeText.includes(phrase)) {
      matched.add(phrase);
      // Remove individual words from missing if phrase matched
      phrase.split(" ").forEach((w) => missing.delete(w));
    }
  });

  const total = matched.size + missing.size;
  const score = total > 0 ? Math.round((matched.size / total) * 100) : 0;

  return {
    score,
    matched: [...matched].slice(0, 30),
    missing: [...missing].slice(0, 20),
    totalKeywords: total,
  };
}

export default function KeywordMatcher({ resume }: { resume: ResumeData }) {
  const [jobDescription, setJobDescription] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const result = useMemo(() => {
    if (!analyzed || jobDescription.trim().length < 20) return null;
    return analyzeMatch(resume, jobDescription);
  }, [resume, jobDescription, analyzed]);

  const handleAnalyze = () => {
    if (jobDescription.trim().length < 20) return;
    setAnalyzed(true);
  };

  const handleClear = () => {
    setJobDescription("");
    setAnalyzed(false);
  };

  function scoreColor(score: number) {
    if (score >= 70) return "text-accent";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  }

  return (
    <div className="border rounded-xl bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary text-primary">
            <Search className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">Keyword Match</p>
            <p className="text-xs text-muted-foreground">
              {result ? `${result.score}% match` : "Paste a job description to compare"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {result && (
            <span className={cn("text-2xl font-bold", scoreColor(result.score))}>{result.score}%</span>
          )}
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t p-4 space-y-4">
          <div className="space-y-2">
            <Textarea
              value={jobDescription}
              onChange={(e) => {
                const val = e.target.value.slice(0, 5000);
                setJobDescription(val);
                setAnalyzed(false);
              }}
              placeholder="Paste the job description here to see how well your resume matches..."
              rows={4}
              className="text-xs resize-none"
              maxLength={5000}
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">{jobDescription.length}/5000</span>
              <div className="flex gap-2">
                {jobDescription && (
                  <Button variant="ghost" size="sm" onClick={handleClear} className="h-7 text-xs gap-1">
                    <X className="h-3 w-3" /> Clear
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleAnalyze}
                  disabled={jobDescription.trim().length < 20}
                  className="h-7 text-xs gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Analyze Match
                </Button>
              </div>
            </div>
          </div>

          {result && (
            <div className="space-y-4 animate-fade-in">
              {/* Score */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Match Score</span>
                  <span className={cn("font-semibold", scoreColor(result.score))}>{result.score}%</span>
                </div>
                <Progress value={result.score} className="h-2" />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {result.matched.length} of {result.totalKeywords} keywords found in your resume
                </p>
              </div>

              {/* Missing keywords */}
              {result.missing.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-destructive flex items-center gap-1 mb-2">
                    <XCircle className="h-3.5 w-3.5" /> Missing Keywords ({result.missing.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing.map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Consider adding these keywords to your resume where relevant.
                  </p>
                </div>
              )}

              {/* Matched keywords */}
              {result.matched.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-accent flex items-center gap-1 mb-2">
                    <CheckCircle className="h-3.5 w-3.5" /> Matched Keywords ({result.matched.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matched.map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
