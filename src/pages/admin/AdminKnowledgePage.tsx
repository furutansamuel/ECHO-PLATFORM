import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Pencil, Trash2, BookOpen, Eye } from 'lucide-react';
import type { KnowledgeArticle } from '@/types/reports';

export default function AdminKnowledgePage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (error) {
      toast.error('Failed to load articles: ' + error.message);
      return;
    }
    setArticles((data as KnowledgeArticle[]) || []);
  };

  useEffect(() => { fetchArticles(); }, []);

  const deleteArticle = async (article: KnowledgeArticle) => {
    if (!supabase) return;
    if (!confirm(`Delete "${article.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('articles').delete().eq('id', article.id);
    if (error) {
      toast.error('Failed to delete article: ' + error.message);
      return;
    }
    toast.success('Article deleted.');
    fetchArticles();
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Knowledge Centre</h1>
          <p className="text-muted-foreground text-sm mt-1">Create and publish articles and announcements.</p>
        </div>
        <Button asChild className="btn-glow">
          <Link to="/admin/knowledge/new"><Plus className="h-4 w-4 mr-2" />New Article</Link>
        </Button>
      </div>

      {loading ? (
        <div className="rounded-xl border overflow-hidden divide-y">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-4 flex-1 max-w-xs" />
              <Skeleton className="h-4 w-28 hidden sm:block" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-10 ml-auto" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <p className="text-center text-muted-foreground py-16 text-sm">No articles yet — write your first one.</p>
      ) : (
        <div className="rounded-xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium max-w-[280px] truncate flex items-center gap-2">
                    {article.cover_image ? (
                      <img src={article.cover_image} className="h-8 w-8 rounded object-cover shrink-0" />
                    ) : (
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    )}
                    {article.title}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{article.category}</td>
                  <td className="px-4 py-3">
                    <span className={`beacon-badge beacon-badge--${article.status === 'published' ? 'safe' : article.status === 'archived' ? 'danger' : 'warning'}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {article.view_count ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/admin/knowledge/${article.id}/edit`}><Pencil className="h-3.5 w-3.5 mr-1.5" />Edit</Link>
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive" onClick={() => deleteArticle(article)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
