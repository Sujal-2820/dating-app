import { MaterialSymbol } from '../types/material-symbol';

interface WalletBalanceProps {
  balance: number;
  onTopUpClick?: () => void;
}

export const WalletBalance = ({ balance, onTopUpClick }: WalletBalanceProps) => {
  const formattedBalance = balance.toLocaleString();

  return (
    <div className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 dark:from-pink-700 dark:via-rose-700 dark:to-pink-700 p-1.5 pr-2 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
      <div className="flex items-center gap-3 pl-4 py-2.5 relative z-10">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-md">
          <MaterialSymbol name="monetization_on" className="text-white" size={24} filled />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-pink-100 dark:text-pink-200">Balance</span>
          <span className="text-xl font-bold text-white leading-none">{formattedBalance}</span>
        </div>
      </div>
      <button
        onClick={onTopUpClick}
        className="flex h-10 items-center gap-2 rounded-xl bg-white/95 backdrop-blur-sm px-4 text-sm font-bold text-pink-700 transition-all hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95 duration-200 shadow-md border border-white/50 relative z-10"
      >
        <MaterialSymbol name="add" size={18} />
        Top Up
      </button>
    </div>
  );
};

