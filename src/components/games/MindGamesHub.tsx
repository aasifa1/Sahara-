import React, { useState } from 'react';
import { 
  Brain, 
  Clock, 
  Layers, 
  ShoppingCart, 
  Footprints, 
  Type, 
  Headphones, 
  Sparkles, 
  Volume2, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Flower2,
  Play
} from 'lucide-react';
import { GameSession, RegionalLanguage } from '../../types';
import { MemoryMatchGame } from './MemoryMatchGame';
import { RoutineRecallGame } from './RoutineRecallGame';
import { PatternFocusGame } from './PatternFocusGame';
import { MemoryShoppingGame } from './MemoryShoppingGame';
import { WhatNextGame } from './WhatNextGame';
import { WordMatchGame } from './WordMatchGame';
import { ListenTapGame } from './ListenTapGame';
import { playSoothingChime, speakText } from '../../utils/sound';

export type CognitiveGameId = 
  | 'memory_cards'
  | 'daily_routine'
  | 'ner_pattern'
  | 'memory_shopping'
  | 'what_next'
  | 'word_match'
  | 'listen_tap';

interface MindGamesHubProps {
  language: RegionalLanguage;
  highContrast: boolean;
  gameSessions: GameSession[];
  onGameComplete: (session: GameSession) => void;
}

interface GameDefinition {
  id: CognitiveGameId;
  title: string;
  regionalTitle: Record<RegionalLanguage, string>;
  subtitle: string;
  benefit: string;
  colorGradient: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  icon: React.ReactNode;
  tags: string[];
}

