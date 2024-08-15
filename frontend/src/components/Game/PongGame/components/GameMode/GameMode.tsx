import { useState } from 'react';
import css from './GameMode.module.css';

const GameMode = ({
  title,
  desc,
  className = '',
}: {
  title: string;
  desc: string;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <li
      className={`${css.mode} ${className}`}
      onMouseEnter={() => setIsHovered((isHovered: boolean) => !isHovered)}
      onMouseLeave={() => setIsHovered((isHovered: boolean) => !isHovered)}
    >
      <p className={css.title}>{title}</p>
      {isHovered && <p className={css.info}>{desc}</p>}
    </li>
  );
};

export default GameMode;
