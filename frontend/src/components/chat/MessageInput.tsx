import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaPaperclip, FaSmile } from 'react-icons/fa';
import css from './MessageInput.module.css';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessageInputProps {
  customSticker: string;
  isBlocked: boolean;
  onUnblock: () => void;
  onSendMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
}

const MessageInput = ({
  customSticker,
  isBlocked,
  onUnblock,
  onSendMessage,
  onTyping,
  
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const buttonEmojiRef = useRef<HTMLButtonElement>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setInputFocused(true);
    // setTimeout(() => {
    //   onTyping(!!e.target.value.trim());
    // }, 1000);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout that will trigger onTyping(false) after 5 seconds
    const newTimeout = setTimeout(() => {
      onTyping(false); // Set typing to false after 5 seconds
    }, 5000); // 5000ms = 5 seconds

    setTypingTimeout(newTimeout);

    // Indicate that the user is typing
    onTyping(true);


    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleInputBlur = () => {
    if (!message.trim()) {
      setInputFocused(false);
    }
  };

  if (isBlocked) {
    return (
      <div className={css.messageBlock}>
        <h2>User is blocked</h2>
        <p>You can't message them in this chat, and you won't receive their messages.</p>
        <button className={css.buttonUnblock} onClick={onUnblock}>
          Unblock
        </button>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
    }
    else if (customSticker) {
      onSendMessage(customSticker);
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
          <FaSmile size={22} />
        </button>

        <button
          className={css.buttonClip}
          aria-label="Attach file"
        >
          <FaPaperclip size={22} />
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
          <FaPaperPlane size={22} />
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