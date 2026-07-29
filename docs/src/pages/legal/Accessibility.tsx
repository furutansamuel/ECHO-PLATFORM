import React from 'react';
import { Accessibility as AccessibilityIcon } from 'lucide-react';
import { LegalPageLayout } from './LegalPageLayout';

export default function Accessibility() {
  return (
    <LegalPageLayout
      icon={AccessibilityIcon}
      title="Accessibility"
      description="Our commitment to making ECHO usable by everyone, including citizens using assistive technology or low-bandwidth mobile connections."
      lastUpdated="July 2026"
      intro={
        <p>
          ECHO exists to serve entire communities — that only works if the platform is genuinely
          usable by everyone in that community, including people with disabilities and people on
          low-end devices or unreliable mobile data.
        </p>
      }
      sections={[
        {
          heading: '1. Our Commitment',
          body: (
            <p>
              We aim to align ECHO with the Web Content Accessibility Guidelines (WCAG) 2.1 at
              Level AA where practical, and to keep improving as the platform grows. This includes
              sufficient color contrast, keyboard-navigable interfaces, and readable text at
              standard zoom levels.
            </p>
          ),
        },
        {
          heading: '2. Built for Real-World Conditions',
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>ECHO is designed to remain usable on mobile-data-only connections, common across many of the communities we serve.</li>
              <li>Core actions — reporting a hazard, viewing the map, checking community health — are prioritized to work reliably on mid-range Android devices.</li>
              <li>Motion and animation are reduced automatically for users with "reduce motion" enabled in their device settings.</li>
            </ul>
          ),
        },
        {
          heading: '3. Known Limitations',
          body: (
            <p>
              ECHO is an actively developed platform, and not every screen has been fully audited
              for accessibility yet. Some data-heavy views — like the interactive map and analytics
              dashboards — are harder to make fully screen-reader friendly, and we're working on
              that incrementally.
            </p>
          ),
        },
        {
          heading: '4. Feedback',
          body: (
            <p>
              If you encounter an accessibility barrier anywhere on ECHO, please tell us. Real
              feedback from real users is the fastest way we improve this — reach out through our{' '}
              <a href="/contact" className="text-primary underline underline-offset-4">
                Contact page
              </a>{' '}
              and describe what you ran into and what device/browser you were using.
            </p>
          ),
        },
      ]}
    />
  );
}
