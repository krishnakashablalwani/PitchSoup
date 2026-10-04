-- Create User table for Clerk sync
CREATE TABLE IF NOT EXISTS public."User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT,
  "first_name" TEXT,
  "last_name" TEXT,
  "avatar_url" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (MVP)
CREATE POLICY "Allow all operations for now" ON public."User" FOR ALL USING (true);
