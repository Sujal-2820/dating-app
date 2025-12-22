// @ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext';
import { BottomNavigation } from '../components/BottomNavigation';
import { MaleTopNavbar } from '../components/MaleTopNavbar';
import { MaleSidebar } from '../components/MaleSidebar';
import { useMaleNavigation } from '../hooks/useMaleNavigation';
import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';
import { GoogleMapsAutocomplete } from '../../../shared/components/GoogleMapsAutocomplete';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

export const MaleProfileEditPage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { isSidebarOpen, setIsSidebarOpen, navigationItems, handleNavigationClick } = useMaleNavigation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [profile, setProfile] = useState(mockProfile);
  const [editedProfile, setEditedProfile] = useState(mockProfile);

  useEffect(() => {
    if (user) {
      const userProfile = {
        ...mockProfile,
        id: user.id || mockProfile.id,
        name: user.name || 'Anonymous',
        age: user.age || 0,
        occupation: user.occupation || '',
        city: user.city || (user.location ? user.location.split(',')[0] : '') || '',
        bio: user.bio || '',
        interests: user.interests || [],
        avatar: user.avatarUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        photos: (user.photos && user.photos.length > 0) ? user.photos : (user.avatarUrl ? [user.avatarUrl] : []),
      };
      setProfile(userProfile);
      setEditedProfile(userProfile);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const payload: any = {
        name: editedProfile.name,
        age: editedProfile.age,
        city: editedProfile.city,
        occupation: editedProfile.occupation,
        bio: editedProfile.bio,
        interests: editedProfile.interests,
        photos: editedProfile.photos,
      };

      // Add coordinates if available
      if (editedProfile.latitude && editedProfile.longitude) {
        payload.latitude = editedProfile.latitude;
        payload.longitude = editedProfile.longitude;
      }

      await axios.patch(`${API_URL}/users/me`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('matchmint_auth_token')}` }
      });

      updateUser({
        name: editedProfile.name,
        age: editedProfile.age,
        city: editedProfile.city,
        location: editedProfile.city,
        occupation: editedProfile.occupation,
        bio: editedProfile.bio,
        interests: editedProfile.interests,
        photos: editedProfile.photos,
        avatarUrl: (editedProfile.photos && editedProfile.photos.length > 0) ? editedProfile.photos[0] : ''
      });

      navigate('/male/my-profile');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    }
  };

  const handleCancel = () => {
    navigate('/male/my-profile');
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

      {/* Profile Content */}
      <main className="p-4 space-y-6">
        {/* Profile Photo */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={editedProfile.avatar}
              alt={editedProfile.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-primary"
            />
            <label className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white cursor-pointer hover:bg-primary/90 transition-colors active:scale-95">
              <MaterialSymbol name="camera_alt" size={20} />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white dark:bg-[#342d18] rounded-2xl p-4 shadow-sm space-y-4">
          {/* Name and Age */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Name
            </label>
            <input
              type="text"
              value={editedProfile.name}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, name: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2f151e] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Age
            </label>
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
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Occupation
            </label>
            <input
              type="text"
              value={editedProfile.occupation || ''}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, occupation: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2f151e] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your occupation"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              City
            </label>
            <GoogleMapsAutocomplete
              value={editedProfile.city || ''}
              onChange={(value, coords) => {
                const updates = { ...editedProfile, city: value };
                if (coords) {
                  updates.latitude = coords.lat;
                  updates.longitude = coords.lng;
                }
                setEditedProfile(updates);
              }}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2f151e] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your city"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Bio
            </label>
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
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Interests (Max 10)
            </label>
            <div className="flex flex-wrap gap-2">
              {(editedProfile.interests || []).map((interest, index) => (
                <div key={index} className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-[#2f151e] border border-gray-200 dark:border-gray-700 rounded-full">
                  <input
                    type="text"
                    value={interest}
                    onChange={(e) => {
                      const newInterests = [...(editedProfile.interests || [])];
                      newInterests[index] = e.target.value;
                      setEditedProfile({ ...editedProfile, interests: newInterests });
                    }}
                    className="bg-transparent border-none outline-none text-sm w-24 text-slate-900 dark:text-white placeholder-gray-400"
                    placeholder="Interest"
                    autoFocus={interest === ''}
                  />
                  <button
                    onClick={() => {
                      const newInterests = (editedProfile.interests || []).filter((_, i) => i !== index);
                      setEditedProfile({ ...editedProfile, interests: newInterests });
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors flex items-center"
                  >
                    <MaterialSymbol name="close" size={16} />
                  </button>
                </div>
              ))}
              {(editedProfile.interests || []).length < 10 && (
                <button
                  onClick={() => {
                    setEditedProfile({ ...editedProfile, interests: [...(editedProfile.interests || []), ''] });
                  }}
                  className="px-3 py-1 border border-dashed border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-500 hover:text-primary hover:border-primary transition-colors flex items-center gap-1"
                >
                  <MaterialSymbol name="add" size={16} />
                  Add
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Photo Gallery (Edit Mode) */}
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

        {/* Action Buttons */}
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
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNavigation items={navigationItems} onItemClick={handleNavigationClick} />
    </div>
  );
};
