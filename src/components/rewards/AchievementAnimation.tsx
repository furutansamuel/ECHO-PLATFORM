import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AchievementAnimationProps {
  achievement: {
    title: string;
    description: string;
    icon: React.ElementType;
    points: number;
  } | null;
  onClose: () => void;
}

export const AchievementAnimation: React.FC<AchievementAnimationProps> = ({
  achievement,
  onClose
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (achievement) {
      setShow(true);
      const timer = setTimeout(() => {
        // Automatically hide after 5 seconds if not closed manually
        // setShow(false);
        // onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            className="relative w-full max-w-sm bg-card border-2 border-primary/30 rounded-3xl p-8 text-center shadow-2xl overflow-hidden"
          >
            {/* Background sparkle effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -100, -200],
                    x: [0, (i % 2 === 0 ? 50 : -50)],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2, 
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                  className="absolute bottom-0 left-1/2 w-2 h-2 rounded-full bg-highlight/40"
                  style={{ marginLeft: `${(i - 6) * 15}px` }}
                />
              ))}
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 rounded-full"
              onClick={() => {
                setShow(false);
                setTimeout(onClose, 300);
              }}
            >
              <X className="w-4 h-4" />
            </Button>

            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: [10, -10, 10] }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6"
            >
              <achievement.icon className="w-12 h-12 text-primary" />
            </motion.div>

            <h2 className="text-2xl font-bold text-primary mb-2">Achievement Unlocked!</h2>
            <h3 className="text-xl font-semibold mb-3">{achievement.title}</h3>
            <p className="text-muted-foreground text-sm mb-6">
              {achievement.description}
            </p>

            <div className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-highlight/10 text-highlight font-bold border border-highlight/20 mb-6">
              <Star className="w-5 h-5 fill-highlight" />
              +{achievement.points} ECO POINTS
            </div>

            <Button 
              className="w-full rounded-xl py-6"
              onClick={() => {
                setShow(false);
                setTimeout(onClose, 300);
              }}
            >
              Brilliant!
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
