import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { uploadImage } from '@/lib/storage-upload';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Loader2, ArrowLeft, ImagePlus, ImageDown } from 'lucide-react';
import type { KnowledgeArticle } from '@/types/reports';

const CATEGORIES = [
  'Flood Prevention', 'Waste Management', 'Recycling', 'Environmental Health',
  'Climate Change', 'Water Conservation', 'Air Quality', 'Community Sanitation',
];

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

export default function AdminKnowledgeEditorPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [embedUploading, setEmbedUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    if (!isEdit || !supabase) return;
    (async () => {
      const { data, error } = await supabase
  .from('knowledge_articles')
  .select('*')
  .eq('id', id)
  .single();
      setLoading(false);
      if (error || !data) {
        toast.error('Could not load this article.');
        navigate('/admin/knowledge');
        return;
      }
      const article = data as KnowledgeArticle;
      setTitle(article.title);
      setSlug(article.slug);
      setSlugTouched(true);
      setExcerpt(article.excerpt);
      setContent(article.content);
      setCoverImage(article.cover_image);
      setCategory(article.category);
      setTagsInput((article.tags || []).join(', '));
      setStatus(article.status === 'archived' ? 'draft' : article.status);
      setIsFeatured(article.is_featured);
    })();
  }, [id, isEdit, navigate]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setCoverUploading(true);
    const { url, error } = await uploadImage('article-images', file, user.id);
    setCoverUploading(false);
    if (error) { toast.error(error); return; }
    setCoverImage(url || undefined);
    e.target.value = '';
  };

  // Uploads an image and inserts a markdown image tag at the cursor
  // position in the content textarea — the simplest possible "embed an
  // image in the article" flow without pulling in a full rich text
  // editor, which the roadmap explicitly defers to Phase 2.
  const handleEmbedSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setEmbedUploading(true);
    const { url, error } = await uploadImage('article-images', file, user.id);
    setEmbedUploading(false);
    if (error) { toast.error(error); return; }

    const textarea = contentRef.current;
    const insertion = `\n\n![${file.name}](${url})\n\n`;
    if (textarea) {
      const pos = textarea.selectionStart ?? content.length;
      const newContent = content.slice(0, pos) + insertion + content.slice(pos);
      setContent(newContent);
    } else {
      setContent((c) => c + insertion);
    }
    e.target.value = '';
  };

  const handleSave = async (publish?: boolean) => {
    if (!supabase || !user) return;
    if (!title.trim() || !slug.trim() || !excerpt.trim() || !content.trim()) {
      toast.error('Title, slug, excerpt, and content are all required.');
      return;
    }

    setSaving(true);
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const finalStatus = publish === undefined ? status : (publish ? 'published' : 'draft');
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.round(wordCount / 200));

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content,
      cover_image: coverImage || null,
      category,
      tags,
      status: finalStatus,
      is_featured: isFeatured,
      read_time_minutes: readTime,
      published_at: finalStatus === 'published' ? new Date().toISOString() : null,
    };

    const { error } = isEdit
      ? await supabase.from('knowledge_articles').update(payload).eq('id', id)
      : await supabase.from('knowledge_articles').insert({ ...payload, view_count: 0 });

    setSaving(false);
    if (error) {
      toast.error('Failed to save article: ' + error.message);
      return;
    }
    toast.success(isEdit ? 'Article updated.' : 'Article created.');
    navigate('/admin/knowledge');
  };

  if (loading) {
    return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 md:p-6">
      <button onClick={() => navigate('/admin/knowledge')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Knowledge Centre
      </button>

      <h1 className="text-3xl font-display font-bold text-primary">{isEdit ? 'Edit Article' : 'New Article'}</h1>

      <div className="space-y-4">
        <div>
          <Label>Cover Image</Label>
          <div className="mt-2 aspect-video bg-muted rounded-lg overflow-hidden relative border">
            {coverImage ? (
              <img src={coverImage} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No cover image yet</div>
            )}
            {coverUploading && (
              <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}
          </div>
          <label className="mt-2 inline-flex items-center gap-2 text-sm text-primary cursor-pointer hover:underline">
            <ImagePlus className="h-4 w-4" /> {coverImage ? 'Change cover image' : 'Upload cover image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
          </label>
        </div>

        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. Understanding Flood Risk in Lafia" />
        </div>

        <div>
          <Label htmlFor="slug">URL Slug</Label>
          <Input id="slug" value={slug} onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }} />
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} placeholder="A short one-line summary shown in article previews" />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="content">Content</Label>
            <label className="inline-flex items-center gap-1.5 text-xs text-primary cursor-pointer hover:underline">
              {embedUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageDown className="h-3.5 w-3.5" />}
              Insert image
              <input type="file" accept="image/*" className="hidden" onChange={handleEmbedSelect} disabled={embedUploading} />
            </label>
          </div>
          <Textarea
            id="content"
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            placeholder="Write the article here. Use the 'Insert image' link above to embed photos at the cursor position."
            className="font-mono text-sm"
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Plain text/markdown for now — a full rich text editor is planned for Phase 2.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="flooding, drainage, safety" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4" />
          Feature this article
        </label>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={() => handleSave(false)} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Save as Draft
          </Button>
          <Button className="flex-1 btn-glow" onClick={() => handleSave(true)} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
