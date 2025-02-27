-- Create just the schedules table (simplified)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  day TEXT NOT NULL,
  subject TEXT NOT NULL,
  study_hours NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for the tables
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Create a simple RLS policy for all operations
CREATE POLICY "Allow authenticated users to manage their own schedules"
  ON public.schedules
  USING (auth.uid() = user_id);
