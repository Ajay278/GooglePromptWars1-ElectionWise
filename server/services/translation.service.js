const { TranslationServiceClient } = require('@google-cloud/translate');

const translationClient = new TranslationServiceClient();
const PROJECT_ID = 'electionwise-2026';

/**
 * Service to handle Google Cloud Translation integration.
 */
class TranslationService {
  /**
   * Translates text or array of texts to the target language.
   * @param {string|string[]} text - Content to translate
   * @param {string} targetLanguage - Target ISO code
   */
  async translate(text, targetLanguage = 'en') {
    const [response] = await translationClient.translateText({
      parent: `projects/${PROJECT_ID}/locations/global`,
      contents: Array.isArray(text) ? text : [text],
      mimeType: 'text/plain',
      targetLanguageCode: targetLanguage
    });
    return response.translations.map(t => t.translatedText);
  }
}

module.exports = new TranslationService();
