import { describe, it, expect, vi } from 'vitest';
import AIService from '../server/services/ai.service';
import TranslationService from '../server/services/translation.service';

describe('Backend Services (SOLID Compliance)', () => {
  describe('AIService', () => {
    it('generates correct system instructions for different modes', () => {
      const mockClient = {} as any;
      const service = new AIService(mockClient);
      
      expect(service.getSystemInstruction('detector', 'Hindi', 'Bihar')).toContain('Misinformation Detector');
      expect(service.getSystemInstruction('simulation', 'Tamil', 'Goa')).toContain('Game Master');
      expect(service.getSystemInstruction('assistant', 'English', 'Delhi')).toContain('civic guide');
    });

    it('calls the Gemini API with correct parameters', async () => {
      const mockChat = {
        sendMessage: vi.fn().mockResolvedValue({ response: { text: () => 'Mock Response' } })
      };
      const mockModel = {
        startChat: vi.fn().mockReturnValue(mockChat)
      };
      const mockClient = {
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      } as any;

      const service = new AIService(mockClient);
      const reply = await service.generateResponse(
        [{ role: 'user', content: 'Hello' }],
        'English',
        'All India',
        'assistant'
      );

      expect(reply).toBe('Mock Response');
      expect(mockClient.getGenerativeModel).toHaveBeenCalledWith(expect.objectContaining({
        model: 'gemini-2.5-flash'
      }));
    });
  });

  describe('TranslationService', () => {
    it('calls Google Translate API with correct projectId', async () => {
      const mockTranslateText = vi.fn().mockResolvedValue([{
        translations: [{ translatedText: 'नमस्ते' }]
      }]);
      const mockClient = {
        translateText: mockTranslateText
      } as any;

      const service = new TranslationService(mockClient, 'test-project');
      const results = await service.translate('Hello', 'hi');

      expect(results[0]).toBe('नमस्ते');
      expect(mockTranslateText).toHaveBeenCalledWith(expect.objectContaining({
        parent: 'projects/test-project/locations/global',
        targetLanguageCode: 'hi'
      }));
    });
  });
});
