import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Bookmark, 
  Share2, 
  Calendar,
  User,
  CheckCircle,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useIntelligenceData } from '@/hooks/use-intelligence-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { SafeImage } from '@/components/ui/safe-image';

const ArticleDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { articles, loading } = useIntelligenceData();

  const article = articles.find(a => a.slug === slug);

  useDocumentTitle(
    article ? article.title : 'Knowledge Centre',
    article ? article.excerpt : undefined
  );

  if (loading && !article) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <h2 className="text-2xl font-black">Article Not Found</h2>
        <Button asChild>
          <Link to="/knowledge">Return to Knowledge Centre</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 pb-20 max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Button asChild variant="ghost" className="hover:bg-primary/5 -ml-2 text-muted-foreground">
          <Link to="/knowledge">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Knowledge Centre
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-primary/20">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-primary/20">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Badge className="bg-primary hover:bg-primary/90 text-white border-none px-4">{article.category}</Badge>
          <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.read_time_minutes} min read
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">EH</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-bold flex items-center gap-1">
                ECHO Health
                <CheckCircle className="h-3 w-3 text-primary fill-primary/10" />
              </p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Environmental Specialist</p>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground italic font-medium flex items-center gap-4">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Published: {new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
            <span className="flex items-center gap-1 font-bold text-primary"><User className="h-3 w-3" /> 5.2k reads</span>
          </div>
        </div>
      </div>

      {/* Main Image */}
      <div className="my-10 rounded-3xl overflow-hidden shadow-2xl h-[400px] relative">
        <SafeImage
          src={article.cover_image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=70&w=1200"}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl" />
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none prose-p:text-muted-foreground prose-p:italic prose-headings:font-black prose-headings:tracking-tight prose-headings:uppercase prose-a:text-primary">
        <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-2xl mb-10 italic text-lg leading-relaxed text-foreground/80">
          "{article.excerpt}"
        </div>

        <div className="space-y-6 text-foreground/90 leading-relaxed font-medium">
          {article.content.split('\n\n').map((para, i) => {
            // Content written in the admin editor can embed an image as
            // ![alt](url) — the one lightweight "rich content" affordance
            // supported before Phase 2's real rich text editor arrives.
            const imageMatch = para.match(/^!\[(.*)\]\((.*)\)$/);
            if (imageMatch) {
              return (
                <img
                  key={i}
                  src={imageMatch[2]}
                  alt={imageMatch[1]}
                  className="w-full rounded-2xl not-italic"
                />
              );
            }
            return para.trim() ? <p key={i}>{para}</p> : null;
          })}
        </div>

        {/* Placeholder for more complex content components */}
        <div className="my-12 p-8 rounded-3xl bg-muted/30 border border-muted-foreground/10 space-y-6">
          <h3 className="flex items-center gap-2">Key Takeaways</h3>
          <ul className="space-y-3 m-0 p-0 list-none">
            {[
              "Regular monitoring of local drainage systems prevents 70% of flash floods.",
              "Community coordination is essential for effective waste collection cycles.",
              "Early reporting using the ECHO platform triggers rapid assessment within 24 hours."
            ].map((point, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-1 h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                  <CheckCircle className="h-3 w-3" />
                </div>
                <span className="text-sm font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-12 pt-8 border-t flex flex-wrap gap-2">
        {article.tags.map(tag => (
          <Badge key={tag} variant="secondary" className="px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
            #{tag}
          </Badge>
        ))}
      </div>

      {/* Author Bio Footer */}
      <Separator className="my-12" />
      <div className="bg-primary/5 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-white text-3xl font-black">EH</AvatarFallback>
        </Avatar>
        <div className="space-y-4 text-center md:text-left">
          <div className="space-y-1">
            <h4 className="text-2xl font-black uppercase tracking-tight">ECHO Health Editorial</h4>
            <p className="text-sm text-primary font-bold">Verified Knowledge Partner</p>
          </div>
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            Our health editorial team consists of environmental scientists and community leaders dedicated to providing accurate, 
            actionable intelligence for building a safer, cleaner environment for everyone.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Button variant="outline" size="sm" className="rounded-full gap-2 border-primary/20">
              <User className="h-4 w-4" />
              Follow Team
            </Button>
            <Button variant="outline" size="sm" className="rounded-full gap-2 border-primary/20">
              <MessageSquare className="h-4 w-4" />
              Contact Experts
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-20 flex flex-col md:flex-row gap-6 items-center justify-between bg-card p-8 rounded-3xl shadow-xl border border-primary/5">
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Up Next</p>
          <h4 className="text-xl font-bold">Waste Management: A Circular Approach</h4>
        </div>
        <Button asChild className="rounded-full h-12 px-8 group">
          <Link to="/knowledge">
            Continue Reading
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ArticleDetailsPage;

