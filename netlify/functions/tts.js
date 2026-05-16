exports.handler = async function(event) {
  const text = event.queryStringParameters && event.queryStringParameters.text;
  const lang = (event.queryStringParameters && event.queryStringParameters.lang) || 'es-US';
  if (!text) {
    return { statusCode: 400, body: 'Missing text parameter' };
  }

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/'
      }
    });

    if (!response.ok) {
      return { statusCode: response.status, body: 'TTS fetch failed' };
    }

    const buffer = await response.buffer();
    const base64 = buffer.toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*'
      },
      body: base64,
      isBase64Encoded: true
    };
  } catch (err) {
    return { statusCode: 500, body: 'Error: ' + err.message };
  }
};
