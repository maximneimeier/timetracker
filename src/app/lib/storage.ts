'use client';

import { supabase } from './supabase';
import { normalizeTimerPreset, type TimerPresetId } from './timerPreset';
import { normalizeQuoteStatus, normalizeRecurrence, type QuoteStatus, type Recurrence } from './crmTypes';

export type { QuoteStatus, Recurrence } from './crmTypes';
export { QUOTE_STATUS_VALUES, RECURRENCE_VALUES } from './crmTypes';

export type { TimerPresetId } from './timerPreset';
export { TIMER_PRESET_IDS, normalizeTimerPreset } from './timerPreset';

function getSupabase() {
  return supabase;
}

export type WorkspaceKind = 'solo' | 'company';
export type WorkspaceRole = 'owner' | 'admin' | 'member';

export interface Workspace {
  id: string;
  owner_id: string;
  name: string;
  kind: WorkspaceKind;
  created_at: string;
}

// Check if user is authenticated
/** Kalkulatorischer Stundensatz pro Projekt (EUR), Fallback für alte Daten */
export const DEFAULT_PROJECT_HOURLY_RATE = 150;

function normalizeProjectHourlyRate(v: unknown): number {
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  if (Number.isFinite(n) && n >= 0) return n;
  return DEFAULT_PROJECT_HOURLY_RATE;
}

function normalizeWorkspaceKind(k: unknown): WorkspaceKind {
  return k === 'company' ? 'company' : 'solo';
}

function normalizeWorkspaceRole(r: unknown): WorkspaceRole {
  if (r === 'admin' || r === 'member' || r === 'owner') return r;
  return 'member';
}

function newLocalId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

const LOCAL_USER_KEY = 'local';

export async function isAuthenticated(): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { data } = await sb.auth.getSession();
  return !!data.session;
}

// Get current user ID
export async function getCurrentUserId(): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session?.user?.id || null;
}

export interface Project {
  id: string;
  user_id: string;
  workspace_id: string;
  name: string;
  description?: string;
  /** Kalkulatorischer Stundensatz (EUR) für Erlösrechnung */
  hourly_rate: number;
  created_at: string;
}

export interface TimeEntry {
  id: string;
  user_id: string;
  project_id: string;
  date: string;
  hours: number;
  description: string;
  start_time?: string;
  end_time?: string;
  is_timer?: boolean;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  workspace_id: string;
  amount: number;
  date: string;
  description: string;
  created_at: string;
  is_recurring: boolean;
  recurrence: Recurrence | null;
  recurrence_end: string | null;
  customer_id: string | null;
}

export interface Customer {
  id: string;
  user_id: string;
  workspace_id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  created_at: string;
}

export interface Quote {
  id: string;
  user_id: string;
  workspace_id: string;
  customer_id: string;
  title: string;
  amount: number;
  status: QuoteStatus;
  is_recurring: boolean;
  recurrence: Recurrence | null;
  recurrence_end: string | null;
  created_at: string;
}

export interface TimerState {
  running: boolean;
  project_id: string;
  start_timestamp: number;
}

export interface Settings {
  id?: string;
  user_id: string;
  timer_preset: TimerPresetId;
}

export type Language = 'de' | 'en' | 'es' | 'fr' | 'ru';

// Legacy localStorage interfaces (for migration)
interface LegacyProject {
  id: number;
  name: string;
  description?: string;
  hourly_rate?: number;
  workspace_id?: string;
  created_at: string;
}

interface LegacyTimeEntry {
  id: number;
  project_id: number;
  date: string;
  hours: number;
  description: string;
  start_time?: string;
  end_time?: string;
  is_timer?: boolean;
  created_at: string;
}

interface LegacySettings {
  hourly_rate?: number;
  timer_preset?: string;
}

interface LegacyExpense {
  id: number;
  amount: number;
  date: string;
  description?: string;
  created_at: string;
  is_recurring?: boolean;
  recurrence?: string | null;
  recurrence_end?: string | null;
  customer_id?: string | null;
  workspace_id?: string;
}

interface LegacyCustomer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
  created_at: string;
  workspace_id?: string;
}

interface LegacyQuote {
  id: number;
  customer_id: string;
  title?: string;
  amount: number;
  status: string;
  is_recurring: boolean;
  recurrence?: string | null;
  recurrence_end?: string | null;
  created_at: string;
  workspace_id?: string;
}

interface LegacyWorkspaceRow {
  id: string;
  owner_id: string;
  name: string;
  kind: WorkspaceKind;
  created_at: string;
}

// Initialize default data
function initStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem('timetracker_projects')) {
    localStorage.setItem('timetracker_projects', JSON.stringify([]));
  }
  if (!localStorage.getItem('timetracker_entries')) {
    localStorage.setItem('timetracker_entries', JSON.stringify([]));
  }
  if (!localStorage.getItem('timetracker_settings')) {
    localStorage.setItem('timetracker_settings', JSON.stringify({ timer_preset: 'classic' }));
  }
  if (!localStorage.getItem('timetracker_language')) {
    localStorage.setItem('timetracker_language', 'de');
  }
  if (!localStorage.getItem('timetracker_expenses')) {
    localStorage.setItem('timetracker_expenses', JSON.stringify([]));
  }
  if (!localStorage.getItem('timetracker_customers')) {
    localStorage.setItem('timetracker_customers', JSON.stringify([]));
  }
  if (!localStorage.getItem('timetracker_quotes')) {
    localStorage.setItem('timetracker_quotes', JSON.stringify([]));
  }
  if (!localStorage.getItem('timetracker_workspaces')) {
    localStorage.setItem('timetracker_workspaces', JSON.stringify([]));
  }
}

function attachOrphansToWorkspaceLocal(workspaceId: string): void {
  const touch = <T extends { workspace_id?: string }>(raw: string, key: string) => {
    try {
      const list: T[] = JSON.parse(localStorage.getItem(raw) || '[]');
      let ch = false;
      for (const row of list) {
        if (!row.workspace_id) {
          row.workspace_id = workspaceId;
          ch = true;
        }
      }
      if (ch) localStorage.setItem(key, JSON.stringify(list));
    } catch {
      /* ignore */
    }
  };
  touch<LegacyProject>('timetracker_projects', 'timetracker_projects');
  touch<LegacyExpense>('timetracker_expenses', 'timetracker_expenses');
  touch<LegacyCustomer>('timetracker_customers', 'timetracker_customers');
  touch<LegacyQuote>('timetracker_quotes', 'timetracker_quotes');
}

