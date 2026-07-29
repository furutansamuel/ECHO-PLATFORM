import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  Map,
  Globe2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export function Cta() {
  return (
    <section className="relative overflow-hidden py-14 lg:py-20">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-success/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-success shadow-2xl">

          {/* Decorative Circles */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="relative px-8 py-12 md:px-14 md:py-16">

            <div className="mx-auto max-w-4xl text-center">

              {/* Icon */}
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                <Globe2 className="h-8 w-8 text-white" />
              </div>

              {/* Heading */}
              <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">
                Together, We Can Build a
                <span className="block text-accent">
                  Cleaner & Safer Community
                </span>
              </h2>

              {/* Description */}
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
                Every report helps identify environmental hazards, protect
                public health, and empower communities to take meaningful
                action. Join thousands of citizens making a real difference
                through ECHO.
              </p>

              {/* Stats */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6">

                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="font-semibold">
                    Community Driven
                  </span>
                </div>

                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="font-semibold">
                    AI Powered Analysis
                  </span>
                </div>

                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="font-semibold">
                    Real-Time Monitoring
                  </span>
                </div>

              </div>

              {/* Buttons */}
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-card px-8 font-semibold text-primary hover:bg-white/90"
                >
                  <Link to="/report">
                    <ShieldAlert className="mr-2 h-5 w-5" />
                    Report a Hazard
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/40 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link to="/map">
                    <Map className="mr-2 h-5 w-5" />
                    View Live Hazard Map
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
