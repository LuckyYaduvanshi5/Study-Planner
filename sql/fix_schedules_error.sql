-- This script specifically addresses the "relation 'public.schedules' does not exist" error

-- Create UUID extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the schedules table
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  day TEXT NOT NULL,
  subject TEXT NOT NULL,
  study_hours NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on the schedules table
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to access only their own data
DROP POLICY IF EXISTS "Allow users to manage their own schedules" ON public.schedules;
CREATE POLICY "Allow users to manage their own schedules" 
ON public.schedules
USING (auth.uid() = user_id);
