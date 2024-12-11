import { forwardRef } from 'react';
import css from './NewMessage.module.css';
import { MessageSquareDiff } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewMessageProps {
}

const NewMessage = forwardRef<HTMLDivElement, NewMessageProps>(
  ({}, ref) => {
    return (
      <Link to="/friends?view=add">
        <div className={css.newMessage} ref={ref}>
          <MessageSquareDiff size={30}/>
        </div>
      </Link>
    );
  }
);

export default NewMessage;
