import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CategoryScoresProps {
    scores: { [key: string]: number };
}

const categoryLabels: {[key: string]: string} = {
    waste_management: 'Waste Management',
    flood_risk: 'Flood Risk',
    air_quality: 'Air Quality',
    water_quality: 'Water Quality',
}

const CategoryScores: React.FC<CategoryScoresProps> = ({ scores }) => {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Category Scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {Object.entries(scores).map(([key, value]) => (
                <div key={key} className="space-y-1">
                    <div className="flex justify-between items-center">
                        <p className="font-medium">{categoryLabels[key] || key}</p>
                        <p className="font-bold text-primary">{value}</p>
                    </div>
                    <Progress value={value} />
                </div>
            ))}
        </CardContent>
    </Card>
  );
};

export default CategoryScores;
