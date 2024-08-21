import { useEffect, useState } from 'react';

const usePreLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const handleLoad = () => setLoading(false);
    const handleLoad = () => {
      const minimumDelay = 1000;
      const loadingEndTime = new Date().getTime() + minimumDelay;

      const timeout = setTimeout(
        () => {
          setLoading(false);
        },
        Math.max(0, loadingEndTime - new Date().getTime())
      );

      return () => clearTimeout(timeout);
    };

    window.addEventListener('load', handleLoad);

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  return loading;
};

export default usePreLoader;
