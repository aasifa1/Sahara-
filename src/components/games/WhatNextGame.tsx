import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  HelpCircle,
  Footprints
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameSession, RegionalLanguage } from '../../types';
import { WHAT_NEXT_STORIES } from '../../data/culturalContent';
import { playSoothingChime, speakText } from '../../utils/sound';

interface WhatNextGameProps {
  language: RegionalLanguage;
  highContrast: boolean;
  onGameComplete: (session: GameSession) => void;
}

export const WhatNextGame: React.FC<WhatNextGameProps> = ({
  language,
  highContrast,
  onGameComplete,
}) => {
  const [storyIndex, setStoryIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const currentStory = WHAT_NEXT_STORIES[storyIndex];

  useEffect(() => {
    setSelectedOptionId(null);
    setFeedback(null);
    setIsSuccess(false);
    setStartTime(Date.now());

    speakText(`${currentStory.title}. ${currentStory.story}. ${currentStory.question}`, language);
  }, [storyIndex, language]);

  const handleSelectOption = (opt: { id: string; text: string; isCorrect: boolean }) => {
    setSelectedOptionId(opt.id);

    if (opt.isCorrect) {
      setIsSuccess(true);
      playSoothingChime('match');
      confetti({ particleCount: 40, spread: 55, origin: { y: 0.65 } });

      setFeedback(currentStory.celebration);
      speakText(currentStory.celebration, language);

      const elapsed = Date.now() - startTime;
      const session: GameSession = {
        id: `session-whatnext-${Date.now()}`,
        gameType: 'what_next',
        difficulty: 1,
        moves: 1,
        accuracy: 100,
        reactionTimeMs: elapsed,
        completedAt: new Date().toISOString(),
        synced: false,
        notes: `Arranged sequence correctly: ${currentStory.title}`,
      };
      onGameComplete(session);
    } else {
      playSoothingChime('gentle_bell');
      const hintMsg = `Let's reflect together: ${currentStory.hint}`;
      setFeedback(hintMsg);
      speakText(hintMsg, language);
    }
  };

  const handleNextStory = () => {
    setStoryIndex((prev) => (prev + 1) % WHAT_NEXT_STORIES.length);
  };

  return (
    <div 
      id="what-comes-next-game"
      className={`rounded-3xl p-5 sm:p-7 border shadow-sm transition-all ${
        highContrast 
          ? 'bg-[#1C1C1C] border-yellow-400 text-yellow-50' 
          : 'bg-white border-[#E8DFC8] text-[#2C2724]'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-700 text-white flex items-center justify-center shadow-md shrink-0">
            <Footprints className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight font-['Outfit']">
                What Comes Next?
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-teal-100 text-teal-900">
                Sequence Logic
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6C5E53] mt-0.5">
              Arrange familiar everyday activities in their natural sequential order
            </p>
          </div>
        </div>

        <button
          onClick={handleNextStory}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B7A57] text-white text-xs font-black hover:bg-[#2F6346] shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <span>Next Story</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Story Scenario & Sequence Steps */}
      <div className="mb-6 p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#FAF6EE] to-[#F5EFE4] border border-[#EADBCC]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-teal-800">
            Familiar Activity: {currentStory.title} ({currentStory.regionalTitle})
          </span>
          <button
            onClick={() => speakText(`${currentStory.title}. ${currentStory.story}. What comes next?`, language)}
            className="p-1.5 rounded-xl bg-white text-[#5F5347] hover:text-[#3B7A57] shadow-2xs cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-[#54483E] mb-4">
          {currentStory.story}
        </p>

        {/* Existing Sequence Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 items-stretch">
          {currentStory.sequence.map((step) => (
            <div 
              key={step.step}
              className="p-3.5 rounded-2xl bg-white border border-[#D9CEB8] shadow-xs flex flex-col items-center text-center gap-2"
            >
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 self-start">
                Step {step.step}
              </span>
              <div className="w-full h-28 rounded-xl overflow-hidden bg-gray-100 shadow-2xs">
                <img src={step.imageUrl} alt={step.text} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-[#2C2724] leading-snug">
                {step.text}
              </p>
            </div>
          ))}

          {/* Missing Step Placeholder */}
          <div className={`p-4 rounded-2xl border-3 flex flex-col items-center justify-center text-center gap-2 shadow-sm transition-all ${
            isSuccess 
              ? 'border-emerald-500 bg-emerald-50 text-emerald-950' 
              : 'border-dashed border-teal-400 bg-teal-50/50 text-teal-950'
          }`}>
            <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-teal-200 text-teal-900">
              Step {currentStory.sequence.length + 1}
            </span>
            {isSuccess ? (
              <div className="space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <span className="text-xs sm:text-sm font-black block">
                  Completed in Order!
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <HelpCircle className="w-8 h-8 text-teal-600 animate-pulse mx-auto" />
                <span className="text-xs sm:text-sm font-black block">
                  What comes next?
                </span>
                <span className="text-[11px] text-[#7A6D60]">
                  Pick from options below
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        <span className="text-xs font-black text-[#6B5E53] uppercase tracking-wider block">
          Choose the next natural action:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {currentStory.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt)}
                disabled={isSuccess}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center gap-2.5 transition-all active:scale-95 shadow-sm cursor-pointer ${
                  isSelected && opt.isCorrect
                    ? 'border-emerald-500 bg-emerald-50 ring-3 ring-emerald-300'
                    : isSelected && !opt.isCorrect
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-[#E2D8C6] hover:border-teal-400 bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="w-full h-24 rounded-xl overflow-hidden bg-gray-100 shadow-2xs">
                  <img src={opt.imageUrl} alt={opt.text} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs sm:text-sm font-black text-[#2C2724] leading-snug">
                  {opt.text}
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
            setSelectedOptionId(null);
            setFeedback(null);
            setIsSuccess(false);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D9CEB8] bg-white hover:bg-[#FAF7F2] text-[#4F4439] text-xs font-bold shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#3B7A57]" />
          <span>Try Again</span>
        </button>

        {isSuccess && (
          <button
            onClick={handleNextStory}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B7A57] text-white text-xs sm:text-sm font-black hover:bg-[#2F6346] shadow-sm cursor-pointer"
          >
            <span>Next Story Sequence</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
