import { useEffect, useState } from 'react';
import css from './pong.module.css';

const PreLoader = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHidden(true);
    }, 3000);
  }, []);
  return (
    // <div
    //   className={styles.preloader}
    //   style={{ display: hidden ? "none" : "flex" }}
    // >
    //   <img src={preLoaderSVG} alt="" />
    // </div>
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
  );
};

export default PreLoader;
