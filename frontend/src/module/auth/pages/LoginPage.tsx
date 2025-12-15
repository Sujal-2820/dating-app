import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';
import type { LoginData } from '../types/auth.types';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    phone: '',
  });
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [errors, setErrors] = useState<Partial<LoginData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginData> = {};

    if (loginMethod === 'email') {
      if (!formData.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    } else {
      if (!formData.phone?.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // In real app, this would trigger OTP/verification
      // For now, simulate login and redirect to appropriate dashboard
      // TODO: Implement OTP verification flow
      console.log('Login attempt:', formData);
      // For demo purposes, redirect to male dashboard
      // In production, this would check user's gender from backend
      navigate('/male/dashboard');
    }
  };

  const handleChange = (field: keyof LoginData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Login to continue your journey</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Login Method Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('email');
                setFormData({ email: '', phone: '' });
                setErrors({});
              }}
              className={`flex-1 py-2 rounded-md font-medium transition-all ${
                loginMethod === 'email'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod('phone');
                setFormData({ email: '', phone: '' });
                setErrors({});
              }}
              className={`flex-1 py-2 rounded-md font-medium transition-all ${
                loginMethod === 'phone'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Phone
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            {loginMethod === 'email' && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full px-4 py-3 bg-white text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            )}

            {/* Phone Input */}
            {loginMethod === 'phone' && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <div className="flex">
                  <div className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg flex items-center">
                    <span className="text-gray-700 font-medium">+91</span>
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={`flex-1 px-4 py-3 bg-white text-gray-900 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            )}

            {/* Info Text */}
            <p className="text-sm text-gray-600 text-center">
              We'll send you a verification code to continue
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-lg hover:from-pink-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Continue
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-pink-600 font-semibold hover:text-pink-700"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

