const Footer = () => {
  return (
    <footer className="relative py-6 text-center text-sm text-white 
                   bg-gradient-to-r from-emerald-600 to-amber-500 
                   border-t border-dashed border-emerald-300">
      <p className="max-w-7xl mx-auto px-4">
        © {new Date().getFullYear()} Alumni Portal. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
