import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { AIInsight } from '@/types/reports';

interface AIInsightCardProps {
  insight: AIInsight;
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight }) => {
  const TrendIcon = insight.trend === 'up' ? ArrowUp : insight.trend === 'down' ? ArrowDown : ArrowRight;
  const trendColor = insight.trend === 'up' ? 'text-red-500' : insight.trend === 'down' ? 'text-green-500' : 'text-gray-500';

  return (
    <Card className="bg-background/60 backdrop-blur-sm premium-shadow h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-base">{insight.title}</span>
          <div className={`flex items-center ${trendColor}`}>
            <TrendIcon className="h-4 w-4" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{insight.summary}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
        <Badge variant="outline">Confidence: {(insight.confidence * 100).toFixed(0)}%</Badge>
        <span className="font-semibold">Action: {insight.action}</span>
      </CardFooter>
    </Card>
  );
};

export default AIInsightCard;
