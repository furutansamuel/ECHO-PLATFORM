import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Users, MapPin, Cpu, Trees } from 'lucide-react';
import { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

const trustBadges = [
  { icon: Cpu, text: 'AI Powered' },
  { icon: Users, text: 'Community Driven' },
  { icon: ShieldCheck, text: 'Secure Reporting' },
  { icon: MapPin, text: 'Location Aware' },
  { icon: Trees, text: 'Built for Nigeria' },
];

const stats = [
  { value: 1250, label: 'Hazard Reports' },
  { value: 890, label: 'Verified Reports' },
  { value: 45, label: 'Communities Served' },
  { value: 120, label: 'Cleanup Events' },
  { value: 1500, label: 'Active Volunteers' },
  { value: 34000, label: 'Impact Points Earned' },
];

const AnimatedNumber = ({ n }: { n: number }) => {
    const { number } = useSpring({
        from: { number: 0 },
        number: n,
        delay: 200,
        config: { mass: 1, tension: 20, friction: 10 },
    });

    return <animated.div>{number.to((n) => n.toLocaleString('en-US', { maximumFractionDigits: 0 }))}</animated.div>;
};

export function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section ref={ref} className="py-12 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12 lg:mb-20">
          {trustBadges.map((badge, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <badge.icon className="h-8 w-8 text-primary" />
              <span className="font-semibold text-muted-foreground">{badge.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Animated Counters */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="p-4 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <div className="text-4xl lg:text-5xl font-bold text-primary">
                {isInView && <AnimatedNumber n={stat.value} />}
              </div>
              <p className="text-muted-foreground mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
