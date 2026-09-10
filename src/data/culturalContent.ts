import { CulturalCardItem, LanguageInfo, MemoryContent, ReminderItem } from '../types';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', greeting: 'Good Morning, Dada' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', greeting: 'নমস্কাৰ, ককাদেউতা' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', greeting: 'সুপ্রভাত, দাদু' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', greeting: 'शुभ प्रभात, दादाजी' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', greeting: 'খুরুমজরি, ইপু' },
];

export const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  welcomeSubtitle: {
    en: "Today is a beautiful day in Guwahati. Let's exercise our mind and take our medicines.",
    as: "আজি গুৱাহাটীত এক সুন্দৰ পুৱা। আহক আমি মনৰ আনন্দ লওঁ আৰু ঔষধ খাওঁ।",
    bn: "আজ গুয়াহাটিতে এক সুন্দর সকাল। আসুন মনকে সতেজ রাখি ও ওষুধ খাই।",
    hi: "आज गुवाहाटी में एक सुंदर सुबह है। आइए मन को तरोताज़ा रखें और दवाइयाँ लें।",
    mni: "ঙসি নুমিৎ অসি য়াম্না ফজবা নুমিৎনি। পুন্সিনা নুংঙাইনা লৈসি অমসুং হিদাক চারসি।",
  },
  todayRoutine: {
    en: "Today's Schedule & Care",
    as: "আজিৰ দিনলিপি আৰু যত্ন",
    bn: "আজকের সময়সূচী ও যত্ন",
    hi: "आज की दिनचर्या और देखभाल",
    mni: "ঙসিগী থৌরম অমসুং য়েংশিনবা",
  },
  cognitiveGames: {
    en: "Mind Stimulation Games",
    as: "স্মৃতি আৰু মনৰ খেল",
    bn: "স্মৃতি ও মনের খেলা",
    hi: "स्मृति और दिमागी खेल",
    mni: "ৱাখল অমসুং নিংশিং শান্নপোৎ",
  },
  memoryCompanion: {
    en: "Family Memories & Photo Album",
    as: "পৰিয়ালৰ পুৰণি ফটো আৰু স্মৃতি",
    bn: "পরিবারের পুরনো ছবি ও স্মৃতি",
    hi: "परिवार की यादें और फोटो एलबम",
    mni: "ইমুংগী নুংঙাইবা নিংশিং খুদমশিং",
  },
  moodCheckin: {
    en: "How are you feeling right now?",
    as: "আপোনাৰ মনটো এতিয়া কেনেকুৱা লাগিছে?",
    bn: "আপনার মন এখন কেমন লাগছে?",
    hi: "आप अभी कैसा महसूस कर रहे हैं?",
    mni: "নহাক হৌজিক করম্না ফাওরি?",
  },
  sosHelp: {
    en: "Caregiver Help / SOS",
    as: "সহায় / পৰিয়ালক মাওক",
    bn: "সাহায্য / পরিজনকে ডাকুন",
    hi: "मदद / परिवार को बुलाएँ",
    mni: "মতেং / ইমুংগী মী কৌরসি",
  },
  readAloud: {
    en: "Listen",
    as: "শুনক",
    bn: "শুনুন",
    hi: "सुनें",
    mni: "তাবিগনু",
  },
  completed: {
    en: "Done!",
    as: "কৰা হ’ল!",
    bn: "হয়ে গেছে!",
    hi: "हो गया!",
    mni: "লোইরে!",
  },
  markDone: {
    en: "I did this",
    as: "মই এইটো কৰিলোঁ",
    bn: "আমি করেছি",
    hi: "मैंने कर लिया",
    mni: "ঐনা পাংথোকখ্রে",
  },
};

