import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Volume2, 
  Pill, 
  Droplet, 
  Utensils, 
  Footprints, 
  Calendar 
} from 'lucide-react';
import { RegionalLanguage, ReminderItem } from '../types';
import { UI_TRANSLATIONS } from '../data/culturalContent';
import { playSoothingChime, speakText } from '../utils/sound';

interface RemindersListProps {
  reminders: ReminderItem[];
  language: RegionalLanguage;
  highContrast: boolean;
  onToggleReminder: (id: string) => void;
}

export const RemindersList: React.FC<RemindersListProps> = ({
  reminders,
  language,
  highContrast,
  onToggleReminder,
}) => {
  const t = (key: string) => UI_TRANSLATIONS[key]?.[language] || UI_TRANSLATIONS[key]?.['en'] || key;

  const getCategoryIcon = (type: ReminderItem['type']) => {
    switch (type) {
      case 'medicine':
        return <Pill className="w-5 h-5 text-rose-600" />;
      case 'hydration':
        return <Droplet className="w-5 h-5 text-sky-600" />;
      case 'meal':
        return <Utensils className="w-5 h-5 text-amber-600" />;
      case 'activity':
        return <Footprints className="w-5 h-5 text-emerald-600" />;
      case 'appointment':
        return <Calendar className="w-5 h-5 text-indigo-600" />;
    }
  };

  const handleSpeak = (reminder: ReminderItem, e: React.MouseEvent) => {
    e.stopPropagation();
    playSoothingChime('tap');
    const regionalTitle = reminder.regionalTitle?.[language] || reminder.title;
    const prompt = `${reminder.time}. ${regionalTitle}. ${reminder.dosageOrDetail}`;
    speakText(prompt, language);
  };

  return (
    <div 
      id="daily-reminders-section"
      className={`rounded-2xl p-5 sm:p-6 border shadow-xs transition-all ${
        highContrast
          ? 'bg-[#1C1C1C] border-yellow-400 text-yellow-50'
          : 'bg-white border-[#E8DFC8] text-[#2C2724]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#F0EAE1]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#2C2724] tracking-tight font-['Outfit']">
            {t('todayRoutine')}
          </h2>
          <p className="text-xs sm:text-sm text-[#73675D]">
            Gentle reminders for medicine, hydration, and well-being
          </p>
        </div>
        <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-[#3B7A57]/10 text-[#3B7A57]">
          {reminders.filter(r => r.isCompleted).length} of {reminders.length} Completed
        </span>
      </div>

      <div className="space-y-3">
        {reminders.map((reminder) => {
          const regionalTitle = reminder.regionalTitle?.[language] || reminder.title;

          return (
            <div
              key={reminder.id}
              id={`reminder-item-${reminder.id}`}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all gap-3 ${
                reminder.isCompleted
                  ? 'bg-[#F9F7F4] border-[#E8E1D5] opacity-80'
                  : 'bg-[#FFFDF9] border-[#E2D8C6] hover:border-[#3B7A57] shadow-xs'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start gap-3.5 flex-1">
                <div 
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    reminder.isCompleted ? 'bg-gray-100' : 'bg-[#FAF3E7]'
                  }`}
                >
                  {getCategoryIcon(reminder.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#ECE4D4] text-[#554A41]">
                      <Clock className="w-3 h-3 text-[#7B6E63]" />
                      {reminder.time}
                    </span>
                    <h3 className={`text-base sm:text-lg font-bold ${
                      reminder.isCompleted ? 'line-through text-gray-400' : 'text-[#2C2724]'
                    }`}>
                      {regionalTitle}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#6C5F53] leading-relaxed">
                    {reminder.dosageOrDetail}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {/* Audio Read-Aloud Button */}
                <button
                  onClick={(e) => handleSpeak(reminder, e)}
                  title="Read aloud reminder"
                  className="p-2.5 rounded-xl border border-[#D9CEB8] bg-white text-[#5F5347] hover:text-[#3B7A57] hover:border-[#3B7A57] transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {/* Mark as Done Confirmation Button */}
                <button
                  onClick={() => onToggleReminder(reminder.id)}
                  className={`min-h-[48px] px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                    reminder.isCompleted
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-[#3B7A57] hover:bg-[#2F6346] text-white shadow-sm hover:shadow active:scale-95'
                  }`}
                >
                  {reminder.isCompleted ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      <span>{t('completed')}</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-5 h-5 text-emerald-200" />
                      <span>{t('markDone')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
