import { useState, useMemo, useEffect } from 'react';
import { AdminTopNavbar } from '../components/AdminTopNavbar';
import { AdminSidebar } from '../components/AdminSidebar';
import { WithdrawalRequestCard } from '../components/WithdrawalRequestCard';
import { useAdminNavigation } from '../hooks/useAdminNavigation';
import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';
import type { WithdrawalRequest } from '../types/admin.types';

// Mock data - replace with actual API calls
const mockWithdrawals: WithdrawalRequest[] = [
  {
    id: 'wd-1',
    userId: '1',
    userName: 'Sarah Smith',
    coinsRequested: 1000,
    payoutMethod: 'UPI',
    payoutDetails: {
      upiId: 'sarah.smith@paytm',
    },
    status: 'pending',
    payoutAmountINR: 500,
    payoutPercentage: 50,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'wd-2',
    userId: '2',
    userName: 'Emily Johnson',
    coinsRequested: 2000,
    payoutMethod: 'bank',
    payoutDetails: {
      accountNumber: '1234567890',
      ifscCode: 'HDFC0001234',
      accountHolderName: 'Emily Johnson',
    },
    status: 'pending',
    payoutAmountINR: 1000,
    payoutPercentage: 50,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'wd-3',
    userId: '3',
    userName: 'Jessica Martinez',
    coinsRequested: 1500,
    payoutMethod: 'UPI',
    payoutDetails: {
      upiId: 'jessica@phonepe',
    },
    status: 'approved',
    payoutAmountINR: 750,
    payoutPercentage: 50,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    reviewedBy: 'Admin',
  },
  {
    id: 'wd-4',
    userId: '4',
    userName: 'Olivia Brown',
    coinsRequested: 500,
    payoutMethod: 'bank',
    payoutDetails: {
      accountNumber: '9876543210',
      ifscCode: 'ICIC0005678',
      accountHolderName: 'Olivia Brown',
    },
    status: 'rejected',
    payoutAmountINR: 250,
    payoutPercentage: 50,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    reviewedBy: 'Admin',
    reviewNotes: 'Insufficient verification documents',
  },
  {
    id: 'wd-5',
    userId: '5',
    userName: 'Sophia Davis',
    coinsRequested: 3000,
    payoutMethod: 'UPI',
    payoutDetails: {
      upiId: 'sophia@googlepay',
    },
    status: 'paid',
    payoutAmountINR: 1500,
    payoutPercentage: 50,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    reviewedBy: 'Admin',
    paidAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const WithdrawalManagementPage = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(mockWithdrawals);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'paid'>('all');
  const [payoutMethodFilter, setPayoutMethodFilter] = useState<'all' | 'UPI' | 'bank'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { isSidebarOpen, setIsSidebarOpen, navigationItems, handleNavigationClick } = useAdminNavigation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((withdrawal) => {
      // Status filter
      const matchesStatus = statusFilter === 'all' || withdrawal.status === statusFilter;

      // Payout method filter
      const matchesMethod = payoutMethodFilter === 'all' || withdrawal.payoutMethod === payoutMethodFilter;

      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        withdrawal.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        withdrawal.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesMethod && matchesSearch;
    });
  }, [withdrawals, statusFilter, payoutMethodFilter, searchQuery]);

  const handleApprove = (requestId: string) => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === requestId
          ? { ...w, status: 'approved' as const, reviewedBy: 'Admin' }
          : w
      )
    );
    // TODO: API call to approve withdrawal
    console.log(`Withdrawal ${requestId} approved`);
  };

  const handleReject = (requestId: string, reason: string) => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === requestId
          ? { ...w, status: 'rejected' as const, reviewedBy: 'Admin', reviewNotes: reason }
          : w
      )
    );
    // TODO: API call to reject withdrawal
    console.log(`Withdrawal ${requestId} rejected: ${reason}`);
  };

  const handleMarkPaid = (requestId: string) => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === requestId
          ? { ...w, status: 'paid' as const, paidAt: new Date().toISOString() }
          : w
      )
    );
    // TODO: API call to mark as paid
    console.log(`Withdrawal ${requestId} marked as paid`);
  };

  const handleRequestInfo = (requestId: string) => {
    // TODO: Send notification to user requesting more information
    console.log(`Requesting more info for withdrawal ${requestId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalPending = withdrawals.filter((w) => w.status === 'pending').reduce((sum, w) => sum + w.payoutAmountINR, 0);
  const totalApproved = withdrawals.filter((w) => w.status === 'approved').reduce((sum, w) => sum + w.payoutAmountINR, 0);
  const totalPaid = withdrawals.filter((w) => w.status === 'paid').reduce((sum, w) => sum + w.payoutAmountINR, 0);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-gray-50 dark:bg-[#0a0a0a] overflow-x-hidden">
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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Withdrawal Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Review and process withdrawal requests</p>
            </div>
            <button
              onClick={() => {
                // TODO: Implement export functionality
                console.log('Exporting withdrawal data...');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <MaterialSymbol name="download" size={20} />
              Export Reports
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                    {formatCurrency(totalPending)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {withdrawals.filter((w) => w.status === 'pending').length} requests
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <MaterialSymbol name="pending" className="text-orange-600 dark:text-orange-400" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {formatCurrency(totalApproved)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {withdrawals.filter((w) => w.status === 'approved').length} requests
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <MaterialSymbol name="check_circle" className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Paid</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    {formatCurrency(totalPaid)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {withdrawals.filter((w) => w.status === 'paid').length} requests
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <MaterialSymbol name="payments" className="text-green-600 dark:text-green-400" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {withdrawals.length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {withdrawals.filter((w) => w.status === 'rejected').length} rejected
                  </p>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <MaterialSymbol name="receipt_long" className="text-gray-600 dark:text-gray-400" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <MaterialSymbol
                    name="search"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by user name or request ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setPayoutMethodFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  payoutMethodFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All Methods
              </button>
              <button
                onClick={() => setPayoutMethodFilter('UPI')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  payoutMethodFilter === 'UPI'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                UPI Only
              </button>
              <button
                onClick={() => setPayoutMethodFilter('bank')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  payoutMethodFilter === 'bank'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Bank Transfer Only
              </button>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredWithdrawals.length}</span> of{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{withdrawals.length}</span> requests
            </div>
          </div>

          {/* Withdrawal Cards */}
          {filteredWithdrawals.length === 0 ? (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
              <MaterialSymbol name="account_balance_wallet" className="text-gray-400 dark:text-gray-600 mx-auto mb-4" size={64} />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">No withdrawal requests found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchQuery || statusFilter !== 'all' || payoutMethodFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No withdrawal requests at this time'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredWithdrawals.map((request) => (
                <WithdrawalRequestCard
                  key={request.id}
                  request={request}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onMarkPaid={handleMarkPaid}
                  onRequestInfo={handleRequestInfo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

