/**
 * Service to handle all interactions with the Google Gemini AI.
 */
class AIService {
  /**
   * @param {import('@google/generative-ai').GoogleGenerativeAI} client
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Generates a system instruction based on the user's mode and context.
   */
  getSystemInstruction(mode, language, selectedState) {
    if (mode === 'detector') {
      return `You are an expert Election Misinformation Detector. Analyze claims against ECI guidelines. Respond ONLY in ${language}. CRITICAL: Use the exact English labels 'VERDICT:' and 'EXPLANATION:' in your response regardless of the target language. format: VERDICT: [True/False/Misleading] EXPLANATION: [Brief]`;
    } 
    if (mode === 'simulation') {
      return `You are the Game Master for "Be the Election Officer". Respond in ${language}. Present booth scenarios.`;
    }
    return `You are ElectionWise, a civic guide. State: ${selectedState}. Language: ${language}. Grounded in ECI rules. Respond ONLY in ${language}.`;
  }

  /**
   * Main entry point for chat generation.
   */
  async generateResponse(messages, language, selectedState, mode) {
    const systemInstruction = this.getSystemInstruction(mode, language, selectedState);
    
    const model = this.client.getGenerativeModel({ 
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
    return result.response.text();
  }
}

module.exports = AIService;