export const CULTURAL_CARDS: CulturalCardItem[] = [
  {
    id: 'rhino',
    name: 'One-Horned Rhino',
    regionalName: 'এশিঙীয়া গঁড় (Kaziranga)',
    description: 'Pride of Kaziranga National Park in Assam, symbol of gentle strength.',
    category: 'wildlife',
    iconName: 'Shield',
    color: '#3B7A57',
    imageUrl: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=600&q=80',
    state: 'Assam',
  },
  {
    id: 'jaapi',
    name: 'Assam Jaapi',
    regionalName: 'অসমীয়া জাপি',
    description: 'Traditional woven bamboo hat decorated with red cloth, welcoming guests with honor.',
    category: 'craft',
    iconName: 'Sun',
    color: '#C86D51',
    imageUrl: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=600&q=80',
    state: 'Assam',
  },
  {
    id: 'hornbill',
    name: 'Great Indian Hornbill',
    regionalName: 'ধনেশ পক্ষী (Hornbill)',
    description: 'Majestic bird celebrated in Nagaland and Arunachal with colorful feathers.',
    category: 'wildlife',
    iconName: 'Feather',
    color: '#E07A5F',
    imageUrl: 'https://images.unsplash.com/photo-1618944847823-380f14d81732?auto=format&fit=crop&w=600&q=80',
    state: 'Nagaland',
  },
  {
    id: 'kopou',
    name: 'Kopou Phool (Orchid)',
    regionalName: 'কপৌ ফুল (Foxtail Orchid)',
    description: 'Delicate pink blossom worn during Rongali Bihu festival, symbol of springtime joy.',
    category: 'nature',
    iconName: 'Flower2',
    color: '#D97706',
    imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80',
    state: 'Assam',
  },
  {
    id: 'majuli_mask',
    name: 'Majuli Mask (Mukha)',
    regionalName: 'মাজুলীৰ মুখা শিল্প',
    description: 'Handcrafted bamboo and clay masks used in sacred island dance dramas.',
    category: 'heritage',
    iconName: 'Smile',
    color: '#4A6B82',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    state: 'Assam',
  },
  {
    id: 'sangai',
    name: 'Sangai Deer',
    regionalName: 'চাঙাই শৰপহু (Loktak)',
    description: 'The graceful dancing deer found exclusively in the floating phumdis of Loktak Lake.',
    category: 'wildlife',
    iconName: 'Compass',
    color: '#2A9D8F',
    imageUrl: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80',
    state: 'Manipur',
  },
  {
    id: 'bihu_dhol',
    name: 'Bihu Dhol',
    regionalName: 'বিহু ঢোল',
    description: 'The resonant wooden drum whose rhythm fills the Brahmaputra valley each spring.',
    category: 'music',
    iconName: 'Music',
    color: '#B45309',
    imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=600&q=80',
    state: 'Assam',
  },
  {
    id: 'tea_leaf',
    name: 'Assam Green Tea',
    regionalName: 'অসমৰ চাহপাত',
    description: 'Fresh two-leaves-and-a-bud harvested in misty lush green tea gardens.',
    category: 'nature',
    iconName: 'Leaf',
    color: '#2E7D32',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    state: 'Assam',
  },
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    title: 'Morning Blood Pressure Tablet',
    regionalTitle: {
      en: 'Morning Blood Pressure Tablet',
      as: 'পুৱাৰ ৰক্তচাপৰ টেবলেট',
      bn: 'সকালের রক্তচাপের ওষুধ',
      hi: 'सुबह की बीपी की गोली',
      mni: 'য়ুংনুংশিংগী হিদাক',
    },
    type: 'medicine',
    time: '08:00 AM',
    dosageOrDetail: '1 tablet (Amlodipine 5mg) with warm water after light breakfast',
    isCompleted: true,
    completedAt: '08:15 AM',
    synced: true,
    audioPrompt: 'Please take your morning blood pressure tablet with half a glass of warm water.',
  },
  {
    id: 'rem-2',
    title: 'Hydration & Warm Herbal Tea',
    regionalTitle: {
      en: 'Hydration & Warm Herbal Tea',
      as: 'উষ্ণ পানী আৰু লাল চাহ খোৱা',
      bn: 'উষ্ণ জল ও লাল চা',
      hi: 'गर्म पानी या हर्बल चाय',
      mni: 'ঈশিং নত্রগা চাহ থকপা',
    },
    type: 'hydration',
    time: '11:00 AM',
    dosageOrDetail: '1 cup of fresh warm water with a touch of ginger',
    isCompleted: false,
    synced: true,
    audioPrompt: 'Time to drink a nice soothing cup of warm water to stay hydrated.',
  },
  {
    id: 'rem-3',
    title: 'Memory Vitamin B-Complex',
    regionalTitle: {
      en: 'Memory Vitamin B-Complex',
      as: 'স্মৃতি শক্তিবর্ধক ভিটামিন',
      bn: 'স্মৃতিশক্তি বৃদ্ধির ভিটামিন',
      hi: 'स्मृति शक्ति विटामिन',
      mni: 'ৱাখল কনশিনবা ভিটামিন',
    },
    type: 'medicine',
    time: '01:30 PM',
    dosageOrDetail: '1 capsule right after lunch prescribed by Dr. Barua',
    isCompleted: false,
    synced: true,
    audioPrompt: 'It is lunch time. Remember to take your Vitamin capsule after eating.',
  },
  {
    id: 'rem-4',
    title: 'Gentle Veranda Walk & Fresh Air',
    regionalTitle: {
      en: 'Gentle Veranda Walk & Fresh Air',
      as: 'বাৰান্দাত অলপ খোজ কঢ়া',
      bn: 'বারান্দায় একটু হাঁটাচলা',
      hi: 'बरामदे में हल्की सैर',
      mni: 'নোংথোকপা অমসুং খোঙচৎ',
    },
    type: 'activity',
    time: '04:30 PM',
    dosageOrDetail: '10 minutes of slow stretching and viewing the garden orchids',
    isCompleted: false,
    synced: true,
    audioPrompt: 'The afternoon air is pleasant. Step onto the veranda and enjoy the garden.',
  },
  {
    id: 'rem-5',
    title: 'Evening Calming Milk & Bedtime Medicine',
    regionalTitle: {
      en: 'Evening Calming Milk & Bedtime Medicine',
      as: 'সন্ধিয়াৰ গাখীৰ আৰু ৰাতিৰ ঔষধ',
      bn: 'সন্ধ্যার দুধ ও রাতের ওষুধ',
      hi: 'हल्का दूध और रात की दवा',
      mni: 'নুমিদাংগী শঙোম অমসুং হিদাক',
    },
    type: 'medicine',
    time: '08:30 PM',
    dosageOrDetail: '1 tablet for peaceful night rest',
    isCompleted: false,
    synced: true,
    audioPrompt: 'Time for night rest medicine with warm milk for sweet dreams.',
  },
];

