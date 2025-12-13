import { useState, useMemo, useEffect } from 'react';
import { AdminTopNavbar } from '../components/AdminTopNavbar';
import { AdminSidebar } from '../components/AdminSidebar';
import { ApprovalCard } from '../components/ApprovalCard';
import { useAdminNavigation } from '../hooks/useAdminNavigation';
import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';
import type { FemaleApproval } from '../types/admin.types';

// Mock data - replace with actual API calls
const mockPendingApprovals: FemaleApproval[] = [
  {
    userId: '1',
    user: {
      id: '1',
      email: 'sarah.smith@example.com',
      name: 'Sarah Smith',
      role: 'female',
      isBlocked: false,
      isVerified: false,
      createdAt: '2024-01-20T10:00:00Z',
      lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
    },
    profile: {
      age: 25,
      city: 'Mumbai',
      bio: 'Love traveling, photography, and meeting new people. Looking for meaningful connections!',
      photos: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC81hkr7IkYx1ryaWF6XEKAw50xyRvJBGMogrF-zD5ChG66QAopPNWZvczWXWXasmarotX6xfLiXqIGT-HGa4N4mpnfl6tHPN16fBm5L0ebBFFR6YnfhOhNpt_PXB-rNdw4iozv00ERuqlCKno-B1P2UZ6g-dU5YY4Or_m3Xdgk4_MrxVK9o6Uz70Vr_fXQdMhSrjjCl7s_yQE_R1O9FNwroQqdfSFv6kiO76qVxmnHDhLrYwRWtfdSdegsNjAzgAdgkUZgUomw2j8',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD_3D5tki5d2RSAJuSJ_Ow31htoQH_FV5cZMGWqi6Cr5CMDqjOebH645goD9BnAUabnDZTNirhvkDX6-eITfd1EzLFFNW_KcLdBa2aFXo2ydswriuWM4hVqwZ3FlbtKuKsNiL3AX4zC9kUMmRRH86XSg0TINNfB5SCw-BMXWwyr26rp1VW5KtSllNAOXUT7NSpen7_J_iBbqFkoLhUROpUPQJHgyhZT657eYWmFgMTm93IK8-tM1KQMXUjXcFcJYAkSXUPry1QbEfo',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBMwDNlS8xIMG2GPDOruau0I96EJW8UAfXypa6c3-bkakWGNwuNHv4bT_JxAS2tQQbwxDbRjkJCejmcZYfsqqtKJ-7OeHLwq5E9n5xOPyVwVLwv6bLTSaWBddBnCfSb85sZZW5ciF9ASv_TmzTFU3HcRlJPBSmBmvslJ_3dhEuuYLb5gfEYKw8ahTEUs9Nr49VBtnu-s1Y--7W9Kv1e7XebTvnXhrZ42e1cYEMDxGbgmAHw0fTnNAuBciEyspzTK1qCjMHkoxWkXPw',
      ],
      location: { lat: 19.0760, lng: 72.8777 },
    },
    approvalStatus: 'pending',
    submittedAt: '2024-01-20T10:00:00Z',
  },
  {
    userId: '2',
    user: {
      id: '2',
      email: 'emily.johnson@example.com',
      name: 'Emily Johnson',
      role: 'female',
      isBlocked: false,
      isVerified: false,
      createdAt: '2024-01-21T14:30:00Z',
      lastLoginAt: new Date(Date.now() - 7200000).toISOString(),
    },
    profile: {
      age: 23,
      city: 'Delhi',
      bio: 'Fitness enthusiast and food lover. Always up for adventures!',
      photos: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAIEnsXe0RpUu5LWRCfLi_lS-2wr9joEcf15WUPbFUamLpw44YrY6ci9n8jlL35RqX477FvduXCyJHoR4vMnQ9TazzyN4HxCns6xvssFGXnnj8AHJQ5WtID3GmVrTmJiIePWYlkI4Ahz944gcuOSaENv86pMF568tb1UYu1CYKCMkUhXOOsLd5mNg3EwYWl0x8i5xQoek5Ky4dnKVyB4UEPgmRoTzc_K8nhgnwI0tLLwJZqq9mNRcMWOvLl_sP4mjWRku5taLuKGJ0',
      ],
      location: { lat: 28.6139, lng: 77.2090 },
    },
    approvalStatus: 'pending',
    submittedAt: '2024-01-21T14:30:00Z',
  },
  {
    userId: '3',
    user: {
      id: '3',
      email: 'jessica.martinez@example.com',
      name: 'Jessica Martinez',
      role: 'female',
      isBlocked: false,
      isVerified: false,
      createdAt: '2024-01-22T09:15:00Z',
      lastLoginAt: new Date(Date.now() - 1800000).toISOString(),
    },
    profile: {
      age: 27,
      city: 'Bangalore',
      bio: 'Yoga instructor and wellness coach. Passionate about holistic health.',
      photos: [],
      location: { lat: 12.9716, lng: 77.5946 },
    },
    approvalStatus: 'pending',
    submittedAt: '2024-01-22T09:15:00Z',
  },
];

