import { NavLink } from 'react-router-dom'
import Logo from '../Logo/Logo'
import css from './Sidebar.module.css'
import { LuArrowLeftCircle } from "react-icons/lu";


export default function Sidebar() {
    return (
        <aside className={css.sidebar}>
            <nav className={css.nav}>
                <div>
                    <Logo />
                    <button>
                        <LuArrowLeftCircle />
                    </button>
                </div>
                <ul>
                    <li>
                        <NavLink to="/">
                        </NavLink>
                    </li>

                </ul>
            </nav>

        </aside>
    )
}
