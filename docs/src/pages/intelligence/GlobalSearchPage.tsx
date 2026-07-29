import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  AlertTriangle, 
  BookOpen, 
  Users, 
  MapPin, 
  History,
  TrendingUp,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GlobalSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('global_search', {
        p_query: searchTerm,
        p_content_type: activeTab,
        p_limit: 20
      });

      if (error) throw error;
      setResults(data);
      
      // Update URL
      setSearchParams({ q: searchTerm });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-5xl mx-auto pb-20">
      {/* Search Header */}
      <div className="space-y-6">
        <form onSubmit={handleSearch} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary transition-colors group-focus-within:text-accent" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports, articles, campaigns, locations..."
            className="pl-14 h-16 rounded-3xl text-lg border-primary/20 bg-primary/5 focus-visible:ring-primary/20 shadow-xl"
            autoFocus
          />
          {query && (
            <button 
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
        </form>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-muted/50 p-1 rounded-full border border-border/50">
              <TabsTrigger value="all" className="rounded-full px-6 py-2">All Results</TabsTrigger>
              <TabsTrigger value="reports" className="rounded-full px-6 py-2">Hazards</TabsTrigger>
              <TabsTrigger value="articles" className="rounded-full px-6 py-2">Knowledge</TabsTrigger>
              <TabsTrigger value="campaigns" className="rounded-full px-6 py-2">Campaigns</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2 text-xs font-bold uppercase text-muted-foreground">
              <History className="h-4 w-4" />
              Recent
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-xs font-bold uppercase text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-8">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="border-none shadow-md overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : results ? (
          <>
            {results.total_results > 0 ? (
              <div className="space-y-10">
                {/* Reports Section */}
                {results.reports.length > 0 && (activeTab === 'all' || activeTab === 'reports') && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      Hazard Reports ({results.reports.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.reports.map((report: any) => (
                        <Link key={report.id} to={`/reports/${report.id}`}>
                          <Card className="hover:border-primary/40 transition-all group border-primary/5">
                            <CardContent className="p-4 flex items-start gap-4">
                              <div className="p-3 rounded-xl bg-destructive/10 shrink-0">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                              </div>
                              <div className="flex-grow space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className={`beacon-badge beacon-badge--${report.severity === 'Low' ? 'safe' : report.severity === 'Medium' ? 'warning' : 'danger'}`}>{report.severity}</span>
                                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">{report.reference_number}</span>
                                </div>
                                <h4 className="font-bold text-sm line-clamp-1">{report.title || report.category}</h4>
                                <p className="text-[10px] text-muted-foreground italic truncate">Reported on {new Date(report.created_at).toLocaleDateString()}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Articles Section */}
                {results.articles.length > 0 && (activeTab === 'all' || activeTab === 'articles') && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Knowledge Articles ({results.articles.length})
                    </h3>
                    <div className="space-y-4">
                      {results.articles.map((article: any) => (
                        <Link key={article.id} to={`/knowledge/${article.slug}`}>
                          <Card className="hover:bg-primary/5 transition-all group border-none shadow-sm">
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                                <BookOpen className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-grow">
                                <Badge variant="outline" className="text-[8px] uppercase font-bold mb-1 border-primary/20 text-primary">{article.category}</Badge>
                                <h4 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">{article.title}</h4>
                                <p className="text-xs text-muted-foreground italic line-clamp-1 mt-0.5">{article.excerpt}</p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Campaigns Section */}
                {results.campaigns.length > 0 && (activeTab === 'all' || activeTab === 'campaigns') && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-2">
                      <Users className="h-4 w-4 text-accent" />
                      Community Campaigns ({results.campaigns.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.campaigns.map((campaign: any) => (
                        <Card key={campaign.id} className="hover:border-accent/40 transition-all group border-accent/5">
                          <CardContent className="p-4 flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-accent/10 shrink-0">
                              <Users className="h-5 w-5 text-accent" />
                            </div>
                            <div className="flex-grow space-y-1">
                              <Badge className="bg-accent/10 text-accent hover:bg-accent/20 border-none text-[8px] uppercase font-bold">{campaign.status}</Badge>
                              <h4 className="font-bold text-sm line-clamp-1">{campaign.title}</h4>
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1 italic">
                                <MapPin className="h-3 w-3" />
                                {new Date(campaign.start_date).toLocaleDateString()}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="inline-flex items-center justify-center p-6 bg-muted rounded-full">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold italic text-muted-foreground">No matches found for "{results.query}"</h3>
                <p className="text-sm text-muted-foreground italic max-w-xs mx-auto">Try different keywords or check your spelling for more results.</p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-12 py-10">
            {/* Suggested / Popular */}
            <div className="space-y-4 text-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Popular Searches</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {['Flood Prevention', 'Plastic Waste', 'Recycling Centers', 'Ikeja Hazards', 'Cleanup Events', 'Water Safety'].map(tag => (
                  <Button 
                    key={tag} 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full text-xs italic border-primary/20 hover:bg-primary/5"
                    onClick={() => { setQuery(tag); performSearch(tag); }}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            <Card className="border-none shadow-2xl bg-primary text-primary-foreground relative overflow-hidden p-8 rounded-3xl">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <TrendingUp className="h-40 w-40" />
              </div>
              <div className="relative z-10 text-center space-y-4 max-w-md mx-auto">
                <h3 className="text-2xl font-black italic">Search Smarter</h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  Our global search index covers everything from real-time hazard reports to educational resources and community cleanup initiatives.
                </p>
                <div className="flex items-center justify-center gap-6 pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-black">1.2k</p>
                    <p className="text-[9px] uppercase font-bold opacity-70">Hazards</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black">450+</p>
                    <p className="text-[9px] uppercase font-bold opacity-70">Articles</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black">85</p>
                    <p className="text-[9px] uppercase font-bold opacity-70">Campaigns</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearchPage;

