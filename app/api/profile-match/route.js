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
      system: `You are an expert NYC benefits navigator. Analyze the applicant's profile and return the top 6 programs they most likely qualify for.

CRITICAL: Return ONLY a valid JSON array — no markdown, no explanation, no code fences. Start with [ and end with ].

Each object must have EXACTLY these fields:
{
  "name": "short program name",
  "fullName": "official full program name",
  "category": "one of: Food, Health, Housing, Childcare, Utilities, Financial, Employment, Education",
  "eligibility": <integer 75-99>,
  "savings": "benefit value (e.g. '$740 / mo', 'Up to $7,500 / yr', '$0 premiums')",
  "badge": "one of: High Priority, Urgent, Recommended, Seasonal, Tax Benefit, Time-Sensitive",
  "summary": "1-2 sentences on why this person qualifies and what they get",
  "nextStep": "how to apply — include a phone number or website",
  "url": "exact official application URL from the verified list below",
  "deadline": "deadline string or null"
}

VERIFIED APPLICATION URLs — use these exact URLs, do not invent others:
- SNAP / Cash Assistance / Emergency Assistance / HRA programs: https://a069-access.nyc.gov/accesshra/
- Medicaid / Child Health Plus / Essential Plan / NY State of Health marketplace: https://nystateofhealth.ny.gov/
- WIC (Women Infants Children): https://www.health.ny.gov/prevention/nutrition/wic/
- Emergency Rental Assistance / One Shot Deal: https://www.nyc.gov/site/hra/help/emergency-rental-assistance-program.page
- CityFHEPS rental voucher: https://www.nyc.gov/site/hra/help/cityfheps.page
- Section 8 / Housing Choice Voucher (NYCHA): https://www.nyc.gov/site/nycha/section-8/about-section-8.page
- NYCHA public housing application: https://www.nyc.gov/site/nycha/apply/apply-for-housing.page
- HEAP home energy assistance: https://www.nyc.gov/site/hra/help/heap.page
- NYC Free Tax Prep / EITC / VITA sites: https://www.nyc.gov/site/dca/consumers/file-your-taxes.page
- Child Tax Credit (federal): https://www.irs.gov/credits-deductions/individuals/child-tax-credit
- NY Unemployment Insurance: https://applications.labor.ny.gov/IndividualReg/
- ACS Child Care Subsidy: https://www.nyc.gov/site/acs/early-care/child-care-subsidies.page
- Head Start: https://www.nyc.gov/site/acs/early-care/head-start.page
- 3-K / Pre-K for All: https://www.nyc.gov/site/doe/enrollment/pre-k.page
- SSI / SSDI disability benefits: https://www.ssa.gov/benefits/disability/
- NYC veteran services: https://www.nyc.gov/site/veterans/veterans/veterans.page
- DACA / immigration: https://www.uscis.gov/DACA
- NYC Health + Hospitals (free clinics): https://www.nychealthandhospitals.org/patients/

Rank by urgency. Do NOT suggest programs the person is already enrolled in.`,
      messages: [{
        role: 'user',
        content: `Find the top 6 NYC/federal benefit programs for this applicant.

${profileSummary}

Consider: SNAP, Medicaid, Child Health Plus, Essential Plan, WIC, HEAP, Emergency Rental Assistance, CityFHEPS, NYCHA, EITC, Child Tax Credit, NYC Cash Assistance, NY Unemployment Insurance, ACS Child Care Subsidy, Head Start, Pre-K for All, VITA free tax prep, Veteran benefits, DACA programs, SSI/SSDI.

Return ONLY the JSON array.`
      }],
    })

    const raw = message.content[0].text.trim()

    // Try direct parse first (cleanest path)
    if (raw.startsWith('[')) {
      try {
        const programs = JSON.parse(raw)
        return Response.json({ programs })
      } catch {}
    }

    // Strip any markdown fences and extract array
    const stripped = raw.replace(/```json\n?|```\n?/g, '').trim()
    const jsonMatch = stripped.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error('No JSON array found. Raw response (first 500 chars):', raw.slice(0, 500))
      throw new Error('AI returned an unexpected response. Please try again.')
    }

    const programs = JSON.parse(jsonMatch[0])
    return Response.json({ programs })
  } catch (err) {
    console.error('Profile match error:', err.message)
    return Response.json({ programs: [], error: err.message }, { status: 500 })
  }
}
