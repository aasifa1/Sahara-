import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingCart, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  RotateCcw, 
  Eye, 
  HelpCircle,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameSession, RegionalLanguage } from '../../types';
import { SHOPPING_ITEMS, ShoppingItem } from '../../data/culturalContent';
import { playSoothingChime, speakText } from '../../utils/sound';

interface MemoryShoppingGameProps {
  language: RegionalLanguage;
  highContrast: boolean;
  onGameComplete: (session: GameSession) => void;
}

export const MemoryShoppingGame: React.FC<MemoryShoppingGameProps> = ({
  language,
  highContrast,
  onGameComplete,
}) => {
  const [phase, setPhase] = useState<'study' | 'shop'>('study');
  const [itemCount, setItemCount] = useState<number>(2); // 2 items for gentle, 3 for active
  const [targetItems, setTargetItems] = useState<ShoppingItem[]>([]);
  const [marketShelves, setMarketShelves] = useState<ShoppingItem[]>([]);
  const [basket, setBasket] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const initGame = useCallback((count: number) => {
    // Pick target items
    const shuffled = [...SHOPPING_ITEMS].sort(() => 0.5 - Math.random());
    const targets = shuffled.slice(0, count);
    
    // Pick distractors to make 6 market shelf items
    const distractors = shuffled.slice(count, 6);
    const shelfPool = [...targets, ...distractors].sort(() => 0.5 - Math.random());

    setTargetItems(targets);
    setMarketShelves(shelfPool);
    setBasket([]);
    setFeedback(null);
    setIsWon(false);
    setPhase('study');
    setStartTime(Date.now());

    const names = targets.map((t) => t.name).join(' and ');
    speakText(`Let's visit the morning Guwahati bazaar! Remember these items: ${names}.`, language);
  }, [language]);

  useEffect(() => {
    initGame(itemCount);
  }, [itemCount, initGame]);

  const handleStartShopping = () => {
    playSoothingChime('tap');
    setPhase('shop');
    const msg = 'Welcome to the bazaar! Tap the items that were on your shopping list.';
    setFeedback(msg);
    speakText(msg, language);
  };

  const handleTapMarketItem = (item: ShoppingItem) => {
    if (basket.includes(item.id) || isWon) return;

    const isTarget = targetItems.some((t) => t.id === item.id);

    if (isTarget) {
      playSoothingChime('match');
      const nextBasket = [...basket, item.id];
      setBasket(nextBasket);

      const msg = `Good job! Added ${item.name} (${item.regionalName}) to your shopping basket!`;
      setFeedback(msg);
      speakText(msg, language);

      if (nextBasket.length === targetItems.length) {
        // Complete!
        setIsWon(true);
        playSoothingChime('celebrate');
        confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });

        const elapsed = Date.now() - startTime;
        const session: GameSession = {
          id: `session-shop-${Date.now()}`,
          gameType: 'memory_shopping',
          difficulty: itemCount === 2 ? 1 : 2,
          moves: nextBasket.length,
          accuracy: 100,
          reactionTimeMs: elapsed,
          completedAt: new Date().toISOString(),
          synced: false,
          notes: `Remembered and shopped ${targetItems.length} bazaar items`,
        };
        onGameComplete(session);
      }
    } else {
      playSoothingChime('gentle_bell');
      const msg = `"${item.name}" is wonderful, but wasn't on our morning list. You can tap "Check My List" anytime!`;
      setFeedback(msg);
      speakText(msg, language);
    }
  };

  return (
    <div 
      id="memory-shopping-game"
      className={`rounded-3xl p-5 sm:p-7 border shadow-sm transition-all ${
        highContrast 
          ? 'bg-[#1C1C1C] border-yellow-400 text-yellow-50' 
          : 'bg-white border-[#E8DFC8] text-[#2C2724]'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shrink-0">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight font-['Outfit']">
                Memory Shopping
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-900">
                Guwahati Bazaar
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6C5E53] mt-0.5">
              Remember your short shopping list and pick the goods at the market
            </p>
          </div>
        </div>

        {/* Difficulty: 2 vs 3 items */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#73665A]">List Size:</span>
          <div className="flex bg-[#ECE4D4] p-1 rounded-xl text-xs font-extrabold">
            <button
              onClick={() => setItemCount(2)}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                itemCount === 2 ? 'bg-[#3B7A57] text-white shadow-xs' : 'text-[#6C5E53]'
              }`}
            >
              Gentle (2 Items)
            </button>
            <button
              onClick={() => setItemCount(3)}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                itemCount === 3 ? 'bg-[#3B7A57] text-white shadow-xs' : 'text-[#6C5E53]'
              }`}
            >
              Active (3 Items)
            </button>
          </div>
        </div>
      </div>

      {/* PHASE 1: STUDY & REMEMBER */}
      {phase === 'study' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#FAF6EE] to-[#F5EFE4] border border-[#EADBCC] text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-rose-700">
              Step 1: Memorize Your Morning List
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#2C2724]">
              "Dada, please remember these {targetItems.length} items for the market:"
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6357]">
              Take all the time you need. When you are ready, tap the green button below.
            </p>
          </div>

          {/* Large Picture Cards of Shopping List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {targetItems.map((item) => (
              <div 
                key={item.id}
                className="p-4 rounded-3xl border-3 border-rose-300 bg-white shadow-md flex flex-col items-center text-center gap-3"
              >
                <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-sm bg-gray-100">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-[#2C2724] leading-tight">
                    {item.name}
                  </h4>
                  <span className="text-xs font-bold text-rose-700 block mt-0.5">
                    {item.regionalName}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={handleStartShopping}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#3B7A57] hover:bg-[#2F6346] text-white text-base font-black shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>I Am Ready to Shop in the Bazaar!</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: AT THE BAZAAR */}
      {phase === 'shop' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF5EC] border border-[#EADBCC]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#3B7A57]" />
              <span className="text-xs sm:text-sm font-black text-[#2C2724]">
                Items In Basket: {basket.length} of {targetItems.length}
              </span>
            </div>

            <button
              onClick={() => setShowHintModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-black hover:bg-amber-100 cursor-pointer self-start sm:self-auto"
            >
              <Eye className="w-4 h-4 text-amber-700" />
              <span>Remind Me of the List (No Penalty)</span>
            </button>
          </div>

          {/* Market Shelf of 6 Goods */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5 max-w-3xl mx-auto">
            {marketShelves.map((item) => {
              const isInBasket = basket.includes(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => handleTapMarketItem(item)}
                  disabled={isInBasket || isWon}
                  className={`p-3 sm:p-4 rounded-2xl border-2 flex flex-col items-center text-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm relative ${
                    isInBasket
                      ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-300'
                      : 'border-[#E2D8C6] hover:border-rose-400 bg-white hover:bg-[#FAF8F5]'
                  }`}
                >
                  {isInBasket && (
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}

                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-xs bg-gray-100">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-[#2C2724] leading-tight">
                      {item.name}
                    </h4>
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#73675E] block mt-0.5">
                      {item.regionalName}
                    </span>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    isInBasket ? 'bg-emerald-200 text-emerald-900' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {isInBasket ? 'In Basket' : 'Tap to Buy'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
              isWon 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
                {isWon ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />}
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

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-[#F0EAE1]">
            <button
              onClick={() => initGame(itemCount)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D9CEB8] bg-white hover:bg-[#FAF7F2] text-[#4F4439] text-xs font-bold shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#3B7A57]" />
              <span>New Shopping Trip</span>
            </button>

            {isWon && (
              <button
                onClick={() => initGame(itemCount)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B7A57] text-white text-xs sm:text-sm font-black hover:bg-[#2F6346] shadow-sm cursor-pointer"
              >
                <span>Shop Again</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reminder Hint Modal */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E0D4BE] shadow-2xl space-y-4 text-center">
            <h3 className="text-xl font-black text-[#2C2724]">
              Your Shopping List Reminder
            </h3>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {targetItems.map((item) => (
                <div key={item.id} className="p-3 rounded-2xl border border-rose-200 bg-rose-50 flex flex-col items-center">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl object-cover mb-2" />
                  <span className="font-extrabold text-xs text-[#2C2724]">{item.name}</span>
                  <span className="text-[10px] text-rose-700 font-bold">{item.regionalName}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowHintModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#3B7A57] text-white text-xs font-black cursor-pointer"
            >
              Got it, continue shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
