import type { Layer } from '../types'

export class FigmaToCodeGenerator {
  generateHTML(layer: Layer): string {
    if (layer.type === 'TEXT') {
      return this.generateText(layer)
    } else if (
      layer.type === 'RECTANGLE' ||
      layer.type === 'FRAME' ||
      layer.type === 'COMPONENT' ||
      layer.type === 'INSTANCE'
    ) {
      return this.generateFrame(layer)
    }
    return ''
  }

  private generateFrame(layer: Layer): string {
    const className = `figma-${layer.type.toLowerCase()}-${layer.id}`
    let html = `<div class="${className}" style="${this.generateStyles(layer)}">\n`

    if (layer.children) {
      for (const child of layer.children) {
        html += this.generateHTML(child)
      }
    }

    html += '</div>\n'
    return html
  }

  private generateText(layer: Layer): string {
    const className = `figma-text-${layer.id}`
    // Text content simulation
    const textContent = layer.name || 'Text'
    return `<div class="${className}" style="${this.generateStyles(layer)}">${textContent}</div>\n`
  }

  private generateStyles(layer: Layer): string {
    const styles: string[] = []

    // Position
    styles.push(`position: absolute`)
    styles.push(`left: ${layer.x}px`)
    styles.push(`top: ${layer.y}px`)

    // Size
    styles.push(`width: ${layer.width}px`)
    styles.push(`height: ${layer.height}px`)

    // Colors
    if (layer.fills && layer.fills.length > 0) {
      const fill = layer.fills[0]
      if (fill.type === 'SOLID' && fill.color) {
        styles.push(`background-color: ${fill.color}`)
      }
    }

    // Border radius
    if (layer.cornerRadius) {
      styles.push(`border-radius: ${layer.cornerRadius}px`)
    }

    // Opacity
    if (layer.opacity !== undefined && layer.opacity < 1) {
      styles.push(`opacity: ${layer.opacity}`)
    }

    return styles.join('; ')
  }
}
