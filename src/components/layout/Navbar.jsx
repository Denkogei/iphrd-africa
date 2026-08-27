// Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Mail, Phone, Facebook, Twitter, Linkedin, Youtube, Instagram } from 'lucide-react';
import logo from '../../assets/images/logo/iphrdlogo.jpeg';

// ============================================
// SOCIAL MEDIA LINKS 
// ============================================
const SOCIAL_LINKS = [
  { icon: Facebook, href: "https://www.facebook.com/IPHRDAFRICA/", label: "Facebook" },
  { icon: Twitter, href: "https://x.com/iphrdafrica", label: "Twitter" },
  { icon: Linkedin, href: "https://ke.linkedin.com/company/international-centre-for-peace-human-rights-and-development-iphrd-africa", label: "LinkedIn" },
  { icon: Youtube, href: "https://www.youtube.com/@iphrd-africa5293", label: "YouTube" },
  { icon: Instagram, href: "https://www.instagram.com/iphrdafrica/", label: "Instagram" }
];

// ============================================
// CONTACT INFO - UPDATE THESE ONLY
// ============================================
const CONTACT = {
  email: "info@iphrdafrica.org",
  phone: "+254 759-862-938"
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});
  const mobileMenuRef = useRef(null);
  const isMobile = useRef(window.innerWidth < 768);
  const hoverTimeout = useRef(null);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      isMobile.current = window.innerWidth < 768;
      if (!isMobile.current) {
        setIsMenuOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile.current && isMenuOpen && mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) &&
          !event.target.closest('button[aria-label="menu"]')) {
        setIsMenuOpen(false);
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMobileDropdown = (dropdownName, e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const closeMobileMenu = (e) => {
    if (e) e.stopPropagation();
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const dropdowns = {
    about: {
      title: "About us",
      links: [
        { name: "Who We Are", path: "/who-we-are" },
        { name: "Our Objectives", path: "/objectives" },
        { name: "Board of Directors", path: "/board" },
        { name: "Vision, Mission & Core Values", path: "/vision-mission" },
        { name: "Our Team", path: "/team" },
        { name: "Our Partners", path: "/partners" }
      ]
    },
    programmes: {
      title: "Our Programmes",
      links: [
        { name: "Scope, Programmes & Projects", path: "/scope-programmes" },
        { name: "Young Women Mediation Network", path: "https://ywm-network.iphrdafrica.org/", external: true },
        { name: "Young African Peacemakers Project", path: "/young-african-peacemakers" },
        { name: "Young Citizens Journalist Project", path: "/young-citizens-journalist" },
        { name: "Young Women Leaders Mediation Programme", path: "/young-women-leaders-mediation" },
      ]
    },
    getInvolved: {
      title: "Get Involved",
      links: [
        { name: "Vacancies", path: "/opportunities" },
        { name: "Volunteer with Us", path: "/volunteer" },
        { name: "Internship", path: "/internship" },
      ]
    },
    engagements: {
      title: "Our Engagements",
      links: [
        { name: "Global", path: "/engagements/global" },
        { name: "Regional", path: "/engagements/regional" },
        { name: "National", path: "/engagements/national" },
        { name: "Community", path: "/engagements/community" },
      ]
    }
  };

  const navLinks = [
    { name: "Home", path: "/", hasDropdown: false },
    { name: "About us", hasDropdown: true, dropdownKey: "about" },
    { name: "Our Programmes", hasDropdown: true, dropdownKey: "programmes" },
    { name: "Get Involved", hasDropdown: true, dropdownKey: "getInvolved" },
    { name: "Engagements", hasDropdown: true, dropdownKey: "engagements" },
    { name: "News", path: "/media/news", hasDropdown: false },
    { name: "Gallery", path: "/media/gallery", hasDropdown: false }, 
    { name: "Our Events", path: "/media/our-events", hasDropdown: false },
    { name: "Blogs", path: "/media/blog", hasDropdown: false },
    { name: "Complaints", path: "/complaints", hasDropdown: false },
    { name: "Contacts", path: "/contacts", hasDropdown: false }
  ];

  // Desktop dropdown handlers with delay
  const handleMouseEnter = (dropdownKey) => {
    if (!isMobile.current) {
      // Clear any pending close timeout
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
        hoverTimeout.current = null;
      }
      setOpenDropdown(dropdownKey);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile.current) {
      // Add a small delay before closing to allow moving to dropdown
      hoverTimeout.current = setTimeout(() => {
        setOpenDropdown(null);
      }, 150);
    }
  };

  const handleDropdownMouseEnter = () => {
    // Clear the close timeout when entering the dropdown
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    // Close dropdown when leaving
    hoverTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  return (
    <>
      {/* Top Strip - Always visible on all screen sizes */}
      <div className="bg-green-700 text-white py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-1.5 sm:gap-2 hover:text-green-200 transition-colors">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{CONTACT.email}</span>
            </a>
            <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-1.5 sm:gap-2 hover:text-green-200 transition-colors">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{CONTACT.phone}</span>
            </a>
          </div>

          {/* Right: Social Media & Donate */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {SOCIAL_LINKS.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white hover:bg-white/20 p-1 sm:p-1.5 rounded-full transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              ))}
            </div>
            <div className="h-4 sm:h-6 w-px bg-white/30"></div>
            <Link
              to="/donate"
              className="bg-yellow-500 text-green-900 px-3 sm:px-5 py-0.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold hover:bg-yellow-400 transition-colors shadow-md whitespace-nowrap"
            >
              Donate
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" onClick={closeMobileMenu} className="flex items-center">
                <img 
                  src={logo} 
                  alt="IPHRD-Africa Logo" 
                  className="h-10 md:h-12 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <div 
                  key={link.name} 
                  className="relative"
                  ref={el => dropdownRefs.current[link.dropdownKey] = el}
                  onMouseEnter={() => link.hasDropdown && handleMouseEnter(link.dropdownKey)}
                  onMouseLeave={handleMouseLeave}
                >
                  {link.hasDropdown ? (
                    <div>
                      <button
                        className="flex items-center text-gray-700 hover:text-green-700 px-2 lg:px-2.5 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        {link.name}
                        <ChevronDown className={`ml-0.5 h-3 w-3 transition-transform duration-200 ${openDropdown === link.dropdownKey ? 'rotate-180' : ''}`} />
                      </button>
                      {openDropdown === link.dropdownKey && (
                        <div 
                          className="absolute top-full left-0 mt-0 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200"
                          onMouseEnter={handleDropdownMouseEnter}
                          onMouseLeave={handleDropdownMouseLeave}
                        >
                          {dropdowns[link.dropdownKey].links.map((subLink) => (
                            subLink.external ? (
                              <a
                                key={subLink.name}
                                href={subLink.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-green-700 transition-colors"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {subLink.name}
                              </a>
                            ) : (
                              <Link
                                key={subLink.name}
                                to={subLink.path}
                                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-green-700 transition-colors"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {subLink.name}
                              </Link>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-gray-700 hover:text-green-700 px-2 lg:px-2.5 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors whitespace-nowrap"
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-green-700 focus:outline-none"
                aria-label="menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div 
              ref={mobileMenuRef}
              className="md:hidden pb-4 bg-white"
              style={{ position: 'relative', zIndex: 9999 }}
            >
              {navLinks.map((link) => (
                <div key={link.name} className="border-b border-gray-100 last:border-0">
                  {link.hasDropdown ? (
                    <div>
                      <button
                        onClick={(e) => toggleMobileDropdown(link.dropdownKey, e)}
                        className="flex items-center justify-between w-full text-gray-700 hover:text-green-700 px-3 py-3 rounded-md text-base font-medium"
                        style={{ touchAction: 'manipulation' }}
                      >
                        <span>{link.name}</span>
                        <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${openDropdown === link.dropdownKey ? 'rotate-180' : ''}`} />
                      </button>
                      {openDropdown === link.dropdownKey && (
                        <div className="pl-4 bg-gray-50">
                          {dropdowns[link.dropdownKey].links.map((subLink) => (
                            <div key={subLink.name} className="border-t border-gray-100 first:border-t-0">
                              {subLink.external ? (
                                <a
                                  href={subLink.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-3 py-3 text-sm text-gray-700 hover:text-green-700 hover:bg-gray-100"
                                  onClick={closeMobileMenu}
                                  style={{ touchAction: 'manipulation' }}
                                >
                                  {subLink.name}
                                </a>
                              ) : (
                                <Link
                                  to={subLink.path}
                                  className="block px-3 py-3 text-sm text-gray-700 hover:text-green-700 hover:bg-gray-100"
                                  onClick={closeMobileMenu}
                                  style={{ touchAction: 'manipulation' }}
                                >
                                  {subLink.name}
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className="block text-gray-700 hover:text-green-700 px-3 py-3 rounded-md text-base font-medium"
                      onClick={closeMobileMenu}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;