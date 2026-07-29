import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import type { KnowledgeArticle } from '@/types/reports';

interface LearnTodayCardProps {
  articles: KnowledgeArticle[];
}

export function LearnTodayCard({ articles }: LearnTodayCardProps) {
  const article = useMemo(
    () => articles.find((a) => a.is_featured) ?? articles[0],
    [articles]
  );

  if (!article) return null;

  return (
    <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      <div className="flex items-center gap-2 p-5 pb-0">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          <BookOpen className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-bold">Learn Today</h3>
      </div>

      <Link to={`/knowledge/${article.slug}`} className="group block p-5">
        {article.cover_image && (
          <div className="mb-4 h-32 w-full overflow-hidden rounded-2xl">
            <img
              src={article.cover_image}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <h4 className="text-base font-black leading-snug group-hover:text-primary transition-colors">
          {article.title}
        </h4>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-muted-foreground">
            {article.read_time_minutes} min read
          </span>
          <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-primary">
            Read <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </Link>
    </div>
  );
}

export default React.memo(LearnTodayCard);
