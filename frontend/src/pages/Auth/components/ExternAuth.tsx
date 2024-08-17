import css from "./ExternAuth.module.css";
import ExternAuthBtn from "./ExternAuthBtn";


const ExternAuth = () => {
  return (
    <div className={css.container}>
        <div className={css.or}><div/><p>OR</p><div/></div>
        <ExternAuthBtn icon="intra" btnText="Sign in with Intra"/>
        <ExternAuthBtn icon="google" btnText="Sign in with Google"/>
    </div>
    // <div>
    //   <div className={css.orSignup}>
    //        <div className={css.line}></div><p>Or SignUp with</p><div className={css.line}></div>
    //      </div>
    //      <div className={css.signGoogle}>
    //        <button>
    //          <IconContext.Provider value={{size: "2em"}}>
    //            <FcGoogle className={css.google}/>
    //          </ IconContext.Provider>
    //          SignUp with google
    //        </button>
    //      </div>
    //      <button
    //        SignUp with intra
    //      </button>
    //      <div>
    //        <p>Already have an account?</p>
    //        <button>Signin</button>
    //      </div>
    //    </div>
    //     <div className={css.modal}>
    //      <div className={css.imageBox}></div
    //      <div className={css.formBox}>
    //        <form action="">
    //          <div className={css.welcome}>
    //            <h1>Welcome</h1>
    //            <p>create your account and enjoy the game</p>
    //          </div>
    //          <div className={css.inputs}>
    //            <FaRegUser color='#f8f3e3' className={css.userIcon}/>
    //            <input type="text" name="" id="username" placeholder='username'/>
    //            <FaEnvelope color='#f8f3e3' className={css.emailIcon}/>
    //            <input type="text" id='email' placeholder='email' />
    //            <FaLock color='#f8f3e3' className={css.passIcon}/>
    //            <input type="text" id='password' placeholder='password' />
    //          </div>
    //        </form>
    //      </div>
    // </div>
  )
}


export default ExternAuth
