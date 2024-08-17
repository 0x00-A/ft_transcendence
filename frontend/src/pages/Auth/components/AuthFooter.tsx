import { Link } from "react-router-dom";
import css from "./AuthFooter.module.css";


const AuthFooter = ({status} : {status:string}) => {
  return (
    <div className={css.authFooter}>
        <p>{status} <span><Link to={'/singin'}>Singin</Link></span></p>
    </div>
  )
}

export default AuthFooter
