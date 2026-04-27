# ResourceNYC

An AI powered benefit navigator for New Yorkers. Describe your situation in plain language, in any language, and ResourceNYC finds the NYC and federal assistance programs you most likely qualify for: food, health insurance, housing, childcare, utilities, and more.

Built for HunterHacks 2026.

## What it does

- **Free text search** — type or paste a description of your situation and Claude returns the top 5 matching programs with eligibility reasoning and step by step application instructions
- **Profile based matching** — complete a short onboarding form (household size, income, housing, insurance, etc.) and get a personalized ranked list of up to 6 programs
- **Multilingual** — the AI detects the language you write in and responds in kind
- **Real programs, real links** — matched to a verified set of NYC/federal program URLs (ACCESS HRA, NY State of Health, WIC, HEAP, ACS, etc.)

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [MUI (Material UI)](https://mui.com) for UI components
- [Supabase](https://supabase.com) for auth and the `resources` program database
- [Anthropic Claude](https://anthropic.com) for AI matching (Haiku for language detection, Sonnet/Opus for program matching)

## Getting started

### 1. Clone and install

```bash
git clone <repo-url>
cd resourcenyc
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root with the following:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

- Get Supabase credentials from your [Supabase project settings](https://app.supabase.com)
- Get an Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

### 3. Set up the Supabase database

The app reads from a `resources` table in Supabase with the following columns:

`program_name`, `plain_language_program_name`, `program_description`, `plain_language_eligibility`, `how_to_apply_summary`, `url_of_online_application`, `program_category`, `population_served`

If the table is empty or unreachable, the AI falls back to its built in knowledge of NYC programs.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project structure

```
app/
  api/
    match/          # Free text search endpoint (POST)
    profile-match/  # Profile based matching endpoint (POST)
  auth/callback/    # Supabase auth redirect handler
  intake/           # Alternate intake form
  login/            # Login page
  onboarding/       # Multi-step profile form
  signup/           # Signup page
  layout.js         # Root layout with providers
  page.js           # Main dashboard

components/
  AuthProvider.jsx      # Supabase auth context
  ClientProviders.jsx   # Wraps client side providers
  SideNav.jsx           # Sidebar navigation

lib/
  supabase.js       # Supabase client
```

## How the AI matching works

**Free text search** (`/api/match`): The user's message is first sent to Claude Haiku to detect the language. Then Claude Opus receives the user's description alongside the full program list from Supabase (or falls back to built in knowledge) and returns a ranked JSON array of the top 5 matches, with reasoning and application steps written in the user's detected language.

**Profile matching** (`/api/profile-match`): After completing onboarding, the structured profile (income, household, housing, insurance, etc.) is sent to Claude Sonnet, which returns up to 6 ranked programs with eligibility scores, savings estimates, urgency badges, and verified application URLs.

## Deployment

The app is designed to deploy on [Vercel](https://vercel.com). Add your three environment variables in the Vercel project settings and deploy from your repository.

```bash
npm run build   # verify the build locally first
```
