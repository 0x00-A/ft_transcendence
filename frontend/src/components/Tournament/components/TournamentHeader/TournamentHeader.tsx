import React, { PropsWithChildren } from 'react';
import css from './TournamentHeader.module.css';

function Round({ children }: PropsWithChildren) {
  return (
    <div className={css.round}>
      <p className={css.roundLabel}>{children}</p>
    </div>
  );
}

const TournamentHeader = () => {
  return (
    <div className={css.rounds}>
      <Round>Round 1</Round>
      {/* <Round>Semifinals</Round> */}
      <Round>Finals</Round>
    </div>
  );
};

export default TournamentHeader;
