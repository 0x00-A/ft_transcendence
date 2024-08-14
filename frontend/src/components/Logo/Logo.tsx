import { NavLink } from 'react-router-dom';
import css from './Logo.module.css';
import LogoSVG from '/icons/rachidLogo.svg';

function Logo({ style }: { style: string }) {
  // return (
  //   <NavLink to="/" className={css.logo}>
  //     <img className={style} src={LogoSVG} alt="logo" />
  //   </NavLink>
  // );
  return <img className={style} src={LogoSVG} alt="logo" />;
}

export default Logo;
