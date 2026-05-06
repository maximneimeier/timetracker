'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useTheme } from '../../lib/theme';
import { useI18n, type Language } from '../../lib/i18n';
import {
  getProjects,
  addProject,
  deleteProject,
  updateProject,
  getEntries,
  addEntry,
  deleteEntry,
  updateEntry,
  getWorkspaceSettings,
  getMonthlySummary,
  getAllTimeSummary,
  getWeeklySummary,
  getYearlyHeatmapData,
  getTimerState,
  setTimerState,
  clearTimerState,
  Project,
  TimeEntry,
  type TimerPresetId,
  DEFAULT_PROJECT_HOURLY_RATE,
} from '../../lib/storage';
import { ExpensesSection } from '../finance/ExpensesSection';
import { CustomersSection } from '../finance/CustomersSection';
import { QuotesSection } from '../finance/QuotesSection';

// Moon icon
function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// Sun icon
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

// Gear icon
function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// Tooltip Component
function Tooltip({ show, x, y, text }: { show: boolean; x: number; y: number; text: string }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        padding: '6px 10px',
        fontSize: '0.75rem',
        color: 'var(--text-primary)',
        zIndex: 1000,
        pointerEvents: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        whiteSpace: 'nowrap'
      }}
    >
      {text}
    </div>
  );
}

// Stacked Bar Chart
function StackedBarChart({ data, t }: { data: { name: string; projectHours: { project: Project; hours: number; colorIndex: number }[]; totalHours: number }[]; t: (key: any, vars?: Record<string, string>) => string }) {
  const [tooltip, setTooltip] = useState<{ show: boolean; x: number; y: number; text: string }>({ show: false, x: 0, y: 0, text: '' });

  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
        <p>{t('noWeeklyData')}</p>
      </div>
    );
  }

  const maxHours = Math.max(...data.map(d => d.totalHours), 0.1);
  const chartHeight = 180;
  const yAxisSteps = 5;
  const yAxisMax = Math.ceil(maxHours * 1.1);

  const handleSegmentEnter = (e: React.MouseEvent, ph: { project: Project; hours: number }) => {
    setTooltip({
      show: true,
      x: e.clientX + 10,
      y: e.clientY - 40,
      text: `${ph.project.name}: ${ph.hours.toFixed(1)}h`
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltip(prev => ({ ...prev, x: e.clientX + 10, y: e.clientY - 40 }));
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: `${chartHeight}px`, paddingRight: '8px', borderRight: '1px solid var(--border-color)' }}>
          {Array.from({ length: yAxisSteps + 1 }, (_, i) => (
            <span key={i} style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textAlign: 'right', lineHeight: '1' }}>
              {((yAxisMax / yAxisSteps) * (yAxisSteps - i)).toFixed(0)}h
            </span>
          ))}
        </div>
        <div style={{ flex: 1, display: 'flex', gap: '8px', height: `${chartHeight}px`, alignItems: 'flex-end', padding: '0 0 8px 0' }}>
          {data.map((day, dayIdx) => {
            const barHeightPercent = day.totalHours > 0 ? (day.totalHours / yAxisMax) * 100 : 0;
            return (
              <div key={dayIdx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
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
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => handleSegmentEnter(e, ph)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                      />
                    );
                  })}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {day.name}
                </span>
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
      <div style={{ textAlign: 'center', fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '-4px', marginLeft: '32px' }}>
        {t('weekdays')}
      </div>
      <Tooltip {...tooltip} />
    </div>
  );
}