export const FemaleApprovalPage = () => {
  const [approvals, setApprovals] = useState<FemaleApproval[]>(mockPendingApprovals);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedApprovals, setSelectedApprovals] = useState<Set<string>>(new Set());
  const { isSidebarOpen, setIsSidebarOpen, navigationItems, handleNavigationClick } = useAdminNavigation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredApprovals = useMemo(() => {
    return approvals.filter((approval) => approval.approvalStatus === filter);
  }, [approvals, filter]);

  const handleApprove = (userId: string) => {
    setApprovals((prev) =>
      prev.map((approval) =>
        approval.userId === userId
          ? { ...approval, approvalStatus: 'approved' as const, reviewedBy: 'Admin' }
          : approval
      )
    );
    // TODO: API call to approve female
    console.log(`Female user ${userId} approved`);
  };

  const handleReject = (userId: string, reason: string) => {
    setApprovals((prev) =>
      prev.map((approval) =>
        approval.userId === userId
          ? {
              ...approval,
              approvalStatus: 'rejected' as const,
              reviewedBy: 'Admin',
              reviewNotes: reason,
            }
          : approval
      )
    );
    // TODO: API call to reject female
    console.log(`Female user ${userId} rejected: ${reason}`);
  };

  const handleRequestInfo = (userId: string) => {
    // TODO: Send notification to user requesting more information
    console.log(`Requesting more info from user ${userId}`);
  };

  const handleBulkApprove = () => {
    selectedApprovals.forEach((userId) => {
      handleApprove(userId);
    });
    setSelectedApprovals(new Set());
    setShowBulkActions(false);
  };

  const toggleSelection = (userId: string) => {
    setSelectedApprovals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Female Approval</h1>
              <p className="text-gray-600 dark:text-gray-400">Review and approve female user registrations</p>
            </div>
            {filter === 'pending' && filteredApprovals.length > 0 && (
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <MaterialSymbol name="checklist" size={20} />
                Bulk Actions
              </button>
            )}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                    {approvals.filter((a) => a.approvalStatus === 'pending').length}
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
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    {approvals.filter((a) => a.approvalStatus === 'approved').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <MaterialSymbol name="check_circle" className="text-green-600 dark:text-green-400" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                    {approvals.filter((a) => a.approvalStatus === 'rejected').length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <MaterialSymbol name="cancel" className="text-red-600 dark:text-red-400" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Pending ({approvals.filter((a) => a.approvalStatus === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Approved ({approvals.filter((a) => a.approvalStatus === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Rejected ({approvals.filter((a) => a.approvalStatus === 'rejected').length})
            </button>
          </div>

          {/* Bulk Actions Bar */}
          {showBulkActions && selectedApprovals.size > 0 && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center justify-between">
              <span className="text-blue-900 dark:text-blue-300 font-medium">
                {selectedApprovals.size} selected
              </span>
              <button
                onClick={handleBulkApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <MaterialSymbol name="check_circle" size={20} className="inline mr-1" />
                Approve Selected
              </button>
            </div>
          )}

          {/* Approval Cards */}
          {filteredApprovals.length === 0 ? (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
              <MaterialSymbol name="verified_user" className="text-gray-400 dark:text-gray-600 mx-auto mb-4" size={64} />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No {filter} approvals
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filter === 'pending'
                  ? 'All pending approvals have been processed'
                  : `No ${filter} applications found`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApprovals.map((approval) => (
                <div key={approval.userId} className="relative">
                  {showBulkActions && filter === 'pending' && (
                    <div className="absolute top-4 left-4 z-10">
                      <input
                        type="checkbox"
                        checked={selectedApprovals.has(approval.userId)}
                        onChange={() => toggleSelection(approval.userId)}
                        className="size-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  <ApprovalCard
                    approval={approval}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onRequestInfo={handleRequestInfo}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

