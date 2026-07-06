import { useEffect } from 'react';

const SITE_NAME = 'ECHO';
const DEFAULT_DESCRIPTION =
  'An AI-powered environmental intelligence platform that enables users to report, monitor, and respond to environmental hazards in real time.';

/**
 * Sets document.title and the meta-description tag for the current page,
 * then restores the site-wide defaults on unmount.
 *
 * This app is a client-rendered SPA with a single static index.html, so
 * every route previously shared one hardcoded <title>/description no
 * matter which page was open. This hook is the minimal fix for that:
 * no new dependency (react-helmet, etc.) needed since we only ever have
 * one page mounted at a time in a router.
 */
export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    const descriptionTag = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionTag?.getAttribute('content') ?? DEFAULT_DESCRIPTION;
    if (descriptionTag && description) {
      descriptionTag.setAttribute('content', description);
    }

    return () => {
      document.title = previousTitle;
      if (descriptionTag) {
        descriptionTag.setAttribute('content', previousDescription);
      }
    };
  }, [title, description]);
}
