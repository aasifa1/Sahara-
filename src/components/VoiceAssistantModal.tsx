import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X, MessageSquare, BookOpen, Send, CheckCircle2, History, RotateCcw, AlertCircle } from 'lucide-react';
import { RegionalLanguage, ReminderItem, DailyJournalEntry, VoiceMessage } from '../types';
import { playSoothingChime, speakText, stopSpeaking } from '../utils/sound';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: RegionalLanguage;
  onNavigateAction: (action: string) => void;
  reminders?: ReminderItem[];
  voiceMessages: VoiceMessage[];
  onSaveVoiceMessage: (message: VoiceMessage) => void;
  dailyJournals: DailyJournalEntry[];
  onSaveDailyJournal: (journal: DailyJournalEntry) => void;
  userContext?: {
    patientName?: string;
    caregiverName?: string;
    latestMood?: string;
  };
}

// Available speech recognition languages to allow user input in any language
const SPEECH_LANG_OPTIONS = [
  { code: 'as-IN', label: 'অসমীয়া (Assamese)', short: 'as' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)', short: 'hi' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)', short: 'bn' },
  { code: 'en-IN', label: 'English (India)', short: 'en' },
  { code: 'en-US', label: 'English (US)', short: 'en' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)', short: 'ta' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)', short: 'te' },
  { code: 'mr-IN', label: 'मराठी (Marathi)', short: 'mr' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)', short: 'gu' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)', short: 'kn' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)', short: 'ml' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)', short: 'pa' },
  { code: 'es-ES', label: 'Español', short: 'es' },
];

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onNavigateAction,
  reminders = [],
  voiceMessages,
  onSaveVoiceMessage,
  onSaveDailyJournal,
  userContext = {
    patientName: 'Bhaben Kalita',
    caregiverName: 'Vikram Kalita',
    latestMood: 'peaceful',
  },
}) => {
  // Mode: regular conversational companion vs. evening daily activities & journal logger
  const [activeMode, setActiveMode] = useState<'chat' | 'journal'>('chat');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [manualText, setManualText] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  // Recognition language: default to user language, but can be switched to any language
  const defaultSpeechCode = 
    language === 'hi' ? 'hi-IN' :
    language === 'bn' ? 'bn-IN' :
    language === 'as' ? 'as-IN' :
    language === 'mni' ? 'hi-IN' : 'en-IN';

  const [selectedSpeechLang, setSelectedSpeechLang] = useState<string>(defaultSpeechCode);

  const [assistantReply, setAssistantReply] = useState<string>(
    'Hello Dada, I am Sahara. I am listening attentively. You can ask me anything or share your day.'
  );

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of conversation if open
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [voiceMessages, showHistory]);

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setInterimText('');
      setManualText('');
      setIsProcessing(false);
      setIsSpeaking(false);
      
      const welcome = activeMode === 'journal'
        ? 'Dada, welcome to your Evening Journal. Speak freely about your day and activities, I am listening to everything.'
        : 'Hello Dada! I remember our conversations. Speak to me in any language, or tap a question below.';
      setAssistantReply(welcome);
    } else {
      stopListening();
      stopSpeaking();
    }
  }, [isOpen, activeMode]);

  // Update speech lang when global language changes
  useEffect(() => {
    const code = 
      language === 'hi' ? 'hi-IN' :
      language === 'bn' ? 'bn-IN' :
      language === 'as' ? 'as-IN' :
      language === 'mni' ? 'hi-IN' : 'en-IN';
    setSelectedSpeechLang(code);
  }, [language]);

  if (!isOpen) return null;

  // Handles executing processed speech command or journal recording
  const handleProcessSpeech = async (spokenText: string) => {
    const cleanText = spokenText.trim();
    if (!cleanText) return;

    setIsProcessing(true);
    setTranscript(cleanText);
    playSoothingChime('tap');

    // Save user's message to persistent database
    const userMsg: VoiceMessage = {
      id: `vm-user-${Date.now()}`,
      sender: 'user',
      text: cleanText,
      timestamp: new Date().toISOString(),
      language: selectedSpeechLang,
    };
    onSaveVoiceMessage(userMsg);

    const isJournal = activeMode === 'journal';

    try {
      const res = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanText,
          language: selectedSpeechLang.split('-')[0] || language,
          isJournalMode: isJournal,
          userContext: {
            ...userContext,
            reminders,
          },
          conversationHistory: voiceMessages.slice(-8),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply || 'I heard you clearly, Dada.';

        setAssistantReply(replyText);

        // Save assistant reply to memory
        const aiMsg: VoiceMessage = {
          id: `vm-ai-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toISOString(),
          language: selectedSpeechLang.split('-')[0] || language,
          sentiment: data.sentiment || 'peaceful',
        };
        onSaveVoiceMessage(aiMsg);

        // If journal mode, save journal entry for patient and caregiver follow-up
        if (isJournal && data.journalAnalysis) {
          const newJournal: DailyJournalEntry = {
            id: `jr-${Date.now()}`,
            date: new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
            summary: data.journalAnalysis.summary || `Logged voice thoughts: "${cleanText.slice(0, 80)}"`,
            audioTranscript: cleanText,
            activities: data.journalAnalysis.activities || ['Evening reflection'],
            mood: data.journalAnalysis.mood || 'peaceful',
            mentalHealthStatus: data.journalAnalysis.mentalHealthStatus || 'stable',
            caregiverNotes: data.journalAnalysis.caregiverNotes || 'Patient completed voice journal reflection.',
            timestamp: new Date().toISOString(),
          };
          onSaveDailyJournal(newJournal);
        }

        // Automatic navigation triggers if requested by patient
        const lower = cleanText.toLowerCase();
        if (lower.includes('medicine') || lower.includes('tablet') || lower.includes('routine')) {
          setTimeout(() => onNavigateAction('routine'), 2500);
        } else if (lower.includes('game') || lower.includes('play') || lower.includes('match')) {
          setTimeout(() => onNavigateAction('games'), 2500);
        } else if (lower.includes('photo') || lower.includes('album') || lower.includes('family')) {
          setTimeout(() => onNavigateAction('memories'), 2500);
        } else if (lower.includes('help') || lower.includes('sos') || lower.includes('call')) {
          setTimeout(() => onNavigateAction('sos'), 1500);
        }

        // Speak back soothingly
        setIsSpeaking(true);
        speakText(replyText, selectedSpeechLang.split('-')[0] || language, () => {
          setIsSpeaking(false);
        });
      } else {
        throw new Error('Fallback required');
      }
    } catch {
      // Local fallback with loving demeanor
      let fallbackReply = `I heard: "${cleanText}". I am always here with you, Dada, and I keep all our memories safe.`;
      const lower = cleanText.toLowerCase();

      if (isJournal) {
        fallbackReply = 'I have recorded your day and feelings into your daily journal, Dada. Sleep peacefully and rest well.';
        const newJournal: DailyJournalEntry = {
          id: `jr-${Date.now()}`,
          date: new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
          summary: `Voice journal: ${cleanText.slice(0, 90)}...`,
          audioTranscript: cleanText,
          activities: ['Evening diary reflection'],
          mood: 'peaceful',
          mentalHealthStatus: 'stable',
          caregiverNotes: 'Patient recorded daily activities via Voice Companion.',
          timestamp: new Date().toISOString(),
        };
        onSaveDailyJournal(newJournal);
      } else if (lower.includes('medicine') || lower.includes('tablet')) {
        fallbackReply = 'Your scheduled care is recorded. Next is lunch hydration and Vitamin B12.';
        onNavigateAction('routine');
      } else if (lower.includes('game')) {
        fallbackReply = 'Opening your Cultural Memory Match game!';
        onNavigateAction('games');
      } else if (lower.includes('sos') || lower.includes('call')) {
        fallbackReply = 'Connecting you with Vikram and Sister Meera.';
        onNavigateAction('sos');
      }

      setAssistantReply(fallbackReply);

      const aiMsg: VoiceMessage = {
        id: `vm-ai-${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toISOString(),
        language: selectedSpeechLang.split('-')[0] || language,
        sentiment: 'peaceful',
      };
      onSaveVoiceMessage(aiMsg);

      setIsSpeaking(true);
      speakText(fallbackReply, selectedSpeechLang.split('-')[0] || language, () => {
        setIsSpeaking(false);
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const stopListening = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      if (accumulatedTranscriptRef.current.trim()) {
        handleProcessSpeech(accumulatedTranscriptRef.current.trim());
        accumulatedTranscriptRef.current = '';
      }
      return;
    }

    // Stop speaking if assistant was currently talking
    stopSpeaking();
    setIsSpeaking(false);

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback for browsers with no speech API
      handleProcessSpeech('What medicine do I need to take next?');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true; // Stay listening patiently while elderly person speaks with pauses
      recognition.interimResults = true;
      recognition.lang = selectedSpeechLang;

      accumulatedTranscriptRef.current = '';
      setInterimText('');

      recognition.onstart = () => {
        setIsListening(true);
        playSoothingChime('tap');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript + ' ';
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (finalChunk) {
          accumulatedTranscriptRef.current += finalChunk;
          setTranscript(accumulatedTranscriptRef.current);
        }
        setInterimText(currentInterim);

        // Reset silence timer: only process once user has completed speaking (pause of 2.2 seconds)
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          const totalUtterance = (accumulatedTranscriptRef.current + ' ' + currentInterim).trim();
          if (totalUtterance.length > 2) {
            stopListening();
            accumulatedTranscriptRef.current = '';
            setInterimText('');
            handleProcessSpeech(totalUtterance);
          }
        }, 2200);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition warning:', event.error);
        if (event.error === 'no-speech') {
          // Keep listening gently or quietly stop
          return;
        }
        stopListening();
      };

      recognition.onend = () => {
        // If still flagged as listening and we haven't processed, restart or wrap up
        if (isListening && accumulatedTranscriptRef.current.trim()) {
          const text = accumulatedTranscriptRef.current.trim();
          accumulatedTranscriptRef.current = '';
          setInterimText('');
          setIsListening(false);
          handleProcessSpeech(text);
        } else {
          setIsListening(false);
        }
      };

      recognition.start();
    } catch {
      stopListening();
      handleProcessSpeech('What medicine do I need to take next?');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    const text = manualText;
    setManualText('');
    handleProcessSpeech(text);
  };

  return (
    <div 
      id="voice-assistant-modal"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
    >
      <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full border border-[#E0D4BE] shadow-2xl space-y-4 text-center relative max-h-[92vh] flex flex-col">
        {/* Header Controls */}
        <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#3B7A57] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h2 className="text-base font-extrabold text-[#2C2724] font-['Outfit'] flex items-center gap-1.5">
                Sahara AI Voice Companion
              </h2>
              <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider block">
                Deep Listening • Personal Memory Database
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowHistory(!showHistory)}
              title="View Conversation Memory"
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                showHistory ? 'bg-[#3B7A57] text-white' : 'bg-[#FAF7F2] text-[#635548] border border-[#E2D9CA] hover:bg-[#F2ECE1]'
              }`}
            >
              <History className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                stopListening();
                stopSpeaking();
                onClose();
              }}
              className="p-2 text-gray-400 hover:text-black rounded-xl hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Selector: Conversational Q&A vs End of Day Journal Logging */}
        <div className="grid grid-cols-2 gap-2 shrink-0">
          <button
            onClick={() => {
              stopSpeaking();
              setActiveMode('chat');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'chat'
                ? 'bg-[#3B7A57] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-[#6E6155] border border-[#E8DEC9] hover:bg-[#F3EFE7]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Companion Q&A</span>
          </button>

          <button
            onClick={() => {
              stopSpeaking();
              setActiveMode('journal');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'journal'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-[#FAF7F2] text-[#6E6155] border border-[#E8DEC9] hover:bg-[#F3EFE7]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Evening Journal / Diary</span>
          </button>
        </div>

        {/* Universal Input Language Selector (Any Language) */}
        <div className="flex items-center justify-between bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#E8DFC9] text-xs shrink-0">
          <span className="font-bold text-[#6B5E52] text-[11px] flex items-center gap-1">
            <span>Input Language:</span>
          </span>
          <select
            value={selectedSpeechLang}
            onChange={(e) => {
              setSelectedSpeechLang(e.target.value);
              stopListening();
            }}
            className="bg-white border border-[#D9CDB8] text-[#2C2724] rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:border-[#3B7A57] cursor-pointer"
          >
            {SPEECH_LANG_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Body View: Conversation History or Active Listening Dialog */}
        {showHistory ? (
          <div className="flex-1 overflow-y-auto max-h-[320px] p-3 rounded-2xl bg-[#FAF7F2] border border-[#EADBCC] text-left space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6DAC8]">
              <span className="text-xs font-bold text-[#73665A]">
                Memory Database ({voiceMessages.length} Messages Logged)
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 font-semibold px-2 py-0.5 rounded-full">
                Personalized
              </span>
            </div>

            {voiceMessages.length === 0 ? (
              <p className="text-xs text-[#8A7D71] text-center py-6">
                No recorded conversations yet. Speak with Sahara to begin personalizing your companion!
              </p>
            ) : (
              voiceMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-xl text-xs sm:text-sm ${
                    msg.sender === 'user'
                      ? 'bg-white border border-[#E2D7C5] ml-4 text-[#2C2724]'
                      : 'bg-emerald-50 border border-emerald-200 mr-4 text-emerald-950 font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold mb-1">
                    <span>{msg.sender === 'user' ? 'Dada (You)' : 'Sahara'}</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="space-y-4 flex-1 overflow-y-auto">
            {/* Sahara Voice Microphone Avatar */}
            <div className="flex flex-col items-center py-2">
              <div className="relative">
                <button
                  onClick={toggleListening}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 text-white ring-8 ring-rose-200 animate-pulse scale-105'
                      : isSpeaking
                      ? 'bg-amber-500 text-white ring-8 ring-amber-200 animate-bounce'
                      : 'bg-[#3B7A57] hover:bg-[#2F6346] text-white'
                  }`}
                >
                  {isListening ? (
                    <Mic className="w-11 h-11" />
                  ) : isSpeaking ? (
                    <Volume2 className="w-10 h-10" />
                  ) : (
                    <MicOff className="w-10 h-10" />
                  )}
                </button>
              </div>

              <div className="mt-3">
                <span className={`text-xs font-extrabold uppercase tracking-wider block ${
                  isListening ? 'text-rose-600 animate-pulse' : isSpeaking ? 'text-amber-700' : 'text-[#3B7A57]'
                }`}>
                  {isListening 
                    ? 'Sahara is Listening Carefully (Take your time)...' 
                    : isSpeaking 
                    ? 'Sahara is Speaking Gently...' 
                    : isProcessing
                    ? 'Reflecting and consulting memory database...'
                    : activeMode === 'journal'
                    ? 'Tap Mic to Dictate Evening Journal'
                    : 'Tap Mic to Speak in any Language'}
                </span>
                <span className="text-[11px] text-[#7A6D61] mt-0.5 block">
                  {isListening ? 'Speak freely — pauses will not cut you off.' : 'Safe, patient, and non-judgmental.'}
                </span>
              </div>
            </div>

            {/* Live Voice Dialog Bubble */}
            <div className="p-4 rounded-2xl bg-[#FAF5EC] border border-[#EADBCC] text-left space-y-2.5">
              {(transcript || interimText) && (
                <div className="text-xs font-medium text-[#7A6B5F] bg-white p-2.5 rounded-xl border border-[#E5DBCB]">
                  <span className="font-bold text-[#3B7A57]">You are saying: </span>
                  <span className="text-[#2C2724] font-semibold">
                    "{transcript} {interimText}"
                  </span>
                </div>
              )}

              <div className="flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-bold text-[#2C2724] leading-relaxed">
                    {assistantReply}
                  </p>
                  {isSpeaking && (
                    <button
                      onClick={() => {
                        stopSpeaking();
                        setIsSpeaking(false);
                      }}
                      className="text-[11px] font-bold text-amber-800 hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Stop Speech Audio
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Elderly Single-Tap Prompts */}
            {activeMode === 'chat' ? (
              <div className="space-y-2 text-left">
                <span className="text-xs font-bold text-[#73675D]">
                  Or tap a frequently asked question:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'What is my next medicine?',
                    'Play cultural memory game',
                    'Show me family photos',
                    'What day and time is it today?',
                    'Call my son Vikram',
                    'How are you keeping my memories?',
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleProcessSpeech(prompt)}
                      className="w-full text-left p-2.5 rounded-xl border border-[#E2D8C6] hover:border-[#3B7A57] bg-[#FFFDF9] text-xs font-semibold text-[#3C3229] flex items-center justify-between hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <MessageSquare className="w-3.5 h-3.5 text-[#3B7A57] shrink-0" />
                        <span className="truncate">"{prompt}"</span>
                      </div>
                      <Volume2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Journal Suggestions */
              <div className="space-y-2 text-left bg-[#FFFDF8] p-3 rounded-xl border border-amber-200">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                  <span>Evening Journal Prompts (Tap or Speak):</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    'I went for a quiet walk in the garden and had warm tea with Vikram.',
                    'I played the Kaziranga memory game today and felt relaxed.',
                    'I felt a little tired in the afternoon, but rested well.',
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleProcessSpeech(prompt)}
                      className="w-full text-left p-2 rounded-lg border border-amber-100 hover:border-amber-400 bg-white text-xs text-[#4F4236] hover:bg-amber-50/50 transition-colors cursor-pointer"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Type/Input Bar */}
            <form onSubmit={handleManualSubmit} className="flex gap-2 pt-1">
              <input
                type="text"
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Or type here in any language..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#DCD0BE] bg-[#FAF8F5] focus:outline-none focus:border-[#3B7A57]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#3B7A57] text-white text-xs font-bold rounded-xl hover:bg-[#2F6346] flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

        <button
          onClick={() => {
            stopListening();
            stopSpeaking();
            onClose();
          }}
          className="w-full py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer shrink-0"
        >
          Close Assistant
        </button>
      </div>
    </div>
  );
};

