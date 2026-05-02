'use client';

import { useState, useEffect } from 'react';
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
  Project,
  TimeEntry
} from './lib/storage';

export default function Home() {
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

  const [year, month] = reportMonth.split('-').map(Number);
  const summary = getMonthlySummary(year, month - 1);

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Time Tracker</h1>
        <p className="text-gray-400">Erfasse deine Arbeitszeit</p>
      </header>

      {/* Navigation */}
      <nav className="flex gap-2 mb-8 bg-[#1e293b] p-1.5 rounded-xl">
        {[
          { key: 'timer', label: 'Timer' },
          { key: 'projects', label: 'Projekte' },
          { key: 'reports', label: 'Auswertung' },
          { key: 'settings', label: 'Einstellungen' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-[#3b82f6] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#334155]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Timer Tab */}
      {activeTab === 'timer' && (
        <div className="space-y-6">
          <div className="bg-[#1e293b] rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Neuer Zeiteintrag</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Projekt</label>
                <select
                  value={newEntry.project_id}
                  onChange={e => setNewEntry({ ...newEntry, project_id: Number(e.target.value) })}
                  className="w-full"
                >
                  <option value={0}>Projekt waehlen...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Datum</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={e => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Stunden</label>
                <input
                  type="number"
                  step="0.25"
                  placeholder="z.B. 2.5"
                  value={newEntry.hours}
                  onChange={e => setNewEntry({ ...newEntry, hours: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Beschreibung (optional)</label>
                <input
                  type="text"
                  placeholder="Was wurde gemacht?"
                  value={newEntry.description}
                  onChange={e => setNewEntry({ ...newEntry, description: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
            <button
              onClick={handleAddEntry}
              disabled={!newEntry.project_id || !newEntry.hours}
              className="mt-4 w-full bg-[#3b82f6] text-white py-3 rounded-lg font-medium hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Eintrag speichern
            </button>
          </div>

          {/* Recent Entries */}
          <div className="bg-[#1e293b] rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Letzte Eintraege</h2>
            {entries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Noch keine Eintraege vorhanden</p>
            ) : (
              <div className="space-y-2">
                {[...entries].reverse().slice(0, 10).map(entry => {
                  const project = projects.find(p => p.id === entry.project_id);
                  return (
                    <div key={entry.id} className="flex items-center justify-between bg-[#0f172a] rounded-lg p-3">
                      <div>
                        <span className="font-medium">{project?.name || 'Unbekannt'}</span>
                        <span className="text-gray-400 text-sm ml-3">{entry.date}</span>
                        {entry.description && (
                          <p className="text-gray-500 text-sm mt-0.5">{entry.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[#3b82f6] font-semibold">{entry.hours}h</span>
                        <span className="text-gray-400 text-sm">
                          {(entry.hours * settings.hourly_rate).toFixed(2)} EUR
                        </span>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
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
        <div className="bg-[#1e293b] rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Projekte verwalten</h2>
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Neues Projekt..."
              value={newProject}
              onChange={e => setNewProject(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddProject()}
              className="flex-1"
            />
            <button
              onClick={handleAddProject}
              disabled={!newProject.trim()}
              className="bg-[#3b82f6] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#2563eb] disabled:opacity-50"
            >
              Hinzufuegen
            </button>
          </div>
          <div className="space-y-2">
            {projects.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Noch keine Projekte</p>
            ) : (
              projects.map(project => {
                const projectHours = entries
                  .filter(e => e.project_id === project.id)
                  .reduce((sum, e) => sum + e.hours, 0);
                return (
                  <div key={project.id} className="flex items-center justify-between bg-[#0f172a] rounded-lg p-4">
                    <div>
                      <span className="font-medium">{project.name}</span>
                      <span className="text-gray-400 text-sm ml-3">
                        {projectHours.toFixed(1)}h gesamt
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
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
        <div className="space-y-6">
          <div className="bg-[#1e293b] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Monatsauswertung</h2>
              <input
                type="month"
                value={reportMonth}
                onChange={e => setReportMonth(e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-[#0f172a] rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">Gesamtstunden</p>
                <p className="text-2xl font-bold text-[#3b82f6]">{summary.totalHours.toFixed(1)}h</p>
              </div>
              <div className="bg-[#0f172a] rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">Umsatz</p>
                <p className="text-2xl font-bold text-green-400">{summary.totalRevenue.toFixed(0)} EUR</p>
              </div>
              <div className="bg-[#0f172a] rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">Eintraege</p>
                <p className="text-2xl font-bold text-white">{summary.entryCount}</p>
              </div>
            </div>
            {summary.projectStats.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Keine Eintraege in diesem Monat</p>
            ) : (
              <div className="space-y-3">
                {summary.projectStats.map(stat => (
                  <div key={stat.project.id} className="bg-[#0f172a] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{stat.project.name}</span>
                      <span className="text-[#3b82f6] font-semibold">{stat.totalHours.toFixed(1)}h</span>
                    </div>
                    <div className="w-full bg-[#334155] rounded-full h-2 mb-2">
                      <div
                        className="bg-[#3b82f6] h-2 rounded-full transition-all"
                        style={{
                          width: `${summary.totalHours > 0 ? (stat.totalHours / summary.totalHours) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {summary.totalHours > 0 ? ((stat.totalHours / summary.totalHours) * 100).toFixed(0) : 0}% der Zeit
                      </span>
                      <span className="text-green-400">
                        {stat.revenue.toFixed(0)} EUR
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-[#1e293b] rounded-2xl p-6 max-w-md">
          <h2 className="text-lg font-semibold mb-4">Einstellungen</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Stundensatz (EUR)
              </label>
              <input
                type="number"
                value={settings.hourly_rate}
                onChange={e => setSettings({ ...settings, hourly_rate: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <button
              onClick={handleUpdateSettings}
              className="w-full bg-[#3b82f6] text-white py-3 rounded-lg font-medium hover:bg-[#2563eb]"
            >
              Speichern
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
