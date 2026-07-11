import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { LegalPageLayout } from './LegalPageLayout';

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout
      icon={ShieldCheck}
      title="Privacy Policy"
      description="How ECHO collects, uses, and protects your information as a citizen-owned, government-partnered environmental intelligence platform."
      lastUpdated="July 2026"
      intro={
        <p>
          ECHO (Environmental Community Health Observatory) is built to turn environmental
          complaints into environmental intelligence. Doing that responsibly means being clear
          about what data we collect from you, why we collect it, and how it's protected. This
          policy explains that in plain language.
        </p>
      }
      sections={[
        {
          heading: '1. Information We Collect',
          body: (
            <>
              <p>When you use ECHO, we may collect:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Account information</strong> — name, email address, region, and
                  organization, provided when you register.
                </li>
                <li>
                  <strong>Report data</strong> — hazard reports you submit, including photos,
                  location, severity, and description.
                </li>
                <li>
                  <strong>Usage data</strong> — pages visited, features used, and general device
                  information, collected to improve the platform.
                </li>
                <li>
                  <strong>Location data</strong> — only when you choose to attach a location to a
                  report or use the interactive map with location enabled.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: '2. How We Use Your Information',
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>To operate core features: hazard reporting, the interactive map, AI insights, and community health scoring.</li>
              <li>To share verified, aggregated environmental data with partner government agencies for response and action.</li>
              <li>To recognize and reward community contributions through the rewards and impact system.</li>
              <li>To communicate updates about reports you've submitted or community activity you've joined.</li>
              <li>To improve platform reliability, security, and performance.</li>
            </ul>
          ),
        },
        {
          heading: '3. Data Storage & Security',
          body: (
            <p>
              Your data is stored using Supabase, a secure hosted database and authentication
              provider. We apply reasonable technical and organizational measures — including
              access controls and encrypted connections — to protect your information. No system
              is perfectly secure, and we continually work to strengthen our safeguards as ECHO
              grows.
            </p>
          ),
        },
        {
          heading: '4. Sharing With Government Partners',
          body: (
            <p>
              Part of ECHO's mission is government collaboration: structured, verified hazard
              data helps agencies respond faster. When report data is shared with partner
              agencies, it is shared as aggregated or verified incident data intended to support
              public response — not sold to third parties for advertising or unrelated commercial
              use.
            </p>
          ),
        },
        {
          heading: '5. Your Choices & Rights',
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>You can review and update your profile information at any time from your account settings.</li>
              <li>You can request deletion of your account and associated personal data by contacting us.</li>
              <li>You can choose not to attach location data to a report; some map-based features may be limited as a result.</li>
            </ul>
          ),
        },
        {
          heading: '6. Changes to This Policy',
          body: (
            <p>
              As ECHO develops, this policy may be updated to reflect new features or legal
              requirements. We'll update the "Last updated" date above whenever changes are made,
              and significant changes will be communicated within the platform.
            </p>
          ),
        },
        {
          heading: '7. Contact Us',
          body: (
            <p>
              Questions about this policy or how your data is handled? Reach out through our{' '}
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
