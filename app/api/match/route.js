import { createClient } from '@supabase/supabase-js'
import { anthropic } from '@/lib/anthropic'

async function fetchPrograms() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return []
    const supabase = createClient(url, key)
    const { data, error } = await supabase
      .from('resources')
      .select('program_name, plain_language_program_name, program_description, plain_language_eligibility, how_to_apply_summary, url_of_online_application, program_category, population_served')
    if (error || !data?.length) return []
    return data
  } catch {
    return []
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData()
    const userInput = formData.get('userInput') || ''
    const files = formData.getAll('files')

    const resources = await fetchPrograms()

    const programContext = resources.length > 0
      ? `Use this list of available NYC programs to match the user:\n\n${resources.map((r, i) =>
          `${i + 1}. ${r.program_name} (${r.program_category})
   Description: ${r.program_description}
   Eligibility: ${r.plain_language_eligibility}
   How to apply: ${r.how_to_apply_summary}
   URL: ${r.url_of_online_application}`
        ).join('\n\n')}`
      : `Use your knowledge of real NYC government benefit programs (SNAP, Medicaid, HEAP, WIC, Emergency Rental Assistance, NYC Cash Assistance, Child Care Vouchers, EITC, NY Unemployment Insurance, NYC Free Tax Prep, HRA programs, ACS programs, etc.) to match the user to the top 5 most relevant programs. Include real program names, real eligibility criteria, real application steps, and real official URLs.`

    const contentParts = []

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const mimeType = file.type
      if (mimeType === 'application/pdf') {
        contentParts.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } })
      } else if (mimeType.startsWith('image/')) {
        contentParts.push({ type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } })
      }
    }

    // Detect language from user input so we can be explicit in the prompt
    const langDetect = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{
        role: 'user',
        content: `What language is this text written in? Reply with ONLY the language name in English (e.g. "English", "Spanish", "Chinese", "Bengali", "Arabic"). Text: "${userInput.slice(0, 200)}"`
      }]
    })
    const detectedLang = langDetect.content[0].text.trim()

    contentParts.push({
      type: 'text',
      text: `You are an expert NYC benefits navigator helping low-income New Yorkers find government assistance programs they qualify for.

CRITICAL LANGUAGE RULE: The user wrote in ${detectedLang}. You MUST write every single word of your response in ${detectedLang}. Do not use any other language. The "why_it_matches" and "how_to_apply" fields must be written entirely in ${detectedLang}.

The user has described their situation below. Analyze it carefully — consider their income, household size, employment status, housing situation, children, health insurance, immigration status if mentioned, and any urgent needs.

${programContext}

User's situation:
${userInput}

Return ONLY a valid JSON array of the top 5 most relevant program matches — no markdown, no explanation, just the JSON. Every text field must be in ${detectedLang}. Each object must have exactly these fields:
[
  {
    "name": "Program name",
    "category": "One of: Food, Health, Housing, Financial, Childcare, Utilities, Employment, Nutrition",
    "why_it_matches": "2-3 sentences in ${detectedLang} explaining exactly why this person qualifies and what they'll get",
    "how_to_apply": "Specific step-by-step instructions in ${detectedLang} for how to apply",
    "url": "Official application URL"
  }
]`
    })

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2048,
      messages: [{ role: 'user', content: contentParts }]
    })

    const raw = message.content[0].text
    const cleaned = raw.replace(/```json\n?|```\n?/g, '').trim()

    let matches
    try {
      matches = JSON.parse(cleaned)
    } catch {
      // Try extracting JSON array from response
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/)
      matches = jsonMatch ? JSON.parse(jsonMatch[0]) : []
    }

    return Response.json({ matches })
  } catch (err) {
    console.error('API match error:', err)
    return Response.json({ matches: [], error: err.message }, { status: 500 })
  }
}