function mapExpenseRow(row: Record<string, unknown>): Expense {
  const amount = row.amount;
  return {
    id: String(row.id),
    user_id: String(row.user_id ?? ''),
    workspace_id: String(row.workspace_id ?? ''),
    amount: typeof amount === 'string' ? parseFloat(amount) : Number(amount),
    date: String(row.date),
    description: String(row.description ?? ''),
    created_at: String(row.created_at ?? ''),
    is_recurring: Boolean(row.is_recurring),
    recurrence: normalizeRecurrence(row.recurrence),
    recurrence_end: row.recurrence_end ? String(row.recurrence_end) : null,
    customer_id: row.customer_id ? String(row.customer_id) : null,
  };
}

// Migrate localStorage data to Supabase
export async function migrateLocalDataToSupabase(userId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  
  const migrationKey = `timetracker_migrated_${userId}`;
  if (localStorage.getItem(migrationKey)) return; // Already migrated

  const sb = getSupabase();
  if (!sb) return;

  // Get local data
  const localProjects: LegacyProject[] = JSON.parse(localStorage.getItem('timetracker_projects') || '[]');
  const localEntries: LegacyTimeEntry[] = JSON.parse(localStorage.getItem('timetracker_entries') || '[]');
  const localSettings: LegacySettings = JSON.parse(
    localStorage.getItem('timetracker_settings') || '{"timer_preset":"classic"}'
  );

  if (localProjects.length === 0 && localEntries.length === 0) {
    localStorage.setItem(migrationKey, 'true');
    return;
  }

  // Check if user already has data in Supabase
  const { data: existingProjects } = await sb.from('projects').select('id').eq('user_id', userId).limit(1);
  const { data: existingEntries } = await sb.from('time_entries').select('id').eq('user_id', userId).limit(1);

  if ((existingProjects && existingProjects.length > 0) || (existingEntries && existingEntries.length > 0)) {
    // User already has data in Supabase, skip migration
    localStorage.setItem(migrationKey, 'true');
    return;
  }

  const { data: wsRow, error: wsErr } = await sb
    .from('workspaces')
    .insert({ owner_id: userId, name: 'Mein Bereich', kind: 'solo' })
    .select()
    .single();

  if (wsErr || !wsRow) {
    localStorage.setItem(migrationKey, 'true');
    return;
  }

  const wsId = String(wsRow.id);
  await sb.from('workspace_members').insert({
    workspace_id: wsId,
    user_id: userId,
    role: 'owner',
  });
  await sb.from('workspace_settings').insert({
    workspace_id: wsId,
    timer_preset: normalizeTimerPreset(localSettings.timer_preset),
  });

  // Migrate projects
  const projectIdMap = new Map<number, string>();
  
  for (const project of localProjects) {
    const legacyGlobalRate = normalizeProjectHourlyRate(localSettings.hourly_rate);
    const projectRate = normalizeProjectHourlyRate(project.hourly_rate ?? legacyGlobalRate);

    const { data: newProject, error } = await sb
      .from('projects')
      .insert({
        user_id: userId,
        workspace_id: wsId,
        name: project.name,
        description: project.description,
        hourly_rate: projectRate,
        created_at: project.created_at,
      })
      .select()
      .single();
    
    if (!error && newProject) {
      projectIdMap.set(project.id, (newProject).id);
    }
  }

  // Migrate time entries
  for (const entry of localEntries) {
    const newProjectId = projectIdMap.get(entry.project_id);
    if (newProjectId) {
      await sb.from('time_entries').insert({
        user_id: userId,
        project_id: newProjectId,
        date: entry.date,
        hours: entry.hours,
        description: entry.description,
        start_time: entry.start_time,
        end_time: entry.end_time,
        is_timer: entry.is_timer,
        created_at: entry.created_at,
      });
    }
  }

  // Migrate settings
  const { data: existingSettings } = await sb.from('settings').select('id').eq('user_id', userId).single();
  if (!existingSettings) {
    await sb.from('settings').insert({
      user_id: userId,
      timer_preset: normalizeTimerPreset(localSettings.timer_preset),
    });
  }

  try {
    const rawEx = localStorage.getItem('timetracker_expenses');
    if (rawEx) {
      const localEx: LegacyExpense[] = JSON.parse(rawEx);
      for (const ex of localEx) {
        await sb.from('expenses').insert({
          user_id: userId,
          workspace_id: ex.workspace_id ? String(ex.workspace_id) : wsId,
          amount: ex.amount,
          date: ex.date,
          description: ex.description || '',
          is_recurring: ex.is_recurring ?? false,
          recurrence: ex.recurrence ?? null,
          recurrence_end: ex.recurrence_end ?? null,
          customer_id: ex.customer_id ?? null,
        });
      }
    }
  } catch {
    /* Tabelle „expenses“ ggf. noch nicht angelegt */
  }

  // Mark as migrated
  localStorage.setItem(migrationKey, 'true');
}

// ============ Workspaces ============

export async function listWorkspaces(): Promise<Workspace[]> {
  if (typeof window === 'undefined') return [];

  initStorage();

  const userId = await getCurrentUserId();
  const sb = getSupabase();

  if (userId && sb) {
    try {
      const { data: memberships, error: e1 } = await sb
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', userId);
      if (e1) throw e1;
      const ids = [...new Set((memberships || []).map((m: { workspace_id: string }) => m.workspace_id))];
      if (ids.length === 0) return [];
      const { data: spaces, error: e2 } = await sb
        .from('workspaces')
        .select('id,owner_id,name,kind,created_at')
        .in('id', ids)
        .order('created_at', { ascending: false });
      if (e2) throw e2;
      return (spaces || []).map(w => ({
        id: String(w.id),
        owner_id: String(w.owner_id),
        name: String(w.name),
        kind: normalizeWorkspaceKind(w.kind),
        created_at: String(w.created_at ?? ''),
      }));
    } catch {
      /* offline / altes Schema */
    }
  }

  let rows: LegacyWorkspaceRow[] = [];
  try {
    rows = JSON.parse(localStorage.getItem('timetracker_workspaces') || '[]');
  } catch {
    rows = [];
  }

  const tsNow = new Date().toISOString();
  const ownerFallback = userId || LOCAL_USER_KEY;

  if (rows.length === 0) {
    const wid = newLocalId();
    rows = [{ id: wid, owner_id: ownerFallback, name: 'Mein Bereich', kind: 'solo', created_at: tsNow }];
    localStorage.setItem('timetracker_workspaces', JSON.stringify(rows));
  }

  attachOrphansToWorkspaceLocal(rows[0].id);

  return rows.map(r => ({
    id: r.id,
    owner_id: r.owner_id,
    name: r.name,
    kind: r.kind === 'company' ? 'company' : 'solo',
    created_at: r.created_at,
  }));
}

