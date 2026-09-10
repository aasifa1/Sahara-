import React, { useState } from 'react';
import { Phone, AlertTriangle, CheckCircle2, UserCheck, ShieldAlert, HeartHandshake } from 'lucide-react';
import { playSoothingChime, speakText } from '../utils/sound';
import { RegionalLanguage } from '../types';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: RegionalLanguage;
  onTriggerAlert: (message: string) => void;
}

export const SosModal: React.FC<SosModalProps> = ({
  isOpen,
  onClose,
  language,
  onTriggerAlert,
}) => {
  const [calledContact, setCalledContact] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCall = (name: string, phone: string) => {
    playSoothingChime('gentle_bell');
    setCalledContact(name);
    const alertMsg = `Emergency SOS tap triggered by patient requesting immediate contact with ${name} (${phone}).`;
    onTriggerAlert(alertMsg);
    speakText(`Calling ${name}. Help is right on the way, Dada. You are completely safe.`, language);
  };

  return (
    <div 
      id="sos-emergency-modal"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-rose-400 shadow-2xl space-y-5 text-center">
        {/* Urgent Visual Banner */}
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1E1B18] font-['Outfit']">
            Caregiver Help & Emergency
          </h2>
          <p className="text-sm text-[#6C5F54] mt-1">
            Tap either contact below to connect immediately. Family & healthcare workers are always ready to help.
          </p>
        </div>

        {/* Contact 1: Primary Family Caregiver */}
        <div className="space-y-3">
          <button
            onClick={() => handleCall('Vikram (Son & Primary Caregiver)', '+91 98640-12345')}
            className="w-full p-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-between shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-200 block">
                  Family Caregiver
                </span>
                <h4 className="text-lg font-black">
                  Vikram (Son)
                </h4>
                <span className="text-xs opacity-90 block">
                  +91 98640-12345
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-full bg-white text-rose-600 flex items-center justify-center shadow-xs">
              <Phone className="w-5 h-5" />
            </div>
          </button>

          {/* Contact 2: ASHA Health Worker */}
          <button
            onClick={() => handleCall('Sister Meera (Local ASHA Health Worker)', '+91 94350-67890')}
            className="w-full p-4 rounded-2xl bg-[#3B7A57] hover:bg-[#2F6346] text-white flex items-center justify-between shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 block">
                  MDoNER Health Support
                </span>
                <h4 className="text-lg font-black">
                  Sister Meera (ASHA)
                </h4>
                <span className="text-xs opacity-90 block">
                  +91 94350-67890
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-full bg-white text-[#3B7A57] flex items-center justify-center shadow-xs">
              <Phone className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Confirmation after tapping */}
        {calledContact && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Connecting to {calledContact}... Alert logged to dashboard.</span>
          </div>
        )}

        {/* Dismiss */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 cursor-pointer"
          >
            I am okay, close this screen
          </button>
        </div>
      </div>
    </div>
  );
};
