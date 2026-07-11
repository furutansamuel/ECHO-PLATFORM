import React from 'react';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { LucideIcon } from 'lucide-react';

interface LegalSection {
  heading: string;
  body: React.ReactNode;
}

interface LegalPageLayoutProps {
  icon: LucideIcon;
  title: string;
  description: string;
  lastUpdated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}

export function LegalPageLayout({
  icon: Icon,
  title,
  description,
  lastUpdated,
  intro,
  sections,
}: LegalPageLayoutProps) {
  useDocumentTitle(title, description);

  return (
    <div className="bg-background">
      {/* Hero — matches About/Contact/FAQ pattern */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Icon className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">{title}</h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">{description}</p>
          <p className="text-sm text-muted-foreground mt-3">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="rounded-2xl border border-border/60 bg-card p-6 md:p-10 shadow-premium">
            <div className="text-muted-foreground leading-relaxed">{intro}</div>

            <div className="mt-10 space-y-10">
              {sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="text-xl font-bold text-foreground mb-3">{section.heading}</h2>
                  <div className="text-muted-foreground leading-relaxed space-y-3">
                    {section.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
