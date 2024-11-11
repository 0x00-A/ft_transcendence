// Styles
import css from "./Oauth2.module.css"
// Logos
import IntraLogo from "../../assets/42Logo.svg";
import { IconContext } from "react-icons";
import { FcGoogle } from "react-icons/fc";
import DiscordIcon from "../../assets/discordIcon.svg";

const Oauth2 = () => {

  const handleClick = (button:string) => {
    const redirect_uri = encodeURIComponent('http://localhost:3000/oauth2/callback');
    const url = `http://localhost:8000/api/oauth2/${button}?redirect_uri=${redirect_uri}`;
    window.location.href = url;
  }

  return (
    <div className={css.oauth2Container}>
      <div className={css.or}><div/><p>OR</p><div/></div>
      <button className={css.oauthBtn} type="submit" onClick={() => handleClick("intra")}>
        <img src={IntraLogo} alt="?"/>
        <p>Sign in with Intra</p>
      </button>
      <button className={css.oauthBtn} type="submit" onClick={() => handleClick("google")}>
        <IconContext.Provider value={{size: "2em"}}><FcGoogle /></ IconContext.Provider>
        <p>Sign in with Google</p>
      </button>
      <button className={css.oauthBtn}type="submit" onClick={() => handleClick("discord")}>
        <img src={DiscordIcon} alt="?" />
        <p>Sign in with Discord</p>
      </button>
    </div>
  )
}


export default Oauth2
