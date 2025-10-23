"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Lightbulb,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Calendar,
  Clock,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Trend {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
}

interface DesignTip {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  time: string;
  tools: string[];
  rating: number;
}

interface DesignTipsTrendsProps {
  trends: Trend[];
  tips: DesignTip[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function DesignTipsTrends({
  trends,
  tips,
  title = "Design Tips & Trends",
  subtitle = "Stay updated with the latest interior design trends and expert advice",
  className
}: DesignTipsTrendsProps) {
  const [activeTab, setActiveTab] = useState('trends');

  const featuredTrends = trends.filter(t => t.featured);
  const regularTrends = trends.filter(t => !t.featured);

  const difficultyColors = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800'
  };

  return (
    <section className={cn("py-16 md:py-24 bg-white", className)}>
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="trends" className="text-lg px-6 py-3">
              <TrendingUp className="w-5 h-5 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="tips" className="text-lg px-6 py-3">
              <Lightbulb className="w-5 h-5 mr-2" />
              Design Tips
            </TabsTrigger>
          </TabsList>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-12">
            {/* Featured Trends */}
            {featuredTrends.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-8 text-gray-900">Featured Trends</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {featuredTrends.map((trend) => (
                    <Card key={trend.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                      <div className="relative h-64">
                        <Image
                          src={trend.image}
                          alt={trend.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-red-500 text-white">Featured</Badge>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {trend.publishedAt}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {trend.readTime}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">{trend.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{trend.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            {trend.category}
                          </Badge>
                          <Button variant="ghost" className="text-teal-600 hover:text-teal-700 p-0">
                            Read More
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Trends Grid */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-gray-900">Latest Trends</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularTrends.map((trend) => (
                  <Card key={trend.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-48">
                      <Image
                        src={trend.image}
                        alt={trend.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {trend.publishedAt}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {trend.readTime}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-gray-900">{trend.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{trend.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {trend.category}
                        </Badge>
                        <Button variant="ghost" className="text-teal-600 hover:text-teal-700 p-0 text-sm">
                          Read More
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Design Tips Tab */}
          <TabsContent value="tips" className="space-y-12">
            {/* Featured Tips */}
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-8 text-gray-900">Expert Design Tips</h3>
                <div className="space-y-6">
                  {tips.slice(0, 3).map((tip) => (
                    <Card key={tip.id} className="p-6 shadow-md hover:shadow-lg transition-shadow">
                      <div className="flex gap-6">
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={tip.image}
                            alt={tip.title}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={difficultyColors[tip.difficulty]}>
                              {tip.difficulty}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="w-3 h-3" />
                              {tip.time}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              {tip.rating}
                            </div>
                          </div>
                          <h4 className="text-lg font-bold mb-2 text-gray-900">{tip.title}</h4>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tip.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {tip.tools.slice(0, 3).map((tool, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                          <Button variant="ghost" className="text-teal-600 hover:text-teal-700 p-0 text-sm">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Tips Sidebar */}
              <div>
                <Card className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
                  <div className="flex items-center gap-2 mb-6">
                    <Lightbulb className="w-6 h-6 text-teal-600" />
                    <h3 className="text-xl font-bold text-gray-900">Quick Tips</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      "Always measure your space twice before purchasing doors",
                      "Consider the swing direction when planning door placement",
                      "Match door hardware with other room fixtures for cohesion",
                      "Choose glass inserts to create an illusion of more space",
                      "Install weatherstripping for energy efficiency"
                    ].map((tip, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Resources */}
                <Card className="p-6 mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-bold text-gray-900">Resources</h3>
                  </div>
                  <div className="space-y-3">
                    <Button variant="ghost" className="w-full justify-between p-3 hover:bg-gray-50">
                      <span className="text-sm">Door Installation Guide</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" className="w-full justify-between p-3 hover:bg-gray-50">
                      <span className="text-sm">Measurement Checklist</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" className="w-full justify-between p-3 hover:bg-gray-50">
                      <span className="text-sm">Style Guide PDF</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="text-center mt-16">
          <Card className="p-8 bg-gradient-to-r from-teal-600 to-blue-600 text-white">
            <h3 className="text-2xl font-bold mb-4">Need Personalized Design Advice?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Our design experts are here to help you create the perfect space. Book a free consultation today.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              Book Free Consultation
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}