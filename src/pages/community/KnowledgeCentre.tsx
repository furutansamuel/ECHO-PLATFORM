import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  Clock, 
  Filter,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { useIntelligenceData } from '@/hooks/use-intelligence-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  'All',
  'Flood Prevention',
  'Waste Management',
  'Recycling',
  'Environmental Health',
  'Climate Change',
  'Water Conservation',
  'Air Quality',
  'Community Sanitation'
];

const KnowledgeCentre: React.FC = () => {
  const { articles, loading } = useIntelligenceData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Knowledge Centre
          </h1>
          <p className="text-muted-foreground italic">
            Empowering communities through environmental education and action
          </p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search articles, guides, resources..." 
            className="pl-10 h-12 rounded-full border-primary/20 bg-primary/5 focus-visible:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Featured Section */}
      {!loading && filteredArticles.length > 0 && activeCategory === 'All' && !searchQuery && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-8 overflow-hidden border-none shadow-2xl relative group h-[400px]">
            <img 
              src={articles[0]?.cover_image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000"} 
              alt={articles[0]?.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 space-y-4">
              <Badge className="bg-primary hover:bg-primary/90 text-white border-none">{articles[0]?.category}</Badge>
              <h2 className="text-3xl font-black text-white leading-tight max-w-2xl">{articles[0]?.title}</h2>
              <p className="text-white/80 line-clamp-2 max-w-xl text-sm italic">{articles[0]?.excerpt}</p>
              <div className="flex items-center gap-4 pt-2">
                <Button asChild className="rounded-full px-6">
                  <Link to={`/knowledge/${articles[0]?.slug}`}>Read Full Article</Link>
                </Button>
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <Clock className="h-4 w-4" />
                  <span>{articles[0]?.read_time_minutes} min read</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="flex-1 bg-primary text-primary-foreground border-none relative overflow-hidden">
              <div className="absolute -top-10 -right-10 opacity-10">
                <Award className="h-40 w-40" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Contributor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm opacity-90 italic">Join 5,000+ citizens in our mission to protect the environment. Your reports save communities.</p>
                <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold">JD</div>
                    <div>
                      <p className="text-sm font-bold">James Daniel</p>
                      <p className="text-[10px] uppercase opacity-70">Eco Master • 1,240 pts</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-shadow border-none bg-accent/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Most Read</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {articles.slice(1, 3).map((article, idx) => (
                  <Link key={idx} to={`/knowledge/${article.slug}`} className="group block">
                    <p className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-1">{article.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{article.view_count} people read this</p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="space-y-6">
        <Tabs defaultValue="All" className="w-full" onValueChange={setActiveCategory}>
          <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground shrink-0">
              <Filter className="h-3 w-3" />
              <span className="text-xs font-bold uppercase">Filter By</span>
            </div>
            <TabsList className="bg-transparent h-auto p-0 gap-2">
              {CATEGORIES.map(cat => (
                <TabsTrigger 
                  key={cat} 
                  value={cat}
                  className="rounded-full px-5 py-2 text-xs font-bold border border-transparent data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md hover:border-primary/20 transition-all shrink-0"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden border-none shadow-lg">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
              </Card>
            ))
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all h-full flex flex-col group">
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={article.cover_image || `https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600&sig=${idx}`} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 left-4 bg-white/90 text-primary hover:bg-white backdrop-blur-md border-none">{article.category}</Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs italic mt-1">{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow pt-0">
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-medium mt-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{article.read_time_minutes} min read</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{article.view_count} views</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-6">
                    <Button asChild variant="link" className="p-0 h-auto text-primary font-bold group-hover:gap-2 transition-all">
                      <Link to={`/knowledge/${article.slug}`}>
                        Read Article <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="inline-flex items-center justify-center p-6 bg-muted rounded-full">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold">No articles found</h3>
              <p className="text-muted-foreground italic">Try adjusting your filters or search query.</p>
              <Button variant="outline" onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}>Reset All Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeCentre;
