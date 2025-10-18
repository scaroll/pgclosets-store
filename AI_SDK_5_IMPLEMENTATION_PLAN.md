# AI SDK 5 Implementation Plan - PG Closets

## Current State Analysis

✅ **Already Implemented:**
- AI SDK 5.0.75 with OpenAI provider
- Basic chat assistant with streaming responses
- AI booking assistant with NLP parsing (client-side only)
- `useChat` hook integration

## AI SDK 5 Enhancement Roadmap

### Phase 1: Enhanced Chat API with Tool Calling
**Priority: HIGH**

Upgrade `/api/chat/route.ts` to leverage AI SDK 5's advanced features:

```typescript
// New features to implement:
1. **Tool Calling** - Let AI interact with:
   - Product database search
   - Booking system integration
   - Pricing calculator
   - Inventory checks

2. **Structured Outputs** - Use Zod schemas for:
   - Booking data extraction
   - Product queries
   - Contact information parsing

3. **Multi-modal Support** - Handle:
   - Image uploads for design consultations
   - Document analysis (floor plans, measurements)
```

### Phase 2: AI-Powered Product Recommendations
**Priority: HIGH**

Create intelligent product matching system:

```typescript
// Features:
- Semantic search using embeddings
- Natural language product queries
- Style matching and recommendations
- Budget-aware suggestions
- Similar product discovery
```

### Phase 3: Smart Search & Semantic Understanding
**Priority: MEDIUM**

Enhance search with AI capabilities:

```typescript
// Upgrade search to:
- Understand natural language queries
- Handle synonyms and related terms
- Provide contextual results
- Auto-correct and suggestions
```

### Phase 4: Structured Data Extraction
**Priority: MEDIUM**

Improve form handling with AI:

```typescript
// Extract structured data from:
- Free-form booking requests
- Email inquiries
- Chat messages
- Voice transcriptions
```

### Phase 5: Content Generation
**Priority: LOW**

Generate dynamic content:

```typescript
// Auto-generate:
- Product descriptions
- SEO meta content
- Email responses
- Blog post drafts
```

## Technical Implementation Details

### 1. Tool Calling Implementation

**File: `app/api/chat/route.ts`**

```typescript
import { tool } from 'ai';
import { z } from 'zod';

// Define tools
const tools = {
  searchProducts: tool({
    description: 'Search for closet products based on customer needs',
    parameters: z.object({
      query: z.string(),
      category: z.enum(['barn-doors', 'bifold-doors', 'hardware', 'systems']).optional(),
      maxPrice: z.number().optional(),
    }),
    execute: async ({ query, category, maxPrice }) => {
      // Implementation
    },
  }),

  checkAvailability: tool({
    description: 'Check appointment availability',
    parameters: z.object({
      service: z.enum(['consultation', 'measurement', 'installation']),
      date: z.string(),
    }),
    execute: async ({ service, date }) => {
      // Implementation
    },
  }),

  calculatePrice: tool({
    description: 'Calculate pricing for a closet project',
    parameters: z.object({
      productIds: z.array(z.string()),
      measurements: z.object({
        width: z.number(),
        height: z.number(),
      }),
    }),
    execute: async (params) => {
      // Implementation
    },
  }),
};
```

### 2. Structured Output Implementation

**File: `lib/ai/schemas.ts`**

```typescript
import { z } from 'zod';

export const BookingSchema = z.object({
  service: z.enum(['consultation', 'measurement', 'installation']),
  date: z.string(),
  time: z.string(),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
  projectDetails: z.object({
    type: z.string(),
    budget: z.number().optional(),
    notes: z.string().optional(),
  }),
});

export const ProductQuerySchema = z.object({
  intent: z.enum(['search', 'compare', 'recommend']),
  category: z.string().optional(),
  style: z.string().optional(),
  priceRange: z.object({
    min: z.number(),
    max: z.number(),
  }).optional(),
  features: z.array(z.string()).optional(),
});
```

### 3. Multi-Step Conversations

**File: `lib/ai/conversation-manager.ts`**

