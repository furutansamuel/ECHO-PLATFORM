import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: 'Jan', reports: 400 },
  { name: 'Feb', reports: 300 },
  { name: 'Mar', reports: 600 },
  { name: 'Apr', reports: 800 },
  { name: 'May', reports: 500 },
  { name: 'Jun', reports: 700 },
];

const HazardTrendsChart = () => {
  return (
    <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
            <CardTitle>Hazard Trends</CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reports" fill="var(--color-primary)" />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  );
};

export default HazardTrendsChart;
