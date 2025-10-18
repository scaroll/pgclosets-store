'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card } from '@/ui/card';
import { Avatar } from '@/ui/avatar';
import VideoPlayer from './VideoPlayer';

interface VideoTestimonialProps {
  videoSrc: string;
  thumbnail: string;
  customerName: string;
  customerPhoto?: string;
  location?: string;
  rating: number;
  quote: string;
  projectType?: string;
  className?: string;
}

export const VideoTestimonial: React.FC<VideoTestimonialProps> = ({
  videoSrc,
  thumbnail,
  customerName,
  customerPhoto,
  location,
  rating,
  quote,
  projectType,
  className = '',
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Video */}
      <VideoPlayer
        src={videoSrc}
        poster={thumbnail}
        title={`${customerName}'s testimonial`}
        controls={true}
        trackAnalytics={true}
      />

      {/* Content */}
      <div className="p-6">
        {/* Customer info */}
        <div className="flex items-center gap-4 mb-4">
          {customerPhoto && (
            <Avatar className="w-12 h-12">
              <img src={customerPhoto} alt={customerName} />
            </Avatar>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{customerName}</h3>
            {location && (
              <p className="text-sm text-muted-foreground">{location}</p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`w-5 h-5 ${
                index < rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating}.0 out of 5
          </span>
        </div>

        {/* Project type */}
        {projectType && (
          <p className="text-sm font-medium text-primary mb-3">
            Project: {projectType}
          </p>
        )}

        {/* Quote */}
        <div className="relative pl-8">
          <Quote className="absolute left-0 top-0 w-6 h-6 text-primary/20" />
          <p className="text-muted-foreground italic">{quote}</p>
        </div>
      </div>
    </Card>
  );
};

export default VideoTestimonial;