export async function createWorkspace(name: string, kind: WorkspaceKind): Promise<Workspace> {
  if (typeof window === 'undefined') throw new Error('Not in browser');

  const userId = await getCurrentUserId();
  const sb = getSupabase();
  const ts = new Date().toISOString();
  const label = name.trim() || (kind === 'company' ? 'Unternehmen' : 'Freiberufler');

  if (userId && sb) {
    try {
      const { data: w, error } = await sb
        .from('workspaces')
        .insert({ owner_id: userId, name: label, kind })
        .select('*')
        .single();
      if (error || !w) throw error ?? new Error('workspace insert');
      const wid = String(w.id);
      await sb.from('workspace_members').insert({
        workspace_id: wid,
        user_id: userId,
        role: 'owner',
      });
      await sb.from('workspace_settings').insert({
        workspace_id: wid,
        timer_preset: 'classic',
      });
      return {
        id: wid,
        owner_id: String(w.owner_id),
        name: String(w.name),
        kind: normalizeWorkspaceKind(w.kind),
        created_at: String(w.created_at ?? ts),
      };
    } catch {
      /* localStorage Fallback */
    }
  }

  initStorage();
  const wid = newLocalId();
  const ownerFallback = userId || LOCAL_USER_KEY;
  const row: LegacyWorkspaceRow = { id: wid, owner_id: ownerFallback, name: label, kind, created_at: ts };
  const rows: LegacyWorkspaceRow[] = JSON.parse(localStorage.getItem('timetracker_workspaces') || '[]');
  rows.push(row);
  localStorage.setItem('timetracker_workspaces', JSON.stringify(rows));
  return {
    id: wid,
    owner_id: ownerFallback,
    name: label,
    kind,
    created_at: ts,
  };
}

export async function getWorkspaceById(workspaceId: string): Promise<Workspace | null> {
  if (!workspaceId) return null;
  const userId = await getCurrentUserId();
  const sb = getSupabase();

  if (userId && sb) {
    try {
      const { data: m } = await sb
        .from('workspace_members')
        .select('workspace_id')
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)
        .maybeSingle();
      if (!m) return null;
      const { data: w, error } = await sb.from('workspaces').select('*').eq('id', workspaceId).single();
      if (error || !w) return null;
      return {
        id: String(w.id),
        owner_id: String(w.owner_id),
        name: String(w.name),
        kind: normalizeWorkspaceKind(w.kind),
        created_at: String(w.created_at ?? ''),
      };
    } catch {
      return null;
    }
  }

  initStorage();
  let rows: LegacyWorkspaceRow[] = [];
  try {
    rows = JSON.parse(localStorage.getItem('timetracker_workspaces') || '[]');
  } catch {
    rows = [];
  }
  const found = rows.find(r => r.id === workspaceId);
  if (!found) return null;
  return {
    id: found.id,
    owner_id: found.owner_id,
    name: found.name,
    kind: found.kind === 'company' ? 'company' : 'solo',
    created_at: found.created_at,
  };
}

export async function getMyRoleInWorkspace(workspaceId: string): Promise<WorkspaceRole | null> {
  if (!workspaceId) return null;
  const userId = await getCurrentUserId();
  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { data } = await sb
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)
        .maybeSingle();
      if (!data?.role) return null;
      return normalizeWorkspaceRole(data.role);
    } catch {
      return null;
    }
  }
  const ws = await getWorkspaceById(workspaceId);
  return ws ? 'owner' : null;
}

export async function getWorkspaceSettings(workspaceId: string): Promise<{ timer_preset: TimerPresetId }> {
  if (!workspaceId) return { timer_preset: 'classic' };
  const userId = await getCurrentUserId();
  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('workspace_settings')
        .select('timer_preset')
        .eq('workspace_id', workspaceId)
        .maybeSingle();
      if (!error && data?.timer_preset)
        return { timer_preset: normalizeTimerPreset(String(data.timer_preset)) };
    } catch {
      /* */
    }
  }
  const raw = localStorage.getItem(`timetracker_ws_settings_${workspaceId}`);
  if (raw) {
    try {
      const o = JSON.parse(raw) as { timer_preset?: string };
      return { timer_preset: normalizeTimerPreset(o.timer_preset) };
    } catch {
      /* */
    }
  }
  return { timer_preset: 'classic' };
}

export async function updateWorkspaceSettings(
  workspaceId: string,
  settings: { timer_preset: TimerPresetId }
): Promise<void> {
  if (!workspaceId) return;
  const preset = normalizeTimerPreset(settings.timer_preset);
  const userId = await getCurrentUserId();
  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { data: ex } = await sb
        .from('workspace_settings')
        .select('workspace_id')
        .eq('workspace_id', workspaceId)
        .maybeSingle();
      if (ex) {
        await sb.from('workspace_settings').update({ timer_preset: preset }).eq('workspace_id', workspaceId);
      } else {
        await sb.from('workspace_settings').insert({ workspace_id: workspaceId, timer_preset: preset });
      }
      return;
    } catch {
      /* */
    }
  }
  localStorage.setItem(`timetracker_ws_settings_${workspaceId}`, JSON.stringify({ timer_preset: preset }));
}

// ============ Projects ============

export async function getProjects(workspaceId: string): Promise<Project[]> {
  if (typeof window === 'undefined') return [];
  if (!workspaceId) return [];

  const userId = await getCurrentUserId();
  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('projects')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(row => {
        const r = row as Record<string, unknown>;
        return {
          id: String(r.id ?? ''),
          user_id: String(r.user_id ?? ''),
          workspace_id: String(r.workspace_id ?? workspaceId),
          name: String(r.name ?? ''),
          description: r.description != null ? String(r.description) : undefined,
          hourly_rate: normalizeProjectHourlyRate(r.hourly_rate),
          created_at: String(r.created_at ?? ''),
        };
      });
    } catch {
      // Fallback to localStorage
    }
  }

  initStorage();
  attachOrphansToWorkspaceLocal(workspaceId);
  const localProjects: LegacyProject[] = JSON.parse(localStorage.getItem('timetracker_projects') || '[]');
  return localProjects
    .filter(p => String(p.workspace_id || '') === workspaceId)
    .map(p => ({
      id: String(p.id),
      user_id: '',
      workspace_id: String(p.workspace_id || workspaceId),
      name: p.name,
      description: p.description,
      hourly_rate: normalizeProjectHourlyRate(p.hourly_rate),
      created_at: p.created_at,
    }));
}

