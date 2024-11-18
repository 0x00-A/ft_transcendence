import React, { useEffect, useState } from 'react';
import css from './ChatContent.module.css';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import chatData from '../../pages/Chat/chatdata';
import moment from 'moment';


interface MessageProps {
  name: string;
  content: string;
  sender: boolean;
  avatar: string;
  time: string;
}

interface ChatContentProps {
  customSticker: string;
  isBlocked: boolean;
  onUnblock: () => void;
  onSelectedConversation: {
    avatar: string;
    name: string;
    time: string;
    status: boolean;
    lastSeen?: string;
  } | null;
}

interface ChatMessage {
    name: string;
    content: string;
    sender: boolean;
    avatar: string;
    time: string;
  }

const ChatContent: React.FC<ChatContentProps> = ({
    onSelectedConversation,
    customSticker,
    isBlocked,
    onUnblock,
}) => {

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);


  const handleSendMessage = (
    newMessage: string,
    isSticker: boolean = false
  ) => {
    if (onSelectedConversation) {
      const message = {
        name: 'You',
        content: newMessage,
        sender: true,
        avatar: 'https://picsum.photos/200',
        time: moment().format('HH:mm A'),
      };

      if (isSticker) {
        message.content = newMessage;
      }

      setChatMessages((prevMessages) => [...prevMessages, message]);
    }
  };

    useEffect(() => {
        if (onSelectedConversation) {
          setChatMessages(chatData[onSelectedConversation.name] || []);
        }
      }, [onSelectedConversation]);

  return (
    <>
      <div className={css.messageArea}>
        <MessageArea messages={chatMessages} />
      </div>
      <MessageInput
        onSendMessage={handleSendMessage}
        customSticker={customSticker}
        isBlocked={isBlocked}
        onUnblock={onUnblock}
      />
    </>
  );
};

export default ChatContent;
