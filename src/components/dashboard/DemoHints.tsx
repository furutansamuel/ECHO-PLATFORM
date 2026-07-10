import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useDemo, type DemoHint } from '@/hooks/use-demo';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

const DEMO_HINTS: DemoHint[] = [
  {
    id: 'welcome',
    title: 'Welcome to ECHO Demo',
    message: 'Explore our AI-powered Environmental Intelligence Platform with pre-seeded data.',
    route: '/dashboard',
  },
  {
    id: 'intelligence',
    title: 'View Environmental Intelligence',
    message: 'Check the AI Environmental Forecast and health scores on your dashboard.',
    route: '/dashboard',
  },
  {
    id: 'community-health',
    title: 'Explore Community Health',
    message: 'Visit Community Health to see detailed environmental analysis for your area.',
    route: '/community-health',
  },
  {
    id: 'ai-recommendations',
    title: 'Check AI Recommendations',
    message: 'The AI Intelligence page provides actionable environmental insights.',
    route: '/ai-intelligence',
  },
  {
    id: 'join-campaign',
    title: 'Join a Campaign',
    message: 'Community Insights shows active campaigns you can participate in.',
    route: '/community-insights',
  },
  {
    id: 'view-impact',
    title: 'View Community Impact',
    message: 'Track your Impact Points and achievements in the Impact Center.',
    route: '/rewards',
  },
];

export function DemoHints() {
  const { isDemoMode, dismissedHints, dismissHint } = useDemo();
const { user } = useAuth();
const location = useLocation();
  const [hintIndex, setHintIndex] = useState(0);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  useEffect(() => {
  if (!isDemoMode || user) return;

    // Show welcome hint once on first dashboard visit
    if (!hasShownWelcome && location.pathname === '/dashboard') {
      const welcomeHint = DEMO_HINTS[0];
      if (!dismissedHints.includes(welcomeHint.id)) {
        toast(welcomeHint.message, {
          description: welcomeHint.title,
          duration: 5000,
          action: {
            label: 'Got it',
            onClick: () => dismissHint(welcomeHint.id),
          },
        });
        setHasShownWelcome(true);
      }
    }
  }, [isDemoMode, location.pathname, hasShownWelcome, dismissedHints, dismissHint]);

  // Show contextual hints based on current route
  useEffect(() => {
  if (!isDemoMode || user) return;

    const currentHint = DEMO_HINTS.find(
      (h) => h.route === location.pathname && !dismissedHints.includes(h.id) && h.id !== 'welcome'
    );

    if (currentHint) {
      const timer = setTimeout(() => {
        toast(currentHint.message, {
          description: currentHint.title,
          duration: 4000,
          action: {
            label: 'Dismiss',
            onClick: () => dismissHint(currentHint.id),
          },
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isDemoMode, location.pathname, dismissedHints, dismissHint]);

  return null; // Hints are toast-based, no visual rendering needed
}
