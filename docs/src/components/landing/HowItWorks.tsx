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
    <section className="py-8 lg:py-10 section-bg-soft">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="scale-90 origin-top">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary">
              How ECHO Works
            </h2>
            <p className="text-base text-muted-foreground mt-2 max-w-xl mx-auto">
              A simple and transparent process for turning community reports into environmental action.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((step) => (
                <div key={step.title} className="relative text-center">
                  <div className="flex justify-center mb-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <div className="bg-primary text-white p-2 rounded-full">
                        <step.icon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold mb-1">
                    {step.title}
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
