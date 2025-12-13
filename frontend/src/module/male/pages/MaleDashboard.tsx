import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileHeader } from '../components/ProfileHeader';
import { WalletBalance } from '../components/WalletBalance';
import { StatsGrid } from '../components/StatsGrid';
import { DiscoverNearbyCard } from '../components/DiscoverNearbyCard';
import { ActiveChatsList } from '../components/ActiveChatsList';
import { BottomNavigation } from '../components/BottomNavigation';
import { MaleTopNavbar } from '../components/MaleTopNavbar';
import { MaleSidebar } from '../components/MaleSidebar';
import { QuickActionsGrid } from '../components/QuickActionsGrid';
import { BadgeDisplay } from '../../../shared/components/BadgeDisplay';
import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';
import { useMaleNavigation } from '../hooks/useMaleNavigation';
import type { MaleDashboardData, Badge } from '../types/male.types';

// Mock badges data
const mockUserBadges: Badge[] = [
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
    id: '7',
    name: 'Profile Perfect',
    icon: 'check_circle',
    description: 'Complete your profile 100%',
    category: 'achievement',
    isUnlocked: true,
    unlockedAt: '2024-01-10',
    rarity: 'common',
  },
];

// Mock data - replace with actual API calls
const mockDashboardData: MaleDashboardData = {
  user: {
    id: '1',
    name: 'Alex',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD50-ii2k9PzO4qeyW-OGHjX-2FkC-nA5ibp8nilOmxqIs-w6h7s0urlDqev0gVBZWdyFA_3jZ4auAmlsmmGZJtFVeTHiGW7cqwg60iSjQAedJk4JqEbDkQMBYmK31cVtDFsUHahf8u_-Do3G7K2GnansIQaBcgPSJLc7jSTEJr1GNKy9Kpkbb0A-qm4L0Ul1Bd5sSiBcUw8P2BA8K3VMWLs47qnJbJahDqGtp9UA5PPVTWdJ5atRHa8i9VBLDRrbIoeoOw1THR6BI',
    isPremium: true,
    isOnline: true,
    badges: mockUserBadges,
  },
  wallet: {
    balance: 1250,
  },
  stats: {
    matches: 12,
    sent: 85,
    views: 204,
  },
  nearbyUsers: [
    {
      id: '1',
      name: 'Sarah',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC81hkr7IkYx1ryaWF6XEKAw50xyRvJBGMogrF-zD5ChG66QAopPNWZvczWXWXasmarotX6xfLiXqIGT-HGa4N4mpnfl6tHPN16fBm5L0ebBFFR6YnfhOhNpt_PXB-rNdw4iozv00ERuqlCKno-B1P2UZ6g-dU5YY4Or_m3Xdgk4_MrxVK9o6Uz70Vr_fXQdMhSrjjCl7s_yQE_R1O9FNwroQqdfSFv6kiO76qVxmnHDhLrYwRWtfdSdegsNjAzgAdgkUZgUomw2j8',
    },
    {
      id: '2',
      name: 'Jessica',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_3D5tki5d2RSAJuSJ_Ow31htoQH_FV5cZMGWqi6Cr5CMDqjOebH645goD9BnAUabnDZTNirhvkDX6-eITfd1EzLFFNW_KcLdBa2aFXo2ydswriuWM4hVqwZ3FlbtKuKsNiL3AX4zC9kUMmRRH86XSg0TINNfB5SCw-BMXWwyr26rp1VW5KtSllNAOXUT7NSpen7_J_iBbqFkoLhUROpUPQJHgyhZT657eYWmFgMTm93IK8-tM1KQMXUjXcFcJYAkSXUPry1QbEfo',
    },
  ],
  activeChats: [
    {
      id: '1',
      userId: '1',
      userName: 'Sarah',
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSkFD2tzaMZiHcQ1Hm3BtJ1_UpqjoqUR_BFf2E0V7D_ppQlSWvIdDEfEBe0SPJZdTD5rtlREZvDwgJ9oL4aHTkwpfMeYycsunZlMQ_hknAY1ZNesaJ-vRkHWzRyTiCx9lwzN1_n0QMMdv8bJzzctJXhhx0ei-uw00ofyW01_9eOdINFUaXIx4mo09JX_t7wPq80h8xmmPpj8QWY0zqV8iHhF5YC9ZY4CegBhblLxKJvbgRxSmo6-8DYXdFCZcgVX16sSrpCGqceHA',
      lastMessage: 'See you at the coffee shop! ☕️',
      timestamp: '10:30 AM',
      isOnline: true,
      hasUnread: true,
    },
    {
      id: '2',
      userId: '2',
      userName: 'Jessica',
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA0MFV18-2tNUL3hajagAclv-DEWceOAML73Z_hH5inSVR0AGAPtavYAfoV2rZS9WqRuv40Z2vt2DPWkJBDLJAKY6T3WrkdjwAFUwJsNr5gSekJ8dsvfX_5zvsldd7IdBCpJshws7td-x6g0CdSXzOEDEE6XKq7yyiOVmaoNmccJ9SLQqsiPNrVgoZCHAXcfsiTgoH6e4GuJxD0CqeLjQY1DVMkNxsOb8HgptbHRrdACXZO0K0SdYiL7_oKSLB8mWfsqhgus_H2MI',
      lastMessage: 'That sounds like a great plan.',
      timestamp: 'Yesterday',
      isOnline: false,
      hasUnread: false,
    },
    {
      id: '3',
      userId: '3',
      userName: 'Emily',
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIEnsXe0RpUu5LWRCfLi_lS-2wr9joEcf15WUPbFUamLpw44YrY6ci9n8jlL35RqX477FvduXCyJHoR4vMnQ9TazzyN4HxCns6xvssFGXnnj8AHJQ5WtID3GmVrTmJiIePWYlkI4Ahz944gcuOSaENv86pMF568tb1UYu1CYKCMkUhXOOsLd5mNg3EwYWl0x8i5xQoek5Ky4dnKVyB4UEPgmRoTzc_K8nhgnwI0tLLwJZqq9mNRcMWOvLl_sP4mjWRku5taLuKGJ0',
      lastMessage: 'Did you see the new movie?',
      timestamp: 'Tue',
      isOnline: false,
      hasUnread: false,
    },
  ],
};

