import { MaterialSymbol } from '../types/material-symbol';
import { useTranslation } from '../../../core/hooks/useTranslation';

export type PlanTier = 'basic' | 'silver' | 'gold' | 'platinum' | string;

interface CoinPlanCardProps {
  tier: PlanTier;
  price: number;
  coins: number;
  originalPrice?: number;
  bonus?: string;
  badge?: string;
  isPopular?: boolean;
  isBestValue?: boolean;
  onBuyClick?: () => void;
  disabled?: boolean;
}

export const CoinPlanCard = ({
  tier,
  price,
  coins,
  originalPrice,
  bonus,
  badge,
  isPopular = false,
  isBestValue = false,
  onBuyClick,
  disabled = false,
}: CoinPlanCardProps) => {
  const { t } = useTranslation();

  const getTierStyles = () => {
    if (isBestValue) {
      return 'border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50 to-white dark:from-[#2a1b3d] dark:to-[#341822]';
    }
    if (isPopular) {
      return 'border-2 border-primary/50 ring-4 ring-primary/5';
    }
    return 'border-gray-200 dark:border-[#683143] bg-white dark:bg-[#341822]';
  };

  const getTierColor = () => {
    if (isBestValue) return 'text-indigo-600 dark:text-indigo-400';
    if (isPopular) return 'text-primary';
    return 'text-slate-500 dark:text-gray-300';
  };

  const getButtonStyles = () => {
    if (isBestValue) {
      return 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20';
    }
    if (isPopular) {
      return 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20';
    }
    return 'bg-gray-100 dark:bg-[#49222f] hover:bg-gray-200 dark:hover:bg-[#683143] text-slate-900 dark:text-white';
  };

  const getButtonHeight = () => {
    if (isPopular || isBestValue) return 'h-10';
    return 'h-9';
  };

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border p-4 shadow-sm relative overflow-hidden ${getTierStyles()}`}
    >
      {/* Badge */}
      {badge && (
        <div
          className={`absolute top-0 right-0 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl ${isBestValue ? 'bg-indigo-600' : 'bg-primary'
            }`}
        >
          {badge}
        </div>
      )}
      {tier === 'silver' && (
        <div className="absolute -right-3 top-3 bg-blue-500 text-white text-[10px] font-bold px-3 py-0.5 -rotate-45 transform origin-bottom-left shadow-sm">
          BONUS
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h1 className={`${getTierColor()} text-sm font-bold uppercase tracking-wider`}>
          {t(tier.toUpperCase())}
        </h1>
        <div className="flex flex-col gap-0">
          <div className="flex items-baseline gap-2">
            <span className={`${isPopular || isBestValue ? 'text-3xl' : 'text-2xl'} font-black tracking-tight`}>
              ₹{price.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-slate-400 text-xs line-through">₹{originalPrice}</span>
            )}
          </div>
          <span
            className={`text-yellow-600 dark:text-yellow-400 font-bold flex items-center gap-1 mt-1 ${isPopular || isBestValue ? 'text-lg' : 'text-sm'
              }`}
          >
            <MaterialSymbol
              name="monetization_on"
              filled
              size={isPopular || isBestValue ? 20 : 16}
            />
            {coins.toLocaleString()}
          </span>
          {bonus && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold mt-1 ${isBestValue
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'text-blue-600 dark:text-blue-400'
                }`}
            >
              {bonus}
            </span>
          )}
        </div>
      </div>

      <div className={isPopular || isBestValue ? 'mt-4' : 'mt-auto pt-2'}>
        <button
          onClick={onBuyClick}
          disabled={disabled}
          className={`w-full ${getButtonHeight()} rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 ${getButtonStyles()} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {disabled ? t('loading') : t('buyCoins')}
          {isPopular && !disabled && <MaterialSymbol name="bolt" size={18} />}
        </button>
      </div>
    </div>
  );
};

