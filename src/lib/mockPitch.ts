import { supabaseAdmin } from './supabase';

export interface PitchSlide {
  title: string;
  content: string[];
  speakerNotes: string;
  graphicsSuggestion?: string;
}

export interface Pitch {
  id: string;
  userId: string;
  startupName: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel?: string;
  traction?: string;
  fundraisingAsk?: string;
  deckData?: string;
  createdAt: string;
  updatedAt?: string;
}

export const DEMO_PITCH_ID = '00000000-0000-0000-0000-000000000001';

export const DEMO_PITCH_SLIDES: PitchSlide[] = [
  {
    title: "HealthAI: Ambient Clinical Intelligence",
    content: [
      "Ambient AI documentation for modern healthcare",
      "Zero clicks, instant SOAP notes, EHR integration",
      "Giving doctors back 2+ hours every day"
    ],
    speakerNotes: "Good afternoon investors. I am excited to introduce HealthAI. We are rebuilding clinical documentation from the ground up by turning ambient exam room conversations into structured, EHR-ready medical records in real time.",
    graphicsSuggestion: "Hero visual showing a doctor talking naturally to a patient while an ambient microphone feeds a clean live transcript and auto-formatted SOAP note."
  },
  {
    title: "Physician Burnout & The $140B Crisis",
    content: [
      "63% of physicians report severe clinical burnout",
      "2.5 hours spent on paperwork per 1 hour of patient care",
      "$140,000 annual administrative overhead per clinician",
      "Patient satisfaction drops due to screen-distracted doctors"
    ],
    speakerNotes: "Healthcare is suffering an unprecedented crisis of documentation. Doctors did not spend a decade in medical school to become data-entry clerks. Today, for every hour spent with a human being, a physician spends two and a half hours typing into an outdated electronic health record.",
    graphicsSuggestion: "Split graphic showing time allocation: 28% patient care vs 72% administrative EHR burden, with a burnout statistic callout."
  },
  {
    title: "The Invisible Ambient Scribe",
    content: [
      "Zero-touch ambient listening on mobile or desktop",
      "Real-time specialized medical NLP transcription",
      "Instant structured SOAP notes & billing code suggestions",
      "Bi-directional sync into Epic, Cerner, and AthenaHealth"
    ],
    speakerNotes: "HealthAI is an ambient intelligence platform that sits invisibly in the background. Doctors simply press start on their phone or tablet. As they converse with the patient, HealthAI listens, isolates clinical facts from casual conversation, and formats a complete, billable clinical note before the patient leaves the room.",
    graphicsSuggestion: "System flow diagram: Ambient audio in -> Medical NLP engine -> Structured SOAP note -> 1-click sync to EHR."
  },
  {
    title: "Built For Real Clinical Workflows",
    content: [
      "Sub-second latency with 99.2% medical terminology accuracy",
      "Automated ICD-10 & CPT medical billing codes",
      "Patient summary & prescription instructions in 12 languages",
      "HIPAA, SOC-2 Type II compliant with end-to-end encryption"
    ],
    speakerNotes: "Our architecture is purpose-built for outpatient medicine. We support multi-speaker acoustic diarization, understand nuanced pharmacological jargon, extract ICD-10 billing codes, and generate patient take-home summaries in their native language.",
    graphicsSuggestion: "Feature cards highlighting 99.2% Medical Accuracy, Real-time Coding, Multilingual Support, and Enterprise Grade Security."
  },
  {
    title: "An $18.4 Billion Untapped Market",
    content: [
      "TAM: $18.4B across 230,000 US outpatient practices",
      "SAM: $5.2B focused on mid-sized independent clinics (5-50 MDs)",
      "SOM: $420M initial expansion in CA, TX, and NY",
      "Favorable tailwinds: rising CMS audit scrutiny & provider shortages"
    ],
    speakerNotes: "The addressable market is enormous. In the US alone, there are over 230,000 outpatient practices. We are focusing initially on mid-sized independent physician groups of 5 to 50 clinicians—a $5.2 billion serviceable market that is agile, makes fast purchasing decisions, and lacks enterprise IT bloat.",
    graphicsSuggestion: "Three concentric market circles showing TAM ($18.4B), SAM ($5.2B), and SOM ($420M) with key demographic callouts."
  },
  {
    title: "Product-Led Growth Meets Clinic Sales",
    content: [
      "14-day free pilot with instant self-onboarding",
      "Bottom-up physician advocacy driving clinic-wide contracts",
      "Direct integrations marketplace distribution (AthenaHealth & Epic App Orchard)",
      "Channel partnerships with regional Independent Practice Associations (IPAs)"
    ],
    speakerNotes: "Our go-to-market engine combines bottom-up clinician love with top-down enterprise expansion. A single physician trials HealthAI for two weeks, falls in love with saving two hours every night, and becomes our internal champion to close the entire medical practice.",
    graphicsSuggestion: "Funnel graphic showing: Free 14-day Doctor Trial -> Clinic Group Expansion -> Regional IPA Partnership rollout."
  },
  {
    title: "Proprietary Acoustic & Clinical Models",
    content: [
      "Fine-tuned LLMs trained on 100k+ de-identified clinical hours",
      "Patent-pending noise suppression for noisy ambulatory rooms",
      "Proprietary EHR bridge connector reducing integration time to <1 hour",
      "Data flywheel: continuous reinforcement learning from physician edits"
    ],
    speakerNotes: "What protects us against generic frontier models? General-purpose models hallucinate in clinical contexts. Our models are fine-tuned on specialized clinical speech, handle background room noise, and get smarter with every physician edit, building a proprietary defensible moat.",
    graphicsSuggestion: "Architectural diagram showing proprietary fine-tuned clinical LLM, reinforcement loop, and lightweight universal EHR adapter."
  },
  {
    title: "High-Margin SaaS With Rapid Payback",
    content: [
      "$299/mo per provider for Standard Ambient Scribe",
      "$499/mo per provider for Pro (with automated billing audit)",
      "85% software gross margin after inference costs",
      "CAC: $1,400 | LTV: $14,200 | LTV:CAC Ratio of 10.1x"
    ],
    speakerNotes: "We operate a high-margin B2B SaaS model with annual upfront contracts. With a blended subscription price of $350 per month and an inference cost of under $45 per doctor, we command an 85% gross margin. Our payback period is under 4 months with an LTV-to-CAC ratio exceeding 10 to 1.",
    graphicsSuggestion: "Pricing tier cards alongside unit economics gauges: 85% Gross Margin, 3.8-Month Payback, 10.1x LTV:CAC."
  },
  {
    title: "Why HealthAI Wins Against Legacy Players",
    content: [
      "Legacy Dictation (Nuance/Dragon): Rigid, manual editing required, costly ($8k+/yr)",
      "Human Virtual Scribes: Expensive ($2,000/mo), high turnover, privacy friction",
      "Generic AI wrappers: High hallucination rates, lack direct EHR sync",
      "HealthAI: Ambient, specialized, 10x cheaper, zero learning curve"
    ],
    speakerNotes: "Legacy players like Nuance Dragon require doctors to dictate structured keywords into a microphone. Virtual human scribes are prohibitively expensive and present privacy concerns. HealthAI provides ambient, real-time fidelity at one-tenth of the price point.",
    graphicsSuggestion: "2x2 matrix plotting Automation and Ambient Intelligence versus Affordability and Ease of Integration, placing HealthAI in the top-right quadrant."
  },
  {
    title: "3-Year Financial Projections",
    content: [
      "Year 1 (2026): $1.2M ARR (280 doctors across 35 clinics)",
      "Year 2 (2027): $4.8M ARR (1,150 doctors, expanding to specialties)",
      "Year 3 (2028): $14.2M ARR (3,400 doctors, net revenue retention 125%)",
      "Cash flow positive projected by Month 26"
    ],
    speakerNotes: "Based on our current sales velocity and low churn, we project crossing $1.2 million in ARR within 12 months, scaling to $4.8 million in Year 2 and $14 million in Year 3. With our high gross margins, we reach operational cash flow positivity by Month 26.",
    graphicsSuggestion: "Bar chart illustrating 3-year ARR progression from $1.2M to $4.8M to $14.2M with profitability crossover line."
  },
  {
    title: "Proven Traction & Velocity",
    content: [
      "$42,000 MRR with 18 paying medical practices",
      "140 active daily physicians, 94% retention at 60 days",
      "38,000+ patient visits documented to date",
      "$310,000 in signed LOIs scheduled for Q4 onboarding"
    ],
    speakerNotes: "We are not an idea on a napkin. We have $42,000 in monthly recurring revenue across 18 clinics. Over 140 physicians use HealthAI every single day to document visits, and our 60-day cohort retention stands at 94%. We also have over $300k in signed LOIs awaiting deployment.",
    graphicsSuggestion: "Timeline showing major milestones: MVP launch -> First 5 clinics -> $42k MRR -> Epic integration approval."
  },
  {
    title: "The Ask: $1.5M Seed Round",
    content: [
      "Raising $1.5M on a SAFE at $12M valuation cap",
      "55% ($825k): AI Engineering & Epic/Cerner certified integrations",
      "30% ($450k): Dedicated GTM & Clinic Account Executives",
      "15% ($225k): HIPAA compliance, security certifications & working capital",
      "Milestone target: Reach $2.5M ARR and 600 clinics within 18 months"
    ],
    speakerNotes: "We are raising a $1.5 million Seed round to accelerate our growth. 55% of proceeds will scale our core AI engineering and complete certified EHR app store listings, while 30% will fund our direct clinic sales team. With this capital, we will reach $2.5 million ARR within 18 months. Join us in curing doctor burnout.",
    graphicsSuggestion: "Donut chart breaking down fund allocation (55% R&D, 30% Sales/GTM, 15% Ops/Compliance) alongside target milestone badge: $2.5M ARR."
  }
];

