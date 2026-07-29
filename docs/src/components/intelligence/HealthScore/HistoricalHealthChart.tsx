import React from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: 'Jan', score: 65 },
  { name: 'Feb', score: 68 },
  { name: 'Mar', score: 72 },
  { name: 'Apr', score: 70 },
  { name: 'May', score: 75 },
  { name: 'Jun', score: 78 },
];

const HistoricalHealthChart = () => {
  return (
    <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
            <CardTitle>Historical Health Score</CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[50, 100]}/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  );
};

export default HistoricalHealthChart;
