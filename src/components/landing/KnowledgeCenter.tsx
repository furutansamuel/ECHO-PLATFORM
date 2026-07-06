import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const articles = [
  {
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-project-images/1716999914041-knowledge-1.jpg',
    title: '5 Ways to Prevent Urban Flooding',
    description: 'Learn practical steps you can take to protect your home and community from the effects of flooding.'
  },
  {
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-project-images/1716999940348-knowledge-2.jpg',
    title: 'The Ultimate Guide to Waste Management',
    description: 'Understand the importance of sorting waste and how you can contribute to a more effective recycling system.'
  },
  {
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-project-images/1716999965123-knowledge-3.jpg',
    title: 'Understanding Your Environmental Health Score',
    description: "Dive deep into what the Community Health Score means and how it's calculated."
  }
];

export function KnowledgeCenter() {
  return (
    <section className="py-12 lg:py-24 section-bg-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary">Knowledge Centre</h2>
          <p className="text-lg text-muted-foreground mt-2">Empower yourself with information to make a bigger impact.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card key={article.title} className="overflow-hidden group premium-shadow">
                <div className="h-48 overflow-hidden">
                    <img src={article.image} alt={article.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{article.description}</p>
                <Button variant="outline" asChild>
                  <Link to="/knowledge">Read More <ArrowRight className="h-4 w-4 ml-2"/></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
