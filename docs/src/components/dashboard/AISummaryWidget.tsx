import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

const aiInsights = [
  {
    title: "High Flood Risk in Downtown Area",
    confidence: "92%",
    recommendation: "Deploy temporary flood barriers.",
    color: "bg-error",
  },
  {
    title: "Increased Air Pollution near Industrial Zone",
    confidence: "85%",
    recommendation: "Issue air quality alert.",
    color: "bg-warning",
  },
  {
    title: "Illegal Dumping Site Detected",
    confidence: "98%",
    recommendation: "Dispatch cleanup crew and drone for surveillance.",
    color: "bg-info",
  },
];

export function AISummaryWidget() {
  return (
    <Card className="bg-background/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.bot className="h-5 w-5 text-primary" />
          <span>AI Environmental Intelligence</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {aiInsights.map((insight, index) => (
            <li key={insight.title} className="flex items-center gap-4">
              <div className={`h-2 w-2 rounded-full ${insight.color}`} />
              <div className="flex-1">
                <p className="font-semibold">{insight.title}</p>
                <p className="text-sm text-muted-foreground">
                  Confidence: {insight.confidence}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Icons.chevronRight className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
