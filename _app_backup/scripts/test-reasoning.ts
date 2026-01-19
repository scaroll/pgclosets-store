/* eslint-disable no-console */
// Run with: export $(cat .env.local | xargs) && npx ts-node scripts/test-reasoning.ts
import { generateMultiDimensionalContent } from '../lib/gcp/gemini'

async function testReasoning() {
  console.log('Testing Multi-Dimensional Reasoning (The Silent Council)...')

  const prompt = 'Explain the impact of AI on SEO strategies in 2025.'

  try {
    const result = await generateMultiDimensionalContent(prompt)

    console.log('\n==========================================')
    console.log('THE SILENT COUNCIL ANALYSIS')
    console.log('==========================================\n')
    console.log(result.analysis)

    console.log('\n==========================================')
    console.log('FINAL RESPONSE')
    console.log('==========================================\n')
    console.log(result.finalResponse)
  } catch (error) {
    console.error('Test failed:', error)
  }
}

void testReasoning()