export const INITIAL_MEMORIES: MemoryContent[] = [
  {
    id: 'mem-1',
    title: 'Granddaughter Ananya at Umiam Lake',
    relationship: 'Beloved Granddaughter',
    yearOrOccasion: 'Summer Trip to Meghalaya, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    storyPrompt: 'Do you remember little Ananya waving beside the calm blue waters of Umiam Lake?',
    regionalClue: 'She made you laugh with the bamboo flute you bought for her at the roadside bazaar.',
    tags: ['Family', 'Meghalaya', 'Laughter'],
  },
  {
    id: 'mem-2',
    title: 'Son Vikram at Magh Bihu Bonfire (Meji)',
    relationship: 'Eldest Son Vikram',
    yearOrOccasion: 'Bihu Celebration in Tezpur',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    storyPrompt: 'Vikram lighting the tall bamboo Meji tower on a crisp winter dawn.',
    regionalClue: 'You served hot pitha and coconut laddoos to all the neighborhood elders.',
    tags: ['Festivals', 'Tradition', 'Tezpur'],
  },
  {
    id: 'mem-3',
    title: 'Ancestral Homestead in Jorhat',
    relationship: 'Family House & Tea Bushes',
    yearOrOccasion: 'Built in 1978 with Teak & Bamboo',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    storyPrompt: 'Your favorite cane armchair on the south veranda facing the betel nut palms.',
    regionalClue: 'Where the aroma of freshly brewed morning tea greeted everyone.',
    tags: ['Home', 'Peace', 'Jorhat'],
  },
];