export async function addProject(
  workspaceId: string,
  name: string,
  options?: { description?: string; hourly_rate?: number }
): Promise<Project> {
  if (typeof window === 'undefined') throw new Error('Not in browser');
  if (!workspaceId) throw new Error('workspaceId required');

  const userId = await getCurrentUserId();
  const timestamp = new Date().toISOString();
  const hourly =
    options?.hourly_rate != null && Number.isFinite(options.hourly_rate) && options.hourly_rate >= 0
      ? options.hourly_rate
      : DEFAULT_PROJECT_HOURLY_RATE;

  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('projects')
        .insert({
          user_id: userId,
          workspace_id: workspaceId,
          name,
          description: options?.description,
          hourly_rate: hourly,
        })
        .select()
        .single();
      if (error) throw error;
      if (data) {
        const r = data as Record<string, unknown>;
        return {
          id: String(r.id ?? ''),
          user_id: String(r.user_id ?? ''),
          workspace_id: String(r.workspace_id ?? workspaceId),
          name: String(r.name ?? ''),
          description: r.description != null ? String(r.description) : undefined,
          hourly_rate: normalizeProjectHourlyRate(r.hourly_rate),
          created_at: String(r.created_at ?? ''),
        };
      }
    } catch {
      // Fallback to localStorage
    }
  }

  // Fallback to localStorage
  const localProjects: LegacyProject[] = JSON.parse(localStorage.getItem('timetracker_projects') || '[]');
  const newProject: LegacyProject = {
    id: Date.now(),
    name,
    created_at: timestamp,
    hourly_rate: hourly,
    description: options?.description,
    workspace_id: workspaceId,
  };
  localProjects.push(newProject);
  localStorage.setItem('timetracker_projects', JSON.stringify(localProjects));
  
  return {
    id: String(newProject.id),
    user_id: userId || '',
    workspace_id: workspaceId,
    name: newProject.name,
    description: newProject.description,
    hourly_rate: hourly,
    created_at: newProject.created_at,
  };
}

export async function updateProject(
  workspaceId: string,
  id: string,
  updates: Partial<Pick<Project, 'name' | 'description' | 'hourly_rate'>>
): Promise<Project | null> {
  if (typeof window === 'undefined') return null;
  if (!workspaceId) return null;

  const userId = await getCurrentUserId();
  const sb = getSupabase();

  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('projects')
        .update(updates)
        .eq('id', id)
        .eq('workspace_id', workspaceId)
        .select()
        .single();
      if (error) throw error;
      if (data) {
        const r = data as Record<string, unknown>;
        return {
          id: String(r.id ?? ''),
          user_id: String(r.user_id ?? ''),
          workspace_id: String(r.workspace_id ?? workspaceId),
          name: String(r.name ?? ''),
          description: r.description != null ? String(r.description) : undefined,
          hourly_rate: normalizeProjectHourlyRate(r.hourly_rate),
          created_at: String(r.created_at ?? ''),
        };
      }
    } catch {
      // Fallback to localStorage
    }
  }

  // Fallback to localStorage
  const localProjects: LegacyProject[] = JSON.parse(localStorage.getItem('timetracker_projects') || '[]');
  const numId = parseInt(id, 10);
  const idx = localProjects.findIndex(p => p.id === numId && String(p.workspace_id || '') === workspaceId);
  if (idx === -1) return null;

  localProjects[idx] = { ...localProjects[idx], ...updates };
  localStorage.setItem('timetracker_projects', JSON.stringify(localProjects));
  const p = localProjects[idx];

  return {
    id: String(p.id),
    user_id: userId || '',
    workspace_id: String(p.workspace_id || workspaceId),
    name: p.name,
    description: p.description,
    hourly_rate: normalizeProjectHourlyRate(p.hourly_rate),
    created_at: p.created_at,
  };
}

export async function deleteProject(workspaceId: string, id: string): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!workspaceId) return;

  const userId = await getCurrentUserId();
  const sb = getSupabase();

  if (userId && sb) {
    try {
      // Delete related time entries first
      await sb.from('time_entries').delete().eq('project_id', id).eq('user_id', userId);
      // Delete project
      await sb.from('projects').delete().eq('id', id).eq('workspace_id', workspaceId);
      return;
    } catch {
      // Fallback to localStorage
    }
  }

  // Fallback to localStorage
  const localProjects: LegacyProject[] = JSON.parse(localStorage.getItem('timetracker_projects') || '[]');
  const numId = parseInt(id, 10);
  const filteredProjects = localProjects.filter(p => !(p.id === numId && String(p.workspace_id || '') === workspaceId));
  localStorage.setItem('timetracker_projects', JSON.stringify(filteredProjects));
  
  const localEntries: LegacyTimeEntry[] = JSON.parse(localStorage.getItem('timetracker_entries') || '[]');
  const filteredEntries = localEntries.filter(e => e.project_id !== numId);
  localStorage.setItem('timetracker_entries', JSON.stringify(filteredEntries));
}

// ============ Time Entries ============

async function projectIdSet(workspaceId: string): Promise<Set<string>> {
  const pl = await getProjects(workspaceId);
  return new Set(pl.map(p => p.id));
}

export async function getEntries(workspaceId: string): Promise<TimeEntry[]> {
  if (typeof window === 'undefined') return [];
  if (!workspaceId) return [];

  const pidSet = await projectIdSet(workspaceId);
  if (pidSet.size === 0) return [];

  const userId = await getCurrentUserId();
  const sb = getSupabase();
  const pidsArr = [...pidSet];

  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('time_entries')
        .select('*')
        .eq('user_id', userId)
        .in('project_id', pidsArr)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch {
      // Fallback to localStorage
    }
  }

  initStorage();
  const localEntries: LegacyTimeEntry[] = JSON.parse(localStorage.getItem('timetracker_entries') || '[]');
  return localEntries
    .filter(e => pidSet.has(String(e.project_id)))
    .map(e => ({
      id: String(e.id),
      user_id: '',
      project_id: String(e.project_id),
      date: e.date,
      hours: e.hours,
      description: e.description,
      start_time: e.start_time,
      end_time: e.end_time,
      is_timer: e.is_timer,
      created_at: e.created_at,
    }));
}

export async function addEntry(
  workspaceId: string,
  entry: Omit<TimeEntry, 'id' | 'created_at' | 'user_id'>
): Promise<TimeEntry> {
  if (typeof window === 'undefined') throw new Error('Not in browser');
  if (!workspaceId) throw new Error('workspaceId erforderlich');

  const pidSet = await projectIdSet(workspaceId);
  if (!pidSet.has(String(entry.project_id))) {
    throw new Error('Projekt gehört nicht zu diesem Workspace');
  }

  const userId = await getCurrentUserId();
  const timestamp = new Date().toISOString();

  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('time_entries')
        .insert({ ...entry, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      if (data) return data as TimeEntry;
    } catch {
      // Fallback to localStorage
    }
  }

  // Fallback to localStorage
  const localEntries: LegacyTimeEntry[] = JSON.parse(localStorage.getItem('timetracker_entries') || '[]');
  const newEntry: LegacyTimeEntry = {
    id: Date.now(),
    project_id: parseInt(entry.project_id, 10) || 0,
    date: entry.date,
    hours: entry.hours,
    description: entry.description,
    start_time: entry.start_time,
    end_time: entry.end_time,
    is_timer: entry.is_timer,
    created_at: timestamp,
  };
  localEntries.push(newEntry);
  localStorage.setItem('timetracker_entries', JSON.stringify(localEntries));
  
  return {
    id: String(newEntry.id),
    user_id: userId || '',
    project_id: String(newEntry.project_id),
    date: newEntry.date,
    hours: newEntry.hours,
    description: newEntry.description,
    start_time: newEntry.start_time,
    end_time: newEntry.end_time,
    is_timer: newEntry.is_timer,
    created_at: newEntry.created_at,
  };
}

