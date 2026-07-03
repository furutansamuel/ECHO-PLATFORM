import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

export function CommunityHealthWidget() {
  const score = 85;
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="bg-green-100/20 dark:bg-green-900/20 border-green-300/50 premium-shadow h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
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
              className="text-green-200/50 dark:text-green-800/50"
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
              className="text-green-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-green-600 dark:text-green-300">{score}</span>
            <span className="text-sm font-medium text-green-700 dark:text-green-400">Healthy</span>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground px-4">
          This score reflects the overall environmental health of your community based on recent reports and data.
        </p>
      </CardContent>
    </Card>
  );
}
