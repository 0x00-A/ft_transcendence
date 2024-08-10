import { Link } from "react-router-dom";
import css from "./Logo.module.css";
import LogoSVG from '/icons/logo.svg'

function Logo() {
  return (
    <Link to="/" className={css.logo}>
      <img src={LogoSVG} alt="logo" />
    </Link>
  );
}

export default Logo;
