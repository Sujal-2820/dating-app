/**
 * Video Call Reconnection Popup
 * Shows when call is disconnected and allows one-time rejoin
 */

import React from 'react';
import { useTranslation } from '../../core/hooks/useTranslation';

interface ReconnectionPopupProps {
    isVisible: boolean;
    hasReconnected: boolean;
    remainingTime: number;
    onRejoin: () => void;
    onEndCall: () => void;
}

export const ReconnectionPopup: React.FC<ReconnectionPopupProps> = ({
    isVisible,
    hasReconnected,
    remainingTime,
    onRejoin,
    onEndCall,
}) => {
    const { t } = useTranslation();

    if (!isVisible) return null;

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
                    {t('Call Disconnected')}
                </h3>

                {/* Message */}
                <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
                    {hasReconnected
                        ? t('Already rejoined once')
                        : t('You can rejoin the call')
                    }
                </p>

                {/* Time Remaining */}
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            {t('Time Remaining')}
                        </span>
                        <span className="text-lg font-bold text-primary">
                            {formatTime(remainingTime)}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    {!hasReconnected && (
                        <button
                            onClick={onRejoin}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {t('Rejoin Call')}
                        </button>
                    )}

                    <button
                        onClick={onEndCall}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                        {t('End Call')}
                    </button>
                </div>

                {/* Info */}
                {!hasReconnected && (
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                        {t('One-time rejoin available')}
                    </p>
                )}
            </div>
        </div>
    );
};
