
import React, { useState, useEffect, useCallback } from 'react';
import { dbService } from './services/db';
import { generateDailyInsight } from './services/geminiService';
import { Note, Habit, AppView, AIInsight } from './types';
import { 
  PencilSquareIcon, 
  CheckCircleIcon, 
  SparklesIcon, 
  Cog6ToothIcon,
  WifiIcon,
  SignalSlashIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIInsight | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Note creation state
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    loadData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  const loadData = async () => {
    await dbService.init();
    const [fetchedNotes, fetchedHabits] = await Promise.all([
      dbService.getAllNotes(),
      dbService.getAllHabits()
    ]);
    setNotes(fetchedNotes.sort((a, b) => b.createdAt - a.createdAt));
    setHabits(fetchedHabits);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    
    const note: Note = {
      id: crypto.randomUUID(),
      title: newNoteTitle,
      content: newNoteContent,
      createdAt: Date.now(),
      synced: isOnline
    };

    await dbService.saveNote(note);
    setNotes([note, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const handleDeleteNote = async (id: string) => {
    await dbService.deleteNote(id);
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleToggleHabit = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newHabits = habits.map(h => {
      if (h.id === habitId) {
        const completed = h.completedDays.includes(today);
        const nextDays = completed 
          ? h.completedDays.filter(d => d !== today)
          : [...h.completedDays, today];
        
        return { ...h, completedDays: nextDays, streak: nextDays.length };
      }
      return h;
    });
    
    const updated = newHabits.find(h => h.id === habitId);
    if (updated) await dbService.saveHabit(updated);
    setHabits(newHabits);
  };

  const createHabit = async () => {
    const name = prompt("Enter habit name:");
    if (!name) return;
    const habit: Habit = {
      id: crypto.randomUUID(),
      name,
      completedDays: [],
      streak: 0
    };
    await dbService.saveHabit(habit);
    setHabits([...habits, habit]);
  };

  const getAIInsights = async () => {
    if (!isOnline) {
      alert("AI insights require an internet connection.");
      return;
    }
    setLoading(true);
    try {
      const insight = await generateDailyInsight(notes);
      setAiResult(insight);
    } catch (err) {
      console.error(err);
      alert("Failed to generate insights.");
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') setInstallPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Top Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div>
          <h1 className="text-xl font-bold text-indigo-600">ZenMind</h1>
          <p className="text-xs text-gray-400">PWA Journaling</p>
        </div>
        <div className="flex items-center gap-4">
          {installPrompt && (
            <button 
              onClick={handleInstall}
              className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium"
            >
              Install App
            </button>
          )}
          <div className="flex items-center gap-1">
            {isOnline ? (
              <WifiIcon className="h-5 w-5 text-green-500" />
            ) : (
              <SignalSlashIcon className="h-5 w-5 text-red-400" />
            )}
            <span className={`text-[10px] uppercase font-bold ${isOnline ? 'text-green-500' : 'text-red-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full">
        {view === 'notes' && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <form onSubmit={handleAddNote} className="bg-white rounded-2xl shadow-sm border p-4 space-y-3">
              <input 
                type="text" 
                placeholder="Entry Title..." 
                className="w-full text-lg font-semibold focus:outline-none"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
              />
              <textarea 
                placeholder="How are you feeling today?" 
                rows={3}
                className="w-full text-gray-600 focus:outline-none resize-none"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
              />
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="bg-indigo-600 text-white rounded-xl p-2 hover:bg-indigo-700 transition"
                >
                  <PlusIcon className="h-6 w-6" />
                </button>
              </div>
            </form>

            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Recent Entries</h2>
              {notes.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <PencilSquareIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Your journey begins with a single note.</p>
                </div>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="bg-white p-5 rounded-2xl border shadow-sm relative group">
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <div className="text-xs text-indigo-400 font-medium mb-1">
                      {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{note.title}</h3>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {view === 'habits' && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Habit Tracker</h2>
              <button 
                onClick={createHabit}
                className="bg-indigo-50 text-indigo-600 p-2 rounded-xl"
              >
                <PlusIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {habits.map(habit => {
                const isCompletedToday = habit.completedDays.includes(new Date().toISOString().split('T')[0]);
                return (
                  <div key={habit.id} className="bg-white p-4 rounded-2xl border flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800">{habit.name}</h3>
                      <p className="text-xs text-indigo-500 font-medium">🔥 {habit.streak} day streak</p>
                    </div>
                    <button 
                      onClick={() => handleToggleHabit(habit.id)}
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition ${
                        isCompletedToday ? 'bg-indigo-600 text-white' : 'border-2 border-indigo-100 text-indigo-200'
                      }`}
                    >
                      <CheckCircleIcon className="h-6 w-6" />
                    </button>
                  </div>
                );
              })}
              {habits.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                   <p>Track your daily wins.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {view === 'ai' && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white text-center shadow-lg">
              <SparklesIcon className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl font-bold mb-2">AI Daily Reflection</h2>
              <p className="text-indigo-100 text-sm mb-6">Let Gemini analyze your journal and provide personalized growth insights.</p>
              <button 
                onClick={getAIInsights}
                disabled={loading || !isOnline}
                className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-bold shadow-sm hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                {loading ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : <SparklesIcon className="h-5 w-5" />}
                {loading ? 'Analyzing...' : 'Generate Insights'}
              </button>
            </div>

            {aiResult && (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Reflective Summary</h3>
                  <p className="text-gray-700 leading-relaxed italic">"{aiResult.summary}"</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {aiResult.suggestions.map((suggestion, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border flex gap-4 items-start">
                      <div className="bg-indigo-100 text-indigo-600 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-600 font-medium">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {view === 'settings' && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-gray-800">Settings</h2>
            <div className="bg-white rounded-2xl border overflow-hidden">
               <div className="p-4 border-b flex justify-between items-center">
                  <span>Push Notifications</span>
                  <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
               </div>
               <div className="p-4 border-b flex justify-between items-center">
                  <span>Dark Mode</span>
                  <div className="w-10 h-5 bg-gray-200 rounded-full relative">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
               </div>
               <div className="p-4 flex justify-between items-center">
                  <span>Cloud Sync</span>
                  <span className="text-xs font-bold text-indigo-600">PREMIUM</span>
               </div>
            </div>
            <div className="bg-indigo-50 p-6 rounded-2xl text-center">
              <h3 className="font-bold text-indigo-800 mb-1">Local Data Powered</h3>
              <p className="text-indigo-600 text-xs">Your data is stored securely on this device using IndexedDB. No server needed for core features.</p>
            </div>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-t fixed bottom-0 left-0 right-0 flex justify-around items-center safe-bottom h-16 z-40">
        <button 
          onClick={() => setView('notes')}
          className={`flex flex-col items-center gap-1 transition ${view === 'notes' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <PencilSquareIcon className="h-6 w-6" />
          <span className="text-[10px] font-bold">Journal</span>
        </button>
        <button 
          onClick={() => setView('habits')}
          className={`flex flex-col items-center gap-1 transition ${view === 'habits' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <CheckCircleIcon className="h-6 w-6" />
          <span className="text-[10px] font-bold">Habits</span>
        </button>
        <button 
          onClick={() => setView('ai')}
          className={`flex flex-col items-center gap-1 transition ${view === 'ai' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <SparklesIcon className="h-6 w-6" />
          <span className="text-[10px] font-bold">AI Insight</span>
        </button>
        <button 
          onClick={() => setView('settings')}
          className={`flex flex-col items-center gap-1 transition ${view === 'settings' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <Cog6ToothIcon className="h-6 w-6" />
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
