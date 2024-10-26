import css from "./ExternAuthBtn.module.css";
import IntraLogo from "../assets/42Logo.svg";
import { FcGoogle } from "react-icons/fc";
import { IconContext } from "react-icons";
import { redirect } from "react-router-dom";
import axios from "axios";

const ExternAuthBtn = ({icon, btnText} : {icon:string, btnText:string}) => {

  const handleClick = (e) => {
    e.preventDefault()

    // window.location.href = 'http://localhost:8000/api/oauth2/intra/authorize/';
    // const res = redirect('http://localhost:8000/api/oauth2/intra/authorize/');
    // console.log(res);

  }

  return (
    <button className={css.intraAuthBtn} onClick={(ev) => handleClick}>
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
