import React, { useEffect, useState } from 'react';
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
import { Loader2, ArrowLeft, ImagePlus } from 'lucide-react';
import type { EventRecord } from '@/types/reports';

const CATEGORIES = ['Cleanup', 'Tree Planting', 'Workshop', 'Awareness Campaign', 'Other'];

export default function AdminEventEditorPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cleanup');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [maxVolunteers, setMaxVolunteers] = useState('');
  const [status, setStatus] = useState('upcoming');

  useEffect(() => {
    if (!isEdit || !supabase) return;
    (async () => {
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
      setLoading(false);
      if (error || !data) {
        toast.error('Could not load this event.');
        navigate('/admin/events');
        return;
      }
      const event = data as EventRecord;
      setTitle(event.title);
      setDescription(event.description);
      setCategory(event.category);
      setEventDate(event.event_date);
      setStartTime(event.start_time);
      setEndTime(event.end_time || '');
      setLocationName(event.location_name);
      setLocationAddress(event.location_address || '');
      setMaxVolunteers(event.max_volunteers ? String(event.max_volunteers) : '');
      setStatus(event.status);
      setImageUrl(event.image_url);
    })();
  }, [id, isEdit, navigate]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setImageUploading(true);
    const { url, error } = await uploadImage('event-images', file, user.id);
    setImageUploading(false);
    if (error) {
      toast.error(error);
      return;
    }
    setImageUrl(url || undefined);
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!supabase || !user) return;
    if (!title.trim() || !description.trim() || !eventDate || !startTime || !locationName.trim()) {
      toast.error('Title, description, date, start time, and location are required.');
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      description: description.trim(),
      image_url: imageUrl || null,
      category,
      event_date: eventDate,
      start_time: startTime,
      end_time: endTime || null,
      location_name: locationName.trim(),
      location_address: locationAddress.trim() || null,
      max_volunteers: maxVolunteers ? parseInt(maxVolunteers, 10) : null,
      status,
    };

    const { error } = isEdit
      ? await supabase.from('events').update(payload).eq('id', id)
      : await supabase.from('events').insert({ ...payload, created_by: user.id });

    setSaving(false);
    if (error) {
      toast.error('Failed to save event: ' + error.message);
      return;
    }
    toast.success(isEdit ? 'Event updated.' : 'Event created.');
    navigate('/admin/events');
  };

  if (loading) {
    return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 md:p-6">
      <button onClick={() => navigate('/admin/events')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </button>

      <h1 className="text-3xl font-display font-bold text-primary">{isEdit ? 'Edit Event' : 'New Event'}</h1>

      <div className="space-y-4">
        <div>
          <Label>Banner Image</Label>
          <div className="mt-2 aspect-video bg-muted rounded-lg overflow-hidden relative border">
            {imageUrl ? (
              <img src={imageUrl} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                No image yet
              </div>
            )}
            {imageUploading && (
              <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}
          </div>
          <label className="mt-2 inline-flex items-center gap-2 text-sm text-primary cursor-pointer hover:underline">
            <ImagePlus className="h-4 w-4" /> {imageUrl ? 'Change image' : 'Upload image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
          </label>
        </div>

        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Lafia Riverbank Cleanup" />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
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
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['upcoming', 'ongoing', 'completed', 'cancelled'].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="start">Start Time</Label>
            <Input id="start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="end">End Time</Label>
            <Input id="end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>

        <div>
          <Label htmlFor="locName">Location Name</Label>
          <Input id="locName" value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="e.g. Shabu Riverbank" />
        </div>

        <div>
          <Label htmlFor="locAddr">Full Address (optional)</Label>
          <Input id="locAddr" value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="maxVol">Max Volunteers (optional)</Label>
          <Input id="maxVol" type="number" min={1} value={maxVolunteers} onChange={(e) => setMaxVolunteers(e.target.value)} />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full btn-glow">
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {isEdit ? 'Save Changes' : 'Create Event'}
        </Button>
      </div>
    </div>
  );
}
