import { useEffect } from 'react';
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


const NotificationsDropdown = () => {
  const navigate = useNavigate();
  const { unreadCount, fetchNotifications, markAllAsRead, notifications, deleteAllNotifications } =
    useWebSocket();

  useEffect(() => {
    (async () => {
      await fetchNotifications();
    })();

    return () => {};
  }, []);

  const handleClick = () => {
    if (unreadCount)
      markAllAsRead();
  };

  const handleClearAll = () => {
    deleteAllNotifications();
  }

  // // Sample notifications data
  // const notifications = [
  //   {
  //     id: 1,
  //     title: 'Achievement unlocked',
  //     message: 'You just unlocked a new achievement: FT-PONG LENGEND',
  //     created_at: '2024-11-16T10:30:00',
  //   },
  //   {
  //     id: 2,
  //     title: 'Meeting Reminder',
  //     message: 'Team meeting starts in 15 minutes',
  //     created_at: '2024-11-16T09:45:00',
  //   },
  //   {
  //     id: 3,
  //     title: 'Task Update',
  //     message: 'Project X deadline has been extended',
  //     created_at: '2024-11-15T16:20:00',
  //   },
  //   {
  //     id: 4,
  //     title: 'System Alert',
  //     message: 'Successfully deployed latest changes',
  //     created_at: '2024-11-15T14:15:00',
  //   },
  //   {
  //     id: 5,
  //     title: 'New Comment',
  //     message: 'Sarah commented on your post',
  //     created_at: '2024-11-15T11:30:00',
  //   },
  //   {
  //     id: 6,
  //     title: 'New Comment',
  //     message: 'Sarah commented on your post',
  //     created_at: '2024-11-15T11:30:00',
  //   },
  //   {
  //     id: 7,
  //     title: 'New Comment',
  //     message: 'Sarah commented on your post',
  //     created_at: '2024-11-15T11:30:00',
  //   },
  // ];


  return (
    <DropdownMenu onOpenChange={handleClick}  >
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
      <DropdownMenuContent className="w-[32rem] text-white bg-[#1e2738] border-gray-600">
        <div className="px-4 py-3 border-b border-gray-600">
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
        </div>
        <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className={`px-4 py-3 hover:bg-[#5774a0] border-b border-gray-600 last:border-b-0 ${
                  notification.link && notification.link !== '#' ? 'cursor-pointer' : ''
                }`}
                
                onClick={() => {
                  if (notification.link && notification.link !== '#') {
                    navigate(notification.link);
                  }
                }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white">
                    {notification.title}
                  </h3>
                  <span className="text-[10px] text-gray-100">
                    {formatDate(notification.created_at)}
                  </span>
                </div>
                <p className="text-[13px] font-sans text-gray-100 mt-1">
                  {notification.message}
                </p>
              </div>
          ))}
        </div>
        {notifications.length != 0 && <DropdownMenuItem onClick={handleClearAll}  className='flex justify-center border-t border-gray-600'>
          <span>Clear All</span>
        </DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
