import { memo } from 'react';
import { BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AISummaryNarrativeProps {
  communityStatus?: string;
  floodRisk?: number;
  wasteAccumulation?: number;
  totalHazards: number;
  topRecommendationType?: string;
}

function AISummaryNarrativeBase({
  communityStatus,
  floodRisk,
  wasteAccumulation,
  totalHazards,
  topRecommendationType,
}: AISummaryNarrativeProps) {
  return (
    <Card className="border-none shadow-2xl bg-gradient-to-br from-card to-accent/5 [contain:content]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <BrainCircuit className="h-5 w-5 text-accent" />
          AI Intelligence Executive Summary
        </CardTitle>
        <CardDescription>Synthetic analysis of current local conditions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
            <BrainCircuit className="h-12 w-12" />
          </div>
          <p className="text-sm leading-relaxed relative z-10">
            The current environmental intelligence for your community indicates a{' '}
            <strong>{communityStatus}</strong> status. Our AI model has detected{' '}
            {floodRisk && floodRisk > 40 ? 'elevated flood risks' : 'stable environmental patterns'} based on
            recent report density. Waste accumulation remains a
            {wasteAccumulation && wasteAccumulation > 50 ? ' significant concern' : ' managed area'} with{' '}
            {totalHazards} total hazards mapped. Immediate focus is recommended for{' '}
            {topRecommendationType || 'general sanitation'}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export const AISummaryNarrative = memo(AISummaryNarrativeBase);

