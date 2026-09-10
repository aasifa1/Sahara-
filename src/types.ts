// Sahara — Cognitive Companion Data Models & Types

export type UserRole = 'patient' | 'caregiver' | 'clinician';

export type RegionalLanguage = 'en' | 'as' | 'bn' | 'hi' | 'mni';

export interface LanguageInfo {
  code: RegionalLanguage;
  name: string;
  nativeName: string;
  greeting: string;
}

export type TextScale = 'normal' | 'large' | 'xlarge';

export interface CulturalCardItem {
  id: string;
  name: string;
  regionalName: string;
  description: string;
  category: 'wildlife' | 'craft' | 'music' | 'nature' | 'heritage';
  iconName: string;
  color: string;
  imageUrl: string;
  state: string; // NER State (Assam, Meghalaya, Manipur, etc.)
}

export interface GameSession {
  id: string;
  gameType: 
    | 'memory_match' 
    | 'routine_recall' 
    | 'pattern_focus' 
    | 'memory_shopping' 
    | 'what_next' 
    | 'word_match' 
    | 'listen_tap';
  difficulty: 1 | 2 | 3;
  moves: number;
  accuracy: number; // percentage
  reactionTimeMs: number;
  completedAt: string;
  synced: boolean;
  notes?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  regionalTitle?: Record<RegionalLanguage, string>;
  type: 'medicine' | 'hydration' | 'meal' | 'activity' | 'appointment';
  time: string; // e.g. "08:30 AM"
  dosageOrDetail: string;
  isCompleted: boolean;
  completedAt?: string;
  synced: boolean;
  audioPrompt: string;
}

export interface MemoryContent {
  id: string;
  title: string;
  relationship: string;
  yearOrOccasion: string;
  imageUrl: string;
  storyPrompt: string;
  regionalClue: string;
  voiceNoteUrl?: string;
  tags: string[];
}

export type MoodLevel = 'peaceful' | 'happy' | 'calm' | 'tired' | 'low';

export interface MoodEntry {
  id: string;
  mood: MoodLevel;
  timestamp: string;
  synced: boolean;
  note?: string;
}

export interface CaregiverAlert {
  id: string;
  patientId: string;
  patientName: string;
  type: 'missed_medicine' | 'performance_drop' | 'routine_completed' | 'sos_triggered' | 'mood_flag';
  severity: 'green' | 'amber' | 'red';
  message: string;
  timestamp: string;
  isResolved: boolean;
}

export interface CognitiveProfile {
  overallScore: number; // 0-100
  memoryIndex: number; // 0-100
  attentionIndex: number; // 0-100
  recallSpeedMs: number;
  weeklyTrend: { day: string; memory: number; reactionMs: number; routineAdherence: number }[];
  aiObservations: string[];
  recommendedDifficulty: 1 | 2 | 3;
  lastSessionDate: string;
}

export interface VoiceMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language?: string;
  sentiment?: 'positive' | 'neutral' | 'concerned' | 'anxious' | 'peaceful';
}

export interface DailyJournalEntry {
  id: string;
  date: string; // YYYY-MM-DD or readable
  summary: string;
  audioTranscript: string;
  activities: string[];
  mood: MoodLevel;
  mentalHealthStatus: 'stable' | 'positive' | 'needs_attention' | 'low_energy';
  caregiverNotes: string;
  timestamp: string;
}

