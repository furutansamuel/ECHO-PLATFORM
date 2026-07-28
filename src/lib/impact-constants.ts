import type { ImpactLevel, AchievementBadge, TrustLevel } from '@/types/impact';

// ECHO Impact Framework — Level system.
// "ECHO doesn't reward activity. ECHO rewards environmental impact."
// Level reflects long-term, overall contribution (currently approximated
// from Eco Points; it stays a separate concept from Reputation/Trust below).
export const IMPACT_LEVELS: ImpactLevel[] = [
  {
    id: 1,
    name: 'Eco Starter',
    emoji: '🌱',
    minPoints: 0,
    maxPoints: 499,
    description: 'Just starting your environmental journey',
  },
  {
    id: 2,
    name: 'Eco Explorer',
    emoji: '🌿',
    minPoints: 500,
    maxPoints: 1499,
    description: 'Building a habit of environmental reporting',
  },
  {
    id: 3,
    name: 'Community Guardian',
    emoji: '🌳',
    minPoints: 1500,
    maxPoints: 3499,
    description: 'Actively protecting your community',
  },
  {
    id: 4,
    name: 'Environmental Champion',
    emoji: '🦅',
    minPoints: 3500,
    maxPoints: 7499,
    description: 'A leading force for environmental change',
  },
  {
    id: 5,
    name: 'ECHO Ambassador',
    emoji: '🌍',
    minPoints: 7500,
    maxPoints: Infinity,
    description: 'A trusted, long-term guardian of your community',
  },
];

// Reputation — trust, not redeemable. Independent from Eco Points and Level.
// Increases with verified reports, resolutions, cleanup participation and
// helpful behaviour; decreases with confirmed spam, duplicates, or repeated
// rejected reports. AI never sets this directly — only confirmed moderation
// decisions do ("AI assists. Humans decide.").
export const TRUST_LEVELS: TrustLevel[] = [
  { id: 1, name: 'New Reporter', minReputation: 0, maxReputation: 24, description: 'Building a track record' },
  { id: 2, name: 'Reliable Reporter', minReputation: 25, maxReputation: 74, description: 'Consistently accurate reports' },
  { id: 3, name: 'Trusted Community Reporter', minReputation: 75, maxReputation: 149, description: 'A dependable, verified voice in the community' },
  { id: 4, name: 'Senior Community Reporter', minReputation: 150, maxReputation: Infinity, description: 'Sustained, high-trust contribution over time' },
];

// Achievement Badge catalog. earned/earnedDate are never stored here — they
// are always derived at render time from a user's real Eco Points (see
// RewardsPage.tsx / ProfilePage.tsx), since there is no per-badge tracking
// table yet.
export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'verified-contributor',
    name: 'Verified Contributor',
    emoji: '✅',
    description: 'Have 5 reports verified by the community',
    pointsRequired: 500,
  },
  {
    id: 'cleanup-champion',
    name: 'Cleanup Champion',
    emoji: '🧹',
    description: 'Join 3 cleanup events',
    pointsRequired: 300,
  },
  {
    id: 'community-volunteer',
    name: 'Community Volunteer',
    emoji: '🤝',
    description: 'Volunteer for 5 community activities',
    pointsRequired: 750,
  },
  {
    id: 'green-advocate',
    name: 'Green Advocate',
    emoji: '🌱',
    description: 'Earn 1000 Eco Points',
    pointsRequired: 1000,
  },
  {
    id: 'environmental-champion',
    name: 'Environmental Champion',
    emoji: '🏆',
    description: 'Reach the Environmental Champion level',
    pointsRequired: 3500,
  },
];

// Eco Points rules — what actually earns points.
// Per the ECHO Impact Framework: users are NOT rewarded for merely
// submitting a report. Points only come from verified/high-priority/
// critical/resolved outcomes, cleanup participation and organising, and
// community awareness activities. Mirrored server-side in the
// handle_new_report / handle_report_status_change triggers
// (supabase/migrations) — keep both in sync if these change.
export const POINTS_RULES = {
  verifiedReport: 100,
  highPriorityOrCriticalBonus: 50, // additional bonus when a verified report is High/Critical severity
  resolvedReport: 200,
  cleanupParticipation: 75,
  cleanupOrganizing: 150,
  communityAwareness: 30,
};

// Helper function to calculate current level based on points
export function calculateLevel(points: number): ImpactLevel {
  for (let i = IMPACT_LEVELS.length - 1; i >= 0; i--) {
    if (points >= IMPACT_LEVELS[i].minPoints) {
      return IMPACT_LEVELS[i];
    }
  }
  return IMPACT_LEVELS[0];
}

// Helper function to calculate progress to next level
export function calculateProgressToNextLevel(points: number): {
  currentLevel: ImpactLevel;
  nextLevel: ImpactLevel | null;
  progress: number;
  pointsToNext: number;
} {
  const currentLevel = calculateLevel(points);
  const currentIndex = IMPACT_LEVELS.findIndex((l) => l.id === currentLevel.id);
  const nextLevel = currentIndex < IMPACT_LEVELS.length - 1 ? IMPACT_LEVELS[currentIndex + 1] : null;

  if (!nextLevel) {
    return { currentLevel, nextLevel: null, progress: 100, pointsToNext: 0 };
  }

  const pointsInCurrentLevel = points - currentLevel.minPoints;
  const pointsNeededForNext = nextLevel.minPoints - currentLevel.minPoints;
  const progress = Math.min(100, Math.round((pointsInCurrentLevel / pointsNeededForNext) * 100));
  const pointsToNext = nextLevel.minPoints - points;

  return { currentLevel, nextLevel, progress, pointsToNext };
}

// Helper function to calculate current trust level based on reputation
export function calculateTrustLevel(reputation: number): TrustLevel {
  for (let i = TRUST_LEVELS.length - 1; i >= 0; i--) {
    if (reputation >= TRUST_LEVELS[i].minReputation) {
      return TRUST_LEVELS[i];
    }
  }
  return TRUST_LEVELS[0];
}