// Bar Chart
function BarChart({ data }: { data: { label: string; hours: number; colorIndex: number }[] }) {
  const maxHours = Math.max(...data.map(d => d.hours), 1);

  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
        <p>No data available</p>
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

// Heatmap
function Heatmap({ data, year, t }: { data: { date: string; hours: number; dayOfMonth: number; month: number }[][]; year: number; t: (key: any, vars?: Record<string, string>) => string }) {
  const [tooltip, setTooltip] = useState<{ show: boolean; x: number; y: number; text: string }>({ show: false, x: 0, y: 0, text: '' });

  const getIntensity = (hours: number) => {
    if (hours === 0) return 0;
    if (hours <= 3) return 1;
    if (hours <= 6) return 2;
    if (hours <= 8) return 3;
    return 4;
  };

  const months = [t('jan'), t('feb'), t('mar'), t('apr'), t('may'), t('jun'), t('jul'), t('aug'), t('sep'), t('oct'), t('nov'), t('dec')];

  const handleMouseEnter = (e: React.MouseEvent, cell: { date: string; hours: number; dayOfMonth: number; month: number }) => {
    const date = new Date(cell.date);
    const dateStr = date.toLocaleDateString(langLocale(t), { day: 'numeric', month: 'long', year: 'numeric' });
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
      <div style={{ display: 'flex', marginLeft: '20px', gap: '2px' }}>
        {months.map((m, i) => (
          <div key={i} style={{ width: '14px', fontSize: '0.625rem', color: 'var(--text-muted)', textAlign: 'left' }}>
            {m}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '4px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '4px' }}>
          {[t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')].map((d, i) => (
            <div key={i} style={{ height: '10px', fontSize: '0.625rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              {d}
            </div>
          ))}
        </div>
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
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px', fontSize: '0.625rem', color: 'var(--text-muted)' }}>
        <span>{t('less')}</span>
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
        <span>{t('more')}</span>
      </div>
      <Tooltip {...tooltip} />
    </div>
  );
}

function langLocale(t: (key: any) => string): string {
  // map internal lang to browser locale for date formatting
  const map: Record<string, string> = { de: 'de-DE', en: 'en-US', es: 'es-ES', fr: 'fr-FR', ru: 'ru-RU' };
  return map[t('timer') === 'Timer' ? 'de' : 'en'] || 'de-DE';
}

function dateLocale(lang: Language): string {
  const map: Record<Language, string> = { de: 'de-DE', en: 'en-US', es: 'es-ES', fr: 'fr-FR', ru: 'ru-RU' };
  return map[lang];
}

export default function WorkspaceDashboardPage({
  workspaceId,
  employeeMode = false,
}: {
  workspaceId: string;
  /** Unternehmen: Nur Timer & Zeiterfassung ohne Auswertung/Finanzen */
  employeeMode?: boolean;
}) {
  const { theme, toggleTheme } = useTheme();
  const { lang, t } = useI18n();

  const [activeTab, setActiveTab] = useState<
    'timer' | 'projects' | 'reports' | 'revenue' | 'expenses' | 'customers' | 'quotes'
  >('timer');
  const [reportView, setReportView] = useState<'week' | 'month' | 'all'>('week');
  const [projects, setProjects] = useState<Project[]>([]);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [settings, setSettings] = useState<{ timer_preset: TimerPresetId }>({
    timer_preset: 'classic'
  });
  const [newProject, setNewProject] = useState('');
  const [newProjectHourly, setNewProjectHourly] = useState(String(DEFAULT_PROJECT_HOURLY_RATE));
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

  // Pagination
  const [entriesPage, setEntriesPage] = useState(1);
  const ENTRIES_PER_PAGE = 10;
  const [reportMonth, setReportMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; project: Project | null }>({ show: false, project: null });

  // Edit Entry Modal
  const [editEntryModal, setEditEntryModal] = useState<{ show: boolean; entry: TimeEntry | null }>({ show: false, entry: null });

  // Edit Project Modal
  const [editProjectModal, setEditProjectModal] = useState<{ show: boolean; project: Project | null }>({ show: false, project: null });

  // Year for heatmap
  const [heatmapYear] = useState(new Date().getFullYear());

  // Update html lang attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'en' ? 'en' : lang === 'es' ? 'es' : lang === 'fr' ? 'fr' : lang === 'ru' ? 'ru' : 'de';
    }
  }, [lang]);

  useEffect(() => {
    async function load() {
      setProjects(await getProjects(workspaceId));
      setEntries(await getEntries(workspaceId));
      setSettings(await getWorkspaceSettings(workspaceId));
      const timerState = getTimerState(workspaceId);
      if (timerState?.running) {
        setTimerRunning(true);
        setTimerProjectId(parseInt(timerState.project_id, 10) || 0);
        setTimerStartTimestamp(timerState.start_timestamp);
        setElapsedSeconds(Math.floor((Date.now() - timerState.start_timestamp) / 1000));
      }
    }
    load();
  }, [workspaceId]);

  // Timer interval with auto-stop after 6 hours
  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - timerStartTimestamp) / 1000);
      setElapsedSeconds(elapsed);

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
    setTimerState(workspaceId, {
      running: true,
      project_id: String(timerProjectId),
      start_timestamp: now,
    });
  };

  const handleStopTimer = useCallback(async () => {
    if (!timerRunning) return;
    const durationHours = elapsedSeconds / 3600;
    const startTime = new Date(timerStartTimestamp);
    const endTime = new Date();
    const formatTime = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

    const entry = await addEntry(workspaceId, {
      project_id: String(timerProjectId),
      date: new Date().toISOString().split('T')[0],
      hours: durationHours,
      description: '',
      start_time: formatTime(startTime),
      end_time: formatTime(endTime),
      is_timer: true,
    });

    setEntries(prev => [...prev, entry]);
    setTimerRunning(false);
    setTimerProjectId(0);
    setElapsedSeconds(0);
    clearTimerState(workspaceId);
  }, [timerRunning, elapsedSeconds, timerStartTimestamp, timerProjectId, workspaceId]);

  const handleAddProject = async () => {
    if (!newProject.trim()) return;
    const rate = Math.max(0, Number(String(newProjectHourly).replace(',', '.')) || 0);
    const project = await addProject(workspaceId, newProject.trim(), { hourly_rate: rate });
    setProjects([...projects, project]);
    setNewProject('');
    setNewProjectHourly(String(DEFAULT_PROJECT_HOURLY_RATE));
  };

  const openDeleteModal = (project: Project) => {
    setDeleteModal({ show: true, project });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, project: null });
  };

  const confirmDeleteProject = async () => {
    if (!deleteModal.project) return;
    await deleteProject(workspaceId, deleteModal.project.id);
    setProjects(await getProjects(workspaceId));
    setEntries(await getEntries(workspaceId));
    closeDeleteModal();
  };

  const handleAddEntry = async () => {
    if (!newEntry.project_id || !newEntry.start_time || !newEntry.end_time) return;
    const [sh, sm] = newEntry.start_time.split(':').map(Number);
    const [eh, em] = newEntry.end_time.split(':').map(Number);
    const diffMinutes = (eh * 60 + em) - (sh * 60 + sm);
    const hours = Math.max(0, diffMinutes / 60);

    const entry = await addEntry(workspaceId, {
      project_id: String(newEntry.project_id),
      date: newEntry.date,
      hours: hours,
      description: ''
    });
    setEntries([...entries, entry]);
    setNewEntry({ ...newEntry, hours: '', start_time: '09:00', end_time: '17:00' });
  };

  const handleDeleteEntry = async (id: string) => {
    await deleteEntry(workspaceId, id);
    setEntries(await getEntries(workspaceId));
  };

  const openEditEntry = (entry: TimeEntry) => {
    setEditEntryModal({ show: true, entry });
  };

  const closeEditEntry = () => {
    setEditEntryModal({ show: false, entry: null });
  };

  const saveEditEntry = async () => {
    if (!editEntryModal.entry) return;
    await updateEntry(workspaceId, editEntryModal.entry.id, {
      project_id: editEntryModal.entry.project_id,
      date: editEntryModal.entry.date,
      start_time: editEntryModal.entry.start_time,
      end_time: editEntryModal.entry.end_time,
      hours: editEntryModal.entry.hours,
      description: editEntryModal.entry.description,
    });
    setEntries(await getEntries(workspaceId));
    closeEditEntry();
  };

  const openEditProject = (project: Project) => {
    setEditProjectModal({ show: true, project });
  };

  const closeEditProject = () => {
    setEditProjectModal({ show: false, project: null });
  };

  const saveEditProject = async () => {
    if (!editProjectModal.project) return;
    const p = editProjectModal.project;
    const rate = Math.max(0, Number(String(p.hourly_rate).replace(',', '.')) || 0);
    await updateProject(workspaceId, p.id, {
      name: p.name.trim(),
      description: p.description?.trim() || undefined,
      hourly_rate: rate,
    });
    setProjects(await getProjects(workspaceId));
    closeEditProject();
  };

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
      setMonthlySummary(await getMonthlySummary(workspaceId, year, month - 1));
      setAllTimeSummary(await getAllTimeSummary(workspaceId));
      setWeeklySummary(await getWeeklySummary(workspaceId));
      setYearlyHeatmap(await getYearlyHeatmapData(workspaceId, heatmapYear));
    }
    loadSummaries();
  }, [entries, projects, reportMonth, heatmapYear, workspaceId]);

  const eurFmt = useMemo(
    () =>
      new Intl.NumberFormat(dateLocale(lang), {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
    [lang]
  );

  const paginatedEntries = [...entries]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice((entriesPage - 1) * ENTRIES_PER_PAGE, entriesPage * ENTRIES_PER_PAGE);

  const totalPages = Math.ceil(entries.length / ENTRIES_PER_PAGE) || 1;

  const monthlyChartData = monthlySummary.projectStats.map((stat, idx) => ({
    label: stat.project.name,
    hours: stat.totalHours,
    colorIndex: idx
  }));

  const allTimeChartData = allTimeSummary.projectStats.map((stat, idx) => ({
    label: stat.project.name,
    hours: stat.totalHours,
    colorIndex: idx
  }));

  const tabButtons = [
    { key: 'timer' as const, label: t('timer') },
    { key: 'projects' as const, label: t('aufgaben') },
    { key: 'reports' as const, label: t('auswertung') },
    { key: 'revenue' as const, label: t('revenue') },
    { key: 'expenses' as const, label: t('expensesTab') },
    { key: 'customers' as const, label: t('navCustomers') },
    { key: 'quotes' as const, label: t('navQuotes') }
  ];

  const reportViewButtons = [
    { key: 'week' as const, label: t('woche') },
    { key: 'month' as const, label: t('monat') },
    { key: 'all' as const, label: t('gesamt') }
  ];

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
              borderRadius: '10px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              border: '1px solid var(--border-color)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
              {t('confirmDelete')}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px', lineHeight: 1.5 }}>
              {t('deleteWarning', { name: deleteModal.project?.name || '' })}
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
                {t('cancel')}
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
                {t('deleteProjectAndEntries')}
              </button>
            </div>
          </div>
        </div>
      )}

      {editProjectModal.show && editProjectModal.project && (
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
            zIndex: 1000,
          }}
          onClick={closeEditProject}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: '10px',
              padding: '24px',
              maxWidth: '420px',
              width: '90%',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {t('edit')} – {editProjectModal.project.name}
            </h3>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {t('name')}
              </label>
              <input
                type="text"
                value={editProjectModal.project.name}
                onChange={e =>
                  setEditProjectModal({
                    ...editProjectModal,
                    project: { ...editProjectModal.project!, name: e.target.value },
                  })
                }
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {t('projectHourlyRateCalc')}
              </label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={editProjectModal.project.hourly_rate}
                onChange={e =>
                  setEditProjectModal({
                    ...editProjectModal,
                    project: { ...editProjectModal.project!, hourly_rate: Number(e.target.value) },
                  })
                }
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={closeEditProject}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={() => void saveEditProject()}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="linear-nav-shell">
        <div
          className="dashboard-header-grid"
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '18px 24px',
            display: 'grid',
            alignItems: 'center',
            columnGap: '16px',
            rowGap: '10px'
          }}
        >
          <div className="dashboard-header-brand" style={{ gridArea: 'brand', minWidth: 0 }}>
            <h1 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t('appTitle')}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {employeeMode ? t('workspaceEmployeeSubtitle') : t('appSubtitle')}
            </p>
          </div>

          <nav
            className="dashboard-navbar dashboard-navbar--in-header"
            style={{ gridArea: 'nav' }}
            aria-label={t('mainNavigationAria')}
          >
            <div className="dashboard-navbar-scroll">
              {!employeeMode
                ? tabButtons.map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      className={`dashboard-nav-link${activeTab === tab.key ? ' active' : ''}`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))
                : null}
            </div>

            <div className="dashboard-navbar-actions">
              <Link
                href="/dashboard"
                className="dashboard-nav-link"
                style={{ padding: '10px 14px', marginRight: '4px', fontSize: '0.875rem', textDecoration: 'none' }}
              >
                ← {t('workspaceBackToList')}
              </Link>
              <Link
                href={`/dashboard/w/${workspaceId}/settings`}
                className="icon-button"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label={t('settings')}
                title={t('settings')}
              >
                <GearIcon className="w-5 h-5" />
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                className="icon-button"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')}
                title={theme === 'dark' ? t('lightMode') : t('darkMode')}
              >
                {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 20px 60px' }}>
        {/* Timer Tab */}
        {(employeeMode || activeTab === 'timer') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {/* Live Timer */}
              <div
                className={`card timer-shell timer-shell--${settings.timer_preset}`}
                style={{ padding: '24px' }}
              >
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
                  {t('liveTimer')}
                </h2>

                {!timerRunning ? (
                  <div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {t('project')}
                      </label>
                      <select
                        value={timerProjectId}
                        onChange={e => setTimerProjectId(Number(e.target.value))}
                        style={{ width: '100%' }}
                      >
                        <option value={0}>{t('selectProject')}</option>
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
                        borderRadius: '8px',
                        border: 'none',
                        background: timerProjectId ? 'var(--success)' : 'var(--text-disabled)',
                        color: '#ffffff',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: timerProjectId ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {t('startTimer')}
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div
                      className="timer-shell-display"
                      style={{ fontSize: '3rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent)', marginBottom: '8px' }}
                    >
                      {formatDuration(elapsedSeconds)}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.875rem' }}>
                      {t('timerRunning')}
                    </p>
                    <button
                      onClick={handleStopTimer}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'var(--danger)',
                        color: '#ffffff',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {t('stopTimer')}
                    </button>
                  </div>
                )}
              </div>

              {/* Manual Entry */}
              <div className="card" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
                  {t('manualEntry')}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      {t('project')}
                    </label>
                    <select
                      value={newEntry.project_id}
                      onChange={e => setNewEntry({ ...newEntry, project_id: Number(e.target.value) })}
                      style={{ width: '100%' }}
                    >
                      <option value={0}>{t('selectProject')}</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {t('date')}
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
                        {t('from')}
                      </label>
                      <input
                        type="time"
                        value={newEntry.start_time}
                        onChange={e => setNewEntry({ ...newEntry, start_time: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {t('to')}
                      </label>
                      <input
                        type="time"
                        value={newEntry.end_time}
                        onChange={e => setNewEntry({ ...newEntry, end_time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-inner)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('calculatedHours')}</span>
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
                      borderRadius: '8px',
                      border: 'none',
                      background: (newEntry.project_id && newEntry.start_time && newEntry.end_time) ? 'var(--accent)' : 'var(--text-disabled)',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: (newEntry.project_id && newEntry.start_time && newEntry.end_time) ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {t('saveEntry')}
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Entries */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {t('recentEntries')}
                </h2>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {t('page')} {entriesPage} {t('of')} {totalPages}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {paginatedEntries.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                    {t('noEntries')}
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
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {project?.name || t('unknownProject')}
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
                            onClick={() => openEditEntry(entry)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'var(--accent-soft)',
                              color: 'var(--accent)',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            Bearbeiten
                          </button>
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
                            {t('delete')}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

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
                    {t('previous')}
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
                    {t('next')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {!employeeMode && activeTab === 'projects' && (
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
              {t('manageProjects')}
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', alignItems: 'flex-end' }}>
              <div style={{ flex: '2 1 200px', minWidth: 0 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {t('project')}
                </label>
                <input
                  type="text"
                  placeholder={t('newProjectPlaceholder')}
                  value={newProject}
                  onChange={e => setNewProject(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddProject()}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
              </div>
              <div style={{ flex: '0 1 132px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {t('projectHourlyRateCalc')}
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={newProjectHourly}
                  onChange={e => setNewProjectHourly(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddProject()}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
                />
              </div>
              <button
                type="button"
                onClick={handleAddProject}
                disabled={!newProject.trim()}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  alignSelf: 'flex-end',
                  background: newProject.trim() ? 'var(--accent)' : 'var(--text-disabled)',
                  color: '#ffffff',
                  fontWeight: 600,
                  cursor: newProject.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                {t('add')}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projects.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  {t('noProjects')}
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
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{project.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {t('projectHourlyRateCalc')}: {eurFmt.format(project.hourly_rate)}/h
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditProject(project)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'var(--accent-soft)',
                          color: 'var(--accent)',
                          fontSize: '0.8125rem',
                          cursor: 'pointer'
                        }}
                      >
                        {t('edit')}
                      </button>
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
                        {t('delete')}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {!employeeMode && activeTab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Report View Toggle */}
            <div className="tab-bar" style={{ display: 'flex', gap: '4px' }}>
              {reportViewButtons.map(view => (
                <button
                  key={view.key}
                  onClick={() => setReportView(view.key)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    border: 'none',
                    background: reportView === view.key ? 'var(--accent)' : 'transparent',
                    color: reportView === view.key ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    if (reportView !== view.key) {
                      e.currentTarget.style.background = 'var(--bg-hover)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (reportView !== view.key) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  {view.label}
                </button>
              ))}
            </div>

            {/* Weekly Overview */}
            {reportView === 'week' && (
              <div className="card" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
                  {t('weeklyOverview')}
                </h2>
                {weeklySummary.days.some(d => d.totalHours > 0) ? (
                  <>
                    <StackedBarChart data={weeklySummary.days} t={t} />
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
                    {t('noWeeklyData')}
                  </p>
                )}
              </div>
            )}

            {/* Monthly Report */}
            {reportView === 'month' && (
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {t('monthlyReport')}
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
                      {t('totalHours')}
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                      {monthlySummary.totalHours.toFixed(1)}h
                    </div>
                  </div>
                  <div className="stat-card">
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {t('calculatedCosts')}
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>
                      {monthlySummary.totalRevenue.toFixed(0)} EUR
                    </div>
                  </div>
                  <div className="stat-card">
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {t('entries')}
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {monthlySummary.entryCount}
                    </div>
                  </div>
                </div>

                {monthlyChartData.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      {t('hoursByProject')}
                    </h3>
                    <BarChart data={monthlyChartData} />
                  </div>
                )}
              </div>
            )}

            {/* All Time Report */}
            {reportView === 'all' && (
              <>
                <div className="card" style={{ padding: '24px' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
                    {t('yearlyOverview')} {heatmapYear}
                  </h2>
                  <Heatmap data={yearlyHeatmap} year={heatmapYear} t={t} />
                </div>

                <div className="card" style={{ padding: '24px' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
                    {t('allTimeReport')}
                  </h2>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '12px',
                    marginBottom: '28px'
                  }}>
                    <div className="stat-card">
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {t('totalHours')}
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                        {allTimeSummary.totalHours.toFixed(1)}h
                      </div>
                    </div>
                    <div className="stat-card">
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {t('calculatedCosts')}
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>
                        {allTimeSummary.totalRevenue.toFixed(0)} EUR
                      </div>
                    </div>
                    <div className="stat-card">
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {t('projects')}
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {allTimeSummary.projectCount}
                      </div>
                    </div>
                  </div>

                  {allTimeChartData.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        {t('allHoursByProject')}
                      </h3>
                      <BarChart data={allTimeChartData} />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Revenue Tab */}
        {!employeeMode && activeTab === 'revenue' && (
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>Umsatzübersicht</h2>
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>Monatlicher Umsatz</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div className="stat-card">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gesamtumsatz</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>{monthlySummary.totalRevenue.toFixed(0)} EUR</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('weightedAvgHourlyRate')}
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                    {monthlySummary.totalHours > 0
                      ? `${(monthlySummary.totalRevenue / monthlySummary.totalHours).toFixed(0)} EUR`
                      : '—'}
                  </div>
                </div>
              </div>
              {monthlySummary.projectStats.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>Umsatz pro Aufgabe</h3>
                  <BarChart data={monthlySummary.projectStats.map((s, i) => ({ label: s.project.name, hours: s.revenue, colorIndex: i }))} />
                </div>
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>Jahresumsatz</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div className="stat-card">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gesamtumsatz</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>{allTimeSummary.totalRevenue.toFixed(0)} EUR</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gesamtstunden</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>{allTimeSummary.totalHours.toFixed(1)}h</div>
                </div>
              </div>
              {allTimeSummary.projectStats.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>Umsatz pro Aufgabe (gesamt)</h3>
                  <BarChart data={allTimeSummary.projectStats.map((s, i) => ({ label: s.project.name, hours: s.revenue, colorIndex: i }))} />
                </div>
              )}
            </div>
          </div>
        )}

        {!employeeMode && activeTab === 'expenses' && (
          <ExpensesSection workspaceId={workspaceId} t={t} locale={dateLocale(lang)} eurFmt={eurFmt} />
        )}

        {!employeeMode && activeTab === 'customers' && <CustomersSection workspaceId={workspaceId} t={t} />}

        {!employeeMode && activeTab === 'quotes' && (
          <QuotesSection workspaceId={workspaceId} t={t} locale={dateLocale(lang)} eurFmt={eurFmt} />
        )}
      </main>
    </div>
  );
}
