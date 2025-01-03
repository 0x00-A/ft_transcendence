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

const NotificationsDropdown = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(1);


  const {
    unreadCount,
    fetchNotifications,
    markAllAsRead,
    notifications,
    paginationInfo,
    deleteAllNotifications,
  } = useWebSocket();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      console.log("notification ********")
      await fetchNotifications(page);
    })();

    return () => {};
  }, [page]);

  const handleClick = () => {
    if (unreadCount) markAllAsRead();
  };

  const handleClearAll = () => {
    deleteAllNotifications();
  };

  const loadMoreNotifications = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={(open) => { handleClick(); setIsOpen(open) }}>
      <DropdownMenuTrigger className="flex items-center justify-center w-10 h-10 rounded-full  focus:outline-none">
        <IoMdNotificationsOutline
          size={32}
          color="#F8F3E3"
          className="text-gray-600 relative"
        />
        {unreadCount > 0 && (
          <span className="bg-[#ff2047] text-sm text-red-6 flex justify-center items-center w-6 h-6 absolute transform translate-x-[10px] translate-y-[-9px] rounded-full bg-brand-1 border border-text-color">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        // sideOffset={5}
        className="w-[32rem] text-white bg-[#1e2738] border-gray-600"
      >
        <div className="px-4 py-3 border-b border-gray-600">
          <h2 className="text-lg font-semibold text-white">
            {t('notifications.title')}
          </h2>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center">
              <div className="flex justify-center mb-3">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-base text-muted-foreground">No new notifications</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              // <DropdownMenuItem key={notification.id}>
                <div
                  key={index}
                  className={`px-4 py-3 hover:bg-[#5774a0] border-b border-gray-600 last:border-b-0 ${
                    notification.link && notification.link !== '#'
                      ? 'cursor-pointer'
                      : ''
                  }`}
                  onClick={() => {
                    // console.log("click item notification");
                    // console.log(notification);
                    if (notification.link && notification.state) {
                      navigate(notification.link, { state: { selectedFriend: notification.state } });
                    } else if (notification.link && notification.link !== '#') {
                      navigate(notification.link);
                    }
                    setIsOpen(false);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white">
                      {notification.title}
                    </h3>
                    <span className="text-[10px] text-gray-100">
                      {formatDate(notification.created_at, t('lang'))}
                    </span>
                  </div>
                  <p className="text-[13px] font-sans text-gray-100 mt-1">
                    {notification.message}
                  </p>
                </div>
              // </DropdownMenuItem>
            ))
          )}
        </div>
        {notifications.length !== 0 && (
          <>
            <DropdownMenuItem
              onClick={handleClearAll}
              className="flex justify-center border-t border-gray-600"
            >
              <span>{t('notifications.clearAll')}</span>
            </DropdownMenuItem>
            {paginationInfo && (
              <DropdownMenuItem
                onClick={loadMoreNotifications}
                className="flex justify-center border-t border-gray-600"
              >
                <span>show more</span>
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
