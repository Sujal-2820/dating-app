import { useState } from 'react';
import { MaterialSymbol } from './MaterialSymbol';
import { usePermissions } from '../../core/hooks/usePermissions';

interface PermissionRequestModalProps {
    onComplete?: () => void;
    onSkip?: () => void;
}

export const PermissionRequestModal = ({ onComplete, onSkip }: PermissionRequestModalProps) => {
    const { requestAllPermissions } = usePermissions();
    const [isRequesting, setIsRequesting] = useState(false);
    const [error, setError] = useState('');

    const handleEnablePermissions = async () => {
        setIsRequesting(true);
        setError('');

        try {
            const result = await requestAllPermissions();

            if (!result.location && !result.media) {
                setError('Please allow permissions to use all features of the app.');
            } else if (!result.location) {
                setError('Location permission is required to find nearby users.');
            } else if (!result.media) {
                setError('Camera and microphone are required for video calls.');
            }

            // Even if some permissions were denied, we complete the flow
            // User can enable them later from browser settings
            if (onComplete) {
                setTimeout(() => {
                    onComplete();
                }, 1000);
            }
        } catch (err) {
            console.error('Permission request error:', err);
            setError('Failed to request permissions. Please try again.');
        } finally {
            setIsRequesting(false);
        }
    };

    const handleSkip = () => {
        if (onSkip) {
            onSkip();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#342d18] rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 mb-4">
                        <MaterialSymbol name="verified_user" size={40} className="text-pink-600 dark:text-pink-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Enable Permissions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        To provide you with the best experience, we need access to:
                    </p>
                </div>

                {/* Permission List */}
                <div className="space-y-4 mb-6">
                    {/* Location */}
                    <div className="flex items-start gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center">
                            <MaterialSymbol name="location_on" size={20} className="text-pink-600 dark:text-pink-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Location</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Find and connect with nearby users</p>
                        </div>
                    </div>

                    {/* Camera */}
                    <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                            <MaterialSymbol name="videocam" size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Camera</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Make video calls with other users</p>
                        </div>
                    </div>

                    {/* Microphone */}
                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                            <MaterialSymbol name="mic" size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Microphone</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Communicate during video calls</p>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                            <MaterialSymbol name="error" size={16} />
                            {error}
                        </p>
                    </div>
                )}

                {/* Privacy Note */}
                <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <MaterialSymbol name="lock" size={14} className="mt-0.5 flex-shrink-0" />
                        <span>Your privacy is important. We only use these permissions to provide core features and never share your data.</span>
                    </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleEnablePermissions}
                        disabled={isRequesting}
                        className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isRequesting ? (
                            <span className="flex items-center justify-center gap-2">
                                <MaterialSymbol name="sync" size={20} className="animate-spin" />
                                Requesting...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <MaterialSymbol name="check_circle" size={20} />
                                Enable Permissions
                            </span>
                        )}
                    </button>

                    <button
                        onClick={handleSkip}
                        disabled={isRequesting}
                        className="w-full py-2 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};
