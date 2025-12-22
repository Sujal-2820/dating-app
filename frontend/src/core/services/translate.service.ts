/**
 * Translation Service
 * Google Translate API wrapper with caching
 */

import { getStaticTranslation } from '../i18n/staticTranslations';

const GOOGLE_TRANSLATE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_AND_TRANSLATE_API;
const CACHE_KEY_PREFIX = 'translate_cache';

interface TranslationCache {
    [key: string]: string;
}

class TranslateService {
    private cache: TranslationCache = {};
    private isInitialized = false;

    constructor() {
        this.loadCacheFromStorage();
    }

    /**
     * Load translation cache from localStorage
     */
    private loadCacheFromStorage() {
        try {
            const cached = localStorage.getItem(CACHE_KEY_PREFIX);
            if (cached) {
                this.cache = JSON.parse(cached);
                console.log(`📝 Loaded ${Object.keys(this.cache).length} cached translations`);
            }
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to load translation cache:', error);
            this.cache = {};
            this.isInitialized = true;
        }
    }

    /**
     * Save cache to localStorage
     */
    private saveCacheToStorage() {
        try {
            localStorage.setItem(CACHE_KEY_PREFIX, JSON.stringify(this.cache));
        } catch (error) {
            console.error('Failed to save translation cache:', error);
        }
    }

    /**
     * Generate cache key
     */
    private getCacheKey(text: string, sourceLang: string, targetLang: string): string {
        // Simple hash for cache key
        const hash = text.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return `${sourceLang}_${targetLang}_${hash}_${text.length}`;
    }

    /**
     * Translate a single text
     */
    async translate(
        text: string,
        sourceLang: 'en' | 'hi' = 'en',
        targetLang: 'en' | 'hi' = 'hi'
    ): Promise<string> {
        // If same language, return as-is
        if (sourceLang === targetLang) {
            return text;
        }

        // Empty text
        if (!text || text.trim() === '') {
            return text;
        }

        // Check static translations first (instant, no cache needed)
        const staticTraslation = getStaticTranslation(text, targetLang);
        if (staticTraslation) {
            return staticTraslation;
        }

        // Check cache
        const cacheKey = this.getCacheKey(text, sourceLang, targetLang);
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }

        // Translate via Google API
        try {
            if (!GOOGLE_TRANSLATE_API_KEY) {
                console.warn('Google Translate API key not found');
                return text; // Fallback to original
            }

            const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    source: sourceLang,
                    target: targetLang,
                    format: 'text',
                }),
            });

            if (!response.ok) {
                throw new Error(`Translation API error: ${response.status}`);
            }

            const data = await response.json();
            const translatedText = data.data.translations[0].translatedText;

            // Cache the translation
            this.cache[cacheKey] = translatedText;
            this.saveCacheToStorage();

            return translatedText;
        } catch (error) {
            console.error('Translation failed:', error);
            return text; // Fallback to original text
        }
    }

    /**
     * Translate multiple texts in batch
     */
    async translateBatch(
        texts: string[],
        sourceLang: 'en' | 'hi' = 'en',
        targetLang: 'en' | 'hi' = 'hi'
    ): Promise<string[]> {
        if (sourceLang === targetLang) {
            return texts;
        }

        try {
            // Separate texts into cached and uncached
            const results: string[] = new Array(texts.length);
            const toTranslate: { text: string; index: number }[] = [];

            texts.forEach((text, index) => {
                if (!text || text.trim() === '') {
                    results[index] = text;
                    return;
                }

                // Check static first
                const staticTranslation = getStaticTranslation(text, targetLang);
                if (staticTranslation) {
                    results[index] = staticTranslation;
                    return;
                }

                // Check cache
                const cacheKey = this.getCacheKey(text, sourceLang, targetLang);
                if (this.cache[cacheKey]) {
                    results[index] = this.cache[cacheKey];
                    return;
                }

                // Mark for API translation
                toTranslate.push({ text, index });
            });

            // If everything is cached, return immediately
            if (toTranslate.length === 0) {
                return results;
            }

            // Translate uncached texts via API
            if (!GOOGLE_TRANSLATE_API_KEY) {
                console.warn('Google Translate API key not found');
                // Fill uncached with originals
                toTranslate.forEach(({ text, index }) => {
                    results[index] = text;
                });
                return results;
            }

            const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: toTranslate.map(item => item.text),
                    source: sourceLang,
                    target: targetLang,
                    format: 'text',
                }),
            });

            if (!response.ok) {
                throw new Error(`Translation API error: ${response.status}`);
            }

            const data = await response.json();
            const translations = data.data.translations;

            // Fill results and cache
            toTranslate.forEach(({ text, index }, i) => {
                const translatedText = translations[i].translatedText;
                results[index] = translatedText;

                const cacheKey = this.getCacheKey(text, sourceLang, targetLang);
                this.cache[cacheKey] = translatedText;
            });

            this.saveCacheToStorage();
            return results;
        } catch (error) {
            console.error('Batch translation failed:', error);
            // Fallback: return original texts for failed items
            return texts.map((text, index) => results[index] || text);
        }
    }

    /**
     * Clear all cached translations
     */
    clearCache() {
        this.cache = {};
        localStorage.removeItem(CACHE_KEY_PREFIX);
        console.log('🗑️ Translation cache cleared');
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            totalEntries: Object.keys(this.cache).length,
            estimatedSize: new Blob([JSON.stringify(this.cache)]).size,
        };
    }
}

export const translateService = new TranslateService();
export default translateService;
