import React from 'react';
import { Cookie } from 'lucide-react';
import { LegalPageLayout } from './LegalPageLayout';

export default function CookiePolicy() {
  return (
    <LegalPageLayout
      icon={Cookie}
      title="Cookie Policy"
      description="What cookies and similar technologies ECHO uses, and why."
      lastUpdated="July 2026"
      intro={
        <p>
          ECHO uses a small number of cookies and browser storage technologies to keep you
          signed in, remember your preferences, and understand how the platform is used so we can
          improve it.
        </p>
      }
      sections={[
        {
          heading: '1. What Are Cookies?',
          body: (
            <p>
              Cookies are small text files stored on your device by your browser. Similar
              technologies, like local storage, work the same way — they let a website remember
              information between visits.
            </p>
          ),
        },
        {
          heading: '2. How ECHO Uses Cookies',
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Essential cookies</strong> — required for authentication (keeping you
                signed in) and core functionality, via Supabase Auth. Without these, you wouldn't
                be able to log in or submit reports.
              </li>
              <li>
                <strong>Preference cookies</strong> — remember settings such as your selected
                region or display preferences.
              </li>
              <li>
                <strong>Analytics</strong> — help us understand which features are used and where
                the platform can be improved. We aim to keep this minimal and privacy-respecting.
              </li>
            </ul>
          ),
        },
        {
          heading: '3. Third-Party Services',
          body: (
            <p>
              Some features rely on third-party infrastructure — for example, map tiles for the
              interactive map, and Supabase for authentication and data storage. These providers
              may set their own cookies or use similar technologies as part of delivering their
              service to us.
            </p>
          ),
        },
        {
          heading: '4. Managing Cookies',
          body: (
            <p>
              Most browsers let you control or delete cookies through their settings. Blocking
              essential cookies will likely prevent you from signing in or using core ECHO
              features, since authentication depends on them.
            </p>
          ),
        },
        {
          heading: '5. Changes to This Policy',
          body: (
            <p>
              As ECHO adds new features, this policy may be updated. Check back here for the
              latest version — the date at the top reflects the most recent update.
            </p>
          ),
        },
        {
          heading: '6. Contact Us',
          body: (
            <p>
              Questions about cookies on ECHO? Reach out through our{' '}
              <a href="/contact" className="text-primary underline underline-offset-4">
                Contact page
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}