export async function updateEntry(
  workspaceId: string,
  id: string,
  updates: Partial<Omit<TimeEntry, 'id' | 'created_at' | 'user_id'>>
): Promise<TimeEntry | null> {
  if (typeof window === 'undefined') return null;
  if (!workspaceId) return null;

  const pidSet = await projectIdSet(workspaceId);
  const userId = await getCurrentUserId();
  const sb = getSupabase();

  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('time_entries')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      if (data) {
        const row = data as TimeEntry;
        if (!pidSet.has(String(row.project_id))) return null;
        if (updates.project_id && !pidSet.has(String(updates.project_id))) return null;
        return row;
      }
    } catch {
      // Fallback to localStorage
    }
  }

  // Fallback to localStorage
  const localEntries: LegacyTimeEntry[] = JSON.parse(localStorage.getItem('timetracker_entries') || '[]');
  const numId = parseInt(id, 10);
  const idx = localEntries.findIndex(e => e.id === numId);
  if (idx === -1) return null;
  if (!pidSet.has(String(localEntries[idx].project_id))) return null;

  const prev = localEntries[idx];
  let projectIdNum = prev.project_id;
  if (updates.project_id !== undefined) {
    const np = parseInt(String(updates.project_id), 10) || prev.project_id;
    if (!pidSet.has(String(np))) return null;
    projectIdNum = np;
  }

  const updatedEntry: LegacyTimeEntry = {
    id: prev.id,
    project_id: projectIdNum,
    date: updates.date ?? prev.date,
    hours: updates.hours ?? prev.hours,
    description: updates.description ?? prev.description,
    start_time: updates.start_time !== undefined ? updates.start_time : prev.start_time,
    end_time: updates.end_time !== undefined ? updates.end_time : prev.end_time,
    is_timer: updates.is_timer !== undefined ? updates.is_timer : prev.is_timer,
    created_at: prev.created_at,
  };
  localEntries[idx] = updatedEntry;
  localStorage.setItem('timetracker_entries', JSON.stringify(localEntries));
  
  return {
    id: String(updatedEntry.id),
    user_id: userId || '',
    project_id: String(updatedEntry.project_id),
    date: updatedEntry.date,
    hours: updatedEntry.hours,
    description: updatedEntry.description,
    start_time: updatedEntry.start_time,
    end_time: updatedEntry.end_time,
    is_timer: updatedEntry.is_timer,
    created_at: updatedEntry.created_at,
  };
}

export async function deleteEntry(workspaceId: string, id: string): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!workspaceId) return;

  const pidSet = await projectIdSet(workspaceId);
  const userId = await getCurrentUserId();
  const sb = getSupabase();

  if (userId && sb) {
    try {
      const { data: row } = await sb.from('time_entries').select('project_id').eq('id', id).eq('user_id', userId).maybeSingle();
      if (row && !pidSet.has(String((row as { project_id: string }).project_id))) return;
      await sb.from('time_entries').delete().eq('id', id).eq('user_id', userId);
      return;
    } catch {
      // Fallback to localStorage
    }
  }

  // Fallback to localStorage
  const localEntries: LegacyTimeEntry[] = JSON.parse(localStorage.getItem('timetracker_entries') || '[]');
  const numId = parseInt(id, 10);
  const target = localEntries.find(e => e.id === numId);
  if (target && !pidSet.has(String(target.project_id))) return;
  const filtered = localEntries.filter(e => e.id !== numId);
  localStorage.setItem('timetracker_entries', JSON.stringify(filtered));
}

// ============ Settings ============

export async function getSettings(): Promise<Settings> {
  if (typeof window === 'undefined') {
    return { user_id: '', timer_preset: 'classic' };
  }

  const userId = await getCurrentUserId();
  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      if (data)
        return {
          id: data.id,
          user_id: data.user_id,
          timer_preset: normalizeTimerPreset((data as { timer_preset?: string }).timer_preset),
        };
    } catch {
      // Fallback zu localStorage
    }
  }

  initStorage();
  const raw =
    localStorage.getItem('timetracker_settings') || '{"timer_preset":"classic"}';
  const localSettings: LegacySettings = JSON.parse(raw);
  return {
    timer_preset: normalizeTimerPreset(localSettings.timer_preset),
    user_id: userId || '',
  };
}

export async function updateSettings(settings: Omit<Settings, 'id' | 'user_id'>): Promise<void> {
  if (typeof window === 'undefined') return;

  const preset = normalizeTimerPreset(settings.timer_preset);
  const userId = await getCurrentUserId();
  const sb = getSupabase();

  if (userId && sb) {
    try {
      const { data: existing } = await sb.from('settings').select('id').eq('user_id', userId).single();

      if (existing) {
        await sb.from('settings').update({ timer_preset: preset }).eq('id', existing.id);
      } else {
        await sb.from('settings').insert({
          user_id: userId,
          timer_preset: preset,
        });
      }
      return;
    } catch {
      /* Spalte ggf. fehlend oder offline */
    }
  }

  initStorage();
  localStorage.setItem('timetracker_settings', JSON.stringify({ timer_preset: preset }));
}

// ============ Expenses ============

export async function getExpenses(workspaceId: string): Promise<Expense[]> {
  if (typeof window === 'undefined') return [];
  if (!workspaceId) return [];

  const userId = await getCurrentUserId();
  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .eq('workspace_id', workspaceId)
        .order('date', { ascending: false });
      if (error) throw error;
      return (data || []).map(row => mapExpenseRow(row as Record<string, unknown>));
    } catch {
      /* Tabelle oder Netzwerk – Fallback */
    }
  }

  initStorage();
  attachOrphansToWorkspaceLocal(workspaceId);
  const raw = localStorage.getItem('timetracker_expenses');
  if (!raw) return [];
  try {
    const local: LegacyExpense[] = JSON.parse(raw);
    return local
      .filter(e => String(e.workspace_id || workspaceId) === workspaceId)
      .map(e => ({
        id: String(e.id),
        user_id: 'local',
        workspace_id: String(e.workspace_id || workspaceId),
        amount: e.amount,
        date: e.date,
        description: e.description || '',
        created_at: e.created_at,
        is_recurring: e.is_recurring ?? false,
        recurrence: normalizeRecurrence(e.recurrence),
        recurrence_end: e.recurrence_end ?? null,
        customer_id: e.customer_id ?? null,
      }));
  } catch {
    return [];
  }
}

