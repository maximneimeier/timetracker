'use client';

import { supabase } from './supabase';

function getSupabase() {
  return supabase;
}

// Check if user is authenticated
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
  name: string;
  description?: string;
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

export interface TimerState {
  running: boolean;
  project_id: string;
  start_timestamp: number;
}

export interface Settings {
  id?: string;
  user_id: string;
  hourly_rate: number;
}

export type Language = 'de' | 'en' | 'es' | 'fr' | 'ru';

// Legacy localStorage interfaces (for migration)
interface LegacyProject {
  id: number;
  name: string;
  description?: string;
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
  hourly_rate: number;
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
    localStorage.setItem('timetracker_settings', JSON.stringify({ hourly_rate: 150 }));
  }
  if (!localStorage.getItem('timetracker_language')) {
    localStorage.setItem('timetracker_language', 'de');
  }
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
  const localSettings: LegacySettings = JSON.parse(localStorage.getItem('timetracker_settings') || '{"hourly_rate":150}');

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

  // Migrate projects
  const projectIdMap = new Map<number, string>();
  
  for (const project of localProjects) {
    const { data: newProject, error } = await sb
      .from('projects')
      .insert({
        user_id: userId,
        name: project.name,
        description: project.description,
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
      hourly_rate: localSettings.hourly_rate,
    });
  }

  // Mark as migrated
  localStorage.setItem(migrationKey, 'true');
}

// ============ Projects ============

export async function getProjects(): Promise<Project[]> {
  if (typeof window === 'undefined') return [];

  const userId = await getCurrentUserId();
  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch {
      // Fallback to localStorage
    }
  }

  initStorage();
  const localProjects: LegacyProject[] = JSON.parse(localStorage.getItem('timetracker_projects') || '[]');
  return localProjects.map(p => ({
    id: String(p.id),
    user_id: '',
    name: p.name,
    description: p.description,
    created_at: p.created_at,
  }));
}

export async function addProject(name: string): Promise<Project> {
  if (typeof window === 'undefined') throw new Error('Not in browser');

  const userId = await getCurrentUserId();
  const timestamp = new Date().toISOString();

  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('projects')
        .insert({ user_id: userId, name })
        .select()
        .single();
      if (error) throw error;
      if (data) return data as Project;
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
  };
  localProjects.push(newProject);
  localStorage.setItem('timetracker_projects', JSON.stringify(localProjects));
  
  return {
    id: String(newProject.id),
    user_id: userId || '',
    name: newProject.name,
    description: newProject.description,
    created_at: newProject.created_at,
  };
}

export async function updateProject(id: string, updates: Partial<Pick<Project, 'name' | 'description'>>): Promise<Project | null> {
  if (typeof window === 'undefined') return null;

  const userId = await getCurrentUserId();
  const sb = getSupabase();

  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('projects')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      if (data) return data as Project;
    } catch {
      // Fallback to localStorage
    }
  }

  // Fallback to localStorage
  const localProjects: LegacyProject[] = JSON.parse(localStorage.getItem('timetracker_projects') || '[]');
  const numId = parseInt(id, 10);
  const idx = localProjects.findIndex(p => p.id === numId);
  if (idx === -1) return null;

  localProjects[idx] = { ...localProjects[idx], ...updates };
  localStorage.setItem('timetracker_projects', JSON.stringify(localProjects));
  
  return {
    id: String(localProjects[idx].id),
    user_id: userId || '',
    name: localProjects[idx].name,
    description: localProjects[idx].description,
    created_at: localProjects[idx].created_at,
  };
}

export async function deleteProject(id: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const userId = await getCurrentUserId();
  const sb = getSupabase();

  if (userId && sb) {
    try {
      // Delete related time entries first
      await sb.from('time_entries').delete().eq('project_id', id).eq('user_id', userId);
      // Delete project
      await sb.from('projects').delete().eq('id', id).eq('user_id', userId);
      return;
    } catch {
      // Fallback to localStorage
    }
  }

  // Fallback to localStorage
  const localProjects: LegacyProject[] = JSON.parse(localStorage.getItem('timetracker_projects') || '[]');
  const numId = parseInt(id, 10);
  const filteredProjects = localProjects.filter(p => p.id !== numId);
  localStorage.setItem('timetracker_projects', JSON.stringify(filteredProjects));
  
  const localEntries: LegacyTimeEntry[] = JSON.parse(localStorage.getItem('timetracker_entries') || '[]');
  const filteredEntries = localEntries.filter(e => e.project_id !== numId);
  localStorage.setItem('timetracker_entries', JSON.stringify(filteredEntries));
}

// ============ Time Entries ============

export async function getEntries(): Promise<TimeEntry[]> {
  if (typeof window === 'undefined') return [];

  const userId = await getCurrentUserId();
  const sb = getSupabase();
  if (userId && sb) {
    try {
      const { data, error } = await sb
        .from('time_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch {
      // Fallback to localStorage
    }
  }

  initStorage();
  const localEntries: LegacyTimeEntry[] = JSON.parse(localStorage.getItem('timetracker_entries') || '[]');
  return localEntries.map(e => ({
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

export async function addEntry(entry: Omit<TimeEntry, 'id' | 'created_at' | 'user_id'>): Promise<TimeEntry> {
  if (typeof window === 'undefined') throw new Error('Not in browser');

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

export async function updateEntry(id: string, updates: Partial<Omit<TimeEntry, 'id' | 'created_at' | 'user_id'>>): Promise<TimeEntry | null> {
  if (typeof window === 'undefined') return null;

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
      if (data) return data as TimeEntry;
    } catch {
      // Fallback to localStorage
    }
  }

  // Fallback to localStorage
  const localEntries: LegacyTimeEntry[] = JSON.parse(localStorage.getItem('timetracker_entries') || '[]');
  const numId = parseInt(id, 10);
  const idx = localEntries.findIndex(e => e.id === numId);
  if (idx === -1) return null;

  const updatedEntry: any = { ...localEntries[idx], ...updates };
  if (updates.project_id) {
    updatedEntry.project_id = parseInt(updates.project_id as string, 10) || localEntries[idx].project_id;
  }
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

export async function deleteEntry(id: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const userId = await getCurrentUserId();
  const sb = getSupabase();

  if (userId && sb) {
    try {
      await sb.from('time_entries').delete().eq('id', id).eq('user_id', userId);
      return;
    } catch {
      // Fallback to localStorage
    }
  }

  // Fallback to localStorage
  const localEntries: LegacyTimeEntry[] = JSON.parse(localStorage.getItem('timetracker_entries') || '[]');
  const numId = parseInt(id, 10);
  const filtered = localEntries.filter(e => e.id !== numId);
  localStorage.setItem('timetracker_entries', JSON.stringify(filtered));
}

// ============ Settings ============

export async function getSettings(): Promise<Settings> {
  if (typeof window === 'undefined') return { hourly_rate: 150, user_id: '' };

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
      if (data) return { id: data.id, user_id: data.user_id, hourly_rate: data.hourly_rate };
    } catch {
      // Fallback to localStorage
    }
  }

  initStorage();
  const localSettings: LegacySettings = JSON.parse(localStorage.getItem('timetracker_settings') || '{"hourly_rate":150}');
  return { hourly_rate: localSettings.hourly_rate, user_id: userId || '' };
}

export async function updateSettings(settings: Omit<Settings, 'id' | 'user_id'>): Promise<void> {
  if (typeof window === 'undefined') return;

  const userId = await getCurrentUserId();
  const sb = getSupabase();

  if (userId && sb) {
    try {
      const { data: existing } = await sb.from('settings').select('id').eq('user_id', userId).single();
      
      if (existing) {
        await sb.from('settings').update({ hourly_rate: settings.hourly_rate }).eq('id', existing.id);
      } else {
        await sb.from('settings').insert({ user_id: userId, hourly_rate: settings.hourly_rate });
      }
      return;
    } catch {
      // Fallback to localStorage
    }
  }

  // Fallback to localStorage
  localStorage.setItem('timetracker_settings', JSON.stringify({ hourly_rate: settings.hourly_rate }));
}

// ============ Timer State ============

export function getTimerState(): TimerState | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('timetracker_timer_state');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setTimerState(state: TimerState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('timetracker_timer_state', JSON.stringify(state));
}

export function clearTimerState(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('timetracker_timer_state');
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

export async function getMonthlySummary(year: number, month: number) {
  const entries = await getEntries();
  const projects = await getProjects();
  const settings = await getSettings();

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
      revenue: totalHours * settings.hourly_rate,
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
export async function getWeeklySummary() {
  const entries = await getEntries();
  const projects = await getProjects();
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
export async function getYearlyHeatmapData(year: number) {
  const entries = await getEntries();

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
export async function getAllTimeSummary() {
  const entries = await getEntries();
  const projects = await getProjects();
  const settings = await getSettings();

  const projectStats = projects.map(project => {
    const projectEntries = entries.filter(e => e.project_id === project.id);
    const totalHours = projectEntries.reduce((sum, e) => sum + e.hours, 0);
    return {
      project,
      totalHours,
      revenue: totalHours * settings.hourly_rate,
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
