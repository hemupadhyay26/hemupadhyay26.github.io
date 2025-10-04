import { useState, useEffect } from "react";

const Navbar = () => {
  const navigationLinks = ["About me", "Services", "Hem Upadhyay", "Portfolio", "Copy Email"];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const email = "hemupadhyay234@gmail.com";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <div
        className={`hidden sm:flex place-content-evenly items-center p-5 bg-transparent transition-all duration-300 ${
          isScrolled ? "bg-primary text-black" : ""
        }`}
      >
        {navigationLinks.map((link, index) => {
          if (link === "Hem Upadhyay") {
            return (
              <button
                key={index}
                className="font-bold text-3xl text-box mx-8"
                onClick={toggleMenu}
              >
                {link}
                <sup> ⓗ </sup>
              </button>
            );
          } else if (link === "Copy Email") {
            return (
              <button
                key={index}
                onClick={handleCopyEmail}
                className="text-primary group font-semibold"
              >
                {copied ? "Copied!" : "Copy Email"}
                <div className="bg-secondary h-[2px] w-0 group-hover:w-full transition-all duration-500"></div>
              </button>
            );
          } else {
            return (
              <a
                key={index}
                href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
                className="text-primary group"
              >
                {link}
                <div className="bg-secondary h-[2px] w-0 group-hover:w-full transition-all duration-500"></div>
              </a>
            );
          }
        })}
      </div>

      {/* Mobile Navbar */}
      <div className="sm:hidden flex justify-between items-center p-5 bg-box relative">
        <div
          className="text-2xl font-bold text-primary cursor-pointer"
          onClick={toggleMenu}
        >
          Hem Upadhyay <sup>ⓗ</sup>
        </div>
        <button
          className={`text-primary ${
            isMenuOpen ? "bg-secondary p-1 rounded" : ""
          }`}
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden bg-box px-6 flex flex-col overflow-hidden transition-all duration-700 ease-in-out ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ maxHeight: isMenuOpen ? "500px" : "0" }}
      >
        {navigationLinks.map((link, index) => {
          if (link === "Hem Upadhyay") return null;
          if (link === "Copy Email") {
            return (
              <button
                key={index}
                onClick={handleCopyEmail}
                className="text-primary py-2 text-left"
              >
                {copied ? "Copied!" : "Copy Email"}
              </button>
            );
          }
          return (
            <a
              key={index}
              href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
              className="text-primary py-2"
            >
              {link}
            </a>
          );
        })}
      </div>
    </>
  );
};

export default Navbar;
