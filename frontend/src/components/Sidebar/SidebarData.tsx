import { LiaUserFriendsSolid } from 'react-icons/lia';
import { IoHomeOutline } from 'react-icons/io5';
import {
  IoGameControllerOutline,
  IoSearchOutline,
  IoChatbubblesOutline,
} from 'react-icons/io5';
import { AiOutlineAppstore } from 'react-icons/ai';
import { MdOutlineLeaderboard } from 'react-icons/md';
import { RiSettings3Line } from 'react-icons/ri';

const Menus = [
  {
    id: 0,
    path: '/',
    title: 'Dashboard',
    icon: <IoHomeOutline size={32} color={'#F8F3E3'} />,
    activeIcon: <IoHomeOutline size={32} color={'#d6192e'} />,
  },
  {
    id: 2,
    path: '/games',
    title: 'Games',
    icon: <IoGameControllerOutline size={32} color={'#F8F3E3'} />,
    activeIcon: <IoGameControllerOutline size={32} color={'#d6192e'} />,
  },
  {
    id: 1,
    path: '/chat',
    title: 'Chat',
    icon: <IoChatbubblesOutline size={32} color={'#F8F3E3'} />,
    activeIcon: <IoChatbubblesOutline size={32} color={'#d6192e'} />,
  },
  {
    id: 3,
    path: '/friends',
    title: 'Friends ',
    icon: <LiaUserFriendsSolid size={32} color={'#F8F3E3'} />,
    activeIcon: <LiaUserFriendsSolid size={32} color={'#d6192e'} />,
  },
  {
    id: 4,
    path: '/search',
    title: 'Search',
    icon: <IoSearchOutline size={32} color={'#F8F3E3'} />,
    activeIcon: <IoSearchOutline size={32} color={'#d6192e'} />,
  },
  {
    id: 5,
    path: '/store',
    title: 'Store',
    icon: <AiOutlineAppstore size={32} color={'#F8F3E3'} />,
    activeIcon: <AiOutlineAppstore size={32} color={'#d6192e'} />,
  },
  {
    id: 6,
    path: '/leaderboard',
    title: 'Leaderboard',
    icon: <MdOutlineLeaderboard size={32} color={'#F8F3E3'} />,
    activeIcon: <MdOutlineLeaderboard size={32} color={'#d6192e'} />,
  },
  {
    id: 7,
    path: '/settings',
    title: 'Settings',
    icon: <RiSettings3Line size={32} color={'#F8F3E3'} />,
    activeIcon: <RiSettings3Line size={32} color={'#d6192e'} />,
  },
];

export default Menus;
