'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './lib/theme';
import {
  getProjects,
  addProject,
  deleteProject,
  getEntries,
  addEntry,
  deleteEntry,
  getSettings,
  updateSettings,
  getMonthlySummary,
  getAllTimeSummary,
  Project,
  TimeEntry
} from './lib/storage';

// Moon icon for dark mode
function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// Sun icon for light mode
function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

// Bar Chart Component
function BarChart({ data }: { data: { label: string; hours: number; colorIndex: number }[] }) {
  const maxHours = Math.max(...data.map(d => d.hours), 1);
  
  if (data.length === 0) {
    return (
      <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
        <p>Noch keine Daten vorhanden</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((item, idx) => {
        const widthPercent = (item.hours / maxHours) * 100;
        const colorClass = `bar-color-${item.colorIndex % 8}`;
        const textColorClass = `project-color-${item.colorIndex % 8}`;
        
        return (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                {item.label}
              </span>
              <span className={`text-sm font-semibold ${textColorClass}`}>
                {item.hours.toFixed(1)}h
              </span>
            </div>
            <div 
              className="w-full rounded-full overflow-hidden"
              style={{ background: 'var(--bg-inner)', height: '28px' }}
            >
              <div
                className={`${colorClass} h-full rounded-full transition-all duration-700 ease-out`}
                style={{ 
                  width: `${widthPercent}%`,
                  minWidth: item.hours > 0 ? '4px' : '0'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'timer' | 'projects' | 'reports' | 'settings'>('timer');
  const [projects, setProjects] = useState<Project[]>([]);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [settings, setSettings] = useState({ hourly_rate: 150 });
  const [newProject, setNewProject] = useState('');
  const [newEntry, setNewEntry] = useState({
    project_id: 0,
    date: new Date().toISOString().split('T')[0],
    hours: '',
    description: ''
  });
  const [reportMonth, setReportMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    setProjects(getProjects());
    setEntries(getEntries());
    setSettings(getSettings());
  }, []);

  const handleAddProject = () => {
    if (!newProject.trim()) return;
    const project = addProject(newProject.trim());
    setProjects([...projects, project]);
    setNewProject('');
  };

  const handleDeleteProject = (id: number) => {
    deleteProject(id);
    setProjects(getProjects());
    setEntries(getEntries());
  };

  const handleAddEntry = () => {
    if (!newEntry.project_id || !newEntry.hours) return;
    const entry = addEntry({
      project_id: Number(newEntry.project_id),
      date: newEntry.date,
      hours: Number(newEntry.hours),
      description: newEntry.description
    });
    setEntries([...entries, entry]);
    setNewEntry({ ...newEntry, hours: '', description: '' });
  };

  const handleDeleteEntry = (id: number) => {
    deleteEntry(id);
    setEntries(getEntries());
  };

  const handleUpdateSettings = () => {
    updateSettings(settings);
  };

  // Calculate summaries
  const [year, month] = reportMonth.split('-').map(Number);
  const monthlySummary = getMonthlySummary(year, month - 1);
  const allTimeSummary = getAllTimeSummary();

  // Chart data for monthly view
  const monthlyChartData = monthlySummary.projectStats.map((stat, idx) => ({
    label: stat.project.name,
    hours: stat.totalHours,
    colorIndex: idx
  }));

  // Chart data for all-time view
  const allTimeChartData = allTimeSummary.projectStats.map((stat, idx) => ({
    label: stat.project.name,
    hours: stat.totalHours,
    colorIndex: idx
  }));

  const tabButtons = [
    { key: 'timer', label: 'Timer' },
    { key: 'projects', label: 'Projekte' },
    { key: 'reports', label: 'Auswertung' },
    { key: 'settings', label: 'Einstellungen' }
  ] as const;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Header with Theme Toggle */}
        <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
              Time Tracker
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Erfasse deine Arbeitszeit
            </p>
          </div>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'dark' ? (
              <><SunIcon className="w-5 h-5" /><span>Light</span></>
            ) : (
              <><MoonIcon className="w-5 h-5" /><span>Dark</span></>
            )}
          </button>
        </header>

        {/* Navigation */}
        <nav className="tab-bar" style={{ marginBottom: '28px', display: 'flex', gap: '4px' }}>
          {tabButtons.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 500,
                border: 'none',
                background: activeTab === tab.key ? 'var(--accent)' : 'transparent',
                color: activeTab === tab.key ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                if (activeTab !== tab.key) {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={e => {
                if (activeTab !== tab.key) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Timer Tab */}
        {activeTab === 'timer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* New Entry Form */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
                Neuer Zeiteintrag
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Projekt
                  </label>
                  <select
                    value={newEntry.project_id}
                    onChange={e => setNewEntry({ ...newEntry, project_id: Number(e.target.value) })}
                    style={{ width: '100%' }}
                  >
                    <option value={0}>Projekt waehlen...</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Datum
                  </label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={e => setNewEntry({ ...newEntry, date: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Stunden
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    placeholder="z.B. 2.5"
                    value={newEntry.hours}
                    onChange={e => setNewEntry({ ...newEntry, hours: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Beschreibung (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Was wurde gemacht?"
                    value={newEntry.description}
                    onChange={e => setNewEntry({ ...newEntry, description: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              <button
                onClick={handleAddEntry}
                disabled={!newEntry.project_id || !newEntry.hours}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#ffffff',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  opacity: (!newEntry.project_id || !newEntry.hours) ? 0.5 : 1,
                  cursor: (!newEntry.project_id || !newEntry.hours) ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={e => {
                  if (newEntry.project_id && newEntry.hours) {
                    e.currentTarget.style.background = 'var(--accent-hover)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--accent)';
                }}
              >
                Eintrag speichern
              </button>
            </div>

            {/* Recent Entries */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
                Letzte Eintraege
              </h2>
              {entries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Noch keine Eintraege vorhanden
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[...entries].reverse().slice(0, 10).map(entry => {
                    const project = projects.find(p => p.id === entry.project_id);
                    return (
                      <div
                        key={entry.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          background: 'var(--bg-inner)',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                            {project?.name || 'Unbekannt'}
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {entry.date}
                            {entry.description && ` · ${entry.description}`}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--accent)' }}>
                            {entry.hours}h
                          </span>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', minWidth: '70px', textAlign: 'right' }}>
                            {(entry.hours * settings.hourly_rate).toFixed(0)} EUR
                          </span>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            style={{
                              fontSize: '0.8125rem',
                              color: 'var(--danger)',
                              background: 'transparent',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = 'var(--danger-soft)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            Loeschen
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
              Projekte verwalten
            </h2>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <input
                type="text"
                placeholder="Neues Projekt..."
                value={newProject}
                onChange={e => setNewProject(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddProject()}
                style={{ flex: 1 }}
              />
              <button
                onClick={handleAddProject}
                disabled={!newProject.trim()}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#ffffff',
                  fontWeight: 500,
                  opacity: !newProject.trim() ? 0.5 : 1,
                  cursor: !newProject.trim() ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={e => {
                  if (newProject.trim()) {
                    e.currentTarget.style.background = 'var(--accent-hover)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--accent)';
                }}
              >
                Hinzufuegen
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {projects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Noch keine Projekte
                </div>
              ) : (
                projects.map((project, idx) => {
                  const projectHours = entries
                    .filter(e => e.project_id === project.id)
                    .reduce((sum, e) => sum + e.hours, 0);
                  const colorClass = `project-color-${idx % 8}`;
                  return (
                    <div
                      key={project.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'var(--bg-inner)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                          {project.name}
                        </div>
                        <div style={{ fontSize: '0.8125rem', marginTop: '4px' }} className={colorClass}>
                          {projectHours.toFixed(1)}h gesamt
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--danger)',
                          background: 'transparent',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'var(--danger-soft)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        Loeschen
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Monthly Stats */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Monatsauswertung
                </h2>
                <input
                  type="month"
                  value={reportMonth}
                  onChange={e => setReportMonth(e.target.value)}
                  style={{ width: 'auto' }}
                />
              </div>
              
              {/* Stats Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                gap: '12px',
                marginBottom: '28px' 
              }}>
                <div className="stat-card">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Gesamtstunden
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                    {monthlySummary.totalHours.toFixed(1)}h
                  </div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Umsatz
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>
                    {monthlySummary.totalRevenue.toFixed(0)} EUR
                  </div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Eintraege
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {monthlySummary.entryCount}
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div style={{ marginTop: '8px' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Stunden nach Projekt
                </h3>
                <BarChart data={monthlyChartData} />
              </div>
            </div>

            {/* All-Time Summary */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
                Gesamtauswertung
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                gap: '12px',
                marginBottom: '28px' 
              }}>
                <div className="stat-card">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Gesamtstunden
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                    {allTimeSummary.totalHours.toFixed(1)}h
                  </div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Gesamtumsatz
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>
                    {allTimeSummary.totalRevenue.toFixed(0)} EUR
                  </div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Projekte
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {allTimeSummary.projectCount}
                  </div>
                </div>
              </div>

              {/* All-Time Bar Chart */}
              {allTimeChartData.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Alle Stunden nach Projekt
                  </h3>
                  <BarChart data={allTimeChartData} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="card" style={{ padding: '24px', maxWidth: '480px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
              Einstellungen
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Stundensatz (EUR)
                </label>
                <input
                  type="number"
                  value={settings.hourly_rate}
                  onChange={e => setSettings({ ...settings, hourly_rate: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              <button
                onClick={handleUpdateSettings}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#ffffff',
                  fontSize: '0.9375rem',
                  fontWeight: 600
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--accent-hover)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--accent)';
                }}
              >
                Speichern
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
