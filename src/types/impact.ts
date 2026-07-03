// Impact System Types for ECHO

export interface ImpactLevel {
  id: number;
  name: string;
  emoji: string;
  minPoints: number;
  maxPoints: number;
  description: string;
}

export interface AchievementBadge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  pointsRequired: number;
  earned: boolean;
  earnedDate?: string;
}

export interface ImpactStats {
  reportsSubmitted: number;
  verifiedReports: number;
  communitiesHelped: number;
  cleanupEventsJoined: number;
  knowledgeArticlesRead: number;
  volunteerHours: number;
  environmentalScore: number;
}

export interface PointHistoryEntry {
  id: string;
  description: string;
  points: number;
  date: string;
  type: 'report' | 'verification' | 'article' | 'campaign' | 'cleanup' | 'community';
}

export interface UserProfile {
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: string;
  impactPoints: number;
  currentLevel: ImpactLevel;
  badges: AchievementBadge[];
  stats: ImpactStats;
  pointHistory: PointHistoryEntry[];
  communityRank: number;
}