export async function addExpense(
  workspaceId: string,
  input: {
    amount: number;
    date: string;
    description: string;
    is_recurring?: boolean;
    recurrence?: Recurrence | null;
    recurrence_end?: string | null;
    customer_id?: string | null;
  }
): Promise<Expense> {
  if (typeof window === 'undefined') throw new Error('addExpense nur im Browser');
  if (!workspaceId) throw new Error('workspaceId erforderlich');

  const rec = input.is_recurring && input.recurrence ? input.recurrence : null;
  const end = input.is_recurring && rec ? (input.recurrence_end?.trim() || null) : null;
  const cid = input.customer_id?.trim() || null;

  const userId = await getCurrentUserId();
  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('expenses')
        .insert({
          user_id: userId,
          workspace_id: workspaceId,
          amount: input.amount,
          date: input.date,
          description: input.description,
          is_recurring: Boolean(rec),
          recurrence: rec,
          recurrence_end: end,
          customer_id: cid,
        })
        .select()
        .single();
      if (error) throw error;
      return mapExpenseRow(data as Record<string, unknown>);
    } catch {
      /* Fallback */
    }
  }

  initStorage();
  const raw = localStorage.getItem('timetracker_expenses') || '[]';
  let list: LegacyExpense[] = [];
  try {
    list = JSON.parse(raw);
  } catch {
    list = [];
  }
  const id = list.length ? Math.max(...list.map(x => x.id)) + 1 : 1;
  const expense: LegacyExpense = {
    id,
    amount: input.amount,
    date: input.date,
    description: input.description,
    created_at: new Date().toISOString(),
    is_recurring: Boolean(rec),
    recurrence: rec,
    recurrence_end: end ?? undefined,
    customer_id: cid ?? undefined,
    workspace_id: workspaceId,
  };
  list.push(expense);
  localStorage.setItem('timetracker_expenses', JSON.stringify(list));
  return {
    id: String(id),
    user_id: 'local',
    workspace_id: workspaceId,
    amount: expense.amount,
    date: expense.date,
    description: expense.description || '',
    created_at: expense.created_at,
    is_recurring: Boolean(rec),
    recurrence: rec,
    recurrence_end: end,
    customer_id: cid,
  };
}

export async function deleteExpense(workspaceId: string, id: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const userId = await getCurrentUserId();
  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { error } = await sb
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .eq('workspace_id', workspaceId);
      if (!error) return;
    } catch {
      /* Fallback */
    }
  }

  initStorage();
  const raw = localStorage.getItem('timetracker_expenses');
  if (!raw) return;
  try {
    const list: LegacyExpense[] = JSON.parse(raw);
    const next = list.filter(e => !(String(e.id) === id && String(e.workspace_id || workspaceId) === workspaceId));
    localStorage.setItem('timetracker_expenses', JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

function mapCustomerRow(row: Record<string, unknown>): Customer {
  return {
    id: String(row.id),
    user_id: String(row.user_id ?? ''),
    workspace_id: String(row.workspace_id ?? ''),
    name: String(row.name ?? ''),
    email: String(row.email ?? ''),
    phone: String(row.phone ?? ''),
    company: String(row.company ?? ''),
    notes: String(row.notes ?? ''),
    created_at: String(row.created_at ?? ''),
  };
}

function mapQuoteRow(row: Record<string, unknown>): Quote {
  const amount = row.amount;
  return {
    id: String(row.id),
    user_id: String(row.user_id ?? ''),
    workspace_id: String(row.workspace_id ?? ''),
    customer_id: String(row.customer_id ?? ''),
    title: String(row.title ?? ''),
    amount: typeof amount === 'string' ? parseFloat(amount) : Number(amount),
    status: normalizeQuoteStatus(row.status),
    is_recurring: Boolean(row.is_recurring),
    recurrence: normalizeRecurrence(row.recurrence),
    recurrence_end: row.recurrence_end ? String(row.recurrence_end) : null,
    created_at: String(row.created_at ?? ''),
  };
}

// ============ Customers ============

export async function getCustomers(workspaceId: string): Promise<Customer[]> {
  if (typeof window === 'undefined') return [];
  if (!workspaceId) return [];

  const userId = await getCurrentUserId();
  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .eq('workspace_id', workspaceId)
        .order('name', { ascending: true });
      if (error) throw error;
      return (data || []).map(r => mapCustomerRow(r as Record<string, unknown>));
    } catch {
      /* Fallback */
    }
  }

  initStorage();
  attachOrphansToWorkspaceLocal(workspaceId);
  const raw = localStorage.getItem('timetracker_customers');
  if (!raw) return [];
  try {
    const list: LegacyCustomer[] = JSON.parse(raw);
    return list
      .filter(c => String(c.workspace_id || workspaceId) === workspaceId)
      .map(c => ({
        id: String(c.id),
        user_id: 'local',
        workspace_id: String(c.workspace_id || workspaceId),
        name: c.name,
        email: c.email || '',
        phone: c.phone || '',
        company: c.company || '',
        notes: c.notes || '',
        created_at: c.created_at,
      }));
  } catch {
    return [];
  }
}

export async function addCustomer(
  workspaceId: string,
  input: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    notes?: string;
  }
): Promise<Customer> {
  if (typeof window === 'undefined') throw new Error('addCustomer nur im Browser');
  if (!workspaceId) throw new Error('workspaceId erforderlich');

  const userId = await getCurrentUserId();
  const sb = getSupabase();
  const payload = {
    name: input.name.trim(),
    email: (input.email || '').trim(),
    phone: (input.phone || '').trim(),
    company: (input.company || '').trim(),
    notes: (input.notes || '').trim(),
  };

  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('customers')
        .insert({ user_id: userId, workspace_id: workspaceId, ...payload })
        .select()
        .single();
      if (error) throw error;
      return mapCustomerRow(data as Record<string, unknown>);
    } catch {
      /* Fallback */
    }
  }

  initStorage();
  const raw = localStorage.getItem('timetracker_customers') || '[]';
  let list: LegacyCustomer[] = [];
  try {
    list = JSON.parse(raw);
  } catch {
    list = [];
  }
  const id = list.length ? Math.max(...list.map(x => x.id)) + 1 : 1;
  const row: LegacyCustomer = {
    id,
    ...payload,
    created_at: new Date().toISOString(),
    workspace_id: workspaceId,
  };
  list.push(row);
  list.sort((a, b) => a.name.localeCompare(b.name));
  localStorage.setItem('timetracker_customers', JSON.stringify(list));
  return {
    id: String(id),
    user_id: 'local',
    workspace_id: workspaceId,
    ...payload,
    created_at: row.created_at,
  };
}

