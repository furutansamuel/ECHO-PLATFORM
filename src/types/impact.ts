// ECHO Impact Framework types.
//
// Per the ECHO Impact Framework, Eco Points, Reputation, and Level are three
// independent systems — see src/lib/impact-constants.ts for the values and
// src/pages/citizen/RewardsPage.tsx / ProfilePage.tsx for how they're
// populated from real user_stats data. Nothing here should hold mock values;
// these are shape-only definitions.

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
}

export interface TrustLevel {
  id: number;
  name: string;
  minReputation: number;
  maxReputation: number;
  description: string;
}
