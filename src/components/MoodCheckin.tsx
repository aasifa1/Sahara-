import React, { useState } from 'react';
import { Sparkles, Volume2, Smile, Meh, Frown, Heart, Sun } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MoodLevel, RegionalLanguage } from '../types';
import { UI_TRANSLATIONS } from '../data/culturalContent';
import { playSoothingChime, speakText } from '../utils/sound';

interface MoodCheckinProps {
  language: RegionalLanguage;
  highContrast: boolean;
  onRecordMood: (mood: MoodLevel) => void;
}

interface MoodOption {
  level: MoodLevel;
  label: string;
  regionalLabel: Record<string, string>;
  icon: React.ReactNode;
  color: string;
  comfortMessage: string;
}

export const MoodCheckin: React.FC<MoodCheckinProps> = ({
  language,
  highContrast,
  onRecordMood,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [comfortText, setComfortText] = useState<string | null>(null);

  const t = (key: string) => UI_TRANSLATIONS[key]?.[language] || UI_TRANSLATIONS[key]?.['en'] || key;

  const MOODS: MoodOption[] = [
    {
      level: 'peaceful',
      label: 'Peaceful',
      regionalLabel: {
        en: 'Peaceful',
        as: 'শান্তিপূর্ণ',
        bn: 'শান্তিময়',
        hi: 'शांत',
        mni: 'নুংঙাইবা',
      },
      icon: <Sun className="w-8 h-8 text-amber-500" />,
      color: '#FEF3C7',
      comfortMessage: 'Wonderful! A peaceful mind is like the calm morning breeze over the Brahmaputra.',
    },
    {
      level: 'happy',
      label: 'Joyful & Cheerful',
      regionalLabel: {
        en: 'Joyful',
        as: 'আনন্দময়',
        bn: 'আনন্দিত',
        hi: 'प्रसन्न',
        mni: 'হরাওবা',
      },
      icon: <Smile className="w-8 h-8 text-emerald-600" />,
      color: '#D1FAE5',
      comfortMessage: 'Your smile lights up the room, Dada! Let this joy carry throughout your day.',
    },
    {
      level: 'calm',
      label: 'Calm & Rested',
      regionalLabel: {
        en: 'Calm',
        as: 'স্থিৰ',
        bn: 'স্থির',
        hi: 'सहज',
        mni: 'তপ্পা',
      },
      icon: <Heart className="w-8 h-8 text-rose-500" />,
      color: '#FFE4E6',
      comfortMessage: 'Gentle calm preserves our strength and fills our heart with gratitude.',
    },
    {
      level: 'tired',
      label: 'Tired / Need Rest',
      regionalLabel: {
        en: 'Tired',
        as: 'ভাগৰুৱা',
        bn: 'ক্লান্ত',
        hi: 'थका हुआ',
        mni: 'থকপা',
      },
      icon: <Meh className="w-8 h-8 text-slate-500" />,
      color: '#F1F5F9',
      comfortMessage: 'It is completely fine to take a gentle rest on the veranda armchair. Rest heals us.',
    },
    {
      level: 'low',
      label: 'Need Comfort',
      regionalLabel: {
        en: 'Need Hug',
        as: 'মৰম লাগে',
        bn: 'আদর চাই',
        hi: 'स्नेह चाहिए',
        mni: 'নুংশিবা দরকার',
      },
      icon: <Frown className="w-8 h-8 text-sky-600" />,
      color: '#E0F2FE',
      comfortMessage: 'You are deeply cherished and never alone. Family and caregivers are always right here beside you.',
    },
  ];

  const handleSelect = (mood: MoodOption) => {
    setSelectedMood(mood.level);
    setComfortText(mood.comfortMessage);
    playSoothingChime('gentle_bell');
    speakText(mood.comfortMessage, language);
    onRecordMood(mood.level);

    if (mood.level === 'peaceful' || mood.level === 'happy') {
      confetti({ particleCount: 25, spread: 40, origin: { y: 0.7 } });
    }
  };

  return (
    <div 
      id="mood-checkin-section"
      className={`rounded-2xl p-5 sm:p-6 border shadow-xs transition-all ${
        highContrast 
          ? 'bg-[#1C1C1C] border-yellow-400 text-yellow-50' 
          : 'bg-white border-[#E8DFC8] text-[#2C2724]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#F0EAE1]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight font-['Outfit']">
            {t('moodCheckin')}
          </h2>
          <p className="text-xs sm:text-sm text-[#70645A]">
            Single tap to share how your heart feels right now
          </p>
        </div>
        <span className="text-xs font-semibold text-[#3B7A57] bg-[#3B7A57]/10 px-3 py-1 rounded-full self-start sm:self-auto">
          🌸 Waters the Garden
        </span>
      </div>

      {/* 5 Gentle Face Options */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood.level;
          const regLabel = mood.regionalLabel[language] || mood.label;

          return (
            <button
              key={mood.level}
              id={`btn-mood-${mood.level}`}
              onClick={() => handleSelect(mood)}
              className={`min-h-[110px] p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all transform active:scale-95 cursor-pointer ${
                isSelected
                  ? 'border-[#3B7A57] ring-3 ring-[#3B7A57]/20 shadow-sm scale-102'
                  : 'border-[#E2D8C6] hover:border-[#D0C2AB] bg-[#FAF8F5]'
              }`}
              style={{ backgroundColor: isSelected ? mood.color : undefined }}
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xs">
                {mood.icon}
              </div>
              <span className="font-extrabold text-xs sm:text-sm text-[#2C2724] leading-tight">
                {regLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Comforting Response */}
      {comfortText && (
        <div className="p-4 rounded-xl bg-[#FAF5EC] border border-[#EADBCC] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#483B2E]">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{comfortText}</span>
          </div>
          <button
            onClick={() => speakText(comfortText, language)}
            title="Listen again"
            className="p-2 rounded-lg text-[#5F5347] hover:text-[#3B7A57] cursor-pointer shrink-0"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
