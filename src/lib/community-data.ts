import type { CommunityCampaign, VolunteerActivity, LeaderboardEntry, CommunityLeader, CommunityChallenge, RecognitionItem, FeedPost, EnvironmentalEvent } from '@/types/community';

export const MOCK_CAMPAIGNS: CommunityCampaign[] = [
  { id: 'c1', title: 'Green Lagos Initiative', description: 'Transform Lagos into a greener city through tree planting and waste management.', status: 'active', organizer: 'EcoLagos', participants: 234, maxParticipants: 500, startDate: '2025-01-15', endDate: '2025-06-30', location: 'Lagos Island', category: 'Reforestation', emoji: '🌳' },
  { id: 'c2', title: 'Clean Water for All', description: 'Ensuring clean water access by monitoring and reporting water pollution sources.', status: 'active', organizer: 'WaterWatch', participants: 189, maxParticipants: 300, startDate: '2025-02-01', endDate: '2025-07-15', location: 'Ikoyi District', category: 'Water Quality', emoji: '🚰' },
  { id: 'c3', title: 'Plastic-Free June', description: 'A month-long campaign to eliminate single-use plastics from our community.', status: 'upcoming', organizer: 'ZeroWaste NG', participants: 45, maxParticipants: 1000, startDate: '2025-06-01', endDate: '2025-06-30', location: 'Islandwide', category: 'Waste Reduction', emoji: '♻️' },
  { id: 'c4', title: 'Solar Streets Project', description: 'Installing solar-powered street lights in underserved communities.', status: 'upcoming', organizer: 'BrightFuture', participants: 12, maxParticipants: 100, startDate: '2025-07-01', endDate: '2025-12-31', location: 'Mainland Lagos', category: 'Clean Energy', emoji: '☀️' },
  { id: 'c5', title: 'Mangrove Restoration', description: 'Successfully restored 5km of mangrove coastline protecting against erosion.', status: 'completed', organizer: 'CoastalGuard', participants: 500, maxParticipants: 500, startDate: '2024-09-01', endDate: '2025-01-30', location: 'Lekki Coast', category: 'Ecosystem', emoji: '🌿' },
];

export const MOCK_VOLUNTEERS: VolunteerActivity[] = [
  { id: 'v1', title: 'Victoria Beach Cleanup', type: 'cleanup', date: '2025-02-15', time: '7:00 AM', location: 'Victoria Beach', participants: 45, maxParticipants: 100, organizer: 'CleanOceans', description: 'Join us for a morning cleanup of Victoria Beach. Gloves and bags provided.', emoji: '🧹' },
  { id: 'v2', title: 'Community Tree Planting', type: 'tree_planting', date: '2025-02-20', time: '8:00 AM', location: 'Centenary Park', participants: 78, maxParticipants: 150, organizer: 'GreenCity', description: 'Plant 200 native trees in Centenary Park. Seedlings provided.', emoji: '🌱' },
  { id: 'v3', title: 'Recycling Awareness Drive', type: 'awareness', date: '2025-02-22', time: '10:00 AM', location: 'Community Hall', participants: 23, maxParticipants: 50, organizer: 'EcoEducate', description: 'Educate residents on proper waste sorting and recycling practices.', emoji: '♻️' },
  { id: 'v4', title: 'Environmental Data Workshop', type: 'workshop', date: '2025-03-01', time: '2:00 PM', location: 'Tech Hub', participants: 15, maxParticipants: 30, organizer: 'DataGreen', description: 'Learn to use ECHO tools for environmental monitoring and reporting.', emoji: '📊' },
  { id: 'v5', title: 'Monthly Community Meeting', type: 'meeting', date: '2025-03-05', time: '6:00 PM', location: 'Town Hall', participants: 120, maxParticipants: 200, organizer: 'Community Board', description: 'Monthly review of environmental initiatives and planning.', emoji: '🤝' },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Amara Okafor', avatar: 'AO', impactLevel: 'Earth Protector', impactPoints: 4520, reportsSubmitted: 89, emoji: '🌍' },
  { rank: 2, name: 'Chidi Eze', avatar: 'CE', impactLevel: 'Sustainability Ambassador', impactPoints: 3890, reportsSubmitted: 72, emoji: '🌎' },
  { rank: 3, name: 'Fatima Bello', avatar: 'FB', impactLevel: 'Environmental Champion', impactPoints: 3450, reportsSubmitted: 65, emoji: '🌳' },
  { rank: 4, name: 'You', avatar: 'YU', impactLevel: 'Community Guardian', impactPoints: 1250, reportsSubmitted: 28, emoji: '🌿' },
  { rank: 5, name: 'Kunle Adeyemi', avatar: 'KA', impactLevel: 'Community Guardian', impactPoints: 1180, reportsSubmitted: 24, emoji: '🌿' },
  { rank: 6, name: 'Ngozi Obi', avatar: 'NO', impactLevel: 'Eco Explorer', impactPoints: 890, reportsSubmitted: 18, emoji: '🌱' },
  { rank: 7, name: 'Ibrahim Musa', avatar: 'IM', impactLevel: 'Eco Explorer', impactPoints: 720, reportsSubmitted: 15, emoji: '🌱' },
];

export const MOCK_COMMUNITY_LEADERS: CommunityLeader[] = [
  { rank: 1, name: 'Lagos Island Ward A', healthScore: 94, totalReports: 1250, cleanupActivities: 45, emoji: '🏆' },
  { rank: 2, name: 'Ikoyi District', healthScore: 91, totalReports: 980, cleanupActivities: 38, emoji: '🥈' },
  { rank: 3, name: 'Lekki Phase 1', healthScore: 88, totalReports: 870, cleanupActivities: 32, emoji: '🥉' },
  { rank: 4, name: 'Victoria Island', healthScore: 85, totalReports: 750, cleanupActivities: 28, emoji: '🌟' },
  { rank: 5, name: 'Yaba Central', healthScore: 82, totalReports: 680, cleanupActivities: 25, emoji: '🌟' },
];

