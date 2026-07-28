import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Droplets, 
  Trash2, 
  Wind, 
  Sun,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const topics = [
  {
    title: 'Flood Prevention',
    description: 'Protect your community from seasonal flooding risks.',
    icon: Droplets,
    color: 'text-info',
    bg: 'bg-info/10'
  },
  {
    title: 'Waste Management',
    description: 'Learn efficient ways to handle domestic waste.',
    icon: Trash2,
    color: 'text-secondary',
    bg: 'bg-secondary/10'
  },
  {
    title: 'Air Quality',
    description: 'Tips for reducing local air pollution levels.',
    icon: Wind,
    color: 'text-muted-foreground',
    bg: 'bg-muted'
  },
  {
    title: 'Climate Awareness',
    description: 'Understand global climate change impacts locally.',
    icon: Sun,
    color: 'text-status-warning',
    bg: 'bg-status-warning/10'
  }
];

const KnowledgeCentrePreview = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border rounded-2xl shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold flex items-center gap-3 text-sm">
          <div className="p-2 bg-primary/10 rounded-xl">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          Knowledge Centre
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        {topics.map((topic, index) => (
          <motion.div 
            key={topic.title} 
            whileHover={{ y: -4, border: '1px solid rgba(27, 94, 32, 0.2)' }}
            className="p-5 rounded-2xl border bg-muted/5 transition-all cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-white ${topic.bg}`}>
              <topic.icon className={`h-5 w-5 ${topic.color}`} />
            </div>
            <h4 className="font-bold text-sm mb-1.5 group-hover:text-primary transition-colors tracking-tight">{topic.title}</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">{topic.description}</p>
            <span className="text-[9px] font-black uppercase text-primary tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Learn More <ArrowRight className="h-2 w-2" />
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <Button 
          variant="outline" 
          className="w-full h-11 text-[10px] font-black uppercase tracking-widest gap-2 group border-primary/20 hover:bg-primary/5 shadow-sm"
          onClick={() => navigate('/knowledge')}
        >
          Explore All Educational Modules
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default KnowledgeCentrePreview;
