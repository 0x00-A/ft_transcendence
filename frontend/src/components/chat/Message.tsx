import React from 'react';
import css from './MessageArea.module.css';
import { spawn } from 'child_process';

interface MessageProps {
  name: string;
  content: string;
  sender: boolean;
  avatar: string;
  time: string;
}

const Message: React.FC<MessageProps> = ({
  content,
  sender,
  avatar,
  time,
  name,
}) => {
  return (
    <div
      className={`${css.messageWrapper} ${sender ? css.sender : css.receiver}`}
    >
      {!sender && <img src={avatar} alt="avatar" className={css.avatar} />}
      <div className={css.sideMessage}>
        <div className={css.nameAndTime}>
          {!sender ? <span>{name} • </span> : <span> • YOU</span>}
          <span className={css.time}>{time}</span>
        </div>

        <div className={css.messageBubble}>
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
