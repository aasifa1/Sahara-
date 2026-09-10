import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  RotateCcw, 
  Layers, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameSession, RegionalLanguage } from '../../types';
import { NER_PATTERN_SETS } from '../../data/culturalContent';
import { playSoothingChime, speakText } from '../../utils/sound';

interface PatternFocusGameProps {
  language: RegionalLanguage;
  highContrast: boolean;
  onGameComplete: (session: GameSession) => void;
}

export const PatternFocusGame: React.FC<PatternFocusGameProps> = ({
  language,
  highContrast,
  onGameComplete,
}) => {
  const [patternIndex, setPatternIndex] = useState<number>(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const currentPattern = NER_PATTERN_SETS[patternIndex];

  useEffect(() => {
    setSelectedChoiceId(null);
    setFeedback(null);
    setIsSuccess(false);
    setStartTime(Date.now());

    speakText(`Complete the pattern with North Eastern nature: ${currentPattern.title}`, language);
  }, [patternIndex, language]);

  const handleSelectChoice = (choice: { id: string; name: string; imageUrl: string }) => {
    setSelectedChoiceId(choice.id);

    if (choice.id === currentPattern.correctAnswer.id) {
      setIsSuccess(true);
      playSoothingChime('match');
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.65 } });

      const msg = `Wonderful! The pattern completes with ${choice.name}!`;
      setFeedback(msg);
      speakText(msg, language);

      const elapsed = Date.now() - startTime;
      const session: GameSession = {
        id: `session-pattern-${Date.now()}`,
        gameType: 'pattern_focus',
        difficulty: 1,
        moves: 1,
        accuracy: 100,
        reactionTimeMs: elapsed,
        completedAt: new Date().toISOString(),
        synced: false,
        notes: `Completed NER pattern: ${currentPattern.title}`,
      };
      onGameComplete(session);
    } else {
      playSoothingChime('gentle_bell');
      const hintMsg = `Let's look at the sequence again: ${currentPattern.hint}`;
      setFeedback(hintMsg);
      speakText(hintMsg, language);
    }
  };

  const handleNextPattern = () => {
    setPatternIndex((prev) => (prev + 1) % NER_PATTERN_SETS.length);
  };

  return (
    <div 
      id="pattern-focus-game"
      className={`rounded-3xl p-5 sm:p-7 border shadow-sm transition-all ${
        highContrast 
          ? 'bg-[#1C1C1C] border-yellow-400 text-yellow-50' 
          : 'bg-white border-[#E8DFC8] text-[#2C2724]'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-700 text-white flex items-center justify-center shadow-md shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight font-['Outfit']">
                NER Pattern & Nature
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-900">
                Pattern Completion
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6C5E53] mt-0.5">
              Observe the rhythm of nature and select the missing piece
            </p>
          </div>
        </div>

        <button
          onClick={handleNextPattern}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B7A57] text-white text-xs font-black hover:bg-[#2F6346] shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <span>Next Pattern</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Pattern Display Row */}
      <div className="mb-6 p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#FAF6EE] to-[#F5EFE4] border border-[#EADBCC]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-800">
            Pattern Sequence: {currentPattern.title}
          </span>
          <button
            onClick={() => speakText(`The pattern shows: ${currentPattern.title}. What completes the sequence?`, language)}
            className="p-1.5 rounded-xl bg-white text-[#5F5347] hover:text-[#3B7A57] shadow-2xs cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Sequence Cards */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2">
          {currentPattern.sequence.map((item, idx) => (
            <React.Fragment key={item.id}>
              <div className="w-20 sm:w-28 aspect-square rounded-2xl overflow-hidden border-2 border-[#D4C7B0] bg-white shadow-sm flex flex-col items-center">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-[70%] object-cover" 
                />
                <span className="text-[11px] sm:text-xs font-black text-[#2C2724] p-1 truncate w-full text-center">
                  {item.name}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
            </React.Fragment>
          ))}

          {/* Missing Slot */}
          <div className={`w-20 sm:w-28 aspect-square rounded-2xl overflow-hidden border-3 flex flex-col items-center justify-center shadow-md transition-all ${
            isSuccess 
              ? 'border-emerald-500 bg-emerald-50' 
              : 'border-dashed border-indigo-400 bg-indigo-50/50'
          }`}>
            {isSuccess ? (
              <>
                <img 
                  src={currentPattern.correctAnswer.imageUrl} 
                  alt={currentPattern.correctAnswer.name} 
                  className="w-full h-[70%] object-cover" 
                />
                <span className="text-[11px] sm:text-xs font-black text-emerald-800 p-1">
                  {currentPattern.correctAnswer.name}
                </span>
              </>
            ) : (
              <div className="flex flex-col items-center p-2 text-center">
                <HelpCircle className="w-8 h-8 text-indigo-600 animate-pulse" />
                <span className="text-[10px] font-black text-indigo-900 mt-1 uppercase">
                  Next?
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CHOICES */}
      <div className="space-y-3 mb-6">
        <span className="text-xs font-black text-[#6B5E53] uppercase tracking-wider block">
          Which element completes the rhythm? Tap below:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
          {currentPattern.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.id;
            const isChoiceCorrect = choice.id === currentPattern.correctAnswer.id;

            return (
              <button
                key={choice.id}
                onClick={() => handleSelectChoice(choice)}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer ${
                  isSelected && isChoiceCorrect
                    ? 'border-emerald-500 bg-emerald-50 ring-3 ring-emerald-300'
                    : isSelected && !isChoiceCorrect
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-[#E2D8C6] hover:border-indigo-400 bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-xs bg-gray-100">
                  <img 
                    src={choice.imageUrl} 
                    alt={choice.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <span className="text-xs sm:text-sm font-black text-[#2C2724]">
                  {choice.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
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
            setSelectedChoiceId(null);
            setFeedback(null);
            setIsSuccess(false);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D9CEB8] bg-white hover:bg-[#FAF7F2] text-[#4F4439] text-xs font-bold shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#3B7A57]" />
          <span>Reset</span>
        </button>

        {isSuccess && (
          <button
            onClick={handleNextPattern}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B7A57] text-white text-xs sm:text-sm font-black hover:bg-[#2F6346] shadow-sm cursor-pointer"
          >
            <span>Play Next Pattern</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
