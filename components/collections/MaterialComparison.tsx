"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Check,
  X,
  Star,
  Shield,
  DollarSign,
  Zap,
  Droplets,
  Sun,
  Wind
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Material {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  durability: number;
  maintenance: number;
  installation: number;
  pros: string[];
  cons: string[];
  bestFor: string[];
  features: {
    waterResistant: boolean;
    soundproof: boolean;
    ecoFriendly: boolean;
    paintable: boolean;
  };
}

interface MaterialComparisonProps {
  materials: Material[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function MaterialComparison({
  materials,
  title = "Material Comparison Tool",
  subtitle = "Compare different door materials to find the perfect choice for your space",
  className
}: MaterialComparisonProps) {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([materials[0]?.id, materials[1]?.id]);
  const [compareMode, setCompareMode] = useState<'features' | 'pricing' | 'performance'>('features');

  const toggleMaterial = (materialId: string) => {
    setSelectedMaterials(prev => {
      if (prev.includes(materialId)) {
        return prev.filter(id => id !== materialId);
      } else if (prev.length < 3) {
        return [...prev, materialId];
      }
      return prev;
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

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

  const selectedMaterialsData = materials.filter(m => selectedMaterials.includes(m.id));

  return (
    <section className={cn("py-16 md:py-24 bg-white", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Material Selection */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-6 text-gray-900">Select Materials to Compare (Max 3)</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {materials.map((material) => (
              <Card
                key={material.id}
                className={cn(
                  "cursor-pointer transition-all duration-300 overflow-hidden",
                  selectedMaterials.includes(material.id)
                    ? "ring-2 ring-teal-600 shadow-lg"
                    : "hover:shadow-md"
                )}
                onClick={() => toggleMaterial(material.id)}
              >
                <div className="relative">
                  <img
                    src={material.image}
                    alt={material.name}
                    className="w-full h-32 object-cover"
                  />
                  {selectedMaterials.includes(material.id) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{material.name}</h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{material.description}</p>
                  <Badge variant="outline" className="text-xs">
                    From {material.price}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        {selectedMaterialsData.length >= 2 && (
          <div className="bg-gray-50 rounded-xl p-6 mb-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Comparison Results</h3>
              <div className="flex gap-2">
                <Button
                  variant={compareMode === 'features' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCompareMode('features')}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Features
                </Button>
                <Button
                  variant={compareMode === 'pricing' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCompareMode('pricing')}
                >
                  Pricing
                </Button>
                <Button
                  variant={compareMode === 'performance' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCompareMode('performance')}
                >
                  Performance
                </Button>
              </div>
            </div>

            <Tabs value={compareMode} onValueChange={(value) => setCompareMode(value as any)}>
              {/* Features Comparison */}
              <TabsContent value="features" className="mt-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                        {selectedMaterialsData.map((material) => (
                          <th key={material.id} className="text-center py-4 px-6">
                            <div className="font-semibold text-gray-900">{material.name}</div>
                            <div className="text-sm text-gray-600 font-normal">{material.price}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-4 px-6 font-medium text-gray-700 flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Water Resistant
                        </td>
                        {selectedMaterialsData.map((material) => (
                          <td key={material.id} className="text-center py-4 px-6">
                            {material.features.waterResistant ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-600 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-4 px-6 font-medium text-gray-700 flex items-center gap-2">
                          <Wind className="w-4 h-4" />
                          Soundproof
                        </td>
                        {selectedMaterialsData.map((material) => (
                          <td key={material.id} className="text-center py-4 px-6">
                            {material.features.soundproof ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-600 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-4 px-6 font-medium text-gray-700 flex items-center gap-2">
                          <Droplets className="w-4 h-4" />
                          Eco Friendly
                        </td>
                        {selectedMaterialsData.map((material) => (
                          <td key={material.id} className="text-center py-4 px-6">
                            {material.features.ecoFriendly ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-600 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-4 px-6 font-medium text-gray-700 flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Paintable
                        </td>
                        {selectedMaterialsData.map((material) => (
                          <td key={material.id} className="text-center py-4 px-6">
                            {material.features.paintable ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-600 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* Performance Comparison */}
              <TabsContent value="performance" className="mt-0">
                <div className="grid md:grid-cols-3 gap-6">
                  {selectedMaterialsData.map((material) => (
                    <Card key={material.id} className="p-6">
                      <h4 className="text-lg font-bold mb-4 text-gray-900">{material.name}</h4>

                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Durability</span>
                            <span className={cn("text-sm font-bold", getScoreColor(material.durability))}>
                              {material.durability}/5
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {renderStars(material.durability)}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Maintenance</span>
                            <span className={cn("text-sm font-bold", getScoreColor(material.maintenance))}>
                              {material.maintenance}/5
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {renderStars(material.maintenance)}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Installation</span>
                            <span className={cn("text-sm font-bold", getScoreColor(material.installation))}>
                              {material.installation}/5
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {renderStars(material.installation)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h5 className="text-sm font-semibold text-gray-900 mb-3">Best For:</h5>
                        <div className="flex flex-wrap gap-2">
                          {material.bestFor.map((use, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {use}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Detailed Material Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedMaterialsData.map((material) => (
            <Card key={material.id} className="overflow-hidden">
              <img
                src={material.image}
                alt={material.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">{material.name}</h3>
                <p className="text-gray-600 mb-4">{material.description}</p>

                <div className="mb-6">
                  <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Pros
                  </h4>
                  <ul className="space-y-1">
                    {material.pros.map((pro, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Cons
                  </h4>
                  <ul className="space-y-1">
                    {material.cons.map((con, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  View {material.name} Products
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Card className="p-8 bg-gradient-to-r from-teal-600 to-blue-600 text-white">
            <h3 className="text-2xl font-bold mb-4">Need Help Choosing?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Our design experts can help you select the perfect material based on your specific needs and budget.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              Get Expert Advice
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}