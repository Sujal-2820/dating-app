import { MaterialSymbol } from '../types/material-symbol';
import { useTranslation } from '../../../core/hooks/useTranslation';

interface BalanceDisplayProps {
  balance: number;
}

export const BalanceDisplay = ({ balance }: BalanceDisplayProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="text-sm text-slate-500 dark:text-[#cb90a4] font-medium mb-1">
        {t('currentBalance')}
      </div>
      <div className="flex items-center gap-2">
        <MaterialSymbol name="monetization_on" size={48} className="text-yellow-500" />
        <span className="text-4xl font-extrabold tracking-tight">{balance.toLocaleString()}</span>
      </div>
    </div>
  );
};

