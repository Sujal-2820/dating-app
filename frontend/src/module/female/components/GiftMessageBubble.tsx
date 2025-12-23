import { useState } from 'react';
import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';
import { GiftCarouselViewer } from './GiftCarouselViewer';
import { getGiftTheme } from '../utils/giftThemes';
import type { Gift } from '../types/female.types';
import { format } from 'date-fns';

interface GiftMessageBubbleProps {
  gifts: Gift[];
  note?: string;
  timestamp: Date;
  senderName?: string;
}

export const GiftMessageBubble = ({
  gifts,
  note,
  timestamp,
  senderName,
}: GiftMessageBubbleProps) => {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const time = format(timestamp, 'h:mm a');
  const isMultiple = gifts.length > 1;

  // Single gift display
  if (!isMultiple) {
    const gift = gifts[0];
    const theme = getGiftTheme(gift);

    return (
      <>
        <div className="flex justify-start mb-3 px-4">
          <div className="flex flex-col max-w-[75%] items-start">
            <div className="rounded-2xl p-4 bg-white dark:bg-[#342d18] text-gray-900 dark:text-white rounded-tl-sm border border-gray-200 dark:border-gray-700 shadow-sm">
              {/* Gift Icon */}
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-3 bg-gradient-to-br ${theme.primary} rounded-full`}>
                  {gift.imageUrl ? (
                    <img
                      src={gift.imageUrl}
                      alt={gift.name}
                      className="w-8 h-8 object-contain drop-shadow-sm"
                    />
                  ) : (
                    <MaterialSymbol name={gift.icon as any} size={32} className="text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-base">{gift.name}</h4>
                  {gift.description && (
                    <p className="text-xs opacity-90 mt-1">{gift.description}</p>
                  )}
                  {senderName && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      From {senderName}
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity Badge */}
              {gift.quantity && gift.quantity > 1 && (
                <div className="absolute top-2 right-2 bg-primary text-white rounded-full px-2 py-1 text-xs font-bold shadow-md">
                  ×{gift.quantity}
                </div>
              )}

              {/* Trade Value */}
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MaterialSymbol name="monetization_on" size={16} className="text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      Trade Value: ₹{gift.tradeValue}
                      {gift.quantity && gift.quantity > 1 && ` × ${gift.quantity} = ₹${gift.tradeValue * gift.quantity}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Note */}
              {note && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm italic">{note}</p>
                </div>
              )}
            </div>
            <span className="text-[10px] text-gray-500 dark:text-[#cc8ea3] mt-1">{time}</span>
          </div>
        </div>
        <GiftCarouselViewer
          isOpen={isCarouselOpen}
          onClose={() => setIsCarouselOpen(false)}
          gifts={gifts}
          note={note}
          initialIndex={0}
        />
      </>
    );
  }

  // Multiple gifts - deck of cards view
  return (
    <>
      <div className="flex justify-start mb-3 px-4">
        <div className="flex flex-col max-w-[85%] items-start">
          <div
            className="rounded-2xl p-4 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] bg-white dark:bg-[#342d18] text-gray-900 dark:text-white rounded-tl-sm border border-gray-200 dark:border-gray-700 shadow-sm"
            onClick={() => setIsCarouselOpen(true)}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 gap-3 min-w-0">
              <div className="flex items-center gap-2 shrink-0">
                <MaterialSymbol name="redeem" size={24} className="shrink-0" />
                <span className="font-bold whitespace-nowrap">{gifts.length} Gifts</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                <span className="text-xs opacity-80 whitespace-nowrap">Tap to view</span>
                <MaterialSymbol name="open_in_full" size={18} className="opacity-80 shrink-0" />
              </div>
            </div>

            {/* Deck of Cards View */}
            <div className="relative" style={{ height: '140px' }}>
              {gifts.slice(0, Math.min(4, gifts.length)).map((gift, index) => {
                const totalVisible = Math.min(4, gifts.length);
                const rotation = (index - (totalVisible - 1) / 2) * 3;
                const offsetX = (index - (totalVisible - 1) / 2) * 12;
                const offsetY = index * 6;
                const theme = getGiftTheme(gift);

                return (
                  <div
                    key={gift.id}
                    className={`absolute bg-gradient-to-br ${theme.secondary} rounded-xl p-4 border-2 border-white/50 dark:border-white/20 shadow-lg backdrop-blur-sm transition-all hover:scale-105`}
                    style={{
                      left: `calc(50% + ${offsetX}px)`,
                      top: `${offsetY}px`,
                      transform: `translateX(-50%) rotate(${rotation}deg)`,
                      width: '85%',
                      zIndex: gifts.length - index,
                      transition: 'transform 0.2s ease-out',
                    }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {gift.imageUrl ? (
                        <img
                          src={gift.imageUrl}
                          alt={gift.name}
                          className="w-8 h-8 object-contain drop-shadow-md"
                        />
                      ) : (
                        <MaterialSymbol
                          name={gift.icon as any}
                          size={32}
                          className="text-white drop-shadow-md"
                        />
                      )}
                      <span className="text-sm font-bold text-center text-white drop-shadow-md">{gift.name}</span>
                      {index === 0 && gifts.length > 4 && (
                        <div className={`absolute -top-1 -right-1 bg-gradient-to-br ${theme.primary} rounded-full size-6 flex items-center justify-center shadow-md`}>
                          <span className="text-xs font-bold text-white">+{gifts.length - 4}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Trade Value */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">Total Trade Value:</span>
                <div className="flex items-center gap-1">
                  <MaterialSymbol name="monetization_on" size={14} className="text-green-600 dark:text-green-400" />
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    ₹{gifts.reduce((sum, g) => sum + (g.tradeValue * (g.quantity || 1)), 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Note Preview */}
            {note && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm italic line-clamp-2">{note}</p>
              </div>
            )}
          </div>
          <span className="text-[10px] text-gray-500 dark:text-[#cc8ea3] mt-1">{time}</span>
        </div>
      </div>

      {/* Gift Carousel Viewer */}
      <GiftCarouselViewer
        isOpen={isCarouselOpen}
        onClose={() => setIsCarouselOpen(false)}
        gifts={gifts}
        note={note}
        initialIndex={0}
      />
    </>
  );
};

