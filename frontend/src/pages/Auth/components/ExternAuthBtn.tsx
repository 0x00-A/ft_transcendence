import css from "./ExternAuthBtn.module.css";
import IntraLogo from "../assets/42Logo.svg";
import DiscordIcon from "../assets/discordIcon.svg";
import { FcGoogle } from "react-icons/fc";
import { IconContext } from "react-icons";
import { redirect } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";


const ExternAuthBtn = ({icon, btnText} : {icon:string, btnText:string}) => {

  const handleClick = () => {
    // ev.preventDefault()
    const url = `http://localhost:8000/api/oauth2/${icon}/authorize/`
    console.log(url);
    window.location.href = url;
  }

  const {setIsLoggedIn} = useAuth()
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    // const refreshtoken = new URLSearchParams(window.location.search).get("token");
    if (token) {
      setIsLoggedIn(true);
      localStorage.setItem("access_token", token);
      // Navigate to your dashboard or main app screen after successful login
      window.location.href = "http://localhost:3000/";
    }
  }, []);

  return (
    <button type="submit" className={css.intraAuthBtn} onClick={handleClick}>
      { icon === "intra" && <img src={IntraLogo} alt="?"/>}
      { icon === "google" && <IconContext.Provider value={{size: "2em"}}>
          <FcGoogle />
        </ IconContext.Provider> }
      {/* { icon === "google" && <GoogleButton type="light" onClick={() => { console.log('Google button clicked') }} /> } */}
      { icon === "discord" && <img src={DiscordIcon} alt="?" />}
        <p>{btnText}</p>
    </button>
  )
}

export default ExternAuthBtn
