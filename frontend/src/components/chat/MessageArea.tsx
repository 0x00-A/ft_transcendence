import React, { useEffect, useRef } from 'react';
import css from './MessageArea.module.css';
import Message from './Message';
import { useTyping } from '@/contexts/TypingContext';
import { useSelectedConversation } from '@/contexts/SelectedConversationContext';
import { MessageProps } from '@/types/apiTypes';
// import { useTranslation } from 'react-i18next';
import { RefreshCcw } from 'lucide-react';


interface MessageAreaProps {
  messages: MessageProps[];
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages, onLoadMore, hasMore }) => {
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const messageAreaRef = useRef<HTMLDivElement | null>(null);
  // const [shouldScroll, setShouldScroll] = useState(true);
  // const { t } = useTranslation(); 


  const { typing } = useTyping();
  const { selectedConversation } = useSelectedConversation();

  const isReceiver = typing.senderId === selectedConversation?.user_id;

  const handleLoadMore = () => {
    if (messageAreaRef.current) {
      const scrollFromBottom = messageAreaRef.current.scrollHeight - 
                                messageAreaRef.current.scrollTop - 
                                messageAreaRef.current.clientHeight;

      // setShouldScroll(false);

      if (onLoadMore) {
        onLoadMore();
      }

      setTimeout(() => {
        if (messageAreaRef.current) {
          messageAreaRef.current.scrollTop = 
            messageAreaRef.current.scrollHeight - 
            messageAreaRef.current.clientHeight - 
            scrollFromBottom;
        }
      }, 0);
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    
    }
  }, [messages, typing.typing]);

  return (
    <div className={css.messageArea} ref={messageAreaRef}>
      {hasMore && (
        <button className={css.loadMoreButton} onClick={handleLoadMore}>
          <RefreshCcw />
        </button>
      )}
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
      {typing.typing && isReceiver && (
        <div className={css.typingIndicator}>
          <span className={css.typingDot}></span>
          <span className={css.typingDot}></span>
          <span className={css.typingDot}></span>
        </div>
      )}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageArea;