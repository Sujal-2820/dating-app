import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';
import { BottomNavigation } from '../components/BottomNavigation';
import { MaleTopNavbar } from '../components/MaleTopNavbar';
import { MaleSidebar } from '../components/MaleSidebar';
import { useMaleNavigation } from '../hooks/useMaleNavigation';
import userService from '../../../core/services/user.service';

export const UserProfilePage = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { isSidebarOpen, setIsSidebarOpen, navigationItems, handleNavigationClick } = useMaleNavigation();

  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await userService.getUserProfile(profileId!);

      // Transform backend data to frontend format if needed
      const sanitizedProfile = {
        id: data.id || data._id,
        name: data.profile?.name || data.name || 'Anonymous',
        age: data.profile?.age || data.age,
        avatar: data.profile?.photos?.[0]?.url || data.avatar || '',
        distance: data.distance || 'Unknown distance',
        isOnline: !!data.isOnline,
        occupation: data.profile?.occupation || data.occupation || '',
        chatCost: data.chatCost || 50,
        bio: data.profile?.bio || data.bio || '',
        interests: data.profile?.interests || data.interests || [],
        photos: data.profile?.photos?.map((p: any) => p.url) || data.photos || []
      };

      setProfile(sanitizedProfile);
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleChatClick = () => {
    if (profile) {
      navigate(`/male/chat/${profile.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center p-4">
          <MaterialSymbol name="person_off" size={48} className="text-gray-400 dark:text-gray-600 mb-4 mx-auto" />
          <p className="text-gray-500 dark:text-[#cc8ea3]">{error || 'Profile not found'}</p>
          <button
            onClick={handleBackClick}
            className="mt-4 px-4 py-2 bg-primary text-black rounded-xl font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isPrimaryButton = profile.isOnline || profile.bio?.includes('New here');

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased selection:bg-primary selection:text-white pb-24 min-h-screen">
      {/* Top Navbar */}
      <MaleTopNavbar onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Sidebar */}
      <MaleSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        items={navigationItems}
        onItemClick={handleNavigationClick}
      />

      {/* Header */}
      <header className="sticky top-[57px] z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-black/5 dark:border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleBackClick}
            className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-[#342d18] text-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-[#4b202e] transition-colors active:scale-95"
            aria-label="Go back"
          >
            <MaterialSymbol name="arrow_back" size={24} />
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Profile</h1>
          <div className="size-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Profile Image */}
      <div className="relative w-full aspect-[3/4] bg-gray-200 dark:bg-[#342d18]">
        <img
          alt={`${profile.name} profile picture`}
          className="absolute inset-0 h-full w-full object-cover"
          src={profile.avatar}
        />
        {/* Distance Badge */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-3 py-1.5">
            <MaterialSymbol name="location_on" size={16} className="text-white" />
            <span className="text-xs font-bold text-white">{profile.distance}</span>
          </div>
        </div>
        {/* Online Status Badge */}
        {profile.isOnline && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 rounded-full bg-green-500/90 backdrop-blur-sm px-3 py-1.5 shadow-sm">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Online</span>
            </div>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {profile.name}, {profile.age}
          </h2>
          {profile.occupation && (
            <p className="text-base text-gray-600 dark:text-gray-400 mt-1">{profile.occupation}</p>
          )}
          {profile.bio && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{profile.bio}</p>
          )}
        </div>

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        {profile.photos && profile.photos.length > 1 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Photos</h3>
            <div className="grid grid-cols-3 gap-2">
              {profile.photos.slice(1).map((photo: string, index: number) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={photo}
                    alt={`Photo ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Button */}
        <button
          onClick={handleChatClick}
          className={`w-full flex items-center justify-center gap-2 rounded-full py-4 text-base font-bold text-white transition-all active:scale-95 ${isPrimaryButton
              ? 'bg-primary hover:bg-yellow-400 shadow-lg shadow-primary/20'
              : 'bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/10'
            }`}
        >
          <MaterialSymbol name="chat_bubble" size={20} />
          <span>Start Chat</span>
          <div
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${isPrimaryButton ? 'bg-white/20' : 'bg-black/20'
              }`}
          >
            <MaterialSymbol name="monetization_on" size={12} />
            <span>{profile.chatCost}</span>
          </div>
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavigation items={navigationItems} onItemClick={handleNavigationClick} />
    </div>
  );
};
