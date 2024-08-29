import React from 'react';
import css from './StatusSection.module.css';

interface StatusSectionProps {
  status: string;
}

const StatusSection: React.FC<StatusSectionProps> = ({ status }) => {
  return <p className={css.status}>{status}</p>;
};

export default StatusSection;
