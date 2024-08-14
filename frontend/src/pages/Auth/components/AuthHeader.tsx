import css from "./AuthHeader.module.css"

const AuthHeader = ({ title, description } : {title:string, description:string}) => {
  return (
    <div className={css.authHeader}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}

export default AuthHeader
