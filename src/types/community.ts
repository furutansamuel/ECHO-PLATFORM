// Community Engagement Types for ECHO

export type CampaignStatus = 'active' | 'upcoming' | 'completed';

export interface CommunityCampaign {
  id: string;
  title: string;
  description: string;
  status: CampaignStatus;
  organizer: string;
  participants: number;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  emoji: string;
  bookmarked?: boolean;
}

export type VolunteerType = 'cleanup' | 'tree_planting' | 'awareness' | 'workshop' | 'meeting';

export interface VolunteerActivity {
  id: string;
  title: string;
  type: VolunteerType;
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants: number;
  organizer: string;
  description: string;
  emoji: string;
  registered?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  impactLevel: string;
  impactPoints: number;
  reportsSubmitted: number;
  emoji: string;
}

export interface CommunityLeader {
  rank: number;
  name: string;
  healthScore: number;
  totalReports: number;
  cleanupActivities: number;
  emoji: string;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  emoji: string;
  goal: number;
  progress: number;
  participants: number;
  timeRemaining: string;
  rewardBadge: string;
  joined?: boolean;
}

export interface RecognitionItem {
  id: string;
  title: string;
  recipient: string;
  description: string;
  emoji: string;
  date: string;
  category: string;
}

export interface FeedPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  type: 'activity' | 'campaign' | 'achievement' | 'announcement' | 'success' | 'photo';
  likes: number;
  comments: number;
  shares: number;
  date: string;
  liked?: boolean;
  bookmarked?: boolean;
  imageUrl?: string;
}

export interface EnvironmentalEvent {
  id: string;
  title: string;
  type: 'meeting' | 'cleanup' | 'planting' | 'awareness';
  date: string;
  time: string;
  location: string;
  participants: number;
  featured: boolean;
  completed: boolean;
  emoji: string;
  description: string;
}
