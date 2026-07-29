/**
 * ECHO — canonical status colour map.
 *
 * Single source of truth so the same status never appears in two different
 * colours on two different screens.
 *
 *   Verified / Resolved / Closed  -> green  (safe)
 *   Pending / Submitted / In Progress / Assigned -> amber (warning)
 *   Under Review / Pending Verification -> blue (info)
 *   Rejected -> red (danger)
 *   Draft / Cancelled / Archived -> grey (muted)
 *
 * Tones map onto the `.beacon-badge--*` classes in index.css, which in turn
 * read only design tokens (--status-safe, --status-warning, --status-danger,
 * --info, --muted-foreground). No component should hardcode a status colour.
 */

export type StatusTone = 'safe' | 'warning' | 'danger' | 'info' | 'muted';

const STATUS_TONES: Record<string, StatusTone> = {
  // Report lifecycle
  draft: 'muted',
  submitted: 'warning',
  pending: 'warning',
  'pending verification': 'info',
  'under review': 'info',
  reviewing: 'info',
  verified: 'safe',
  assigned: 'warning',
  'in progress': 'warning',
  resolved: 'safe',
  closed: 'safe',
  rejected: 'danger',
  cancelled: 'muted',
  canceled: 'muted',

  // Content / events
  published: 'safe',
  active: 'safe',
  upcoming: 'info',
  ongoing: 'warning',
  completed: 'safe',
  archived: 'muted',
  registered: 'safe',
  waitlisted: 'warning',
  expired: 'muted',
};

/** Resolve any status label (case-insensitive) to its canonical tone. */
export function statusTone(status: string | null | undefined): StatusTone {
  if (!status) return 'muted';
  return STATUS_TONES[status.trim().toLowerCase()] ?? 'muted';
}

/** Full badge class for a status pill. */
export function statusBadgeClass(status: string | null | undefined): string {
  return `beacon-badge beacon-badge--${statusTone(status)}`;
}

/** Tone -> literal utility classes. Spelled out so Tailwind can see them. */
export const TONE_CLASSES: Record<StatusTone, { text: string; dot: string; soft: string; solid: string }> = {
  safe: {
    text: 'text-status-safe',
    dot: 'bg-status-safe',
    soft: 'bg-status-safe/10 text-status-safe border-status-safe/30',
    solid: 'bg-status-safe text-primary-foreground border-status-safe',
  },
  warning: {
    text: 'text-status-warning',
    dot: 'bg-status-warning',
    soft: 'bg-status-warning/10 text-status-warning border-status-warning/30',
    solid: 'bg-status-warning text-warning-foreground border-status-warning',
  },
  danger: {
    text: 'text-status-danger',
    dot: 'bg-status-danger',
    soft: 'bg-status-danger/10 text-status-danger border-status-danger/30',
    solid: 'bg-status-danger text-destructive-foreground border-status-danger',
  },
  info: {
    text: 'text-info',
    dot: 'bg-info',
    soft: 'bg-info/10 text-info border-info/30',
    solid: 'bg-info text-info-foreground border-info',
  },
  muted: {
    text: 'text-muted-foreground',
    dot: 'bg-muted-foreground',
    soft: 'bg-muted text-muted-foreground border-border',
    solid: 'bg-muted-foreground text-background border-muted-foreground',
  },
};

/** Convenience: classes for a status directly. */
export function statusClasses(status: string | null | undefined) {
  return TONE_CLASSES[statusTone(status)];
}
