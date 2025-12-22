// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';
import { useTranslation } from '../../../core/hooks/useTranslation';
import type { LoginData } from '../types/auth.types';

import { loginWithOtp } from '../services/auth.service';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // ADD THIS LINE
  const [formData, setFormData] = useState<{ phone: string }>({
    phone: '',
  });
  const [errors, setErrors] = useState<{ phone?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: { phone?: string } = {};

    if (!formData.phone?.trim()) {
      newErrors.phone = t('Phone number is required'); // TRANSLATE ERROR MESSAGES
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = t('Please enter a valid 10-digit phone number');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setApiError(null);
      try {
        await loginWithOtp(formData.phone);
        navigate('/otp-verification', {
          state: { mode: 'login', phoneNumber: formData.phone }
        });
      } catch (err: any) {
        setApiError(err.message || t('Login request failed')); // TRANSLATE
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (value: string) => {
    // Only allow digits inside state
    const cleanValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData({ phone: cleanValue });
    if (errors.phone) {
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
            MatchMint
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('Welcome Back')}</h2>
          <p className="text-gray-600">{t('Login to continue your journey')}</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('Contact Number')} {/* TRANSLATE ALL LABELS */}
              </label>
              <div className="flex">
                <div className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg flex items-center">
                  <span className="text-gray-700 font-medium">+91</span>
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange(e.target.value)}
                  className={`flex-1 px-4 py-3 bg-white text-gray-900 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="9876543210"
                  maxLength={10}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Info Text */}
            <p className="text-sm text-gray-600 text-center">
              {t('We will send you a verification code to continue')} {/* TRANSLATE */}
            </p>

            {apiError && (
              <div className="text-red-500 text-sm text-center">
                {apiError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-lg hover:from-pink-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? t('Sending Code...') : t('Continue')} {/* TRANSLATE BUTTON TEXT */}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('Do not have an account?')}{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-pink-600 font-semibold hover:text-pink-700"
              >
                {t('Sign Up')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

