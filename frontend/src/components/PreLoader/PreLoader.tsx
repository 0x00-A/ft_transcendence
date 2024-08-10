import { useEffect, useState } from "react";

import preLoaderSVG from '/preLoader.svg'
import styles from "./PreLoader.module.css";

const PreLoader = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHidden(true);
    }, 3000);
  }, []);
  return (
    <div
      className={styles.preloader}
      style={{ display: hidden ? "none" : "flex" }}
    >
      <img src={preLoaderSVG} alt="" />
    </div>
  );
};

export default PreLoader;
