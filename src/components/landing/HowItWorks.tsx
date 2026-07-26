import React from 'react';
import { ScanEye, CheckCircle, BrainCircuit, Users } from 'lucide-react';

const steps = [
  { 
    icon: ScanEye, 
    title: '1. Report Hazard', 
    description: 'Use our simple form to submit a report with photos and location details in under 60 seconds.'
  },
  { 
    icon: CheckCircle, 
    title: '2. Verify Report', 
    description: 'Our team and community volunteers verify the report to confirm its authenticity and severity.'
  },
  { 
    icon: BrainCircuit, 
    title: '3. AI Analysis', 
    description: "ECHO's AI analyzes the data to identify hotspots, predict risks, and suggest optimal solutions."
  },
  { 
    icon: Users,
    title: '4. Community Action', 
    description: 'Verified reports are shared with community leaders and environmental agencies to drive action.'
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 lg:py-16 section-bg-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary">How ECHO Works</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            A simple and transparent process for turning community reports into environmental action.
          </p>
        </div>
        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <div className="bg-primary text-white p-4 rounded-full">
                            <step.icon className="h-8 w-8" />
                        </div>
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
