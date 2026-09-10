import React from 'react';
import { 
  Heart, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Globe, 
  LayoutDashboard, 
  Smile, 
  Mic
} from 'lucide-react';
import { RegionalLanguage, TextScale, UserRole } from '../types';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '../data/culturalContent';
import { playSoothingChime } from '../utils/sound';

interface NavbarProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  language: RegionalLanguage;
  setLanguage: (lang: RegionalLanguage) => void;
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  unsyncedCount: number;
  onSync: () => void;
  onOpenSos: () => void;
  onOpenVoice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  language,
  setLanguage,
  textScale,
  setTextScale,
  highContrast,
  setHighContrast,
  isOnline,
  setIsOnline,
  soundEnabled,
  setSoundEnabled,
  unsyncedCount,
  onSync,
  onOpenSos,
  onOpenVoice,
}) => {
  const t = (key: string) => UI_TRANSLATIONS[key]?.[language] || UI_TRANSLATIONS[key]?.['en'] || key;

  return (
    <header 
      id="sahara-main-header" 
      className={`sticky top-0 z-40 border-b transition-colors ${
        highContrast 
          ? 'bg-[#121212] border-yellow-400 text-yellow-100' 
          : 'bg-[#FAF7F2]/95 backdrop-blur-md border-[#E8DFC8] text-[#2C2724]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Platform Info */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div 
            id="sahara-logo-icon"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#E27D60] text-white flex items-center justify-center shadow-sm shrink-0"
          >
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#3B7A57] font-['Outfit']">
                Sahara
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-[#E27D60]/15 text-[#C86D51]">
                NER Companion
              </span>
            </div>
            <p className="text-xs text-[#6E645D] hidden sm:block">
              AI Cognitive & Memory Support • North Eastern Region
            </p>
          </div>
        </div>

        {/* Center Role Toggle */}
        <div 
          id="role-switch-container"
          className="flex items-center bg-[#ECE4D4] p-1 rounded-full text-xs sm:text-sm font-medium border border-[#DDD3BF]"
        >
          <button
            id="btn-patient-mode"
            onClick={() => {
              playSoothingChime('tap');
              setCurrentRole('patient');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              currentRole === 'patient'
                ? 'bg-[#3B7A57] text-white shadow-sm font-bold'
                : 'text-[#5A5048] hover:text-black'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span>Elderly Mode</span>
          </button>
          <button
            id="btn-caregiver-mode"
            onClick={() => {
              playSoothingChime('tap');
              setCurrentRole('caregiver');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              currentRole === 'caregiver'
                ? 'bg-[#3B7A57] text-white shadow-sm font-bold'
                : 'text-[#5A5048] hover:text-black'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Caregiver & ASHA</span>
          </button>
        </div>

        {/* Right Actions & Accessibility Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Voice Assistant Button */}
          {currentRole === 'patient' && (
            <button
              id="btn-voice-nav"
              onClick={onOpenVoice}
              title="Voice Assistant"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4A6B82] hover:bg-[#3B576C] text-white rounded-full font-medium text-xs sm:text-sm shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <Mic className="w-4 h-4 animate-pulse" />
              <span className="hidden md:inline">Voice Assistant</span>
            </button>
          )}

          {/* SOS Help Button */}
          <button
            id="btn-sos-trigger"
            onClick={onOpenSos}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#D9383A] hover:bg-[#B92B2D] text-white rounded-full font-bold text-xs sm:text-sm shadow-sm transition-all animate-none active:scale-95 cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{t('sosHelp')}</span>
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 absolute left-2.5 text-[#6E645D] pointer-events-none" />
            <select
              id="language-selector"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value as RegionalLanguage);
                playSoothingChime('tap');
              }}
              className="pl-7 pr-3 py-1 text-xs font-semibold rounded-lg bg-white border border-[#D8CEB9] text-[#4A4036] hover:border-[#3B7A57] focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Text Size Scaling */}
          <div 
            id="text-scale-selector"
            className="hidden sm:flex items-center border border-[#D8CEB9] rounded-lg overflow-hidden bg-white text-xs font-bold"
          >
            <button
              id="btn-font-normal"
              onClick={() => setTextScale('normal')}
              className={`px-2 py-1 transition-colors ${textScale === 'normal' ? 'bg-[#3B7A57] text-white' : 'text-[#6E645D] hover:bg-[#FAF7F2]'}`}
              title="Standard font size"
            >
              A
            </button>
            <button
              id="btn-font-large"
              onClick={() => setTextScale('large')}
              className={`px-2 py-1 transition-colors ${textScale === 'large' ? 'bg-[#3B7A57] text-white' : 'text-[#6E645D] hover:bg-[#FAF7F2]'}`}
              title="Large font size"
            >
              A+
            </button>
            <button
              id="btn-font-xlarge"
              onClick={() => setTextScale('xlarge')}
              className={`px-2 py-1 transition-colors ${textScale === 'xlarge' ? 'bg-[#3B7A57] text-white' : 'text-[#6E645D] hover:bg-[#FAF7F2]'}`}
              title="Extra large font size"
            >
              A++
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            id="btn-contrast-toggle"
            onClick={() => {
              setHighContrast(!highContrast);
              playSoothingChime('tap');
            }}
            title={highContrast ? 'Switch to warm daylight mode' : 'Switch to high contrast mode'}
            className="p-1.5 rounded-lg border border-[#D8CEB9] bg-white text-[#5A5048] hover:text-[#3B7A57] cursor-pointer"
          >
            {highContrast ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-sound-toggle"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playSoothingChime('tap');
            }}
            title={soundEnabled ? 'Mute soothing chimes' : 'Enable soothing chimes'}
            className="p-1.5 rounded-lg border border-[#D8CEB9] bg-white text-[#5A5048] hover:text-[#3B7A57] cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#3B7A57]" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>

          {/* Offline/Online Network Sim */}
          <button
            id="btn-network-toggle"
            onClick={() => {
              setIsOnline(!isOnline);
              if (!isOnline && unsyncedCount > 0) {
                onSync();
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
              isOnline 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}
            title="Toggle network simulation (Tests offline SQLite caching and queue sync)"
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden lg:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden lg:inline">Offline Mode</span>
                {unsyncedCount > 0 && (
                  <span className="bg-amber-500 text-white rounded-full px-1.5 text-[10px]">
                    {unsyncedCount}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
