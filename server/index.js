'use strict';
require('dotenv').config();


const express = require('express');
const path = require('path');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { TranslationServiceClient } = require('@google-cloud/translate');

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

const PROJECT_ID = 'electionwise-2026';
// 🚀 USING ENVIRONMENT VARIABLE FOR SECURITY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const translationClient = new TranslationServiceClient();

app.post('/api/ask', async (req, res) => {
  // ── DEFINE VARIABLES OUTSIDE TRY BLOCK TO PREVENT REFERENCE ERRORS ──────
  let messages = [];
  let language = 'English';
  let selectedState = 'All India';
  let mode = 'assistant';

  try {
    const body = req.body || {};
    messages = Array.isArray(body.messages) ? body.messages : [];
    language = body.language || 'English';
    selectedState = body.selectedState || 'All India';
    mode = body.mode || 'assistant';

    if (messages.length === 0) {
      return res.json({ reply: 'How can I help you today?' });
    }

    let systemInstruction = '';
    if (mode === 'detector') {
      systemInstruction = `You are an expert Election Misinformation Detector. Analyze claims against ECI guidelines. Respond ONLY in ${language}. CRITICAL: Use the exact English labels 'VERDICT:' and 'EXPLANATION:' in your response regardless of the target language. format: VERDICT: [True/False/Misleading] EXPLANATION: [Brief]`;
    } else if (mode === 'simulation') {
      systemInstruction = `You are the Game Master for "Be the Election Officer". Respond in ${language}. Present booth scenarios.`;
    } else {
      systemInstruction = `You are ElectionWise, a civic guide. State: ${selectedState}. Language: ${language}. Grounded in ECI rules. Respond ONLY in ${language}.`;
    }

    // 🚀 USING THE STABLE "LATEST" ALIAS AS PER LOGS
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] }
    });

    const lastMessage = messages[messages.length - 1].content || 'Hello';
    const history = messages.slice(0, -1).map(m => ({
      role: (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user',
      parts: [{ text: m.content || '' }]
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text();

    res.json({ reply: text });

  } catch (err) {
    console.error('CRITICAL AI ERROR:', err.message);
    // 💡 SCOPE-SAFE FALLBACK: selectedState is now defined even here
    res.json({ 
      reply: `[ElectionWise] I am currently helping many voters. For immediate ECI guidance in ${selectedState}, please visit voters.eci.gov.in or call 1950.`,
      error: err.message 
    });
  }
});

app.post('/api/translate', async (req, res) => {
  try {
    const body = req.body || {};
    const text = body.text;
    const targetLanguage = body.targetLanguage || 'en';
    
    const [response] = await translationClient.translateText({
      parent: `projects/${PROJECT_ID}/locations/global`,
      contents: Array.isArray(text) ? text : [text],
      mimeType: 'text/plain',
      targetLanguageCode: targetLanguage
    });
    res.json({ translations: response.translations.map(t => t.translatedText) });
  } catch (err) {
    console.error('Translation error:', err.message);
    res.json({ translations: Array.isArray(req.body?.text) ? req.body.text : [req.body?.text || ''] });
  }
});

app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../dist/index.html')));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`ElectionWise server live on :${PORT}`));
