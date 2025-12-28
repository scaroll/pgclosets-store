import { generateMultiDimensionalContent } from '../lib/gcp/gemini'

const PROMPT_BUILDER_SYSTEM_PROMPT = `
You are an Expert Prompt Engineer powered by Multi-Dimensional Reasoning.
Your goal is to take a simple user request and transform it into a highly effective, structured prompt for an LLM.

Analyze the user's intent through these lenses:
1. The Engineer: What are the technical constraints? What specific format or output is needed?
2. The Artist: What is the tone, style, and persona required?
3. The Strategist: What is the ultimate goal? How can we prevent hallucinations or vague outputs?

Format your response as:
---INTERNAL_ANALYSIS---
[Your reasoning process...]
---FINAL_RESPONSE---
[The Optimized Prompt]
`

async function main() {
  const topic = process.argv.slice(2).join(' ')

  if (!topic) {
    console.error('Please provide a topic or goal for the prompt.')
    console.log('Usage: npx tsx scripts/prompt-builder.ts "Create a landing page for..."')
    process.exit(1)
  }

  console.log(`\n🧠 Reasoning about prompt for: "${topic}"...\n`)

  try {
    const response = await generateMultiDimensionalContent(topic, PROMPT_BUILDER_SYSTEM_PROMPT)

    console.log('\n--- 🧐 Analysis ---\n')
    console.log(response.analysis)

    console.log('\n\n--- 🚀 Optimized Prompt ---\n')
    console.log(response.finalResponse)
    console.log('\n')
  } catch (error) {
    console.error('Error generating prompt:', error)
  }
}

void main()
