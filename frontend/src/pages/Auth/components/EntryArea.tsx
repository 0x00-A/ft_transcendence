import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import css from "./EntryArea.module.css";
import UserIcon from "../assets/userIcon.svg";
import EmailIcon from "../assets/emailIcon.svg";
import PassIcon from "../assets/passIcon.svg";

const EntryArea = () => {
  return (
      <form className={css.entryArea}>
        <AuthInput type="text" pHolder="username" icon={UserIcon}/>
        <AuthInput type="email" pHolder="email" icon={EmailIcon}/>
        <AuthInput type="password" pHolder="password" icon={PassIcon}/>
        <AuthButton />
      </form>
  )
}

export default EntryArea
