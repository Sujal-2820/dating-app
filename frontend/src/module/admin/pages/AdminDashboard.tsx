import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminTopNavbar } from '../components/AdminTopNavbar';
import { AdminSidebar } from '../components/AdminSidebar';
import { useAdminNavigation } from '../hooks/useAdminNavigation';
import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';
import type { AdminDashboardData, ActivityItem } from '../types/admin.types';

// Mock data - replace with actual API calls
const mockDashboardData: AdminDashboardData = {
  stats: {
    totalUsers: { male: 1250, female: 342, total: 1592 },
    activeUsers: { last24h: 456, last7d: 892, last30d: 1245 },
    revenue: { deposits: 125000, payouts: 45000, profit: 80000 },
    pendingWithdrawals: 12,
    totalTransactions: 3456,
  },
  charts: {
    userGrowth: [
      { date: '2024-01-01', count: 1200 },
      { date: '2024-01-08', count: 1350 },
      { date: '2024-01-15', count: 1450 },
      { date: '2024-01-22', count: 1592 },
    ],
    revenueTrends: [
      { date: '2024-01-01', deposits: 25000, payouts: 8000 },
      { date: '2024-01-08', deposits: 32000, payouts: 12000 },
      { date: '2024-01-15', deposits: 38000, payouts: 15000 },
      { date: '2024-01-22', deposits: 30000, payouts: 10000 },
    ],
    activityMetrics: [
      { type: 'Messages', count: 12500 },
      { type: 'Video Calls', count: 340 },
      { type: 'Coin Purchases', count: 890 },
      { type: 'Withdrawals', count: 156 },
    ],
  },
  recentActivity: [
    {
      id: '1',
      type: 'user_registered',
      message: 'New male user registered: John Doe',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      userId: '1',
      userName: 'John Doe',
    },
    {
      id: '2',
      type: 'female_approved',
      message: 'Female user approved: Sarah Smith',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      userId: '2',
      userName: 'Sarah Smith',
    },
    {
      id: '3',
      type: 'withdrawal_approved',
      message: 'Withdrawal approved: ₹2,500 for Emily Johnson',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      userId: '3',
      userName: 'Emily Johnson',
    },
    {
      id: '4',
      type: 'transaction',
      message: 'Large coin purchase: ₹5,000 by Michael Brown',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      userId: '4',
      userName: 'Michael Brown',
    },
  ],
};

