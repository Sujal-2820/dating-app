import { useTranslation } from '../../../core/hooks/useTranslation';

interface Chat {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  hasUnread: boolean;
  distance?: string;
}

interface ActiveChatsListProps {
  chats: Chat[];
  onChatClick?: (chatId: string) => void;
  onSeeAllClick?: () => void;
}

const ChatItem = ({ chat, onClick, sayHiPlaceholder }: { chat: Chat; onClick?: () => void; sayHiPlaceholder: string }) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 border-b border-pink-200/30 dark:border-pink-900/20 bg-gradient-to-r from-white via-pink-50/30 to-white dark:from-[#1a0f14] dark:via-[#2d1a24]/50 dark:to-[#1a0f14] px-4 py-3.5 active:bg-pink-50 dark:active:bg-[#2d1a24] hover:bg-pink-50/50 dark:hover:bg-[#2d1a24]/80 transition-all duration-200 group"
    >
      <div className="relative">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 border-2 border-pink-200 dark:border-pink-800 shadow-md group-hover:shadow-lg transition-shadow"
          style={{ backgroundImage: `url("${chat.userAvatar}")` }}
          aria-label={`Portrait of ${chat.userName}`}
        />
        {chat.isOnline && (
          <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white dark:border-[#1a0f14] shadow-md ring-1 ring-pink-200/50 dark:ring-pink-900/30" />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center text-left min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <p className="text-slate-900 dark:text-white text-base font-bold leading-normal truncate group-hover:text-pink-700 dark:group-hover:text-pink-300 transition-colors">
              {chat.userName}
            </p>
            {chat.distance && (
              <span className="text-[10px] text-primary font-medium shrink-0 flex items-center gap-0.5">
                • {chat.distance}
              </span>
            )}
          </div>
          <p className="text-pink-600/70 dark:text-pink-400/70 text-xs font-medium flex-shrink-0 ml-2">
            {chat.timestamp}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <p className="text-slate-600 dark:text-slate-300 text-sm font-normal leading-normal line-clamp-1 flex-1 min-w-0">
            {chat.lastMessage === 'Say hi!' ? sayHiPlaceholder : chat.lastMessage}
          </p>
          {chat.hasUnread && (
            <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 shrink-0 ml-auto shadow-md ring-1 ring-pink-200/50 dark:ring-pink-900/30" />
          )}
        </div>
      </div>
    </button>
  );
};

export const ActiveChatsList = ({ chats, onChatClick, onSeeAllClick }: ActiveChatsListProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between px-4 pb-3 pt-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-pink-500">💬</span> {t('activeConversations')}
        </h2>
        <button
          onClick={onSeeAllClick}
          className="text-sm font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
        >
          {t('seeAll')}
        </button>
      </div>
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          sayHiPlaceholder={t('sayHiPlaceholder')}
          onClick={() => onChatClick?.(chat.id)}
        />
      ))}
    </div>
  );
};

