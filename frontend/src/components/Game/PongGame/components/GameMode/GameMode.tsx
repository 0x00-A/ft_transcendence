import { PropsWithChildren, useState } from 'react';
import css from './GameMode.module.css';

const GameMode = ({
  children,
  title,
  className = '',
}: PropsWithChildren<{ title: string; className?: string }>) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`${css.mode} ${className}`}
      onMouseEnter={() => setIsHovered((isHovered: boolean) => !isHovered)}
      onMouseLeave={() => setIsHovered((isHovered: boolean) => !isHovered)}
    >
      <p className={css.title}>{title}</p>
      {isHovered && <p className={css.info}>{children}</p>}
    </div>
  );
};

export default GameMode;
