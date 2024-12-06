import { useState, useRef, useEffect, useCallback } from 'react';
import css from './MessageInput.module.css';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { conversationProps } from '@/types/apiTypes';
import { useWebSocketChat } from '@/contexts/WebSocketChatProvider';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useUser } from '@/contexts/UserContext';
import { SendHorizontal, SmilePlus } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
  conversationData: conversationProps | null;
}

const MessageInput = ({
  conversationData,
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
  const { toggleBlockStatus } = useWebSocketChat();
  const { sendMessage } = useWebSocket();

  const handleEmojiClick = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
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

  const debouncedOnTyping = useCallback(
    debounce((isTyping: boolean) => {
      if (message.trim() &&isTyping && inputFocused ) {
        onTyping(true);
      } else {
        onTyping(false);
      }
    }, 1000),
    [onTyping, inputFocused]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    setInputFocused(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    if (newValue.trim()) {
      debouncedOnTyping(true);
    } else {
      debouncedOnTyping(false);
    }
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
    }
    setMessage('');
    setIsFlying(true);
    setInputFocused(false);
    onTyping(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current?.focus();
    }
    setTimeout(() => setIsFlying(false), 500);
  };

  const handleSendInvite = (username: string) => {
    sendMessage({
      event: 'game_invite',
      from: user?.username,
      to: username,
    });
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

        <div className={css.buttonAndSend}>
          <div className={css.EmojiAndInvite}>
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
              aria-label="Invite game"
              onClick={() => handleSendInvite(conversationData!.name)}
            >
              <img src="/icons/chat/inviteBlack.svg" alt="Invite" />
            </button>
        </div>
        <button
          onClick={handleSendMessage}
          className={`${css.sendButton} ${
            isFlying ? css.animateIcon : ''
          } ${!message.trim() ? css.disabled : ''}`}
          disabled={!message.trim()}
          aria-label="Send message"
        >
          <SendHorizontal />
        </button>
        </div>
      </div>

    </div>
  );
};

export default MessageInput;
