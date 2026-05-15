import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 PUT YOUR GOOGLE API KEY HERE
const GOOGLE_KEY = 'YOUR_GOOGLE_TTS_KEY';

app.post('/tts', async (req, res) => {
  const { text, lang } = req.body;

  const voiceName =
    lang === 'pr'
      ? 'es-US-Neural2-A' // closest natural Latin cadence (best PR approximation)
      : 'es-CO-Standard-A'; // Colombia style clarity

  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: lang === 'pr' ? 'es-US' : 'es-CO',
          name: voiceName,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: lang === 'pr' ? 0.95 : 0.85,
        },
      }),
    }
  );

  const data = await response.json();

  if (!data.audioContent) {
    return res.status(500).json({ error: 'TTS failed' });
  }

  res.json({ audio: data.audioContent });
});

app.listen(3000, () => {
  console.log('TTS server running on http://localhost:3000');
});
