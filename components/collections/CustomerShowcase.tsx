"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Quote,
  Star,
  MapPin,
  Home,
  Calendar,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  customerName: string;
  customerAvatar?: string;
  location: string;
  roomType: string;
  projectDate: string;
  beforeImage: string;
  afterImage: string;
  testimonial: string;
  rating: number;
  products: string[];
  tags: string[];
  featured?: boolean;
}

interface CustomerShowcaseProps {
  projects: Project[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function CustomerShowcase({
  projects,
  title = "Customer Project Showcase",
  subtitle = "Real transformations from our satisfied customers",
  className
}: CustomerShowcaseProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showBefore, setShowBefore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredProjects = projects.filter(p => p.featured);
  const regularProjects = projects.filter(p => !p.featured);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < rating ? "text-yellow-500 fill-current" : "text-gray-300"
        )}
      />
    ));
  };

  const ProjectCard = ({ project, size = 'normal' }: { project: Project; size?: 'normal' | 'featured' }) => (
    <Card
      className={cn(
        "group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer",
        size === 'featured' ? "md:col-span-2" : "",
        "hover:-translate-y-1"
      )}
      onClick={() => {
        setSelectedProject(project);
        setShowBefore(true);
      }}
    >
      {/* Image Comparison */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.afterImage}
          alt={`${project.customerName}'s ${project.roomType} - After`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Before/After Toggle */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Badge className="bg-white text-gray-900 font-semibold px-4 py-2">
            View Before & After
          </Badge>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <Badge className="absolute top-4 left-4 bg-red-500 text-white">
            Featured Project
          </Badge>
        )}

        {/* Rating */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          {renderStars(project.rating)}
          <span className="text-sm font-medium">({project.rating})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Customer Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              {project.customerAvatar ? (
                <AvatarImage src={project.customerAvatar} alt={project.customerName} />
              ) : (
                <AvatarFallback className="bg-teal-100 text-teal-600 font-semibold">
                  {project.customerName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h4 className="font-semibold text-gray-900">{project.customerName}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-3 h-3" />
                {project.location}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="w-3 h-3" />
              {project.projectDate}
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mb-4">
          <Quote className="w-8 h-8 text-teal-600 mb-2" />
          <p className="text-gray-700 italic line-clamp-3">{project.testimonial}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Products Used */}
        <div className="text-sm text-gray-600">
          <span className="font-medium">Products: </span>
          {project.products.slice(0, 2).join(', ')}
          {project.products.length > 2 && ` +${project.products.length - 2} more`}
        </div>
      </div>
    </Card>
  );

  return (
    <section className={cn("py-16 md:py-24 bg-gray-50", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center text-gray-900">Featured Transformations</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} size="featured" />
              ))}
            </div>
          </div>
        )}

        {/* All Projects Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center text-gray-900">Recent Projects</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Project Modal/Detail View */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white"
              >
                ×
              </button>

              {/* Image Comparison */}
              <div className="relative aspect-video bg-gray-100">
                <Image
                  src={showBefore ? selectedProject.beforeImage : selectedProject.afterImage}
                  alt={`${selectedProject.customerName}'s project - ${showBefore ? 'Before' : 'After'}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />

                {/* Toggle Buttons */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <Button
                    variant={showBefore ? "default" : "secondary"}
                    className="rounded-full"
                    onClick={() => setShowBefore(true)}
                  >
                    Before
                  </Button>
                  <Button
                    variant={!showBefore ? "default" : "secondary"}
                    className="rounded-full"
                    onClick={() => setShowBefore(false)}
                  >
                    After
                  </Button>
                </div>

                {/* Navigation */}
                <button
                  onClick={() => {
                    const newIndex = currentIndex > 0 ? currentIndex - 1 : projects.length - 1;
                    setCurrentIndex(newIndex);
                    setSelectedProject(projects[newIndex]);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => {
                    const newIndex = currentIndex < projects.length - 1 ? currentIndex + 1 : 0;
                    setCurrentIndex(newIndex);
                    setSelectedProject(projects[newIndex]);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Project Details */}
              <div className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Customer Info */}
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="w-16 h-16">
                        {selectedProject.customerAvatar ? (
                          <AvatarImage src={selectedProject.customerAvatar} alt={selectedProject.customerName} />
                        ) : (
                          <AvatarFallback className="bg-teal-100 text-teal-600 text-xl font-semibold">
                            {selectedProject.customerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{selectedProject.customerName}</h3>
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin className="w-4 h-4" />
                          {selectedProject.location}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Home className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Room Type</div>
                          <div className="font-medium">{selectedProject.roomType}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Completed</div>
                          <div className="font-medium">{selectedProject.projectDate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Rating</div>
                          <div className="flex items-center gap-1">
                            {renderStars(selectedProject.rating)}
                            <span className="font-medium ml-1">{selectedProject.rating}.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial & Products */}
                  <div className="md:col-span-2">
                    <div className="mb-8">
                      <Quote className="w-12 h-12 text-teal-600 mb-4" />
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {selectedProject.testimonial}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Products Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.products.map((product, index) => (
                          <Badge key={index} variant="outline" className="border-teal-600 text-teal-600">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
                  <Button variant="outline" className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Save Project
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
                    Get Similar Look
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <Card className="p-8 bg-white">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Share Your Project</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Completed your own renovation with our products? We'd love to feature your transformation!
            </p>
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
              Submit Your Project
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}