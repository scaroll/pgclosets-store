"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Download,
  Share2,
  RotateCw,
  Eye,
  EyeOff,
  Save,
  Mail,
  Facebook,
  Twitter,
  MessageCircle,
  Link
} from 'lucide-react';
import type {
  RoomBackground,
  DoorStyle,
  DoorFinish,
  DoorSize,
  VisualizerConfig,
  SavedDesign,
  VisualizerShare
} from '@/types/visualizer';

// Mock data - replace with actual data from your API
const roomBackgrounds: RoomBackground[] = [
  {
    id: '1',
    name: 'Modern Living Room',
    image: '/images/rooms/modern-living-room.jpg',
    preview: '/images/rooms/modern-living-room-thumb.jpg',
    category: 'living-room'
  },
  {
    id: '2',
    name: 'Cozy Bedroom',
    image: '/images/rooms/cozy-bedroom.jpg',
    preview: '/images/rooms/cozy-bedroom-thumb.jpg',
    category: 'bedroom'
  },
  {
    id: '3',
    name: 'Executive Office',
    image: '/images/rooms/executive-office.jpg',
    preview: '/images/rooms/executive-office-thumb.jpg',
    category: 'office'
  },
  {
    id: '4',
    name: 'Contemporary Kitchen',
    image: '/images/rooms/contemporary-kitchen.jpg',
    preview: '/images/rooms/contemporary-kitchen-thumb.jpg',
    category: 'kitchen'
  },
  {
    id: '5',
    name: 'Spa Bathroom',
    image: '/images/rooms/spa-bathroom.jpg',
    preview: '/images/rooms/spa-bathroom-thumb.jpg',
    category: 'bathroom'
  },
  {
    id: '6',
    name: 'Grand Hallway',
    image: '/images/rooms/grand-hallway.jpg',
    preview: '/images/rooms/grand-hallway-thumb.jpg',
    category: 'hallway'
  }
];

const doorStyles: DoorStyle[] = [
  {
    id: '1',
    name: 'Classic Barn Door',
    slug: 'classic-barn-door',
    image: '/images/doors/classic-barn-door.png',
    category: 'barn-doors',
    price: 599,
    features: ['Rustic Design', 'Soft-Close Hardware', 'Premium Pine'],
    finishes: [
      { id: '1', name: 'Natural Oak', color: 'Oak', hex: '#DEB887', texture: 'wood-grain', priceModifier: 0, popular: true },
      { id: '2', name: 'Espresso', color: 'Dark Brown', hex: '#3C2415', texture: 'wood-grain', priceModifier: 50 },
      { id: '3', name: 'White Wash', color: 'White', hex: '#F5F5DC', texture: 'wood-grain', priceModifier: 25, popular: true }
    ],
    sizes: [
      { id: '1', width: 30, height: 80, displayName: '30" x 80"', priceModifier: 0, popular: true },
      { id: '2', width: 36, height: 80, displayName: '36" x 80"', priceModifier: 100, popular: true },
      { id: '3', width: 42, height: 80, displayName: '42" x 80"', priceModifier: 200 }
    ]
  },
  {
    id: '2',
    name: 'Modern Sliding Door',
    slug: 'modern-sliding-door',
    image: '/images/doors/modern-sliding-door.png',
    category: 'interior-doors',
    price: 799,
    features: ['Contemporary Design', 'Aluminum Frame', 'Frosted Glass'],
    finishes: [
      { id: '4', name: 'Brushed Aluminum', color: 'Silver', hex: '#C0C0C0', texture: 'metal', priceModifier: 0, popular: true },
      { id: '5', name: 'Matte Black', color: 'Black', hex: '#2B2B2B', texture: 'metal', priceModifier: 75, popular: true },
      { id: '6', name: 'Bronze', color: 'Bronze', hex: '#CD7F32', texture: 'metal', priceModifier: 100 }
    ],
    sizes: [
      { id: '4', width: 32, height: 80, displayName: '32" x 80"', priceModifier: 0 },
      { id: '5', width: 36, height: 80, displayName: '36" x 80"', priceModifier: 150, popular: true },
      { id: '6', width: 40, height: 80, displayName: '40" x 80"', priceModifier: 300 }
    ]
  }
];

interface ReninDoorVisualizerProps {
  initialConfig?: Partial<VisualizerConfig>;
  onConfigChange?: (config: VisualizerConfig) => void;
  onSave?: (design: SavedDesign) => void;
  className?: string;
}

