import { useState, useEffect } from "react";

const Navbar = () => {
    const navigationLinks = ["About me", "Services", "Hem Upadhyay", "Portfolio", "Contact"];
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Track menu visibility
    const [isScrolled, setIsScrolled] = useState(false); // Track if the page is scrolled

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // Toggle the menu on hamburger click or Hem Upadhyay click

    // Detect scroll event and change navbar style
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true); // Change to true when the user scrolls
            } else {
                setIsScrolled(false); // Change to false when at the top
            }
        };

        window.addEventListener("scroll", handleScroll); // Add scroll event listener
        return () => {
            window.removeEventListener("scroll", handleScroll); // Clean up the event listener
        };
    }, []);

    return (
        <>
            {/* Desktop Navbar - visible on screens larger than 'sm' */}
            <div
                className={`hidden sm:flex place-content-evenly items-center p-5 bg-transparent transition-all duration-300 ${isScrolled ? "bg-primary text-black" : ""
                    }`}
            >
                {navigationLinks.map((link, index) => (
                    link === "Hem Upadhyay" ? (
                        <button
                            key={index}
                            className="font-bold text-3xl text-box mx-8"
                            onClick={toggleMenu}
                        >
                            {link}
                            <sup> ⓗ </sup>
                        </button>

                    ) : (
                        <a
                            key={index}
                            href={`#${link.toLowerCase().replace(/\s/g, '-')}`}
                            className="text-primary group"
                        >
                            {link}
                            <div className="bg-secondary h-[2px] w-0 group-hover:w-full transition-all duration-500"></div>
                        </a>
                    )
                ))}
            </div>

            {/* Mobile Navbar - visible on screens smaller than 'sm' */}
            <div className="sm:hidden flex justify-between items-center p-5 bg-box relative">
                {/* Hem Upadhyay link that also opens the menu on mobile */}
                <div
                    className="text-2xl font-bold text-primary sm:hidden cursor-pointer"
                    onClick={toggleMenu} // Opens the menu when clicked
                >
                    Hem Upadhyay <sup>ⓗ</sup>
                </div>
                {/* Hamburger Icon */}
                <button
                    className={`text-primary ${isMenuOpen ? "bg-secondary p-1 rounded" : ""}`}
                    onClick={toggleMenu} // Toggle the menu on hamburger click
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

            {/* Mobile Menu - displayed when isMenuOpen is true */}
            <div
                className={`sm:hidden bg-box px-6 flex flex-col overflow-hidden transition-all duration-700 ease-in-out ${isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"} `}
                style={{ maxHeight: isMenuOpen ? "500px" : "0" }} // Ensure the height transitions
            >
                {navigationLinks.map((link, index) => (
                    link === "Hem Upadhyay" ? null : (
                        <a
                            key={index}
                            href={`#${link.toLowerCase().replace(/\s/g, '-')}`}
                            className="text-primary py-2"
                        >
                            {link}
                        </a>
                    )
                ))}
            </div>
        </>
    );
};

export default Navbar;
