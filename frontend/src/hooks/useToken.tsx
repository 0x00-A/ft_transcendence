import { useEffect, useRef } from "react";
import { getToken } from "../utils/getToken";

const useToken = () => {
  const tokenRef = useRef(null);

  useEffect(() => {
    const fetchToken = async () => {
      tokenRef.current = await getToken();
    };

    fetchToken();
  }, []);

  return tokenRef.current;
};

export default useToken;
