import { useState, useRef } from 'react';
import { FaPaperPlane, FaPaperclip, FaSmile } from 'react-icons/fa';
import css from './MessageInput.module.css';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFlying, setIsFlying] = useState(false); // To track animation state
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');

      // Trigger flying animation
      setIsFlying(true);
      setTimeout(() => {
        setIsFlying(false);
      }, 1000);
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.native);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setShowEmojiPicker(false);
  };

  return (
    <div className={css.messageInputWrapper}>
      {showEmojiPicker && (
        <div className={css.emojiPicker}>
          <Picker data={data} onEmojiSelect={handleEmojiClick} />
        </div>
      )}
      <div className={css.messageInputContainer}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Write a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={css.input}
        />
        <button
          className={css.buttonEmoji}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <FaSmile size={25} />
        </button>
        <button className={css.buttonClip}>
          <FaPaperclip size={25} />
        </button>
      </div>

      <button
        onClick={handleSend}
        className={`${css.sendButton} ${isFlying ? css.animateIcon : ''}`}
      >
        <FaPaperPlane size={25} />
      </button>
    </div>
  );
};

export default MessageInput;
