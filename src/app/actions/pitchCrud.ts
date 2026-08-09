"use server";

import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function deletePitch(pitchId: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase.from('Pitch')
    .delete()
    .eq('id', pitchId)
    .eq('userId', userId);

  if (error) {
    console.error(error);
    throw new Error('Failed to delete pitch');
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function updatePitch(pitchId: string, formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const startupName = formData.get('startupName') as string;
  const problem = formData.get('problem') as string;
  const solution = formData.get('solution') as string;
  const targetMarket = formData.get('targetMarket') as string;

  const { error } = await supabase.from('Pitch')
    .update({ startupName, problem, solution, targetMarket })
    .eq('id', pitchId)
    .eq('userId', userId);

  if (error) {
    console.error(error);
    throw new Error('Failed to update pitch');
  }

  revalidatePath('/dashboard');
  revalidatePath(`/deck/${pitchId}`);
}
