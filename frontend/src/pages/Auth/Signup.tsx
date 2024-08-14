// import React from 'react'
// import ReactDOM from 'react-dom/client';
import css from './Signup.module.css'
// import Welcome from './components/welcome/Welcome';
// import { IconContext } from 'react-icons';
// import { FaRegUser } from "react-icons/fa";
// import { MdOutlineMail } from "react-icons/md";
// import { MdOutlineLock } from "react-icons/md";
// import { FcGoogle } from "react-icons/fc";

// Components
import AuthHeader from "./components/AuthHeader";
import SignupForm from './components/SignupForm';


// const Input = ({type, label, icon, cssIcon}) => {
//   return (
//     <>
//       <IconContext.Provider value={{size: "2em"}}>
//         <div className={cssIcon}>
//           {icon}
//         </div>
//       </ IconContext.Provider>
//       <div className={css.inputArea}>
//         <input type={type} required placeholder={label}/>
//         {/* <div className={css.label}>{label}</div> */}
//       </div>
//     </>
//   )
// }

const Signup = () => {
  return (
    <div className={css.boxContainer}>
      <AuthHeader title='Welcome' description='Create you account and enjoy the game' />
      <SignupForm />
    </div>
  )
}
export default Signup

// const Signup = () => {
//   return (
//     <div className={css.boxContainer}>
//       <Welcome />
//       <div className={css.signupForm}>
//         <div className={css.entryArea}>
//           <Input type="text" label="Username" icon={<FaRegUser />} cssIcon={css.userIcon}/>
//           <Input type="email" label="Email" icon={<MdOutlineMail />} cssIcon={css.emailIcon}/>
//           <Input type="password" label="Password" icon={<MdOutlineLock />} cssIcon={css.passIcon}/>
//         </div>
//         <button className={css.signupBtn}>SignUp</button>
//         <div className={css.orSignup}>
//           <div className={css.line}></div><p>Or SignUp with</p><div className={css.line}></div>
//         </div>
//         <div className={css.signGoogle}>
//           <button>
//             <IconContext.Provider value={{size: "2em"}}>
//               <FcGoogle className={css.google}/>
//             </ IconContext.Provider>
//             SignUp with google
//           </button>
//         </div>
//         <button>

//           SignUp with intra
//         </button>
//         <div>
//           <p>Already have an account?</p>
//           <button>Signin</button>
//         </div>
//       </div>
//       {/* <div className={css.modal}>
//         <div className={css.imageBox}></div>

//         <div className={css.formBox}>
//           <form action="">
//             <div className={css.welcome}>
//               <h1>Welcome</h1>
//               <p>create your account and enjoy the game</p>
//             </div>
//             <div className={css.inputs}>
//               <FaRegUser color='#f8f3e3' className={css.userIcon}/>
//               <input type="text" name="" id="username" placeholder='username'/>
//               <FaEnvelope color='#f8f3e3' className={css.emailIcon}/>
//               <input type="text" id='email' placeholder='email' />
//               <FaLock color='#f8f3e3' className={css.passIcon}/>
//               <input type="text" id='password' placeholder='password' />
//             </div>
//           </form>
//         </div>
//       </div> */}
//     </div>
//   )
// }


