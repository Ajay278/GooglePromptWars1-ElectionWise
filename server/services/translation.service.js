/**
 * Service to handle Google Cloud Translation integration.
 */
class TranslationService {
  /**
   * @param {import('@google-cloud/translate').TranslationServiceClient} client
   * @param {string} projectId
   */
  constructor(client, projectId) {
    this.client = client;
    this.projectId = projectId;
  }

  /**
   * Translates text or array of texts to the target language.
   * @param {string|string[]} text - Content to translate
   * @param {string} targetLanguage - Target ISO code
   */
  async translate(text, targetLanguage = 'en') {
    const [response] = await this.client.translateText({
      parent: `projects/${this.projectId}/locations/global`,
      contents: Array.isArray(text) ? text : [text],
      mimeType: 'text/plain',
      targetLanguageCode: targetLanguage
    });
    return response.translations.map(t => t.translatedText);
  }
}

module.exports = TranslationService;
