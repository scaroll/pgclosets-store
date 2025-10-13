"use client";

import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ProjectImage {
  id: string;
  src: string;
  title: string;
  location: string;
  category: string;
  date: string;
  description?: string;
}

// Sample project data using actual images from your public folder
const projectImages: ProjectImage[] = [
  // Barn Door Projects
  {
    id: "project-1",
    src: "/images/arcat/renin_205721_hd.jpg",
    title: "Modern Barn Door Installation",
    location: "Kanata, ON",
    category: "Barn Doors",
    date: "January 2025",
    description: "Crochet Multi-X Design barn door with premium hardware"
  },
  {
    id: "project-2",
    src: "/images/arcat/renin_199063_hd.jpg",
    title: "Contemporary Barn Door System",
    location: "Orleans, ON",
    category: "Barn Doors",
    date: "January 2025",
    description: "Georgian 6-Panel design with smooth-glide track system"
  },
  {
    id: "project-3",
    src: "/images/arcat/renin_199065_hd.jpg",
    title: "Rustic Barn Door Project",
    location: "Nepean, ON",
    category: "Barn Doors",
    date: "December 2024",
    description: "Premium Renin barn door with custom finish"
  },

  // Bifold Door Projects
  {
    id: "project-4",
    src: "/images/arcat/renin_155701_Bifold_Closet_Door_Euro_1_Lite_v2.jpg",
    title: "Euro 1-Lite Bifold Installation",
    location: "Barrhaven, ON",
    category: "Bifold Doors",
    date: "December 2024",
    description: "Space-saving bifold doors with frosted glass panels"
  },
  {
    id: "project-5",
    src: "/images/arcat/renin_155731_Bifold_Closet_Door_Euro_3_Lite_v2.jpg",
    title: "Euro 3-Lite Bifold System",
    location: "Ottawa Downtown",
    category: "Bifold Doors",
    date: "November 2024",
    description: "Modern three-panel design with aluminum frames"
  },
  {
    id: "project-6",
    src: "/images/arcat/renin_176758_Bifold_Closet_Door_Parsons_Flush_Panel_Design.jpg",
    title: "Parsons Flush Panel Bifold",
    location: "Kanata Lakes",
    category: "Bifold Doors",
    date: "November 2024",
    description: "Clean, minimalist design perfect for modern homes"
  },

  // Bypass Door Projects
  {
    id: "project-7",
    src: "/images/arcat/renin_155706_Bypass_Closet_Doors_Parsons_Flush_Panel_Design_v2.jpg",
    title: "Parsons Bypass System",
    location: "Westboro, Ottawa",
    category: "Bypass Doors",
    date: "October 2024",
    description: "Smooth-sliding bypass doors with flush panel design"
  },
  {
    id: "project-8",
    src: "/images/arcat/renin_155725_Bypass_Closet_Doors_Euro_1_Lite_v2.jpg",
    title: "Euro 1-Lite Bypass Installation",
    location: "Riverside South",
    category: "Bypass Doors",
    date: "October 2024",
    description: "Contemporary bypass doors with single glass panel"
  },
  {
    id: "project-9",
    src: "/images/arcat/renin_155732_Bypass_Closet_Doors_Euro_3_Lite_v2.jpg",
    title: "Euro 3-Lite Bypass Project",
    location: "Findlay Creek",
    category: "Bypass Doors",
    date: "September 2024",
    description: "Three-panel glass bypass doors for maximum light"
  },
  {
    id: "project-10",
    src: "/images/arcat/renin_176725_Bypass_Closet_Doors_Georgian_6_Panel_Design.jpg",
    title: "Georgian 6-Panel Bypass",
    location: "Manotick, ON",
    category: "Bypass Doors",
    date: "September 2024",
    description: "Classic Georgian style with modern functionality"
  },
  {
    id: "project-11",
    src: "/images/arcat/renin_176728_Bypass_Closet_Doors_Ashbury_2_Panel_Design.jpg",
    title: "Ashbury 2-Panel Installation",
    location: "Stittsville, ON",
    category: "Bypass Doors",
    date: "August 2024",
    description: "Elegant two-panel design with traditional appeal"
  },
  {
    id: "project-12",
    src: "/images/arcat/renin_176733_Continental_Pavilion_5_Lite.jpg",
    title: "Continental Pavilion 5-Lite",
    location: "Glebe, Ottawa",
    category: "Bypass Doors",
    date: "August 2024",
    description: "Five-panel glass design for bright, open spaces"
  },

  // French Door Projects
  {
    id: "project-13",
    src: "/images/arcat/renin_176772_French_Door_Euro_10_Lite.jpg",
    title: "Euro 10-Lite French Doors",
    location: "Rockcliffe Park",
    category: "French Doors",
    date: "July 2024",
    description: "Elegant French doors with ten glass panels"
  },
  {
    id: "project-14",
    src: "/images/arcat/renin_176774_French_Door_Parsons_Flush_Panel_Design.jpg",
    title: "Parsons French Door System",
    location: "New Edinburgh",
    category: "French Doors",
    date: "July 2024",
    description: "Modern French doors with flush panel design"
  },
  {
    id: "project-15",
    src: "/images/arcat/renin_176777_French_Door_Provincial_8_Lite.jpg",
    title: "Provincial 8-Lite French Doors",
    location: "Sandy Hill",
    category: "French Doors",
    date: "June 2024",
    description: "Traditional Provincial style with eight glass panels"
  },

  // Pivot Door Projects
  {
    id: "project-16",
    src: "/images/arcat/renin_176756_Pivot_Door_Euro_1_Lite.jpg",
    title: "Euro 1-Lite Pivot Door",
    location: "Centretown, Ottawa",
    category: "Pivot Doors",
    date: "June 2024",
    description: "Modern pivot door with single glass panel"
  },
  {
    id: "project-17",
    src: "/images/arcat/renin_176757_Pivot_Door_Euro_3_Lite.jpg",
    title: "Euro 3-Lite Pivot Installation",
    location: "Hintonburg",
    category: "Pivot Doors",
    date: "May 2024",
    description: "Three-panel pivot door for contemporary spaces"
  },
  {
    id: "project-18",
    src: "/images/arcat/renin_176765_Pivot_Door_Provincial_8_Lite.jpg",
    title: "Provincial 8-Lite Pivot Door",
    location: "Alta Vista",
    category: "Pivot Doors",
    date: "May 2024",
    description: "Classic Provincial style in pivot configuration"
  },

  // Room Divider Projects
  {
    id: "project-19",
    src: "/images/arcat/renin_192853_hd.jpg",
    title: "Modern Room Divider System",
    location: "Bridlewood, Kanata",
    category: "Room Dividers",
    date: "April 2024",
    description: "Floor-to-ceiling room divider with steel frames"
  },
  {
    id: "project-20",
    src: "/images/arcat/renin_192856_hd.jpg",
    title: "Glass Panel Room Divider",
    location: "Hunt Club, Ottawa",
    category: "Room Dividers",
    date: "April 2024",
    description: "Transparent room divider maintaining open feel"
  }
];

const categories = ["All", "Barn Doors", "Bifold Doors", "Bypass Doors", "French Doors", "Pivot Doors", "Room Dividers"];

export function StaticProjectGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProjects = projectImages.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{filteredProjects.length} projects</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            )}
          </Button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No projects match your search criteria.
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="aspect-square relative bg-gray-100">
                  <Image
                    src={project.src}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-white/90 text-gray-700 backdrop-blur-sm">
                      {project.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{project.location}</p>
                  {project.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">{project.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">{project.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 relative bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={project.src}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">{project.location}</p>
                        {project.description && (
                          <p className="text-sm text-gray-500">{project.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge variant="secondary">{project.category}</Badge>
                        <p className="text-xs text-gray-400">{project.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}