export async function deleteCustomer(workspaceId: string, id: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const userId = await getCurrentUserId();
  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { error } = await sb.from('customers').delete().eq('id', id).eq('user_id', userId).eq('workspace_id', workspaceId);
      if (!error) return;
    } catch {
      /* Fallback */
    }
  }

  initStorage();
  const raw = localStorage.getItem('timetracker_customers');
  if (!raw) return;
  try {
    const list: LegacyCustomer[] = JSON.parse(raw);
    const next = list.filter(c => !(String(c.id) === id && String(c.workspace_id || workspaceId) === workspaceId));
    localStorage.setItem('timetracker_customers', JSON.stringify(next));

    const qRaw = localStorage.getItem('timetracker_quotes');
    if (qRaw) {
      const ql: LegacyQuote[] = JSON.parse(qRaw);
      localStorage.setItem(
        'timetracker_quotes',
        JSON.stringify(
          ql.filter(q => !(q.customer_id === id && String(q.workspace_id || workspaceId) === workspaceId))
        )
      );
    }
  } catch {
    /* ignore */
  }
}

// ============ Quotes (Angebote) ============

export async function getQuotes(workspaceId: string): Promise<Quote[]> {
  if (typeof window === 'undefined') return [];
  if (!workspaceId) return [];

  const userId = await getCurrentUserId();
  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('quotes')
        .select('*')
        .eq('user_id', userId)
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(r => mapQuoteRow(r as Record<string, unknown>));
    } catch {
      /* Fallback */
    }
  }

  initStorage();
  attachOrphansToWorkspaceLocal(workspaceId);
  const raw = localStorage.getItem('timetracker_quotes');
  if (!raw) return [];
  try {
    const list: LegacyQuote[] = JSON.parse(raw);
    return list
      .filter(q => String(q.workspace_id || workspaceId) === workspaceId)
      .map(q => ({
        id: String(q.id),
        user_id: 'local',
        workspace_id: String(q.workspace_id || workspaceId),
        customer_id: String(q.customer_id),
        title: q.title || '',
        amount: q.amount,
        status: normalizeQuoteStatus(q.status),
        is_recurring: q.is_recurring,
        recurrence: normalizeRecurrence(q.recurrence),
        recurrence_end: q.recurrence_end ?? null,
        created_at: q.created_at,
      }));
  } catch {
    return [];
  }
}

export async function addQuote(
  workspaceId: string,
  input: {
    customer_id: string;
    title?: string;
    amount: number;
    status?: QuoteStatus;
    is_recurring?: boolean;
    recurrence?: Recurrence | null;
    recurrence_end?: string | null;
  }
): Promise<Quote> {
  if (typeof window === 'undefined') throw new Error('addQuote nur im Browser');
  if (!workspaceId) throw new Error('workspaceId erforderlich');

  const rec = input.is_recurring && input.recurrence ? input.recurrence : null;
  const end = input.is_recurring && rec ? (input.recurrence_end?.trim() || null) : null;
  const st = normalizeQuoteStatus(input.status);

  const userId = await getCurrentUserId();
  const sb = getSupabase();

  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('quotes')
        .insert({
          user_id: userId,
          workspace_id: workspaceId,
          customer_id: input.customer_id,
          title: input.title?.trim() || '',
          amount: input.amount,
          status: st,
          is_recurring: Boolean(rec),
          recurrence: rec,
          recurrence_end: end,
        })
        .select()
        .single();
      if (error) throw error;
      return mapQuoteRow(data as Record<string, unknown>);
    } catch {
      /* Fallback */
    }
  }

  initStorage();
  const raw = localStorage.getItem('timetracker_quotes') || '[]';
  let list: LegacyQuote[] = [];
  try {
    list = JSON.parse(raw);
  } catch {
    list = [];
  }
  const id = list.length ? Math.max(...list.map(x => x.id)) + 1 : 1;
  const row: LegacyQuote = {
    id,
    customer_id: input.customer_id,
    title: input.title?.trim() || '',
    amount: input.amount,
    status: typeof st === 'string' ? st : String(st),
    is_recurring: Boolean(rec),
    recurrence: rec ?? undefined,
    recurrence_end: end ?? undefined,
    created_at: new Date().toISOString(),
    workspace_id: workspaceId,
  };
  list.push(row);
  localStorage.setItem('timetracker_quotes', JSON.stringify(list));
  return {
    id: String(id),
    user_id: 'local',
    workspace_id: workspaceId,
    customer_id: input.customer_id,
    title: row.title || '',
    amount: row.amount,
    status: normalizeQuoteStatus(st),
    is_recurring: Boolean(rec),
    recurrence: rec,
    recurrence_end: end,
    created_at: row.created_at,
  };
}

