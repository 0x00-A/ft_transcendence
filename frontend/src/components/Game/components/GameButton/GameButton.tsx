import React, { PropsWithChildren } from 'react';
import css from './GameButton.module.css';

const GameButton = ({
  onClick,
  children,
}: PropsWithChildren<{ onClick: any }>) => {
  return (
    <button className={css.button} onClick={onClick}>
      {/* <span className={css.buttonKey}>(r)&nbsp;</span> */}
      {children}
    </button>
  );
};

export default GameButton;
