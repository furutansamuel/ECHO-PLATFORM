import React from 'react';
import { FileText } from 'lucide-react';
import { LegalPageLayout } from './LegalPageLayout';

export default function TermsOfService() {
  return (
    <LegalPageLayout
      icon={FileText}
      title="Terms of Service"
      description="The rules for using ECHO — please read these before you report a hazard, join the community, or use our AI intelligence tools."
      lastUpdated="July 2026"
      intro={
        <p>
          By creating an account or using ECHO, you agree to these terms. ECHO exists to help
          citizens, communities, and government partners build a cleaner, healthier environment
          together — these terms keep that mission workable for everyone.
        </p>
      }
      sections={[
        {
          heading: '1. Using ECHO',
          body: (
            <p>
              You must be able to form a legally binding agreement to create an account. You're
              responsible for the accuracy of the information you provide and for keeping your
              account credentials secure. You agree not to use ECHO for any unlawful purpose or in
              a way that could harm the platform, other users, or the communities we serve.
            </p>
          ),
        },
        {
          heading: '2. Hazard Reports & Content',
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Reports should be made in good faith and reflect real, observed environmental hazards to the best of your knowledge.</li>
              <li>False, malicious, or knowingly misleading reports may result in account suspension.</li>
              <li>By submitting a report (including photos and descriptions), you grant ECHO a license to use, display, and share that content — including with government partners — for the purpose of environmental monitoring and response.</li>
              <li>You retain ownership of the content you submit.</li>
            </ul>
          ),
        },
        {
          heading: '3. Community Conduct',
          body: (
            <p>
              ECHO is a shared civic space. Harassment, hate speech, spam, or attempts to
              manipulate the reporting or rewards system are not permitted and may lead to
              content removal or account suspension.
            </p>
          ),
        },
        {
          heading: '4. AI-Generated Insights',
          body: (
            <p>
              ECHO's AI Environmental Intelligence features — including hotspot detection, risk
              prediction, and community health scoring — are decision-support tools, not a
              substitute for official emergency services or professional environmental
              assessment. In an emergency, always contact local emergency services directly.
            </p>
          ),
        },
        {
          heading: '5. Rewards & Community Impact',
          body: (
            <p>
              Points and recognition earned through the rewards system reflect community
              contribution and do not constitute monetary value or a financial instrument unless
              explicitly stated otherwise within the platform.
            </p>
          ),
        },
        {
          heading: '6. Availability & Changes',
          body: (
            <p>
              ECHO is an actively developed platform. Features may be added, changed, or removed
              as the product evolves, and we'll do our best to communicate significant changes.
              We don't guarantee uninterrupted availability of the service.
            </p>
          ),
        },
        {
          heading: '7. Limitation of Liability',
          body: (
            <p>
              ECHO is provided "as is." To the fullest extent permitted by law, ECHO and its
              contributors are not liable for damages arising from your use of the platform,
              including reliance on AI-generated insights or community-submitted reports.
            </p>
          ),
        },
        {
          heading: '8. Contact Us',
          body: (
            <p>
              Questions about these terms? Reach out through our{' '}
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
