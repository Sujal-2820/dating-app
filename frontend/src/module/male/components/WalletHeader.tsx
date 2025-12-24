import { useNavigate } from 'react-router-dom';
import { MaterialSymbol } from '../types/material-symbol';
import { useTranslation } from '../../../core/hooks/useTranslation';

interface WalletHeaderProps {
  onHelpClick?: () => void;
}

export const WalletHeader = ({ onHelpClick }: WalletHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-50 flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between">
      <button
        onClick={() => navigate(-1)}
        className="text-[#111418] dark:text-white flex size-12 shrink-0 items-center justify-start cursor-pointer active:scale-95 transition-transform"
        aria-label="Back"
      >
        <MaterialSymbol name="arrow_back_ios" size={24} />
      </button>
      <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
        {t('myWallet')}
      </h2>
      <div className="flex w-12 items-center justify-end">
        <button
          onClick={onHelpClick}
          className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-[#111418] dark:text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 active:scale-95 transition-transform"
          aria-label="Help"
        >
          <MaterialSymbol name="help" size={24} />
        </button>
      </div>
    </div>
  );
};

