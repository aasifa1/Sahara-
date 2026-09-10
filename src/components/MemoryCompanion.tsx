import React, { useState } from 'react';
import { 
  Heart, 
  Volume2, 
  Sparkles, 
  Plus, 
  Eye, 
  EyeOff, 
  MapPin, 
  Image as ImageIcon 
} from 'lucide-react';
import { MemoryContent, RegionalLanguage } from '../types';
import { UI_TRANSLATIONS } from '../data/culturalContent';
import { playSoothingChime, speakText } from '../utils/sound';

interface MemoryCompanionProps {
  memories: MemoryContent[];
  language: RegionalLanguage;
  highContrast: boolean;
  onAddMemory: (memory: MemoryContent) => void;
}

export const MemoryCompanion: React.FC<MemoryCompanionProps> = ({
  memories,
  language,
  highContrast,
  onAddMemory,
}) => {
  const [selectedMemory, setSelectedMemory] = useState<MemoryContent>(memories[0]);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Add form state
  const [newTitle, setNewTitle] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newOccasion, setNewOccasion] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newClue, setNewClue] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const t = (key: string) => UI_TRANSLATIONS[key]?.[language] || UI_TRANSLATIONS[key]?.['en'] || key;

  const handleSelectMemory = (mem: MemoryContent) => {
    playSoothingChime('tap');
    setSelectedMemory(mem);
    setRevealed(false);
  };

  const handleSpeakClue = () => {
    playSoothingChime('tap');
    const prompt = `${selectedMemory.storyPrompt}. Loving clue: ${selectedMemory.regionalClue}`;
    speakText(prompt, language);
  };

  const handleReveal = () => {
    playSoothingChime('match');
    setRevealed(true);
    speakText(`This is ${selectedMemory.relationship}, ${selectedMemory.title}. ${selectedMemory.yearOrOccasion}.`, language);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: MemoryContent = {
      id: `mem-${Date.now()}`,
      title: newTitle,
      relationship: newRelation || 'Beloved Family',
      yearOrOccasion: newOccasion || 'Special Gathering',
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
      storyPrompt: newStory || `Remembering this wonderful day with ${newTitle}.`,
      regionalClue: newClue || 'Warm smiles and sweet memories together.',
      tags: ['Family', 'Reminiscence'],
    };

    onAddMemory(item);
    setSelectedMemory(item);
    setRevealed(false);
    setShowAddModal(false);

    // Reset
    setNewTitle('');
    setNewRelation('');
    setNewOccasion('');
    setNewStory('');
    setNewClue('');
    setNewImageUrl('');
  };

  return (
    <div 
      id="memory-companion-section"
      className={`rounded-2xl p-5 sm:p-6 border shadow-xs transition-all ${
        highContrast 
          ? 'bg-[#1C1C1C] border-yellow-400 text-yellow-50' 
          : 'bg-white border-[#E8DFC8] text-[#2C2724]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E27D60]/15 text-[#C86D51] flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight font-['Outfit']">
              {t('memoryCompanion')}
            </h2>
            <p className="text-xs sm:text-sm text-[#6C5E53]">
              Familiar faces, cherished trips, and comforting reminiscence
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D9CEB8] bg-white text-xs font-bold text-[#5A4F44] hover:border-[#3B7A57] hover:text-[#3B7A57] shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Memory</span>
        </button>
      </div>

      {/* Main Memory Spotlight Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Left: Photo Frame */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full relative rounded-2xl overflow-hidden border-4 border-[#EADFCB] bg-[#F7F2E7] shadow-sm max-h-[380px] flex items-center justify-center">
            <img
              src={selectedMemory.imageUrl}
              alt={selectedMemory.title}
              className="w-full h-full object-cover max-h-[380px]"
              onError={(e) => {
                // Fallback graceful image
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80';
              }}
            />
            {revealed && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  {selectedMemory.relationship}
                </span>
                <h3 className="text-lg font-bold leading-tight">
                  {selectedMemory.title}
                </h3>
                <span className="text-xs text-white/80 block mt-0.5">
                  {selectedMemory.yearOrOccasion}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-[#7A6E63] font-medium">
              Photo 1 of {memories.length} in Family Album
            </span>
          </div>
        </div>

        {/* Right: Gentle Recall & Story Prompts */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EADFCB] text-[#55493F] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Reminiscence Clue</span>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF5EC] border border-[#EADBCC]">
              <h4 className="font-extrabold text-base sm:text-lg text-[#2C2724] mb-1">
                "{selectedMemory.storyPrompt}"
              </h4>
              <p className="text-xs sm:text-sm text-[#6C5E53] italic">
                Loving hint: {selectedMemory.regionalClue}
              </p>

              <button
                onClick={handleSpeakClue}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D9CEB8] text-[#4F4439] text-xs font-bold hover:text-[#3B7A57] cursor-pointer shadow-xs"
              >
                <Volume2 className="w-4 h-4 text-[#3B7A57]" />
                <span>Listen to Gentle Whisper</span>
              </button>
            </div>

            {/* Answer / Identification Reveal */}
            <div className="pt-1">
              {!revealed ? (
                <button
                  onClick={handleReveal}
                  className="w-full py-3 px-4 rounded-xl bg-[#3B7A57] hover:bg-[#2F6346] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  <Eye className="w-5 h-5" />
                  <span>Do You Remember Who This Is? (Tap to Reveal)</span>
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Family Memory Confirmed
                    </span>
                    <button
                      onClick={() => setRevealed(false)}
                      className="text-xs text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </button>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-emerald-950">
                    {selectedMemory.title} — {selectedMemory.relationship}
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-850">
                    {selectedMemory.yearOrOccasion}. Always thinking of you with love and warm respect!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Memory Strip */}
          <div>
            <span className="text-xs font-bold text-[#6D6156] mb-2 block">
              More Cherished Memories:
            </span>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {memories.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectMemory(m)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    selectedMemory.id === m.id
                      ? 'border-[#3B7A57] ring-2 ring-[#3B7A57]/30 scale-105'
                      : 'border-[#D9CEB8] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={m.imageUrl}
                    alt={m.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Memory Modal for Caregivers */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#E0D4BE] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
              <h3 className="font-extrabold text-lg text-[#2C2724] font-['Outfit']">
                Add Family Memory to Album
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-black text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-[#4F4439] mb-1">
                  Title / Person's Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Granddaughter Rhea during Bihu"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#D9CEB8] bg-[#FAF7F2] focus:outline-none focus:border-[#3B7A57]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#4F4439] mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Eldest Granddaughter"
                    value={newRelation}
                    onChange={(e) => setNewRelation(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#D9CEB8] bg-[#FAF7F2] focus:outline-none focus:border-[#3B7A57]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#4F4439] mb-1">
                    Occasion / Place
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Guwahati Home, 2024"
                    value={newOccasion}
                    onChange={(e) => setNewOccasion(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#D9CEB8] bg-[#FAF7F2] focus:outline-none focus:border-[#3B7A57]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#4F4439] mb-1">
                  Recall Prompt / Story Question
                </label>
                <input
                  type="text"
                  placeholder="e.g. Do you remember who brought fresh jaggery pitha for breakfast?"
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#D9CEB8] bg-[#FAF7F2] focus:outline-none focus:border-[#3B7A57]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4F4439] mb-1">
                  Gentle Whisper Clue
                </label>
                <input
                  type="text"
                  placeholder="e.g. She loves sitting by the garden reading stories with you."
                  value={newClue}
                  onChange={(e) => setNewClue(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#D9CEB8] bg-[#FAF7F2] focus:outline-none focus:border-[#3B7A57]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4F4439] mb-1">
                  Photo URL (or leave blank for family default)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#D9CEB8] bg-[#FAF7F2] focus:outline-none focus:border-[#3B7A57]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0EAE1]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#3B7A57] text-white font-bold hover:bg-[#2F6346] cursor-pointer shadow-xs"
                >
                  Save to Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
