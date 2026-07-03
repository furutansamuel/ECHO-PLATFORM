export type ReportStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Pending Verification'
  | 'Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

export interface HazardReport {
  id: string;
  reference_number: string;
  title: string;
  description: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: ReportStatus;
  latitude: number;
  longitude: number;
  address: string;
  ward: string;
  lga: string;
  state: string;
  landmark?: string;
  images: string[];
  video?: string;
  is_anonymous: boolean;
  reporter_id?: string;
  reporter_name?: string;
  created_at: string;
  updated_at: string;
  verification_status?: string;
  assigned_verifier?: string;
  verification_notes?: string;
  verification_date?: string;
  verification_confidence?: number;
  ai_risk_score?: number;
  ai_priority?: string;
  ai_impact_summary?: string;
  ai_risk_level?: string;
  ai_suggested_priority?: string;
  estimated_impact?: string;
}

export interface ReportActivity {
  id: string;
  report_id: string;
  status: ReportStatus;
  description: string;
  created_at: string;
}

export type AIInsight = {
  title: string;
  summary: string;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  action: string;
};

export type CommunityHealthScore = {
  score: number;
  trend: 'up' | 'down' | 'stable';
  categories: {
    [key: string]: number;
  };
};

export interface IntelligenceSummary {
  health_score: number;
  total_reports: number;
  resolved_reports: number;
  resolution_rate: number;
  avg_risk_score: number;
  recent_reports_30d: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  community_status: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Critical';
  generated_at: string;
}

export interface AIEnvironmentalAnalysis {
  flood_risk: number;
  waste_accumulation: number;
  pollution_level: number;
  water_quality: number;
  climate_impact: number;
  confidence_score: number;
  recommendations: {
    type: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }[];
  analysis_period: string;
  generated_at: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  category: 'Flood Prevention' | 'Waste Management' | 'Recycling' | 'Environmental Health' | 'Climate Change' | 'Water Conservation' | 'Air Quality' | 'Community Sanitation';
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  read_time_minutes: number;
  view_count: number;
  published_at?: string;
  created_at: string;
}

export interface CommunityCampaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image?: string;
  category: 'Cleanup Drive' | 'Tree Planting' | 'Awareness Campaign' | 'Fundraising' | 'Community Meeting' | 'Workshop' | 'Recycling Drive' | 'Water Conservation' | 'Beach Cleanup';
  location: any;
  start_date: string;
  end_date?: string;
  max_participants?: number;
  current_participants: number;
  status: 'draft' | 'upcoming' | 'active' | 'completed' | 'cancelled';
  is_featured: boolean;
  organizer_name: string;
  eco_points_reward: number;
}
