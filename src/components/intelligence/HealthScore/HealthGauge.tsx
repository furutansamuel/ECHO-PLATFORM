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
    <div
      className="relative mx-auto aspect-square w-full"
      style={{ maxWidth: 'clamp(200px, 60vw, 384px)' }}
    >
      <svg className="h-full w-full" viewBox="0 0 300 300">
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
          className="font-bold"
          style={{ fontSize: 'clamp(2.5rem, 10vw, 4.5rem)', lineHeight: 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="mt-1 text-xs text-muted-foreground sm:text-sm md:text-base lg:text-lg">Health Score</span>
      </div>
    </div>
  );
};

export default HealthGauge;