export async function updateQuote(
  workspaceId: string,
  id: string,
  patch: Partial<{
    title: string;
    amount: number;
    status: QuoteStatus;
    is_recurring: boolean;
    recurrence: Recurrence | null;
    recurrence_end: string | null;
    customer_id: string;
  }>
): Promise<void> {
  if (typeof window === 'undefined') return;

  const userId = await getCurrentUserId();
  const sb = getSupabase();
  const body: Record<string, unknown> = {};
  if (patch.title !== undefined) body.title = patch.title.trim();
  if (patch.amount !== undefined) body.amount = patch.amount;
  if (patch.status !== undefined) body.status = patch.status;
  if (patch.customer_id !== undefined) body.customer_id = patch.customer_id;
  if (patch.is_recurring !== undefined) body.is_recurring = patch.is_recurring;
  if (patch.recurrence !== undefined) body.recurrence = patch.recurrence;
  if (patch.recurrence_end !== undefined) body.recurrence_end = patch.recurrence_end || null;

  if (Object.keys(body).length === 0) return;

  if (userId && sb) {
    try {
      const { error } = await sb
        .from('quotes')
        .update(body)
        .eq('id', id)
        .eq('user_id', userId)
        .eq('workspace_id', workspaceId);
      if (!error) return;
    } catch {
      /* Fallback */
    }
  }

  initStorage();
  const raw = localStorage.getItem('timetracker_quotes');
  if (!raw) return;
  try {
    const list: LegacyQuote[] = JSON.parse(raw);
    const idx = list.findIndex(
      q => String(q.id) === id && String(q.workspace_id || workspaceId) === workspaceId
    );
    if (idx === -1) return;
    const prev = list[idx];
    list[idx] = {
      ...prev,
      ...(patch.title !== undefined ? { title: patch.title.trim() } : {}),
      ...(patch.amount !== undefined ? { amount: patch.amount } : {}),
      ...(patch.status !== undefined ? { status: patch.status as string } : {}),
      ...(patch.customer_id !== undefined ? { customer_id: patch.customer_id } : {}),
      ...(patch.is_recurring !== undefined ? { is_recurring: patch.is_recurring } : {}),
      ...(patch.recurrence !== undefined ? { recurrence: patch.recurrence ?? undefined } : {}),
      ...(patch.recurrence_end !== undefined ? { recurrence_end: patch.recurrence_end ?? undefined } : {}),
    };
    localStorage.setItem('timetracker_quotes', JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export async function deleteQuote(workspaceId: string, id: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const userId = await getCurrentUserId();
  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { error } = await sb
        .from('quotes')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .eq('workspace_id', workspaceId);
      if (!error) return;
    } catch {
      /* Fallback */
    }
  }

  initStorage();
  const raw = localStorage.getItem('timetracker_quotes');
  if (!raw) return;
  try {
    const list: LegacyQuote[] = JSON.parse(raw);
    localStorage.setItem(
      'timetracker_quotes',
      JSON.stringify(list.filter(q => !(String(q.id) === id && String(q.workspace_id || workspaceId) === workspaceId)))
    );
  } catch {
    /* ignore */
  }
}

// ============ Timer State ============

export function getTimerState(workspaceId: string): TimerState | null {
  if (typeof window === 'undefined' || !workspaceId) return null;
  const raw = localStorage.getItem(`timetracker_timer_${workspaceId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setTimerState(workspaceId: string, state: TimerState): void {
  if (typeof window === 'undefined' || !workspaceId) return;
  localStorage.setItem(`timetracker_timer_${workspaceId}`, JSON.stringify(state));
}

export function clearTimerState(workspaceId: string): void {
  if (typeof window === 'undefined' || !workspaceId) return;
  localStorage.removeItem(`timetracker_timer_${workspaceId}`);
}

// ============ Language ============

export function getLanguage(): Language {
  if (typeof window === 'undefined') return 'de';
  initStorage();
  const raw = localStorage.getItem('timetracker_language');
  if (!raw) return 'de';
  if (['de','en','es','fr','ru'].includes(raw)) return raw as Language;
  return 'de';
}

export function setLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('timetracker_language', lang);
}

// ============ Summary Functions ============

export async function getMonthlySummary(workspaceId: string, year: number, month: number) {
  if (!workspaceId) return { projectStats: [], totalHours: 0, totalRevenue: 0, entryCount: 0 };
  const entries = await getEntries(workspaceId);
  const projects = await getProjects(workspaceId);

  const monthEntries = entries.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const projectStats = projects.map(project => {
    const projectEntries = monthEntries.filter(e => e.project_id === project.id);
    const totalHours = projectEntries.reduce((sum, e) => sum + e.hours, 0);
    return {
      project,
      totalHours,
      revenue: totalHours * normalizeProjectHourlyRate(project.hourly_rate),
      entries: projectEntries
    };
  }).filter(s => s.totalHours > 0);

  const totalHours = projectStats.reduce((sum, s) => sum + s.totalHours, 0);
  const totalRevenue = projectStats.reduce((sum, s) => sum + s.revenue, 0);

  return {
    projectStats,
    totalHours,
    totalRevenue,
    entryCount: monthEntries.length
  };
}

// Weekly summary (current week)
export async function getWeeklySummary(workspaceId: string) {
  if (!workspaceId) return { days: [], maxHours: 1 };
  const entries = await getEntries(workspaceId);
  const projects = await getProjects(workspaceId);
  const now = new Date();

  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.getFullYear(), now.getMonth(), diff);
  monday.setHours(0, 0, 0, 0);

  const weekDays = [
    { name: 'Mo', offset: 0 },
    { name: 'Di', offset: 1 },
    { name: 'Mi', offset: 2 },
    { name: 'Do', offset: 3 },
    { name: 'Fr', offset: 4 },
    { name: 'Sa', offset: 5 },
    { name: 'So', offset: 6 },
  ];

  const days = weekDays.map(({ name, offset }) => {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + offset);
    const dateStr = currentDate.toISOString().split('T')[0];

    const dayEntries = entries.filter(e => e.date === dateStr);
    const projectHours = projects.map((project, pidx) => {
      const hours = dayEntries
        .filter(e => e.project_id === project.id)
        .reduce((sum, e) => sum + e.hours, 0);
      return { project, hours, colorIndex: pidx };
    }).filter(ph => ph.hours > 0);

    const totalHours = dayEntries.reduce((sum, e) => sum + e.hours, 0);

    return { name, dateStr, projectHours, totalHours };
  });

  const maxHours = Math.max(...days.map(d => d.totalHours), 1);

  return { days, maxHours };
}

// Yearly heatmap data
export async function getYearlyHeatmapData(workspaceId: string, year: number) {
  if (!workspaceId) return [];
  const entries = await getEntries(workspaceId);

  const hoursByDate = new Map<string, number>();
  entries.forEach(e => {
    const d = new Date(e.date);
    if (d.getFullYear() === year) {
      const current = hoursByDate.get(e.date) || 0;
      hoursByDate.set(e.date, current + e.hours);
    }
  });

  const jan1 = new Date(year, 0, 1);
  const firstSunday = new Date(jan1);
  firstSunday.setDate(jan1.getDate() - jan1.getDay());

  const weeks: { date: string; hours: number; dayOfMonth: number; month: number }[][] = [];

  for (let w = 0; w < 53; w++) {
    const week: { date: string; hours: number; dayOfMonth: number; month: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const current = new Date(firstSunday);
      current.setDate(firstSunday.getDate() + w * 7 + d);
      const dateStr = current.toISOString().split('T')[0];
      const hours = hoursByDate.get(dateStr) || 0;
      week.push({
        date: dateStr,
        hours,
        dayOfMonth: current.getDate(),
        month: current.getMonth()
      });
    }
    weeks.push(week);
  }

  return weeks;
}

// All-time summary
export async function getAllTimeSummary(workspaceId: string) {
  if (!workspaceId)
    return { projectStats: [], totalHours: 0, totalRevenue: 0, projectCount: 0, entryCount: 0 };
  const entries = await getEntries(workspaceId);
  const projects = await getProjects(workspaceId);

  const projectStats = projects.map(project => {
    const projectEntries = entries.filter(e => e.project_id === project.id);
    const totalHours = projectEntries.reduce((sum, e) => sum + e.hours, 0);
    return {
      project,
      totalHours,
      revenue: totalHours * normalizeProjectHourlyRate(project.hourly_rate),
      entries: projectEntries
    };
  }).filter(s => s.totalHours > 0)
    .sort((a, b) => b.totalHours - a.totalHours);

  const totalHours = projectStats.reduce((sum, s) => sum + s.totalHours, 0);
  const totalRevenue = projectStats.reduce((sum, s) => sum + s.revenue, 0);

  return {
    projectStats,
    totalHours,
    totalRevenue,
    projectCount: projects.length,
    entryCount: entries.length
  };
}
