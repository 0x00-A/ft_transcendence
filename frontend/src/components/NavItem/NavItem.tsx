
const NavItem = ({ icon, text }: { icon: string; text: string }) => {
  return (<div className="navItem">
    <img src={icon} alt="" />
    <p>{text}</p>
  </div>
  )
}

export default NavItem