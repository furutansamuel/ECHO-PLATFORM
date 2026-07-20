import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Loader2, Trash2, ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';
import type { FAQItem } from '@/types/reports';

export default function AdminFAQPage() {
  const { user } = useAuth();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [adding, setAdding] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchFaqs = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('display_order', { ascending: true });
    setLoading(false);
    if (error) {
      toast.error('Failed to load FAQs: ' + error.message);
      return;
    }
    setFaqs((data as FAQItem[]) || []);
  };

  useEffect(() => { fetchFaqs(); }, []);

  const addFaq = async () => {
    if (!supabase || !user) return;
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error('Both a question and an answer are required.');
      return;
    }
    setAdding(true);
    const nextOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.display_order)) + 1 : 0;
    const { error } = await supabase.from('faqs').insert({
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      display_order: nextOrder,
      created_by: user.id,
    });
    setAdding(false);
    if (error) {
      toast.error('Failed to add FAQ: ' + error.message);
      return;
    }
    setNewQuestion('');
    setNewAnswer('');
    toast.success('FAQ added.');
    fetchFaqs();
  };

  const updateFaq = async (id: string, patch: Partial<FAQItem>) => {
    if (!supabase) return;
    setSavingId(id);
    const { error } = await supabase.from('faqs').update(patch).eq('id', id);
    setSavingId(null);
    if (error) {
      toast.error('Failed to update: ' + error.message);
      return;
    }
    fetchFaqs();
  };

  const deleteFaq = async (faq: FAQItem) => {
    if (!supabase) return;
    if (!confirm(`Delete "${faq.question}"?`)) return;
    const { error } = await supabase.from('faqs').delete().eq('id', faq.id);
    if (error) {
      toast.error('Failed to delete: ' + error.message);
      return;
    }
    toast.success('FAQ deleted.');
    fetchFaqs();
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = faqs[index + direction];
    const current = faqs[index];
    if (!target) return;
    // Swap display_order values so the public page (sorted by
    // display_order) reflects the new sequence.
    updateFaq(current.id, { display_order: target.display_order });
    updateFaq(target.id, { display_order: current.display_order });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">FAQ Manager</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage questions shown on the public FAQ page.</p>
      </div>

      <div className="card-premium p-4 space-y-3">
        <p className="text-sm font-semibold">Add a new FAQ</p>
        <Input placeholder="Question" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
        <Textarea placeholder="Answer" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} rows={3} />
        <Button onClick={addFaq} disabled={adding} className="btn-glow">
          {adding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          Add FAQ
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card-premium p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : faqs.length === 0 ? (
        <p className="text-center text-muted-foreground py-12 text-sm flex flex-col items-center gap-2">
          <HelpCircle className="h-6 w-6" /> No FAQs yet — add your first one above.
        </p>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={faq.id} className="card-premium p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <Input
                  value={faq.question}
                  onChange={(e) => setFaqs((prev) => prev.map((f) => f.id === faq.id ? { ...f, question: e.target.value } : f))}
                  onBlur={(e) => updateFaq(faq.id, { question: e.target.value })}
                  className="font-semibold"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => move(i, -1)} disabled={i === 0}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => move(i, 1)} disabled={i === faqs.length - 1}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteFaq(faq)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={faq.answer}
                onChange={(e) => setFaqs((prev) => prev.map((f) => f.id === faq.id ? { ...f, answer: e.target.value } : f))}
                onBlur={(e) => updateFaq(faq.id, { answer: e.target.value })}
                rows={2}
                className="text-sm text-muted-foreground"
              />
              <div className="flex items-center gap-2">
                <Switch checked={faq.is_visible} onCheckedChange={(checked) => updateFaq(faq.id, { is_visible: checked })} />
                <span className="text-xs text-muted-foreground">{faq.is_visible ? 'Visible on site' : 'Hidden'}</span>
                {savingId === faq.id && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground ml-2" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
