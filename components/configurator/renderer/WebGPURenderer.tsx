'use client'

import { useEffect, useRef, useState } from 'react'
import { Layer } from '../../../lib/configurator/types'
import { ShaderProcessor } from './ShaderProcessor'

interface WebGPURendererProps {
  layers: Layer[]
}

export default function WebGPURenderer({ layers }: WebGPURendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)
  const contextRef = useRef<GPUCanvasContext | null>(null)
  const deviceRef = useRef<GPUDevice | null>(null)
  const pipelineRef = useRef<GPURenderPipeline | null>(null)

  useEffect(() => {
    if (!navigator.gpu) {
      setError('WebGPU not supported on this browser.')
      return
    }

    const initWebGPU = async () => {
      try {
        const adapter = await navigator.gpu.requestAdapter({
          powerPreference: 'high-performance',
        })

        if (!adapter) {
          throw new Error('No appropriate GPU adapter found.')
        }

        const device = await adapter.requestDevice()
        deviceRef.current = device

        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext('webgpu')
        if (!context) {
          throw new Error('Could not get WebGPU context.')
        }
        contextRef.current = context

        context.configure({
          device,
          format: navigator.gpu.getPreferredCanvasFormat(),
          alphaMode: 'premultiplied',
        })

        // Initialize Pipeline
        const shaderProcessor = new ShaderProcessor()
        const { flow: vertexShader, fragment: fragmentShader } = shaderProcessor.processShader('')

        const pipeline = device.createRenderPipeline({
          layout: 'auto',
          vertex: {
            module: device.createShaderModule({ code: vertexShader }),
            entryPoint: 'main',
            buffers: [
              {
                arrayStride: 32, // 4 floats pos + 4 floats color
                attributes: [
                  { shaderLocation: 0, offset: 0, format: 'float32x4' },
                  { shaderLocation: 1, offset: 16, format: 'float32x4' },
                ],
              },
            ],
          },
          fragment: {
            module: device.createShaderModule({ code: fragmentShader }),
            entryPoint: 'main',
            targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
          },
          primitive: {
            topology: 'triangle-list',
          },
        })

        pipelineRef.current = pipeline
        render()
      } catch (e: any) {
        console.error('WebGPU Initialization Failed', e)
        setError(e.message)
      }
    }

    const render = () => {
      if (!deviceRef.current || !contextRef.current || !pipelineRef.current) return

      const commandEncoder = deviceRef.current.createCommandEncoder()
      const textureView = contextRef.current.getCurrentTexture().createView()

      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
          {
            view: textureView,
            clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 },
            loadOp: 'clear',
            storeOp: 'store',
          },
        ],
      }

      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
      passEncoder.setPipeline(pipelineRef.current)
      // Draw calls would go here based on layers
      // For now just clearing the screen to dark grey as proof of life
      passEncoder.end()

      deviceRef.current.queue.submit([commandEncoder.finish()])
    }

    initWebGPU()

    // Re-render when layers change
    render()
  }, [layers]) // Re-run if layers change

  if (error) {
    return <div className="rounded bg-red-100 p-4 text-red-800">Renderer Error: {error}</div>
  }

  return (
    <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
      <canvas ref={canvasRef} className="block h-full w-full" width={800} height={600} />
      <div className="absolute bottom-2 right-2 font-mono text-xs text-neutral-500">
        WebGPU Renderer Active
      </div>
    </div>
  )
}
