import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req) {
  try {
    const profile = await req.json()

    const annualIncome = profile.monthlyIncome ? Number(profile.monthlyIncome) * 12 : 0
    const householdSize = (profile.adults || 1) + (profile.children || 0)

    const profileSummary = `
NYC Resident Profile:
- Household: ${profile.adults || 1} adult(s), ${profile.children || 0} child(ren)${profile.childrenAges?.length ? ` (ages: ${profile.childrenAges.filter(Boolean).join(', ')})` : ''}
- ZIP Code: ${profile.zip || 'New York City'}
- Annual household income: ~$${annualIncome.toLocaleString()} (~$${profile.monthlyIncome || 0}/mo)
- Employment status: ${profile.employmentStatus || 'unknown'}
- Recently lost job: ${profile.recentlyLostJob ? 'Yes' : 'No'}
- Housing situation: ${profile.housingType || 'unknown'}${profile.rentAmount ? ` (paying $${profile.rentAmount}/mo)` : ''}
- Behind on rent/mortgage: ${profile.behindOnRent ? 'Yes' : 'No'}
- Behind on utilities: ${profile.behindOnUtilities ? 'Yes' : 'No'}
- Eviction/foreclosure risk: ${profile.evictionRisk ? 'Yes' : 'No'}
- Health insurance: ${profile.healthInsurance || 'unknown'}
- Pregnant household member: ${profile.pregnantHousehold ? 'Yes' : 'No'}
- Currently enrolled in: ${profile.currentBenefits?.length ? profile.currentBenefits.join(', ') : 'None'}
- Race/ethnicity: ${profile.race || 'not specified'}
- Primary language: ${profile.language || 'English'}
- Citizenship/immigration: ${profile.citizenship || 'not specified'}
- U.S. Veteran: ${profile.isVeteran ? 'Yes' : 'No'}
- Total household size: ${householdSize}
`.trim()

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: `You are an expert NYC benefits navigator with deep knowledge of all government assistance programs for New York City residents. Analyze the applicant's profile and return programs they most likely qualify for.

CRITICAL: Return ONLY a valid JSON array — no markdown, no explanation, just raw JSON starting with [ and ending with ].

Each object in the array must have EXACTLY these fields:
{
  "name": "short program name (e.g. SNAP Benefits)",
  "fullName": "official full program name",
  "category": "one of: Food, Health, Housing, Childcare, Utilities, Financial, Employment, Education",
  "eligibility": <integer 75-99>,
  "savings": "benefit value string (e.g. '$740 / mo', 'Up to $7,500 / yr', '$0 premiums', 'Up to $850')",
  "badge": "one of: High Priority, Urgent, Recommended, Seasonal, Tax Benefit, Time-Sensitive",
  "summary": "2–3 sentences explaining WHY this specific person qualifies and what they will receive, referencing their actual data (income, household size, situation)",
  "nextStep": "specific actionable steps to apply — include real office names, phone numbers, or websites",
  "url": "real official URL to apply or learn more",
  "deadline": "deadline string if time-sensitive, or null"
}

Rank results by urgency and impact. Do NOT suggest programs the person is already enrolled in.`,
      messages: [{
        role: 'user',
        content: `Find the top 8–12 NYC and federal benefit programs for this applicant. Evaluate ALL aspects of their situation carefully.

${profileSummary}

Programs to evaluate (not exhaustive):
SNAP, Medicaid, Child Health Plus, Essential Plan, WIC, Emergency Rental Assistance (ERAP), CityFHEPS rental voucher, Section 8 / HCV, NYCHA public housing, HEAP (Home Energy Assistance), Earned Income Tax Credit (federal + NYC), Child Tax Credit, NYC Cash Assistance (Family Assistance / Safety Net Assistance), NY Unemployment Insurance, ACS Child Care Subsidy, Head Start, Universal Pre-K (3-K/Pre-K for All), NYC Free Tax Prep (VITA sites), NYC free health clinics, SSI/SSDI (if disability), NYC Emergency Food Pantry Network, Veteran benefits (if applicable), DACA-specific programs (if applicable), NYC Senior programs (if elderly).

Return ONLY the JSON array.`
      }],
    })

    const raw = message.content[0].text.trim()
    const jsonMatch = raw.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('No JSON array in response')

    const programs = JSON.parse(jsonMatch[0])
    return Response.json({ programs })
  } catch (err) {
    console.error('Profile match error:', err)
    return Response.json({ programs: [], error: err.message }, { status: 500 })
  }
}
