/**
 * Security Middleware
 * @owner: Sujal (Shared - Both review)
 * @purpose: Security headers and CORS configuration
 */

import helmet from 'helmet';
import cors from 'cors';
import { getEnvConfig } from '../config/env.js';

const { frontendUrl } = getEnvConfig();

/**
 * CORS configuration
 */
export const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const envFrontendUrl = process.env.FRONTEND_URL || frontendUrl;

    // Clean URLs (remove trailing slashes for comparison)
    const cleanOrigin = origin.replace(/\/$/, '');
    const cleanFrontendUrl = envFrontendUrl ? envFrontendUrl.replace(/\/$/, '') : null;

    const allowedOrigins = [
      cleanFrontendUrl,
      'http://localhost:5173',
      'http://localhost:3000',
      'https://dating-app1-seven.vercel.app'
    ].filter(Boolean);

    if (allowedOrigins.includes(cleanOrigin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS Warning: Origin ${origin} not explicitly allowed. Allowed: ${allowedOrigins.join(', ')}`);
      // For now, allow it but log a warning to help debug
      callback(null, true);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

/**
 * Helmet security headers
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
});

