import React from 'react';
import css from './StatusSection.module.css';

interface Info {
  status: boolean;
  time?: string;
}

interface StatusSectionProps {
  status: Info;
}

const StatusSection: React.FC<StatusSectionProps> = ({ status }) => {
  const renderUserStatus = () => {
    if (!status) return null;

    switch (status.status) {
      case true:
        return <p className={`${css.userStatus} ${css.online}`}>Online</p>;
      case false:
        return (
          <p className={`${css.userStatus} ${css.offline}`}>
            Last seen at {status.time}
          </p>
        );
      default:
    }
  };

  return <div className={css.status}>{renderUserStatus()}</div>;
};

export default StatusSection;
