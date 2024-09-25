interface SelectedMessageProps {
  avatar: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  status: 'online' | 'offline' | 'typing';
  lastSeen?: string;
  blocked: boolean;
}

const messages: SelectedMessageProps[] = [
  {
    avatar: 'https://picsum.photos/201',
    name: 'kasimo l9re3',
    lastMessage: 'omwan',
    time: '21:15 PM',
    unreadCount: 3,
    status: 'online',
    blocked: false,
  },
  {
    avatar: 'https://picsum.photos/202',
    name: 'imad king of 1337',
    lastMessage: 'wakhdmo adrari.....',
    time: '21:15 PM',
    unreadCount: 99,
    status: 'typing',
    blocked: true,
  },
  {
    avatar: 'https://picsum.photos/203',
    name: 'mehadi f',
    lastMessage: 'chni 9alih.....',
    time: '21:15 PM',
    status: 'offline',
    lastSeen: '20:30 PM',
    blocked: true,
  },
  {
    avatar: 'https://picsum.photos/204',
    name: 'yasmine',
    lastMessage: 'nmchiw ntghdaw',
    time: '21:15 PM',
    status: 'online',
    blocked: false,
  },
  {
    avatar: 'https://picsum.photos/205',
    name: 'hamza',
    lastMessage: 'waaa3 lminisheeeel',
    time: '21:15 PM',
    unreadCount: 1,
    status: 'offline',
    lastSeen: '19:45 PM',
    blocked: false,
  },
  {
    avatar: 'https://picsum.photos/206',
    name: 'oussama',
    lastMessage: 'appah',
    time: '21:15 PM',
    unreadCount: 99,
    status: 'typing',
    blocked: false,
  },
  {
    avatar: 'https://picsum.photos/207',
    name: 'naima',
    lastMessage: 'waa333',
    time: '21:15 PM',
    status: 'online',
    blocked: false,
  },
  {
    avatar: 'https://picsum.photos/208',
    name: 'hex01e',
    lastMessage: 'appah',
    time: '21:15 PM',
    unreadCount: 99,
    status: 'offline',
    lastSeen: '18:20 PM',
    blocked: true,
  },
];

export default messages;