export const ROUTINE_QUESTIONS = [
  {
    id: 'rq-1',
    scenario: 'When you wake up in the morning, what is the best first step?',
    options: [
      { id: 'opt-1', text: 'Wash face and drink a glass of fresh water', isCorrect: true },
      { id: 'opt-2', text: 'Go for a run in heavy rain', isCorrect: false },
      { id: 'opt-3', text: 'Lock all the windows tightly', isCorrect: false },
    ],
    hint: 'A sip of water helps your body awaken gently.',
    celebration: 'Wonderful! Fresh water cleanses our morning spirit.',
  },
  {
    id: 'rq-2',
    scenario: 'What is the customary way to welcome an honored guest in Assam?',
    options: [
      { id: 'opt-1', text: 'Presenting a woven Gamosa with folded hands', isCorrect: true },
      { id: 'opt-2', text: 'Playing loud drums immediately', isCorrect: false },
      { id: 'opt-3', text: 'Turning off the lights', isCorrect: false },
    ],
    hint: 'Think of the red and white cotton scarf woven with love.',
    celebration: 'Correct! The sacred Gamosa represents our warmth and respect.',
  },
  {
    id: 'rq-3',
    scenario: 'After eating your afternoon lunch, what is recommended for comfort?',
    options: [
      { id: 'opt-1', text: 'Rest peacefully in the armchair and take the memory vitamin', isCorrect: true },
      { id: 'opt-2', text: 'Climb a tall mango tree immediately', isCorrect: false },
      { id: 'opt-3', text: 'Skip drinking water until evening', isCorrect: false },
    ],
    hint: 'Your body appreciates a quiet digestive pause.',
    celebration: 'Spot on! Gentle resting after lunch brings clarity.',
  },
];

export const ROUTINE_ORDER_TASKS = [
  {
    id: 'rot-1',
    title: 'Gentle Morning Routine',
    regionalTitle: 'পুৱাৰ শান্তিময় দিনলিপি',
    description: 'Tap each activity in the natural order of your morning.',
    steps: [
      { id: 's1', order: 1, text: 'Wake up gently and stretch arms', icon: 'Sun', color: '#FEF3C7' },
      { id: 's2', order: 2, text: 'Wash face and drink a cup of warm water', icon: 'Droplets', color: '#E0F2FE' },
      { id: 's3', order: 3, text: 'Take morning medicine with soft breakfast', icon: 'Pill', color: '#DCFCE7' },
      { id: 's4', order: 4, text: 'Relax on the veranda watching garden birds', icon: 'Heart', color: '#FCE7F3' },
    ],
  },
  {
    id: 'rot-2',
    title: 'Brewing Morning Assam Chai',
    regionalTitle: 'অসমীয়া পুৱাৰ চাহ বনোৱা',
    description: 'Arrange how we prepare a fresh, comforting cup of tea.',
    steps: [
      { id: 's1', order: 1, text: 'Heat fresh water in the saucepan', icon: 'Flame', color: '#FEE2E2' },
      { id: 's2', order: 2, text: 'Add crushed ginger and tea leaves', icon: 'Leaf', color: '#DCFCE7' },
      { id: 's3', order: 3, text: 'Pour in milk and let it gently bubble', icon: 'Coffee', color: '#FEF3C7' },
      { id: 's4', order: 4, text: 'Strain into cup and enjoy warm sip', icon: 'Smile', color: '#E0E7FF' },
    ],
  },
  {
    id: 'rot-3',
    title: 'Peaceful Evening Wind-Down',
    regionalTitle: 'গধূলিৰ শান্তিময় বিশ্ৰাম',
    description: 'Arrange the sequence for a restful, calm night.',
    steps: [
      { id: 's1', order: 1, text: 'Water the blooming porch orchids', icon: 'Flower2', color: '#FCE7F3' },
      { id: 's2', order: 2, text: 'Eat a light, warm dinner with family', icon: 'Utensils', color: '#FEF3C7' },
      { id: 's3', order: 3, text: 'Take evening care tablet with water', icon: 'Pill', color: '#DCFCE7' },
      { id: 's4', order: 4, text: 'Rest head on pillow with sweet thoughts', icon: 'Moon', color: '#E0E7FF' },
    ],
  },
];

