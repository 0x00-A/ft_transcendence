import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaPaperclip, FaSmile } from 'react-icons/fa';
import css from './MessageInput.module.css';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessageInputProps {
  onSendMessage: (message: string, isSticker?: boolean) => void;
  customSticker: string;
}

const MessageInput = ({ onSendMessage, customSticker }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const buttonEmojiRef = useRef<HTMLButtonElement>(null);
  const [inputFocused, setInputFocused] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      // Send message as text
      onSendMessage(message, false);
      setMessage('');
    } else if (customSticker) {
      // Send sticker
      onSendMessage(customSticker, true);
    }

    setIsFlying(true);
    setInputFocused(false);
    setTimeout(() => {
      setIsFlying(false);
    }, 500);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleEmojiClick = (emoji: any) => {
    setMessage((prevMessage) => prevMessage + emoji.native);
    if (inputRef.current) {
      setInputFocused(true);
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
      setShowEmojiPicker(false);
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
        >
          <FaSmile size={25} />
        </button>
        <button className={css.buttonClip}>
          <FaPaperclip size={25} />
        </button>
      </div>

      {inputFocused ? (
        <button
          onClick={handleSend}
          className={`${css.sendButton} ${isFlying ? css.animateIcon : ''}`}
        >
          <FaPaperPlane size={25} />
        </button>
      ) : (
        <button className={css.sendSticker} onClick={handleSend}>
          <span dangerouslySetInnerHTML={{ __html: customSticker }} />
        </button>
      )}
    </div>
  );
};

export default MessageInput;