export const AdminDashboard = () => {
  const [dashboardData] = useState<AdminDashboardData>(mockDashboardData);
  const navigate = useNavigate();
  const { isSidebarOpen, setIsSidebarOpen, navigationItems, handleNavigationClick } = useAdminNavigation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user_registered':
        return 'person_add';
      case 'female_approved':
        return 'verified_user';
      case 'withdrawal_approved':
        return 'account_balance_wallet';
      case 'transaction':
        return 'monetization_on';
      case 'user_blocked':
        return 'block';
      default:
        return 'info';
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0a0a0a] dark:via-[#1a1a1a] dark:to-[#0a0a0a] overflow-x-hidden">
      {/* Top Navbar */}
      <AdminTopNavbar onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        items={navigationItems}
        onItemClick={handleNavigationClick}
      />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 mt-[57px] lg:ml-80">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Overview</h1>
            <p className="text-gray-600 dark:text-gray-400">Platform statistics and recent activity</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {/* Total Users */}
            <div className="bg-gradient-to-br from-white to-blue-50 dark:from-[#1a1a1a] dark:to-blue-900/10 rounded-2xl p-6 shadow-lg border border-blue-200 dark:border-blue-800/50 hover:shadow-xl transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 dark:bg-blue-900/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                    <MaterialSymbol name="people" className="text-white" size={24} />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</span>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    {dashboardData.stats.totalUsers.total.toLocaleString()}
                  </p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Male: <span className="font-semibold text-gray-900 dark:text-white">{dashboardData.stats.totalUsers.male}</span>
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Female: <span className="font-semibold text-gray-900 dark:text-white">{dashboardData.stats.totalUsers.female}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-gradient-to-br from-white to-green-50 dark:from-[#1a1a1a] dark:to-green-900/10 rounded-2xl p-6 shadow-lg border border-green-200 dark:border-green-800/50 hover:shadow-xl transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 dark:bg-green-900/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                    <MaterialSymbol name="active_account" className="text-white" size={24} />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</span>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    {dashboardData.stats.activeUsers.last24h.toLocaleString()}
                  </p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      7d: <span className="font-semibold text-gray-900 dark:text-white">{dashboardData.stats.activeUsers.last7d}</span>
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      30d: <span className="font-semibold text-gray-900 dark:text-white">{dashboardData.stats.activeUsers.last30d}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-gradient-to-br from-white to-purple-50 dark:from-[#1a1a1a] dark:to-purple-900/10 rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-800/50 hover:shadow-xl transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 dark:bg-purple-900/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                    <MaterialSymbol name="trending_up" className="text-white" size={24} />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</span>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(dashboardData.stats.revenue.deposits)}
                  </p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Payouts: <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(dashboardData.stats.revenue.payouts)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profit */}
            <div className="bg-gradient-to-br from-white to-yellow-50 dark:from-[#1a1a1a] dark:to-yellow-900/10 rounded-2xl p-6 shadow-lg border border-yellow-200 dark:border-yellow-800/50 hover:shadow-xl transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200 dark:bg-yellow-900/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-md">
                    <MaterialSymbol name="account_balance" className="text-white" size={24} />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Platform Profit</span>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(dashboardData.stats.revenue.profit)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Margin: {((dashboardData.stats.revenue.profit / dashboardData.stats.revenue.deposits) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Pending Withdrawals */}
            <div className="bg-gradient-to-br from-white to-orange-50 dark:from-[#1a1a1a] dark:to-orange-900/10 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-orange-800/50 hover:shadow-xl transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 dark:bg-orange-900/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
                    <MaterialSymbol name="pending" className="text-white" size={24} />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Withdrawals</span>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    {dashboardData.stats.pendingWithdrawals}
                  </p>
                  <button
                    onClick={() => navigate('/admin/withdrawals')}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    Review now <MaterialSymbol name="arrow_forward" size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Total Transactions */}
            <div className="bg-gradient-to-br from-white to-indigo-50 dark:from-[#1a1a1a] dark:to-indigo-900/10 rounded-2xl p-6 shadow-lg border border-indigo-200 dark:border-indigo-800/50 hover:shadow-xl transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 dark:bg-indigo-900/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
                    <MaterialSymbol name="receipt_long" className="text-white" size={24} />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</span>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    {dashboardData.stats.totalTransactions.toLocaleString()}
                  </p>
                  <button
                    onClick={() => navigate('/admin/transactions')}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    View all <MaterialSymbol name="arrow_forward" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* User Growth Chart */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MaterialSymbol name="bar_chart" className="text-blue-600 dark:text-blue-400" size={24} />
                User Growth
              </h3>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="text-center">
                  <MaterialSymbol name="bar_chart" className="text-gray-400 dark:text-gray-600 mx-auto mb-2" size={48} />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Chart visualization will be implemented</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                    {dashboardData.charts.userGrowth.length} data points available
                  </p>
                </div>
              </div>
            </div>

            {/* Revenue Trends Chart */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MaterialSymbol name="show_chart" className="text-purple-600 dark:text-purple-400" size={24} />
                Revenue Trends
              </h3>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="text-center">
                  <MaterialSymbol name="show_chart" className="text-gray-400 dark:text-gray-600 mx-auto mb-2" size={48} />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Chart visualization will be implemented</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                    {dashboardData.charts.revenueTrends.length} data points available
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Metrics & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Metrics */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Metrics</h3>
              <div className="space-y-3">
                {dashboardData.charts.activityMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.type}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {metric.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                <button
                  onClick={() => navigate('/admin/audit-logs')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View all →
                </button>
              </div>
              <div className="space-y-3">
                {dashboardData.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <MaterialSymbol
                        name={getActivityIcon(activity.type)}
                        className="text-blue-600 dark:text-blue-400"
                        size={20}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white dark:bg-[#1a1a1a] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/admin/users')}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                <MaterialSymbol name="people" className="text-blue-600 dark:text-blue-400" size={32} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Manage Users</span>
              </button>
              <button
                onClick={() => navigate('/admin/female-approval')}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                <MaterialSymbol name="verified_user" className="text-green-600 dark:text-green-400" size={32} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Approve Females</span>
              </button>
              <button
                onClick={() => navigate('/admin/withdrawals')}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                <MaterialSymbol name="account_balance_wallet" className="text-orange-600 dark:text-orange-400" size={32} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Process Withdrawals</span>
              </button>
              <button
                onClick={() => navigate('/admin/settings')}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                <MaterialSymbol name="settings" className="text-gray-600 dark:text-gray-400" size={32} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

