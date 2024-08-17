import css from "./ExternAuthBtn.module.css";
import IntraLogo from "../assets/42Logo.svg";
import { FcGoogle } from "react-icons/fc";
import { IconContext } from "react-icons";

const ExternAuthBtn = ({icon, btnText} : {icon:string, btnText:string}) => {

  return (
    <button className={css.intraAuthBtn}>
      { icon === "intra" ? <img src={IntraLogo} alt="?"/> : 
        <IconContext.Provider value={{size: "2em"}}>
          <FcGoogle />
        </ IconContext.Provider>
      }
        <p>{btnText}</p>
    </button>
  )
}

export default ExternAuthBtn
