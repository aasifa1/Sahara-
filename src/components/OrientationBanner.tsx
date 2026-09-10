import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sun, Volume2, Sparkles, MapPin } from 'lucide-react';
import { RegionalLanguage } from '../types';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '../data/culturalContent';
import { speakText, playSoothingChime } from '../utils/sound';

interface OrientationBannerProps {
  language: RegionalLanguage;
  highContrast: boolean;
  completedTasksCount: number;
  totalTasksCount: number;
}

export const OrientationBanner: React.FC<OrientationBannerProps> = ({
  language,
  highContrast,
  completedTasksCount,
  totalTasksCount,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const welcomeSub = UI_TRANSLATIONS.welcomeSubtitle[language] || UI_TRANSLATIONS.welcomeSubtitle['en'];

  const handleSpeakGreeting = () => {
    playSoothingChime('tap');
    setIsSpeaking(true);
    const textToSpeak = `${langObj.greeting}. Today is ${currentDate}. The time is ${currentTime}. ${welcomeSub}`;
    speakText(textToSpeak, language, () => setIsSpeaking(false));
  };

  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return (
    <div 
      id="orientation-banner"
      className={`rounded-2xl p-5 sm:p-7 border shadow-sm transition-all ${
        highContrast
          ? 'bg-[#1C1C1C] border-yellow-400 text-yellow-50'
          : 'bg-gradient-to-br from-[#FFFBF2] via-[#FDF8EE] to-[#F5EEDD] border-[#EADFCB] text-[#2F2923]'
      }`}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        {/* Left Side: Reality Orientation Data */}
        <div className="space-y-2 flex-1">
          {/* Cues Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#6C5E53]">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
              <Calendar className="w-3.5 h-3.5" />
              {currentDate || 'Today'}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              <Clock className="w-3.5 h-3.5" />
              {currentTime}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-900 border border-orange-200">
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              Pleasant Autumn Day
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
              <MapPin className="w-3.5 h-3.5 text-teal-700" />
              Guwahati, Assam
            </span>
          </div>

          {/* Warm Personalized Greeting */}
          <div className="pt-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2C2724] tracking-tight font-['Outfit']">
              {langObj.greeting}
            </h1>
            <p className="text-sm sm:text-base text-[#61554A] mt-1.5 max-w-2xl leading-relaxed">
              {welcomeSub}
            </p>
          </div>

          {/* Voice Read-Aloud Button */}
          <div className="pt-1">
            <button
              id="btn-speak-greeting"
              onClick={handleSpeakGreeting}
              disabled={isSpeaking}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3B7A57] hover:bg-[#2F6346] text-white text-xs sm:text-sm font-bold shadow-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-75"
            >
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
              <span>{isSpeaking ? 'Speaking softly...' : 'Listen to Orientation (Speech)'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Garden Growth Metaphor */}
        <div 
          id="garden-progress-box"
          className="w-full lg:w-80 p-4 rounded-xl bg-white/80 border border-[#E0D4BE] shadow-xs shrink-0"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#3B7A57]">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Garden of Kopou Orchids</span>
            </div>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-[#3B7A57]/15 text-[#3B7A57]">
              {completedTasksCount}/{totalTasksCount} Cares Done
            </span>
          </div>

          <div className="w-full bg-[#ECE4D4] rounded-full h-3 overflow-hidden">
            <div
              className="bg-[#3B7A57] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-[#6E645D] mt-2 italic text-center">
            {progressPercent === 100 
              ? '🌸 Beautiful! Your morning garden is in full bloom today!' 
              : '💧 Every completed care nurtures the regional orchid blossoms.'}
          </p>
        </div>
      </div>
    </div>
  );
};
