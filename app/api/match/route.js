import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
  const formData = await req.formData()
  const userInput = formData.get('userInput') || ''
  const files = formData.getAll('files')

  const { data: resources } = await supabase
    .from('resources')
    .select('program_name, plain_language_program_name, program_description, plain_language_eligibility, how_to_apply_summary, url_of_online_application, program_category, population_served')

  const resourceList = resources.map((r, i) =>
    `${i + 1}. ${r.program_name} (${r.program_category})
    Description: ${r.program_description}
    Eligibility: ${r.plain_language_eligibility}
    How to apply: ${r.how_to_apply_summary}
    URL: ${r.url_of_online_application}`
  ).join('\n\n')

  const contentParts = []

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const mimeType = file.type

    if (mimeType === 'application/pdf') {
      contentParts.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: base64 }
      })
    } else if (mimeType.startsWith('image/')) {
      contentParts.push({
        type: 'image',
        source: { type: 'base64', media_type: mimeType, data: base64 }
      })
    }
  }

  contentParts.push({
    type: 'text',
    content: `You are a helpful NYC benefits assistant. A resident has described their situation and may have uploaded documents. Extract any relevant info from the documents and combine with their text description to match them to the most relevant programs. Return ONLY a JSON array of the top 5 matches, no other text. Each item should have: name, category, why_it_matches, how_to_apply, url.

Respond in the same language the user wrote in.

User situation: ${userInput}

Available programs:
${resourceList}

Return only a JSON array like:
[{"name":"...","category":"...","why_it_matches":"...","how_to_apply":"...","url":"..."}]`
  })

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: contentParts }]
  })

  const raw = message.content[0].text
  const cleaned = raw.replace(/```json|```/g, '').trim()
  const matches = JSON.parse(cleaned)

  return Response.json({ matches })
}