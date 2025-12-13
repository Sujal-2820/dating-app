import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';
import { BottomNavigation } from '../components/BottomNavigation';
import { MaleTopNavbar } from '../components/MaleTopNavbar';
import { MaleSidebar } from '../components/MaleSidebar';
import { useMaleNavigation } from '../hooks/useMaleNavigation';
import type { Gift, GiftTransaction } from '../types/male.types';


// Mock data - replace with actual API calls
const mockGifts: Gift[] = [
  { id: '1', name: 'Rose', icon: 'local_florist', cost: 50, description: 'A beautiful rose to show your interest', category: 'romantic' },
  { id: '2', name: 'Chocolate', icon: 'cake', cost: 100, description: 'Sweet chocolate to make them smile', category: 'romantic' },
  { id: '3', name: 'Diamond', icon: 'diamond', cost: 500, description: 'Precious diamond for someone special', category: 'luxury' },
  { id: '4', name: 'Heart', icon: 'favorite', cost: 200, description: 'Show your love with a heart', category: 'romantic' },
  { id: '5', name: 'Star', icon: 'star', cost: 150, description: 'Make them feel like a star', category: 'special' },
  { id: '6', name: 'Crown', icon: 'workspace_premium', cost: 1000, description: 'Royal treatment with a crown', category: 'luxury' },
  { id: '7', name: 'Balloon', icon: 'celebration', cost: 75, description: 'Celebrate with colorful balloons', category: 'fun' },
  { id: '8', name: 'Ring', icon: 'favorite', cost: 800, description: 'A special ring for someone special', category: 'luxury' },
];

const mockGiftHistory: GiftTransaction[] = [
  {
    id: '1',
    giftId: '1',
    giftName: 'Rose',
    recipientId: '1',
    recipientName: 'Sarah',
    recipientAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNnKyZLNWCV7B-XwKgjd9-bbG9ZSq583oYGij7uKTYk2Ah_9nkpqgsGSDu-FUgux5QDiLCTw_y9JxTBhkZjWAOOReMhlK98A_84vIsKaxQ0IUzZqkJ7-wnAv67HRuUVltC2QQzOfbTk1-OdjqC7SWT4iG-MXs81ePZK3x1mYOHabRqp4eH7yIfiX3tH-YMXSs1uWS41vrxzPC8_MJHasLGiUWINfHYQ7KF2jfo0n_Yo6qBJKr_qMrOBUdimUVVJdY46GD7L0v-oL4',
    sentAt: 'Today, 2:30 PM',
    cost: 50,
    message: 'You are beautiful!',
  },
  {
    id: '2',
    giftId: '3',
    giftName: 'Diamond',
    recipientId: '2',
    recipientName: 'Jessica',
    recipientAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHxrviFMtsvG_Idvc-7NLJcibIA3HzpSimrSGtu5nkdVXQ0lR_v5vA3Ze5PcHiEZqXs444SJmue_gn-BAJpC_N4OBtiZ76IDvr9bLR_SxT5dQNp7j5WAWAzR9Cc6wdHAOpqLvxURxJbRcG1oN1Y1usF6uro9rSV6FLFxuNnpI_KIDdXzO8GH9BtmEm-Da4mrHV39aDrH-gGMTms5x6GJrf9pvOpfKnux5C1cD8_KgfRomNHp0HOgf-8TefyOTLXglCq3P1RsbOOf8',
    sentAt: 'Yesterday, 5:15 PM',
    cost: 500,
  },
];

const mockAvailableGifts = 5; // From VIP purchase

