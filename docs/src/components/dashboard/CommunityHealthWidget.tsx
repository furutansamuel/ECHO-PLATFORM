import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

export function CommunityHealthWidget() {
  const score = 85;
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="bg-success-subtle/20 dark:bg-success/20 border-success/30/50 premium-shadow h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-success dark:text-accent">
          <Icons.heartHand className="h-5 w-5" />
          <span>Community Health Score</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <div className="relative h-48 w-48">
          <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-accent/50 dark:text-success/50"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-success"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-success dark:text-accent">{score}</span>
            <span className="text-sm font-medium text-success dark:text-accent">Healthy</span>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground px-4">
          This score reflects the overall environmental health of your community based on recent reports and data.
        </p>
      </CardContent>
    </Card>
  );
}
