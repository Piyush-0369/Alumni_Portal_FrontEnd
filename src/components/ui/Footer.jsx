const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-300 text-black py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left side */}
        <p className="text-sm">&copy; {new Date().getFullYear()} Your University Alumni Portal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
