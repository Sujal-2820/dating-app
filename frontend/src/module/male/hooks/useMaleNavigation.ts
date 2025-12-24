import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../../core/hooks/useTranslation';

export const useMaleNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    {
      id: 'discover',
      icon: 'explore',
      label: t('discover'),
      isActive: location.pathname === '/male/dashboard' || location.pathname === '/male/discover'
    },
    {
      id: 'chats',
      icon: 'chat_bubble',
      label: t('chats'),
      hasBadge: true,
      isActive: location.pathname.startsWith('/male/chats') || location.pathname.startsWith('/male/chat/')
    },
    {
      id: 'wallet',
      icon: 'monetization_on',
      label: t('wallet'),
      isActive: location.pathname === '/male/wallet' || location.pathname === '/male/buy-coins' || location.pathname === '/male/purchase-history' || location.pathname.startsWith('/male/payment/')
    },
    {
      id: 'profile',
      icon: 'person',
      label: t('profile'),
      isActive: location.pathname === '/male/my-profile' || location.pathname.startsWith('/male/profile/') || location.pathname === '/male/notifications' || location.pathname === '/male/gifts' || location.pathname === '/male/badges'
    },
  ];

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case 'discover':
        navigate('/male/discover');
        break;
      case 'chats':
        navigate('/male/chats');
        break;
      case 'wallet':
        navigate('/male/wallet');
        break;
      case 'profile':
        navigate('/male/my-profile');
        break;
      default:
        break;
    }
  };

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    navigationItems,
    handleNavigationClick,
  };
};