```typescript
import { experimental_generateText } from 'ai';

export class ConversationManager {
  async processMultiStep(messages, context) {
    // Track conversation state
    // Handle multi-turn dialogs
    // Maintain context across messages
  }
}
```

### 4. Embeddings for Semantic Search

**File: `lib/ai/embeddings.ts`**

```typescript
import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function generateProductEmbeddings() {
  // Generate embeddings for all products
  // Store in vector database (Supabase pgvector)
}

export async function semanticProductSearch(query: string) {
  const queryEmbedding = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: query,
  });

  // Search vector database
  // Return ranked results
}
```

## File Structure

```
app/
├── api/
│   ├── chat/
│   │   └── route.ts                    # Enhanced with tools
│   ├── ai/
│   │   ├── recommendations/route.ts    # Product recommendations
│   │   ├── search/route.ts             # Semantic search
│   │   └── extract/route.ts            # Data extraction
│   └── embeddings/
│       └── generate/route.ts           # Embedding generation

lib/
├── ai/
│   ├── schemas.ts                      # Zod schemas
│   ├── tools/
│   │   ├── product-search.ts          # Product search tool
│   │   ├── booking.ts                  # Booking tool
│   │   └── pricing.ts                  # Pricing calculator
│   ├── embeddings.ts                   # Vector operations
│   ├── conversation-manager.ts         # State management
│   └── prompts.ts                      # System prompts

components/
├── ai/
│   ├── ChatAssistant.tsx               # Enhanced chat
│   ├── ProductRecommendations.tsx      # AI recommendations
│   └── SmartSearch.tsx                 # Semantic search UI
```

## Environment Variables Needed

```env
# OpenAI (primary)
OPENAI_API_KEY=sk-...

# Optional: Anthropic for Claude
ANTHROPIC_API_KEY=sk-ant-...

# Vector Database
SUPABASE_VECTOR_URL=...
SUPABASE_ANON_KEY=...
```

## Implementation Priority

### Week 1: Foundation
1. ✅ AI SDK 5 already installed
2. Enhance chat API with tool calling
3. Add structured output schemas
4. Implement product search tool

### Week 2: Advanced Features
1. Add semantic search with embeddings
2. Build product recommendation engine
3. Create conversation state management
4. Implement multi-turn dialogs

### Week 3: Integration
1. Integrate booking system with AI
2. Add pricing calculator tool
3. Implement image analysis for consultations
4. Create admin dashboard for AI insights

### Week 4: Polish & Testing
1. Comprehensive testing
2. Performance optimization
3. Error handling improvements
4. Documentation

## Performance Considerations

1. **Caching**: Cache AI responses for common queries
2. **Streaming**: Use streaming for long responses
3. **Rate Limiting**: Implement rate limits to control costs
4. **Fallbacks**: Graceful degradation when AI unavailable
5. **Monitoring**: Track token usage and costs

## Cost Optimization

```typescript
// Estimated monthly costs at moderate usage:
- Chat completions: ~$50-150/month
- Embeddings: ~$10-30/month
- Tool calling: Included in completions
- Total: ~$60-180/month

// Optimization strategies:
1. Use GPT-3.5 for simple queries
2. Cache common responses
3. Implement smart rate limiting
4. Use embeddings efficiently
```

## Testing Strategy

```typescript
// Test coverage:
1. Unit tests for tool functions
2. Integration tests for API routes
3. E2E tests for chat flow
4. Load tests for performance
5. Cost monitoring for budget control
```

## Next Steps

1. Review and approve plan
2. Set up environment variables
3. Begin Phase 1 implementation
4. Iterate based on feedback

## Success Metrics

- [ ] Chat assistant responds within 2 seconds
- [ ] 90%+ accuracy on booking extractions
- [ ] Product recommendations have 70%+ relevance
- [ ] Semantic search outperforms keyword search
- [ ] AI features used by 30%+ of visitors
- [ ] Customer satisfaction score > 4.5/5
- [ ] Monthly AI costs < $200

---

**Status**: Ready to implement
**Last Updated**: 2025-01-17
**Next Review**: After Phase 1 completion
