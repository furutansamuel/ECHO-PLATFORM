import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const articles = [
  {
    image:
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=70',
    title: '5 Ways to Prevent Urban Flooding',
    description:
      'Practical steps to protect your home and community from the effects of flooding.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=70',
    title: 'The Ultimate Guide to Waste Management',
    description:
      'Understand the importance of sorting waste and how you contribute to effective recycling.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=70',
    title: 'Understanding Your Environmental Health Score',
    description:
      "Dive into what the Community Health Score means and how it's calculated.",
  },
];

function ArticleImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-primary/15 via-accent/10 to-emerald-500/15">
        <BookOpen className="h-10 w-10 text-primary/60" aria-hidden />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn(
        'h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105'
      )}
    />
  );
}

export function KnowledgeCenter() {
  return (
    <section className="py-12 lg:py-24 section-bg-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary">Knowledge Centre</h2>
          <p className="text-lg text-muted-foreground mt-2">
            Empower yourself with information to make a bigger impact.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card key={article.title} className="overflow-hidden group premium-shadow">
              <div className="h-48 overflow-hidden">
                <ArticleImage src={article.image} alt={article.title} />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{article.description}</p>
                <Button variant="outline" asChild>
                  <Link to="/knowledge">
                    Read More <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