export const MOCK_CHALLENGES: CommunityChallenge[] = [
  { id: 'ch1', title: 'Plant 100 Trees', emoji: '🌱', goal: 100, progress: 73, participants: 45, timeRemaining: '12 days', rewardBadge: '🏅 Green Thumb' },
  { id: 'ch2', title: 'Clean Your Street', emoji: '🧹', goal: 50, progress: 38, participants: 28, timeRemaining: '8 days', rewardBadge: '🏅 Street Hero' },
  { id: 'ch3', title: 'Recycling Week', emoji: '♻️', goal: 200, progress: 156, participants: 89, timeRemaining: '3 days', rewardBadge: '🏅 Recycler Pro' },
  { id: 'ch4', title: 'Protect Water Sources', emoji: '🚰', goal: 25, progress: 12, participants: 18, timeRemaining: '20 days', rewardBadge: '🏅 Water Guardian' },
];

export const MOCK_RECOGNITION: RecognitionItem[] = [
  { id: 'r1', title: 'Volunteer of the Month', recipient: 'Amara Okafor', description: 'Logged 60+ volunteer hours this month across 8 events.', emoji: '🌟', date: 'January 2025', category: 'individual' },
  { id: 'r2', title: 'Community of the Month', recipient: 'Lagos Island Ward A', description: 'Achieved 94% community health score with 45 cleanup activities.', emoji: '🏘️', date: 'January 2025', category: 'community' },
  { id: 'r3', title: 'Top Environmental Champion', recipient: 'Chidi Eze', description: 'Submitted 72 verified reports impacting 3 communities.', emoji: '🏆', date: 'January 2025', category: 'individual' },
  { id: 'r4', title: 'Best Improvement Story', recipient: 'Yaba Central', description: 'Transformed from 62% to 82% health score in 6 months.', emoji: '📈', date: 'Q4 2024', category: 'community' },
  { id: 'r5', title: 'Outstanding Cleanup Campaign', recipient: 'Clean Oceans Initiative', description: 'Removed 2.4 tons of plastic from Lagos coastline.', emoji: '🌊', date: 'December 2024', category: 'campaign' },
];

export const MOCK_FEED: FeedPost[] = [
  { id: 'f1', author: 'Amara Okafor', avatar: 'AO', content: 'Just completed my 50th environmental report! 🎉 Every report matters in building a cleaner community.', type: 'achievement', likes: 45, comments: 12, shares: 8, date: '2 hours ago' },
  { id: 'f2', author: 'EcoLagos', avatar: 'EL', content: 'Green Lagos Initiative hits 234 participants! We are halfway to our goal. Join us this weekend for the tree planting event.', type: 'campaign', likes: 89, comments: 23, shares: 34, date: '5 hours ago' },
  { id: 'f3', author: 'CleanOceans', avatar: 'CO', content: 'Amazing turnout at Victoria Beach cleanup! 45 volunteers collected 300kg of waste. Together we make a difference! 🌊', type: 'activity', likes: 120, comments: 34, shares: 56, date: '1 day ago', imageUrl: 'beach' },
  { id: 'f4', author: 'ECHO Team', avatar: 'EC', content: '📢 New feature alert! You can now track your environmental impact with our updated Impact Center. Check your profile for details.', type: 'announcement', likes: 200, comments: 45, shares: 78, date: '2 days ago' },
  { id: 'f5', author: 'Yaba Central', avatar: 'YC', content: 'Proud to announce our community health score improved from 62% to 82% in just 6 months! Hard work pays off. 🌿', type: 'success', likes: 340, comments: 67, shares: 120, date: '3 days ago' },
];

export const MOCK_EVENTS: EnvironmentalEvent[] = [
  { id: 'e1', title: 'Victoria Beach Cleanup', type: 'cleanup', date: '2025-02-15', time: '7:00 AM', location: 'Victoria Beach', participants: 45, featured: true, completed: false, emoji: '🧹', description: 'Monthly beach cleanup drive. All equipment provided.' },
  { id: 'e2', title: 'Community Tree Planting Day', type: 'planting', date: '2025-02-20', time: '8:00 AM', location: 'Centenary Park', participants: 78, featured: true, completed: false, emoji: '🌱', description: 'Plant 200 native trees. Seedlings and tools provided.' },
  { id: 'e3', title: 'Environmental Town Hall', type: 'meeting', date: '2025-03-05', time: '6:00 PM', location: 'Town Hall', participants: 120, featured: false, completed: false, emoji: '🤝', description: 'Monthly community environmental review meeting.' },
  { id: 'e4', title: 'World Water Day Awareness', type: 'awareness', date: '2025-03-22', time: '9:00 AM', location: 'City Square', participants: 200, featured: true, completed: false, emoji: '💧', description: 'Rally for clean water access and pollution awareness.' },
  { id: 'e5', title: 'Mangrove Restoration Drive', type: 'planting', date: '2025-01-30', time: '7:00 AM', location: 'Lekki Coast', participants: 500, featured: false, completed: true, emoji: '🌿', description: 'Successfully restored 5km of mangrove coastline.' },
  { id: 'e6', title: 'Recycling Workshop', type: 'awareness', date: '2025-01-20', time: '2:00 PM', location: 'Community Hall', participants: 35, featured: false, completed: true, emoji: '♻️', description: 'Hands-on workshop on waste sorting and recycling.' },
];