export const GiftsPage = () => {
  const navigate = useNavigate();
  const { isSidebarOpen, setIsSidebarOpen, navigationItems, handleNavigationClick } = useMaleNavigation();
  const [selectedTab, setSelectedTab] = useState<'send' | 'history'>('send');
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [giftMessage, setGiftMessage] = useState('');
  const [coinBalance] = useState(1250);
  const [availableGifts] = useState(mockAvailableGifts);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSendGift = () => {
    if (selectedGift && selectedRecipient) {
      const gift = mockGifts.find((g) => g.id === selectedGift);
      if (gift) {
        // TODO: API call to send gift
        console.log('Sending gift:', { gift, recipient: selectedRecipient, message: giftMessage });
        // Reset form
        setSelectedGift(null);
        setSelectedRecipient(null);
        setGiftMessage('');
        // Show success message or navigate
        alert('Gift sent successfully!');
      }
    }
  };

  const filteredGifts = mockGifts.filter((gift) => gift.isAvailable !== false);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased selection:bg-primary selection:text-white pb-24 min-h-screen">
      {/* Top Navbar */}
      <MaleTopNavbar onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Sidebar */}
      <MaleSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        items={navigationItems}
        onItemClick={handleNavigationClick}
      />

      {/* Header */}
      <header className="sticky top-[57px] z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-black/5 dark:border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-[#342d18] text-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-[#4b202e] transition-colors active:scale-95"
            aria-label="Go back"
          >
            <MaterialSymbol name="arrow_back" size={24} />
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Gifts</h1>
          <div className="size-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Available Gifts Badge */}
      {availableGifts > 0 && (
        <div className="mx-4 mt-4 p-3 bg-gradient-to-r from-primary/20 to-pink-500/20 rounded-xl border border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MaterialSymbol name="redeem" className="text-primary" />
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                You have {availableGifts} free gift{availableGifts > 1 ? 's' : ''} from VIP membership
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-white/5 mx-4 mt-4">
        <button
          onClick={() => setSelectedTab('send')}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            selectedTab === 'send'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Send Gift
        </button>
        <button
          onClick={() => setSelectedTab('history')}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            selectedTab === 'history'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Gift History
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {selectedTab === 'send' ? (
          <div className="space-y-6">
            {/* Coin Balance */}
            <div className="bg-white dark:bg-[#342d18] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MaterialSymbol name="monetization_on" className="text-primary" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Coin Balance</span>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{coinBalance} coins</span>
              </div>
            </div>

            {/* Select Recipient */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Recipient</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: '1', name: 'Sarah', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNnKyZLNWCV7B-XwKgjd9-bbG9ZSq583oYGij7uKTYk2Ah_9nkpqgsGSDu-FUgux5QDiLCTw_y9JxTBhkZjWAOOReMhlK98A_84vIsKaxQ0IUzZqkJ7-wnAv67HRuUVltC2QQzOfbTk1-OdjqC7SWT4iG-MXs81ePZK3x1mYOHabRqp4eH7yIfiX3tH-YMXSs1uWS41vrxzPC8_MJHasLGiUWINfHYQ7KF2jfo0n_Yo6qBJKr_qMrOBUdimUVVJdY46GD7L0v-oL4' },
                  { id: '2', name: 'Jessica', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHxrviFMtsvG_Idvc-7NLJcibIA3HzpSimrSGtu5nkdVXQ0lR_v5vA3Ze5PcHiEZqXs444SJmue_gn-BAJpC_N4OBtiZ76IDvr9bLR_SxT5dQNp7j5WAWAzR9Cc6wdHAOpqLvxURxJbRcG1oN1Y1usF6uro9rSV6FLFxuNnpI_KIDdXzO8GH9BtmEm-Da4mrHV39aDrH-gGMTms5x6GJrf9pvOpfKnux5C1cD8_KgfRomNHp0HOgf-8TefyOTLXglCq3P1RsbOOf8' },
                  { id: '3', name: 'Emily', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIEnsXe0RpUu5LWRCfLi_lS-2wr9joEcf15WUPbFUamLpw44YrY6ci9n8jlL35RqX477FvduXCyJHoR4vMnQ9TazzyN4HxCns6xvssFGXnnj8AHJQ5WtID3GmVrTmJiIePWYlkI4Ahz944gcuOSaENv86pMF568tb1UYu1CYKCMkUhXOOsLd5mNg3EwYWl0x8i5xQoek5Ky4dnKVyB4UEPgmRoTzc_K8nhgnwI0tLLwJZqq9mNRcMWOvLl_sP4mjWRku5taLuKGJ0' },
                ].map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedRecipient(user.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      selectedRecipient === user.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#342d18]'
                    }`}
                  >
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    <span className="text-xs font-medium text-slate-900 dark:text-white">{user.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => navigate('/male/discover')}
                className="mt-3 w-full py-2 text-sm text-primary font-medium hover:bg-primary/10 rounded-lg transition-colors"
              >
                + Browse More Profiles
              </button>
            </div>

            {/* Select Gift */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Gift</h3>
              <div className="grid grid-cols-2 gap-3">
                {filteredGifts.map((gift) => (
                  <button
                    key={gift.id}
                    onClick={() => setSelectedGift(gift.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedGift === gift.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#342d18]'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <MaterialSymbol
                        name={gift.icon as any}
                        size={40}
                        className={selectedGift === gift.id ? 'text-primary' : 'text-gray-400'}
                      />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{gift.name}</span>
                      {gift.description && (
                        <span className="text-xs text-gray-600 dark:text-gray-400 text-center">{gift.description}</span>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <MaterialSymbol name="monetization_on" size={16} className="text-primary" />
                        <span className="text-xs font-medium text-slate-900 dark:text-white">
                          {availableGifts > 0 ? 'Free' : `${gift.cost} coins`}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Gift Message */}
            {selectedGift && selectedRecipient && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Add Message (Optional)</h3>
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Write a message to go with your gift..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white dark:bg-[#342d18] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  maxLength={200}
                />
                <p className="mt-1 text-xs text-gray-500">{giftMessage.length}/200</p>
              </div>
            )}

            {/* Send Button */}
            {selectedGift && selectedRecipient && (
              <button
                onClick={handleSendGift}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <MaterialSymbol name="send" />
                  <span>Send Gift</span>
                </div>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {mockGiftHistory.length === 0 ? (
              <div className="text-center py-12">
                <MaterialSymbol name="redeem" size={64} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No gifts sent yet</p>
                <button
                  onClick={() => setSelectedTab('send')}
                  className="mt-4 px-6 py-2 bg-primary text-slate-900 font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Send Your First Gift
                </button>
              </div>
            ) : (
              mockGiftHistory.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white dark:bg-[#342d18] rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={transaction.recipientAvatar}
                      alt={transaction.recipientName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            Sent {transaction.giftName} to {transaction.recipientName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.sentAt}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <MaterialSymbol name="monetization_on" size={16} className="text-primary" />
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {transaction.cost} coins
                          </span>
                        </div>
                      </div>
                      {transaction.message && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                          "{transaction.message}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavigation items={navigationItems} onItemClick={handleNavigationClick} />
    </div>
  );
};

