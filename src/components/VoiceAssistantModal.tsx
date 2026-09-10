import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X, MessageSquare } from 'lucide-react';
import { RegionalLanguage } from '../types';
import { playSoothingChime, speakText } from '../utils/sound';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: RegionalLanguage;
  onNavigateAction: (action: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onNavigateAction,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState(
    'Hello Dada, I am Sahara. You can ask me what medicine is next, or tell me to open games!'
  );

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setAssistantReply('Hello Dada! Tap any question below or speak to me in your comfort.');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVoiceCommand = async (cmd: string) => {
    playSoothingChime('tap');
    setTranscript(cmd);

    const lower = cmd.toLowerCase();
    let reply = '';

    if (lower.includes('medicine') || lower.includes('tablet') || lower.includes('schedule')) {
      reply = 'Your next scheduled care is Morning Hydration & Tea, followed by your lunch Vitamin B12. Would you like to view the routine?';
      onNavigateAction('routine');
    } else if (lower.includes('game') || lower.includes('memory') || lower.includes('play')) {
      reply = 'Opening your Cultural Memory Match game with gentle Kaziranga symbols right now!';
      onNavigateAction('games');
    } else if (lower.includes('photo') || lower.includes('family') || lower.includes('album')) {
      reply = 'Opening your cherished Family Album with granddaughter Ananya and son Vikram.';
      onNavigateAction('memories');
    } else if (lower.includes('date') || lower.includes('time') || lower.includes('today')) {
      const now = new Date();
      reply = `Today is ${now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}. The time is ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} in Assam.`;
    } else if (lower.includes('help') || lower.includes('sos') || lower.includes('call')) {
      reply = 'Opening immediate Caregiver Help to connect you with Vikram and Sister Meera.';
      onNavigateAction('sos');
    } else {
      reply = `I heard: "${cmd}". You are doing wonderful! Let's practice a relaxing memory game together.`;
    }

    setAssistantReply(reply);
    speakText(reply, language);

    // Try backend AI Companion API for enhanced cloud intelligence if online
    try {
      const res = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cmd, language })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply && data.reply !== reply) {
          setAssistantReply(data.reply);
          speakText(data.reply, language);
        }
      }
    } catch {
      // Offline fallback already handled
    }
  };

  const toggleMicListening = () => {
    // Check Web Speech API
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
                              (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      handleVoiceCommand('What is my next medicine?');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'bn' ? 'bn-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        playSoothingChime('tap');
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setIsListening(false);
        handleVoiceCommand(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
        handleVoiceCommand('Play memory game');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      handleVoiceCommand('What is my next medicine?');
    }
  };

  return (
    <div 
      id="voice-assistant-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E0D4BE] shadow-2xl space-y-5 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sahara Voice Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <button
              onClick={toggleMicListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white ring-8 ring-rose-200 animate-pulse scale-105'
                  : 'bg-[#3B7A57] hover:bg-[#2F6346] text-white'
              }`}
            >
              {isListening ? <Mic className="w-9 h-9" /> : <MicOff className="w-8 h-8" />}
            </button>
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#3B7A57] mt-3">
            {isListening ? 'Sahara is Listening...' : 'Tap Mic to Speak'}
          </span>
        </div>

        {/* Voice Dialog Bubble */}
        <div className="p-4 rounded-2xl bg-[#FAF5EC] border border-[#EADBCC] text-left space-y-2">
          {transcript && (
            <div className="text-xs font-semibold text-[#827468]">
              You said: <span className="text-[#2C2724]">"{transcript}"</span>
            </div>
          )}
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base font-bold text-[#2C2724] leading-relaxed">
              {assistantReply}
            </p>
          </div>
        </div>

        {/* Quick Elderly Single-Tap Prompts */}
        <div className="space-y-2 text-left">
          <span className="text-xs font-bold text-[#73675D]">
            Or tap a common question:
          </span>
          <div className="grid grid-cols-1 gap-2">
            {[
              'What is my next medicine?',
              'Play cultural memory game',
              'Show me family photos',
              'What day and time is it today?',
              'Call my son Vikram',
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleVoiceCommand(prompt)}
                className="w-full text-left p-2.5 rounded-xl border border-[#E2D8C6] hover:border-[#3B7A57] bg-[#FFFDF9] text-xs sm:text-sm font-semibold text-[#3C3229] flex items-center justify-between hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#3B7A57]" />
                  <span>"{prompt}"</span>
                </div>
                <Volume2 className="w-3.5 h-3.5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          Close Assistant
        </button>
      </div>
    </div>
  );
};
