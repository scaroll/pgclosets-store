'use client';

import React, { useState } from 'react';
import { Play, Grid, List } from 'lucide-react';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Badge } from '@/ui/badge';
import VideoModal from './VideoModal';

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  src: string;
  duration?: string;
  category?: string;
  views?: number;
  publishedAt?: string;
}

interface VideoGalleryProps {
  videos: Video[];
  title?: string;
  layout?: 'grid' | 'carousel' | 'list';
  columns?: 2 | 3 | 4;
  showFilters?: boolean;
  categories?: string[];
  className?: string;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  videos,
  title,
  layout = 'grid',
  columns = 3,
  showFilters = true,
  categories = [],
  className = '',
}) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>(layout as 'grid' | 'list');

  // Filter videos by category
  const filteredVideos = activeCategory === 'all'
    ? videos
    : videos.filter((video) => video.category === activeCategory);

  // Extract unique categories if not provided
  const availableCategories = categories.length > 0
    ? categories
    : Array.from(new Set(videos.map((v) => v.category).filter(Boolean)));

  const openVideoModal = (video: Video) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  // Format views count
  const formatViews = (views?: number) => {
    if (!views) return '';
    if (views < 1000) return `${views} views`;
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K views`;
    return `${(views / 1000000).toFixed(1)}M views`;
  };

  return (
    <section className={`py-8 ${className}`}>
      {/* Header */}
      {title && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">
            {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
          </p>
        </div>
      )}

      {/* Filters and view toggle */}
      {(showFilters || availableCategories.length > 0) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Category filters */}
          {availableCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={activeCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveCategory('all')}
              >
                All Videos
              </Button>
              {availableCategories.map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant={activeCategory === category ? 'default' : 'outline'}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}

          {/* Layout toggle */}
          {layout !== 'carousel' && (
            <div className="flex gap-1 border rounded-md p-1">
              <Button
                size="sm"
                variant={viewLayout === 'grid' ? 'secondary' : 'ghost'}
                onClick={() => setViewLayout('grid')}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewLayout === 'list' ? 'secondary' : 'ghost'}
                onClick={() => setViewLayout('list')}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Video grid */}
      {viewLayout === 'grid' && (
        <div
          className={`grid gap-6 ${
            columns === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : columns === 3
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}
        >
          {filteredVideos.map((video) => (
            <Card
              key={video.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => openVideoModal(video)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-8 h-8 text-primary ml-1" />
                  </div>
                </div>
                {/* Duration badge */}
                {video.duration && (
                  <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                    {video.duration}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Category */}
                {video.category && (
                  <Badge variant="secondary" className="mb-2">
                    {video.category}
                  </Badge>
                )}
                {/* Title */}
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                {/* Description */}
                {video.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {video.description}
                  </p>
                )}
                {/* Metadata */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {video.views && <span>{formatViews(video.views)}</span>}
                  {video.publishedAt && video.views && <span>•</span>}
                  {video.publishedAt && <span>{video.publishedAt}</span>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Video list */}
      {viewLayout === 'list' && (
        <div className="space-y-4">
          {filteredVideos.map((video) => (
            <Card
              key={video.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => openVideoModal(video)}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Thumbnail */}
                <div className="relative sm:w-72 aspect-video bg-muted flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                  </div>
                  {/* Duration badge */}
                  {video.duration && (
                    <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                      {video.duration}
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      {/* Category */}
                      {video.category && (
                        <Badge variant="secondary" className="mb-2">
                          {video.category}
                        </Badge>
                      )}
                      {/* Title */}
                      <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                  {/* Description */}
                  {video.description && (
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {video.views && <span>{formatViews(video.views)}</span>}
                    {video.publishedAt && video.views && <span>•</span>}
                    {video.publishedAt && <span>{video.publishedAt}</span>}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            No videos found in this category.
          </p>
          <Button onClick={() => setActiveCategory('all')}>
            Show All Videos
          </Button>
        </div>
      )}

      {/* Video modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          isOpen={!!selectedVideo}
          onClose={closeVideoModal}
          relatedVideos={videos.filter(
            (v) => v.id !== selectedVideo.id && v.category === selectedVideo.category
          )}
        />
      )}
    </section>
  );
};

export default VideoGallery;
