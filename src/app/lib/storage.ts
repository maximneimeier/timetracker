// Hybrid storage: localStorage for now, Supabase later
import { createClient } from '@supabase/supabase-js';

// NOTE: Set these via environment variables or .env.local file
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabase;
}

const USE_SUPABASE = false;

export interface Project {
  id: number;
  name: string;
  created_at: string;
}

export interface TimeEntry {
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

export interface TimerState {
  running: boolean;
  project_id: number;
  start_timestamp: number;
}

export interface Settings {
  hourly_rate: number;
}

export type Language = 'de' | 'en' | 'es' | 'fr' | 'ru';

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

// ============ Projects ============

export async function getProjects(): Promise<Project[]> {
  if (typeof window === 'undefined') return [];

  if (USE_SUPABASE) {
    try {
      const sb = getSupabase();
      if (!sb) throw new Error('Supabase not configured');
      const { data, error } = await sb.from('projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch {
      // Fallback
    }
  }

  initStorage();
  return JSON.parse(localStorage.getItem('timetracker_projects') || '[]');
}

export async function addProject(name: string): Promise<Project> {
  if (typeof window === 'undefined') throw new Error('Not in browser');

  const newProject: Project = {
    id: Date.now(),
    name,
    created_at: new Date().toISOString()
  };

  if (USE_SUPABASE) {
    try {
      const { data, error } = await getSupabase().from('projects').insert([{ name }] as any).select().single();
      if (error) throw error;
      if (data) return data as Project;
    } catch {
      // Fallback
    }
  }

  const projects = await getProjects();
  projects.push(newProject);
  localStorage.setItem('timetracker_projects', JSON.stringify(projects));
  return newProject;
}

export async function deleteProject(id: number): Promise<void> {
  if (typeof window === 'undefined') return;

  if (USE_SUPABASE) {
    try {
      await getSupabase().from('time_entries').delete().eq('project_id', id);
      await getSupabase().from('projects').delete().eq('id', id);
      return;
    } catch {
      // Fallback
    }
  }

  const projects = (await getProjects()).filter(p => p.id !== id);
  localStorage.setItem('timetracker_projects', JSON.stringify(projects));
  const entries = (await getEntries()).filter(e => e.project_id !== id);
  localStorage.setItem('timetracker_entries', JSON.stringify(entries));
}

// ============ Time Entries ============

export async function getEntries(): Promise<TimeEntry[]> {
  if (typeof window === 'undefined') return [];

  if (USE_SUPABASE) {
    try {
      const { data, error } = await getSupabase().from('time_entries').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch {
      // Fallback
    }
  }

  initStorage();
  return JSON.parse(localStorage.getItem('timetracker_entries') || '[]');
}

export async function addEntry(entry: Omit<TimeEntry, 'id' | 'created_at'>): Promise<TimeEntry> {
  if (typeof window === 'undefined') throw new Error('Not in browser');

  const newEntry: TimeEntry = {
    ...entry,
    id: Date.now(),
    created_at: new Date().toISOString()
  };

  if (USE_SUPABASE) {
    try {
      const { data, error } = await getSupabase().from('time_entries').insert([entry] as any).select().single();
      if (error) throw error;
      if (data) return data as TimeEntry;
    } catch {
      // Fallback
    }
  }

  const entries = await getEntries();
  entries.push(newEntry);
  localStorage.setItem('timetracker_entries', JSON.stringify(entries));
  return newEntry;
}

export async function deleteEntry(id: number): Promise<void> {
  if (typeof window === 'undefined') return;

  if (USE_SUPABASE) {
    try {
      await getSupabase().from('time_entries').delete().eq('id', id);
      return;
    } catch {
      // Fallback
    }
  }

  const entries = (await getEntries()).filter(e => e.id !== id);
  localStorage.setItem('timetracker_entries', JSON.stringify(entries));
}

// ============ Settings ============

export async function getSettings(): Promise<Settings> {
  if (typeof window === 'undefined') return { hourly_rate: 150 };

  if (USE_SUPABASE) {
    try {
      const { data, error } = await getSupabase().from('settings').select('*').eq('id', 1).single();
      if (error) throw error;
      if (data) return { hourly_rate: (data as any).hourly_rate };
    } catch {
      // Fallback
    }
  }

  initStorage();
  return JSON.parse(localStorage.getItem('timetracker_settings') || '{"hourly_rate":150}');
}

export async function updateSettings(settings: Settings): Promise<void> {
  if (typeof window === 'undefined') return;

  if (USE_SUPABASE) {
    try {
      await getSupabase().from('settings').upsert({ id: 1, hourly_rate: settings.hourly_rate } as any);
      return;
    } catch {
      // Fallback
    }
  }

  localStorage.setItem('timetracker_settings', JSON.stringify(settings));
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
