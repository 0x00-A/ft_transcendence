import React from 'react';
import css from './StatusSection.module.css';
import { useSelectedConversation } from '@/contexts/SelectedConversationContext';


interface StatusSectionProps {
}

const StatusSection: React.FC<StatusSectionProps> = () => {

  const { selectedConversation } = useSelectedConversation();

  const renderUserStatus = () => {
    if (!selectedConversation) return null;

    switch (selectedConversation?.status) {
      case true:
        return <p className={`${css.userStatus} ${css.online}`}>Active now</p>;
      case false:
        return (
          <p className={`${css.userStatus} ${css.offline}`}>
            Last seen at {selectedConversation?.last_seen}
          </p>
        );
    }
  };

  return <div className={css.status}>{renderUserStatus()}</div>;
};

export default StatusSection;
