import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Brain, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Smile, 
  AlertTriangle, 
  Mic, 
  Calendar,
  Layers,
  HeartHandshake,
  Eye,
  Volume2
} from 'lucide-react';
import { 
  CaregiverAlert, 
  CognitiveProfile, 
  GameSession, 
  MoodEntry, 
  MoodLevel, 
  RegionalLanguage, 
  ReminderItem, 
  TextScale, 
  UserRole,
  MemoryContent
} from './types';
import { 
  INITIAL_MEMORIES, 
  INITIAL_REMINDERS, 
  UI_TRANSLATIONS 
} from './data/culturalContent';
import { Navbar } from './components/Navbar';
import { OrientationBanner } from './components/OrientationBanner';
import { RemindersList } from './components/RemindersList';
import { MindGamesHub } from './components/games/MindGamesHub';
import { MemoryCompanion } from './components/MemoryCompanion';
import { MoodCheckin } from './components/MoodCheckin';
import { SosModal } from './components/SosModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { CaregiverDashboard } from './components/dashboard/CaregiverDashboard';
import { playSoothingChime } from './utils/sound';

export function App() {
  // User & Accessibility State
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [language, setLanguage] = useState<RegionalLanguage>('as'); // Default to Assamese for NER
  const [textScale, setTextScale] = useState<TextScale>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Modals
  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);

  // Elderly Active Tab
  const [activePatientTab, setActivePatientTab] = useState<'routine' | 'games' | 'memories' | 'mood'>('routine');

  // Core Persistent State
  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    try {
      const saved = localStorage.getItem('sahara_reminders');
      return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  });

  const [memories, setMemories] = useState<MemoryContent[]>(() => {
    try {
      const saved = localStorage.getItem('sahara_memories');
      return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
    } catch {
      return INITIAL_MEMORIES;
    }
  });

  const [gameSessions, setGameSessions] = useState<GameSession[]>(() => {
    try {
      const saved = localStorage.getItem('sahara_sessions');
      return saved ? JSON.parse(saved) : [
        {
          id: 'init-1',
          gameType: 'memory_match',
          difficulty: 1,
          moves: 3,
          accuracy: 88,
          reactionTimeMs: 1420,
          completedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          synced: true,
          notes: 'Matched 2 cultural pairs smoothly in morning',
        }
      ];
    } catch {
      return [];
    }
  });

  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(() => {
    try {
      const saved = localStorage.getItem('sahara_moods');
      return saved ? JSON.parse(saved) : [
        { id: 'm-1', mood: 'peaceful', timestamp: new Date().toISOString(), synced: true }
      ];
    } catch {
      return [];
    }
  });

  const [alerts, setAlerts] = useState<CaregiverAlert[]>(() => {
    try {
      const saved = localStorage.getItem('sahara_alerts');
      return saved ? JSON.parse(saved) : [
        {
          id: 'alt-1',
          patientId: 'pat-1',
          patientName: 'Bhaben Kalita',
          type: 'routine_completed',
          severity: 'green',
          message: 'Morning blood pressure tablet taken on time at 08:15 AM.',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          isResolved: false,
        },
        {
          id: 'alt-2',
          patientId: 'pat-1',
          patientName: 'Bhaben Kalita',
          type: 'missed_medicine',
          severity: 'amber',
          message: 'Mid-morning hydration goal slightly overdue. Sent gentle audio prompt.',
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
          isResolved: false,
        }
      ];
    } catch {
      return [];
    }
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sahara_reminders', JSON.stringify(reminders));
    } catch {}
  }, [reminders]);

  useEffect(() => {
    try {
      localStorage.setItem('sahara_memories', JSON.stringify(memories));
    } catch {}
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem('sahara_sessions', JSON.stringify(gameSessions));
    } catch {}
  }, [gameSessions]);

  useEffect(() => {
    try {
      localStorage.setItem('sahara_moods', JSON.stringify(moodHistory));
    } catch {}
  }, [moodHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('sahara_alerts', JSON.stringify(alerts));
    } catch {}
  }, [alerts]);

  // Compute Unsynced Items Count
  const unsyncedReminders = reminders.filter(r => !r.synced).length;
  const unsyncedSessions = gameSessions.filter(s => !s.synced).length;
  const unsyncedMoods = moodHistory.filter(m => !m.synced).length;
  const totalUnsynced = unsyncedReminders + unsyncedSessions + unsyncedMoods;

  // Background Sync Trigger
  const handleSync = () => {
    playSoothingChime('complete');
    setIsOnline(true);
    setReminders(prev => prev.map(r => ({ ...r, synced: true })));
    setGameSessions(prev => prev.map(s => ({ ...s, synced: true })));
    setMoodHistory(prev => prev.map(m => ({ ...m, synced: true })));
    showToast('✨ Local SQLite cache synchronized with cloud successfully!');
  };

  // Reminders Toggle
  const handleToggleReminder = (id: string) => {
    playSoothingChime('match');
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const nextState = !r.isCompleted;
        if (nextState) {
          showToast(`🌸 Well done! You completed "${r.title}".`);
        }
        return {
          ...r,
          isCompleted: nextState,
          completedAt: nextState ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          synced: isOnline,
        };
      }
      return r;
    }));
  };

  // Game Complete
  const handleGameComplete = (session: GameSession) => {
    setGameSessions(prev => [...prev, { ...session, synced: isOnline }]);
    showToast(`🌸 Heartfelt congratulations! Completed ${session.gameType.replace('_', ' ')}.`);
  };

  // Mood Record
  const handleRecordMood = (mood: MoodLevel) => {
    const entry: MoodEntry = {
      id: `mood-${Date.now()}`,
      mood,
      timestamp: new Date().toISOString(),
      synced: isOnline,
    };
    setMoodHistory(prev => [...prev, entry]);

    if (mood === 'low' || mood === 'tired') {
      const alert: CaregiverAlert = {
        id: `alert-mood-${Date.now()}`,
        patientId: 'pat-1',
        patientName: 'Bhaben Kalita',
        type: 'mood_flag',
        severity: 'amber',
        message: `Patient indicated needing extra comfort/rest (${mood}). Consider calling or dropping by.`,
        timestamp: new Date().toISOString(),
        isResolved: false,
      };
      setAlerts(prev => [alert, ...prev]);
    }
  };

  // Add Reminder from Caregiver
  const handleAddReminder = (reminder: ReminderItem) => {
    setReminders(prev => [reminder, ...prev]);
    showToast(`Added scheduled reminder: ${reminder.title}`);
  };

  // Add Memory from Caregiver
  const handleAddMemory = (memory: MemoryContent) => {
    setMemories(prev => [memory, ...prev]);
    showToast(`Added family moment: ${memory.title}`);
  };

  // Resolve Alert
  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isResolved: true } : a));
    showToast('Alert marked as acknowledged.');
  };

  // Trigger SOS Alert
  const handleTriggerSosAlert = (msg: string) => {
    const alert: CaregiverAlert = {
      id: `sos-${Date.now()}`,
      patientId: 'pat-1',
      patientName: 'Bhaben Kalita',
      type: 'sos_triggered',
      severity: 'red',
      message: msg,
      timestamp: new Date().toISOString(),
      isResolved: false,
    };
    setAlerts(prev => [alert, ...prev]);
    showToast('🚨 SOS assistance call initiated.');
  };

  // Compute Cognitive Profile
  const recentSessions = gameSessions.slice(-10);
  const avgAccuracy = recentSessions.length > 0
    ? Math.round(recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length)
    : 84;
  const avgSpeed = recentSessions.length > 0
    ? Math.round(recentSessions.reduce((sum, s) => sum + s.reactionTimeMs, 0) / recentSessions.length)
    : 1650;

  const cognitiveProfile: CognitiveProfile = {
    overallScore: Math.min(100, Math.round(avgAccuracy * 0.95)),
    memoryIndex: avgAccuracy,
    attentionIndex: 81,
    recallSpeedMs: avgSpeed,
    weeklyTrend: [
      { day: 'Mon', memory: 82, reactionMs: 1720, routineAdherence: 90 },
      { day: 'Tue', memory: 85, reactionMs: 1640, routineAdherence: 85 },
      { day: 'Wed', memory: 80, reactionMs: 1800, routineAdherence: 100 },
      { day: 'Thu', memory: 88, reactionMs: 1510, routineAdherence: 95 },
      { day: 'Fri', memory: 84, reactionMs: 1590, routineAdherence: 90 },
      { day: 'Sat', memory: 86, reactionMs: 1480, routineAdherence: 80 },
      { day: 'Sun', memory: avgAccuracy, reactionMs: avgSpeed, routineAdherence: 90 },
    ],
    aiObservations: [
      'Morning recall performance shows 18% higher consistency when paired with cultural North Eastern symbols (Kaziranga Rhino & Majuli Mukha).',
      'Response reaction pacing averages 1.4s — non-punitive feedback successfully prevents anxiety or task abandonment.',
      'Routine adherence is high (92%); recommended keeping hydration reminders audible with local Assamese voice prompt.',
    ],
    recommendedDifficulty: 1,
    lastSessionDate: recentSessions.length > 0 ? recentSessions[recentSessions.length - 1].completedAt : 'Today',
  };

  const completedCount = reminders.filter(r => r.isCompleted).length;

  return (
    <div className={`min-h-screen transition-colors text-scale-${textScale} ${
      highContrast ? 'bg-[#0F0E0D] text-yellow-100' : 'bg-[#FAF7F2] text-[#2C2724]'
    }`}>
      {/* Navigation Header */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        language={language}
        setLanguage={setLanguage}
        textScale={textScale}
        setTextScale={setTextScale}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        unsyncedCount={totalUnsynced}
        onSync={handleSync}
        onOpenSos={() => setIsSosOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-7 space-y-6">
        {/* CAREGIVER & CLINICIAN VIEW */}
        {currentRole === 'caregiver' ? (
          <CaregiverDashboard
            reminders={reminders}
            alerts={alerts}
            cognitiveProfile={cognitiveProfile}
            gameSessions={gameSessions}
            moodHistory={moodHistory}
            unsyncedCount={totalUnsynced}
            isOnline={isOnline}
            onResolveAlert={handleResolveAlert}
            onAddReminder={handleAddReminder}
            onForceSync={handleSync}
          />
        ) : (
          /* ELDERLY PATIENT COMPANION VIEW */
          <div className="space-y-6">
            {/* Reality Orientation Banner */}
            <OrientationBanner
              language={language}
              highContrast={highContrast}
              completedTasksCount={completedCount}
              totalTasksCount={reminders.length}
            />

            {/* Elderly Friendly 4 Primary Action Cards */}
            <div 
              id="patient-primary-tabs"
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
            >
              <button
                id="tab-routine"
                onClick={() => {
                  playSoothingChime('tap');
                  setActivePatientTab('routine');
                }}
                className={`min-h-[72px] sm:min-h-[88px] p-3 sm:p-4 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                  activePatientTab === 'routine'
                    ? 'bg-white border-[#3B7A57] ring-4 ring-[#3B7A57]/15 shadow-sm font-extrabold'
                    : 'bg-[#FFFDF9] border-[#E2D8C6] hover:border-[#3B7A57]/50 text-[#554A40]'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="text-sm sm:text-base block font-bold leading-tight">
                    Today's Care
                  </span>
                  <span className="text-[11px] text-[#786D62] hidden sm:block">
                    {completedCount}/{reminders.length} Done
                  </span>
                </div>
              </button>

              <button
                id="tab-games"
                onClick={() => {
                  playSoothingChime('tap');
                  setActivePatientTab('games');
                }}
                className={`min-h-[72px] sm:min-h-[88px] p-3 sm:p-4 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                  activePatientTab === 'games'
                    ? 'bg-white border-[#3B7A57] ring-4 ring-[#3B7A57]/15 shadow-sm font-extrabold'
                    : 'bg-[#FFFDF9] border-[#E2D8C6] hover:border-[#3B7A57]/50 text-[#554A40]'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Brain className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="text-sm sm:text-base block font-bold leading-tight">
                    Mind Games
                  </span>
                  <span className="text-[11px] text-[#786D62] hidden sm:block">
                    Cultural Exercises
                  </span>
                </div>
              </button>

              <button
                id="tab-memories"
                onClick={() => {
                  playSoothingChime('tap');
                  setActivePatientTab('memories');
                }}
                className={`min-h-[72px] sm:min-h-[88px] p-3 sm:p-4 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                  activePatientTab === 'memories'
                    ? 'bg-white border-[#3B7A57] ring-4 ring-[#3B7A57]/15 shadow-sm font-extrabold'
                    : 'bg-[#FFFDF9] border-[#E2D8C6] hover:border-[#3B7A57]/50 text-[#554A40]'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <div className="text-left">
                  <span className="text-sm sm:text-base block font-bold leading-tight">
                    Family Album
                  </span>
                  <span className="text-[11px] text-[#786D62] hidden sm:block">
                    Cherished Photos
                  </span>
                </div>
              </button>

              <button
                id="tab-mood"
                onClick={() => {
                  playSoothingChime('tap');
                  setActivePatientTab('mood');
                }}
                className={`min-h-[72px] sm:min-h-[88px] p-3 sm:p-4 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                  activePatientTab === 'mood'
                    ? 'bg-white border-[#3B7A57] ring-4 ring-[#3B7A57]/15 shadow-sm font-extrabold'
                    : 'bg-[#FFFDF9] border-[#E2D8C6] hover:border-[#3B7A57]/50 text-[#554A40]'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <Smile className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="text-sm sm:text-base block font-bold leading-tight">
                    Heart Mood
                  </span>
                  <span className="text-[11px] text-[#786D62] hidden sm:block">
                    Daily Feelings
                  </span>
                </div>
              </button>
            </div>

            {/* TAB CONTENTS */}
            {activePatientTab === 'routine' && (
              <RemindersList
                reminders={reminders}
                language={language}
                highContrast={highContrast}
                onToggleReminder={handleToggleReminder}
              />
            )}

            {activePatientTab === 'games' && (
              <MindGamesHub
                language={language}
                highContrast={highContrast}
                gameSessions={gameSessions}
                onGameComplete={handleGameComplete}
              />
            )}

            {activePatientTab === 'memories' && (
              <MemoryCompanion
                memories={memories}
                language={language}
                highContrast={highContrast}
                onAddMemory={handleAddMemory}
              />
            )}

            {activePatientTab === 'mood' && (
              <MoodCheckin
                language={language}
                highContrast={highContrast}
                onRecordMood={handleRecordMood}
              />
            )}
          </div>
        )}
      </main>

      {/* Emergency SOS Modal */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        language={language}
        onTriggerAlert={handleTriggerSosAlert}
      />

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        language={language}
        onNavigateAction={(action) => {
          if (action === 'routine') setActivePatientTab('routine');
          if (action === 'games') setActivePatientTab('games');
          if (action === 'memories') setActivePatientTab('memories');
          if (action === 'sos') setIsSosOpen(true);
        }}
      />

      {/* Toast Notification Notification */}
      {toastMessage && (
        <div 
          id="sahara-toast"
          className="fixed bottom-5 right-5 z-50 p-4 rounded-2xl bg-[#2C2724] text-white text-xs sm:text-sm font-semibold shadow-xl border border-white/20 animate-in slide-in-from-bottom-5 flex items-center gap-2.5 max-w-md"
        >
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
