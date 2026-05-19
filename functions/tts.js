export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const text = url.searchParams.get('text');
  const lang = url.searchParams.get('lang') || 'es-US';

  if (!text) {
    return new Response('Missing text parameter', { status: 400 });
  }

  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(lang)}&client=tw-ob&q=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/',
        'Accept': 'audio/mpeg, audio/*, */*'
      }
    });

    if (!response.ok) {
      return new Response('TTS fetch failed: ' + response.status, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      }
    });
  } catch (err) {
    return new Response('Error: ' + err.message, { status: 500 });
  }
}
