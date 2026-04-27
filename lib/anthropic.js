import Anthropic from '@anthropic-ai/sdk'

// Shared server-side Anthropic client.
// Only import this from API routes (server components) — never from client components.
export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
