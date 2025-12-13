import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../components/TopAppBar';
import { BottomNavigation } from '../components/BottomNavigation';
import { MaleTopNavbar } from '../components/MaleTopNavbar';
import { MaleSidebar } from '../components/MaleSidebar';
import { useMaleNavigation } from '../hooks/useMaleNavigation';
import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';

// Mock data - replace with actual API calls
const mockProfile = {
  id: 'me',
  name: 'John Doe',
  age: 28,
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoS_YLtV4hpNVbbyf0nrVmbQX6vzgn-xGLdye-t2gBz0LRib9HX4PeYJIj364IRM63hBRKmTLtWfuVOfikvNIryKKMjql6Ig1suPsbWoA45Vt8rO0N-wt7qwqIwMBV4Gaw6j7ooJER4L9QExcc20SNkyk1schLm-swXJOgx5ez3objGGhUPZpOMLYRY2W5WgHwClZhJ-JaWw470QybQVyCQD-hZYfamq_iJqx0EAJE0UNaa6Ee3_FbUUYSuUIIViQ_QxI6ytCepxc',
  bio: 'Love traveling and exploring new places. Looking for someone to share adventures with!',
  occupation: 'Software Engineer',
  city: 'Mumbai',
  interests: ['Travel', 'Photography', 'Hiking', 'Music'],
  preferences: {
    ageRange: { min: 22, max: 35 },
    maxDistance: 50,
    interests: ['Travel', 'Photography'],
  },
  photos: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBoS_YLtV4hpNVbbyf0nrVmbQX6vzgn-xGLdye-t2gBz0LRib9HX4PeYJIj364IRM63hBRKmTLtWfuVOfikvNIryKKMjql6Ig1suPsbWoA45Vt8rO0N-wt7qwqIwMBV4Gaw6j7ooJER4L9QExcc20SNkyk1schLm-swXJOgx5ez3objGGhUPZpOMLYRY2W5WgHwClZhJ-JaWw470QybQVyCQD-hZYfamq_iJqx0EAJE0UNaa6Ee3_FbUUYSuUIIViQ_QxI6ytCepxc',
  ],
};

const mockStats = {
  profileViews: 342,
  matches: 12,
  messagesSent: 85,
  coinsSpent: 4250,
};

