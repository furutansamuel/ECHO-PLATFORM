import type { ImpactLevel, AchievementBadge, ImpactStats, PointHistoryEntry } from '@/types/impact';

// Impact Levels - User progression system
export const IMPACT_LEVELS: ImpactLevel[] = [
  {
    id: 1,
    name: 'Eco Explorer',
    emoji: '🌱',
    minPoints: 0,
    maxPoints: 499,
    description: 'Just starting your environmental journey',
  },
  {
    id: 2,
    name: 'Community Guardian',
    emoji: '🌿',
    minPoints: 500,
    maxPoints: 1499,
    description: 'Actively protecting your community',
  },
  {
    id: 3,
    name: 'Environmental Champion',
    emoji: '🌳',
    minPoints: 1500,
    maxPoints: 3499,
    description: 'A leading force for environmental change',
  },
  {
    id: 4,
    name: 'Sustainability Ambassador',
    emoji: '🌎',
    minPoints: 3500,
    maxPoints: 7499,
    description: 'Inspiring others to take action',
  },
  {
    id: 5,
    name: 'Earth Protector',
    emoji: '🌍',
    minPoints: 7500,
    maxPoints: Infinity,
    description: 'A true guardian of our planet',
  },
];

// Achievement Badges
export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'first-report',
    name: 'First Report',
    emoji: '🥇',
    description: 'Submit your first hazard report',
    pointsRequired: 100,
    earned: true,
    earnedDate: '2024-01-15',
  },
  {
    id: 'verified-contributor',
    name: 'Verified Contributor',
    emoji: '✅',
    description: 'Have 5 reports verified by the community',
    pointsRequired: 500,
    earned: true,
    earnedDate: '2024-02-20',
  },
  {
    id: 'cleanup-champion',
    name: 'Cleanup Champion',
    emoji: '🧹',
    description: 'Join 3 cleanup events',
    pointsRequired: 300,
    earned: false,
  },
  {
    id: 'knowledge-explorer',
    name: 'Knowledge Explorer',
    emoji: '📚',
    description: 'Read 10 knowledge articles',
    pointsRequired: 200,
    earned: true,
    earnedDate: '2024-03-05',
  },
  {
    id: 'community-volunteer',
    name: 'Community Volunteer',
    emoji: '🤝',
    description: 'Volunteer for 5 community activities',
    pointsRequired: 750,
    earned: false,
  },
  {
    id: 'green-advocate',
    name: 'Green Advocate',
    emoji: '🌱',
    description: 'Earn 1000 Impact Points',
    pointsRequired: 1000,
    earned: true,
    earnedDate: '2024-03-15',
  },
  {
    id: 'environmental-champion',
    name: 'Environmental Champion',
    emoji: '🏆',
    description: 'Reach Level 3 - Environmental Champion',
    pointsRequired: 1500,
    earned: false,
  },
];

// Points Rules
export const POINTS_RULES = {
  submitReport: 50,
  verifiedReport: 100,
  readArticle: 10,
  joinCampaign: 25,
  cleanupParticipation: 75,
  communityContribution: 30,
};

// Mock Impact Stats
export const MOCK_IMPACT_STATS: ImpactStats = {
  reportsSubmitted: 24,
  verifiedReports: 18,
  communitiesHelped: 8,
  cleanupEventsJoined: 3,
  knowledgeArticlesRead: 15,
  volunteerHours: 42,
  environmentalScore: 87,
};

// Mock Point History
export const MOCK_POINT_HISTORY: PointHistoryEntry[] = [
  {
    id: '1',
    description: 'Submitted hazard report',
    points: 50,
    date: '2024-03-20',
    type: 'report',
  },
  {
    id: '2',
    description: 'Report verified by community',
    points: 100,
    date: '2024-03-19',
    type: 'verification',
  },
  {
    id: '3',
    description: 'Read knowledge article',
    points: 10,
    date: '2024-03-18',
    type: 'article',
  },
  {
    id: '4',
    description: 'Joined cleanup campaign',
    points: 25,
    date: '2024-03-17',
    type: 'campaign',
  },
  {
    id: '5',
    description: 'Cleanup event participation',
    points: 75,
    date: '2024-03-15',
    type: 'cleanup',
  },
];

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

// Mock user impact points
export const MOCK_IMPACT_POINTS = 1250;
