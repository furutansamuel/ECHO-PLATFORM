export type ReportStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Pending Verification'
  | 'Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed'
  // Original narrower set, still valid per the DB CHECK constraint and
  // what the report wizard / RLS edit-permission policy actually use.
  | 'Pending'
  | 'Rejected';

export interface ReportLocation {
  lat: number;
  lng: number;
  address: string;
  ward: string;
  lga: string;
  state: string;
  landmark?: string;
}

// Matches supabase/migrations/20260115120000_create_hazard_reports.sql
// (+ 20260115120500_extend_hazard_reports_verification_ai.sql for the
// verification/AI columns). location is a single JSONB column, not flat
// latitude/longitude/address columns — several components previously
// assumed the flat shape and were silently broken for any real
// (non-mock) report.
export interface HazardReport {
  id: string;
  user_id: string;
  reference_number: string;
  title: string;
  description: string;
  category: string;
  estimated_size: string;
  affected_area: string;
  date_observed: string;
  time_observed: string;
  immediate_risk: string;
  environmental_impact: string;
  required_action: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: ReportStatus;
  location: ReportLocation;
  images: string[];
  video?: string;
  is_anonymous: boolean;
  notify_volunteers: boolean;
  share_with_community: boolean;
  receive_updates: boolean;
  created_at: string;
  updated_at: string;
  verification_status?: string;
  verifier_id?: string;
  verification_notes?: string;
  verification_date?: string;
  verification_confidence?: number;
  duplicate_id?: string;
  ai_risk_score?: number;
  ai_priority?: string;
  ai_impact?: string;
  ai_summary?: string;
  ai_generated_at?: string;
}

// Matches supabase/migrations/20260718093000_create_events.sql
export interface EventRecord {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  category: 'Cleanup' | 'Tree Planting' | 'Workshop' | 'Awareness Campaign' | 'Other';
  event_date: string;
  start_time: string;
  end_time?: string;
  location_name: string;
  location_address?: string;
  max_volunteers?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Matches supabase/migrations/20260719080000_create_faqs.sql
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_visible: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type ReportActivityType =
  | 'created' | 'draft_saved' | 'submitted' | 'status_changed'
  | 'verification_started' | 'verification_completed' | 'verification_rejected'
  | 'assigned' | 'evidence_uploaded' | 'location_updated' | 'ai_analysis_generated'
  | 'eco_points_awarded' | 'duplicate_detected' | 'resolved' | 'closed' | 'withdrawn';

// Matches supabase/migrations/20260115120600_create_report_activities.sql
export interface ReportActivity {
  id: string;
  report_id: string;
  user_id?: string;
  action_type: ReportActivityType;
  description: string;
  metadata?: Record<string, unknown>;
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
