const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertMock() {
  const { data, error } = await supabase.from('Pitch').insert([{
    userId: 'all-users',
    startupName: 'HealthAI (Demo Pitch)',
    problem: 'Doctors spend 30% of their time on administrative tasks, leading to burnout and reduced patient care quality.',
    solution: 'An AI-powered voice assistant that automatically transcribes patient visits, updates EHRs, and schedules follow-ups.',
    targetMarket: 'Primary care clinics in the US.',
    businessModel: 'B2B SaaS ($200/mo per provider)',
    traction: '5 pilot clinics, 20 active providers, LOIs for 50 more.',
    deckData: JSON.stringify([
      { title: "The Problem", content: ["Doctors spend 30% of time on admin", "High burnout rates", "Reduced patient care time"], speakerNotes: "We all know healthcare is broken, but the hidden cost is provider burnout from paperwork." },
      { title: "Our Solution", content: ["Voice AI assistant", "Automated EHR updates", "Seamless scheduling"], speakerNotes: "HealthAI runs quietly in the background and takes care of the paperwork automatically." },
      { title: "Target Market", content: ["Primary care clinics", "$5B TAM", "Focusing on US mid-sized clinics"], speakerNotes: "Our initial focus is on independent primary care clinics." }
    ])
  }]);

  if (error) {
    console.error("Error inserting:", error);
  } else {
    console.log("Success:", data);
  }
}

insertMock();
