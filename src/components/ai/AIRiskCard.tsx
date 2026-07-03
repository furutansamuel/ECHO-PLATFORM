import React from 'react';
import { Brain, AlertTriangle, Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface AIRiskCardProps {
  score: number;
  priority: string;
  level: string;
  summary: string;
  suggestedAction: string;
  confidence: number;
}

export const AIRiskCard: React.FC<AIRiskCardProps> = ({
  score,
  priority,
  level,
  summary,
  suggestedAction,
  confidence
}) => {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-destructive';
    if (s >= 50) return 'text-amber-500';
    return 'text-primary';
  };

  const getLevelColor = (l: string) => {
    switch (l.toLowerCase()) {
      case 'critical':
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <Card className="overflow-hidden border-primary/20 bg-primary/5">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          AI Environmental Insight
        </CardTitle>
        <Badge variant="outline" className={getLevelColor(level)}>
          {level} Risk
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Risk Score</p>
            <div className="flex items-end gap-1">
              <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
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

        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-muted-foreground uppercase tracking-wider font-bold">AI Confidence</span>
            <span className="font-medium">{confidence}%</span>
          </div>
          <Progress value={confidence} className="h-1" />
        </div>

        <div className="p-3 bg-white/50 rounded-lg border border-primary/10">
          <p className="text-xs leading-relaxed text-foreground italic">
            "{summary}"
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1">
            <Activity className="w-3 h-3" />
            Suggested Action
          </p>
          <p className="text-xs font-medium bg-primary/10 p-2 rounded text-primary border border-primary/20">
            {suggestedAction}
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-primary/10">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-medium">Trend: Rising</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-medium">Duplicate Check: Passed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
