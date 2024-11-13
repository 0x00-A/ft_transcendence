import css from './OtpAuth.module.css'


const OtpAuth = () => {
  return (
    <div className={css.otpContainer}>
      <form action="" className={css.otpForm}>
        <h1>Email Verification</h1>
        <h3>We have sent a code to your email</h3>
        <input type="text" placeholder="Enter code" />
        <button>Submit</button>
        <p>didn't recieve code? </p>
        <button>Resend</button>
      </form>
    </div>
  )
}

export default OtpAuth
