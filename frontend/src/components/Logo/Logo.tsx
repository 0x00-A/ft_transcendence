import { useEffect, useState } from "react";

interface LogoProps {
  style: string;
}

function Logo({ style }: LogoProps) {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1264);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1264);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <img
      className={style}
      src={isLargeScreen ? "/logo/ft_pong.png" : "/logo/ft-pongLarge.png"}
      alt="logo"
    />
  );
}

export default Logo;
