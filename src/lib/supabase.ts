import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'


export const supabase = createClient(supabaseUrl, supabaseAnonKey)


const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})


export const createClerkSupabaseClient = (clerkToken: string) => {
  if (!clerkToken) {
    return createClient(supabaseUrl, supabaseAnonKey)
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
  })
}


import { auth } from '@clerk/nextjs/server'
export async function getSupabase() {
  const { getToken } = await auth();
  let token: string | null = null;
  try {
    token = await getToken({ template: 'supabase' });
  } catch (error) {
    console.error("Clerk JWT template 'supabase' not found. Please create it in the Clerk Dashboard.", error);
  }
  return createClerkSupabaseClient(token || '');
}
