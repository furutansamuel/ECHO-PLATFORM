import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  ShieldAlert,
  BookOpen,
  Map,
  ArrowLeft,
} from "lucide-react";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function NotFound() {
  useDocumentTitle(
    "404 - Page Not Found",
    "The page you are looking for could not be found."
  );

  return (
    <div className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-background flex items-center justify-center px-4 py-20">

      {/* Background Decorations */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative z-10 max-w-3xl w-full text-center">

        {/* Logo */}
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />

          <img
            src="/echo-symbol.svg"
            alt="ECHO Logo"
            className="relative h-24 w-24 mx-auto animate-pulse"
          />
        </div>

        {/* 404 */}
        <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent tracking-tight">
          404
        </h1>

        {/* Heading */}
        <h2 className="mt-6 text-3xl md:text-4xl font-black text-primary">
          Oops! We Couldn't Find That Page
        </h2>

        {/* Description */}
        <p className="mt-5 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
          It looks like you've wandered off the map. The page you're looking
          for may have been moved, deleted, or the address may be incorrect.
          Let's help you get back to exploring ECHO.
        </p>

        {/* Quick Navigation */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">

          <Button
            asChild
            variant="outline"
            className="h-auto py-6 flex-col gap-3 rounded-2xl hover:scale-[1.03] transition-all"
          >
            <Link to="/">
              <Home className="h-6 w-6 text-primary" />
              <span className="font-medium">
                Home
              </span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto py-6 flex-col gap-3 rounded-2xl hover:scale-[1.03] transition-all"
          >
            <Link to="/report">
              <ShieldAlert className="h-6 w-6 text-primary" />
              <span className="font-medium">
                Report Hazard
              </span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto py-6 flex-col gap-3 rounded-2xl hover:scale-[1.03] transition-all"
          >
            <Link to="/knowledge">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-medium">
                Knowledge Centre
              </span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto py-6 flex-col gap-3 rounded-2xl hover:scale-[1.03] transition-all"
          >
            <Link to="/map">
              <Map className="h-6 w-6 text-primary" />
              <span className="font-medium">
                Explore Map
              </span>
            </Link>
          </Button>

        </div>

        {/* Small Message */}
        <div className="mt-10 max-w-xl mx-auto">
          <p className="text-muted-foreground leading-7">
            Continue reporting environmental hazards, exploring community
            insights, and helping build cleaner, healthier, and safer
            communities with <span className="font-semibold text-primary">ECHO</span>.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 btn-glow"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Return to Home
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
        }
