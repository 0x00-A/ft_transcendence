const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="h-12 pb-2  w-full mt-4">
      <div className="text-center text-lg text-gray-400">
        © {currentYear} ft_transcendence. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;