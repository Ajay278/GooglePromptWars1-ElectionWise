'use strict';
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { TranslationServiceClient } = require('@google-cloud/translate');

// Services
const AIService = require('./services/ai.service');
const TranslationService = require('./services/translation.service');

// 🚀 COMPOSITION ROOT: Injecting dependencies into services (SOLID Principle)
const PROJECT_ID = 'electionwise-2026';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const translationClient = new TranslationServiceClient();

const aiService = new AIService(genAI);
const translationService = new TranslationService(translationClient, PROJECT_ID);

const app = express();
app.use(compression());
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

/**
 * Security: Rate Limiting
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Validation Schemas
const askSchema = z.object({
  messages: z.array(z.object({
    role: z.string(),
    content: z.string().optional()
  })).optional(),
  language: z.string().optional(),
  selectedState: z.string().optional(),
  mode: z.string().optional()
});

const translateSchema = z.object({
  text: z.union([z.string(), z.array(z.string())]),
  targetLanguage: z.string().optional()
});

/**
 * POST /api/ask
 */
app.post('/api/ask', async (req, res) => {
  try {
    const { messages = [], language = 'English', selectedState = 'All India', mode = 'assistant' } = askSchema.parse(req.body || {});
    if (messages.length === 0) return res.json({ reply: 'How can I help you today?' });

    const reply = await aiService.generateResponse(messages, language, selectedState, mode);
    res.setHeader('Cache-Control', 'no-store');
    res.json({ reply });
  } catch (err) {
    console.error(`[AI Error]:`, err.message);
    res.json({ 
      reply: `[ElectionWise-v2-Live] I am currently helping many voters. Please visit voters.eci.gov.in or call 1950.`,
      error: err.message 
    });
  }
});

/**
 * POST /api/translate
 */
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguage = 'en' } = translateSchema.parse(req.body || {});
    const translations = await translationService.translate(text, targetLanguage);
    res.json({ translations });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Validation Error', details: err.errors });
    res.json({ translations: Array.isArray(req.body?.text) ? req.body.text : [req.body?.text || ''] });
  }
});

app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../dist/index.html')));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`ElectionWise live on :${PORT}`));
