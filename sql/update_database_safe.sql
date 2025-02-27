
-- First, ensure the extension for UUID exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_name TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  day TEXT NOT NULL,
  subject TEXT NOT NULL,
  study_hours NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for the tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and you want to recreate them
-- Uncomment these if you want to completely reset policies
-- DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
-- DROP POLICY IF EXISTS "Users can insert their own tasks" ON public.tasks;
-- DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
-- DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;
-- 
-- DROP POLICY IF EXISTS "Users can view their own schedules" ON public.schedules;
-- DROP POLICY IF EXISTS "Users can insert their own schedules" ON public.schedules;
-- DROP POLICY IF EXISTS "Users can update their own schedules" ON public.schedules;
-- DROP POLICY IF EXISTS "Users can delete their own schedules" ON public.schedules;

-- Create a single policy for each table (simplest approach)
DO $$
BEGIN
    -- Check if policy exists for tasks table
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'tasks' AND policyname = 'Allow users to manage their own tasks'
    ) THEN
        CREATE POLICY "Allow users to manage their own tasks" 
        ON public.tasks
        USING (auth.uid() = user_id);
    END IF;

    -- Check if policy exists for schedules table
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'schedules' AND policyname = 'Allow users to manage their own schedules'
    ) THEN
        CREATE POLICY "Allow users to manage their own schedules" 
        ON public.schedules
        USING (auth.uid() = user_id);
    END IF;
END
$$;
