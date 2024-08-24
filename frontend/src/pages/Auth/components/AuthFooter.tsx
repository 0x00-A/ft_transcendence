import { Link, redirect } from "react-router-dom";
import css from "./AuthFooter.module.css";
import { useState } from "react";


const AuthFooter = ({status, link} : {status:string, link:string}) => {

  const [clicked, setClicked] = useState(false);

  return (
    <div className={`${css.authFooter} ${clicked} ? ${css.authSwitch} : ''}`}>
        {/* <p>{status}<span><Link to={link}>{link}</Link></span></p> */}
        <p>{status}</p>
        <button onClick={() => {setClicked(true)}}>{link}</button>
    </div>
  )
}

export default AuthFooter
