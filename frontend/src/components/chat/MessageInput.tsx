import { useState } from 'react';
import { FaPaperPlane, FaPaperclip, FaSmile } from 'react-icons/fa';
import css from './MessageInput.module.css';
import send from './lottieflow-social-networks-16-9-000000-easey.json';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className={css.messageInputWrapper}>
      <div className={css.messageInputContainer}>
        <input
          type="text"
          placeholder="Write a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={css.input}
        />
        <button
          className={css.button}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <FaSmile size={20} />
        </button>
        <button className={css.button}>
          <FaPaperclip size={20} />
        </button>
      </div>
      <button onClick={handleSend} className={css.sendButton}>
        <FaPaperPlane size={20} />
      </button>
    </div>
  );
};

export default MessageInput;
