"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  RotateCcw,
  RotateCw,
  Maximize2,
  Grid3x3,
  Move,
  Square,
  Circle,
  Triangle,
  Ruler,
  Save,
  Download,
  Upload,
  Trash2,
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Group,
  Ungroup
} from 'lucide-react'

interface RoomObject {
  id: string
  type: 'furniture' | 'fixture' | 'decoration' | 'appliance'
  name: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  color: string
  zIndex: number
  locked: boolean
  visible: boolean
  metadata?: {
    price?: number
    sku?: string
    category?: string
    description?: string
  }
}

interface Room {
  id: string
  name: string
  width: number
  height: number
  backgroundColor: string
  objects: RoomObject[]
}

interface FurnitureItem {
  id: string
  name: string
  type: string
  category: string
  defaultWidth: number
  defaultHeight: number
  color: string
  price: number
  sku: string
  thumbnail: string
}

interface InteractiveRoomPlannerProps {
  furniture: FurnitureItem[]
  initialRoom?: Partial<Room>
  onSave?: (room: Room) => void
  onExport?: (room: Room) => void
  className?: string
}

export const InteractiveRoomPlanner: React.FC<InteractiveRoomPlannerProps> = ({
  furniture,
  initialRoom,
  onSave,
  onExport,
  className
}) => {
  const [room, setRoom] = useState<Room>({
    id: 'room-1',
    name: initialRoom?.name || 'My Room',
    width: initialRoom?.width || 600,
    height: initialRoom?.height || 400,
    backgroundColor: initialRoom?.backgroundColor || '#f8f9fa',
    objects: initialRoom?.objects || []
  })

  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [draggedObject, setDraggedObject] = useState<string | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [gridSize, setGridSize] = useState(20)
  const [showGrid, setShowGrid] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [selectedTool, setSelectedTool] = useState<'select' | 'rectangle' | 'circle' | 'line'>('select')
  const [history, setHistory] = useState<Room[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Save state to history
  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(JSON.parse(JSON.stringify(room)))
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [room, history, historyIndex])

  // Snap to grid helper
  const snapToGridValue = (value: number) => {
    if (!snapToGrid) return value
    return Math.round(value / gridSize) * gridSize
  }

  // Add furniture to room
  const addFurniture = (furnitureItem: FurnitureItem) => {
    const newObject: RoomObject = {
      id: `obj-${Date.now()}`,
      type: 'furniture',
      name: furnitureItem.name,
      x: snapToGridValue(room.width / 2 - furnitureItem.defaultWidth / 2),
      y: snapToGridValue(room.height / 2 - furnitureItem.defaultHeight / 2),
      width: furnitureItem.defaultWidth,
      height: furnitureItem.defaultHeight,
      rotation: 0,
      color: furnitureItem.color,
      zIndex: room.objects.length,
      locked: false,
      visible: true,
      metadata: {
        price: furnitureItem.price,
        sku: furnitureItem.sku,
        category: furnitureItem.category
      }
    }

    setRoom(prev => ({
      ...prev,
      objects: [...prev.objects, newObject]
    }))
    saveToHistory()
  }

  // Update object position
  const updateObjectPosition = (objectId: string, x: number, y: number) => {
    setRoom(prev => ({
      ...prev,
      objects: prev.objects.map(obj =>
        obj.id === objectId
          ? { ...obj, x: snapToGridValue(x), y: snapToGridValue(y) }
          : obj
      )
    }))
  }

  // Update object size
  const updateObjectSize = (objectId: string, width: number, height: number) => {
    setRoom(prev => ({
      ...prev,
      objects: prev.objects.map(obj =>
        obj.id === objectId
          ? { ...obj, width, height }
          : obj
      )
    }))
  }

  // Update object rotation
  const updateObjectRotation = (objectId: string, rotation: number) => {
    setRoom(prev => ({
      ...prev,
      objects: prev.objects.map(obj =>
        obj.id === objectId
          ? { ...obj, rotation: rotation % 360 }
          : obj
      )
    }))
  }

  // Delete object
  const deleteObject = (objectId: string) => {
    setRoom(prev => ({
      ...prev,
      objects: prev.objects.filter(obj => obj.id !== objectId)
    }))
    setSelectedObject(null)
    saveToHistory()
  }

  // Duplicate object
  const duplicateObject = (objectId: string) => {
    const object = room.objects.find(obj => obj.id === objectId)
    if (object) {
      const newObject = {
        ...object,
        id: `obj-${Date.now()}`,
        x: object.x + 20,
        y: object.y + 20,
        zIndex: room.objects.length
      }
      setRoom(prev => ({
        ...prev,
        objects: [...prev.objects, newObject]
      }))
      saveToHistory()
    }
  }

  // Toggle object lock
  const toggleObjectLock = (objectId: string) => {
    setRoom(prev => ({
      ...prev,
      objects: prev.objects.map(obj =>
        obj.id === objectId
          ? { ...obj, locked: !obj.locked }
          : obj
      )
    }))
  }

  // Toggle object visibility
  const toggleObjectVisibility = (objectId: string) => {
    setRoom(prev => ({
      ...prev,
      objects: prev.objects.map(obj =>
        obj.id === objectId
          ? { ...obj, visible: !obj.visible }
          : obj
      )
    }))
  }

  // Handle object drag start
  const handleObjectDragStart = (e: React.MouseEvent, objectId: string) => {
    const object = room.objects.find(obj => obj.id === objectId)
    if (object?.locked) return

    setDraggedObject(objectId)
    setSelectedObject(objectId)

    const startX = e.clientX
    const startY = e.clientY
    const startObjectX = object.x
    const startObjectY = object.y

    const handleMouseMove = (e: MouseEvent) => {
      if (draggedObject) {
        const deltaX = (e.clientX - startX) / zoom
        const deltaY = (e.clientY - startY) / zoom
        updateObjectPosition(
          draggedObject,
          startObjectX + deltaX - pan.x,
          startObjectY + deltaY - pan.y
        )
      }
    }

    const handleMouseUp = () => {
      setDraggedObject(null)
      saveToHistory()
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Handle resize
  const handleResizeStart = (e: React.MouseEvent, objectId: string, handle: string) => {
    e.stopPropagation()
    const object = room.objects.find(obj => obj.id === objectId)
    if (object?.locked) return

    setIsResizing(true)
    setSelectedObject(objectId)

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = object.width
    const startHeight = object.height
    const startLeft = object.x
    const startTop = object.y

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - startX) / zoom
      const deltaY = (e.clientY - startY) / zoom

      let newWidth = startWidth
      let newHeight = startHeight
      let newX = startLeft
      let newY = startTop

      switch (handle) {
        case 'se':
          newWidth = snapToGridValue(startWidth + deltaX)
          newHeight = snapToGridValue(startHeight + deltaY)
          break
        case 'sw':
          newWidth = snapToGridValue(startWidth - deltaX)
          newHeight = snapToGridValue(startHeight + deltaY)
          newX = snapToGridValue(startLeft + deltaX)
          break
        case 'ne':
          newWidth = snapToGridValue(startWidth + deltaX)
          newHeight = snapToGridValue(startHeight - deltaY)
          newY = snapToGridValue(startTop + deltaY)
          break
        case 'nw':
          newWidth = snapToGridValue(startWidth - deltaX)
          newHeight = snapToGridValue(startHeight - deltaY)
          newX = snapToGridValue(startLeft + deltaX)
          newY = snapToGridValue(startTop + deltaY)
          break
      }

      if (newWidth > 20 && newHeight > 20) {
        updateObjectSize(objectId, newWidth, newHeight)
        if (handle !== 'se') {
          updateObjectPosition(objectId, newX, newY)
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      saveToHistory()
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Handle rotation
  const handleRotateStart = (e: React.MouseEvent, objectId: string) => {
    e.stopPropagation()
    const object = room.objects.find(obj => obj.id === objectId)
    if (object?.locked) return

    setIsRotating(true)
    setSelectedObject(objectId)

    const centerX = object.x + object.width / 2
    const centerY = object.y + object.height / 2

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const mouseX = (e.clientX - rect.left) / zoom - pan.x
        const mouseY = (e.clientY - rect.top) / zoom - pan.y
        const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI)
        updateObjectRotation(objectId, angle + 90)
      }
    }

    const handleMouseUp = () => {
      setIsRotating(false)
      saveToHistory()
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Clear room
  const clearRoom = () => {
    setRoom(prev => ({ ...prev, objects: [] }))
    setSelectedObject(null)
    saveToHistory()
  }

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setRoom(history[historyIndex - 1])
    }
  }

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setRoom(history[historyIndex + 1])
    }
  }

  // Export room
  const exportRoom = () => {
    onExport?.(room)
    const dataStr = JSON.stringify(room, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `${room.name.replace(/\s+/g, '-').toLowerCase()}-room-plan.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Import room
  const importRoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const importedRoom = JSON.parse(event.target?.result as string)
          setRoom(importedRoom)
          saveToHistory()
        } catch (error) {
          console.error('Error importing room:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  // Get furniture by category
  const getFurnitureByCategory = (category: string) => {
    return furniture.filter(item => item.category === category)
  }

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedTool === 'select' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTool('select')}
                >
                  <Move className="h-4 w-4 mr-2" />
                  Select
                </Button>
                <Button
                  variant={selectedTool === 'rectangle' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTool('rectangle')}
                >
                  <Square className="h-4 w-4 mr-2" />
                  Rectangle
                </Button>
                <Button
                  variant={selectedTool === 'circle' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTool('circle')}
                >
                  <Circle className="h-4 w-4 mr-2" />
                  Circle
                </Button>
                <Button
                  variant={selectedTool === 'line' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTool('line')}
                >
                  <Triangle className="h-4 w-4 mr-2" />
                  Triangle
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGrid(!showGrid)}
                  className={showGrid ? "bg-primary text-primary-foreground" : ""}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSnapToGrid(!snapToGrid)}
                  className={snapToGrid ? "bg-primary text-primary-foreground" : ""}
                >
                  <Ruler className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={clearRoom}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Room Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Room Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="room-name">Room Name</Label>
                <Input
                  id="room-name"
                  value={room.name}
                  onChange={(e) => setRoom(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="room-width">Width</Label>
                  <Input
                    id="room-width"
                    type="number"
                    value={room.width}
                    onChange={(e) => setRoom(prev => ({ ...prev, width: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="room-height">Height</Label>
                  <Input
                    id="room-height"
                    type="number"
                    value={room.height}
                    onChange={(e) => setRoom(prev => ({ ...prev, height: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="grid-size">Grid Size</Label>
                <Select value={gridSize.toString()} onValueChange={(value) => setGridSize(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10px</SelectItem>
                    <SelectItem value="20">20px</SelectItem>
                    <SelectItem value="40">40px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Furniture Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Furniture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['sofas', 'chairs', 'tables', 'storage', 'beds'].map(category => (
                  <div key={category}>
                    <h4 className="text-sm font-medium mb-2 capitalize">{category}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {getFurnitureByCategory(category).map(item => (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addFurniture(item)}
                            className="w-full h-auto p-2 flex flex-col items-center"
                          >
                            <div
                              className="w-8 h-8 rounded mb-1"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs">{item.name}</span>
                            {item.price > 0 && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                ${item.price}
                              </Badge>
                            )}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Room Planner</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportRoom}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm" onClick={() => onSave?.(room)}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                ref={canvasRef}
                className="relative border-2 border-dashed border-muted-foreground/20 rounded-lg overflow-auto"
                style={{
                  height: '600px',
                  backgroundImage: showGrid
                    ? `repeating-linear-gradient(0deg, transparent, transparent ${gridSize - 1}px, #e5e7eb ${gridSize - 1}px, #e5e7eb ${gridSize}px),
                       repeating-linear-gradient(90deg, transparent, transparent ${gridSize - 1}px, #e5e7eb ${gridSize - 1}px, #e5e7eb ${gridSize}px)`
                    : 'none'
                }}
              >
                <div
                  className="relative"
                  style={{
                    width: `${room.width}px`,
                    height: `${room.height}px`,
                    backgroundColor: room.backgroundColor,
                    transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                    transformOrigin: 'top left'
                  }}
                >
                  {room.objects.map(object => (
                    <div
                      key={object.id}
                      className={`absolute border-2 cursor-move transition-opacity ${
                        selectedObject === object.id
                          ? 'border-primary border-dashed'
                          : object.locked
                          ? 'border-muted-foreground/50'
                          : 'border-transparent hover:border-primary/50'
                      } ${!object.visible ? 'opacity-30' : ''}`}
                      style={{
                        left: `${object.x}px`,
                        top: `${object.y}px`,
                        width: `${object.width}px`,
                        height: `${object.height}px`,
                        backgroundColor: object.color,
                        transform: `rotate(${object.rotation}deg)`,
                        zIndex: object.zIndex
                      }}
                      onMouseDown={(e) => handleObjectDragStart(e, object.id)}
                      onClick={() => setSelectedObject(object.id)}
                    >
                      {object.name && (
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white bg-black/50 rounded">
                          {object.name}
                        </div>
                      )}

                      {/* Resize handles */}
                      {selectedObject === object.id && !object.locked && (
                        <>
                          <div
                            className="absolute w-3 h-3 bg-primary rounded-full -bottom-1 -right-1 cursor-se-resize"
                            onMouseDown={(e) => handleResizeStart(e, object.id, 'se')}
                          />
                          <div
                            className="absolute w-3 h-3 bg-primary rounded-full -bottom-1 -left-1 cursor-sw-resize"
                            onMouseDown={(e) => handleResizeStart(e, object.id, 'sw')}
                          />
                          <div
                            className="absolute w-3 h-3 bg-primary rounded-full -top-1 -right-1 cursor-ne-resize"
                            onMouseDown={(e) => handleResizeStart(e, object.id, 'ne')}
                          />
                          <div
                            className="absolute w-3 h-3 bg-primary rounded-full -top-1 -left-1 cursor-nw-resize"
                            onMouseDown={(e) => handleResizeStart(e, object.id, 'nw')}
                          />
                        </>
                      )}

                      {/* Rotation handle */}
                      {selectedObject === object.id && !object.locked && (
                        <div
                          className="absolute w-4 h-4 bg-blue-500 rounded-full -top-6 left-1/2 -translate-x-1/2 cursor-crosshair"
                          onMouseDown={(e) => handleRotateStart(e, object.id)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Selected Object Properties */}
                {selectedObject && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 min-w-[200px]"
                  >
                    {(() => {
                      const object = room.objects.find(obj => obj.id === selectedObject)
                      if (!object) return null

                      return (
                        <div className="space-y-3">
                          <h4 className="font-medium">{object.name}</h4>
                          <div className="text-sm space-y-1">
                            <p>Position: ({Math.round(object.x)}, {Math.round(object.y)})</p>
                            <p>Size: {Math.round(object.width)} × {Math.round(object.height)}</p>
                            <p>Rotation: {Math.round(object.rotation)}°</p>
                            {object.metadata?.price && (
                              <p>Price: ${object.metadata.price}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleObjectLock(object.id)}
                            >
                              {object.locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleObjectVisibility(object.id)}
                            >
                              {object.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => duplicateObject(object.id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteObject(object.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })()}
                  </motion.div>
                )}
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center justify-center mt-4 gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                >
                  -
                </Button>
                <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                >
                  +
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importRoom}
        className="hidden"
      />
    </div>
  )
}

export default InteractiveRoomPlanner