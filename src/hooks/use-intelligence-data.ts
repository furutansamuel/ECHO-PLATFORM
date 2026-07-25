import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { 
  HazardReport, 
  IntelligenceSummary, 
  AIEnvironmentalAnalysis, 
  KnowledgeArticle, 
  CommunityCampaign 
} from '@/types/reports';
import * as Sonner from 'sonner';

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
  categories: Record<string, number>;
};

export type UserStats = {
  id: string;
  total_reports: number;
  verified_reports: number;
  pending_reports: number;
  resolved_reports: number;
  eco_points: number;
  level: number;
};

export const useIntelligenceData = () => {
  const { user } = useAuth();
  const [hazardReports, setHazardReports] = useState<HazardReport[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [intelligenceSummary, setIntelligenceSummary] = useState<IntelligenceSummary | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIEnvironmentalAnalysis | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [communityHealthScore, setCommunityHealthScore] = useState<CommunityHealthScore | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [campaigns, setCampaigns] = useState<CommunityCampaign[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    try {
      const reportsPromise = supabase.from('hazard_reports').select('*').order('created_at', { ascending: false });
      const statsPromise = user 
        ? supabase.from('user_stats').select('*').eq('user_id', user.id).maybeSingle() 
        : Promise.resolve({ data: null, error: null });
      
      const summaryPromise = supabase.rpc('get_environmental_intelligence_summary');
      const aiAnalysisPromise = supabase.rpc('get_ai_environmental_analysis');
      const analyticsPromise = supabase.rpc('get_dashboard_analytics');
      const articlesPromise = supabase.from('knowledge_articles').select('*').eq('status', 'published').limit(6);
      const campaignsPromise = supabase.from('community_campaigns').select('*').in('status', ['upcoming', 'active']).limit(6);
      const alertsPromise = supabase.from('environmental_alerts').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(5);

      const [
        reportsResult, 
        statsResult, 
        summaryResult, 
        aiAnalysisResult,
        analyticsResult,
        articlesResult,
        campaignsResult,
        alertsResult
      ] = await Promise.all([
        reportsPromise,
        statsPromise,
        summaryPromise,
        aiAnalysisPromise,
        analyticsPromise,
        articlesPromise,
        campaignsPromise,
        alertsPromise
      ]);

      if (reportsResult.error) throw reportsResult.error;
      if (summaryResult.error) throw summaryResult.error;
      if (aiAnalysisResult.error) throw aiAnalysisResult.error;

      if (reportsResult.data) setHazardReports(reportsResult.data);
      if (statsResult.data) setUserStats(statsResult.data);
      if (summaryResult.data) setIntelligenceSummary(summaryResult.data);
      if (aiAnalysisResult.data) setAiAnalysis(aiAnalysisResult.data);
      if (analyticsResult.data) setAnalyticsData(analyticsResult.data);
      if (articlesResult.data && articlesResult.data.length > 0) {
        setArticles(articlesResult.data);
      } else {
        const { FALLBACK_ARTICLES } = await import('@/lib/fallback-articles');
        setArticles(FALLBACK_ARTICLES);
      }
      if (campaignsResult.data) setCampaigns(campaignsResult.data);
      if (alertsResult.data) setAlerts(alertsResult.data);

      // Illustrative placeholder data — kept intentionally (not demo-mode
      // gated, shown to every account). Replace with a real AI insights
      // pipeline when that's ready; until then this is static, not live.
      setAiInsights([
        { title: 'Flood Risk Alert', summary: 'Heavy rainfall expected in northern regions', trend: 'up', confidence: 0.85, action: 'Prepare emergency response' },
        { title: 'Air Quality Improvement', summary: 'Pollution levels decreasing in urban areas', trend: 'down', confidence: 0.78, action: 'Continue monitoring' },
      ]);

      // Illustrative placeholder — same as above, static until a real
      // scoring pipeline exists.
      setCommunityHealthScore({
        score: 72,
        trend: 'stable',
        categories: { flood_risk: 65, waste_management: 78, air_quality: 82, water_quality: 70 }
      });
    } catch (err: any) {
      console.error('Error fetching intelligence data:', err);
      setError(err?.message || 'Failed to load environmental intelligence data.');
      Sonner.toast.error('Failed to load environmental intelligence: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    // Always seed knowledge articles with the fallback set so the Knowledge
    // Centre is never empty when the DB has no rows yet.
    import('@/lib/fallback-articles').then((m) => {
      if (!cancelled) setArticles((prev) => (prev.length > 0 ? prev : m.FALLBACK_ARTICLES));
    });

    if (supabase) {
      fetchData();
    }

    if (!supabase) return;

    // Unique channel name per mount avoids
    // "cannot add postgres_changes callbacks after subscribe()" and duplicate-
    // subscription errors when the hook mounts in multiple components.
    const channelName = `realtime-echo-${Math.random().toString(36).slice(2, 10)}`;
    const channel = supabase.channel(channelName);
    channel.on(
      'postgres_changes' as never,
      { event: '*', schema: 'public' },
      (payload: unknown) => {
        if (!cancelled) {
          console.debug('[ECHO] realtime change', payload);
          fetchData();
        }
      },
    );
    channel.subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { 
    hazardReports, 
    userStats, 
    intelligenceSummary, 
    aiAnalysis, 
    aiInsights,
    communityHealthScore,
    analyticsData,
    articles,
    campaigns,
    alerts,
    loading,
    error,
    refetch: fetchData 
  };
};
