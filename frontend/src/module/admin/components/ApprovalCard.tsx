import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';
import type { FemaleApproval } from '../types/admin.types';

interface ApprovalCardProps {
  approval: FemaleApproval;
  onApprove?: (userId: string) => void;
  onReject?: (userId: string, reason: string) => void;
  onRequestInfo?: (userId: string) => void;
}

export const ApprovalCard = ({
  approval,
  onApprove,
  onReject,
  onRequestInfo,
}: ApprovalCardProps) => {
  const navigate = useNavigate();
  const [showFullProfile, setShowFullProfile] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };


  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {approval.user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{approval.user.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{approval.user.email}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Submitted: {formatDate(approval.submittedAt)}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm font-medium">
            Pending Review
          </span>
        </div>

        {/* Profile Preview */}
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {approval.profile.photos && approval.profile.photos.length > 0 ? (
              approval.profile.photos.slice(0, 3).map((photo, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800"
                >
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-3 aspect-video rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <MaterialSymbol name="photo" className="text-gray-400" size={32} />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MaterialSymbol name="cake" className="text-gray-400" size={18} />
              <span className="text-gray-600 dark:text-gray-400">Age: </span>
              <span className="font-medium text-gray-900 dark:text-white">{approval.profile.age}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MaterialSymbol name="location_on" className="text-gray-400" size={18} />
              <span className="text-gray-600 dark:text-gray-400">Location: </span>
              <span className="font-medium text-gray-900 dark:text-white">{approval.profile.city}</span>
            </div>
            {approval.profile.bio && (
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Bio: </span>
                <p className="text-gray-900 dark:text-white mt-1">{approval.profile.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Review Checklist */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Review Checklist</h4>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2">
              <MaterialSymbol
                name={approval.profile.photos && approval.profile.photos.length > 0 ? 'check_circle' : 'cancel'}
                className={approval.profile.photos && approval.profile.photos.length > 0 ? 'text-green-600' : 'text-gray-400'}
                size={18}
              />
              <span className={approval.profile.photos && approval.profile.photos.length > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                Profile Photos ({approval.profile.photos?.length || 0})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MaterialSymbol
                name={approval.profile.bio ? 'check_circle' : 'cancel'}
                className={approval.profile.bio ? 'text-green-600' : 'text-gray-400'}
                size={18}
              />
              <span className={approval.profile.bio ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                Bio Complete
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MaterialSymbol
                name={approval.profile.age >= 18 ? 'check_circle' : 'cancel'}
                className={approval.profile.age >= 18 ? 'text-green-600' : 'text-gray-400'}
                size={18}
              />
              <span className={approval.profile.age >= 18 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                Age Verified (18+)
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFullProfile(!showFullProfile)}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <MaterialSymbol name={showFullProfile ? 'expand_less' : 'expand_more'} size={20} className="inline mr-1" />
            {showFullProfile ? 'Show Less' : 'View Full Profile'}
          </button>
          <button
            onClick={() => onRequestInfo?.(approval.userId)}
            className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            <MaterialSymbol name="info" size={20} className="inline mr-1" />
            Request Info
          </button>
          <button
            onClick={() => navigate(`/admin/female-approval/reject/${approval.userId}`)}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            <MaterialSymbol name="cancel" size={20} className="inline mr-1" />
            Reject
          </button>
          <button
            onClick={() => onApprove?.(approval.userId)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <MaterialSymbol name="check_circle" size={20} className="inline mr-1" />
            Approve
          </button>
        </div>

        {/* Full Profile (Expandable) */}
        {showFullProfile && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Additional Details</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">User ID: </span>
                <span className="font-mono text-gray-900 dark:text-white">{approval.userId}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Email: </span>
                <span className="text-gray-900 dark:text-white">{approval.user.email}</span>
              </div>
              {approval.profile.location && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Coordinates: </span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {approval.profile.location.lat.toFixed(4)}, {approval.profile.location.lng.toFixed(4)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
  );
};