export interface ShoppingItem {
  id: string;
  name: string;
  regionalName: string;
  category: string;
  imageUrl: string;
  color: string;
}

export const SHOPPING_ITEMS: ShoppingItem[] = [
  {
    id: 'tea',
    name: 'Assam Tea Pack',
    regionalName: 'অসমৰ চাহ (Tea)',
    category: 'Pantry',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80',
    color: '#3B7A57',
  },
  {
    id: 'lemon',
    name: 'Kaji Nemu (Assam Lemon)',
    regionalName: 'কাজী নেমু (Lemon)',
    category: 'Fresh',
    imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=500&q=80',
    color: '#EAB308',
  },
  {
    id: 'ginger',
    name: 'Fresh Mountain Ginger',
    regionalName: 'কেঁচা আদা (Ginger)',
    category: 'Roots',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80',
    color: '#D97706',
  },
  {
    id: 'honey',
    name: 'Wild Forest Honey',
    regionalName: 'বনৰীয়া মৌ (Honey)',
    category: 'Sweet',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=500&q=80',
    color: '#F59E0B',
  },
  {
    id: 'rice',
    name: 'Fragrant Joha Rice',
    regionalName: 'জোহা চাউল (Joha Rice)',
    category: 'Grains',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80',
    color: '#E2E8F0',
  },
  {
    id: 'turmeric',
    name: 'Fresh Golden Turmeric',
    regionalName: 'কেঁচা হালধি (Turmeric)',
    category: 'Spices',
    imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=500&q=80',
    color: '#F97316',
  },
  {
    id: 'pitha',
    name: 'Til Pitha & Laru Sweets',
    regionalName: 'তিল পিঠা আৰু লাড়ু',
    category: 'Sweets',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
    color: '#A16207',
  },
  {
    id: 'bamboo',
    name: 'Tender Bamboo Shoots',
    regionalName: 'বাঁহৰ গাজ (Bamboo Shoot)',
    category: 'Fresh',
    imageUrl: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=500&q=80',
    color: '#16A34A',
  },
];

