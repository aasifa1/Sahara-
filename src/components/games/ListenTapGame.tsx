import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  RotateCcw, 
  Headphones, 
  ArrowRight,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameSession, RegionalLanguage } from '../../types';
import { LISTEN_TAP_TASKS } from '../../data/culturalContent';
import { playSoothingChime, speakText } from '../../utils/sound';

interface ListenTapGameProps {
  language: RegionalLanguage;
  highContrast: boolean;
  onGameComplete: (session: GameSession) => void;
}

export const ListenTapGame: React.FC<ListenTapGameProps> = ({
  language,
  highContrast,
  onGameComplete,
}) => {
  const [taskIndex, setTaskIndex] = useState<number>(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const currentTask = LISTEN_TAP_TASKS[taskIndex];

  const playInstruction = () => {
    setIsPlayingAudio(true);
    const spoken = currentTask.regionalInstruction[language] || currentTask.instruction;
    speakText(spoken, language);
    setTimeout(() => setIsPlayingAudio(false), 2500);
  };

  useEffect(() => {
    setSelectedItemId(null);
    setFeedback(null);
    setIsSuccess(false);
    setStartTime(Date.now());

    // Automatically speak instruction gently on round start
    const timer = setTimeout(() => {
      playInstruction();
    }, 400);

    return () => clearTimeout(timer);
  }, [taskIndex, language]);

  const handleSelect = (item: { id: string; name: string; imageUrl: string }) => {
    setSelectedItemId(item.id);

    if (item.id === currentTask.targetId) {
      setIsSuccess(true);
      playSoothingChime('match');
      confetti({ particleCount: 40, spread: 55, origin: { y: 0.65 } });

      const praise = `Wonderful! You tapped the ${item.name}. Your listening is sharp!`;
      setFeedback(praise);
      speakText(praise, language);

      const elapsed = Date.now() - startTime;
      const session: GameSession = {
        id: `session-listentap-${Date.now()}`,
        gameType: 'listen_tap',
        difficulty: 1,
        moves: 1,
        accuracy: 100,
        reactionTimeMs: elapsed,
        completedAt: new Date().toISOString(),
        synced: false,
        notes: `Successfully listened and identified: ${item.name}`,
      };
      onGameComplete(session);
    } else {
      playSoothingChime('gentle_bell');
      const guidance = `That is the ${item.name}. Let's listen to Sahara's voice again and tap together!`;
      setFeedback(guidance);
      speakText(guidance, language);
    }
  };

  const handleNextTask = () => {
    setTaskIndex((prev) => (prev + 1) % LISTEN_TAP_TASKS.length);
  };

  return (
    <div 
      id="listen-and-tap-game"
      className={`rounded-3xl p-5 sm:p-7 border shadow-sm transition-all ${
        highContrast 
          ? 'bg-[#1C1C1C] border-yellow-400 text-yellow-50' 
          : 'bg-white border-[#E8DFC8] text-[#2C2724]'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-white flex items-center justify-center shadow-md shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight font-['Outfit']">
                Listen & Tap
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-100 text-purple-900">
                Auditory Care
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6C5E53] mt-0.5">
              Listen to the gentle voice prompt and tap the matching object
            </p>
          </div>
        </div>

        <button
          onClick={handleNextTask}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B7A57] text-white text-xs font-black hover:bg-[#2F6346] shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <span>Next Object</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Prominent Audio Listening Station */}
      <div className="mb-6 p-6 rounded-3xl bg-gradient-to-r from-[#FAF5EC] via-[#F6EEE0] to-[#EFE4D2] border-2 border-[#E0D3BC] text-center space-y-4 shadow-sm">
        <span className="text-xs font-black uppercase tracking-wider text-purple-800 block">
          Listen to Sahara
        </span>

        <h3 className="text-lg sm:text-2xl font-black text-[#2C2724] max-w-xl mx-auto leading-relaxed">
          "{currentTask.instruction}"
        </h3>

        {currentTask.regionalInstruction && currentTask.regionalInstruction[language] && (
          <p className="text-sm sm:text-base font-bold text-[#3B7A57]">
            {currentTask.regionalInstruction[language]}
          </p>
        )}

        {/* Large Replay Audio Button */}
        <div>
          <button
            onClick={playInstruction}
            className={`inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl text-white font-black text-sm sm:text-base shadow-md cursor-pointer transition-all active:scale-95 ${
              isPlayingAudio 
                ? 'bg-purple-700 ring-4 ring-purple-300' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
            }`}
          >
            <Radio className={`w-5 h-5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
            <span>{isPlayingAudio ? 'Playing Instruction...' : 'Play Instruction Again (🔊)'}</span>
          </button>
        </div>
      </div>

      {/* Object Cards */}
      <div className="space-y-3 mb-6">
        <span className="text-xs font-black text-[#6B5E53] uppercase tracking-wider block">
          Tap the object described above:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {currentTask.options.map((item) => {
            const isSelected = selectedItemId === item.id;
            const isCorrect = item.id === currentTask.targetId;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                disabled={isSuccess}
                className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center gap-3 transition-all active:scale-95 shadow-sm cursor-pointer ${
                  isSelected && isCorrect
                    ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300'
                    : isSelected && !isCorrect
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-[#E2D8C6] hover:border-purple-400 bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 shadow-xs">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-[#2C2724] leading-tight">
                    {item.name}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 mb-4 ${
          isSuccess 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
            {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />}
            <span>{feedback}</span>
          </div>
          <button
            onClick={() => speakText(feedback, language)}
            className="p-1.5 rounded-lg text-[#5F5347] hover:text-[#3B7A57] cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#F0EAE1]">
        <button
          onClick={() => {
            setSelectedItemId(null);
            setFeedback(null);
            setIsSuccess(false);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D9CEB8] bg-white hover:bg-[#FAF7F2] text-[#4F4439] text-xs font-bold shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#3B7A57]" />
          <span>Listen Again</span>
        </button>

        {isSuccess && (
          <button
            onClick={handleNextTask}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B7A57] text-white text-xs sm:text-sm font-black hover:bg-[#2F6346] shadow-sm cursor-pointer"
          >
            <span>Play Next Prompt</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
