import React, { useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { useWebSocket } from '@/contexts/WebSocketContext';

const NotificationsDropdown = () => {
  const {unreadCount, fetchNotifications, markAllAsRead, notifications} = useWebSocket()

  useEffect(() => {
    (async () => {
      await fetchNotifications();
    })()

    return () => {
    }
  }, [])

  const handleClick = () => {
    markAllAsRead()
  }

  // // Sample notifications data
  // const notifications = [
  //   {
  //     id: 1,
  //     title: "New Message",
  //     message: "You received a new message from John Doe",
  //     date: "2024-11-16T10:30:00"
  //   },
  //   {
  //     id: 2,
  //     title: "Meeting Reminder",
  //     message: "Team meeting starts in 15 minutes",
  //     date: "2024-11-16T09:45:00"
  //   },
  //   {
  //     id: 3,
  //     title: "Task Update",
  //     message: "Project X deadline has been extended",
  //     date: "2024-11-15T16:20:00"
  //   },
  //   {
  //     id: 4,
  //     title: "System Alert",
  //     message: "Successfully deployed latest changes",
  //     date: "2024-11-15T14:15:00"
  //   },
  //   {
  //     id: 5,
  //     title: "New Comment",
  //     message: "Sarah commented on your post",
  //     date: "2024-11-15T11:30:00"
  //   }
  // ];

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <DropdownMenu onOpenChange={handleClick} className="text-white">
      <DropdownMenuTrigger className="flex items-center justify-center w-10 h-10 rounded-full  focus:outline-none">
        <IoMdNotificationsOutline size={32} color="#F8F3E3" className="text-gray-600 relative"/>
        {unreadCount > 0 && (
          <span className="bg-[#ff2047] text-sm text-red-6 flex justify-center items-center w-6 h-6 absolute transform translate-x-[10px] translate-y-[-9px] rounded-full bg-brand-1 border border-text-color">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80  text-white">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-gray-900">
                  {notification.title}
                </h3>
                <span className="text-xs text-gray-500">
                  {formatDate(notification.created_at)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;