export const WHAT_NEXT_STORIES = [
  {
    id: 'wn-1',
    title: 'Preparing a Cup of Assam Tea',
    regionalTitle: 'একাপ গৰম চাহ তৈয়াৰ কৰা',
    story: 'You are on the veranda with your family on a pleasant misty morning.',
    sequence: [
      { step: 1, text: 'Put fresh water to boil on the stove', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80' },
      { step: 2, text: 'Add fragrant ginger and fresh Assam tea leaves', imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80' },
    ],
    question: 'What is the natural next step to finish making the tea?',
    options: [
      {
        id: 'opt-1',
        text: 'Pour milk, simmer, strain into tea cup, and enjoy warm',
        isCorrect: true,
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'opt-2',
        text: 'Leave the house without drinking and go to sleep',
        isCorrect: false,
        imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'opt-3',
        text: 'Pour cold tap water on the stove flames',
        isCorrect: false,
        imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400&q=80',
      },
    ],
    hint: 'Think of how warm, sweet chai is served to your family.',
    celebration: 'Wonderful! You pour it through the strainer into the tea cup to sip happily.',
  },
  {
    id: 'wn-2',
    title: 'Honoring an Elder or Guest',
    regionalTitle: 'সন্মানীয় অতিথিক আদৰা',
    story: 'Your dear childhood friend from Tezpur has arrived at your gate to visit you.',
    sequence: [
      { step: 1, text: 'Open the gate with a joyful, welcoming smile', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
      { step: 2, text: 'Welcome them inside and offer comfortable seating', imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80' },
    ],
    question: 'What is the customary tradition of Assam to welcome them?',
    options: [
      {
        id: 'opt-1',
        text: 'Present a woven red-and-white Gamosa with folded hands (নমস্কাৰ)',
        isCorrect: true,
        imageUrl: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'opt-2',
        text: 'Turn on the loud radio and walk away',
        isCorrect: false,
        imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'opt-3',
        text: 'Ask them to clean the courtyard floor',
        isCorrect: false,
        imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80',
      },
    ],
    hint: 'Think of the sacred red-and-white scarf draped with blessing.',
    celebration: 'Perfect! The sacred Gamosa honors lifelong friendship and respect.',
  },
  {
    id: 'wn-3',
    title: 'Planting a Beautiful Wild Orchid',
    regionalTitle: 'বাগিচাত কপৌ ফুল ৰোৱা',
    story: 'You found a fresh baby Kopou orchid seedling to grow on your veranda.',
    sequence: [
      { step: 1, text: 'Tie the orchid root gently to a bamboo branch with moss', imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=400&q=80' },
      { step: 2, text: 'Hang it where gentle morning sunlight falls through the trees', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80' },
    ],
    question: 'What care does the seedling need next to thrive?',
    options: [
      {
        id: 'opt-1',
        text: 'Spray mist of fresh water gently every morning',
        isCorrect: true,
        imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'opt-2',
        text: 'Put the plant into boiling tea water',
        isCorrect: false,
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'opt-3',
        text: 'Hide it inside an air-tight locked metal box',
        isCorrect: false,
        imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=400&q=80',
      },
    ],
    hint: 'Plants drink fresh morning dew and gentle water.',
    celebration: 'Magnificent! With gentle water, pink Kopou blossoms bloom proudly.',
  },
];

export const WORD_PICTURE_ITEMS = [
  {
    id: 'rhino',
    words: {
      en: 'One-Horned Rhino',
      as: 'এশিঙীয়া গঁড়',
      bn: 'এক-শৃঙ্গ গণ্ডার',
      hi: 'एक सींग वाला गैंडा',
      mni: 'শমু-ময়োকপা (Rhino)',
    },
    pronunciation: 'Gorh',
    imageUrl: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=500&q=80',
    color: '#3B7A57',
  },
  {
    id: 'jaapi',
    words: {
      en: 'Assam Jaapi Hat',
      as: 'অসমীয়া জাপি',
      bn: 'আসামি জাপি টুপি',
      hi: 'असमिया जापी टोपी',
      mni: 'জাপি (Jaapi)',
    },
    pronunciation: 'Jaapi',
    imageUrl: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=500&q=80',
    color: '#C86D51',
  },
  {
    id: 'hornbill',
    words: {
      en: 'Great Hornbill Bird',
      as: 'ধনেশ পক্ষী',
      bn: 'ধনেশ পাখি',
      hi: 'हॉर्नबिल पक्षी',
      mni: 'উচেক (Hornbill)',
    },
    pronunciation: 'Dhanesh',
    imageUrl: 'https://images.unsplash.com/photo-1618944847823-380f14d81732?auto=format&fit=crop&w=500&q=80',
    color: '#E07A5F',
  },
  {
    id: 'orchid',
    words: {
      en: 'Kopou Orchid Flower',
      as: 'কপৌ ফুল',
      bn: 'কপৌ ফুল',
      hi: 'कपौ आर्किड फूल',
      mni: 'লৈরাং (Orchid)',
    },
    pronunciation: 'Kopou Phool',
    imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=500&q=80',
    color: '#D97706',
  },
  {
    id: 'tea',
    words: {
      en: 'Fresh Tea Leaves',
      as: 'সেউজীয়া চাহপাত',
      bn: 'সবুজ চা পাতা',
      hi: 'हरी चाय की पत्ती',
      mni: 'চা মনা (Tea Leaf)',
    },
    pronunciation: 'Chah Paat',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80',
    color: '#2E7D32',
  },
  {
    id: 'drum',
    words: {
      en: 'Bihu Dhol Drum',
      as: 'বিহু ঢোল',
      bn: 'বিহু ঢোল বাদ্য',
      hi: 'बिहू ढोल',
      mni: 'পুং (Bihu Drum)',
    },
    pronunciation: 'Bihu Dhol',
    imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=500&q=80',
    color: '#B45309',
  },
];

export const LISTEN_TAP_TASKS = [
  {
    id: 'lt-1',
    instruction: 'Please tap the gentle One-Horned Rhino from Kaziranga.',
    regionalInstruction: {
      en: 'Please tap the gentle One-Horned Rhino from Kaziranga.',
      as: 'অনুগ্ৰহ কৰি কাজিৰঙাৰ এশিঙীয়া গঁড়টোত স্পৰ্শ কৰক।',
      bn: 'অনুগ্রহ করে কাজিরাঙ্গার এক-শৃঙ্গ গণ্ডারটিতে স্পর্শ করুন।',
      hi: 'कृपया काज़ीरंगा के एक सींग वाले गैंडे पर टैप करें।',
      mni: 'কাজিরাংগাগী শমু-ময়োকপাদা চেন্দৌনৌ।',
    },
    targetId: 'rhino',
    options: [
      { id: 'rhino', name: 'One-Horned Rhino', imageUrl: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=400&q=80' },
      { id: 'tea', name: 'Fresh Tea Leaves', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80' },
      { id: 'drum', name: 'Bihu Dhol', imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  {
    id: 'lt-2',
    instruction: 'Please tap the traditional woven bamboo Jaapi hat.',
    regionalInstruction: {
      en: 'Please tap the traditional woven bamboo Jaapi hat.',
      as: 'অনুগ্ৰহ কৰি আমাৰ বাঁহৰ অসমীয়া জাপিত স্পৰ্শ কৰক।',
      bn: 'অনুগ্রহ করে ঐতিহ্যবাহী বাঁশের জাপি টুপিতে স্পর্শ করুন।',
      hi: 'कृपया पारंपरिक बांस की असमिया जापी टोपी पर टैप करें।',
      mni: 'ট্রেডিশনেল জাপী অদুদা চেন্দৌনৌ।',
    },
    targetId: 'jaapi',
    options: [
      { id: 'hornbill', name: 'Great Hornbill', imageUrl: 'https://images.unsplash.com/photo-1618944847823-380f14d81732?auto=format&fit=crop&w=400&q=80' },
      { id: 'jaapi', name: 'Assam Jaapi Hat', imageUrl: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=400&q=80' },
      { id: 'orchid', name: 'Kopou Orchid', imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  {
    id: 'lt-3',
    instruction: 'Please tap the fresh green Assam tea leaves.',
    regionalInstruction: {
      en: 'Please tap the fresh green Assam tea leaves.',
      as: 'অনুগ্ৰহ কৰি বাগিচাৰ সেউজীয়া চাহপাতত স্পৰ্শ কৰক।',
      bn: 'অনুগ্রহ করে বাগানের সবুজ চা পাতায় স্পর্শ করুন।',
      hi: 'कृपया चाय के ताज़ा हरे पत्तों पर टैপ करें।',
      mni: 'অশেংবা চা মনাশিংদা চেন্দৌনৌ।',
    },
    targetId: 'tea',
    options: [
      { id: 'rhino', name: 'Rhino', imageUrl: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=400&q=80' },
      { id: 'lemon', name: 'Kaji Nemu Lemon', imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=400&q=80' },
      { id: 'tea', name: 'Green Tea Leaves', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  {
    id: 'lt-4',
    instruction: 'Please tap the beautiful pink Kopou orchid blossom.',
    regionalInstruction: {
      en: 'Please tap the beautiful pink Kopou orchid blossom.',
      as: 'অনুগ্ৰহ কৰি ধুনীয়া গোলাপী কপৌ ফুলটোত স্পৰ্শ কৰক।',
      bn: 'অনুগ্রহ করে সুন্দর গোলাপি কপৌ ফুলে স্পর্শ করুন।',
      hi: 'कृपया सुंदर गुलाबी कपौ आर्किड फूल पर टैप करें।',
      mni: 'ফজবা লৈরাং অদুদা চেন্দৌনৌ।',
    },
    targetId: 'orchid',
    options: [
      { id: 'orchid', name: 'Kopou Orchid', imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=400&q=80' },
      { id: 'drum', name: 'Bihu Dhol', imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=400&q=80' },
      { id: 'jaapi', name: 'Assam Jaapi', imageUrl: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=400&q=80' },
    ],
  },
];

export const NER_PATTERN_SETS = [
  {
    id: 'pat-1',
    title: 'Rhino & Jaapi Rhythm',
    sequence: [
      { id: 'p1', name: 'Rhino', imageUrl: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=400&q=80' },
      { id: 'p2', name: 'Jaapi', imageUrl: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=400&q=80' },
      { id: 'p3', name: 'Rhino', imageUrl: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=400&q=80' },
    ],
    correctAnswer: {
      id: 'jaapi',
      name: 'Jaapi',
      imageUrl: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=400&q=80',
    },
    choices: [
      { id: 'jaapi', name: 'Assam Jaapi', imageUrl: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=400&q=80' },
      { id: 'tea', name: 'Tea Leaves', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80' },
      { id: 'drum', name: 'Bihu Dhol', imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=400&q=80' },
    ],
    hint: 'Notice how Rhino and Jaapi take turns: Rhino, Jaapi, Rhino...',
  },
  {
    id: 'pat-2',
    title: 'Tea Garden & Orchid Blossom',
    sequence: [
      { id: 'p1', name: 'Tea Leaf', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80' },
      { id: 'p2', name: 'Tea Leaf', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80' },
      { id: 'p3', name: 'Kopou Orchid', imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=400&q=80' },
      { id: 'p4', name: 'Tea Leaf', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80' },
      { id: 'p5', name: 'Tea Leaf', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80' },
    ],
    correctAnswer: {
      id: 'orchid',
      name: 'Kopou Orchid',
      imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=400&q=80',
    },
    choices: [
      { id: 'orchid', name: 'Kopou Orchid', imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=400&q=80' },
      { id: 'rhino', name: 'Rhino', imageUrl: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=400&q=80' },
      { id: 'hornbill', name: 'Hornbill Bird', imageUrl: 'https://images.unsplash.com/photo-1618944847823-380f14d81732?auto=format&fit=crop&w=400&q=80' },
    ],
    hint: 'Two tea leaves are followed by one sweet pink orchid.',
  },
  {
    id: 'pat-3',
    title: 'Festival Rhythm & Feathers',
    sequence: [
      { id: 'p1', name: 'Hornbill', imageUrl: 'https://images.unsplash.com/photo-1618944847823-380f14d81732?auto=format&fit=crop&w=400&q=80' },
      { id: 'p2', name: 'Bihu Dhol', imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=400&q=80' },
      { id: 'p3', name: 'Hornbill', imageUrl: 'https://images.unsplash.com/photo-1618944847823-380f14d81732?auto=format&fit=crop&w=400&q=80' },
    ],
    correctAnswer: {
      id: 'drum',
      name: 'Bihu Dhol',
      imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=400&q=80',
    },
    choices: [
      { id: 'drum', name: 'Bihu Dhol', imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=400&q=80' },
      { id: 'tea', name: 'Tea Leaves', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80' },
      { id: 'jaapi', name: 'Jaapi Hat', imageUrl: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=400&q=80' },
    ],
    hint: 'Hornbill bird, then musical Dhol drum, then Hornbill...',
  },
];

