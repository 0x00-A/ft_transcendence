// Styles
import css from "./Oauth2.module.css"
// Logos
import IntraLogo from "../../assets/42Logo.svg";
import { IconContext } from "react-icons";
import { FcGoogle } from "react-icons/fc";
import DiscordIcon from "../../assets/discordIcon.svg";
// API URL
import {API_OAUTH2_URL} from "../../api/apiConfig";

const Oauth2 = () => {

  // const handleClick = (api:string) => {
  //   // const redirect_uri = encodeURIComponent('http://localhost:3000/oauth2/callback');
  //   const url = API_OAUTH2_URL + api;
  //   window.location.href = url;
  // }

  return (
    <div className={css.oauth2Container}>
      <div className={css.or}><div/><p>OR</p><div/></div>
      <button className={css.oauthBtn} type="submit" onClick={() => window.location.href = API_OAUTH2_URL + "/intra/"}>
        <img src={IntraLogo} alt="?"/>
        <p>Sign in with Intra</p>
      </button>
      <button className={css.oauthBtn} type="submit" onClick={() => window.location.href = API_OAUTH2_URL + "/google/"}>
        <IconContext.Provider value={{size: "2em"}}><FcGoogle /></ IconContext.Provider>
        <p>Sign in with Google</p>
      </button>
      <button className={css.oauthBtn}type="submit" onClick={() => window.location.href = API_OAUTH2_URL + "/discord/"}>
        <img src={DiscordIcon} alt="?" />
        <p>Sign in with Discord</p>
      </button>
    </div>
  )
}


export default Oauth2
