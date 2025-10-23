"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Move,
  RotateCw,
  Square,
  Ruler,
  Maximize2,
  Download,
  Share2,
  Save,
  Undo,
  Redo
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomPlannerProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function RoomPlanner({
  title = "Room Planner",
  subtitle = "Design your perfect space with our interactive room planner",
  className
}: RoomPlannerProps) {
  const [selectedTool, setSelectedTool] = useState('select');
  const [roomDimensions, setRoomDimensions] = useState({ width: 12, height: 10 });
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);

  const tools = [
    { id: 'select', icon: <Move className="w-5 h-5" />, label: 'Select' },
    { id: 'door', icon: <RotateCw className="w-5 h-5" />, label: 'Add Door' },
    { id: 'wall', icon: <Square className="w-5 h-5" />, label: 'Add Wall' },
    { id: 'measure', icon: <Ruler className="w-5 h-5" />, label: 'Measure' },
  ];

  const templates = [
    { id: 'bedroom', name: 'Master Bedroom', size: '12x10', icon: '🛏️' },
    { id: 'closet', name: 'Walk-in Closet', size: '8x6', icon: '👔' },
    { id: 'office', name: 'Home Office', size: '10x10', icon: '💼' },
    { id: 'laundry', name: 'Laundry Room', size: '8x8', icon: '🧺' },
  ];

  return (
    <section className={cn("py-16 md:py-24 bg-gray-50", className)}>
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

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Room Templates */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Room Templates</h3>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:border-teal-600 hover:bg-teal-50"
                  >
                    <span className="text-2xl">{template.icon}</span>
                    <span className="text-xs font-medium">{template.name}</span>
                    <span className="text-xs text-gray-500">{template.size}</span>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Tools */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                {tools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "default" : "outline"}
                    className={cn(
                      "flex flex-col items-center gap-2 h-auto p-3",
                      selectedTool === tool.id && "bg-teal-600 hover:bg-teal-700"
                    )}
                    onClick={() => setSelectedTool(tool.id)}
                  >
                    {tool.icon}
                    <span className="text-xs">{tool.label}</span>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Room Settings */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Room Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Dimensions (ft)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="number"
                        value={roomDimensions.width}
                        onChange={(e) => setRoomDimensions(prev => ({ ...prev, width: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Width"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={roomDimensions.height}
                        onChange={(e) => setRoomDimensions(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Height"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span className="text-sm text-gray-700">Show Grid</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showRulers}
                      onChange={(e) => setShowRulers(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span className="text-sm text-gray-700">Show Rulers</span>
                  </label>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                <Save className="w-4 h-4 mr-2" />
                Save Design
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share Design
              </Button>
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              {/* Toolbar */}
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" className="w-8 h-8">
                      <Undo className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="w-8 h-8">
                      <Redo className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-gray-300 mx-2" />
                    <Button size="icon" variant="ghost" className="w-8 h-8">
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-sm">
                      {roomDimensions.width}' × {roomDimensions.height}'
                    </Badge>
                    <Badge className="bg-teal-600 text-white text-sm">
                      1' = 40px
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div className="relative bg-white" style={{ height: '600px' }}>
                {/* Grid Background */}
                {showGrid && (
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px'
                    }}
                  />
                )}

                {/* Rulers */}
                {showRulers && (
                  <>
                    {/* Top Ruler */}
                    <div className="absolute top-0 left-12 right-0 h-8 bg-gray-100 border-b border-gray-300 flex items-center">
                      {Array.from({ length: roomDimensions.width }, (_, i) => (
                        <div key={i} className="flex-1 text-center text-xs text-gray-600 border-r border-gray-300">
                          {i + 1}
                        </div>
                      ))}
                    </div>

                    {/* Left Ruler */}
                    <div className="absolute top-8 left-0 bottom-0 w-12 bg-gray-100 border-r border-gray-300 flex flex-col items-center py-2">
                      {Array.from({ length: roomDimensions.height }, (_, i) => (
                        <div key={i} className="flex-1 text-center text-xs text-gray-600 border-b border-gray-300 w-full">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Canvas Content */}
                <div className="absolute inset-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                        <Square className="w-12 h-12 text-teal-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Interactive Room Planner
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      Start by selecting a room template or use the tools to design your custom layout.
                      Add doors, windows, and furniture to visualize your space.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        Start from Template
                      </Button>
                      <Button variant="outline">
                        Blank Canvas
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Door Items (Sample) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-2 bg-teal-600 rounded-full shadow-lg cursor-move hover:bg-teal-700 transition-colors">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-white px-2 py-1 rounded shadow">
                      Bifold Door
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>Ready</div>
                  <div>Scale: 1:40 | Grid: 1ft</div>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Pro Tips for Room Planning
              </h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>Measure your space carefully before starting your design</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>Consider door swing direction and clearance requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>Leave at least 30 inches of clearance for bifold doors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>Use furniture templates to ensure proper spacing</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}