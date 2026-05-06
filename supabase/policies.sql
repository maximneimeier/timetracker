-- Enable RLS on tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can only see their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can only insert their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can only update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can only delete their own projects" ON public.projects;

DROP POLICY IF EXISTS "ws_projects_select" ON public.projects;
DROP POLICY IF EXISTS "ws_projects_insert" ON public.projects;
DROP POLICY IF EXISTS "ws_projects_update" ON public.projects;
DROP POLICY IF EXISTS "ws_projects_delete" ON public.projects;

DROP POLICY IF EXISTS "Users can only see their own time entries" ON public.time_entries;
DROP POLICY IF EXISTS "Users can only insert their own time entries" ON public.time_entries;
DROP POLICY IF EXISTS "Users can only update their own time entries" ON public.time_entries;
DROP POLICY IF EXISTS "Users can only delete their own time entries" ON public.time_entries;

DROP POLICY IF EXISTS "ws_te_select" ON public.time_entries;
DROP POLICY IF EXISTS "ws_te_insert" ON public.time_entries;
DROP POLICY IF EXISTS "ws_te_update" ON public.time_entries;
DROP POLICY IF EXISTS "ws_te_delete" ON public.time_entries;

DROP POLICY IF EXISTS "Users can only see their own settings" ON public.settings;
DROP POLICY IF EXISTS "Users can only insert their own settings" ON public.settings;
DROP POLICY IF EXISTS "Users can only update their own settings" ON public.settings;
DROP POLICY IF EXISTS "Users can only delete their own settings" ON public.settings;

-- Projects (über workspace + Rolle verwaltbar)
CREATE POLICY "ws_projects_select" ON public.projects FOR SELECT USING (
    workspace_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.workspace_members wm
        WHERE wm.workspace_id = projects.workspace_id AND wm.user_id = auth.uid()
    )
);

CREATE POLICY "ws_projects_insert" ON public.projects FOR INSERT WITH CHECK (
    auth.uid() = user_id AND workspace_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.workspaces w
        INNER JOIN public.workspace_members wm ON wm.workspace_id = w.id AND wm.user_id = auth.uid()
        WHERE w.id = projects.workspace_id
          AND (w.kind = 'solo' OR wm.role IN ('owner', 'admin'))
    )
);

CREATE POLICY "ws_projects_update" ON public.projects FOR UPDATE USING (
    workspace_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.workspaces w
        INNER JOIN public.workspace_members wm ON wm.workspace_id = w.id AND wm.user_id = auth.uid()
        WHERE w.id = projects.workspace_id
          AND (w.kind = 'solo' OR wm.role IN ('owner', 'admin'))
    )
);

CREATE POLICY "ws_projects_delete" ON public.projects FOR DELETE USING (
    workspace_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.workspaces w
        INNER JOIN public.workspace_members wm ON wm.workspace_id = w.id AND wm.user_id = auth.uid()
        WHERE w.id = projects.workspace_id
          AND (w.kind = 'solo' OR wm.role IN ('owner', 'admin'))
    )
);

-- Zeiteinträge (Mitarbeitende nur eigene; Owner/Admin sehen Workspace)
CREATE POLICY "ws_te_select" ON public.time_entries FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        INNER JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
        WHERE p.id = time_entries.project_id AND wm.user_id = auth.uid()
    )
    AND (
        time_entries.user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.projects p2
            INNER JOIN public.workspace_members wm2 ON wm2.workspace_id = p2.workspace_id
            WHERE p2.id = time_entries.project_id
              AND wm2.user_id = auth.uid()
              AND wm2.role IN ('owner', 'admin')
        )
    )
);

CREATE POLICY "ws_te_insert" ON public.time_entries FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
        SELECT 1 FROM public.projects p
        INNER JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
        WHERE p.id = project_id AND wm.user_id = auth.uid()
    )
);

CREATE POLICY "ws_te_update" ON public.time_entries FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        INNER JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
        WHERE p.id = time_entries.project_id AND wm.user_id = auth.uid()
    )
    AND (
        time_entries.user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.projects p2
            INNER JOIN public.workspace_members wm2 ON wm2.workspace_id = p2.workspace_id
            WHERE p2.id = time_entries.project_id
              AND wm2.user_id = auth.uid()
              AND wm2.role IN ('owner', 'admin')
        )
    )
);

CREATE POLICY "ws_te_delete" ON public.time_entries FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        INNER JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
        WHERE p.id = time_entries.project_id AND wm.user_id = auth.uid()
    )
    AND (
        time_entries.user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.projects p2
            INNER JOIN public.workspace_members wm2 ON wm2.workspace_id = p2.workspace_id
            WHERE p2.id = time_entries.project_id
              AND wm2.user_id = auth.uid()
              AND wm2.role IN ('owner', 'admin')
        )
    )
);

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

-- Expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can see own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can insert own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can update own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can delete own expenses" ON public.expenses;

DROP POLICY IF EXISTS "ws_exp_select" ON public.expenses;
DROP POLICY IF EXISTS "ws_exp_ins" ON public.expenses;
DROP POLICY IF EXISTS "ws_exp_upd" ON public.expenses;
DROP POLICY IF EXISTS "ws_exp_del" ON public.expenses;

CREATE POLICY "ws_exp_select" ON public.expenses FOR SELECT USING (
    workspace_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = expenses.workspace_id AND wm.user_id = auth.uid()
    )
    AND (
        expenses.user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.workspace_members wm2
            JOIN public.workspaces w ON w.id = wm2.workspace_id
            WHERE wm2.workspace_id = expenses.workspace_id
              AND wm2.user_id = auth.uid()
              AND wm2.role IN ('owner', 'admin')
        )
    )
);

CREATE POLICY "ws_exp_ins" ON public.expenses FOR INSERT WITH CHECK (
    auth.uid() = user_id AND workspace_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.workspace_members wm
        JOIN public.workspaces w ON w.id = wm.workspace_id
        WHERE wm.workspace_id = expenses.workspace_id AND wm.user_id = auth.uid()
          AND (w.kind = 'solo' OR wm.role IN ('owner', 'admin'))
    )
);

CREATE POLICY "ws_exp_upd" ON public.expenses FOR UPDATE USING (
    workspace_id IS NOT NULL
    AND EXISTS (
        SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = expenses.workspace_id AND wm.user_id = auth.uid()
    )
    AND (
        expenses.user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.workspace_members wm2
            WHERE wm2.workspace_id = expenses.workspace_id
              AND wm2.user_id = auth.uid()
              AND wm2.role IN ('owner', 'admin')
        )
    )
);

CREATE POLICY "ws_exp_del" ON public.expenses FOR DELETE USING (
    workspace_id IS NOT NULL
    AND EXISTS (
        SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = expenses.workspace_id AND wm.user_id = auth.uid()
    )
    AND (
        expenses.user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.workspace_members wm2
            WHERE wm2.workspace_id = expenses.workspace_id
              AND wm2.user_id = auth.uid()
              AND wm2.role IN ('owner', 'admin')
        )
    )
);

-- Customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own customers" ON public.customers;
DROP POLICY IF EXISTS "Users insert own customers" ON public.customers;
DROP POLICY IF EXISTS "Users update own customers" ON public.customers;
DROP POLICY IF EXISTS "Users delete own customers" ON public.customers;

DROP POLICY IF EXISTS "ws_cust_sel" ON public.customers;
DROP POLICY IF EXISTS "ws_cust_ins" ON public.customers;
DROP POLICY IF EXISTS "ws_cust_upd" ON public.customers;
DROP POLICY IF EXISTS "ws_cust_del" ON public.customers;

CREATE POLICY "ws_cust_sel" ON public.customers FOR SELECT USING (
    workspace_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = customers.workspace_id AND wm.user_id = auth.uid()
    )
    AND (
        customers.user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.workspace_members wm2
            WHERE wm2.workspace_id = customers.workspace_id
              AND wm2.user_id = auth.uid()
              AND wm2.role IN ('owner', 'admin')
        )
    )
);

CREATE POLICY "ws_cust_ins" ON public.customers FOR INSERT WITH CHECK (
    auth.uid() = user_id AND workspace_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.workspace_members wm
        JOIN public.workspaces w ON w.id = wm.workspace_id
        WHERE wm.workspace_id = customers.workspace_id AND wm.user_id = auth.uid()
          AND (w.kind = 'solo' OR wm.role IN ('owner', 'admin'))
    )
);

CREATE POLICY "ws_cust_upd" ON public.customers FOR UPDATE USING (
    workspace_id IS NOT NULL
    AND EXISTS (
        SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = customers.workspace_id AND wm.user_id = auth.uid()
    )
    AND (
        customers.user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.workspace_members wm2
            WHERE wm2.workspace_id = customers.workspace_id
              AND wm2.user_id = auth.uid()
              AND wm2.role IN ('owner', 'admin')
        )
    )
);

CREATE POLICY "ws_cust_del" ON public.customers FOR DELETE USING (
    workspace_id IS NOT NULL
    AND EXISTS (
        SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = customers.workspace_id AND wm.user_id = auth.uid()
    )
    AND (
        customers.user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.workspace_members wm2
            WHERE wm2.workspace_id = customers.workspace_id
              AND wm2.user_id = auth.uid()
              AND wm2.role IN ('owner', 'admin')
        )
    )
);

-- Quotes
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users insert own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users update own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users delete own quotes" ON public.quotes;

