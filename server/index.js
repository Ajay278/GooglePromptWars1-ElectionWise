'use strict';
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');

// Services
const aiService = require('./services/ai.service');
const translationService = require('./services/translation.service');

const app = express();
app.use(compression());
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

/**
 * Security: Rate Limiting
 * Prevents API abuse and token exhaustion by limiting requests per IP address.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
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
 * Main AI agent endpoint. Delegated to AIService.
 */
app.post('/api/ask', async (req, res) => {
  try {
    const { messages = [], language = 'English', selectedState = 'All India', mode = 'assistant' } = askSchema.parse(req.body || {});
    
    if (messages.length === 0) return res.json({ reply: 'How can I help you today?' });

    const reply = await aiService.generateResponse(messages, language, selectedState, mode);
    
    res.setHeader('Cache-Control', 'no-store');
    res.json({ reply });

  } catch (err) {
    const keyPrefix = (process.env.GEMINI_API_KEY || '').substring(0, 8);
    console.error(`[DEBUG] AI Error with Key (${keyPrefix}...):`, err.message);
    res.json({ 
      reply: `[ElectionWise-v2-Live] I am currently helping many voters. Please visit voters.eci.gov.in or call 1950.`,
      error: err.message 
    });
  }
});

/**
 * POST /api/translate
 * Translation endpoint. Delegated to TranslationService.
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
app.listen(PORT, () => console.log(`ElectionWise server live on :${PORT}`));
