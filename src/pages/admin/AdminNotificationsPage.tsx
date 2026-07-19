import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Loader2, Send, Users, ClipboardList, BrainCircuit, AlertTriangle, Calendar, Award } from 'lucide-react';

const AUDIENCES = [
  { value: 'everyone', label: 'Everyone' },
  { value: 'citizen', label: 'Citizens only' },
  { value: 'volunteer', label: 'Volunteers only' },
  { value: 'administrator', label: 'Administrators only' },
];

const TYPES = [
  { value: 'alert', label: 'Alert', icon: AlertTriangle },
  { value: 'report', label: 'Report Update', icon: ClipboardList },
  { value: 'ai', label: 'AI Insight', icon: BrainCircuit },
  { value: 'event', label: 'Event', icon: Calendar },
  { value: 'reward', label: 'Reward', icon: Award },
];

export default function AdminNotificationsPage() {
  const [audience, setAudience] = useState('everyone');
  const [type, setType] = useState('alert');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!supabase) return;
    if (!title.trim() || !message.trim()) {
      toast.error('Both a title and a message are required.');
      return;
    }
    if (!confirm(`Send this notification to ${AUDIENCES.find(a => a.value === audience)?.label}?`)) return;

    setSending(true);
    const { data, error } = await supabase.rpc('send_broadcast_notification', {
      target_role: audience,
      notif_title: title.trim(),
      notif_message: message.trim(),
      notif_type: type,
    });
    setSending(false);

    if (error) {
      toast.error('Failed to send: ' + error.message);
      return;
    }
    toast.success(`Sent to ${data} recipient${data === 1 ? '' : 's'}.`);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">Notifications Manager</h1>
        <p className="text-muted-foreground text-sm mt-1">Send a notification to citizens, volunteers, or everyone.</p>
      </div>

      <div className="card-premium p-6 space-y-4">
        <div>
          <Label>Audience</Label>
          <Select value={audience} onValueChange={setAudience}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {AUDIENCES.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  <span className="flex items-center gap-2"><Users className="h-3.5 w-3.5" />{a.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  <span className="flex items-center gap-2"><t.icon className="h-3.5 w-3.5" />{t.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Heavy rainfall expected this weekend" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Write the notification message..." className="mt-1" />
        </div>

        <Button onClick={handleSend} disabled={sending} className="w-full btn-glow">
          {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
          Send Notification
        </Button>
      </div>
    </div>
  );
}
