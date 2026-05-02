# ElectionWise API Documentation

This document describes the internal API endpoints used by the ElectionWise platform.

## Base URL
All endpoints are relative to `/api`.

## 1. POST `/ask`
The primary endpoint for interacting with the Gemini-powered Civic Assistant.

### Request Body
```json
{
  "messages": [
    { "role": "user", "content": "How do I register to vote?" }
  ],
  "language": "Hindi",
  "selectedState": "Maharashtra",
  "mode": "assistant"
}
```
- `mode`: Can be `assistant`, `simulation`, or `detector`.
- `selectedState`: Provides geographical context for ECI guidelines.

### Response
```json
{
  "reply": "AI response text here..."
}
```

## 2. POST `/translate`
Batch translation utility using Google Cloud Translation API.

### Request Body
```json
{
  "text": ["Hello", "World"],
  "targetLanguage": "hi"
}
```

### Response
```json
{
  "translations": ["नमस्ते", "दुनिया"]
}
```

## Security & Reliability
- **Rate Limiting:** Limited to 100 requests per 15 minutes per IP.
- **Validation:** All inputs are strictly validated via **Zod schemas**.
- **Fallbacks:** In case of upstream AI failure, a static ECI fallback message is returned to maintain service availability.
