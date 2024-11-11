import { PropsWithChildren } from "react";
import css from "./AuthButton.module.css";

const AuthButton = ({children, className=''}: PropsWithChildren<{className: string}>) => {
  return (
    <button type="submit" className={`${css.authBtn} ${className}`}>
        {children}
    </button>
  )
}

export default AuthButton