export const MaleDashboard = () => {
  const [dashboardData] = useState<MaleDashboardData>(mockDashboardData);
  const navigate = useNavigate();
  const { isSidebarOpen, setIsSidebarOpen, navigationItems, handleNavigationClick } = useMaleNavigation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNotificationClick = () => {
    navigate('/male/notifications');
  };

  const handleTopUpClick = () => {
    navigate('/male/buy-coins');
  };

  const handleQuickActionClick = (actionId: string) => {
    switch (actionId) {
      case 'buy-coins':
        navigate('/male/buy-coins');
        break;
      case 'vip':
        // TODO: Navigate to VIP membership page
        console.log('VIP membership');
        break;
      case 'send-gift':
        navigate('/male/gifts');
        break;
      default:
        break;
    }
  };

  const handleExploreClick = () => {
    navigate('/male/discover');
  };

  const handleChatClick = (chatId: string) => {
    navigate(`/male/chat/${chatId}`);
  };

  const handleSeeAllChatsClick = () => {
    navigate('/male/chats');
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-gradient-to-br from-pink-50 via-rose-50/30 to-white dark:from-[#1a0f14] dark:via-[#2d1a24] dark:to-[#0a0a0a] overflow-x-hidden pb-24">
      {/* Top Navbar */}
      <MaleTopNavbar onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Sidebar */}
      <MaleSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        items={navigationItems}
        onItemClick={handleNavigationClick}
      />

      {/* Profile Header Section */}
      <div className="flex p-4 pt-4 @container">
        <div className="flex w-full flex-col gap-4">
          <ProfileHeader
            user={dashboardData.user}
            onNotificationClick={handleNotificationClick}
          />
          {/* Wallet & Top Up Block */}
          <WalletBalance
            balance={dashboardData.wallet.balance}
            onTopUpClick={handleTopUpClick}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={dashboardData.stats} />

      {/* Badges Section */}
      {dashboardData.user.badges && dashboardData.user.badges.length > 0 && (
        <div className="px-4 mb-4">
          <div className="bg-gradient-to-br from-white via-pink-50/50 to-rose-50/30 dark:from-[#2d1a24] dark:via-[#3d2530] dark:to-[#2d1a24] rounded-2xl p-5 shadow-lg border border-pink-200/50 dark:border-pink-900/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/20 dark:bg-pink-900/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-md">
                    <MaterialSymbol name="workspace_premium" className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">My Badges</h3>
                </div>
                <button
                  onClick={() => navigate('/male/badges')}
                  className="text-sm font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
                >
                  View All
                </button>
              </div>
              <BadgeDisplay 
                badges={dashboardData.user.badges} 
                maxDisplay={6}
                showUnlockedOnly={true}
                compact={true}
                onBadgeClick={() => navigate('/male/badges')}
              />
              <div className="mt-4 pt-4 border-t border-pink-200/50 dark:border-pink-900/30">
                <p className="text-xs text-pink-600/70 dark:text-pink-400/70 text-center font-medium">
                  {dashboardData.user.badges.filter(b => b.isUnlocked).length} unlocked • {dashboardData.user.badges.length} total
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="px-4 mb-4">
        <QuickActionsGrid
          actions={[
            {
              id: 'buy-coins',
              icon: 'monetization_on',
              label: 'Buy Coins',
              iconColor: 'text-primary',
              iconBgColor: 'bg-primary/10',
            },
            {
              id: 'vip',
              icon: 'card_membership',
              label: 'VIP Membership',
              iconColor: 'text-purple-500',
              iconBgColor: 'bg-purple-500/10',
            },
            {
              id: 'send-gift',
              icon: 'redeem',
              label: 'Send Gift',
              iconColor: 'text-pink-500',
              iconBgColor: 'bg-pink-500/10',
            },
          ]}
          onActionClick={handleQuickActionClick}
        />
      </div>

      {/* Discover Nearby Card */}
      <DiscoverNearbyCard
        nearbyUsers={dashboardData.nearbyUsers}
        onExploreClick={handleExploreClick}
      />

      {/* Active Chats List */}
      <ActiveChatsList
        chats={dashboardData.activeChats}
        onChatClick={handleChatClick}
        onSeeAllClick={handleSeeAllChatsClick}
      />

      {/* Bottom Navigation Bar */}
      <BottomNavigation
        items={navigationItems}
        onItemClick={handleNavigationClick}
      />
    </div>
  );
};

