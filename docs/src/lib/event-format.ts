export const formatEventDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });

export const formatEventDateShort = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });

export const formatEventTime = (timeStr?: string) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${m} ${period}`;
};

export const volunteerProgress = (registered: number, max?: number) =>
  max ? Math.min(100, Math.round((registered / max) * 100)) : null;