DROP POLICY IF EXISTS "ws_qu_sel" ON public.quotes;
DROP POLICY IF EXISTS "ws_qu_ins" ON public.quotes;
DROP POLICY IF EXISTS "ws_qu_upd" ON public.quotes;
DROP POLICY IF EXISTS "ws_qu_del" ON public.quotes;

CREATE POLICY "ws_qu_sel" ON public.quotes FOR SELECT USING (
    workspace_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = quotes.workspace_id AND wm.user_id = auth.uid()
    )
    AND (
        quotes.user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.workspace_members wm2
            WHERE wm2.workspace_id = quotes.workspace_id
              AND wm2.user_id = auth.uid()
              AND wm2.role IN ('owner', 'admin')
        )
    )
);

CREATE POLICY "ws_qu_ins" ON public.quotes FOR INSERT WITH CHECK (
    auth.uid() = user_id AND workspace_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.workspace_members wm
        JOIN public.workspaces w ON w.id = wm.workspace_id
        WHERE wm.workspace_id = quotes.workspace_id AND wm.user_id = auth.uid()
          AND (w.kind = 'solo' OR wm.role IN ('owner', 'admin'))
    )
);

CREATE POLICY "ws_qu_upd" ON public.quotes FOR UPDATE USING (
    workspace_id IS NOT NULL
    AND EXISTS (
        SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = quotes.workspace_id AND wm.user_id = auth.uid()
    )
    AND (
        quotes.user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.workspace_members wm2
            WHERE wm2.workspace_id = quotes.workspace_id
              AND wm2.user_id = auth.uid()
              AND wm2.role IN ('owner', 'admin')
        )
    )
);

CREATE POLICY "ws_qu_del" ON public.quotes FOR DELETE USING (
    workspace_id IS NOT NULL
    AND EXISTS (
        SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = quotes.workspace_id AND wm.user_id = auth.uid()
    )
    AND (
        quotes.user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.workspace_members wm2
            WHERE wm2.workspace_id = quotes.workspace_id
              AND wm2.user_id = auth.uid()
              AND wm2.role IN ('owner', 'admin')
        )
    )
);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ws_wspaces_sel" ON public.workspaces;
DROP POLICY IF EXISTS "ws_wspaces_ins" ON public.workspaces;
DROP POLICY IF EXISTS "ws_wspaces_upd" ON public.workspaces;
DROP POLICY IF EXISTS "ws_wspaces_del" ON public.workspaces;

CREATE POLICY "ws_wspaces_sel" ON public.workspaces FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = workspaces.id AND wm.user_id = auth.uid())
);

CREATE POLICY "ws_wspaces_ins" ON public.workspaces FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "ws_wspaces_upd" ON public.workspaces FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "ws_wspaces_del" ON public.workspaces FOR DELETE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "ws_wmem_sel" ON public.workspace_members;
DROP POLICY IF EXISTS "ws_wmem_ins" ON public.workspace_members;
DROP POLICY IF EXISTS "ws_wmem_upd" ON public.workspace_members;
DROP POLICY IF EXISTS "ws_wmem_del" ON public.workspace_members;

CREATE POLICY "ws_wmem_sel" ON public.workspace_members FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = workspace_members.workspace_id AND wm.user_id = auth.uid())
);

CREATE POLICY "ws_wmem_ins" ON public.workspace_members FOR INSERT WITH CHECK (
    (
        auth.uid() = user_id
        AND role = 'owner'
        AND EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_members.workspace_id AND w.owner_id = auth.uid())
    )
    OR EXISTS (
        SELECT 1 FROM public.workspace_members wm
        WHERE wm.workspace_id = workspace_members.workspace_id AND wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin')
    )
);

CREATE POLICY "ws_wmem_upd" ON public.workspace_members FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = workspace_members.workspace_id AND wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
);

CREATE POLICY "ws_wmem_del" ON public.workspace_members FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = workspace_members.workspace_id AND wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
);

DROP POLICY IF EXISTS "ws_wsett_sel" ON public.workspace_settings;
DROP POLICY IF EXISTS "ws_wsett_ins" ON public.workspace_settings;
DROP POLICY IF EXISTS "ws_wsett_upd" ON public.workspace_settings;

CREATE POLICY "ws_wsett_sel" ON public.workspace_settings FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = workspace_settings.workspace_id AND wm.user_id = auth.uid())
);

CREATE POLICY "ws_wsett_ins" ON public.workspace_settings FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = workspace_settings.workspace_id AND wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
);

CREATE POLICY "ws_wsett_upd" ON public.workspace_settings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = workspace_settings.workspace_id AND wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
);

-- Allow anonymous read access to auth.users for foreign key checks (if needed)
-- This is typically not needed if using proper auth flows
