#!/bin/bash

# Set placeholder environment variables for testing
# These should be replaced with actual values from Upstash and OpenAI

echo "Setting UPSTASH_REDIS_REST_URL..."
echo "https://placeholder-redis-url.upstash.io" | npx vercel env add UPSTASH_REDIS_REST_URL production

echo "Setting UPSTASH_REDIS_REST_TOKEN..."
echo "placeholder-redis-token" | npx vercel env add UPSTASH_REDIS_REST_TOKEN production

echo "Setting OPENAI_API_KEY..."
echo "sk-placeholder-openai-key" | npx vercel env add OPENAI_API_KEY production

echo "Environment variables configured!"