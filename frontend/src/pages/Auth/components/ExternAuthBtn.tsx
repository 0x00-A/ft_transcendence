import css from "./ExternAuthBtn.module.css";
import IntraLogo from "../assets/42Logo.svg";
import DiscordIcon from "../assets/discordIcon.svg";
import { FcGoogle } from "react-icons/fc";
import { IconContext } from "react-icons";
import { redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";

const oauth2 = async (url) => {
  // try {
    const response = await axios.get(
      url
    );
    return response.data
}

const ExternAuthBtn = ({icon, btnText} : {icon:string, btnText:string}) => {

  const handleClick = () => {
    const redirect_uri = encodeURIComponent('http://localhost:3000/oauth2/callback');
    const url = `http://localhost:8000/api/oauth2/${icon}?redirect_uri=${redirect_uri}`;
    window.location.href = url;
  }

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