export const MyProfilePage = () => {
  const navigate = useNavigate();
  const { isSidebarOpen, setIsSidebarOpen, navigationItems, handleNavigationClick } = useMaleNavigation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profile, setProfile] = useState(mockProfile);
  const [editedProfile, setEditedProfile] = useState(mockProfile);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowMessagesFrom, setAllowMessagesFrom] = useState<'everyone' | 'verified'>('everyone');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleEdit = () => {
    setIsEditMode(true);
    setEditedProfile({ ...profile });
  };

  const handleSave = () => {
    setProfile({ ...editedProfile });
    setIsEditMode(false);
    // TODO: API call to save profile
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditMode(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile({
          ...editedProfile,
          avatar: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: string[] = [...editedProfile.photos || []];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') && newPhotos.length < 6) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            setEditedProfile({
              ...editedProfile,
              photos: [...editedProfile.photos || [], result],
            });
          }
        };
        reader.readAsDataURL(file);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeletePhoto = (index: number) => {
    const newPhotos = editedProfile.photos?.filter((_, i) => i !== index) || [];
    setEditedProfile({ ...editedProfile, photos: newPhotos });
  };

  const handleSetProfilePhoto = (index: number) => {
    const newPhotos = [...editedProfile.photos || []];
    const [selectedPhoto] = newPhotos.splice(index, 1);
    newPhotos.unshift(selectedPhoto);
    setEditedProfile({ ...editedProfile, photos: newPhotos, avatar: selectedPhoto });
  };

  const currentProfile = isEditMode ? editedProfile : profile;

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

      {/* Top App Bar */}
      <TopAppBar
        title={isEditMode ? 'Edit Profile' : 'My Profile'}
        icon="person"
        onFilterClick={() => {}}
        onSearch={() => {}}
      />

      {/* Profile Content */}
      <main className="p-4 space-y-6">
        {/* Profile Photo */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={currentProfile.avatar}
              alt={currentProfile.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-primary"
            />
            {isEditMode && (
              <label className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white cursor-pointer hover:bg-primary/90 transition-colors active:scale-95">
                <MaterialSymbol name="camera_alt" size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {!isEditMode && (
            <button
              onClick={handleEdit}
              className="mt-4 px-6 py-2 bg-primary text-[#231d10] font-semibold rounded-xl hover:bg-primary/90 transition-colors active:scale-95"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="bg-white dark:bg-[#342d18] rounded-2xl p-4 shadow-sm space-y-4">
          {/* Name and Age */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Name
            </label>
            {isEditMode ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2f151e] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            ) : (
              <p className="text-lg font-bold">{profile.name}</p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Age
            </label>
            {isEditMode ? (
              <input
                type="number"
                min="18"
                max="100"
                value={editedProfile.age}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, age: parseInt(e.target.value) || 18 })
                }
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2f151e] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            ) : (
              <p className="text-base">{profile.age} years old</p>
            )}
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Occupation
            </label>
            {isEditMode ? (
              <input
                type="text"
                value={editedProfile.occupation || ''}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, occupation: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2f151e] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your occupation"
              />
            ) : (
              <p className="text-base">{profile.occupation || 'Not specified'}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              City
            </label>
            {isEditMode ? (
              <input
                type="text"
                value={editedProfile.city || ''}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, city: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2f151e] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your city"
              />
            ) : (
              <p className="text-base">{profile.city || 'Not specified'}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Bio
            </label>
            {isEditMode ? (
              <textarea
                value={editedProfile.bio || ''}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, bio: e.target.value })
                }
                rows={4}
                maxLength={500}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2f151e] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-base text-gray-700 dark:text-gray-300">
                {profile.bio || 'No bio yet'}
              </p>
            )}
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {currentProfile.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        {!isEditMode && (
          <div className="bg-white dark:bg-[#342d18] rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Photo Gallery</h3>
            <div className="grid grid-cols-3 gap-2">
              {(profile.photos || [profile.avatar]).map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {(profile.photos || [profile.avatar]).length < 6 && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:border-primary transition-colors"
                >
                  <MaterialSymbol name="add" size={24} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Photo Gallery (Edit Mode) */}
        {isEditMode && (
          <div className="bg-white dark:bg-[#342d18] rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Photo Gallery (Max 6)</h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {(editedProfile.photos || [editedProfile.avatar]).map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {index !== 0 && (
                      <button
                        onClick={() => handleSetProfilePhoto(index)}
                        className="p-1 bg-white/20 rounded backdrop-blur-sm hover:bg-white/30"
                        title="Set as profile photo"
                      >
                        <MaterialSymbol name="star" size={16} className="text-white" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePhoto(index)}
                      className="p-1 bg-red-500/80 rounded backdrop-blur-sm hover:bg-red-500"
                      title="Delete photo"
                    >
                      <MaterialSymbol name="delete" size={16} className="text-white" />
                    </button>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-1 left-1 bg-primary text-slate-900 text-xs px-1 rounded font-bold">
                      Main
                    </div>
                  )}
                </div>
              ))}
              {(editedProfile.photos || [editedProfile.avatar]).length < 6 && (
                <button
                  onClick={handlePhotoUpload}
                  className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:border-primary transition-colors"
                >
                  <MaterialSymbol name="add" size={24} className="text-gray-400" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Activity Summary */}
        {!isEditMode && (
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/5 dark:via-primary/3 dark:to-transparent rounded-2xl p-4 border border-primary/20">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MaterialSymbol name="insights" className="text-primary" />
              Activity Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{mockStats.profileViews}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Profile Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{mockStats.matches}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{mockStats.messagesSent}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Messages Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{mockStats.coinsSpent}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Coins Spent</div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Settings */}
        {!isEditMode && (
          <div className="bg-white dark:bg-[#342d18] rounded-2xl p-4 shadow-sm space-y-4">
            <h3 className="font-semibold mb-3">Profile Settings</h3>
            
            {/* Privacy Settings */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Privacy</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MaterialSymbol name="visibility" size={20} className="text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show Online Status</span>
                </div>
                <button
                  onClick={() => setShowOnlineStatus(!showOnlineStatus)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    showOnlineStatus ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      showOnlineStatus ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MaterialSymbol name="chat" size={20} className="text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Who Can Message Me</span>
                </div>
                <select
                  value={allowMessagesFrom}
                  onChange={(e) => setAllowMessagesFrom(e.target.value as 'everyone' | 'verified')}
                  className="px-3 py-1 bg-gray-100 dark:bg-[#2f151e] border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                >
                  <option value="everyone">Everyone</option>
                  <option value="verified">Verified Only</option>
                </select>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MaterialSymbol name="email" size={20} className="text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    emailNotifications ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      emailNotifications ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MaterialSymbol name="notifications" size={20} className="text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Push Notifications</span>
                </div>
                <button
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    pushNotifications ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      pushNotifications ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Account Settings */}
            <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Account</h4>
              <button
                onClick={() => navigate('/male/badges')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2f151e] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MaterialSymbol name="workspace_premium" size={20} className="text-primary" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">View Badges</span>
                </div>
                <MaterialSymbol name="chevron_right" size={20} className="text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2f151e] transition-colors">
                <div className="flex items-center gap-2">
                  <MaterialSymbol name="lock" size={20} className="text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Change Password</span>
                </div>
                <MaterialSymbol name="chevron_right" size={20} className="text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2f151e] transition-colors">
                <div className="flex items-center gap-2">
                  <MaterialSymbol name="delete" size={20} className="text-red-500" />
                  <span className="text-sm text-red-500">Delete Account</span>
                </div>
                <MaterialSymbol name="chevron_right" size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        )}

        {/* Preferences Section */}
        {!isEditMode && (
          <div className="bg-white dark:bg-[#342d18] rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Preferences</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Age Range</span>
                <span className="font-medium">
                  {profile.preferences.ageRange.min} - {profile.preferences.ageRange.max} years
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Max Distance</span>
                <span className="font-medium">{profile.preferences.maxDistance} km</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons (Edit Mode) */}
        {isEditMode && (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 h-12 bg-gray-100 dark:bg-[#2f151e] text-slate-700 dark:text-white font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-[#342d18] transition-colors active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 h-12 bg-primary text-[#231d10] font-semibold rounded-xl hover:bg-primary/90 transition-colors active:scale-95"
            >
              Save Changes
            </button>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNavigation items={navigationItems} onItemClick={handleNavigationClick} />
    </div>
  );
};



