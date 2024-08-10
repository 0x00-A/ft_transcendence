import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { LoadingBarContext } from "../hooks/LoadingBarContext";
import styles from "./NavBar.module.css";
import Logo from "./Logo/Logo";

const NavBar = () => {
  const loadingBarRef = useContext(LoadingBarContext);

  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        {/* <li>
        <NavLink to="/product">Product</NavLink>
      </li>
      <li>
        <NavLink to="/pricing">Pricing</NavLink>
      </li> */}
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
