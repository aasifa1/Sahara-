export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { 
      message, 
      language = 'en', 
      isJournalMode = false,
      userContext = {},
      conversationHistory = [] 
    } = req.body || {};
    
    const prompt = (message || '').trim();

    // Prepare context elements
    const patientName = userContext.patientName || 'Bhaben Kalita (Dada)';
    const caregiverName = userContext.caregiverName || 'Vikram Kalita';
    const recentActivities = (userContext.reminders || [])
      .map((r: any) => `${r.time}: ${r.title} (${r.isCompleted ? 'Completed' : 'Pending'})`)
      .slice(0, 5)
      .join('; ');

    const recentMood = userContext.latestMood || 'peaceful';
    const familyMembers = 'Vikram (son), Sister Meera (nurse), Ananya (granddaughter)';

    // If Gemini API Key is configured in Vercel environment variables, use server-side Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const historyText = Array.isArray(conversationHistory) 
          ? conversationHistory.slice(-6).map((m: any) => `${m.sender === 'user' ? 'Elderly User' : 'Sahara'}: ${m.text}`).join('\n')
          : '';

        const systemInstruction = isJournalMode
          ? `You are Sahara, a warm, patient, and caring AI Companion for an elderly dementia patient named ${patientName} in North Eastern India.
The user is speaking to log their daily evening journal and activities. 
Listen deeply to what they say. Provide a loving, validating response (max 45 words) in the user's language: "${language}".
Then, output a JSON object at the very end enclosed in <journal_analysis>...</journal_analysis> containing:
{
  "summary": "Brief 1-line summary of what they did today",
  "mood": "peaceful" | "happy" | "calm" | "tired" | "low",
  "mentalHealthStatus": "stable" | "positive" | "needs_attention" | "low_energy",
  "activities": ["detected activity 1", "activity 2"],
  "caregiverNotes": "Concise follow-up note for caregiver ${caregiverName} regarding mental health and wellbeing"
}`
          : `You are Sahara, a warm, patient, loving and culturally respectful AI Cognitive Companion specifically designed for elderly dementia patients in North Eastern India (Assam, Meghalaya, Manipur, etc.).
Patient name: ${patientName}. Primary Caregiver: ${caregiverName}. Family: ${familyMembers}.
Recent cares: ${recentActivities || 'Morning tea, hydration, medicines'}.
Recent mood: ${recentMood}.

You remember all previous conversations and user details. Answer any questions they have truthfully, kindly, and soothingly.
Important Rules:
1. Always respond directly in the user's language (${language} or matching what language they spoke in, supporting Hindi, Assamese, Bengali, Manipuri, English, or any input language).
2. Keep spoken replies soothing, comforting, gentle, and under 40 words.
3. If they ask about medicines, routines, family, memories, or health, answer using their personal context.
4. If they share emotional distress or confusion, validate them warmly, reassure safety, and alert them that ${caregiverName} is nearby.`;

        const fullPrompt = `${systemInstruction}

Conversation History:
${historyText || 'No previous turns.'}

Current User Message:
"${prompt}"

Please formulate your response to the user.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: fullPrompt
              }]
            }],
            generationConfig: {
              maxOutputTokens: 300,
              temperature: 0.6,
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const replyRaw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          
          if (replyRaw) {
            let reply = replyRaw;
            let journalAnalysis = null;

            // Extract journal analysis if present
            const match = replyRaw.match(/<journal_analysis>([\s\S]*?)<\/journal_analysis>/);
            if (match) {
              try {
                journalAnalysis = JSON.parse(match[1].trim());
              } catch {}
              reply = replyRaw.replace(/<journal_analysis>[\s\S]*?<\/journal_analysis>/, '').trim();
            }

            return res.status(200).json({
              reply: reply.trim(),
              journalAnalysis,
              source: 'gemini-server',
              language
            });
          }
        }
      } catch (geminiErr) {
        console.error('Gemini API call error:', geminiErr);
      }
    }

    // High quality intelligent contextual & multilingual fallback rule engine
    const lower = prompt.toLowerCase();
    let reply = '';
    let sentiment: 'positive' | 'neutral' | 'concerned' | 'anxious' | 'peaceful' = 'neutral';
    let journalAnalysis = null;

    if (isJournalMode) {
      // Evening journal fallback analysis
      sentiment = (lower.includes('sad') || lower.includes('tired') || lower.includes('pain') || lower.includes('lonely') || lower.includes('confused'))
        ? 'concerned'
        : 'peaceful';

      const detectedActivities: string[] = [];
      if (lower.includes('walk') || lower.includes('garden') || lower.includes('park')) detectedActivities.push('Evening gentle walk');
      if (lower.includes('tea') || lower.includes('chai') || lower.includes('biscuit')) detectedActivities.push('Took warm tea & refreshments');
      if (lower.includes('talk') || lower.includes('phone') || lower.includes('vikram') || lower.includes('family')) detectedActivities.push('Connected with family');
      if (lower.includes('music') || lower.includes('bhajan') || lower.includes('song')) detectedActivities.push('Listened to soothing music');
      if (detectedActivities.length === 0) detectedActivities.push('Daily restful routine');

      const mentalHealthStatus = sentiment === 'concerned' ? 'needs_attention' : 'stable';
      const detectedMood = sentiment === 'concerned' ? 'low' : 'peaceful';

      journalAnalysis = {
        summary: `Logged evening day activities: "${prompt.slice(0, 100)}${prompt.length > 100 ? '...' : ''}"`,
        mood: detectedMood,
        mentalHealthStatus,
        activities: detectedActivities,
        caregiverNotes: sentiment === 'concerned' 
          ? `Patient expressed fatigue or low mood in evening journal: "${prompt}". Recommended caregiver check-in.`
          : `Patient had a calm day engaging in ${detectedActivities.join(', ')}. Routine and mood appear stable.`
      };

      if (language === 'hi') {
        reply = 'मैंने आपकी दिनचर्या और विचार अपनी डायरी में सुरक्षित कर लिए हैं, दादाजी। आपने आज बहुत अच्छा दिन बिताया। अब आराम से विश्राम करें।';
      } else if (language === 'as') {
        reply = 'মই আপোনাৰ আজিৰ দিনটোৰ সকলো কথা মৰমেৰে লিখি ৰাখিলোঁ, ককাদেউতা। আপুনি আজি বৰ ভাল কৰিলে। এতিয়া শুই জিৰণি লওক।';
      } else if (language === 'bn') {
        reply = 'আমি আপনার আজকের সারাদিনের কথা সস্নেহে লিখে রেখেছি, দাদু। আপনি আজ খুব ভালো ছিলেন। এবার একটু শান্তিতে বিশ্রাম নিন।';
      } else {
        reply = 'I have lovingly recorded your evening journal, Dada. You spent a gentle, meaningful day. Rest well tonight.';
      }

      return res.status(200).json({
        reply,
        journalAnalysis,
        sentiment,
        source: 'sahara-journal-engine',
        language
      });
    }

    // Interactive Q&A Fallback
    if (lower.includes('medicine') || lower.includes('tablet') || lower.includes('pill') || lower.includes('ঔষধ') || lower.includes('दवा')) {
      if (language === 'hi') {
        reply = 'दादाजी, आपकी सुबह की रक्तचाप की गोली ली जा चुकी है। अगली दवा दोपहर के भोजन के बाद विटामिन बी12 है।';
      } else if (language === 'as') {
        reply = 'ককাদেউতা, আপোনাৰ পুৱাৰ ঔষধ খোৱা হৈছে। পৰৱৰ্তী ভিটামিন বি১২ ঔষধ দুপৰীয়া আহাৰৰ পিছত আছে।';
      } else if (language === 'bn') {
        reply = 'দাদু, আপনার সকালের রক্তচাপের ওষুধ নেওয়া হয়েছে। পরবর্তী ভিটামিন বি১২ দুপুরে খাওয়ার পর।';
      } else {
        reply = 'Dada, your morning blood pressure medication was taken. Next is your lunch Vitamin B12 and warm water.';
      }
      sentiment = 'peaceful';
    } else if (lower.includes('son') || lower.includes('vikram') || lower.includes('family') || lower.includes('পো') || lower.includes('ছেলে') || lower.includes('बेटा')) {
      if (language === 'hi') {
        reply = 'आपके सुपुत्र विक्रम और पोती अनन्या हमेशा आपके साथ हैं। विक्रम कुछ ही देर में आपसे मिलने आएंगे।';
      } else if (language === 'as') {
        reply = 'আপোনাৰ মৰমৰ পুত্ৰ বিক্ৰম আৰু নাতিনী অনন্যা সদায় আপোনাৰ কাষতেই আছে। বিক্ৰমে আপোনাক সোনকালেই খবৰ লব।';
      } else if (language === 'bn') {
        reply = 'আপনার ছেলে বিক্রম ও নাতনি অনন্যা আপনার পাশেই আছে। বিক্রম একটু পরেই আপনার সঙ্গে দেখা করবে।';
      } else {
        reply = 'Your son Vikram and granddaughter Ananya love you dearly and are nearby looking after you.';
      }
      sentiment = 'positive';
    } else if (lower.includes('game') || lower.includes('play') || lower.includes('খেল') || lower.includes('খেলা') || lower.includes('खेल')) {
      reply = language === 'hi'
        ? 'आइए मिलकर काजीरंगा स्मृति खेल खेलते हैं और अपने मन को खुश रखते हैं!'
        : language === 'as'
        ? 'আহক আমি কাজিৰঙা স্মৃতি খেল খেলি মনটো আনন্দিত কৰি তোলোঁ!'
        : 'Let us play the Kaziranga Cultural Memory game together to refresh your mind!';
      sentiment = 'positive';
    } else if (lower.includes('photo') || lower.includes('album') || lower.includes('ছবি') || lower.includes('तस्वीर')) {
      reply = language === 'hi'
        ? 'आपकी पारिवारिक एल्बम में कामाख्या और बिहू उत्सव की बहुत सुंदर यादें सुरक्षित हैं।'
        : 'Your family memory album is filled with happy moments from Guwahati and Kaziranga.';
      sentiment = 'positive';
    } else if (lower.includes('date') || lower.includes('time') || lower.includes('today') || lower.includes('समय') || lower.includes('সময়')) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      reply = `Today is ${now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}. The time is ${timeStr} in Assam.`;
      sentiment = 'neutral';
    } else if (lower.includes('sad') || lower.includes('pain') || lower.includes('lonely') || lower.includes('scared') || lower.includes('অশান্তি') || lower.includes('डर') || lower.includes('दर्द')) {
      reply = language === 'hi'
        ? 'चिंता न करें दादाजी, आप बिल्कुल सुरक्षित हैं। मैं आपके साथ हूँ और विक्रम भी पास ही हैं।'
        : language === 'as'
        ? 'ভয় নকৰিব ককাদেউতা, আপুনি একেবাৰে সুৰক্ষিত। মই আপোনাৰ লগতেই আছোঁ আৰু বিক্ৰমো কাষতে আছে।'
        : 'Do not worry Dada, you are completely safe and cherished. I am right here with you, and Vikram is nearby.';
      sentiment = 'concerned';
    } else if (lower.includes('help') || lower.includes('sos') || lower.includes('call') || lower.includes('সহায়') || lower.includes('मदद')) {
      reply = 'Connecting you immediately with your caregiver Vikram and Sister Meera.';
      sentiment = 'anxious';
    } else {
      reply = language === 'hi'
        ? `मैंने सुना: "${prompt}"। मैं आपकी हर बात याद रखती हूँ दादाजी। आप बहुत अच्छा कर रहे हैं!`
        : language === 'as'
        ? `মই শুনিলোঁ: "${prompt}"। আপোনাৰ সকলো কথা মোৰ মনত আছে ককাদেউতা। আপুনি সদায় সুৰক্ষিত।`
        : `I heard you clearly: "${prompt}". I remember our conversations and I am always here to assist you, Dada.`;
      sentiment = 'peaceful';
    }

    return res.status(200).json({
      reply,
      sentiment,
      source: 'sahara-cognitive-rule-engine',
      language
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}

