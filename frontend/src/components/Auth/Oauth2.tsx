// Styles
import css from "./Oauth2.module.css"
// Logos
import IntraLogo from "../../assets/42Logo.svg";
import { IconContext } from "react-icons";
import { FcGoogle } from "react-icons/fc";
import DiscordIcon from "../../assets/discordIcon.svg";
// API URL
import { API_OAUTH2_URL } from "../../api/apiConfig";

const Oauth2 = () => {

  console.log('==========', API_OAUTH2_URL, '==========');


  return (
    <div className={css.oauth2Container}>
      <div className={css.or}><div/><p>OR</p><div/></div>
      <div className={css.oauth2Buttons}>
        <button className={css.oauthBtn} type="submit" onClick={() => console.log('===========',API_OAUTH2_URL + "/intra/")}>
          <img src={IntraLogo} alt="?" className={css.oauth2Icon} />
        </button>
        <button className={css.oauthBtn} type="submit" onClick={() => window.location.href = API_OAUTH2_URL + "/google/"}>
          <IconContext.Provider value={{size: "2em"}}><FcGoogle className={css.oauth2Icon} /></ IconContext.Provider>
        </button>
        <button className={css.oauthBtn}type="submit" onClick={() => window.location.href = API_OAUTH2_URL + "/discord/"}>
          <img src={DiscordIcon} alt="?" className={css.oauth2Icon} />
        </button>
      </div>
    </div>
  )
}


export default Oauth2
