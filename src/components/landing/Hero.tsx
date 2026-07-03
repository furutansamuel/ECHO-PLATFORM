import React, { useRef } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const slides = [
    {
        image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/060df7fc-fb5a-4109-890a-cb6e43e9b598/community-cleanup-nigeria-ea6844ea-1782830747692.webp",
        headline: "Empowering Communities for a Cleaner Nigeria",
        subtext: "Join thousands of volunteers in community-led cleanups. Together, we can transform our environment, one neighborhood at a time.",
        primaryCta: "Report a Hazard",
        primaryLink: "/report",
        secondaryCta: "Track Reports",
        secondaryLink: "/reports",
    },
    {
        image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/060df7fc-fb5a-4109-890a-cb6e43e9b598/flood-resilience-nigeria-a1876433-1782830747950.webp",
        headline: "Building Resilience Against Environmental Challenges",
        subtext: "From flood control to waste management, ECHO provides the tools and data to build more resilient and sustainable communities.",
        primaryCta: "Explore the Map",
        primaryLink: "/map",
        secondaryCta: "Learn More",
        secondaryLink: "/knowledge",
    },
    {
        image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/060df7fc-fb5a-4109-890a-cb6e43e9b598/waste-management-nigeria-ee164d06-1782830748298.webp",
        headline: "Modernizing Waste Management for a Healthier Future",
        subtext: "Leverage our platform to report illegal dumpsites and support initiatives for effective waste sorting and recycling.",
        primaryCta: "Report a Dumpsite",
        primaryLink: "/report?category=illegal-dumpsite",
        secondaryCta: "See Impact",
        secondaryLink: "/rewards",
    },
    {
        image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/060df7fc-fb5a-4109-890a-cb6e43e9b598/ai-environmental-intelligence-nigeria-aab908d7-1782830748089.webp",
        headline: "AI-Powered Insights for Environmental Intelligence",
        subtext: "Our advanced AI analyzes reports to identify trends, predict risks, and guide community action for maximum impact.",
        primaryCta: "Discover AI Features",
        primaryLink: "/ai-intelligence",
        secondaryCta: "View Health Score",
        secondaryLink: "/community-health",
    },
];

export function Hero() {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <div className="relative w-full">
        <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{ loop: true }}
        >
            <CarouselContent>
            {slides.map((slide, index) => (
                <CarouselItem key={index}>
                    <div className="relative h-[60vh] md:h-[80vh] w-full">
                        <img src={slide.image} alt={slide.headline} className="h-full w-full object-cover"/>
                        <div className="absolute inset-0 bg-black/50" />
                        <div className="absolute inset-0 container mx-auto px-4 flex flex-col items-start justify-center text-white space-y-4 md:space-y-6">
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                {slide.headline}
                            </h1>
                            <p className="text-lg md:text-xl max-w-2xl text-white/90 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                                {slide.subtext}
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                                <Button size="lg" asChild>
                                    <Link to={slide.primaryLink}>{slide.primaryCta}</Link>
                                </Button>
                                <Button size="lg" variant="secondary" asChild>
                                    <Link to={slide.secondaryLink}>{slide.secondaryCta}</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CarouselItem>
            ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex" />
        </Carousel>
    </div>
  );
}
