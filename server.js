require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.use(express.json());
app.use(express.static('public'));

const OPENAI_API_URL = process.env.OPENAI_API_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/gpt', async (req, res) => {
  const { instruction, question } = req.body;

  const messages = [
    { "role": "system", "content": instruction },
    { "role": "user", "content": question }
  ];

  const data = {
    "model": "gpt-4o",
    "messages": messages,
    "temperature": 0.5,
    "max_tokens": 16000,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 0
  };

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const jsonData = await response.json();
    if (jsonData && jsonData.choices && jsonData.choices.length > 0) {
      res.json({ answer: jsonData.choices[0].message.content.trim() });
    } else {
      res.status(500).json({ error: 'Ответ не получен от GPT' });
    }
  } catch (error) {
    console.error('Ошибка при запросе к OpenAI:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
