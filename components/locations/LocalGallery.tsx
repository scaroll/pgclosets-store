'use client';

import { useState } from 'react';
import Image from 'next/image';
import { colors, typography, radius, shadows } from '@/lib/design-tokens';
import type { Project } from '@/lib/locations';

interface LocalGalleryProps {
  projects: Project[];
  locationName: string;
}

type DoorType = 'all' | 'barn' | 'bypass' | 'bifold' | 'pivot' | 'room-divider';

export function LocalGallery({ projects, locationName }: LocalGalleryProps) {
  const [filter, setFilter] = useState<DoorType>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);
  const [showBefore, setShowBefore] = useState(true);

  const filteredProjects = projects.filter(
    (project) => filter === 'all' || project.doorType === filter
  );

  const doorTypeLabels: Record<DoorType, string> = {
    all: 'All Projects',
    barn: 'Barn Doors',
    bypass: 'Bypass Doors',
    bifold: 'Bifold Doors',
    pivot: 'Pivot Doors',
    'room-divider': 'Room Dividers'
  };

  const openLightbox = (project: Project) => {
    setLightboxProject(project);
    setLightboxOpen(true);
    setShowBefore(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxProject(null);
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-light tracking-tight mb-4"
            style={{
              fontFamily: typography.fonts.display,
              color: colors.brand.charcoal
            }}
          >
            Recent Projects in {locationName}
          </h2>
          <p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: typography.fonts.body }}
          >
            See the transformation in homes just like yours
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {(Object.keys(doorTypeLabels) as DoorType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: filter === type ? colors.brand.navy : 'white',
                color: filter === type ? 'white' : colors.gray[700],
                borderRadius: radius.full,
                boxShadow: filter === type ? shadows.md : shadows.sm
              }}
            >
              {doorTypeLabels[type]}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group cursor-pointer"
              onClick={() => openLightbox(project)}
            >
              <div
                className="relative aspect-[4/3] overflow-hidden mb-4"
                style={{
                  borderRadius: radius.xl,
                  boxShadow: shadows.md
                }}
              >
                {/* After Image */}
                <Image
                  src={project.afterImage}
                  alt={`${project.title} - After`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="text-sm font-medium mb-1">Click to view before & after</div>
                  </div>
                </div>

                {/* Door Type Badge */}
                <div
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: colors.brand.navy
                  }}
                >
                  {project.doorType.split('-').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </div>
              </div>

              {/* Project Info */}
              <div className="px-2">
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{
                    fontFamily: typography.fonts.body,
                    color: colors.brand.charcoal
                  }}
                >
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {project.neighborhood}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600">No projects found for this filter</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="/request-work"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: colors.brand.navy,
              borderRadius: radius.lg
            }}
          >
            Start Your Project
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && lightboxProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden"
            style={{ borderRadius: radius['2xl'] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-white"
              style={{ boxShadow: shadows.lg }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Container */}
            <div className="relative aspect-[16/9] bg-gray-100">
              <Image
                src={showBefore ? lightboxProject.beforeImage : lightboxProject.afterImage}
                alt={`${lightboxProject.title} - ${showBefore ? 'Before' : 'After'}`}
                fill
                className="object-contain"
              />

              {/* Before/After Label */}
              <div
                className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white'
                }}
              >
                {showBefore ? 'Before' : 'After'}
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3
                    className="text-2xl font-light mb-2"
                    style={{
                      fontFamily: typography.fonts.display,
                      color: colors.brand.charcoal
                    }}
                  >
                    {lightboxProject.title}
                  </h3>
                  <p className="text-gray-600">{lightboxProject.description}</p>
                </div>
              </div>

              {/* Toggle Button */}
              <button
                onClick={() => setShowBefore(!showBefore)}
                className="w-full px-6 py-3 rounded-lg font-medium text-white transition-all duration-200"
                style={{
                  backgroundColor: colors.brand.navy,
                  borderRadius: radius.lg
                }}
              >
                {showBefore ? 'View After →' : '← View Before'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
