import { reninProducts } from '../renin-products'
import type { Product } from '../renin-products'

export interface ProductEmbedding {
  id: string
  content: string
  metadata: {
    type: 'product' | 'hardware'
    name: string
    slug: string
    price: number
    category: string
    style?: string
    material: string
    features: string[]
  }
  embedding?: number[]
}

export interface ContentChunk {
  id: string
  content: string
  source: string
  metadata: Record<string, any>
}

export class EmbeddingService {
  private contentChunks: ContentChunk[] = []
  
  constructor() {
    this.initializeContent()
  }

  private initializeContent() {
    // Product content
    const barnDoors = reninProducts.getBarnDoors()
    const hardware = reninProducts.getHardware()

    // Convert products to content chunks
    barnDoors.forEach(product => {
      this.contentChunks.push(this.productToContentChunk(product, 'barn-door'))
    })

    hardware.forEach(product => {
      this.contentChunks.push(this.productToContentChunk(product, 'hardware'))
    })

    // Add general knowledge content
    this.addGeneralKnowledge()
  }

  private productToContentChunk(product: Product, type: string): ContentChunk {
    const isProduct = 'category' in product
    const content = this.generateProductDescription(product, type)
    
    return {
      id: `${type}-${product.id}`,
      content,
      source: `product-${product.id}`,
      metadata: {
        type,
        name: product.name,
        slug: product.slug,
        price: product.price,
        category: product.category,
        material: product.specifications.Material || 'Unknown',
        finish: product.specifications.Finish || 'Unknown',
        features: product.features,
        specifications: product.specifications
      }
    }
  }

  private generateProductDescription(product: Product, type: string): string {
    const pricing = reninProducts.calculatePriceWithTax(product.price)
    
    let description = `${product.name} is a premium ${product.category} `
    
    // Use specifications for material and finish info
    if (product.specifications.Material) {
      description += `made from high-quality ${product.specifications.Material.toLowerCase()} `
    }
    if (product.specifications.Finish) {
      description += `with ${product.specifications.Finish.toLowerCase()} finish. `
    }
    
    if (product.specifications["Standard Sizes"]) {
      description += `Available in ${product.specifications["Standard Sizes"]}. `
    }
    
    description += `Priced at $${pricing.total.toFixed(2)} CAD (including 13% HST). `
    
    description += `Key features include: ${product.features.join(', ')}. `
    description += `Professional installation available throughout Ottawa, Kanata, Orleans, Nepean, and surrounding areas. `
    description += `Part of the Renin collection available exclusively through authorized dealers like PG Closets.`
    
    return description
  }

  private addGeneralKnowledge() {
    const knowledgeItems = [
      {
        id: 'installation-process',
        content: 'Barn door installation typically takes 2-4 hours and includes mounting the track system, hanging the door, adjusting for proper clearance, and ensuring smooth operation. Professional installation is recommended for optimal results and warranty coverage.',
        source: 'general-knowledge',
        metadata: { topic: 'installation', category: 'service' }
      },
      {
        id: 'measurement-guide',
        content: 'Proper barn door measurements require the door to be 2-3 inches wider than the opening and extend 6-8 inches beyond each side when open. Track length should be at least 2 times the door width for single doors.',
        source: 'general-knowledge',
        metadata: { topic: 'measurement', category: 'guide' }
      },
      {
        id: 'style-recommendations',
        content: 'Industrial style barn doors work well with modern and contemporary decor. Rustic styles complement farmhouse and traditional settings. Modern styles suit minimalist and contemporary spaces.',
        source: 'general-knowledge',
        metadata: { topic: 'design', category: 'recommendation' }
      },
      {
        id: 'maintenance-tips',
        content: 'Barn door maintenance includes regular cleaning of tracks, lubricating rollers every 6 months, checking hardware tightness, and protecting wood finishes from moisture.',
        source: 'general-knowledge',
        metadata: { topic: 'maintenance', category: 'care' }
      },
      {
        id: 'warranty-information',
        content: 'PG Closets offers comprehensive warranties: 2 years on barn doors, 5 years on hardware components, and 1 year on professional installation work. Warranty covers defects in materials and workmanship.',
        source: 'general-knowledge',
        metadata: { topic: 'warranty', category: 'policy' }
      },
      {
        id: 'service-areas',
        content: 'PG Closets provides delivery and installation services throughout Ottawa and surrounding areas including Kanata, Orleans, Nepean, Gloucester, Barrhaven, Stittsville, Manotick, and other nearby communities.',
        source: 'general-knowledge',
        metadata: { topic: 'service-area', category: 'location' }
      }
    ]

    this.contentChunks.push(...knowledgeItems)
  }

  public getAllContent(): ContentChunk[] {
    return this.contentChunks
  }

  public searchContent(query: string, limit: number = 5): ContentChunk[] {
    const searchTerms = query.toLowerCase().split(' ')
    
    const scored = this.contentChunks.map(chunk => {
      let score = 0
      const content = chunk.content.toLowerCase()
      const metadata = JSON.stringify(chunk.metadata).toLowerCase()
      
      searchTerms.forEach(term => {
        // Content matches
        const contentMatches = (content.match(new RegExp(term, 'g')) || []).length
        score += contentMatches * 3
        
        // Metadata matches
        const metadataMatches = (metadata.match(new RegExp(term, 'g')) || []).length
        score += metadataMatches * 2
        
        // Title/name matches (higher weight)
        if (chunk.metadata.name?.toLowerCase().includes(term)) {
          score += 5
        }
      })
      
      return { chunk, score }
    })
    
    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.chunk)
  }

  public getProductRecommendations(query: string, currentProductId?: string): ContentChunk[] {
    const productChunks = this.contentChunks.filter(chunk => 
      (chunk.metadata.type === 'barn-door' || chunk.metadata.type === 'hardware') &&
      chunk.metadata.name !== currentProductId
    )
    
    // Simple keyword-based recommendation
    const searchTerms = query.toLowerCase().split(' ')
    const keywords = ['premium', 'luxury', 'budget', 'modern', 'rustic', 'industrial', 'traditional']
    
    const relevantKeywords = searchTerms.filter(term => keywords.includes(term))
    
    if (relevantKeywords.length === 0) {
      return productChunks.slice(0, 3) // Return top products
    }
    
    return this.searchContent(relevantKeywords.join(' '), 3)
  }

  public getContentById(id: string): ContentChunk | null {
    return this.contentChunks.find(chunk => chunk.id === id) || null
  }

  public refreshContent() {
    this.contentChunks = []
    this.initializeContent()
  }
}

// Export singleton instance
export const embeddingService = new EmbeddingService()