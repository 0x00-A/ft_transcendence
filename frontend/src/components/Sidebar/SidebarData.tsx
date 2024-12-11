import { User, Users, MessageSquareText, Gamepad2, LayoutDashboard } from 'lucide-react';
import {
  MENU_ACTIVE_ICON_COLOR,
  MENU_ICON_COLOR,
  MENU_ICON_SIZE,
} from '../../config/constants';

const Menus = [
  {
    id: 0,
    path: '/',
    title: 'Dashboard',
    icon: <LayoutDashboard size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />,
    activeIcon: (
      <LayoutDashboard size={MENU_ICON_SIZE} color={MENU_ACTIVE_ICON_COLOR} />
    ),
  },
  {
    id: 2,
    path: '/play',
    title: 'Game',
    icon: (
      <Gamepad2 size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />
    ),
    activeIcon: (
      <Gamepad2
        size={MENU_ICON_SIZE}
        color={MENU_ACTIVE_ICON_COLOR}
      />
    ),
  },
  {
    id: 1,
    path: '/chat',
    title: 'Chat',
    icon: (
      <MessageSquareText size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />
    ),
    activeIcon: (
      <MessageSquareText
        size={MENU_ICON_SIZE}
        color={MENU_ACTIVE_ICON_COLOR}
      />
    ),
  },
  {
    id: 3,
    path: '/friends',
    title: 'Friends ',
    icon: <Users size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />,
    activeIcon: (
      <Users
        size={MENU_ICON_SIZE}
        color={MENU_ACTIVE_ICON_COLOR}
      />
    ),
  },
  // {
  //   id: 4,
  //   path: '/search',
  //   title: 'Search',
  //   icon: <IoSearchOutline size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />,
  //   activeIcon: (
  //     <IoSearchOutline size={MENU_ICON_SIZE} color={MENU_ACTIVE_ICON_COLOR} />
  //   ),
  // },
  // {
  //   id: 5,
  //   path: '/store',
  //   title: 'Store',
  //   icon: <AiOutlineAppstore size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />,
  //   activeIcon: (
  //     <AiOutlineAppstore size={MENU_ICON_SIZE} color={MENU_ACTIVE_ICON_COLOR} />
  //   ),
  // },
  // {
  //   id: 6,
  //   path: '/leaderboard',
  //   title: 'Leaderboard',
  //   icon: (
  //     <MdOutlineLeaderboard size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />
  //   ),
  //   activeIcon: (
  //     <MdOutlineLeaderboard
  //       size={MENU_ICON_SIZE}
  //       color={MENU_ACTIVE_ICON_COLOR}
  //     />
  //   ),
  // },
  {
    id: 7,
    path: '/profile',
    title: 'Profile',
    icon: <User size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />,
    activeIcon: (
      <User size={MENU_ICON_SIZE} color={MENU_ACTIVE_ICON_COLOR} />
    ),
  },
];

export default Menus;
