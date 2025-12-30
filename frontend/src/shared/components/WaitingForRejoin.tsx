/**
 * Waiting for Rejoin Overlay
 * Shows when remote user is disconnected and might rejoin
 */

import React from 'react';
import { useTranslation } from '../../core/hooks/useTranslation';

interface WaitingForRejoinProps {
    isVisible: boolean;
}

export const WaitingForRejoin: React.FC<WaitingForRejoinProps> = ({
    isVisible,
}) => {
    const { t } = useTranslation();

    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center p-6">
                {/* Animated Icon */}
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        {/* Ripple effect */}
                        <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping"></div>
                    </div>
                </div>

                {/* Message */}
                <h3 className="text-xl font-bold text-white mb-2">
                    {t('Connection Lost')}
                </h3>
                <p className="text-gray-300 mb-4">
                    {t('Waiting for user to rejoin')}
                </p>

                {/* Loading Dots */}
                <div className="flex justify-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
};
