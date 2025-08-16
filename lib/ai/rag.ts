import { embeddingService } from './embeddings'
import type { ContentChunk } from './embeddings'

export interface RAGContext {
  query: string
  relevantContent: ContentChunk[]
  metadata: {
    timestamp: string
    searchTerms: string[]
    confidenceScore: number
  }
}

export interface RAGResponse {
  answer: string
  context: RAGContext
  sources: string[]
  recommendations?: string[]
}

export class RAGService {
  constructor() {}

  public async generateResponse(query: string, maxTokens: number = 1000): Promise<RAGResponse> {
    // Get relevant content
    const relevantContent = embeddingService.searchContent(query, 5)
    
    // Extract search terms
    const searchTerms = this.extractSearchTerms(query)
    
    // Calculate confidence score
    const confidenceScore = this.calculateConfidenceScore(query, relevantContent)
    
    // Generate context
    const context: RAGContext = {
      query,
      relevantContent,
      metadata: {
        timestamp: new Date().toISOString(),
        searchTerms,
        confidenceScore
      }
    }

    // Generate answer based on context
    const answer = this.generateContextualAnswer(query, relevantContent)
    
    // Extract sources
    const sources = relevantContent.map(chunk => chunk.source)
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(query, relevantContent)

    return {
      answer,
      context,
      sources,
      recommendations
    }
  }

  private extractSearchTerms(query: string): string[] {
    // Remove common stop words and extract meaningful terms
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'what', 'how', 'where', 'when', 'why', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'can', 'could', 'should', 'would']
    
