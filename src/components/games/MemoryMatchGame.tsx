import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  HelpCircle, 
  Brain,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CulturalCardItem, GameSession, RegionalLanguage } from '../../types';
import { CULTURAL_CARDS } from '../../data/culturalContent';
import { playSoothingChime, speakText } from '../../utils/sound';

interface MemoryMatchGameProps {
  language: RegionalLanguage;
  highContrast: boolean;
  onGameComplete: (session: GameSession) => void;
}

interface ActiveCard {
  uniqueId: string;
  card: CulturalCardItem;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  language,
  highContrast,
  onGameComplete,
}) => {
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(1);
  const [cards, setCards] = useState<ActiveCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isWon, setIsWon] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string>('Tap any card to reveal its North Eastern cultural picture.');

  const initGame = useCallback((level: 1 | 2 | 3) => {
    const pairCounts = { 1: 2, 2: 3, 3: 4 };
    const neededPairs = pairCounts[level];
    const selected = CULTURAL_CARDS.slice(0, neededPairs);

    const deck: ActiveCard[] = [];
    selected.forEach((item) => {
      deck.push({
        uniqueId: `${item.id}-a`,
        card: item,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        uniqueId: `${item.id}-b`,
        card: item,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle gently
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setIsWon(false);
    setStartTime(Date.now());
    setAiMessage(
      level === 1 
        ? 'Gentle 2-pair matching. Take all the time you need, Dada.' 
        : `Cultural matching with ${neededPairs} pairs. Enjoy the familiar pictures.`
    );
  }, []);

  useEffect(() => {
    initGame(difficulty);
  }, [difficulty, initGame]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    playSoothingChime('tap');

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // Speak card name
    speakText(cards[index].card.name, language);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [idx1, idx2] = newFlipped;
      const card1 = cards[idx1];
      const card2 = cards[idx2];

      if (card1.card.id === card2.card.id) {
        // MATCH!
        playSoothingChime('match');
        setAiMessage(`Wonderful! You paired the ${card1.card.name} (${card1.card.regionalName}).`);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => (i === idx1 || i === idx2 ? { ...c, isMatched: true } : c))
          );
          setFlippedIndices([]);

          // Check if game won
          const remaining = cards.filter((c, i) => !c.isMatched && i !== idx1 && i !== idx2);
          if (remaining.length === 0) {
            handleVictory();
          }
        }, 500);
      } else {
        // NON-PUNITIVE MISMATCH
        setAiMessage('Let us look at another pair with a gentle heart.');

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => (i === idx1 || i === idx2 ? { ...c, isFlipped: false } : c))
          );
          setFlippedIndices([]);
        }, 1100);
      }
    }
  };

  const handleVictory = () => {
    setIsWon(true);
    playSoothingChime('celebrate');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    const elapsed = Date.now() - startTime;
    const accuracy = Math.max(60, Math.min(100, Math.round((cards.length / (moves * 2 || 1)) * 100)));

    const session: GameSession = {
      id: `session-${Date.now()}`,
      gameType: 'memory_match',
      difficulty,
      moves: moves + 1,
      accuracy,
      reactionTimeMs: elapsed,
      completedAt: new Date().toISOString(),
      synced: false,
      notes: `Matched ${cards.length / 2} picturesque NER pairs in ${(elapsed / 1000).toFixed(1)}s`,
    };

    onGameComplete(session);
    setAiMessage('🌸 Beautiful work! You exercised your memory and brought joy to the garden.');
    speakText('Wonderful! You finished the memory exercise gracefully.', language);
  };

  return (
    <div 
      id="memory-match-game-container"
      className={`rounded-3xl p-5 sm:p-7 border shadow-sm transition-all ${
        highContrast 
          ? 'bg-[#1C1C1C] border-yellow-400 text-yellow-50' 
          : 'bg-white border-[#E8DFC8] text-[#2C2724]'
      }`}
    >
      {/* Header & Level Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-md shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight font-['Outfit']">
                Memory Cards
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900">
                Visual Pictures
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6C5E53] mt-0.5">
              Pair the familiar North Eastern photos at your own comfortable pace
            </p>
          </div>
        </div>

        {/* Difficulty Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#73665A]">Difficulty:</span>
          <div className="flex bg-[#ECE4D4] p-1 rounded-xl text-xs font-extrabold">
            <button
              onClick={() => setDifficulty(1)}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                difficulty === 1 ? 'bg-[#3B7A57] text-white shadow-xs' : 'text-[#6C5E53]'
              }`}
            >
              Gentle (4 Cards)
            </button>
            <button
              onClick={() => setDifficulty(2)}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                difficulty === 2 ? 'bg-[#3B7A57] text-white shadow-xs' : 'text-[#6C5E53]'
              }`}
            >
              Comfort (6 Cards)
            </button>
            <button
              onClick={() => setDifficulty(3)}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                difficulty === 3 ? 'bg-[#3B7A57] text-white shadow-xs' : 'text-[#6C5E53]'
              }`}
            >
              Active (8 Cards)
            </button>
          </div>
        </div>
      </div>

      {/* AI Guiding Companion Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#FAF5EC] to-[#F5EEE0] border border-[#EADBCC] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#4E4238]">
          <Sparkles className="w-5 h-5 text-[#D97706] shrink-0" />
          <span className="font-semibold">{aiMessage}</span>
        </div>
        <button
          onClick={() => speakText(aiMessage, language)}
          title="Listen to hint"
          className="p-2 rounded-xl bg-white/80 hover:bg-white text-[#5F5347] hover:text-[#3B7A57] shadow-2xs cursor-pointer shrink-0"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Cards Grid with Picture Imagery */}
      <div 
        className={`grid gap-3 sm:gap-5 justify-items-center mb-6 ${
          difficulty === 1 
            ? 'grid-cols-2 max-w-lg mx-auto' 
            : difficulty === 2 
            ? 'grid-cols-2 sm:grid-cols-3 max-w-2xl mx-auto' 
            : 'grid-cols-2 sm:grid-cols-4 max-w-3xl mx-auto'
        }`}
      >
        {cards.map((cardItem, idx) => {
          const isRevealed = cardItem.isFlipped || cardItem.isMatched;

          return (
            <button
              key={cardItem.uniqueId}
              id={`memory-card-${idx}`}
              onClick={() => handleCardClick(idx)}
              disabled={isRevealed || isWon}
              className={`w-full aspect-[3.5/4] rounded-2xl overflow-hidden flex flex-col text-center transition-all duration-300 transform active:scale-95 cursor-pointer select-none border-3 shadow-md relative ${
                isRevealed
                  ? 'bg-white border-[#3B7A57]'
                  : 'bg-gradient-to-br from-[#EFE8D8] via-[#E5DAC4] to-[#D5C7AE] border-[#CFC0A7] hover:border-[#3B7A57]/60'
              } ${cardItem.isMatched ? 'ring-4 ring-emerald-400/80 shadow-lg' : ''}`}
            >
              {isRevealed ? (
                <div className="flex flex-col h-full w-full">
                  {/* Photo Container */}
                  <div className="relative w-full h-[65%] overflow-hidden bg-gray-100">
                    <img 
                      src={cardItem.card.imageUrl} 
                      alt={cardItem.card.name} 
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    {cardItem.isMatched && (
                      <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  {/* Text Container */}
                  <div className="p-2 sm:p-2.5 flex flex-col items-center justify-center flex-1 bg-white">
                    <h4 className="font-extrabold text-xs sm:text-sm text-[#2C2724] leading-tight">
                      {cardItem.card.name}
                    </h4>
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#3B7A57] truncate max-w-full">
                      {cardItem.card.regionalName}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-xs flex items-center justify-center shadow-xs border border-[#DFD3BE]">
                    <ImageIcon className="w-7 h-7 text-[#8B7D6F]" />
                  </div>
                  <span className="text-xs font-black tracking-wider text-[#685D52] uppercase">
                    Tap Photo
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Controls & Non-punitive Replay */}
      <div className="flex items-center justify-between pt-4 border-t border-[#F0EAE1]">
        <div className="text-xs sm:text-sm text-[#73675E]">
          <span>Attempts: <strong>{moves}</strong> • No Rush</span>
        </div>

        <button
          onClick={() => {
            playSoothingChime('tap');
            initGame(difficulty);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#D9CEB8] bg-white hover:bg-[#FAF7F2] text-[#4F4439] text-xs sm:text-sm font-black shadow-xs cursor-pointer transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-[#3B7A57]" />
          <span>New Picture Cards</span>
        </button>
      </div>
    </div>
  );
};
