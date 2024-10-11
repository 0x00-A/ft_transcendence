import { forwardRef } from 'react';
import css from './NewMessage.module.css';

interface NewMessageProps {
  onClick: () => void;
}

const NewMessage = forwardRef<HTMLDivElement, NewMessageProps>(
  ({ onClick }, ref) => {
    return (
      <div className={css.newMessage} onClick={onClick} ref={ref}>
        <img src="/icons/chat/newMessage.svg" alt="Options" />
      </div>
    );
  }
);

export default NewMessage;
