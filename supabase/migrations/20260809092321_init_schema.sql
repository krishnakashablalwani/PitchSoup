-- Create the Pitch table
CREATE TABLE public."Pitch" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "startupName" TEXT NOT NULL,
  "problem" TEXT NOT NULL,
  "solution" TEXT NOT NULL,
  "targetMarket" TEXT NOT NULL,
  "deckData" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the QnA table
CREATE TABLE public."QnA" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "pitchId" UUID NOT NULL REFERENCES public."Pitch"("id") ON DELETE CASCADE,
  "question" TEXT NOT NULL,
  "founderAnswer" TEXT,
  "score" INTEGER,
  "feedback" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add Row Level Security (RLS) policies (Optional but recommended)
ALTER TABLE public."Pitch" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."QnA" ENABLE ROW LEVEL SECURITY;

-- Allow users to read/write their own pitches
CREATE POLICY "Users can manage their own pitches" ON public."Pitch"
  FOR ALL
  USING ("userId" = current_setting('request.jwt.claims')::json->>'sub');

-- Warning: If using server actions with the anon key without sending the clerk JWT to supabase, 
-- you may want to disable RLS or set a blanket policy while developing.
-- For a hackathon MVP using the server-side anon key, you can just do:
CREATE POLICY "Allow all operations for now" ON public."Pitch" FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON public."QnA" FOR ALL USING (true);
