import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  Sun, 
  Droplets, 
  Pill, 
  Heart, 
  Flame, 
  Leaf, 
  Coffee, 
  Smile, 
  Flower2, 
  Utensils, 
  Moon,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameSession, RegionalLanguage } from '../../types';
import { ROUTINE_ORDER_TASKS } from '../../data/culturalContent';
import { playSoothingChime, speakText } from '../../utils/sound';

interface RoutineRecallGameProps {
  language: RegionalLanguage;
  highContrast: boolean;
  onGameComplete: (session: GameSession) => void;
}

interface ActivityStep {
  id: string;
  order: number;
  text: string;
  icon: string;
  color: string;
}

export const RoutineRecallGame: React.FC<RoutineRecallGameProps> = ({
  language,
  highContrast,
  onGameComplete,
}) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [availableCards, setAvailableCards] = useState<ActivityStep[]>([]);
  const [arrangedSlots, setArrangedSlots] = useState<(ActivityStep | null)[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const currentRoutine = ROUTINE_ORDER_TASKS[currentTaskIndex];

  const renderIcon = (name: string, className: string = 'w-6 h-6') => {
    switch (name) {
      case 'Sun': return <Sun className={className} />;
      case 'Droplets': return <Droplets className={className} />;
      case 'Pill': return <Pill className={className} />;
      case 'Heart': return <Heart className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Leaf': return <Leaf className={className} />;
      case 'Coffee': return <Coffee className={className} />;
      case 'Smile': return <Smile className={className} />;
      case 'Flower2': return <Flower2 className={className} />;
      case 'Utensils': return <Utensils className={className} />;
      case 'Moon': return <Moon className={className} />;
      default: return <Clock className={className} />;
    }
  };

  const setupRoutine = (index: number) => {
    const routine = ROUTINE_ORDER_TASKS[index];
    const shuffled = [...routine.steps].sort(() => 0.5 - Math.random());
    setAvailableCards(shuffled);
    setArrangedSlots(new Array(routine.steps.length).fill(null));
    setFeedback(null);
    setIsSuccess(false);
    setStartTime(Date.now());

    speakText(`Let's arrange our ${routine.title} in the right order.`, language);
  };

  useEffect(() => {
    setupRoutine(currentTaskIndex);
  }, [currentTaskIndex]);

  // Tap an available card to place in the first open slot
  const handleSelectCard = (card: ActivityStep) => {
    playSoothingChime('tap');
    speakText(card.text, language);

    const firstEmptyIndex = arrangedSlots.findIndex((s) => s === null);
    if (firstEmptyIndex === -1) return;

    const newSlots = [...arrangedSlots];
    newSlots[firstEmptyIndex] = card;
    setArrangedSlots(newSlots);

    setAvailableCards((prev) => prev.filter((c) => c.id !== card.id));

    // If all slots are filled, check order!
    if (firstEmptyIndex === currentRoutine.steps.length - 1) {
      checkOrder(newSlots as ActivityStep[]);
    }
  };

  // Tap a slot to remove it back to available cards
  const handleRemoveFromSlot = (index: number) => {
    const item = arrangedSlots[index];
    if (!item || isSuccess) return;

    playSoothingChime('tap');
    const newSlots = [...arrangedSlots];
    newSlots[index] = null;
    setArrangedSlots(newSlots);
    setAvailableCards((prev) => [...prev, item]);
    setFeedback(null);
  };

  const checkOrder = (slots: ActivityStep[]) => {
    const isCorrect = slots.every((step, idx) => step.order === idx + 1);

    if (isCorrect) {
      setIsSuccess(true);
      playSoothingChime('celebrate');
      confetti({ particleCount: 40, spread: 55, origin: { y: 0.65 } });

      const msg = `Wonderful! You arranged the ${currentRoutine.title} in the perfect order!`;
      setFeedback(msg);
      speakText(msg, language);

      const elapsed = Date.now() - startTime;
      const session: GameSession = {
        id: `session-routine-${Date.now()}`,
        gameType: 'routine_recall',
        difficulty: 1,
        moves: slots.length,
        accuracy: 100,
        reactionTimeMs: elapsed,
        completedAt: new Date().toISOString(),
        synced: false,
        notes: `Arranged ${currentRoutine.title} sequence successfully`,
      };
      onGameComplete(session);
    } else {
      playSoothingChime('gentle_bell');
      const hint = "Almost there! Let's review the steps. Tap any step above to adjust its position.";
      setFeedback(hint);
      speakText(hint, language);
    }
  };

  const handleNextRoutine = () => {
    setCurrentTaskIndex((prev) => (prev + 1) % ROUTINE_ORDER_TASKS.length);
  };

  const handleHint = () => {
    // Find next correct card for first empty slot
    const firstEmptyIndex = arrangedSlots.findIndex((s) => s === null);
    if (firstEmptyIndex !== -1) {
      const correctOrder = firstEmptyIndex + 1;
      const correctCard = availableCards.find((c) => c.order === correctOrder);
      if (correctCard) {
        speakText(`Hint: Step ${correctOrder} is "${correctCard.text}"`, language);
        setFeedback(`Hint: Step ${correctOrder} is "${correctCard.text}"`);
      }
    }
  };

  return (
    <div 
      id="routine-recall-game"
      className={`rounded-3xl p-5 sm:p-7 border shadow-sm transition-all ${
        highContrast 
          ? 'bg-[#1C1C1C] border-yellow-400 text-yellow-50' 
          : 'bg-white border-[#E8DFC8] text-[#2C2724]'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight font-['Outfit']">
                Daily Routine Recall
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900">
                Arrange in Order
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6C5E53] mt-0.5">
              {currentRoutine.description}
            </p>
          </div>
        </div>

        {/* Routine Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleHint}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#D9CEB8] bg-[#FAF8F5] text-xs font-bold text-[#554A41] hover:bg-[#F3EEDB] cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Need a Hint</span>
          </button>
          <button
            onClick={handleNextRoutine}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#3B7A57] text-white text-xs font-black hover:bg-[#2F6346] shadow-xs cursor-pointer"
          >
            <span>Next Routine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Routine Title Banner */}
      <div className="mb-5 p-4 rounded-2xl bg-[#FAF5EC] border border-[#EADBCC] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 block">
            Routine Activity
          </span>
          <h3 className="text-lg font-black text-[#2C2724]">
            {currentRoutine.title} ({currentRoutine.regionalTitle})
          </h3>
        </div>
        <button
          onClick={() => speakText(`${currentRoutine.title}. ${currentRoutine.description}`, language)}
          className="p-2 rounded-xl bg-white text-[#5F5347] hover:text-[#3B7A57] shadow-2xs cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* SLOTS: 1st, 2nd, 3rd, 4th Step */}
      <div className="space-y-2 mb-6">
        <span className="text-xs font-black text-[#6B5E53] uppercase tracking-wider block">
          Your Ordered Sequence (Tap a card below to place here):
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {arrangedSlots.map((slotItem, index) => {
            const stepNum = index + 1;
            return (
              <div
                key={index}
                onClick={() => handleRemoveFromSlot(index)}
                className={`min-h-[105px] p-3.5 rounded-2xl border-2 flex flex-col justify-between transition-all cursor-pointer ${
                  slotItem
                    ? 'bg-white border-[#3B7A57] shadow-sm hover:border-rose-400'
                    : 'bg-[#FAF7F2] border-dashed border-[#D4C7B0]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-[#ECE4D4] text-[#554A41]">
                    Step {stepNum}
                  </span>
                  {slotItem && (
                    <div 
                      className="w-7 h-7 rounded-lg text-[#2C2724] flex items-center justify-center"
                      style={{ backgroundColor: slotItem.color }}
                    >
                      {renderIcon(slotItem.icon, 'w-4 h-4')}
                    </div>
                  )}
                </div>

                {slotItem ? (
                  <div>
                    <p className="text-xs sm:text-sm font-extrabold text-[#2C2724] leading-snug">
                      {slotItem.text}
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      Tap to remove
                    </span>
                  </div>
                ) : (
                  <div className="text-center py-2 text-xs font-bold text-[#8C8075]">
                    + Tap activity below
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AVAILABLE ACTIVITIES POOL */}
      <div className="space-y-2.5 mb-6">
        <span className="text-xs font-black text-[#6B5E53] uppercase tracking-wider block">
          Activities Pool (Tap to add):
        </span>

        {availableCards.length === 0 && !isSuccess && (
          <p className="text-xs text-[#73665A] italic">
            All activities placed in slots above. Review your order!
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableCards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleSelectCard(card)}
              className="p-3.5 rounded-2xl border-2 border-[#E2D8C6] hover:border-[#3B7A57] bg-[#FFFDF9] hover:bg-[#FAF7F2] flex items-center gap-3.5 text-left transition-all active:scale-98 shadow-xs cursor-pointer"
            >
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                style={{ backgroundColor: card.color }}
              >
                {renderIcon(card.icon, 'w-6 h-6 text-[#2C2724]')}
              </div>
              <div className="flex-1">
                <span className="text-xs sm:text-sm font-black text-[#2C2724] leading-snug block">
                  {card.text}
                </span>
                <span className="text-[11px] text-[#3B7A57] font-bold">
                  Tap to place into next step →
                </span>
              </div>
            </button>
          ))}
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
          onClick={() => setupRoutine(currentTaskIndex)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D9CEB8] bg-white hover:bg-[#FAF7F2] text-[#4F4439] text-xs font-bold shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#3B7A57]" />
          <span>Reset Order</span>
        </button>

        {isSuccess && (
          <button
            onClick={handleNextRoutine}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B7A57] text-white text-xs sm:text-sm font-black hover:bg-[#2F6346] shadow-sm cursor-pointer"
          >
            <span>Try Another Routine</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
