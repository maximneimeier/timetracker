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
  getWeeklySummary,
  getYearlyHeatmapData,
  getTimerState,
  setTimerState,
  clearTimerState,
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

// Stacked Bar Chart Component for Weekly View
function StackedBarChart({ data, maxHours }: { data: { name: string; projectHours: { project: Project; hours: number; colorIndex: number }[]; totalHours: number }[]; maxHours: number }) {
  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
        <p>Noch keine Daten vorhanden</p>
      </div>
    );
  }

  const chartHeight = 160;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Chart Area */}
      <div style={{ display: 'flex', gap: '8px', height: `${chartHeight}px`, alignItems: 'flex-end', padding: '0 0 8px 0' }}>
        {data.map((day, dayIdx) => {
          const barHeightPercent = day.totalHours > 0 ? (day.totalHours / maxHours) * 100 : 0;
          return (
            <div key={dayIdx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  height: `${barHeightPercent}%`,
                  minHeight: day.totalHours > 0 ? '4px' : '0',
                  background: day.projectHours.length === 0 ? 'var(--bg-inner)' : undefined,
                  borderRadius: '6px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column-reverse'
                }}
              >
                {day.projectHours.map((ph, phIdx) => {
                  const colorClass = `bar-color-${ph.colorIndex % 8}`;
                  const segmentHeightPercent = day.totalHours > 0 ? (ph.hours / day.totalHours) * 100 : 0;
                  return (
                    <div
                      key={phIdx}
                      className={colorClass}
                      style={{
                        width: '100%',
                        height: `${segmentHeightPercent}%`,
                        minHeight: ph.hours > 0 ? '2px' : '0',
                        transition: 'all 0.3s ease'
                      }}
                      title={`${ph.project.name}: ${ph.hours.toFixed(1)}h`}
                    />
                  );
                })}
              </div>
              {/* Day Label */}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {day.name}
              </span>
              {/* Total Hours */}
              {day.totalHours > 0 && (
                <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                  {day.totalHours.toFixed(1)}h
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Bar Chart Component
function BarChart({ data }: { data: { label: string; hours: number; colorIndex: number }[] }) {
  const maxHours = Math.max(...data.map(d => d.hours), 1);
  
  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
        <p>Noch keine Daten vorhanden</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {data.map((item, idx) => {
        const widthPercent = (item.hours / maxHours) * 100;
        const colorClass = `bar-color-${item.colorIndex % 8}`;
        const textColorClass = `project-color-${item.colorIndex % 8}`;
        
        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                {item.label}
              </span>
              <span className={textColorClass} style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {item.hours.toFixed(1)}h
              </span>
            </div>
            <div 
              style={{ 
                width: '100%', 
                borderRadius: '9999px', 
                overflow: 'hidden',
                background: 'var(--bg-inner)', 
                height: '28px' 
              }}
            >
              <div
                className={colorClass}
                style={{ 
                  height: '100%', 
                  borderRadius: '9999px', 
                  transition: 'all 0.7s ease-out',
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

// Heatmap Component
function Heatmap({ data, year }: { data: { date: string; hours: number; dayOfMonth: number; month: number }[][]; year: number }) {
  const [tooltip, setTooltip] = useState<{ show: boolean; x: number; y: number; text: string }>({ show: false, x: 0, y: 0, text: '' });

  const getIntensity = (hours: number) => {
    if (hours === 0) return 0;
    if (hours <= 3) return 1;
    if (hours <= 6) return 2;
    if (hours <= 8) return 3;
    return 4;
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

  const handleMouseEnter = (e: React.MouseEvent, cell: { date: string; hours: number; dayOfMonth: number; month: number }) => {
    const date = new Date(cell.date);
    const dateStr = date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
    setTooltip({
      show: true,
      x: e.clientX + 10,
      y: e.clientY - 40,
      text: `${dateStr}: ${cell.hours.toFixed(1)}h`
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltip(prev => ({ ...prev, x: e.clientX + 10, y: e.clientY - 40 }));
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Month Labels */}
      <div style={{ display: 'flex', marginLeft: '20px', gap: '2px' }}>
        {months.map((m, i) => (
          <div key={i} style={{ width: '14px', fontSize: '0.625rem', color: 'var(--text-muted)', textAlign: 'left' }}>
            {m}
          </div>
        ))}
      </div>
      
      {/* Heatmap Grid */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '4px' }}>
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((d, i) => (
            <div key={i} style={{ height: '10px', fontSize: '0.625rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              {d}
            </div>
          ))}
        </div>
        
        {/* Weeks */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {data.map((week, weekIdx) => (
            <div key={weekIdx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {week.map((cell, dayIdx) => {
                const intensity = getIntensity(cell.hours);
                return (
                  <div
                    key={dayIdx}
                    className={`heatmap-cell heatmap-intensity-${intensity}`}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '2px',
                      background: intensity === 0 ? 'var(--bg-inner)' : undefined,
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, cell)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px', fontSize: '0.625rem', color: 'var(--text-muted)' }}>
        <span>Weniger</span>
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`heatmap-intensity-${i}`}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '2px',
              background: i === 0 ? 'var(--bg-inner)' : undefined
            }}
          />
        ))}
        <span>Mehr</span>
      </div>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '0.75rem',
            color: 'var(--text-primary)',
            zIndex: 1000,
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          {tooltip.text}
        </div>
      )}
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
    start_time: '09:00',
    end_time: '17:00',
    hours: '',
    description: ''
  });

  // Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerProjectId, setTimerProjectId] = useState(0);
  const [timerStartTimestamp, setTimerStartTimestamp] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Pagination State
  const [entriesPage, setEntriesPage] = useState(1);
  const ENTRIES_PER_PAGE = 10;
  const [reportMonth, setReportMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; project: Project | null }>({ show: false, project: null });

  // Settings save feedback
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Year for heatmap
  const [heatmapYear] = useState(new Date().getFullYear());

  useEffect(() => {
    async function load() {
      setProjects(await getProjects());
      setEntries(await getEntries());
      setSettings(await getSettings());

      // Restore timer state
      const timerState = getTimerState();
      if (timerState?.running) {
        setTimerRunning(true);
        setTimerProjectId(timerState.project_id);
        setTimerStartTimestamp(timerState.start_timestamp);
        setElapsedSeconds(Math.floor((Date.now() - timerState.start_timestamp) / 1000));
      }
    }
    load();
  }, []);

  // Timer interval with auto-stop after 6 hours
  useEffect(() => {
    if (!timerRunning) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - timerStartTimestamp) / 1000);
      setElapsedSeconds(elapsed);
      
      // Auto-stop after 6 hours (21600 seconds)
      if (elapsed >= 21600) {
        handleStopTimer();
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timerRunning, timerStartTimestamp]);

  const formatDuration = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    if (!timerProjectId) return;
    const now = Date.now();
    setTimerRunning(true);
    setTimerStartTimestamp(now);
    setElapsedSeconds(0);
    setTimerState({
      running: true,
      project_id: timerProjectId,
      start_timestamp: now,
    });
  };

  const handleStopTimer = async () => {
    if (!timerRunning) return;
    const durationHours = elapsedSeconds / 3600;
    const startTime = new Date(timerStartTimestamp);
    const endTime = new Date();
    const formatTime = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

    const entry = await addEntry({
      project_id: timerProjectId,
      date: new Date().toISOString().split('T')[0],
      hours: durationHours,
      description: '',
      start_time: formatTime(startTime),
      end_time: formatTime(endTime),
      is_timer: true,
    });

    setEntries([...entries, entry]);
    setTimerRunning(false);
    setTimerProjectId(0);
    setElapsedSeconds(0);
    clearTimerState();
  };

  const handleAddProject = async () => {
    if (!newProject.trim()) return;
    const project = await addProject(newProject.trim());
    setProjects([...projects, project]);
    setNewProject('');
  };

  const openDeleteModal = (project: Project) => {
    setDeleteModal({ show: true, project });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, project: null });
  };

  const confirmDeleteProject = async () => {
    if (!deleteModal.project) return;
    await deleteProject(deleteModal.project.id);
    setProjects(await getProjects());
    setEntries(await getEntries());
    closeDeleteModal();
  };

  const handleAddEntry = async () => {
    if (!newEntry.project_id || !newEntry.start_time || !newEntry.end_time) return;
    // Berechne Stunden aus Von/Bis
    const [sh, sm] = newEntry.start_time.split(':').map(Number);
    const [eh, em] = newEntry.end_time.split(':').map(Number);
    const diffMinutes = (eh * 60 + em) - (sh * 60 + sm);
    const hours = Math.max(0, diffMinutes / 60);
    
    const entry = await addEntry({
      project_id: Number(newEntry.project_id),
      date: newEntry.date,
      hours: hours,
      description: ''
    });
    setEntries([...entries, entry]);
    setNewEntry({ ...newEntry, hours: '', start_time: '09:00', end_time: '17:00' });
  };

  const handleDeleteEntry = async (id: number) => {
    await deleteEntry(id);
    setEntries(await getEntries());
  };

  const handleUpdateSettings = async () => {
    await updateSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  // Load summaries via effect
  interface ProjectStat { project: Project; totalHours: number; revenue: number; entries: TimeEntry[]; }
  const [monthlySummary, setMonthlySummary] = useState({ projectStats: [] as ProjectStat[], totalHours: 0, totalRevenue: 0, entryCount: 0 });
  const [allTimeSummary, setAllTimeSummary] = useState({ projectStats: [] as ProjectStat[], totalHours: 0, totalRevenue: 0, projectCount: 0, entryCount: 0 });
  interface WeeklyDay { name: string; dateStr: string; projectHours: { project: Project; hours: number; colorIndex: number }[]; totalHours: number; }
  const [weeklySummary, setWeeklySummary] = useState({ days: [] as WeeklyDay[], maxHours: 1 });
  interface HeatmapCell { date: string; hours: number; dayOfMonth: number; month: number; }
  const [yearlyHeatmap, setYearlyHeatmap] = useState([] as HeatmapCell[][]);

  useEffect(() => {
    async function loadSummaries() {
      const [year, month] = reportMonth.split('-').map(Number);
      setMonthlySummary(await getMonthlySummary(year, month - 1));
      setAllTimeSummary(await getAllTimeSummary());
      setWeeklySummary(await getWeeklySummary());
      setYearlyHeatmap(await getYearlyHeatmapData(heatmapYear));
    }
    loadSummaries();
  }, [entries, projects, settings, reportMonth, heatmapYear]);

  // Pagination
  const paginatedEntries = [...entries]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice((entriesPage - 1) * ENTRIES_PER_PAGE, entriesPage * ENTRIES_PER_PAGE);

  const totalPages = Math.ceil(entries.length / ENTRIES_PER_PAGE) || 1;

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
      {/* Delete Modal Overlay */}
      {deleteModal.show && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={closeDeleteModal}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              border: '1px solid var(--border-color)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
              Projekt löschen
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px', lineHeight: 1.5 }}>
              WARNUNG: Das Projekt &quot;{deleteModal.project?.name}&quot; und alle zugehörigen Zeiteinträge werden gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={closeDeleteModal}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Abbrechen
              </button>
              <button
                onClick={confirmDeleteProject}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'var(--danger)',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Projekt + Einträge löschen
              </button>
            </div>
          </div>
        </div>
      )}

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
            {/* Split Layout: Timer + Manual */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {/* Left: Live Timer */}
              <div className="card" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
                  Live Timer
                </h2>
                
                {!timerRunning ? (
                  <div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Projekt
                      </label>
                      <select
                        value={timerProjectId}
                        onChange={e => setTimerProjectId(Number(e.target.value))}
                        style={{ width: '100%' }}
                      >
                        <option value={0}>Projekt wählen...</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleStartTimer}
                      disabled={!timerProjectId}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: timerProjectId ? 'var(--success)' : 'var(--text-disabled)',
                        color: '#ffffff',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: timerProjectId ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Timer starten
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent)', marginBottom: '8px' }}>
                      {formatDuration(elapsedSeconds)}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.875rem' }}>
                      Timer läuft...
                    </p>
                    <button
                      onClick={handleStopTimer}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'var(--danger)',
                        color: '#ffffff',
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      Timer stoppen & speichern
                    </button>
                  </div>
                )}
              </div>

              {/* Right: Manual Entry */}
              <div className="card" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
                  Manuelle Eingabe
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Projekt
                    </label>
                    <select
                      value={newEntry.project_id}
                      onChange={e => setNewEntry({ ...newEntry, project_id: Number(e.target.value) })}
                      style={{ width: '100%' }}
                    >
                      <option value={0}>Projekt wählen...</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Datum
                      </label>
                      <input
                        type="date"
                        value={newEntry.date}
                        onChange={e => setNewEntry({ ...newEntry, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Von
                      </label>
                      <input
                        type="time"
                        value={newEntry.start_time}
                        onChange={e => setNewEntry({ ...newEntry, start_time: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Bis
                      </label>
                      <input
                        type="time"
                        value={newEntry.end_time}
                        onChange={e => setNewEntry({ ...newEntry, end_time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-inner)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Berechnete Stunden:</span>
                    <span style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--accent)' }}>
                      {(() => {
                        if (!newEntry.start_time || !newEntry.end_time) return '0.00h';
                        const [sh, sm] = newEntry.start_time.split(':').map(Number);
                        const [eh, em] = newEntry.end_time.split(':').map(Number);
                        const diff = (eh * 60 + em) - (sh * 60 + sm);
                        return (Math.max(0, diff) / 60).toFixed(2) + 'h';
                      })()}
                    </span>
                  </div>
                  <button
                    onClick={handleAddEntry}
                    disabled={!newEntry.project_id || !newEntry.start_time || !newEntry.end_time}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: (newEntry.project_id && newEntry.start_time && newEntry.end_time) ? 'var(--accent)' : 'var(--text-disabled)',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: (newEntry.project_id && newEntry.start_time && newEntry.end_time) ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Eintrag speichern
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Entries */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Letzte Einträge
                </h2>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Seite {entriesPage} / {totalPages}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {paginatedEntries.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                    Noch keine Einträge vorhanden.
                  </p>
                ) : (
                  paginatedEntries.map(entry => {
                    const project = projects.find(p => p.id === entry.project_id);
                    return (
                      <div
                        key={entry.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          background: 'var(--bg-inner)',
                          borderRadius: '12px',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {project?.name || 'Unbekanntes Projekt'}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                              {entry.date}
                            </span>
                          </div>
                          {entry.description && (
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                              {entry.description}
                            </p>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--accent)' }}>
                            {entry.hours.toFixed(1)}h
                          </span>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'var(--danger-soft)',
                              color: 'var(--danger)',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            Löschen
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                  <button
                    onClick={() => setEntriesPage(p => Math.max(1, p - 1))}
                    disabled={entriesPage === 1}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: entriesPage === 1 ? 'var(--text-disabled)' : 'var(--text-primary)',
                      cursor: entriesPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Vorherige
                  </button>
                  <button
                    onClick={() => setEntriesPage(p => Math.min(totalPages, p + 1))}
                    disabled={entriesPage === totalPages}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: entriesPage === totalPages ? 'var(--text-disabled)' : 'var(--text-primary)',
                      cursor: entriesPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Nächste
                  </button>
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
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: newProject.trim() ? 'var(--accent)' : 'var(--text-disabled)',
                  color: '#ffffff',
                  fontWeight: 600,
                  cursor: newProject.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Hinzufügen
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projects.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  Noch keine Projekte vorhanden. Erstelle dein erstes Projekt!
                </p>
              ) : (
                projects.map(project => (
                  <div
                    key={project.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      background: 'var(--bg-inner)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                      {project.name}
                    </span>
                    <button
                      onClick={() => openDeleteModal(project)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'var(--danger-soft)',
                        color: 'var(--danger)',
                        fontSize: '0.8125rem',
                        cursor: 'pointer'
                      }}
                    >
                      Löschen
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Weekly Overview */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
                Wochenübersicht
              </h2>
              {weeklySummary.days.some(d => d.totalHours > 0) ? (
                <>
                  <StackedBarChart data={weeklySummary.days} maxHours={Math.max(weeklySummary.maxHours, 8)} />
                  {/* Legend */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
                    {projects.map((p, idx) => {
                      const colorClass = `bar-color-${idx % 8}`;
                      return (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div className={colorClass} style={{ width: '12px', height: '12px', borderRadius: '3px' }} />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  Noch keine Einträge in dieser Woche.
                </p>
              )}
            </div>

            {/* Yearly Heatmap */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
                Jahresübersicht {heatmapYear}
              </h2>
              <Heatmap data={yearlyHeatmap} year={heatmapYear} />
            </div>

            {/* Monthly Report */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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
                    Kalkulierte Kosten
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>
                    {monthlySummary.totalRevenue.toFixed(0)} EUR
                  </div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Einträge
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {monthlySummary.entryCount}
                  </div>
                </div>
              </div>

              {/* Monthly Bar Chart */}
              {monthlyChartData.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Stunden nach Projekt
                  </h3>
                  <BarChart data={monthlyChartData} />
                </div>
              )}
            </div>

            {/* All Time Report */}
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
                    Kalkulierte Kosten
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
                  background: settingsSaved ? 'var(--success)' : 'var(--accent)',
                  color: '#ffffff',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                {settingsSaved ? 'Gespeichert' : 'Speichern'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
