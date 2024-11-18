// MessageInput.tsx
import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaPaperclip, FaSmile } from 'react-icons/fa';
import css from './MessageInput.module.css';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  customSticker: string;
  isBlocked: boolean;
  onUnblock: () => void;
}

const MessageInput = ({
  onSendMessage,
  customSticker,
  isBlocked,
  onUnblock,
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const buttonEmojiRef = useRef<HTMLButtonElement>(null);

  const handleSend = () => {
    if (!message.trim() && !customSticker) return;
    
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    } else if (customSticker) {
      onSendMessage(customSticker);
    }

    setIsFlying(true);
    setInputFocused(false);
    setTimeout(() => {
      setIsFlying(false);
    }, 300);
    
    inputRef.current?.focus();
  };

  const handleEmojiClick = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
    if (inputRef.current) {
      setInputFocused(true);
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    if (!message.trim()) {
      setInputFocused(false);
    }
  };

  if (isBlocked) {
    return (
      <div className={css.messageBlock}>
        <h2>
          User is blocked
        </h2>
        <p>
          You can't message them in this chat, and you won't receive their
          messages.
        </p>
        <button className={css.buttonUnblock} onClick={onUnblock}>
          Unblock
        </button>
      </div>
    );
  }

  return (
    <div className={css.messageInputWrapper}>
      {showEmojiPicker && (
        <div ref={emojiRef} className={css.emojiPicker}>
          <Picker data={data} onEmojiSelect={handleEmojiClick} />
        </div>
      )}
      
      <div className={css.messageInputContainer}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Write a message"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          className={css.input}
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
        onClick={handleSend}
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