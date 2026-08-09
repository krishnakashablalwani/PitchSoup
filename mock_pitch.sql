INSERT INTO public."Pitch" (
  "userId", 
  "startupName", 
  "problem", 
  "solution", 
  "targetMarket", 
  "businessModel", 
  "traction", 
  "deckData"
) VALUES (
  'all-users', 
  'HealthAI (Demo Pitch)', 
  'Doctors spend 30% of their time on administrative tasks, leading to burnout and reduced patient care quality.', 
  'An AI-powered voice assistant that automatically transcribes patient visits, updates EHRs, and schedules follow-ups.', 
  'Primary care clinics in the US.', 
  'B2B SaaS ($200/mo per provider)', 
  '5 pilot clinics, 20 active providers, LOIs for 50 more.', 
  '[
    {"title": "The Problem", "content": ["Doctors spend 30% of time on admin", "High burnout rates", "Reduced patient care time"], "speakerNotes": "We all know healthcare is broken, but the hidden cost is provider burnout from paperwork."},
    {"title": "Our Solution", "content": ["Voice AI assistant", "Automated EHR updates", "Seamless scheduling"], "speakerNotes": "HealthAI runs quietly in the background and takes care of the paperwork automatically."},
    {"title": "Target Market", "content": ["Primary care clinics", "$5B TAM", "Focusing on US mid-sized clinics"], "speakerNotes": "Our initial focus is on independent primary care clinics."}
  ]'
);