export default function ReninDoorVisualizer({
  initialConfig,
  onConfigChange,
  onSave,
  className = ''
}: ReninDoorVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<VisualizerConfig>({
    roomBackground: roomBackgrounds[0],
    doorStyle: doorStyles[0],
    doorFinish: doorStyles[0].finishes[0],
    doorSize: doorStyles[0].sizes[0],
    showBefore: false,
    doorPosition: {
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0
    },
    ...initialConfig
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [designName, setDesignName] = useState('');
  const [designNotes, setDesignNotes] = useState('');

  // Update parent when config changes
  useEffect(() => {
    onConfigChange?.(config);
  }, [config, onConfigChange]);

  const updateConfig = useCallback((updates: Partial<VisualizerConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const handleRoomChange = useCallback((background: RoomBackground) => {
    updateConfig({ roomBackground: background });
  }, [updateConfig]);

  const handleDoorStyleChange = useCallback((style: DoorStyle) => {
    updateConfig({
      doorStyle: style,
      doorFinish: style.finishes[0],
      doorSize: style.sizes[0]
    });
  }, [updateConfig]);

  const handleFinishChange = useCallback((finish: DoorFinish) => {
    updateConfig({ doorFinish: finish });
  }, [updateConfig]);

  const handleSizeChange = useCallback((size: DoorSize) => {
    updateConfig({ doorSize: size });
  }, [updateConfig]);

  const handlePositionChange = useCallback((position: Partial<typeof config.doorPosition>) => {
    updateConfig({
      doorPosition: { ...config.doorPosition, ...position }
    });
  }, [config.doorPosition, updateConfig]);

  const resetPosition = useCallback(() => {
    updateConfig({
      doorPosition: { x: 50, y: 50, scale: 1, rotation: 0 }
    });
  }, [updateConfig]);

  const calculateTotalPrice = useCallback(() => {
    return config.doorStyle.price +
           config.doorFinish.priceModifier +
           config.doorSize.priceModifier;
  }, [config]);

  const saveDesign = useCallback(async () => {
    if (!designName.trim()) return;

    setIsLoading(true);
    try {
      // Generate thumbnail (simplified - in real app, capture canvas)
      const thumbnail = '/placeholder.svg?height=200&width=300&text=Design+Thumbnail';

      const savedDesign: SavedDesign = {
        id: Date.now().toString(),
        name: designName,
        config,
        thumbnail,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
        tags: [config.doorStyle.category, config.roomBackground.category]
      };

      onSave?.(savedDesign);
      setSaveDialogOpen(false);
      setDesignName('');
      setDesignNotes('');
    } catch (error) {
      console.error('Failed to save design:', error);
    } finally {
      setIsLoading(false);
    }
  }, [designName, config, onSave]);

  const shareDesign = useCallback((platform: VisualizerShare['platform']) => {
    const shareUrl = `${window.location.origin}/visualizer?config=${encodeURIComponent(JSON.stringify(config))}`;
    const shareText = `Check out my custom ${config.doorStyle.name} design!`;

    const shareOptions: Record<VisualizerShare['platform'], () => void> = {
      email: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`;
      },
      facebook: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
      },
      twitter: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
      },
      pinterest: () => {
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`);
      },
      whatsapp: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`);
      },
      link: () => {
        navigator.clipboard.writeText(shareUrl);
      }
    };

    shareOptions[platform]?.();
    setShareDialogOpen(false);
  }, [config]);

  const downloadImage = useCallback(() => {
    // In a real implementation, you'd render the canvas and download
    console.log('Download functionality would be implemented here');
  }, []);

  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-pg-navy to-pg-sky p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Door Visualizer</h2>
        <p className="opacity-90">Customize and preview your perfect door design</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Tabs defaultValue="style" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="room">Room</TabsTrigger>
              <TabsTrigger value="adjust">Adjust</TabsTrigger>
            </TabsList>

            <TabsContent value="style" className="space-y-6">
              {/* Door Style Selection */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Door Style</h3>
                <div className="grid grid-cols-1 gap-3">
                  {doorStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => handleDoorStyleChange(style)}
                      className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                        config.doorStyle.id === style.id
                          ? 'border-pg-navy bg-pg-navy/5'
                          : 'border-gray-200 hover:border-pg-navy/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                          <Image
                            src={style.image}
                            alt={style.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{style.name}</p>
                          <p className="text-sm text-gray-500">${style.price}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Finish Selection */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Finish</h3>
                <div className="grid grid-cols-1 gap-2">
                  {config.doorStyle.finishes.map((finish) => (
                    <button
                      key={finish.id}
                      onClick={() => handleFinishChange(finish)}
                      className={`flex items-center gap-3 p-2 rounded-lg border transition-all hover:shadow-sm ${
                        config.doorFinish.id === finish.id
                          ? 'border-pg-navy bg-pg-navy/5'
                          : 'border-gray-200 hover:border-pg-navy/50'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: finish.hex }}
                      />
                      <div className="text-left flex-1">
                        <p className="font-medium text-sm">{finish.name}</p>
                        {finish.priceModifier > 0 && (
                          <p className="text-xs text-gray-500">+${finish.priceModifier}</p>
                        )}
                      </div>
                      {finish.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Size Selection */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Size</h3>
                <div className="grid grid-cols-1 gap-2">
                  {config.doorStyle.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => handleSizeChange(size)}
                      className={`flex items-center justify-between p-2 rounded-lg border transition-all hover:shadow-sm ${
                        config.doorSize.id === size.id
                          ? 'border-pg-navy bg-pg-navy/5'
                          : 'border-gray-200 hover:border-pg-navy/50'
                      }`}
                    >
                      <span className="font-medium text-sm">{size.displayName}</span>
                      <div className="flex items-center gap-2">
                        {size.priceModifier > 0 && (
                          <span className="text-xs text-gray-500">+${size.priceModifier}</span>
                        )}
                        {size.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="room" className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Room Background</h3>
                <div className="grid grid-cols-2 gap-3">
                  {roomBackgrounds.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => handleRoomChange(room)}
                      className={`aspect-video rounded-lg overflow-hidden border-2 transition-all hover:shadow-md ${
                        config.roomBackground.id === room.id
                          ? 'border-pg-navy'
                          : 'border-gray-200 hover:border-pg-navy/50'
                      }`}
                    >
                      <Image
                        src={room.preview}
                        alt={room.name}
                        width={120}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                      <div className="p-2">
                        <p className="text-xs font-medium">{room.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="adjust" className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Position & Scale</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Horizontal Position</Label>
                    <Slider
                      value={[config.doorPosition.x]}
                      onValueChange={([x]) => handlePositionChange({ x })}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Vertical Position</Label>
                    <Slider
                      value={[config.doorPosition.y]}
                      onValueChange={([y]) => handlePositionChange({ y })}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Scale</Label>
                    <Slider
                      value={[config.doorPosition.scale * 100]}
                      onValueChange={([scale]) => handlePositionChange({ scale: scale / 100 })}
                      min={50}
                      max={150}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Rotation</Label>
                    <Slider
                      value={[config.doorPosition.rotation]}
                      onValueChange={([rotation]) => handlePositionChange({ rotation })}
                      min={-45}
                      max={45}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <Button
                    onClick={resetPosition}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    Reset Position
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="before-after" className="text-sm font-medium">
                    Show Before/After
                  </Label>
                  <Switch
                    id="before-after"
                    checked={config.showBefore}
                    onCheckedChange={(showBefore) => updateConfig({ showBefore })}
                  />
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Price Summary */}
          <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Total Price</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span>${config.doorStyle.price}</span>
              </div>
              {config.doorFinish.priceModifier > 0 && (
                <div className="flex justify-between">
                  <span>Finish:</span>
                  <span>+${config.doorFinish.priceModifier}</span>
                </div>
              )}
              {config.doorSize.priceModifier > 0 && (
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>+${config.doorSize.priceModifier}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg text-green-800">
                <span>Total:</span>
                <span>${calculateTotalPrice()}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2">
          <Card className="p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Preview</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => updateConfig({ showBefore: !config.showBefore })}>
                  {config.showBefore ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={downloadImage}>
                  <Download className="w-4 h-4" />
                </Button>
                <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Share Your Design</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <Button onClick={() => shareDesign('email')} variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                      <Button onClick={() => shareDesign('facebook')} variant="outline">
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </Button>
                      <Button onClick={() => shareDesign('twitter')} variant="outline">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                      <Button onClick={() => shareDesign('whatsapp')} variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button onClick={() => shareDesign('link')} variant="outline" className="col-span-2">
                        <Link className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Your Design</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="design-name">Design Name</Label>
                        <Input
                          id="design-name"
                          value={designName}
                          onChange={(e) => setDesignName(e.target.value)}
                          placeholder="My Custom Door Design"
                        />
                      </div>
                      <div>
                        <Label htmlFor="design-notes">Notes (Optional)</Label>
                        <Textarea
                          id="design-notes"
                          value={designNotes}
                          onChange={(e) => setDesignNotes(e.target.value)}
                          placeholder="Add any notes about your design..."
                        />
                      </div>
                      <Button
                        onClick={saveDesign}
                        disabled={!designName.trim() || isLoading}
                        className="w-full"
                      >
                        {isLoading ? 'Saving...' : 'Save Design'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Visualization Area */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/10' }}>
              {/* Background Room */}
              <Image
                src={config.roomBackground.image}
                alt={config.roomBackground.name}
                fill
                className="object-cover"
                priority
              />

              {/* Door Overlay */}
              <div
                className="absolute transition-all duration-300"
                style={{
                  left: `${config.doorPosition.x}%`,
                  top: `${config.doorPosition.y}%`,
                  transform: `translate(-50%, -50%) scale(${config.doorPosition.scale}) rotate(${config.doorPosition.rotation}deg)`,
                  filter: config.showBefore ? 'opacity(50%)' : 'none'
                }}
              >
                <div className="relative w-32 h-48">
                  <Image
                    src={config.doorStyle.image}
                    alt={config.doorStyle.name}
                    fill
                    className="object-contain"
                    style={{
                      filter: `hue-rotate(${config.doorFinish.hex === '#DEB887' ? 0 : 30}deg)`
                    }}
                  />
                </div>
              </div>

              {/* Before/After Toggle */}
              {config.showBefore && (
                <div className="absolute top-4 left-4 bg-black/75 text-white px-3 py-1 rounded-full text-sm">
                  Before / After View
                </div>
              )}

              {/* Info Overlay */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <p className="font-semibold text-sm">{config.doorStyle.name}</p>
                <p className="text-xs text-gray-600">{config.doorFinish.name} • {config.doorSize.displayName}</p>
                <p className="text-sm font-bold text-green-600">${calculateTotalPrice()}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}