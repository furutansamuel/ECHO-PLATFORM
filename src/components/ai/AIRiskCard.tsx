import React from 'react';
import { Brain, AlertTriangle, Activity, ShieldCheck, ShieldAlert, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Mirrors the real scoring logic in generate_ai_assessment() (Postgres
// function, supabase/migrations/20260115120700_..._functions.sql) so
// the "Why?" breakdown shown here is an accurate account of what
// actually produced the score — not an invented explanation.
const HIGH_RISK_CATEGORIES = ['Water Pollution', 'Open Sewage', 'Flood'];
const ELEVATED_CATEGORIES = ['Air Pollution', 'Illegal Burning'];

const SEVERITY_BASE: Record<string, number> = { Low: 25, Medium: 50, High: 75, Critical: 95 };

interface AIRiskCardProps {
  score: number; // 0-100
  priority: string;
  category: string;
  severity: string;
  impact: string;
  affectedArea?: string;
  duplicateId?: string | null;
  verificationStatus?: string;
  verificationConfidence?: number;
  aiModel?: string;
}

export const AIRiskCard: React.FC<AIRiskCardProps> = ({
  score,
  priority,
  category,
  severity,
  impact,
  affectedArea,
  duplicateId,
  verificationStatus,
  verificationConfidence,
  aiModel,
}) => {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-destructive';
    if (s >= 50) return 'text-amber-500';
    return 'text-primary';
  };

  const getPriorityColor = (p: string) => {
    switch (p.toLowerCase()) {
      case 'critical':
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const categoryNote = HIGH_RISK_CATEGORIES.includes(category)
    ? `${category} hazards get an additional risk weighting — they carry elevated urgency for public health and drainage systems.`
    : ELEVATED_CATEGORIES.includes(category)
      ? `${category} hazards get a smaller additional risk weighting for air-quality health impact.`
      : null;

  // A verifier's own confidence is a distinct, human-entered field —
  // only shown once it's actually set by a real verification, never a
  // guessed fallback number.
  const hasRealVerifierConfidence = verificationStatus === 'completed' && typeof verificationConfidence === 'number';

  return (
    <Card className="overflow-hidden border-primary/20 bg-primary/5">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          AI Environmental Insight
          {aiModel && aiModel !== 'heuristic' ? (
            <Badge variant="outline" className="text-[9px] font-normal border-primary/30 text-primary">
              Gemini AI
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[9px] font-normal text-muted-foreground">
              Automated
            </Badge>
          )}
        </CardTitle>
        <Badge variant="outline" className={getPriorityColor(priority)}>
          {priority} Priority
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Risk Score</p>
            <div className="flex items-end gap-1">
              <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{Math.round(score)}</span>
              <span className="text-xs text-muted-foreground mb-1">/ 100</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Priority</p>
            <div className="flex items-center gap-1 mt-1">
              <AlertTriangle className={`w-4 h-4 ${getScoreColor(score)}`} />
              <span className="text-sm font-medium">{priority}</span>
            </div>
          </div>
        </div>

        {/* Why? — the actual contributing factors, not a generic claim */}
        <div className="space-y-1.5 p-3 bg-white/50 rounded-lg border border-primary/10">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1">
            <Info className="w-3 h-3" /> Why this score?
          </p>
          <ul className="text-xs text-foreground space-y-1 list-disc list-inside">
            <li>{severity} severity contributes a base risk of {SEVERITY_BASE[severity] ?? '—'}%.</li>
            {categoryNote && <li>{categoryNote}</li>}
            {affectedArea && <li>Reported affected area: {affectedArea}.</li>}
          </ul>
          <p className="text-[10px] text-muted-foreground italic pt-1">
            This is a rule-based assessment from the report's category and severity — not a machine-learning prediction.
          </p>
        </div>

        <div className="p-3 bg-white/50 rounded-lg border border-primary/10">
          <p className="text-xs leading-relaxed text-foreground italic">
            "{impact}"
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-primary/10 flex-wrap">
          <div className="flex items-center gap-1.5">
            {duplicateId ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-medium text-amber-600">Possible duplicate detected</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] font-medium">No duplicates detected</span>
              </>
            )}
          </div>
          {hasRealVerifierConfidence && (
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-medium">Verifier confidence: {verificationConfidence}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
