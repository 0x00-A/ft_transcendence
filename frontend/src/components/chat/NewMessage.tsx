import { forwardRef } from 'react';
import css from './NewMessage.module.css';
import { SquarePen } from 'lucide-react';

interface NewMessageProps {
  onClick: () => void;
}

const NewMessage = forwardRef<HTMLDivElement, NewMessageProps>(
  ({ onClick }, ref) => {
    return (
      <div className={css.newMessage} onClick={onClick} ref={ref}>
        <SquarePen />
      </div>
    );
  }
);

export default NewMessage;
