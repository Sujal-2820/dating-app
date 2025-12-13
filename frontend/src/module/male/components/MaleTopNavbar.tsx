import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';

interface MaleTopNavbarProps {
  onMenuClick: () => void;
}

export const MaleTopNavbar = ({ onMenuClick }: MaleTopNavbarProps) => {
  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-pink-50/95 via-rose-50/95 to-pink-50/95 dark:from-[#1a0f14]/95 dark:via-[#2d1a24]/95 dark:to-[#1a0f14]/95 backdrop-blur-lg border-b border-pink-200/50 dark:border-pink-900/30 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-md">
            <MaterialSymbol name="favorite" className="text-white" size={24} filled />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400 bg-clip-text text-transparent">MatchMint</span>
        </div>

        {/* Hamburger Menu */}
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center size-10 rounded-xl hover:bg-pink-100/50 dark:hover:bg-pink-900/20 transition-colors active:scale-95"
          aria-label="Open menu"
        >
          <MaterialSymbol name="menu" size={24} className="text-pink-700 dark:text-pink-300" />
        </button>
      </div>
    </div>
  );
};

