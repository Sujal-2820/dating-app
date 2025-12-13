import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';
import type { WithdrawalRequest } from '../types/admin.types';

interface WithdrawalRequestCardProps {
  request: WithdrawalRequest;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string, reason: string) => void;
  onMarkPaid?: (requestId: string) => void;
  onRequestInfo?: (requestId: string) => void;
}

export const WithdrawalRequestCard = ({
  request,
  onApprove,
  onReject,
  onMarkPaid,
  onRequestInfo,
}: WithdrawalRequestCardProps) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'approved':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'paid':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };


  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{request.userName}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Request ID: {request.id}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Requested: {formatDate(request.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(request.payoutAmountINR)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {request.coinsRequested.toLocaleString()} coins ({request.payoutPercentage}%)
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MaterialSymbol
              name={request.payoutMethod === 'UPI' ? 'account_balance_wallet' : 'account_balance'}
              className="text-gray-400"
              size={20}
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {request.payoutMethod === 'UPI' ? 'UPI' : 'Bank Transfer'}
            </span>
          </div>
          {request.payoutMethod === 'UPI' && request.payoutDetails.upiId && (
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-7">
              UPI ID: <span className="font-mono">{request.payoutDetails.upiId}</span>
            </p>
          )}
          {request.payoutMethod === 'bank' && (
            <div className="ml-7 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {request.payoutDetails.accountHolderName && (
                <p>Account: <span className="font-medium text-gray-900 dark:text-white">{request.payoutDetails.accountHolderName}</span></p>
              )}
              {request.payoutDetails.accountNumber && (
                <p className="font-mono">A/C: {request.payoutDetails.accountNumber}</p>
              )}
              {request.payoutDetails.ifscCode && (
                <p className="font-mono">IFSC: {request.payoutDetails.ifscCode}</p>
              )}
            </div>
          )}
        </div>

        {/* Review Notes (if rejected) */}
        {request.status === 'rejected' && request.reviewNotes && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm font-medium text-red-900 dark:text-red-300 mb-1">Rejection Reason:</p>
            <p className="text-sm text-red-800 dark:text-red-400">{request.reviewNotes}</p>
          </div>
        )}

        {/* Paid Info (if paid) */}
        {request.status === 'paid' && request.paidAt && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm font-medium text-green-900 dark:text-green-300 mb-1">Paid On:</p>
            <p className="text-sm text-green-800 dark:text-green-400">{formatDate(request.paidAt)}</p>
            {request.reviewedBy && (
              <p className="text-xs text-green-700 dark:text-green-500 mt-1">
                Processed by: {request.reviewedBy}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        {request.status === 'pending' && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <MaterialSymbol name={showDetails ? 'expand_less' : 'expand_more'} size={20} className="inline mr-1" />
              {showDetails ? 'Hide Details' : 'View Details'}
            </button>
            <button
              onClick={() => onRequestInfo?.(request.id)}
              className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <MaterialSymbol name="info" size={20} className="inline mr-1" />
              Request Info
            </button>
            <button
              onClick={() => navigate(`/admin/withdrawals/reject/${request.id}`)}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <MaterialSymbol name="cancel" size={20} className="inline mr-1" />
              Reject
            </button>
            <button
              onClick={() => onApprove?.(request.id)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <MaterialSymbol name="check_circle" size={20} className="inline mr-1" />
              Approve
            </button>
          </div>
        )}

        {request.status === 'approved' && (
          <div className="flex gap-2">
            <button
              onClick={() => onMarkPaid?.(request.id)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <MaterialSymbol name="payments" size={20} className="inline mr-1" />
              Mark as Paid
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <MaterialSymbol name={showDetails ? 'expand_less' : 'expand_more'} size={20} />
            </button>
          </div>
        )}

        {/* Additional Details (Expandable) */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Additional Details</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">User ID: </span>
                <span className="font-mono text-gray-900 dark:text-white">{request.userId}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Payout Percentage: </span>
                <span className="text-gray-900 dark:text-white">{request.payoutPercentage}%</span>
              </div>
              {request.reviewedBy && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Reviewed By: </span>
                  <span className="text-gray-900 dark:text-white">{request.reviewedBy}</span>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

