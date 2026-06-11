module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body;
    // OpenRouter uses same format as Anthropic but different model name
    const openRouterBody = {
      model: 'anthropic/claude-3-5-sonnet',
      max_tokens: body.max_tokens || 1000,
      messages: body.messages
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://ai-lesson-for-beginners.vercel.app',
        'X-Title': 'Urok Svyashchennyj'
      },
      body: JSON.stringify(openRouterBody)
    });

    const data = await response.json();

    // Convert OpenRouter response to Anthropic format
    const anthropicFormat = {
      content: [
        {
          type: 'text',
          text: data.choices?.[0]?.message?.content || 'Ошибка получения ответа'
        }
      ]
    };

    res.status(200).json(anthropicFormat);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
