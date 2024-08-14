import css from "./SignupForm.module.css"

const SignupForm = () => {
  return (
    <div className={css.signupForm}>
        <EntryArea>
            <AuthInput />
        </EntryArea>

        <ValidateErea />
        {/* <Input type="text" label="Username" icon={<FaRegUser />} cssIcon={css.userIcon}/>
        <Input type="email" label="Email" icon={<MdOutlineMail />} cssIcon={css.emailIcon}/>
        <Input type="password" label="Password" icon={<MdOutlineLock />} cssIcon={css.passIcon}/>
         <button className={css.signupBtn}>SignUp</button> */}
        {/* <div className={css.orSignup}> */}
        {/* <div className={css.line}></div><p>Or SignUp with</p><div className={css.line}></div> */}
    </div>
  )
}

export default SignupForm
