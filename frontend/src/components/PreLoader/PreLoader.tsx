import { useEffect, useState } from 'react';
import css from './pong.module.css';

const PreLoader = () => {
  const [hidden, setHidden] = useState(false);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setHidden(true);
  //   }, 1500);
  // }, []);

  useEffect(() => {
    window.onload = () => {
      setHidden(true);
    };

    return () => {
      window.onload = null;
    };
  }, []);

  return (
    <>
      {!hidden && (
        <div
          className={css.preloader}
          style={{ display: hidden ? 'flex' : 'flex' }}
        >
          <div className={css.pong}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreLoader;
