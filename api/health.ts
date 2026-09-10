export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'ok',
    app: 'Sahara — AI-Based Cognitive Gaming and Memory Assistance Platform',
    version: '1.0.0',
    region: 'North Eastern Region (NER)',
    timestamp: new Date().toISOString(),
    capabilities: [
      'MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API',
      'COGNITIVE_GAMES_ENGINE',
      'MULTILINGUAL_VOICE_COMPANION',
      'CAREGIVER_SYNC_GATEWAY',
      'OFFLINE_FIRST_RESILIENCE'
    ]
  });
}
