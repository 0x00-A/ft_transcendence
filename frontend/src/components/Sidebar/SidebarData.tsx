import { LiaUserFriendsSolid } from 'react-icons/lia';
import { IoHomeOutline } from 'react-icons/io5';
import {
  IoGameControllerOutline,
  IoSearchOutline,
  IoChatbubblesOutline,
} from 'react-icons/io5';
import { AiOutlineAppstore } from 'react-icons/ai';
import { MdOutlineLeaderboard } from 'react-icons/md';
import { FaRegUser } from "react-icons/fa";
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
    icon: <IoHomeOutline size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />,
    activeIcon: (
      <IoHomeOutline size={MENU_ICON_SIZE} color={MENU_ACTIVE_ICON_COLOR} />
    ),
  },
  {
    id: 2,
    path: '/play',
    title: 'Game',
    icon: (
      <IoGameControllerOutline size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />
    ),
    activeIcon: (
      <IoGameControllerOutline
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
      <IoChatbubblesOutline size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />
    ),
    activeIcon: (
      <IoChatbubblesOutline
        size={MENU_ICON_SIZE}
        color={MENU_ACTIVE_ICON_COLOR}
      />
    ),
  },
  {
    id: 3,
    path: '/friends',
    title: 'Friends ',
    icon: <LiaUserFriendsSolid size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />,
    activeIcon: (
      <LiaUserFriendsSolid
        size={MENU_ICON_SIZE}
        color={MENU_ACTIVE_ICON_COLOR}
      />
    ),
  },
  {
    id: 4,
    path: '/search',
    title: 'Search',
    icon: <IoSearchOutline size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />,
    activeIcon: (
      <IoSearchOutline size={MENU_ICON_SIZE} color={MENU_ACTIVE_ICON_COLOR} />
    ),
  },
  {
    id: 5,
    path: '/store',
    title: 'Store',
    icon: <AiOutlineAppstore size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />,
    activeIcon: (
      <AiOutlineAppstore size={MENU_ICON_SIZE} color={MENU_ACTIVE_ICON_COLOR} />
    ),
  },
  {
    id: 6,
    path: '/leaderboard',
    title: 'Leaderboard',
    icon: (
      <MdOutlineLeaderboard size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />
    ),
    activeIcon: (
      <MdOutlineLeaderboard
        size={MENU_ICON_SIZE}
        color={MENU_ACTIVE_ICON_COLOR}
      />
    ),
  },
  {
    id: 7,
    path: '/profile',
    title: 'Profile',
    icon: <FaRegUser size={MENU_ICON_SIZE} color={MENU_ICON_COLOR} />,
    activeIcon: (
      <FaRegUser size={MENU_ICON_SIZE} color={MENU_ACTIVE_ICON_COLOR} />
    ),
  },
];

export default Menus;
