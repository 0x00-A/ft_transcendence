import { useState } from 'react';
import { FaPaperPlane, FaPaperclip, FaSmile } from 'react-icons/fa';
import css from './MessageInput.module.css';
import Lottie from 'react-lottie';
import animationData from './lottieflow-social-networks-16-9-000000-easey.json';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');

      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 3000);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
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
        {showAnimation ? (
          <Lottie options={defaultOptions} height={50} width={50} />
        ) : (
          <FaPaperPlane size={20} />
        )}
      </button>
    </div>
  );
};

export default MessageInput;
