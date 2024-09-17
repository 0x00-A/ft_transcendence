import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaPaperclip, FaSmile } from 'react-icons/fa';
import css from './MessageInput.module.css';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  customEmoji: string;
}

const MessageInput = ({ onSendMessage, customEmoji }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const buttonEmojiRef = useRef<HTMLButtonElement>(null);
  const [inputFocused, setInputFocused] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      onSendMessage(message);
      setMessage('');

      setIsFlying(true);
      setInputFocused(false);
      setTimeout(() => {
        setIsFlying(false);
      }, 500);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else if (customEmoji) {
      onSendMessage(customEmoji);
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
    const value = e.target.value;
    if (value) {
      setMessage(value);
      setInputFocused(true);
    }
  };
  // const handleInputFocus = () => {
  // };

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
          // onFocus={handleInputFocus}
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
        <button className={css.sendEmoji} onClick={handleSend}>
          <span>{customEmoji}</span>
        </button>
      )}
    </div>
  );
};

export default MessageInput;
