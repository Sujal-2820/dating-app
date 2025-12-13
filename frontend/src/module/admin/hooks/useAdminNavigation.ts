import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  icon: string;
  label: string;
  isActive?: boolean;
  hasBadge?: boolean;
  badgeCount?: number;
}

export const useAdminNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // On desktop (lg+), sidebar should always be open
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationItems: NavItem[] = useMemo(() => [
    {
      id: 'dashboard',
      icon: 'dashboard',
      label: 'Dashboard',
      isActive: location.pathname === '/admin/dashboard',
    },
    {
      id: 'users',
      icon: 'people',
      label: 'Users',
      isActive: location.pathname.startsWith('/admin/users'),
    },
    {
      id: 'female-approval',
      icon: 'verified_user',
      label: 'Female Approval',
      hasBadge: true,
      badgeCount: 5, // Mock pending count
      isActive: location.pathname.startsWith('/admin/female-approval'),
    },
    {
      id: 'coin-economy',
      icon: 'monetization_on',
      label: 'Coin Economy',
      isActive: location.pathname.startsWith('/admin/coin-economy'),
    },
    {
      id: 'withdrawals',
      icon: 'account_balance_wallet',
      label: 'Withdrawals',
      hasBadge: true,
      badgeCount: 12, // Mock pending count
      isActive: location.pathname.startsWith('/admin/withdrawals'),
    },
    {
      id: 'transactions',
      icon: 'receipt_long',
      label: 'Transactions',
      isActive: location.pathname.startsWith('/admin/transactions'),
    },
    {
      id: 'settings',
      icon: 'settings',
      label: 'Settings',
      isActive: location.pathname.startsWith('/admin/settings'),
    },
    {
      id: 'audit-logs',
      icon: 'history',
      label: 'Audit Logs',
      isActive: location.pathname.startsWith('/admin/audit-logs'),
    },
  ], [location.pathname]);

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case 'dashboard':
        navigate('/admin/dashboard');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      case 'female-approval':
        navigate('/admin/female-approval');
        break;
      case 'coin-economy':
        navigate('/admin/coin-economy');
        break;
      case 'withdrawals':
        navigate('/admin/withdrawals');
        break;
      case 'transactions':
        navigate('/admin/transactions');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      case 'audit-logs':
        navigate('/admin/audit-logs');
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

