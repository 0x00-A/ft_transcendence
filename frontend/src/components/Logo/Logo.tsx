import { Link } from 'react-router-dom';
import css from './Logo.module.css';
import LogoSVG from '/icons/logo.png';

function Logo({ style }: { style: string }) {
  return (
    <Link to="/" className={css.logo}>
      <img className={style} src={LogoSVG} alt="logo" />
    </Link>
  );
}

export default Logo;
