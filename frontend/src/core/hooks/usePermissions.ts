import { useState, useEffect, useCallback } from 'react';

export type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unknown';

export interface PermissionState {
    camera: PermissionStatus;
    microphone: PermissionStatus;
    location: PermissionStatus;
}

export const usePermissions = () => {
    const [permissions, setPermissions] = useState<PermissionState>({
        camera: 'unknown',
        microphone: 'unknown',
        location: 'unknown',
    });

    const [isChecking, setIsChecking] = useState(false);

    // Check current permission status
    const checkPermissions = useCallback(async () => {
        setIsChecking(true);
        const newState: PermissionState = {
            camera: 'unknown',
            microphone: 'unknown',
            location: 'unknown',
        };

        try {
            // Check camera permission
            if (navigator.permissions) {
                try {
                    const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
                    newState.camera = cameraPermission.state as PermissionStatus;
                } catch (e) {
                    // Some browsers don't support querying camera permission
                    newState.camera = 'prompt';
                }

                // Check microphone permission
                try {
                    const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
                    newState.microphone = micPermission.state as PermissionStatus;
                } catch (e) {
                    newState.microphone = 'prompt';
                }

                // Check location permission
                try {
                    const locationPermission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
                    newState.location = locationPermission.state as PermissionStatus;
                } catch (e) {
                    newState.location = 'prompt';
                }
            }
        } catch (error) {
            console.error('Error checking permissions:', error);
        }

        setPermissions(newState);
        setIsChecking(false);
    }, []);

    // Request location permission
    const requestLocationPermission = useCallback(async (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                () => {
                    setPermissions(prev => ({ ...prev, location: 'granted' }));
                    resolve(true);
                },
                (error) => {
                    if (error.code === 1) {
                        setPermissions(prev => ({ ...prev, location: 'denied' }));
                    }
                    resolve(false);
                },
                { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
            );
        });
    }, []);

    // Request camera and microphone permissions
    const requestMediaPermissions = useCallback(async (): Promise<boolean> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            // Stop all tracks immediately - we just needed to trigger the permission prompt
            stream.getTracks().forEach(track => track.stop());

            setPermissions(prev => ({
                ...prev,
                camera: 'granted',
                microphone: 'granted',
            }));

            return true;
        } catch (error: any) {
            console.error('Media permission error:', error);

            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                setPermissions(prev => ({
                    ...prev,
                    camera: 'denied',
                    microphone: 'denied',
                }));
            }

            return false;
        }
    }, []);

    // Request all permissions in sequence
    const requestAllPermissions = useCallback(async (): Promise<{
        location: boolean;
        media: boolean;
    }> => {
        const locationGranted = await requestLocationPermission();

        // Small delay between prompts for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        const mediaGranted = await requestMediaPermissions();

        return {
            location: locationGranted,
            media: mediaGranted,
        };
    }, [requestLocationPermission, requestMediaPermissions]);

    // Check permissions on mount
    useEffect(() => {
        checkPermissions();
    }, [checkPermissions]);

    return {
        permissions,
        isChecking,
        checkPermissions,
        requestLocationPermission,
        requestMediaPermissions,
        requestAllPermissions,
    };
};
