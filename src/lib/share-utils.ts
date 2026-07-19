import { toast } from 'sonner';

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

/** Opens a share-intent URL in a new tab. These are the standard,
 * no-API-key-required share endpoints each platform provides — not a
 * proper SDK integration, but genuinely functional (unlike the previous
 * "Share functionality initialized" toast that did nothing). */
export function shareToWhatsApp({ text, url }: ShareData) {
  const message = encodeURIComponent(`${text}\n${url}`);
  window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer');
}

export function shareToFacebook({ url }: ShareData) {
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    '_blank',
    'noopener,noreferrer'
  );
}

export function shareToX({ text, url }: ShareData) {
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    '_blank',
    'noopener,noreferrer'
  );
}

export function shareByEmail({ title, text, url }: ShareData) {
  const subject = encodeURIComponent(title);
  const body = encodeURIComponent(`${text}\n\n${url}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

export async function copyShareLink({ url }: ShareData) {
  try {
    await navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  } catch {
    toast.error('Could not copy link — your browser may be blocking clipboard access.');
  }
}

/** Uses the native share sheet on supporting devices (most mobile
 * browsers); falls back to copying the link on desktop browsers that
 * don't implement the Web Share API. */
export async function nativeOrFallbackShare(data: ShareData) {
  if (navigator.share) {
    try {
      await navigator.share(data);
    } catch {
      // User cancelled the share sheet — not an error, do nothing.
    }
  } else {
    await copyShareLink(data);
  }
}

/** Builds a plain-text file and triggers a browser download — a real,
 * dependency-free "download receipt" rather than a proper PDF (no PDF
 * library is currently in this project, and this wasn't actually part
 * of the Phase 1 roadmap checklist). */
export function downloadTextReceipt(filename: string, lines: string[]) {
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
