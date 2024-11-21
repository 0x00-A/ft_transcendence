const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="h-16 pb-4  w-full ">
      <div className="text-center text-[15px] text-gray-400">
        © {currentYear} ft_transcendence. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;