import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext';
import { DiscoverNearbyCard } from '../components/DiscoverNearbyCard';
import { ActiveChatsList } from '../components/ActiveChatsList';
import { BottomNavigation } from '../components/BottomNavigation';
import { MaleTopNavbar } from '../components/MaleTopNavbar';
import { MaleSidebar } from '../components/MaleSidebar';
import { useMaleNavigation } from '../hooks/useMaleNavigation';
import { LocationPromptModal } from '../../../shared/components/LocationPromptModal';
import userService from '../../../core/services/user.service';
import chatService from '../../../core/services/chat.service';

interface MaleDashboardData {
  nearbyUsers: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  activeChats: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    lastMessage: string;
    timestamp: string;
    isOnline: boolean;
    hasUnread: boolean;
  }>;
}

export const MaleDashboard = () => {
  const [dashboardData, setDashboardData] = useState<MaleDashboardData>({
    nearbyUsers: [],
    activeChats: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { isSidebarOpen, setIsSidebarOpen, navigationItems, handleNavigationClick } = useMaleNavigation();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Fetch nearby users and chats in parallel
      const [nearbyResponse, chatsResponse] = await Promise.all([
        userService.discoverFemales('all', 1, 10),
        chatService.getMyChatList()
      ]);

      setDashboardData({
        nearbyUsers: nearbyResponse.profiles?.map((p: any) => ({
          id: p.id,
          name: p.name || 'User',
          avatar: p.avatar || ''
        })) || [],
        activeChats: chatsResponse?.map((c: any) => ({
          id: c._id,
          userId: c.otherUser?._id,
          userName: c.otherUser?.name || 'User',
          userAvatar: c.otherUser?.avatar || '',
          lastMessage: c.lastMessage?.content || 'Say hi!',
          timestamp: c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          isOnline: c.otherUser?.isOnline || false,
          hasUnread: c.unreadCount > 0
        })) || []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user needs to set location
  useEffect(() => {
    if (user && (!user.location || user.location.trim() === '')) {
      setShowLocationPrompt(true);
    }
  }, [user]);

  const handleChatClick = (chatId: string) => {
    navigate(`/male/chat/${chatId}`);
  };

  const handleSeeAllChatsClick = () => {
    navigate('/male/chats');
  };

  const handleExploreClick = () => {
    navigate('/male/discover');
  };

  const handleLocationSave = (location: string) => {
    if (updateUser) {
      updateUser({ location });
    }
    setShowLocationPrompt(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-gradient-to-br from-pink-50 via-rose-50/30 to-white dark:from-[#1a0f14] dark:via-[#2d1a24] dark:to-[#0a0a0a] overflow-x-hidden pb-24">
      {/* Location Prompt Modal */}
      {showLocationPrompt && (
        <LocationPromptModal
          onSave={handleLocationSave}
          onClose={() => setShowLocationPrompt(false)}
        />
      )}
      {/* Top Navbar */}
      <MaleTopNavbar onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Sidebar */}
      <MaleSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        items={navigationItems}
        onItemClick={handleNavigationClick}
      />

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

