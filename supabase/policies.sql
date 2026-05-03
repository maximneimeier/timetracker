-- Enable RLS on tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can only see their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can only insert their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can only update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can only delete their own projects" ON public.projects;

DROP POLICY IF EXISTS "Users can only see their own time entries" ON public.time_entries;
DROP POLICY IF EXISTS "Users can only insert their own time entries" ON public.time_entries;
DROP POLICY IF EXISTS "Users can only update their own time entries" ON public.time_entries;
DROP POLICY IF EXISTS "Users can only delete their own time entries" ON public.time_entries;

DROP POLICY IF EXISTS "Users can only see their own settings" ON public.settings;
DROP POLICY IF EXISTS "Users can only insert their own settings" ON public.settings;
DROP POLICY IF EXISTS "Users can only update their own settings" ON public.settings;
DROP POLICY IF EXISTS "Users can only delete their own settings" ON public.settings;

-- Projects policies
CREATE POLICY "Users can only see their own projects"
    ON public.projects
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own projects"
    ON public.projects
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own projects"
    ON public.projects
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own projects"
    ON public.projects
    FOR DELETE
    USING (auth.uid() = user_id);

-- Time entries policies
CREATE POLICY "Users can only see their own time entries"
    ON public.time_entries
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own time entries"
    ON public.time_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own time entries"
    ON public.time_entries
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own time entries"
    ON public.time_entries
    FOR DELETE
    USING (auth.uid() = user_id);

-- Settings policies
CREATE POLICY "Users can only see their own settings"
    ON public.settings
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own settings"
    ON public.settings
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own settings"
    ON public.settings
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own settings"
    ON public.settings
    FOR DELETE
    USING (auth.uid() = user_id);

-- Allow anonymous read access to auth.users for foreign key checks (if needed)
-- This is typically not needed if using proper auth flows
