-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop and recreate tasks table with new columns
DROP TABLE IF EXISTS public.tasks;

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_name TEXT NOT NULL,
    description TEXT,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);

-- Create or replace trigger for updating timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;

-- Create trigger for updating timestamp
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create schedules table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  subject TEXT NOT NULL,
  study_hours NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for the tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Check if policies exist before creating them
DO $$
BEGIN
    -- Tasks policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tasks' AND policyname = 'Users can view their own tasks'
    ) THEN
        CREATE POLICY "Users can view their own tasks" 
        ON public.tasks FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tasks' AND policyname = 'Users can insert their own tasks'
    ) THEN
        CREATE POLICY "Users can insert their own tasks" 
        ON public.tasks FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tasks' AND policyname = 'Users can update their own tasks'
    ) THEN
        CREATE POLICY "Users can update their own tasks" 
        ON public.tasks FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tasks' AND policyname = 'Users can delete their own tasks'
    ) THEN
        CREATE POLICY "Users can delete their own tasks" 
        ON public.tasks FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
    
    -- Schedules policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'schedules' AND policyname = 'Users can view their own schedules'
    ) THEN
        CREATE POLICY "Users can view their own schedules" 
        ON public.schedules FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'schedules' AND policyname = 'Users can insert their own schedules'
    ) THEN
        CREATE POLICY "Users can insert their own schedules" 
        ON public.schedules FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'schedules' AND policyname = 'Users can update their own schedules'
    ) THEN
        CREATE POLICY "Users can update their own schedules" 
        ON public.schedules FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'schedules' AND policyname = 'Users can delete their own schedules'
    ) THEN
        CREATE POLICY "Users can delete their own schedules" 
        ON public.schedules FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END
$$;
