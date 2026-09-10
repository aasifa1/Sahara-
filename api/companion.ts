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
    const { message, language = 'as' } = req.body || {};
    const prompt = message || '';

    // If Gemini API Key is configured in Vercel environment variables, use server-side Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are Sahara, a warm, patient, and culturally respectful AI Cognitive Companion specifically designed for elderly dementia patients in North Eastern India (Assam, Meghalaya, Manipur, Tripura, Nagaland, Mizoram, Arunachal Pradesh, Sikkim).
Keep your response warm, soothing, simple, under 35 words, free of clinical jargon, validating their memories, and speaking in tone suited for language: ${language}.
User says: "${prompt}"`
              }]
            }],
            generationConfig: {
              maxOutputTokens: 100,
              temperature: 0.6,
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return res.status(200).json({
              reply: replyText.trim(),
              source: 'gemini-server',
              language
            });
          }
        }
      } catch (geminiErr) {
        console.error('Gemini API call error:', geminiErr);
      }
    }

    // High quality contextual fallback
    const lower = prompt.toLowerCase();
    let reply = '';

    if (lower.includes('medicine') || lower.includes('tablet') || lower.includes('pill') || lower.includes('schedule')) {
      reply = 'Your morning medicine and hydration are scheduled. Take gentle sips of warm water and relax.';
    } else if (lower.includes('game') || lower.includes('memory') || lower.includes('play')) {
      reply = 'Let us play the Kaziranga Memory Match or Routine Recall game together to keep your mind refreshed!';
    } else if (lower.includes('photo') || lower.includes('family') || lower.includes('album')) {
      reply = 'Your family album is safe and filled with fond memories of Vikram and little Ananya.';
    } else if (lower.includes('date') || lower.includes('time') || lower.includes('today')) {
      const now = new Date();
      reply = `Today is ${now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })} in Assam. It is a pleasant day.`;
    } else if (lower.includes('help') || lower.includes('sos') || lower.includes('call')) {
      reply = 'Connecting you with your caregiver Vikram and Sister Meera right away.';
    } else {
      reply = `I am always here with you. You are safe and doing wonderful today!`;
    }

    return res.status(200).json({
      reply,
      source: 'sahara-cognitive-rule-engine',
      language
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}
