import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';
import logoWhite from '../../assets/images/logo/iphrdlogo.jpeg';

const Footer = () => {
  return (
    <footer className="bg-iphrd-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          
          {/* Organization Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img 
              src={logoWhite} 
              alt="IPHRD-Africa Logo" 
              className="h-12 w-auto mb-3"
            />
            <p className="text-white/90 text-sm leading-relaxed mb-3">
              International Centre for Peace, Human Rights & Development - Promoting human rights and peace-building across Africa.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/who-we-are" className="text-white/90 hover:text-white text-sm transition">Who We Are</Link></li>
              <li><Link to="/objectives" className="text-white/90 hover:text-white text-sm transition">Our Objectives</Link></li>
              <li><Link to="/vision-mission" className="text-white/90 hover:text-white text-sm transition">Vision & Mission</Link></li>
              <li><Link to="/team" className="text-white/90 hover:text-white text-sm transition">Our Team</Link></li>
              <li><Link to="/partners" className="text-white/90 hover:text-white text-sm transition">Our Partners</Link></li>
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3">Programmes</h3>
            <ul className="space-y-2">
              <li><Link to="/young-women-leaders" className="text-white/90 hover:text-white text-sm transition">Young Women Leaders</Link></li>
              <li><Link to="/young-african-peacemakers" className="text-white/90 hover:text-white text-sm transition">Peacemakers Project</Link></li>
              <li><Link to="/young-women-network" className="text-white/90 hover:text-white text-sm transition">Women Mediation Network</Link></li>
              <li><Link to="/young-citizens-journalist" className="text-white/90 hover:text-white text-sm transition">Citizens Journalist</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3">Contact Us</h3>
            <ul className="space-y-2 text-white/90 text-sm mb-4">
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>Elysee plaza, 3rd floor, Kilimani Road</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📧</span>
                <span className="break-all">info@iphrdafrica.org</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>+254 759-862-938</span>
              </li>
              <li className="flex items-center gap-2">
                <span>⏰</span>
                <span>Mon-Fri: 8AM - 5PM</span>
              </li>
            </ul>
          </div>

          {/* Complaints & Policies */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3">Complaints</h3>
            <ul className="space-y-2 text-white/90 text-sm">
              <li className="flex items-start gap-2">
                <span>📧</span>
                <span className="">communications@iphrdafrica.org</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link to="/donate" className="inline-block bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-white/40 transition w-full text-center">
                Support Our Work
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar - All in one line */}
        <div className="border-t border-white/30 mt-6 pt-4 text-center">
          <p className="text-white/80 text-sm">
            &copy; {new Date().getFullYear()} IPHRD-Africa. All rights reserved. Made with ❤️ by{' '}
            <a 
              href="https://www.linkedin.com/in/dennis-kemboi/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors duration-200 font-medium inline-flex items-center gap-1"
            >
              {/* <Linkedin className="w-3 h-3" /> */}
              Dennis Kemboi
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;