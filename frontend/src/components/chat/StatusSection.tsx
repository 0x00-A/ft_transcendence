import React from 'react';
import css from './StatusSection.module.css';
import { conversationProps } from '@/types/apiTypes';


interface StatusSectionProps {
  status: conversationProps;
}

const StatusSection: React.FC<StatusSectionProps> = ({ status }) => {
  const renderUserStatus = () => {
    if (!status) return null;

    switch (status.status) {
      case true:
        return <p className={`${css.userStatus} ${css.online}`}>Active now</p>;
      case false:
        return (
          <p className={`${css.userStatus} ${css.offline}`}>
            Last seen at {status.last_seen}
          </p>
        );
    }
  };

  return <div className={css.status}>{renderUserStatus()}</div>;
};

export default StatusSection;
