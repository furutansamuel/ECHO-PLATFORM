import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Share2, 
  Download,
  LayoutDashboard,
  PlusCircle,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface SuccessStepProps {
  referenceNumber: string;
}

export default function SuccessStep({ referenceNumber }: SuccessStepProps) {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        className="mb-8 flex justify-center"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative bg-white dark:bg-card p-6 rounded-full shadow-2xl border-4 border-primary/20">
            <CheckCircle2 className="h-20 w-20 text-primary" />
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2"
          >
            <Award className="h-4 w-4" />
            +50 Impact Points
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Report Successfully Submitted!</h1>
        <p className="text-lg text-muted-foreground">
          Thank you for helping us keep our community clean and safe. Your contribution has been recorded.
        </p>
        
        <div className="bg-muted/50 p-6 rounded-2xl border-2 border-dashed border-primary/20 my-8 inline-block">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Reference Number</p>
          <p className="text-3xl font-mono font-bold text-primary">{referenceNumber}</p>
          <p className="text-xs text-muted-foreground mt-3">
            Estimated Verification Time: <span className="font-bold">24 - 48 Hours</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <Button asChild className="bg-primary text-white h-12 gap-2 text-base">
            <Link to="/dashboard">
              <LayoutDashboard className="h-5 w-5" />
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="outline" className="h-12 gap-2 text-base" onClick={() => window.location.reload()}>
            <PlusCircle className="h-5 w-5" />
            Report Another Hazard
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 border-t mt-12">
          <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            <Share2 className="h-4 w-4" />
            Share this report
          </button>
          <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            <Download className="h-4 w-4" />
            Download Receipt
          </button>
        </div>
      </motion.div>

      {/* Success Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 rounded-3xl overflow-hidden shadow-2xl border-8 border-background"
      >
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/060df7fc-fb5a-4109-890a-cb6e43e9b598/report-submission-success-bd01a6b2-1782883074931.webp" 
          alt="Success illustration" 
          className="w-full h-auto"
        />
      </motion.div>
    </div>
  );
}
