/**
 * Translation Service - Google Translate API Integration
 * Handles translation of dynamic content (names, bios, etc.)
 * @owner: Translation Domain
 */

import axios from 'axios';

const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

/**
 * Detect language of text
 * @param {string} text - Text to detect language of
 * @returns {Promise<string>} - Language code ('en', 'hi', etc.)
 */
export const detectLanguage = async (text) => {
    if (!text || !text.trim()) return 'en';

    try {
        // Simple heuristic: if contains Devanagari script, it's Hindi
        const hindiPattern = /[\u0900-\u097F]/;
        if (hindiPattern.test(text)) {
            return 'hi';
        }
        return 'en';
    } catch (error) {
        console.error('Language detection error:', error);
        return 'en';
    }
};

/**
 * Translate text using Google Translate API
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code ('en' or 'hi')
 * @param {string} sourceLang - Source language code (optional, auto-detect if not provided)
 * @returns {Promise<string>} - Translated text
 */
export const translateText = async (text, targetLang, sourceLang = null) => {
    // Return original if empty
    if (!text || !text.trim()) {
        return text;
    }

    // If no API key, return original text (fallback for development)
    if (!GOOGLE_TRANSLATE_API_KEY) {
        console.warn('Google Translate API key not configured. Using original text.');
        return text;
    }

    try {
        // Detect source language if not provided
        if (!sourceLang) {
            sourceLang = await detectLanguage(text);
        }

        // If source and target are the same, return original
        if (sourceLang === targetLang) {
            return text;
        }

        // Call Google Translate API
        const response = await axios.post(
            GOOGLE_TRANSLATE_API_URL,
            null,
            {
                params: {
                    q: text,
                    target: targetLang,
                    source: sourceLang,
                    key: GOOGLE_TRANSLATE_API_KEY,
                    format: 'text'
                }
            }
        );

        const translatedText = response.data.data.translations[0].translatedText;
        return translatedText;

    } catch (error) {
        console.error('Translation error:', error.response?.data || error.message);
        // Return original text on error
        return text;
    }
};

/**
 * Translate multiple texts in batch
 * More efficient than calling translateText multiple times
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLang - Target language code
 * @returns {Promise<string[]>} - Array of translated texts
 */
export const translateBatch = async (texts, targetLang) => {
    if (!texts || texts.length === 0) {
        return [];
    }

    if (!GOOGLE_TRANSLATE_API_KEY) {
        console.warn('Google Translate API key not configured. Using original texts.');
        return texts;
    }

    try {
        const response = await axios.post(
            GOOGLE_TRANSLATE_API_URL,
            null,
            {
                params: {
                    q: texts,
                    target: targetLang,
                    key: GOOGLE_TRANSLATE_API_KEY,
                    format: 'text'
                }
            }
        );

        return response.data.data.translations.map(t => t.translatedText);

    } catch (error) {
        console.error('Batch translation error:', error.response?.data || error.message);
        return texts;
    }
};

/**
 * Translate name and bio for user profile (optimized for caching)
 * @param {Object} data - Object with name and bio
 * @returns {Promise<Object>} - Object with translated versions
 */
export const translateProfileData = async (data) => {
    const { name, bio } = data;

    // Detect original language
    const originalLang = await detectLanguage(name || bio || '');

    const result = {
        name,
        name_en: name,
        name_hi: name,
        bio: bio || '',
        bio_en: bio || '',
        bio_hi: bio || ''
    };

    try {
        // Translate to both languages
        if (originalLang === 'en') {
            // Original is English, translate to Hindi
            result.name_hi = await translateText(name, 'hi', 'en');
            if (bio) {
                result.bio_hi = await translateText(bio, 'hi', 'en');
            }
        } else {
            // Original is Hindi, translate to English
            result.name_en = await translateText(name, 'en', 'hi');
            if (bio) {
                result.bio_en = await translateText(bio, 'en', 'hi');
            }
        }

        return result;

    } catch (error) {
        console.error('Profile translation error:', error);
        // Return with originals on error
        return result;
    }
};

export default {
    detectLanguage,
    translateText,
    translateBatch,
    translateProfileData
};
