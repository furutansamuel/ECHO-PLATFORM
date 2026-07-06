import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useDocumentTitle } from '@/hooks/use-document-title';

const faqItems = [
  {
    question: "What is ECHO?",
    answer: "ECHO stands for Environmental Community Health Observatory. It's a civic technology platform that empowers Nigerian citizens to report environmental hazards, monitor their local environment, and contribute to community-led action for a cleaner and safer Nigeria.",
  },
  {
    question: "How does reporting a hazard work?",
    answer: "It's simple! Just click the \"Report Hazard\" button, select a category, upload a photo, and provide a brief description. Our platform automatically captures the location. The entire process takes less than a minute.",
  },
  {
    question: "Is my report anonymous?",
    answer: "Yes, you have the option to submit reports anonymously. While creating an account allows you to track your reports and earn rewards, we are committed to protecting your privacy and safety.",
  },
  {
    question: "What happens after I submit a report?",
    answer: "Once submitted, your report is sent to our verification team and community moderators. Verified reports are then analyzed by our AI to identify trends and are shared with relevant local authorities and community groups to facilitate action."
  },
  {
    question: "What is the Community Health Score?",
    answer: "The Community Health Score is a data-driven metric calculated by our AI. It provides a real-time snapshot of your community's environmental well-being based on the number and severity of reported hazards, cleanup activities, and other environmental data.",
  },
  {
    question: "How can I get involved beyond reporting?",
    answer: "We'd love for you to get more involved! You can join our volunteer network, participate in cleanup events listed on the platform, and help us spread the word. Check the \"Events\" and \"Community\" sections for more information.",
  },
    {
    question: "Is the platform free to use?",
    answer: "Yes, ECHO is completely free for all citizens and volunteers. Our mission is to make environmental monitoring accessible to everyone.",
  },
];

export default function FAQPage() {
  useDocumentTitle(
    'Frequently Asked Questions',
    'Answers to common questions about how ECHO works, hazard reporting, privacy, and rewards.'
  );
  return (
    <div className="bg-background">
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
            Find answers to common questions about ECHO, our mission, and how to use the platform.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
            <Accordion type="single" collapsible className="w-full space-y-4">
                {faqItems.map((item, index) => (
                    <AccordionItem key={item.question} value={`item-${index}`} className="border-b-0 rounded-lg bg-white premium-shadow">
                        <AccordionTrigger className="p-6 text-lg font-semibold text-left hover:no-underline">
                            {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="p-6 pt-0 text-muted-foreground">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </section>
    </div>
  );
}
