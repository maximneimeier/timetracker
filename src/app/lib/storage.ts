// Hybrid storage: localStorage for now, Supabase later

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
  created_at: string;
}

export interface Settings {
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
}

export function getProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  initStorage();
  return JSON.parse(localStorage.getItem('timetracker_projects') || '[]');
}

export function addProject(name: string): Project {
  const projects = getProjects();
  const newProject: Project = {
    id: Date.now(),
    name,
    created_at: new Date().toISOString()
  };
  projects.push(newProject);
  localStorage.setItem('timetracker_projects', JSON.stringify(projects));
  return newProject;
}

export function deleteProject(id: number): void {
  const projects = getProjects().filter(p => p.id !== id);
  localStorage.setItem('timetracker_projects', JSON.stringify(projects));
  // Also delete related entries
  const entries = getEntries().filter(e => e.project_id !== id);
  localStorage.setItem('timetracker_entries', JSON.stringify(entries));
}

export function getEntries(): TimeEntry[] {
  if (typeof window === 'undefined') return [];
  initStorage();
  return JSON.parse(localStorage.getItem('timetracker_entries') || '[]');
}

export function addEntry(entry: Omit<TimeEntry, 'id' | 'created_at'>): TimeEntry {
  const entries = getEntries();
  const newEntry: TimeEntry = {
    ...entry,
    id: Date.now(),
    created_at: new Date().toISOString()
  };
  entries.push(newEntry);
  localStorage.setItem('timetracker_entries', JSON.stringify(entries));
  return newEntry;
}

export function deleteEntry(id: number): void {
  const entries = getEntries().filter(e => e.id !== id);
  localStorage.setItem('timetracker_entries', JSON.stringify(entries));
}

export function getSettings(): Settings {
  if (typeof window === 'undefined') return { hourly_rate: 150 };
  initStorage();
  return JSON.parse(localStorage.getItem('timetracker_settings') || '{"hourly_rate":150}');
}

export function updateSettings(settings: Settings): void {
  localStorage.setItem('timetracker_settings', JSON.stringify(settings));
}

// Summary functions
export function getMonthlySummary(year: number, month: number) {
  const entries = getEntries();
  const projects = getProjects();
  const settings = getSettings();
  
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
