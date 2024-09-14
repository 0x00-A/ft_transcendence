import React from 'react';
import css from './MessageArea.module.css';
import Message from './Message';

interface MessageProps {
  name: string;
  content: string;
  sender: boolean;
  avatar: string;
  time: string;
}

const messages: MessageProps[] = [
  {
    name: 'rachid el ismaiyly',
    content: 'Hey, how are you? fdjhjkdf jkdf dmgdf hg hjdf ghasfdgf dsds sd',
    sender: false,
    avatar: 'https://picsum.photos/200',
    time: '21:15 PM',
  },
  {
    name: 'rachid el ismaiyly',
    content:
      'I’m good, how about you fdjhjkdf jkdf dmgdf hg hjdf ghasfdgf dsds sd?',
    sender: true,
    avatar: 'https://picsum.photos/200',
    time: '21:16 PM',
  },
  {
    name: 'rachid el ismaiyly',
    content: 'Doing well, thanks!',
    sender: false,
    avatar: 'https://picsum.photos/200',
    time: '21:17 PM',
  },
  {
    name: 'rachid el ismaiyly',
    content: 'Awesome to hear!',
    sender: true,
    avatar: 'https://picsum.photos/200',
    time: '21:18 PM',
  },
];

const MessageArea: React.FC = () => {
  return (
    <div className={css.messageArea}>
      {messages.map((message, index) => (
        <Message key={index} {...message} />
      ))}
    </div>
  );
};

export default MessageArea;
