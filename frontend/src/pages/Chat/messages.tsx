interface SelectedMessageProps {
  avatar: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  status: 'online' | 'offline' | 'typing';
  lastSeen?: string;
}

const messages: SelectedMessageProps[] = [
  {
    avatar: 'https://picsum.photos/200',
    name: 'kasimo l9re3',
    lastMessage: 'omwan',
    time: '21:15 PM',
    unreadCount: 3,
    status: 'online',
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'imad king of 1337',
    lastMessage: 'wakhdmo adrari.....',
    time: '21:15 PM',
    unreadCount: 99,
    status: 'typing',
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'mehadi f',
    lastMessage: 'chni 9alih.....',
    time: '21:15 PM',
    status: 'offline',
    lastSeen: '20:30 PM',
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'yasmine',
    lastMessage: 'nmchiw ntghdaw',
    time: '21:15 PM',
    status: 'online',
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'hamza',
    lastMessage: 'waaa3 lminisheeeel',
    time: '21:15 PM',
    unreadCount: 1,
    status: 'offline',
    lastSeen: '19:45 PM',
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'oussama',
    lastMessage: 'appah',
    time: '21:15 PM',
    unreadCount: 99,
    status: 'typing',
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'naima',
    lastMessage: 'waa333',
    time: '21:15 PM',
    status: 'online',
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'hex01e',
    lastMessage: 'appah',
    time: '21:15 PM',
    unreadCount: 99,
    status: 'offline',
    lastSeen: '18:20 PM',
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'hex01e',
    lastMessage: 'appah',
    time: '21:15 PM',
    unreadCount: 99,
    status: 'online',
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'naima',
    lastMessage: 'waa333',
    time: '21:15 PM',
    status: 'typing',
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'hex01e',
    lastMessage: 'appah',
    time: '21:15 PM',
    unreadCount: 99,
    status: 'offline',
    lastSeen: '17:55 PM',
  },
  {
    avatar: 'https://picsum.photos/200',
    name: 'hex01e',
    lastMessage: 'appah',
    time: '21:15 PM',
    unreadCount: 99,
    status: 'online',
  },
];

export default messages;
