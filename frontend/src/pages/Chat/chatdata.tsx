interface ChatMessage {
  name: string;
  content: string;
  sender: boolean;
  avatar: string;
  time: string;
}

const chatData: { [key: string]: ChatMessage[] } = {
  oussama: [
    {
      name: 'oussama',
      content: 'Hey, how are you?',
      sender: false,
      avatar: 'https://picsum.photos/200',
      time: '21:15 PM',
    },
    {
      name: 'rachid el ismaiyly',
      content: 'I m good, how about you?',
      sender: true,
      avatar: 'https://picsum.photos/200',
      time: '21:16 PM',
    },
  ],
  'abde latif': [
    {
      name: 'abde latif',
      content: 'Hey, how are you? cc',
      sender: false,
      avatar: 'https://picsum.photos/200',
      time: '21:15 PM',
    },
    {
      name: 'rachid el ismaiyly',
      content: 'I’m good, how about you cc ?',
      sender: true,
      avatar: 'https://picsum.photos/200',
      time: '21:16 PM',
    },
  ],
};

export default chatData;
