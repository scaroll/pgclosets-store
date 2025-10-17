'use client';

import React, { useEffect } from 'react';
import { X, ExternalLink, Share2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import VideoPlayer from './VideoPlayer';
import { toast } from 'sonner';

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

interface VideoModalProps {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
  relatedVideos?: Video[];
  showTranscript?: boolean;
  transcript?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  video,
  isOpen,
  onClose,
  relatedVideos = [],
  showTranscript = false,
  transcript,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle share
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/videos/${video.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description || 'Check out this video from PG Closets',
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  // Handle video analytics
  const handleVideoPlay = () => {
    // Track video play event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'video_play', {
        event_category: 'Video',
        event_label: video.title,
        video_id: video.id,
      });
    }
  };

  const handleVideoComplete = () => {
    // Track video completion event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'video_complete', {
        event_category: 'Video',
        event_label: video.title,
        video_id: video.id,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video player */}
        <div className="relative bg-black">
          <VideoPlayer
            src={video.src}
            poster={video.thumbnail}
            title={video.title}
            controls={true}
            onPlay={handleVideoPlay}
            onEnded={handleVideoComplete}
            trackAnalytics={true}
            className="w-full"
          />
        </div>

        {/* Video details */}
        <div className="p-6">
          {/* Title and actions */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              {video.category && (
                <Badge variant="secondary" className="mb-2">
                  {video.category}
                </Badge>
              )}
              <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
              {video.views && video.publishedAt && (
                <p className="text-sm text-muted-foreground">
                  {video.views.toLocaleString()} views • {video.publishedAt}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleShare}
                aria-label="Share video"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(video.src, '_blank')}
                aria-label="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Description */}
          {video.description && (
            <div className="mb-6">
              <p className="text-muted-foreground whitespace-pre-line">
                {video.description}
              </p>
            </div>
          )}

          {/* Transcript (if provided) */}
          {showTranscript && transcript && (
            <details className="mb-6 border rounded-lg p-4">
              <summary className="cursor-pointer font-semibold mb-2 hover:text-primary transition-colors">
                Show Transcript
              </summary>
              <div className="text-sm text-muted-foreground whitespace-pre-line mt-2">
                {transcript}
              </div>
            </details>
          )}

          {/* Related videos */}
          {relatedVideos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Related Videos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedVideos.slice(0, 3).map((relatedVideo) => (
                  <div
                    key={relatedVideo.id}
                    className="group cursor-pointer"
                    onClick={() => {
                      // Replace current video with related video
                      window.location.href = `/videos/${relatedVideo.id}`;
                    }}
                  >
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-2">
                      <img
                        src={relatedVideo.thumbnail}
                        alt={relatedVideo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {relatedVideo.duration && (
                        <Badge className="absolute bottom-2 right-2 bg-black/80 text-white text-xs">
                          {relatedVideo.duration}
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {relatedVideo.title}
                    </h4>
                    {relatedVideo.views && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {relatedVideo.views.toLocaleString()} views
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
