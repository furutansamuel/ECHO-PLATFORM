import React from 'react';
import { motion } from 'framer-motion';

interface HealthGaugeProps {
  score: number;
}

const HealthGauge: React.FC<HealthGaugeProps> = ({ score }) => {
  const circumference = 2 * Math.PI * 140; // 2 * pi * radius
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score > 75) return '#1B5E20'; // Primary Green
    if (score > 50) return '#F9A825'; // Warning Yellow
    return '#C62828'; // Destructive Red
  };

  return (
    <div className="relative w-96 h-96">
      <svg className="w-full h-full" viewBox="0 0 300 300">
        {/* Background Circle */}
        <circle
          cx="150"
          cy="150"
          r="140"
          fill="transparent"
          stroke="var(--muted)"
          strokeWidth="20"
        />
        {/* Foreground Circle */}
        <motion.circle
          cx="150"
          cy="150"
          r="140"
          fill="transparent"
          stroke={getColor()}
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          transform="rotate(-90 150 150)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className="text-7xl font-bold" 
          initial={{ opacity: 0}} 
          animate={{ opacity: 1}}
          transition={{delay: 0.5, duration: 0.5}}
        >
          {score}
        </motion.span>
        <span className="text-lg text-muted-foreground">Health Score</span>
      </div>
    </div>
  );
};

export default HealthGauge;
