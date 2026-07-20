import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ShieldAlert, BookOpen, MapPin } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function NotFound() {
  useDocumentTitle('Page Not Found', 'The page you were looking for doesn\'t exist.');

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="relative inline-flex">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <img src="/echo-symbol.svg" alt="" aria-hidden="true" className="relative h-20 w-20 mx-auto opacity-80" />
        </div>

        <div className="space-y-3">
          <p className="text-7xl font-black text-primary tracking-tight">404</p>
          <h1 className="text-2xl font-bold text-foreground">This location isn't on the map</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            The page you're looking for doesn't exist, or may have moved. Let's get you back on track.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
            <Link to="/">
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
            <Link to="/report">
              <ShieldAlert className="h-5 w-5" />
              <span className="text-xs">Report a Hazard</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
            <Link to="/knowledge">
              <BookOpen className="h-5 w-5" />
              <span className="text-xs">Knowledge Centre</span>
            </Link>
          </Button>
        </div>

        <Button asChild className="btn-glow">
          <Link to="/">
            <MapPin className="h-4 w-4 mr-2" />
            Take Me Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
