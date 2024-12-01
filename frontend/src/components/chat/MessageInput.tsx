import { useState, useRef, useEffect, useCallback } from 'react';
import { FaSmile } from 'react-icons/fa';
import css from './MessageInput.module.css';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { conversationProps } from '@/types/apiTypes';
import { useWebSocket } from '@/contexts/WebSocketChatProvider';
import { useUser } from '@/contexts/UserContext';
import { SendHorizontal, SmilePlus, Dice2 } from 'lucide-react';


interface MessageInputProps {
  customSticker: string;
  onSendMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
  conversationData: conversationProps | null;
}

const MessageInput = ({
  conversationData,
  customSticker,
  onSendMessage,
  onTyping,
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const buttonEmojiRef = useRef<HTMLButtonElement>(null);
  const { user } = useUser();
  const { toggleBlockStatus } = useWebSocket();

  // console.log("--------render MessageInput-------")

  const handleEmojiClick = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      setInputFocused(true);
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      emojiRef.current &&
      !emojiRef.current.contains(event.target as Node) &&
      buttonEmojiRef.current &&
      !buttonEmojiRef.current.contains(event.target as Node)
    ) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const debounce = (callback: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout | null = null;

    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  const debouncedOnTyping = useCallback(debounce(onTyping, 1000), [onTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setInputFocused(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    debouncedOnTyping(true);
  };

  const handleInputBlur = () => {
    if (!message.trim()) {
      setInputFocused(false);
    }
    onTyping(false);
  };

  const handleBlock = async (activeConversation: conversationProps) => {
    if (user?.id !== undefined) {
      toggleBlockStatus(activeConversation.id, user.id, activeConversation.user_id, false);
    }
  };

  if (conversationData?.block_status) {
    return (
      <div className={css.messageBlock}>
        <h2>{conversationData?.block_status_display}</h2>
        <p>You can't send messages to this user, and you won't receive their messages.</p>
        {conversationData?.block_status === 'blocker' && (
          <button
            className={css.buttonUnblock}
            onClick={() => handleBlock(conversationData)}
          >
            Unblock
          </button>
        )}
      </div>
    );
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
    } else if (customSticker) {
      onSendMessage(customSticker);
    }
    setMessage('');
    setIsFlying(true);
    setInputFocused(false);
    onTyping(false); // Stop typing on send
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current?.focus();
    }
    setTimeout(() => setIsFlying(false), 500);
  };

  return (
    <div className={css.messageInputWrapper}>
      {showEmojiPicker && (
        <div ref={emojiRef} className={css.emojiPicker}>
          <Picker data={data} onEmojiSelect={handleEmojiClick} />
        </div>
      )}

      <div className={css.messageInputContainer}>
        <textarea
          ref={textareaRef}
          placeholder="Write a message"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          className={css.textarea}
          rows={1}
        />

        <button
          ref={buttonEmojiRef}
          className={css.buttonEmoji}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          aria-label="Open emoji picker"
        >
          <SmilePlus />
        </button>

        <button
          className={css.buttonClip}
          aria-label="invite game"
        >
          <img src="/icons/chat/inviteBlack.svg" alt="Invite" />
        </button>
      </div>

      <button
        onClick={handleSendMessage}
        className={`${css.sendButton} ${
          isFlying ? css.animateIcon : ''
        } ${!message.trim() && !customSticker ? css.disabled : ''}`}
        disabled={!message.trim() && !customSticker}
        aria-label="Send message"
      >
        {inputFocused || message.trim() ? (
          <SendHorizontal />
        ) : (
          <span
            className={css.stickerContainer}
            dangerouslySetInnerHTML={{ __html: customSticker }}
          />
        )}
      </button>
    </div>
  );
};

export default MessageInput;
