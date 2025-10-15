'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { Badge } from '@/ui/badge';

interface VideoThumbnailProps {
  thumbnail: string;
  title: string;
  duration?: string;
  onClick: () => void;
  showPlayButton?: boolean;
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:3';
  className?: string;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  thumbnail,
  title,
  duration,
  onClick,
  showPlayButton = true,
  aspectRatio = '16:9',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '9:16': 'aspect-[9/16]',
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
  };

  return (
    <div
      className={`relative ${aspectRatioClasses[aspectRatio]} bg-muted rounded-lg overflow-hidden cursor-pointer group ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Play video: ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {/* Thumbnail image */}
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />

      {/* Play button overlay */}
      {showPlayButton && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-primary ml-1" />
          </div>
        </div>
      )}

      {/* Duration badge */}
      {duration && (
        <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
          {duration}
        </Badge>
      )}
    </div>
  );
};

export default VideoThumbnail;
