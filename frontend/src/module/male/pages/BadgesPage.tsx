import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';
import { BottomNavigation } from '../components/BottomNavigation';
import { MaleTopNavbar } from '../components/MaleTopNavbar';
import { MaleSidebar } from '../components/MaleSidebar';
import { useMaleNavigation } from '../hooks/useMaleNavigation';
import type { Badge } from '../types/male.types';


// Mock data - replace with actual API calls
const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'VIP Member',
    icon: 'workspace_premium',
    description: 'Exclusive VIP membership badge',
    category: 'vip',
    isUnlocked: true,
    unlockedAt: '2024-01-15',
    rarity: 'legendary',
  },
  {
    id: '2',
    name: 'First Gift',
    icon: 'redeem',
    description: 'Sent your first gift',
    category: 'achievement',
    isUnlocked: true,
    unlockedAt: '2024-01-20',
    rarity: 'common',
  },
  {
    id: '3',
    name: 'Chat Master',
    icon: 'chat_bubble',
    description: 'Sent 100 messages',
    category: 'achievement',
    isUnlocked: true,
    unlockedAt: '2024-01-25',
    rarity: 'rare',
  },
  {
    id: '4',
    name: 'Diamond Giver',
    icon: 'diamond',
    description: 'Sent 10 diamond gifts',
    category: 'achievement',
    isUnlocked: false,
    rarity: 'epic',
  },
  {
    id: '5',
    name: 'Early Adopter',
    icon: 'star',
    description: 'Joined in the first month',
    category: 'special',
    isUnlocked: true,
    unlockedAt: '2024-01-01',
    rarity: 'rare',
  },
  {
    id: '6',
    name: 'Valentine Special',
    icon: 'favorite',
    description: 'Limited edition Valentine badge',
    category: 'limited',
    isUnlocked: false,
    rarity: 'legendary',
  },
  {
    id: '7',
    name: 'Profile Perfect',
    icon: 'check_circle',
    description: 'Complete your profile 100%',
    category: 'achievement',
    isUnlocked: true,
    unlockedAt: '2024-01-10',
    rarity: 'common',
  },
  {
    id: '8',
    name: 'Match Maker',
    icon: 'favorite',
    description: 'Got 50 matches',
    category: 'achievement',
    isUnlocked: false,
    rarity: 'epic',
  },
];

const rarityColors = {
  common: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
  rare: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600',
  epic: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600',
  legendary: 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-600',
};

const categoryLabels = {
  vip: 'VIP',
  achievement: 'Achievement',
  special: 'Special',
  limited: 'Limited Edition',
};

export const BadgesPage = () => {
  const navigate = useNavigate();
  const { isSidebarOpen, setIsSidebarOpen, navigationItems, handleNavigationClick } = useMaleNavigation();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredBadges = mockBadges.filter((badge) => {
    if (selectedFilter === 'unlocked' && !badge.isUnlocked) return false;
    if (selectedFilter === 'locked' && badge.isUnlocked) return false;
    if (selectedCategory !== 'all' && badge.category !== selectedCategory) return false;
    return true;
  });

  const unlockedCount = mockBadges.filter((b) => b.isUnlocked).length;
  const totalCount = mockBadges.length;

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
            onClick={() => navigate(-1)}
            className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-[#342d18] text-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-[#4b202e] transition-colors active:scale-95"
            aria-label="Go back"
          >
            <MaterialSymbol name="arrow_back" size={24} />
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Badges</h1>
          <div className="size-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Progress Summary */}
      <div className="mx-4 mt-4 p-4 bg-gradient-to-br from-primary/10 via-pink-500/10 to-transparent rounded-xl border border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-900 dark:text-white">Collection Progress</span>
          <span className="text-sm font-bold text-primary">
            {unlockedCount}/{totalCount}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 mt-4 space-y-3">
        {/* Status Filter */}
        <div className="flex gap-2">
          {(['all', 'unlocked', 'locked'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-primary text-slate-900'
                  : 'bg-white dark:bg-[#342d18] text-gray-600 dark:text-gray-400'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'vip', 'achievement', 'special', 'limited'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-slate-900'
                  : 'bg-white dark:bg-[#342d18] text-gray-600 dark:text-gray-400'
              }`}
            >
              {category === 'all' ? 'All' : categoryLabels[category as keyof typeof categoryLabels]}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="p-4">
        {filteredBadges.length === 0 ? (
          <div className="text-center py-12">
            <MaterialSymbol name="workspace_premium" size={64} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No badges found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredBadges.map((badge) => (
              <div
                key={badge.id}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  badge.isUnlocked
                    ? `${rarityColors[badge.rarity || 'common']} shadow-lg`
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-60'
                }`}
              >
                {/* Locked Overlay */}
                {!badge.isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                    <MaterialSymbol name="lock" size={32} className="text-gray-400" />
                  </div>
                )}

                {/* Badge Icon */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`p-4 rounded-full ${
                      badge.isUnlocked
                        ? 'bg-white/50 dark:bg-black/20'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <MaterialSymbol
                      name={badge.icon as any}
                      size={48}
                      className={badge.isUnlocked ? 'text-primary' : 'text-gray-400'}
                    />
                  </div>

                  {/* Badge Info */}
                  <div className="text-center w-full">
                    <h3
                      className={`font-bold text-sm mb-1 ${
                        badge.isUnlocked ? 'text-slate-900 dark:text-white' : 'text-gray-500'
                      }`}
                    >
                      {badge.name}
                    </h3>
                    <p
                      className={`text-xs mb-2 ${
                        badge.isUnlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'
                      }`}
                    >
                      {badge.description}
                    </p>

                    {/* Category & Rarity */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          badge.isUnlocked
                            ? 'bg-white/50 dark:bg-black/20 text-slate-700 dark:text-slate-300'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        }`}
                      >
                        {categoryLabels[badge.category]}
                      </span>
                      {badge.rarity && (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            badge.isUnlocked
                              ? 'bg-white/50 dark:bg-black/20 text-slate-700 dark:text-slate-300'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                          }`}
                        >
                          {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                        </span>
                      )}
                    </div>

                    {/* Unlocked Date */}
                    {badge.isUnlocked && badge.unlockedAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Unlocked: {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavigation items={navigationItems} onItemClick={handleNavigationClick} />
    </div>
  );
};

