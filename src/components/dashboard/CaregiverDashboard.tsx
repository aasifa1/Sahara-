import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Brain, 
  CheckCircle2, 
  Clock, 
  Download, 
  FileText, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  User, 
  Wifi, 
  WifiOff, 
  Heart, 
  Bell, 
  Calendar,
  Pill,
  Printer,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { CaregiverAlert, CognitiveProfile, GameSession, MoodEntry, ReminderItem, DailyJournalEntry, VoiceMessage } from '../../types';
import { playSoothingChime } from '../../utils/sound';

interface CaregiverDashboardProps {
  reminders: ReminderItem[];
  alerts: CaregiverAlert[];
  cognitiveProfile: CognitiveProfile;
  gameSessions: GameSession[];
  moodHistory: MoodEntry[];
  unsyncedCount: number;
  isOnline: boolean;
  dailyJournals?: DailyJournalEntry[];
  voiceMessages?: VoiceMessage[];
  onResolveAlert: (id: string) => void;
  onAddReminder: (reminder: ReminderItem) => void;
  onForceSync: () => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  reminders,
  alerts,
  cognitiveProfile,
  gameSessions,
  moodHistory,
  unsyncedCount,
  isOnline,
  dailyJournals = [],
  voiceMessages = [],
  onResolveAlert,
  onAddReminder,
  onForceSync,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'journals' | 'reminders' | 'alerts' | 'report'>('overview');
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);

  // New reminder form
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('02:00 PM');
  const [newDetail, setNewDetail] = useState('');
  const [newType, setNewType] = useState<ReminderItem['type']>('medicine');

  const completedReminders = reminders.filter((r) => r.isCompleted).length;
  const adherenceRate = reminders.length > 0 ? Math.round((completedReminders / reminders.length) * 100) : 0;
  const latestMood = moodHistory.length > 0 ? moodHistory[moodHistory.length - 1] : null;

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: ReminderItem = {
      id: `rem-${Date.now()}`,
      title: newTitle,
      type: newType,
      time: newTime,
      dosageOrDetail: newDetail || 'Scheduled care reminder',
      isCompleted: false,
      synced: false,
      audioPrompt: `Please remember: ${newTitle}. ${newDetail}`,
    };

    onAddReminder(item);
    setShowAddReminderModal(false);
    setNewTitle('');
    setNewDetail('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="caregiver-clinician-dashboard" className="space-y-6">
      {/* Top Patient Profile & Status Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#E2D8C6] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#F0EAE1]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#3B7A57] text-white flex items-center justify-center font-bold text-2xl font-['Outfit'] shadow-sm shrink-0">
              KD
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-[#2C2724] font-['Outfit']">
                  Bhaben Kalita (ককাদেউতা)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  Mild Cognitive Impairment (MCI)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#73665A] mt-0.5">
                Age: 79 • Location: Guwahati, Assam • Primary Caregiver: Vikram Kalita (Son)
              </p>
            </div>
          </div>

          {/* Sync & Healthcare Badge */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6EE] border border-[#E4DAC7] text-xs font-semibold text-[#54483E]">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-emerald-600" />
                  <span>Cloud Synced</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-amber-600" />
                  <span>Offline ({unsyncedCount} items saved)</span>
                </>
              )}
            </div>

            {unsyncedCount > 0 && (
              <button
                onClick={onForceSync}
                className="px-3 py-1.5 bg-[#3B7A57] hover:bg-[#2F6346] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Sync All Telemetry
              </button>
            )}
          </div>
        </div>

        {/* 4 Clinical Health Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-5">
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EADBCC]">
            <div className="flex items-center justify-between text-xs font-semibold text-[#73675E] mb-1">
              <span>Memory Index</span>
              <Brain className="w-4 h-4 text-[#3B7A57]" />
            </div>
            <div className="text-2xl font-black text-[#2C2724]">
              {cognitiveProfile.memoryIndex}%
            </div>
            <span className="text-[11px] text-emerald-700 font-bold">
              Stable (+3% this week)
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EADBCC]">
            <div className="flex items-center justify-between text-xs font-semibold text-[#73675E] mb-1">
              <span>Routine Adherence</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-[#2C2724]">
              {adherenceRate}%
            </div>
            <span className="text-[11px] text-[#6E645D]">
              {completedReminders}/{reminders.length} tasks completed
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EADBCC]">
            <div className="flex items-center justify-between text-xs font-semibold text-[#73675E] mb-1">
              <span>Avg Reaction Time</span>
              <Clock className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-[#2C2724]">
              {(cognitiveProfile.recallSpeedMs / 1000).toFixed(1)}s
            </div>
            <span className="text-[11px] text-emerald-700 font-bold">
              Comfortable pacing
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EADBCC]">
            <div className="flex items-center justify-between text-xs font-semibold text-[#73675E] mb-1">
              <span>Latest Logged Mood</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-[#2C2724] capitalize">
              {latestMood ? latestMood.mood : 'Peaceful'}
            </div>
            <span className="text-[11px] text-[#6E645D]">
              Reported today
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E2D8C6] pb-1 overflow-x-auto text-xs sm:text-sm font-bold">
        {[
          { id: 'overview', label: 'AI Insights & Status', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'trends', label: 'Cognitive Trajectory', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'journals', label: `Voice Journals & Mental Health (${dailyJournals.length})`, icon: <BookOpen className="w-4 h-4" /> },
          { id: 'reminders', label: 'Care Schedule Manager', icon: <Clock className="w-4 h-4" /> },
          { id: 'alerts', label: `Alerts (${alerts.filter(a => !a.isResolved).length})`, icon: <Bell className="w-4 h-4" /> },
          { id: 'report', label: 'Clinical Export (PDF)', icon: <Printer className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playSoothingChime('tap');
              setActiveTab(tab.id as any);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white border-t border-x border-[#E2D8C6] text-[#3B7A57] font-extrabold shadow-2xs'
                : 'text-[#6C5F53] hover:text-[#2C2724]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & EXPLAINABLE AI */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Explainable AI Observations */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-[#E2D8C6] shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#2C2724] font-['Outfit']">
                  AI Cognitive Personalization & Clinician Insights
                </h3>
                <p className="text-xs text-[#7A6E63]">
                  Explainable pattern analysis based on recent gaming sessions and daily cares
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {cognitiveProfile.aiObservations.map((obs, idx) => (
                <div 
                  key={idx} 
                  className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#EADBCC] flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-[#3B7A57] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-[#382E25] leading-relaxed">
                    {obs}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                  Adaptive Engine Recommendation
                </span>
                <p className="text-xs sm:text-sm font-semibold">
                  Pacing Level: <strong>Gentle (Level 1 / 4 Cards)</strong> to avoid sensory fatigue during morning hours.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shrink-0">
                Active
              </span>
            </div>
          </div>

          {/* Right: Recent Game Sessions */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-[#E2D8C6] shadow-xs space-y-4">
            <h3 className="text-lg font-black text-[#2C2724] font-['Outfit']">
              Recent Stimulation Exercises
            </h3>

            <div className="space-y-2.5">
              {gameSessions.slice(-4).reverse().map((s) => (
                <div 
                  key={s.id}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] flex items-center justify-between text-xs sm:text-sm"
                >
                  <div>
                    <div className="font-bold text-[#2C2724] capitalize">
                      {s.gameType.replace('_', ' ')}
                    </div>
                    <span className="text-[11px] text-[#786D61]">
                      {s.notes || `Level ${s.difficulty} • ${s.moves} moves`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-900 text-xs">
                      {s.accuracy}% Accuracy
                    </span>
                    <span className="block text-[10px] text-[#8C8074] mt-0.5">
                      {(s.reactionTimeMs / 1000).toFixed(1)}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COGNITIVE TRAJECTORY & TRENDS */}
      {activeTab === 'trends' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2D8C6] shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-black text-[#2C2724] font-['Outfit']">
              Weekly Cognitive & Adherence Trajectory
            </h3>
            <p className="text-xs sm:text-sm text-[#73675E]">
              Tracks longitudinal memory retention and medication completion over the past 7 days
            </p>
          </div>

          {/* Graphical Bars */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end pt-6 pb-2 border-b border-[#F0EAE1] min-h-[220px]">
            {cognitiveProfile.weeklyTrend.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[11px] font-bold text-[#3B7A57]">
                  {day.memory}%
                </span>
                <div className="w-full max-w-[40px] bg-[#ECE4D4] rounded-t-xl overflow-hidden flex flex-col justify-end h-36">
                  <div 
                    className="bg-[#3B7A57] w-full rounded-t-xl transition-all"
                    style={{ height: `${day.memory}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[#574C42]">
                  {day.day}
                </span>
              </div>
            ))}
          </div>

          {/* Table Breakdown */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF7F2] text-[#63564B] font-bold border-b border-[#E8DFC8]">
                <tr>
                  <th className="p-3">Day</th>
                  <th className="p-3">Memory Index</th>
                  <th className="p-3">Avg Reaction</th>
                  <th className="p-3">Routine Adherence</th>
                  <th className="p-3">Clinical Evaluation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EAE1]">
                {cognitiveProfile.weeklyTrend.map((row) => (
                  <tr key={row.day} className="hover:bg-[#FAF8F5]">
                    <td className="p-3 font-bold text-[#2C2724]">{row.day}</td>
                    <td className="p-3 text-emerald-800 font-extrabold">{row.memory}%</td>
                    <td className="p-3 text-[#5A4F44]">{(row.reactionMs / 1000).toFixed(1)}s</td>
                    <td className="p-3 font-semibold">{row.routineAdherence}%</td>
                    <td className="p-3 text-xs text-[#6C5E53]">
                      {row.memory >= 80 ? 'Optimal engagement' : 'Normal mild variation'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: DAILY VOICE JOURNALS & MENTAL HEALTH FOLLOW-UP */}
      {activeTab === 'journals' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2D8C6] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EAE1]">
            <div>
              <h3 className="text-lg font-black text-[#2C2724] font-['Outfit'] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-700" />
                <span>Patient Daily Voice Journals & Mental Health Telemetry</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#73675E]">
                Voice-dictated evening reflections, detected activities, psychological mood indicators, and follow-up notes for caregivers
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold self-start sm:self-auto">
              {dailyJournals.length} Logged Entries
            </span>
          </div>

          {/* Quick Mental Health Summary Card for Caregivers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EADBCC]">
              <span className="text-xs font-bold text-[#73675E] block mb-1">Overall Emotional Wellbeing</span>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                <span className="text-lg font-black text-[#2C2724] capitalize">
                  {dailyJournals.length > 0 ? dailyJournals[0].mood : (latestMood ? latestMood.mood : 'Peaceful')}
                </span>
              </div>
              <p className="text-[11px] text-[#6E645D] mt-1">Based on patient evening voice expressions</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EADBCC]">
              <span className="text-xs font-bold text-[#73675E] block mb-1">Caregiver Action Status</span>
              <div className="flex items-center gap-2">
                {dailyJournals.some(j => j.mentalHealthStatus === 'needs_attention') ? (
                  <>
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span className="text-base font-extrabold text-amber-700">Follow-up Recommended</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-base font-extrabold text-emerald-800">Stable & Comforted</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-[#6E645D] mt-1">Monitored continuously by Sahara AI</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EADBCC]">
              <span className="text-xs font-bold text-[#73675E] block mb-1">Conversational AI Memory</span>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#3B7A57]" />
                <span className="text-lg font-black text-[#2C2724]">
                  {voiceMessages.length} Messages
                </span>
              </div>
              <p className="text-[11px] text-[#6E645D] mt-1">All personal dialogues retained securely</p>
            </div>
          </div>

          {/* List of Journal Entries */}
          <div className="space-y-3 pt-2">
            <h4 className="font-extrabold text-sm text-[#2C2724]">
              Evening Activity Logs & Caregiver Observations:
            </h4>

            {dailyJournals.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-dashed border-[#DED2BF] text-center space-y-2">
                <BookOpen className="w-8 h-8 text-amber-600 mx-auto opacity-70" />
                <p className="text-sm font-bold text-[#4B3E34]">No voice journals recorded yet today</p>
                <p className="text-xs text-[#7B6E61]">
                  When Bhaben Kalita speaks in the Voice Companion (using Evening Journal mode), their dictations, activities, and psychological mood signals will automatically reflect here for caregiver follow-up.
                </p>
              </div>
            ) : (
              dailyJournals.map((entry) => (
                <div 
                  key={entry.id}
                  className="p-4 rounded-2xl border border-[#E8DFC8] bg-[#FFFDF9] hover:bg-[#FAF7F2] transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EAE1] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        {entry.date}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        Logged at {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                        entry.mentalHealthStatus === 'needs_attention'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        Mood: {entry.mood} • {entry.mentalHealthStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-gray-500 block mb-1">
                      Patient Voice Recording Transcript:
                    </span>
                    <p className="text-xs sm:text-sm italic text-[#302720] bg-white p-3 rounded-xl border border-[#EBE1D0]">
                      "{entry.audioTranscript}"
                    </p>
                  </div>

                  {entry.activities && entry.activities.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-gray-500">Activities Detected:</span>
                      {entry.activities.map((act, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#FAF5EA] border border-[#E4D8C5] text-[11px] font-semibold text-[#483B30]"
                        >
                          {act}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-emerald-950">
                    <strong className="block text-emerald-800 font-bold mb-0.5">
                      Caregiver Mental Health Follow-Up Note:
                    </strong>
                    <span>{entry.caregiverNotes}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recent Voice Conversations Feed */}
          <div className="pt-4 border-t border-[#F0EAE1] space-y-3">
            <h4 className="font-extrabold text-sm text-[#2C2724] flex items-center justify-between">
              <span>Recent Voice Assistant Interactions ({voiceMessages.length})</span>
              <span className="text-xs font-normal text-[#75685B]">Available for Caregiver Review</span>
            </h4>

            <div className="max-h-60 overflow-y-auto space-y-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#EADBCC]">
              {voiceMessages.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No voice assistant chats recorded yet.</p>
              ) : (
                voiceMessages.slice(-10).map((msg) => (
                  <div 
                    key={msg.id}
                    className={`p-2.5 rounded-xl text-xs sm:text-sm ${
                      msg.sender === 'user'
                        ? 'bg-white border border-[#E2D8C6] ml-6'
                        : 'bg-emerald-50 border border-emerald-200 mr-6 text-emerald-950'
                    }`}
                  >
                    <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-0.5">
                      <span>{msg.sender === 'user' ? 'Bhaben Kalita (Patient)' : 'Sahara Voice Agent'}</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REMINDERS SCHEDULER */}
      {activeTab === 'reminders' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2D8C6] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-[#2C2724] font-['Outfit']">
                Schedule & Medications Configurator
              </h3>
              <p className="text-xs sm:text-sm text-[#73675E]">
                Add or modify care routines, dosage, and audio prompts for elderly voice reminders
              </p>
            </div>
            <button
              onClick={() => setShowAddReminderModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B7A57] hover:bg-[#2F6346] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Reminder</span>
            </button>
          </div>

          <div className="divide-y divide-[#F0EAE1]">
            {reminders.map((r) => (
              <div key={r.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2C2724]">
                      {r.title}
                    </h4>
                    <p className="text-xs text-[#6E645D]">
                      {r.dosageOrDetail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#ECE4D4] text-[#554A41]">
                    {r.time}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    r.isCompleted ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {r.isCompleted ? 'Done' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ALERT CENTER */}
      {activeTab === 'alerts' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2D8C6] shadow-xs space-y-4">
          <h3 className="text-lg font-black text-[#2C2724] font-['Outfit']">
            Patient Safety & Anomaly Alert Center
          </h3>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  alert.severity === 'red'
                    ? 'bg-rose-50 border-rose-300 text-rose-950'
                    : alert.severity === 'amber'
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                    alert.severity === 'red' ? 'text-rose-600' : alert.severity === 'amber' ? 'text-amber-600' : 'text-emerald-600'
                  }`} />
                  <div>
                    <div className="font-bold text-sm">
                      {alert.message}
                    </div>
                    <span className="text-xs opacity-75">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Patient: {alert.patientName}
                    </span>
                  </div>
                </div>

                {!alert.isResolved && (
                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-xs font-bold text-gray-800 hover:bg-gray-50 shadow-2xs cursor-pointer shrink-0"
                  >
                    Acknowledge & Clear
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ASHA CLINICAL REPORT (PRINTABLE) */}
      {activeTab === 'report' && (
        <div id="clinical-report-printable" className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2D8C6] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2D8C6]">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#3B7A57]">
                Ministry of Development of North Eastern Region (MDoNER)
              </span>
              <h2 className="text-2xl font-black text-[#1E1B18] font-['Outfit']">
                Weekly Cognitive & Health Monitoring Summary
              </h2>
              <p className="text-xs text-[#73675E]">
                Report prepared for ASHA Healthcare Worker & Neurological Consultant review
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B7A57] text-white text-xs font-bold hover:bg-[#2F6346] shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#FAF7F2] text-xs">
            <div>
              <span className="text-gray-500 block">Patient Name</span>
              <strong className="text-sm">Bhaben Kalita</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Age / Gender</span>
              <strong className="text-sm">79 Y / Male</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Weekly Memory Avg</span>
              <strong className="text-sm text-emerald-800">82.4%</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Medicine Adherence</span>
              <strong className="text-sm text-emerald-800">92% Completed</strong>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-[#2C2724]">
              Clinical Observations & Progression Summary:
            </h4>
            <p className="text-xs sm:text-sm text-[#54483E] leading-relaxed">
              Patient actively engaged in cultural memory matching with NER symbols (Kaziranga Rhino, Majuli Mukha). Reaction time averages 1.4 seconds with minimal hesitation. Reality orientation cues are reviewed daily. Medication adherence remains steady with family caregiver support.
            </p>
          </div>

          <div className="pt-4 border-t border-[#F0EAE1] flex justify-between items-end text-xs text-gray-500">
            <div>
              <span>Generated by: Sahara Digital Companion v1.0</span>
              <p>Platform: MedTech / BioTech • Government of India</p>
            </div>
            <div className="text-right">
              <span className="block border-t border-gray-400 w-36 pt-1">
                ASHA Worker Signature
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add Reminder Modal */}
      {showAddReminderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E0D4BE] shadow-xl space-y-4">
            <h3 className="font-extrabold text-lg text-[#2C2724]">
              Add Care Reminder
            </h3>

            <form onSubmit={handleCreateReminder} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-[#4F4439] mb-1">
                  Reminder Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evening Herbal Green Tea"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#D9CEB8] bg-[#FAF7F2] focus:outline-none focus:border-[#3B7A57]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#4F4439] mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    placeholder="04:30 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#D9CEB8] bg-[#FAF7F2] focus:outline-none focus:border-[#3B7A57]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#4F4439] mb-1">
                    Category
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-[#D9CEB8] bg-[#FAF7F2] focus:outline-none focus:border-[#3B7A57]"
                  >
                    <option value="medicine">Medicine</option>
                    <option value="hydration">Hydration</option>
                    <option value="meal">Meal / Tea</option>
                    <option value="activity">Gentle Walk</option>
                    <option value="appointment">Doctor Visit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#4F4439] mb-1">
                  Dosage / Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 cup with warm ginger slice"
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#D9CEB8] bg-[#FAF7F2] focus:outline-none focus:border-[#3B7A57]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddReminderModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#3B7A57] text-white font-bold hover:bg-[#2F6346]"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