    return query.toLowerCase()
      .split(/\\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))
  }

  private calculateConfidenceScore(query: string, content: ContentChunk[]): number {
    if (content.length === 0) return 0
    
    const searchTerms = this.extractSearchTerms(query)
    let totalMatches = 0
    let maxPossibleMatches = searchTerms.length * content.length
    
    content.forEach(chunk => {
      const chunkText = chunk.content.toLowerCase()
      searchTerms.forEach(term => {
        if (chunkText.includes(term)) {
          totalMatches++
        }
      })
    })
    
    return maxPossibleMatches > 0 ? totalMatches / maxPossibleMatches : 0
  }

  private generateContextualAnswer(query: string, content: ContentChunk[]): string {
    if (content.length === 0) {
      return "I don't have specific information about that. However, I'd be happy to help you explore our barn door and hardware collections, or you can contact us directly for personalized assistance."
    }

    const queryLower = query.toLowerCase()
    
    // Detect query intent
    const isProductQuery = queryLower.includes('product') || queryLower.includes('door') || queryLower.includes('hardware')
    const isPriceQuery = queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('how much')
    const isInstallationQuery = queryLower.includes('install') || queryLower.includes('setup') || queryLower.includes('mount')
    const isStyleQuery = queryLower.includes('style') || queryLower.includes('design') || queryLower.includes('look')
    const isRecommendationQuery = queryLower.includes('recommend') || queryLower.includes('suggest') || queryLower.includes('best')

    let answer = ''

    if (isPriceQuery && content.some(c => c.metadata.price)) {
      const productContent = content.filter(c => c.metadata.price)
      answer = this.generatePriceAnswer(productContent)
    } else if (isInstallationQuery) {
      const installContent = content.find(c => c.metadata.topic === 'installation')
      answer = installContent ? 
        `${installContent.content} Our professional installation team serves the entire Ottawa area with expert installation services.` :
        'Professional installation is available throughout the Ottawa area. Our experienced team ensures proper mounting and optimal operation of your barn door system.'
    } else if (isStyleQuery) {
      const styleContent = content.find(c => c.metadata.topic === 'design' || c.metadata.style)
      answer = styleContent ?
        `${styleContent.content} We offer a wide range of styles to complement any home décor.` :
        'Our barn doors come in various styles including Industrial, Modern, Rustic, and Traditional designs to complement any home décor.'
    } else if (isRecommendationQuery) {
      const productContent = content.filter(c => c.metadata.type === 'barn-door' || c.metadata.type === 'hardware')
      answer = this.generateRecommendationAnswer(productContent)
    } else if (isProductQuery) {
      const productContent = content.filter(c => c.metadata.type === 'barn-door' || c.metadata.type === 'hardware')
      answer = this.generateProductAnswer(productContent)
    } else {
      // General answer using the most relevant content
      const topContent = content[0]
      answer = `${topContent.content} Feel free to ask for more specific information about our products or services.`
    }

    return answer
  }

  private generatePriceAnswer(content: ContentChunk[]): string {
    const products = content.filter(c => c.metadata.price)
    
    if (products.length === 0) {
      return "Our barn doors range from $289 to $1,345 CAD, and hardware packages range from $169 to $399 CAD. All prices include 13% HST. Contact us for a detailed quote."
    }

    const prices = products.map(p => p.metadata.price).sort((a, b) => a - b)
    const minPrice = prices[0]
    const maxPrice = prices[prices.length - 1]

    let answer = `Based on your query, our products range from $${minPrice} to $${maxPrice} CAD. `
    
    if (products.length === 1) {
      const product = products[0]
      answer = `The ${product.metadata.name} is priced at $${product.metadata.price} CAD`
      if (product.metadata.sale_price && product.metadata.sale_price < product.metadata.price) {
        answer += ` (currently on sale from $${product.metadata.price} CAD)`
      }
      answer += '. '
    }

    answer += 'All prices include 13% HST. Professional installation is available starting at $299 CAD.'

    return answer
  }

  private generateProductAnswer(content: ContentChunk[]): string {
    if (content.length === 0) {
      return "We offer a comprehensive selection of premium barn doors and hardware from Renin. Browse our collection to find the perfect solution for your space."
    }

    const product = content[0]
    let answer = `${product.content.split('. ').slice(0, 2).join('. ')}.`
    
    if (content.length > 1) {
      answer += ` We also have other great options including ${content.slice(1, 3).map(c => c.metadata.name).join(' and ')}.`
    }

    return answer
  }

  private generateRecommendationAnswer(content: ContentChunk[]): string {
    if (content.length === 0) {
      return "I'd be happy to recommend products based on your specific needs. Could you tell me more about your space, style preferences, or budget?"
    }

    const topProducts = content.slice(0, 3)
    let answer = "Based on your needs, I'd recommend: "
    
    answer += topProducts.map((product, index) => {
      const name = product.metadata.name
      const price = product.metadata.price
      const style = product.metadata.style || product.metadata.type
      
      return `${index + 1}. ${name} (${style}, $${price} CAD)`
    }).join(', ')

    answer += '. Each offers excellent quality and comes with our professional installation service.'

    return answer
  }

  private generateRecommendations(query: string, content: ContentChunk[]): string[] {
    const recommendations: string[] = []
    
    // Add related products
    const productContent = content.filter(c => c.metadata.type === 'barn-door' || c.metadata.type === 'hardware')
    if (productContent.length > 0) {
      recommendations.push(`View ${productContent[0].metadata.name}`)
      
      if (productContent.length > 1) {
        recommendations.push(`Compare with ${productContent[1].metadata.name}`)
      }
    }

    // Add service recommendations
    if (query.toLowerCase().includes('install')) {
      recommendations.push('Learn about our installation services')
      recommendations.push('Schedule a consultation')
    }

    // Add general recommendations
    recommendations.push('Browse our full collection')
    recommendations.push('Contact us for a free quote')

    return recommendations.slice(0, 4) // Limit to 4 recommendations
  }

  public async getProductAssistance(productSlug: string): Promise<RAGResponse> {
    const query = `Tell me about ${productSlug} barn door product details specifications features`
    return this.generateResponse(query)
  }

  public async getInstallationInfo(): Promise<RAGResponse> {
    const query = 'installation process professional service Ottawa area barn door mounting'
    return this.generateResponse(query)
  }

  public async getStyleRecommendations(style: string): Promise<RAGResponse> {
    const query = `${style} style barn door recommendations design options`
    return this.generateResponse(query)
  }
}

// Export singleton instance
export const ragService = new RAGService()