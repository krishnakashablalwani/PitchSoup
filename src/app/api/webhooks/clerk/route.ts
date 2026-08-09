import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  
  const payload = await req.json()
  const body = JSON.stringify(payload)

  
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    const email = email_addresses[0]?.email_address

    const { error } = await supabaseAdmin
      .from('User')
      .upsert({
        id,
        email,
        first_name,
        last_name,
        avatar_url: image_url,
      })

    if (error) {
      console.error('Error inserting user to Supabase:', error)
      return new Response('Error inserting user to Supabase', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    const { error } = await supabaseAdmin
      .from('User')
      .delete()
      .eq('id', id as string)

    if (error) {
      console.error('Error deleting user from Supabase:', error)
      return new Response('Error deleting user from Supabase', { status: 500 })
    }
  }

  return new Response('', { status: 200 })
}
