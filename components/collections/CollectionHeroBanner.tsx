"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  videoUrl?: string;
  stats?: {
    label: string;
    value: string;
  }[];
  cta?: {
    text: string;
    href: string;
  };
  className?: string;
}

export default function CollectionHeroBanner({
  title,
  subtitle,
  description,
  backgroundImage,
  videoUrl,
  stats = [],
  cta,
  className
}: HeroBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={cn("relative min-h-screen flex items-center justify-center overflow-hidden", className)}>
      {/* Background with parallax effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />

        {showVideo && videoUrl ? (
          <div className="absolute inset-0">
            <iframe
              src={videoUrl}
              className="w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className={cn(
              "object-cover transition-all duration-1000 transform",
              isLoaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
            )}
            priority
            sizes="100vw"
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-20 text-white text-center px-4 max-w-5xl mx-auto">
        <div className={cn(
          "space-y-8 transition-all duration-1000 delay-300 transform",
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">{subtitle}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            <span className="block">{title}</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* Stats */}
          {stats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 py-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-white/80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {cta && (
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6 rounded-full group"
                asChild
              >
                <a href={cta.href}>
                  {cta.text}
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            )}

            {videoUrl && (
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 rounded-full backdrop-blur-sm bg-white/10"
                onClick={() => setShowVideo(true)}
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Video
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}