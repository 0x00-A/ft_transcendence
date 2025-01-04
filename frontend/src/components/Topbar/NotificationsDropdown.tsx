import { useCallback, useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { formatDate } from '@/utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell } from "lucide-react";

import NotificationSkeleton from './NotificationSkeleton';

const NotificationsDropdown = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    unreadCount,
    fetchNotifications,
    markAllAsRead,
    notifications,
    paginationInfo,
    deleteAllNotifications,
  } = useWebSocket();

  const loadNotifications = useCallback(async (pageToLoad: number) => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      await fetchNotifications(pageToLoad, false);
      console.log("Fetched notifications for page:", pageToLoad);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchNotifications]);
  
  useEffect(() => {
    (async () => {
      try {
        setIsInitialLoading(true);
        await fetchNotifications(1, true);
        console.log("Fetched notifications page 1:");
      }
      catch (error) {
      } finally {
        setIsInitialLoading(false);
      }
    })();
    return () => {};
  }, []);

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
    loadNotifications(currentPage + 1);
  };

  const handleDropdownOpen = (open: boolean) => {
    if (open && unreadCount > 0) {
      markAllAsRead();
    }
    setIsOpen(open);
  };

  const handleNotificationClick = (notification: any) => {
    if (notification.link) {
      if (notification.state) {
        navigate(notification.link, { state: { selectedFriend: notification.state } });
      } else if (notification.link !== '#') {
        navigate(notification.link);
      }
    }
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleDropdownOpen}>
      <DropdownMenuTrigger className="relative flex items-center justify-center w-10 h-10 rounded-full focus:outline-none hover:bg-gray-700/20 transition-colors duration-200">
        <IoMdNotificationsOutline
          size={32}
          color="#F8F3E3"
          className="text-gray-600"
        />
        {unreadCount > 0 && (
          <span className="absolute flex items-center justify-center w-6 h-6 text-sm transform translate-x-[10px] translate-y-[-9px] rounded-full bg-[#ff2047] border border-text-color">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="end"
        className="w-[32rem] text-white bg-[#1e2738] border-gray-600 shadow-lg"
      >
        <div className="sticky top-0 px-4 py-3 border-b border-gray-600 bg-[#1e2738] z-10">
          <h2 className="text-lg font-semibold text-white">
            {t('notifications.title')}
          </h2>
        </div>

        <div className="max-h-96 overflow-y-auto overscroll-contain">
          {isInitialLoading ? (
            <NotificationSkeleton />
          ) : notifications.length === 0 && !isLoading ? (
            <div className="p-8 text-center">
              <div className="flex justify-center mb-3">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-base text-muted-foreground">
                {t('notifications.empty')}
              </p>
            </div>
          ) : (
            <>
              {notifications.map((notification, index) => (
                <div
                  key={notification.id || index}
                  className={`px-4 py-3 hover:bg-[#5774a0] border-b border-gray-600 last:border-b-0 transition-colors duration-200 ${
                    notification.link && notification.link !== '#' ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-bold text-white line-clamp-1">
                      {notification.title}
                    </h3>
                    <span className="text-[10px] text-gray-100 whitespace-nowrap">
                      {formatDate(notification.created_at, t('lang'))}
                    </span>
                  </div>
                  <p className="text-[13px] font-sans text-gray-100 mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                </div>
              ))}
              
              {/* Show More button with loading state */}
              {paginationInfo && (
                <div className="flex justify-center py-4 border-t border-gray-600">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm bg-[#5774a0] hover:bg-[#4a6389] rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-.3s]" />
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-.5s]" />
                      </div>
                    ) : (
                      t('notifications.loadMore')
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {notifications.length > 0 && (
          <DropdownMenuItem
            onClick={deleteAllNotifications}
            className="flex justify-center border-t border-gray-600 hover:bg-[#5774a0] transition-colors duration-200"
          >
            <span>{t('notifications.clearAll')}</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;