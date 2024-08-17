import css from "./AuthInput.module.css"

const AuthInput = ({ type, pHolder, icon } : {type:string, pHolder:string, icon:string}) => {
  return (
    <div className={css.inputContainer}>
      <img src={icon} alt="X"/>
      <input type={type} required placeholder={pHolder} className={css}/>
    </div>
  )
}

export default AuthInput
