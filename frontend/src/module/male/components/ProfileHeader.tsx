import { MaterialSymbol } from '../types/material-symbol';
import { useTranslation } from '../../../core/hooks/useTranslation';

interface ProfileHeaderProps {
  user: {
    name: string;
    avatar: string;
    isPremium: boolean;
    isOnline: boolean;
  };
  onEditClick?: () => void;
}

export const ProfileHeader = ({ user, onEditClick }: ProfileHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between p-4 pt-8">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-4 border-pink-300 dark:border-pink-600 shadow-lg ring-2 ring-pink-200/50 dark:ring-pink-900/30"
            style={{ backgroundImage: `url("${user.avatar}")` }}
            aria-label={`${user.name}'s profile avatar`}
          />
          {user.isOnline && (
            <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-4 border-white dark:border-[#1a0f14] shadow-md ring-1 ring-pink-200/50 dark:ring-pink-900/30" />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
            {t('welcome')}, {user.name} <span className="text-pink-500">💕</span>
          </p>
          <p className="text-pink-600/80 dark:text-pink-400/80 text-sm font-semibold leading-normal">
            {user.isPremium ? `✨ ${t('vipMembership')}` : t('freeMember')}
          </p>
        </div>
      </div>
      <button
        onClick={onEditClick}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 text-pink-700 dark:text-pink-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all border border-pink-200/50 dark:border-pink-800/50"
        aria-label="Edit Profile"
      >
        <MaterialSymbol name="edit" size={20} />
      </button>
    </div>
  );
};

