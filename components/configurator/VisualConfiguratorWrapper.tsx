'use client'

import { useEffect, useMemo, useState } from 'react'
import { ComponentResolver } from '../../lib/configurator/core/ComponentSystem'
import { MultiplayerEngine } from '../../lib/configurator/multiplayer/MultiplayerEngine'
import type { Layer } from '../../lib/configurator/types'
import WebGPURenderer from './renderer/WebGPURenderer'

interface ConfiguratorProps {
  productId?: string
  currentUser?: string
}

export default function VisualConfiguratorWrapper({ productId, currentUser }: ConfiguratorProps) {
  const [layers, setLayers] = useState<Layer[]>([])

  // Initialize engines
  const multiplayerEngine = useMemo(() => new MultiplayerEngine(currentUser), [currentUser])
  const componentResolver = useMemo(() => new ComponentResolver(), [])

  useEffect(() => {
    // Subscribe to multiplayer updates
    const unsubscribe = multiplayerEngine.subscribe(state => {
      // Convert flat DocumentState back to Layer tree (Simplified for demo)
      console.log('Received multiplayer update', state)

      // For demo purposes, we keep a local mock state if server state is empty
    })

    // Initialize with a demo scene if empty
    if (layers.length === 0) {
      setLayers([
        {
          id: 'root-frame',
          type: 'FRAME',
          name: 'Closet Config',
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          fills: [{ type: 'SOLID', color: '#1a1a1a' }],
          children: [
            {
              id: 'door-1',
              type: 'RECTANGLE',
              name: 'Left Door',
              x: 50,
              y: 50,
              width: 200,
              height: 400,
              fills: [{ type: 'SOLID', color: '#8B4513' }],
              cornerRadius: 4,
            },
            {
              id: 'door-2',
              type: 'RECTANGLE',
              name: 'Right Door',
              x: 300,
              y: 50,
              width: 200,
              height: 400,
              fills: [{ type: 'SOLID', color: '#8B4513' }],
              cornerRadius: 4,
            },
          ],
        },
      ])
    }

    useEffect(() => {
      if (productId) {
        console.log(`Initialized configurator for product ${productId}`)
      }
    }, [productId])

    return () => unsubscribe()
  }, [multiplayerEngine])

  const handlePropertyChange = (layerId: string, property: string, value: any) => {
    // Send to multiplayer engine
    multiplayerEngine.applyLocalChange(layerId, property, value)
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-neutral-950 p-4 text-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <h2 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-xl font-bold text-transparent">
          Visual Configurator (WebGPU Engine)
        </h2>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span>Multiplayer Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Canvas Area */}
        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-black shadow-inner ring-1 ring-white/10 lg:col-span-2">
          <WebGPURenderer layers={layers} />
        </div>

        {/* Properties Panel (Simplified) */}
        <div className="space-y-6 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-400">
            Properties
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-neutral-500">Dimensions</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border border-neutral-800 bg-neutral-950 p-2">
                  <span className="block text-xs text-neutral-600">W</span>
                  <span>200</span>
                </div>
                <div className="rounded border border-neutral-800 bg-neutral-950 p-2">
                  <span className="block text-xs text-neutral-600">H</span>
                  <span>400</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-neutral-500">Material</label>
              <select className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-sm">
                <option>Natural Oak</option>
                <option>Walnut</option>
                <option>White Gloss</option>
              </select>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-4">
            <div className="flex items-end justify-between">
              <span className="text-sm text-neutral-400">Total Price</span>
              <span className="text-xl font-bold text-green-400">$1,299.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