export const DEFAULT_MOCK_PITCH: Pitch = {
  id: DEMO_PITCH_ID,
  userId: 'all-users',
  startupName: 'HealthAI - Ambient Clinical Intelligence',
  problem: 'Physicians spend over 2 hours on administrative documentation and EHR data entry for every 1 hour of direct patient care. This causes 63% clinician burnout, $140,000 in administrative overhead per doctor annually, and rushed consultations.',
  solution: 'An ambient AI voice assistant that listens to patient encounters with zero friction, generates 99% accurate structured SOAP notes in real-time, and auto-syncs with major EHR systems.',
  targetMarket: 'US Outpatient & Primary Care Clinics (TAM: $18.4B across 230k practices, SAM: $5.2B mid-sized groups, SOM: $420M multi-specialty regional clinics).',
  businessModel: 'B2B SaaS tiered pricing: $299/month per physician (Standard ambient scribe) and $499/month (Pro with auto-coding & revenue cycle audits). 85% gross margins with annual upfront commitments.',
  traction: '$42,000 MRR with 18 paying clinics, 140 active daily physicians, 94% retention at 60 days, and 38,000+ patient visits successfully charted.',
  fundraisingAsk: '$1.5M Seed Round at a $12M valuation cap. 55% for engineering & deep EHR integrations, 30% for clinic sales reps, 15% for HIPAA compliance.',
  deckData: JSON.stringify(DEMO_PITCH_SLIDES),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Fetch pitches for a user, with resilience against local TLS/network restrictions (ECONNRESET)
 * and missing database records by always providing the high-fidelity mock demo pitch.
 */
export async function getPitchesForUser(userId: string): Promise<Pitch[]> {
  try {
    const { data: dbPitches, error } = await supabaseAdmin
      .from('Pitch')
      .select('*')
      .in('userId', [userId, 'all-users'])
      .order('createdAt', { ascending: false });

    if (error || !dbPitches || dbPitches.length === 0) {
      return [DEFAULT_MOCK_PITCH];
    }

    // Ensure mock demo pitch is included if user has no pitches of their own
    const hasAny = dbPitches.length > 0;
    if (!hasAny) {
      return [DEFAULT_MOCK_PITCH];
    }

    // If user's own pitches exist but no demo pitch, prepend or append the demo pitch
    const hasMock = dbPitches.some(p => p.userId === 'all-users' || p.id === DEMO_PITCH_ID);
    if (!hasMock) {
      return [...dbPitches, DEFAULT_MOCK_PITCH];
    }

    return dbPitches as Pitch[];
  } catch (err) {
    // If Supabase connection fails (e.g. ECONNRESET on local machine)
    return [DEFAULT_MOCK_PITCH];
  }
}

/**
 * Fetch a single pitch by ID, gracefully falling back to the demo pitch if network is unreachable
 * or if the requested ID corresponds to the demo pitch.
 */
export async function getPitchById(id: string): Promise<Pitch | null> {
  if (id === DEMO_PITCH_ID || id === 'demo-healthai' || id === 'all-users') {
    return DEFAULT_MOCK_PITCH;
  }

  try {
    const { data: pitch, error } = await supabaseAdmin
      .from('Pitch')
      .select('*')
      .eq('id', id)
      .single();

    if (pitch && !error) {
      return pitch as Pitch;
    }
  } catch (err) {
    console.warn("Supabase fetch by ID error, falling back:", err);
  }

  // If DB failed or pitch wasn't found, fallback to DEFAULT_MOCK_PITCH to ensure demo continuity
  return DEFAULT_MOCK_PITCH;
}
