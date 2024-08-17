import css from "./AuthFooter.module.css";


const AuthFooter = ({status} : {status:string}) => {
  return (
    <div className={css.authFooter}>
        <p>{status}</p>
        <link rel="stylesheet" href=""/>
    </div>
  )
}

export default AuthFooter
