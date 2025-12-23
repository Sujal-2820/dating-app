import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';
import { FemaleBottomNavigation } from '../components/FemaleBottomNavigation';
import { useFemaleNavigation } from '../hooks/useFemaleNavigation';
import userService from '../../../core/services/user.service';

interface UserProfile {
  _id: string;
  name: string;
  bio?: string;
  age?: number;
  location?: string;
  occupation?: string;
  photos: { url: string; isPrimary: boolean }[];
  isOnline?: boolean;
  isVerified?: boolean;
}

export const UserProfilePage = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { navigationItems, handleNavigationClick } = useFemaleNavigation();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProfile();
  }, [profileId]);

  const fetchProfile = async () => {
    console.log('[FemaleUserProfilePage] fetchProfile called, profileId:', profileId);

    if (!profileId) {
      console.error('[FemaleUserProfilePage] No profileId provided');
      setError('No user ID');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('[FemaleUserProfilePage] Fetching profile...');
      const data = await userService.getUserProfile(profileId);
      console.log('[FemaleUserProfilePage] Profile data received:', data);

      // Map backend response to frontend structure
      const mappedProfile: UserProfile = {
        _id: data.id || data._id,
        name: data.name,
        bio: data.bio,
        age: data.age,
        location: data.city || data.location,
        occupation: data.occupation,
        photos: data.photos || [],
        isOnline: data.isOnline,
        isVerified: data.isVerified,
      };

      console.log('[FemaleUserProfilePage] Mapped profile:', mappedProfile);
      setProfile(mappedProfile);
    } catch (err: any) {
      console.error('[FemaleUserProfilePage] Error fetching profile:', err);
      console.error('[FemaleUserProfilePage] Error response:', err.response);
      setError(err.response?.data?.message || err.message || 'Failed to load profile');
    } finally {
      console.log('[FemaleUserProfilePage] Setting isLoading to false');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background-light dark:bg-background-dark p-4">
        <MaterialSymbol name="error" size={48} className="text-red-500 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error || 'Profile not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-primary text-slate-900 font-bold rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const photos = profile.photos || [];
  const primaryPhoto = photos.find(p => p.isPrimary) || photos[0];

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-20">
      {/* Header with Back Button */}
      <header className="sticky top-0 z-30 bg-white dark:bg-[#2d1a24] border-b border-gray-200 dark:border-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 dark:bg-[#342d18] text-gray-600 dark:text-white hover:bg-gray-300 dark:hover:bg-[#4b202e] transition-colors active:scale-95"
          >
            <MaterialSymbol name="arrow_back" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>
        </div>
      </header>

      {/* Profile Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Profile Picture */}
        {primaryPhoto && (
          <div className="relative w-full aspect-square max-h-[500px] bg-gray-200 dark:bg-[#342d18]">
            <img
              src={primaryPhoto.url}
              alt={profile.name}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setSelectedPhotoIndex(photos.findIndex(p => p.isPrimary) || 0)}
            />
            {profile.isOnline && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Online
              </div>
            )}
          </div>
        )}

        {/* Profile Info */}
        <div className="px-6 py-6 space-y-6">
          {/* Name and Verification */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
              {profile.isVerified && (
                <MaterialSymbol name="verified" filled size={24} className="text-blue-500" />
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              {profile.age && <span>{profile.age} years old</span>}
            </div>
            {profile.occupation && (
              <div className="mt-2">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {profile.occupation}
                </span>
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">About</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Photo Gallery */}
          {photos.length > 1 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className="relative aspect-square bg-gray-200 dark:bg-[#342d18] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {photo.isPrimary && (
                      <div className="absolute top-1 right-1 bg-primary text-slate-900 px-2 py-0.5 rounded text-xs font-bold">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main >

      {/* Photo Lightbox */}
      {
        selectedPhotoIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <MaterialSymbol name="close" size={32} />
            </button>

            {/* Navigation Arrows */}
            {selectedPhotoIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex(selectedPhotoIndex - 1);
                }}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors"
              >
                <MaterialSymbol name="chevron_left" size={48} />
              </button>
            )}

            {selectedPhotoIndex < photos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex(selectedPhotoIndex + 1);
                }}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors"
              >
                <MaterialSymbol name="chevron_right" size={48} />
              </button>
            )}

            {/* Image */}
            <img
              src={photos[selectedPhotoIndex].url}
              alt={`Photo ${selectedPhotoIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Photo Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {selectedPhotoIndex + 1} / {photos.length}
            </div>
          </div>
        )
      }

      {/* Bottom Navigation */}
      <FemaleBottomNavigation items={navigationItems} onItemClick={handleNavigationClick} />
    </div >
  );
};
