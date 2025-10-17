import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Create OpenAI instance (you can also use Anthropic)
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    system: `You are a helpful assistant for PG Closets, an Ottawa-based premium closet door and storage solutions company.

You help customers with:
- Product recommendations (Renin closet systems, barn doors, bifold doors, bypass doors, pivot doors, room dividers)
- Installation questions
- Design consultation
- Sizing and measurements
- Service area information (Ottawa, Kanata, Barrhaven, Nepean, Orleans)
- Booking appointments
- Quote requests

Be helpful, professional, and conversational. Focus on understanding customer needs and guiding them to the right solutions.`,
    messages,
  });

  return result.toTextStreamResponse();
}
