import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  RotateCcw, 
  Type,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameSession, RegionalLanguage } from '../../types';
import { WORD_PICTURE_ITEMS } from '../../data/culturalContent';
import { playSoothingChime, speakText } from '../../utils/sound';

interface WordMatchGameProps {
  language: RegionalLanguage;
  highContrast: boolean;
  onGameComplete: (session: GameSession) => void;
}

interface MatchItem {
  id: string;
  word: string;
  pronunciation: string;
  imageUrl: string;
}

export const WordMatchGame: React.FC<WordMatchGameProps> = ({
  language,
  highContrast,
  onGameComplete,
}) => {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [items, setItems] = useState<MatchItem[]>([]);
  const [shuffledWords, setShuffledWords] = useState<MatchItem[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const initRound = useCallback(() => {
    // Pick 3 items
    const shuffled = [...WORD_PICTURE_ITEMS].sort(() => 0.5 - Math.random()).slice(0, 3);
    const mapped: MatchItem[] = shuffled.map((item) => ({
      id: item.id,
      word: item.words[language] || item.words.en,
      pronunciation: item.pronunciation,
      imageUrl: item.imageUrl,
    }));

    setItems(mapped);
    setShuffledWords([...mapped].sort(() => 0.5 - Math.random()));
    setMatchedIds([]);
    setSelectedImageId(null);
    setSelectedWordId(null);
    setFeedback(null);
    setIsWon(false);
    setStartTime(Date.now());

    speakText('Tap a picture, then tap its matching word.', language);
  }, [language]);

  useEffect(() => {
    initRound();
  }, [initRound]);

  const handleTapImage = (id: string) => {
    if (matchedIds.includes(id) || isWon) return;

    playSoothingChime('tap');
    setSelectedImageId(id);

    const item = items.find((i) => i.id === id);
    if (item) {
      speakText(item.word, language);
    }

    if (selectedWordId) {
      checkMatch(id, selectedWordId);
    }
  };

  const handleTapWord = (id: string) => {
    if (matchedIds.includes(id) || isWon) return;

    playSoothingChime('tap');
    setSelectedWordId(id);

    const item = items.find((i) => i.id === id);
    if (item) {
      speakText(item.word, language);
    }

    if (selectedImageId) {
      checkMatch(selectedImageId, id);
    }
  };

  const checkMatch = (imgId: string, wordId: string) => {
    if (imgId === wordId) {
      // MATCH!
      playSoothingChime('match');
      const nextMatched = [...matchedIds, imgId];
      setMatchedIds(nextMatched);
      setSelectedImageId(null);
      setSelectedWordId(null);

      const matchedItem = items.find((i) => i.id === imgId);
      const msg = `Wonderful! "${matchedItem?.word}" matches the picture!`;
      setFeedback(msg);

      if (nextMatched.length === items.length) {
        setIsWon(true);
        playSoothingChime('celebrate');
        confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });

        const elapsed = Date.now() - startTime;
        const session: GameSession = {
          id: `session-word-${Date.now()}`,
          gameType: 'word_match',
          difficulty: 1,
          moves: nextMatched.length,
          accuracy: 100,
          reactionTimeMs: elapsed,
          completedAt: new Date().toISOString(),
          synced: false,
          notes: `Matched ${items.length} words and pictures in regional language (${language})`,
        };
        onGameComplete(session);
        speakText('All words matched gracefully! Your mind is bright and sharp.', language);
      }
    } else {
      playSoothingChime('gentle_bell');
      setFeedback("Let's look closely at the word and picture. Try another pairing!");
      setTimeout(() => {
        setSelectedImageId(null);
        setSelectedWordId(null);
      }, 700);
    }
  };

  return (
    <div 
      id="word-picture-match-game"
      className={`rounded-3xl p-5 sm:p-7 border shadow-sm transition-all ${
        highContrast 
          ? 'bg-[#1C1C1C] border-yellow-400 text-yellow-50' 
          : 'bg-white border-[#E8DFC8] text-[#2C2724]'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Type className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight font-['Outfit']">
                Word & Picture Match
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900">
                NER Multilingual
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6C5E53] mt-0.5">
              Connect the pictures with words in your regional native tongue
            </p>
          </div>
        </div>

        <button
          onClick={initRound}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B7A57] text-white text-xs font-black hover:bg-[#2F6346] shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <span>New Words Round</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Two Column Layout: Left Pictures, Right Words */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pictures Column */}
        <div className="space-y-3">
          <span className="text-xs font-black text-[#5C4F44] uppercase tracking-wider block">
            1. Tap a Familiar Picture:
          </span>
          <div className="space-y-3">
            {items.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isSelected = selectedImageId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTapImage(item.id)}
                  disabled={isMatched || isWon}
                  className={`w-full p-3 rounded-2xl border-2 flex items-center gap-3.5 text-left transition-all active:scale-98 shadow-xs cursor-pointer ${
                    isMatched
                      ? 'border-emerald-500 bg-emerald-50 opacity-80 ring-2 ring-emerald-300'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50 ring-3 ring-blue-300'
                      : 'border-[#E2D8C6] hover:border-blue-400 bg-white hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 shadow-2xs">
                    <img src={item.imageUrl} alt={item.word} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      Picture
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-[#2C2724]">
                      {isMatched ? item.word : 'Tap to select'}
                    </h4>
                  </div>
                  {isMatched && (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Words Column */}
        <div className="space-y-3">
          <span className="text-xs font-black text-[#5C4F44] uppercase tracking-wider block">
            2. Tap the Matching Word:
          </span>
          <div className="space-y-3">
            {shuffledWords.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isSelected = selectedWordId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTapWord(item.id)}
                  disabled={isMatched || isWon}
                  className={`w-full min-h-[76px] sm:min-h-[88px] p-4 rounded-2xl border-2 flex items-center justify-between text-left transition-all active:scale-98 shadow-xs cursor-pointer ${
                    isMatched
                      ? 'border-emerald-500 bg-emerald-50 opacity-80 ring-2 ring-emerald-300'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50 ring-3 ring-blue-300'
                      : 'border-[#E2D8C6] hover:border-blue-400 bg-white hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-blue-700 uppercase block">
                      Regional Word
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-[#2C2724]">
                      {item.word}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(item.word, language);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    {isMatched && (
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 mb-4 ${
          isWon 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
            : 'bg-blue-50 border-blue-300 text-blue-950'
        }`}>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
            {isWon ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />}
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
          onClick={initRound}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D9CEB8] bg-white hover:bg-[#FAF7F2] text-[#4F4439] text-xs font-bold shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#3B7A57]" />
          <span>Shuffle Round</span>
        </button>

        {isWon && (
          <button
            onClick={initRound}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B7A57] text-white text-xs sm:text-sm font-black hover:bg-[#2F6346] shadow-sm cursor-pointer"
          >
            <span>Play Next Words</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
