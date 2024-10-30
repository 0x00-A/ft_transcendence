import css from "./ExternAuth.module.css";
import ExternAuthBtn from "./ExternAuthBtn";
import { GoogleLoginButton, DiscordLoginButton } from 'react-social-login-buttons'


const ExternAuth = () => {

  return (
    <div className={css.container}>
        <div className={css.or}><div/><p>OR</p><div/></div>
        <ExternAuthBtn icon="intra" btnText="Sign in with Intra" />
        <ExternAuthBtn icon="google" btnText="Sign in with Google" />
        <ExternAuthBtn icon="discord" btnText="Sign in with Discord" />
        {/* <GoogleLoginButton /> */}
        {/* <DiscordLoginButton /> */}
        {/* <GoogleButton type="light" onClick={() => { console.log('Google button clicked') }} /> */}
    </div>
  )
}


export default ExternAuth
