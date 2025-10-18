"use client";

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import StandardLayout from '@/components/layout/StandardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dynamically import dialog components (only used when opening modals)
const Dialog = dynamic(() => import('@/components/ui/dialog').then(mod => ({ default: mod.Dialog })), { ssr: false });
const DialogContent = dynamic(() => import('@/components/ui/dialog').then(mod => ({ default: mod.DialogContent })), { ssr: false });
const DialogHeader = dynamic(() => import('@/components/ui/dialog').then(mod => ({ default: mod.DialogHeader })), { ssr: false });
const DialogTitle = dynamic(() => import('@/components/ui/dialog').then(mod => ({ default: mod.DialogTitle })), { ssr: false });
const DialogTrigger = dynamic(() => import('@/components/ui/dialog').then(mod => ({ default: mod.DialogTrigger })), { ssr: false });
const Input = dynamic(() => import('@/components/ui/input').then(mod => ({ default: mod.Input })), { ssr: false });
const Label = dynamic(() => import('@/components/ui/label').then(mod => ({ default: mod.Label })), { ssr: false });
const Textarea = dynamic(() => import('@/components/ui/textarea').then(mod => ({ default: mod.Textarea })), { ssr: false });
import {
  Play,
  Star,
  Heart,
  Share2,
  Download,
  Mail,
  ArrowRight,
  Lightbulb,
  Palette,
  Maximize2,
  Settings,
  Save,
  Send,
  Eye,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import type {
  VisualizerConfig,
  SavedDesign,
  PopularCombination
} from '@/types/visualizer';

// Dynamically import the lazy visualizer for better performance
const LazyVisualizer = dynamic(
  () => import('@/components/performance/lazy-visualizer'),
  { ssr: false }
);

// Mock data for popular combinations
const popularCombinations: PopularCombination[] = [
  {
    id: '1',
    name: 'Modern Minimalist',
    description: 'Clean lines with matte black finish in a contemporary living space',
    config: {} as VisualizerConfig, // Simplified for demo
    thumbnail: '/images/combinations/modern-minimalist.jpg',
    popularity: 95,
    category: 'modern'
  },
  {
    id: '2',
    name: 'Rustic Farmhouse',
    description: 'Natural oak barn door perfect for cozy bedroom aesthetics',
    config: {} as VisualizerConfig,
    thumbnail: '/images/combinations/rustic-farmhouse.jpg',
    popularity: 87,
    category: 'rustic'
  },
  {
    id: '3',
    name: 'Industrial Chic',
    description: 'Bronze finish sliding door ideal for modern office spaces',
    config: {} as VisualizerConfig,
    thumbnail: '/images/combinations/industrial-chic.jpg',
    popularity: 78,
    category: 'industrial'
  },
  {
    id: '4',
    name: 'Elegant Traditional',
    description: 'White wash finish for timeless hallway sophistication',
    config: {} as VisualizerConfig,
    thumbnail: '/images/combinations/elegant-traditional.jpg',
    popularity: 82,
    category: 'traditional'
  }
];

const features = [
  {
    icon: Palette,
    title: 'Endless Customization',
    description: 'Choose from dozens of finishes, sizes, and room backgrounds'
  },
  {
    icon: Eye,
    title: 'Real-time Preview',
    description: 'See your design changes instantly with high-quality rendering'
  },
  {
    icon: Save,
    title: 'Save & Share',
    description: 'Save your designs and share them with family, friends, or contractors'
  },
  {
    icon: Download,
    title: 'High-res Downloads',
    description: 'Download professional-quality images for your project planning'
  }
];

const howItWorks = [
  {
    step: 1,
    title: 'Choose Your Room',
    description: 'Select from our collection of professionally photographed room backgrounds',
    icon: Settings
  },
  {
    step: 2,
    title: 'Pick Your Door Style',
    description: 'Browse through our premium Renin door collection and find your perfect match',
    icon: Palette
  },
  {
    step: 3,
    title: 'Customize Finish & Size',
    description: 'Fine-tune your selection with different finishes, colors, and dimensions',
    icon: Maximize2
  },
  {
    step: 4,
    title: 'Save & Get Quote',
    description: 'Save your design and request a personalized quote from our experts',
    icon: Send
  }
];

export default function VisualizerPage() {
  const [currentConfig, setCurrentConfig] = useState<VisualizerConfig | null>(null);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('visualizer');

  // Email form state
  const [emailForm, setEmailForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    includeDesign: true,
    requestQuote: false
  });

  const handleConfigChange = useCallback((config: VisualizerConfig) => {
    setCurrentConfig(config);
  }, []);

  const handleSaveDesign = useCallback((design: SavedDesign) => {
    setSavedDesigns(prev => [...prev, design]);
  }, []);

  const loadPopularCombination = useCallback((combination: PopularCombination) => {
    setCurrentConfig(combination.config);
    setActiveTab('visualizer');
  }, []);

  const sendEmail = useCallback(async () => {
    // In a real implementation, this would send the email with design details
    console.log('Sending email with design:', emailForm);
    setEmailDialogOpen(false);
    // Reset form
    setEmailForm({
      name: '',
      email: '',
      phone: '',
      message: '',
      includeDesign: true,
      requestQuote: false
    });
  }, [emailForm]);

  return (
    <StandardLayout>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-pg-navy to-pg-sky text-white">
                <Sparkles className="w-4 h-4 mr-2" />
                New Interactive Tool
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Design Your Perfect
                <span className="bg-gradient-to-r from-pg-navy to-pg-sky bg-clip-text text-transparent"> Door</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Use our advanced visualizer to see exactly how Renin doors will look in your space.
                Customize styles, finishes, and sizes with real-time previews.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pg-navy to-pg-sky hover:shadow-lg transform hover:scale-105 transition-all"
                  onClick={() => setActiveTab('visualizer')}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Designing
                </Button>
                <Button size="lg" variant="outline">
                  <Eye className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-pg-navy mb-2">50+</div>
                <div className="text-gray-600">Door Styles</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-pg-navy mb-2">25+</div>
                <div className="text-gray-600">Finish Options</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-pg-navy mb-2">10k+</div>
                <div className="text-gray-600">Designs Created</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-pg-navy mb-2">98%</div>
                <div className="text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="visualizer" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Visualizer
                </TabsTrigger>
                <TabsTrigger value="popular" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Popular Designs
                </TabsTrigger>
                <TabsTrigger value="how-it-works" className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  How It Works
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visualizer" className="space-y-8">
                {/* Interactive Visualizer */}
                <LazyVisualizer
                  initialConfig={currentConfig || undefined}
                  onConfigChange={handleConfigChange}
                  onSave={handleSaveDesign}
                />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" disabled={!currentConfig}>
                        <Mail className="w-5 h-5 mr-2" />
                        Email My Design
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Email Your Design</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={emailForm.name}
                            onChange={(e) => setEmailForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={emailForm.email}
                            onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={emailForm.phone}
                            onChange={(e) => setEmailForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            value={emailForm.message}
                            onChange={(e) => setEmailForm(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="Any specific requirements or questions..."
                            rows={3}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="request-quote"
                            checked={emailForm.requestQuote}
                            onChange={(e) => setEmailForm(prev => ({ ...prev, requestQuote: e.target.checked }))}
                            className="rounded"
                          />
                          <Label htmlFor="request-quote" className="text-sm">
                            Request a personalized quote
                          </Label>
                        </div>
                        <Button
                          onClick={sendEmail}
                          disabled={!emailForm.name || !emailForm.email}
                          className="w-full"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Design
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button size="lg" variant="outline" asChild>
                    <Link href="/contact">
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Get Professional Quote
                    </Link>
                  </Button>
                </div>

                {/* Saved Designs */}
                {savedDesigns.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Save className="w-5 h-5" />
                      Your Saved Designs ({savedDesigns.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {savedDesigns.map((design) => (
                        <Card key={design.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                          <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                            <Image
                              src={design.thumbnail}
                              alt={design.name}
                              width={300}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4 className="font-medium mb-1">{design.name}</h4>
                          <p className="text-sm text-gray-500 mb-2">
                            Created {design.createdAt.toLocaleDateString()}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setCurrentConfig(design.config)}
                            >
                              Load
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="popular" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Design Combinations</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Get inspired by our most popular door and room combinations, loved by hundreds of customers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularCombinations.map((combination) => (
                    <Card key={combination.id} className="group cursor-pointer hover:shadow-xl transition-all overflow-hidden">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={combination.thumbnail}
                          alt={combination.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-white/90 text-gray-800">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {combination.popularity}%
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-4 left-4 right-4">
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => loadPopularCombination(combination)}
                            >
                              Try This Design
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{combination.name}</h3>
                          <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{combination.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {combination.category}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-500">4.9</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <Button variant="outline" size="lg">
                    View All Popular Designs
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="how-it-works" className="space-y-12">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">How Our Visualizer Works</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Design your perfect door in minutes with our easy-to-use visualization tool.
                  </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {howItWorks.map((step) => (
                    <div key={step.step} className="text-center">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-pg-navy to-pg-sky rounded-full flex items-center justify-center mx-auto mb-4">
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-pg-navy rounded-full flex items-center justify-center text-sm font-bold text-pg-navy">
                          {step.step}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  ))}
                </div>

                {/* Features Grid */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-center mb-8">Why Choose Our Visualizer?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                      <div key={index} className="text-center p-4">
                        <div className="w-12 h-12 bg-pg-sky/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <feature.icon className="w-6 h-6 text-pg-navy" />
                        </div>
                        <h4 className="font-semibold mb-2">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pg-navy to-pg-sky"
                    onClick={() => setActiveTab('visualizer')}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Your Design Now
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-pg-navy to-pg-sky text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join 1,700+ satisfied customers who have designed their perfect doors with our visualizer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-pg-navy hover:bg-gray-100"
                onClick={() => setActiveTab('visualizer')}
              >
                <Palette className="w-5 h-5 mr-2" />
                Start Designing
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pg-navy" asChild>
                <Link href="/contact">
                  <Users className="w-5 h-5 mr-2" />
                  Talk to Expert
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </StandardLayout>
  );
}