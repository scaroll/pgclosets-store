import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import type { Product } from '@/types/product';

/**
 * Embeddings Utility for Semantic Product Search
 * Uses OpenAI text-embedding-3-small model via AI SDK 5
 */

// ============================================================================
// Types
// ============================================================================

export interface ProductEmbeddingInput {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  tags?: string[];
}

export interface EmbeddingResult {
  embedding: number[];
  dimensions: number;
}

export interface SimilarityResult {
  product: Product;
  score: number;
}

// ============================================================================
// Configuration
// ============================================================================

const embeddingModel = openai.embedding('text-embedding-3-small');

// ============================================================================
// Core Embedding Functions
// ============================================================================

/**
 * Generate embedding for a single product
 * Combines product name, description, features, and tags into searchable text
 */
export async function generateProductEmbedding(
  product: Product | ProductEmbeddingInput
): Promise<EmbeddingResult> {
  // Construct comprehensive product text for embedding
  const productText = createProductText(product);

  const { embedding } = await embed({
    model: embeddingModel,
    value: productText,
  });

  return {
    embedding,
    dimensions: embedding.length,
  };
}

/**
 * Generate embeddings for multiple products in a single batch
 * More efficient than calling generateProductEmbedding multiple times
 */
export async function generateProductEmbeddings(
  products: (Product | ProductEmbeddingInput)[]
): Promise<EmbeddingResult[]> {
  // Create text representations for all products
  const productTexts = products.map(createProductText);

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: productTexts,
  });

  return embeddings.map((embedding) => ({
    embedding,
    dimensions: embedding.length,
  }));
}

/**
 * Generate embedding for a search query
 */
export async function generateQueryEmbedding(
  query: string
): Promise<EmbeddingResult> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: query,
  });

  return {
    embedding,
    dimensions: embedding.length,
  };
}

// ============================================================================
// Similarity Functions
// ============================================================================

/**
 * Calculate cosine similarity between two embeddings
 * Returns a value between -1 and 1 (higher is more similar)
 */
export function calculateSimilarity(
  embedding1: number[],
  embedding2: number[]
): number {
  if (embedding1.length !== embedding2.length) {
    throw new Error(
      `Embedding dimensions must match: ${embedding1.length} vs ${embedding2.length}`
    );
  }

  // Calculate dot product
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    magnitude1 += embedding1[i] * embedding1[i];
    magnitude2 += embedding2[i] * embedding2[i];
  }

  // Calculate magnitudes
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  // Avoid division by zero
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  // Calculate cosine similarity
  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Perform semantic search on products using query embedding
 * Returns products sorted by similarity score
 */
export async function semanticSearch(
  query: string,
  products: Product[],
  limit: number = 10
): Promise<SimilarityResult[]> {
  // Generate query embedding
  const { embedding: queryEmbedding } = await generateQueryEmbedding(query);

  // Calculate similarity for each product
  // Note: In production, products would already have pre-computed embeddings
  const results: SimilarityResult[] = await Promise.all(
    products.map(async (product) => {
      const { embedding: productEmbedding } =
        await generateProductEmbedding(product);
      const score = calculateSimilarity(queryEmbedding, productEmbedding);

      return { product, score };
    })
  );

  // Sort by similarity score (highest first) and limit results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .filter((result) => result.score > 0.5); // Only return reasonably similar results
}

/**
 * Find similar products based on a reference product
 * Useful for "You might also like" recommendations
 */
export async function findSimilarProducts(
  referenceProduct: Product,
  candidateProducts: Product[],
  limit: number = 5
): Promise<SimilarityResult[]> {
  // Generate embedding for reference product
  const { embedding: referenceEmbedding } =
    await generateProductEmbedding(referenceProduct);

  // Calculate similarity for each candidate
  const results: SimilarityResult[] = await Promise.all(
    candidateProducts
      .filter((p) => p.id !== referenceProduct.id) // Exclude the reference product itself
      .map(async (product) => {
        const { embedding: productEmbedding } =
          await generateProductEmbedding(product);
        const score = calculateSimilarity(referenceEmbedding, productEmbedding);

        return { product, score };
      })
  );

  // Sort by similarity score and limit results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .filter((result) => result.score > 0.6); // Higher threshold for recommendations
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create searchable text representation of a product
 * Optimized for semantic search
 */
function createProductText(product: Product | ProductEmbeddingInput): string {
  const parts: string[] = [];

  // Product name (most important)
  parts.push(product.name);

  // Category
  parts.push(`Category: ${product.category}`);

  // Description
  parts.push(product.description);

  // Features
  if (product.features && product.features.length > 0) {
    parts.push(`Features: ${product.features.join(', ')}`);
  }

  // Tags (if available)
  if ('tags' in product && product.tags && product.tags.length > 0) {
    parts.push(`Tags: ${product.tags.join(', ')}`);
  }

  // Brand (if available)
  if ('brand' in product && product.brand) {
    parts.push(`Brand: ${product.brand}`);
  }

  // Join all parts with newlines for better semantic separation
  return parts.join('\n');
}

/**
 * Normalize embedding vector (convert to unit vector)
 * Useful for consistent similarity calculations
 */
export function normalizeEmbedding(embedding: number[]): number[] {
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0)
  );

  if (magnitude === 0) {
    return embedding;
  }

  return embedding.map((val) => val / magnitude);
}

/**
 * Batch similarity calculation for efficiency
 * Returns similarity scores for all product pairs
 */
export function batchCalculateSimilarity(
  queryEmbedding: number[],
  productEmbeddings: number[][]
): number[] {
  return productEmbeddings.map((productEmbedding) =>
    calculateSimilarity(queryEmbedding, productEmbedding)
  );
}
