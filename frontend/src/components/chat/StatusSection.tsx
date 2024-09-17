import React from 'react';
import css from './StatusSection.module.css';

interface Info {
  status: 'online' | 'offline' | 'typing';
  lastSeen?: string;
}

interface StatusSectionProps {
  status: Info;
}

const StatusSection: React.FC<StatusSectionProps> = ({ status }) => {
  const renderUserStatus = () => {
    if (!status) return null;

    switch (status.status) {
      case 'online':
        return <p className={`${css.userStatus} ${css.online}`}>Online</p>;
      case 'typing':
        return <p className={`${css.userStatus} ${css.typing}`}>Online</p>;
      case 'offline':
        return (
          <p className={`${css.userStatus} ${css.offline}`}>
            Last seen at {status.lastSeen}
          </p>
        );
    }
  };

  return <p className={css.status}>{renderUserStatus()}</p>;
};

export default StatusSection;