export const MindGamesHub: React.FC<MindGamesHubProps> = ({
  language,
  highContrast,
  gameSessions,
  onGameComplete,
}) => {
  const [activeGame, setActiveGame] = useState<CognitiveGameId | null>(null);

  const gamesList: GameDefinition[] = [
    {
      id: 'memory_cards',
      title: 'Memory Cards',
      regionalTitle: {
        as: 'ছবিৰ স্মৃতি কাৰ্ড',
        bn: 'ছবির মেমোরি কার্ড',
        hi: 'तस्वीर स्मृति कार्ड',
        mni: 'ফোতো মেমোরি কার্দ',
        en: 'Picture Memory Cards',
      },
      subtitle: 'Pair familiar cultural photos of Assam, Majuli, and Kaziranga at your own gentle pace.',
      benefit: 'Visual Memory',
      colorGradient: 'from-emerald-500 via-emerald-600 to-teal-700',
      borderColor: 'border-emerald-300 hover:border-emerald-500',
      badgeBg: 'bg-emerald-100 text-emerald-900',
      badgeText: 'Emerald Calm',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-emerald-500/30',
      icon: <Brain className="w-10 h-10 sm:w-11 sm:h-11" />,
      tags: ['Visual Photos', 'Cultural Pairs', 'Gentle Matching'],
    },
    {
      id: 'daily_routine',
      title: 'Daily Routine Recall',
      regionalTitle: {
        as: 'দৈনন্দিন দিনলিপি ক্ৰম',
        bn: 'দৈনন্দিন রুটিন সাজানো',
        hi: 'दैनिक दिनचर्या क्रम',
        mni: 'নুমিৎ খুদিংগী থবক',
        en: 'Daily Routine Recall',
      },
      subtitle: 'Arrange familiar daily activities (wake up, warm water, medicine, chai) in proper order.',
      benefit: 'Sequencing & Orientation',
      colorGradient: 'from-amber-500 via-orange-500 to-amber-700',
      borderColor: 'border-amber-300 hover:border-amber-500',
      badgeBg: 'bg-amber-100 text-amber-900',
      badgeText: 'Amber Warmth',
      iconBg: 'bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-amber-500/30',
      icon: <Clock className="w-10 h-10 sm:w-11 sm:h-11" />,
      tags: ['Daily Habits', 'Step Ordering', 'Time Flow'],
    },
    {
      id: 'ner_pattern',
      title: 'NER Pattern & Nature',
      regionalTitle: {
        as: 'উত্তৰ-পূব প্ৰকৃতিৰ ছন্দ',
        bn: 'উত্তর-পূর্ব প্রকৃতির ছন্দ',
        hi: 'पूर्वोत्तर प्रकृति पैटर्न',
        mni: 'নোংপোক পুন্সি ময়েক',
        en: 'NER Pattern & Nature',
      },
      subtitle: 'Complete rhythmic patterns inspired by North Eastern wildlife, tea leaves, and textiles.',
      benefit: 'Pattern Logic',
      colorGradient: 'from-indigo-500 via-indigo-600 to-purple-700',
      borderColor: 'border-indigo-300 hover:border-indigo-500',
      badgeBg: 'bg-indigo-100 text-indigo-900',
      badgeText: 'Indigo Wisdom',
      iconBg: 'bg-gradient-to-br from-indigo-400 to-purple-600 text-white shadow-indigo-500/30',
      icon: <Layers className="w-10 h-10 sm:w-11 sm:h-11" />,
      tags: ['Nature Rhythms', 'Visual Deductions', 'Culture Symbols'],
    },
    {
      id: 'memory_shopping',
      title: 'Memory Shopping',
      regionalTitle: {
        as: 'বজাৰৰ স্মৃতি তালিকা',
        bn: 'বাজারের কেনাকাটা স্মৃতি',
        hi: 'बाजार खरीदारी स्मृति',
        mni: 'কৈথেলগী মেমোরি',
        en: 'Bazaar Memory Shopping',
      },
      subtitle: 'Remember 2 to 3 familiar items for Guwahati bazaar and collect them from the market stall.',
      benefit: 'Short-Term Memory',
      colorGradient: 'from-rose-500 via-rose-600 to-red-700',
      borderColor: 'border-rose-300 hover:border-rose-500',
      badgeBg: 'bg-rose-100 text-rose-900',
      badgeText: 'Rose Joy',
      iconBg: 'bg-gradient-to-br from-rose-400 to-pink-600 text-white shadow-rose-500/30',
      icon: <ShoppingCart className="w-10 h-10 sm:w-11 sm:h-11" />,
      tags: ['Bazaar Trip', 'Recall & Pick', 'Zero Stress'],
    },
    {
      id: 'what_next',
      title: 'What Comes Next?',
      regionalTitle: {
        as: 'ইয়াৰ পিছত কি হ’ব?',
        bn: 'এর পরে কী ঘটবে?',
        hi: 'इसके बाद क्या होगा?',
        mni: 'মদুদা করম্বা থোক্কনি?',
        en: 'What Comes Next?',
      },
      subtitle: 'Look at a warm cultural story (preparing chai, welcoming guests) and pick what happens next.',
      benefit: 'Story Logic',
      colorGradient: 'from-teal-500 via-teal-600 to-cyan-700',
      borderColor: 'border-teal-300 hover:border-teal-500',
      badgeBg: 'bg-teal-100 text-teal-900',
      badgeText: 'Teal Harmony',
      iconBg: 'bg-gradient-to-br from-teal-400 to-cyan-600 text-white shadow-teal-500/30',
      icon: <Footprints className="w-10 h-10 sm:w-11 sm:h-11" />,
      tags: ['Activity Logic', 'Story Sequences', 'Comforting Routines'],
    },
    {
      id: 'word_match',
      title: 'Word & Picture Match',
      regionalTitle: {
        as: 'শব্দ আৰু ছবিৰ সংযোগ',
        bn: 'শব্দ ও ছবির মিলন',
        hi: 'शब्द और चित्र मिलान',
        mni: 'ৱাহৈ অমসুং ফোতো মিলান',
        en: 'Word & Picture Match',
      },
      subtitle: 'Match pictures with native words supporting Assamese, Bengali, Meitei, Hindi & English.',
      benefit: 'NER Multilingual Recall',
      colorGradient: 'from-blue-500 via-blue-600 to-sky-700',
      borderColor: 'border-blue-300 hover:border-blue-500',
      badgeBg: 'bg-blue-100 text-blue-900',
      badgeText: 'Sky Clarity',
      iconBg: 'bg-gradient-to-br from-blue-400 to-sky-600 text-white shadow-blue-500/30',
      icon: <Type className="w-10 h-10 sm:w-11 sm:h-11" />,
      tags: ['Regional Tongue', 'Voice Readout', 'Picture Connections'],
    },
    {
      id: 'listen_tap',
      title: 'Listen & Tap',
      regionalTitle: {
        as: 'শুনি টেপ কৰক',
        bn: 'শুনে ট্যাপ করুন',
        hi: 'सुनें और टैप करें',
        mni: 'তাদুনা তাপ তৌবীয়ু',
        en: 'Listen & Tap',
      },
      subtitle: 'Sahara speaks a gentle voice instruction aloud; simply listen peacefully and tap the correct object.',
      benefit: 'Auditory Comprehension',
      colorGradient: 'from-purple-500 via-purple-600 to-fuchsia-700',
      borderColor: 'border-purple-300 hover:border-purple-500',
      badgeBg: 'bg-purple-100 text-purple-900',
      badgeText: 'Purple Peace',
      iconBg: 'bg-gradient-to-br from-purple-400 to-fuchsia-600 text-white shadow-purple-500/30',
      icon: <Headphones className="w-10 h-10 sm:w-11 sm:h-11" />,
      tags: ['Voice Instruction', 'Auditory Care', 'One-Tap Action'],
    },
  ];

  const handleSelectGame = (id: CognitiveGameId) => {
    playSoothingChime('tap');
    setActiveGame(id);
    const game = gamesList.find((g) => g.id === id);
    if (game) {
      speakText(`Opening ${game.title}. ${game.regionalTitle[language] || ''}`, language);
    }
  };

  const handleBackToHub = () => {
    playSoothingChime('tap');
    setActiveGame(null);
  };

  const handleVoicePreview = (e: React.MouseEvent, game: GameDefinition) => {
    e.stopPropagation();
    const text = `${game.title}. ${game.regionalTitle[language] || ''}. ${game.subtitle}`;
    speakText(text, language);
  };

  const completedTodayCount = gameSessions.length;

  return (
    <div id="mind-games-hub-container" className="space-y-6">
      {/* If No Active Game: SHOW THE 7 COLORFUL GAME CARDS */}
      {!activeGame && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-[#FAF5EC] via-[#F6EDE0] to-[#EFE2CE] border-2 border-[#E3D4BC] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#3B7A57] text-white flex items-center gap-1.5 shadow-2xs">
                  <Flower2 className="w-3.5 h-3.5" />
                  <span>7 Mindful Cognitive Exercises</span>
                </span>
                <span className="text-xs font-bold text-[#7A6B5C]">
                  Offline-Ready • No Stress
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2C2724] tracking-tight font-['Outfit']">
                Cultural Mind Games for Dada & Ba
              </h2>
              <p className="text-xs sm:text-sm text-[#5C4F44] max-w-2xl leading-relaxed">
                Seven gentle, colorful cognitive games grounded in North Eastern traditions, folklore, and everyday routines. Tap any big card below to exercise memory with joyful ease.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/90 border border-[#DACBB0] shadow-xs shrink-0 self-stretch md:self-auto">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg shadow-2xs">
                🌸
              </div>
              <div>
                <span className="text-xs font-bold text-[#73665A] block">
                  Garden Sessions
                </span>
                <span className="text-base font-black text-[#2C2724]">
                  {completedTodayCount} Completed
                </span>
              </div>
            </div>
          </div>

          {/* 7 COLORFUL REARRANGED GAME CARDS WITH BIGGER ICONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {gamesList.map((game, index) => {
              const isFirstFeatured = index === 0;

              return (
                <div
                  key={game.id}
                  id={`game-card-${game.id}`}
                  onClick={() => handleSelectGame(game.id)}
                  className={`group rounded-3xl p-5 sm:p-6 border-3 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer select-none bg-white shadow-sm hover:shadow-xl relative flex flex-col justify-between ${
                    game.borderColor
                  } ${isFirstFeatured ? 'md:col-span-2 lg:col-span-1 ring-2 ring-emerald-400/30' : ''}`}
                >
                  {/* Top Bar: Benefit Badge & Sound Preview */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${game.badgeBg} shadow-2xs`}>
                        {game.benefit}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleVoicePreview(e, game)}
                        title="Listen to Game Intro"
                        className="p-2 rounded-xl bg-gray-100/80 hover:bg-gray-200 text-gray-700 hover:text-[#3B7A57] cursor-pointer transition-colors shadow-2xs"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* BIG ICON & TITLES */}
                    <div className="flex items-start gap-4 mb-4">
                      {/* Bigger Icon Container */}
                      <div className={`w-20 h-20 sm:w-22 sm:h-22 rounded-3xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300 ${game.iconBg}`}>
                        {game.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 block mb-0.5">
                          Game #{index + 1}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-[#2C2724] tracking-tight group-hover:text-[#3B7A57] transition-colors leading-tight">
                          {game.regionalTitle[language] || game.title}
                        </h3>
                        {language !== 'en' && (
                          <p className="text-xs sm:text-sm font-extrabold text-[#3B7A57] mt-0.5 truncate">
                            {game.title}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {game.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#FAF6EE] text-[#695D51] border border-[#EADBCC]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Play Button Footer */}
                  <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8C8075]">
                      Calm & Timer-Free
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B7A57] group-hover:bg-[#2F6346] text-white text-xs sm:text-sm font-black shadow-md cursor-pointer transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Now</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* If Active Game: RENDER SELECTED GAME WITH QUICK SWITCH DOCK */}
      {activeGame && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Top Quick Navigation Bar */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E5DAC6] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <button
              onClick={handleBackToHub}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D9CEB8] bg-[#FAF8F5] hover:bg-[#F3EEDB] text-xs sm:text-sm font-black text-[#4F4439] cursor-pointer transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#3B7A57]" />
              <span>← All 7 Mind Games</span>
            </button>

            {/* Quick 7 Games Mini-Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {gamesList.map((g) => {
                const isCurrent = activeGame === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => handleSelectGame(g.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-[#3B7A57] text-white shadow-xs'
                        : 'bg-[#F6EFE3] hover:bg-[#EAE0D0] text-[#594E43]'
                    }`}
                  >
                    {g.regionalTitle[language] || g.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE GAME RENDERER */}
          <div>
            {activeGame === 'memory_cards' && (
              <MemoryMatchGame
                language={language}
                highContrast={highContrast}
                onGameComplete={onGameComplete}
              />
            )}

            {activeGame === 'daily_routine' && (
              <RoutineRecallGame
                language={language}
                highContrast={highContrast}
                onGameComplete={onGameComplete}
              />
            )}

            {activeGame === 'ner_pattern' && (
              <PatternFocusGame
                language={language}
                highContrast={highContrast}
                onGameComplete={onGameComplete}
              />
            )}

            {activeGame === 'memory_shopping' && (
              <MemoryShoppingGame
                language={language}
                highContrast={highContrast}
                onGameComplete={onGameComplete}
              />
            )}

            {activeGame === 'what_next' && (
              <WhatNextGame
                language={language}
                highContrast={highContrast}
                onGameComplete={onGameComplete}
              />
            )}

            {activeGame === 'word_match' && (
              <WordMatchGame
                language={language}
                highContrast={highContrast}
                onGameComplete={onGameComplete}
              />
            )}

            {activeGame === 'listen_tap' && (
              <ListenTapGame
                language={language}
                highContrast={highContrast}
                onGameComplete={onGameComplete}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
