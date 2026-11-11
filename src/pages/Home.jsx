import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FacebookPagePosts from '../components/FacebookPagePosts';

// Import SDG Images from assets
import sdg3 from '../assets/images/sdgs/3.png';
import sdg4 from '../assets/images/sdgs/4.jpg';
import sdg5 from '../assets/images/sdgs/5.jpg';
import sdg10 from '../assets/images/sdgs/10.jpg';
import sdg13 from '../assets/images/sdgs/13.jpg';
import sdg16 from '../assets/images/sdgs/16.jpg';
import sdg17 from '../assets/images/sdgs/17.jpg';

// Import Flag Images
import kenyaFlag from '../assets/images/flags/kenya.png';
import ethiopiaFlag from '../assets/images/flags/ethiopia.png';
import sudanFlag from '../assets/images/flags/sudan.jpg';
import southSudanFlag from '../assets/images/flags/ssudan.png';
import somaliaFlag from '../assets/images/flags/somalia.jpg';

// Import Program Images
import woman1 from '../assets/images/programs/woman1.jpg';
import woman2 from '../assets/images/programs/woman2.jpeg';
import woman3 from '../assets/images/programs/woman3.jpg';

// Import Supporting Initiative Images
import agenda2063 from '../assets/images/sdgs/agenda2063.png';
import sdgIcon from '../assets/images/sdgs/sdg.webp';
import kenyaVision from '../assets/images/sdgs/kenya.jpg';

// Import UN Image
import unImage from '../assets/images/flags/unscr.webp';

// Import Partner Images
import ncaLogo from '../assets/images/partners/nca.png';
import gizLogo from '../assets/images/partners/giz.jpg';
import fecclahaLogo from '../assets/images/partners/FECCLAHA.png';
import clingendealLogo from '../assets/images/partners/clingendael.png';
import IIP from '../assets/images/partners/IIP.jpg';
import activecitizen from '../assets/images/partners/activecitizen.jpeg';


// Import your hero images
import heroImage1 from '../assets/images/hero/hero1.jpg';
import heroImage2 from '../assets/images/hero/hero2.jpeg';
import heroImage3 from '../assets/images/hero/hero3.jpeg';
import heroImage4 from '../assets/images/hero/hero4.jpeg';
import heroImage5 from '../assets/images/hero/hero5.jpeg';
import heroImage6 from '../assets/images/hero/hero6.jpeg';
import heroImage7 from '../assets/images/hero/hero7.jpeg';
import heroImage8 from '../assets/images/hero/hero8.jpeg';
import heroImage9 from '../assets/images/hero/HeroImage9.jpg';
import heroImage10 from '../assets/images/hero/heroImage10.jpg';


 // Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  // Convert string with commas to number (e.g., "4,000" -> 4000)
  const parseValue = (value) => {
    if (typeof value === 'string') {
      return parseInt(value.replace(/,/g, ''), 10);
    }
    return value;
  };

  const numericEnd = parseValue(end);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const increment = numericEnd / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= numericEnd) {
              // Format the final number with commas
              setCount(end);
              clearInterval(timer);
            } else {
              // Format current number with commas
              const currentValue = Math.floor(start);
              setCount(currentValue.toLocaleString());
            }
          }, 16);
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [numericEnd, duration, hasAnimated, end]);

  return (
    <div ref={elementRef} className="text-2xl md:text-3xl font-bold text-[#ffffff] mb-1 group-hover:scale-105 transition break-words">
      {count}
    </div>
  );
};


const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: heroImage5,
      subtitle: "Women peace and security",
      ctaText: "Read More",
      ctaLink: "/young-african-peacemakers",
      ctaSecondary: "Be Involved",
      ctaSecondaryLink: "/volunteer",
      objectPosition: "center top"
    },
    {
      image: heroImage4,
      subtitle: "Community Development Dialogue & Social cohesion ",
      ctaText: "Read More",
      ctaLink: "/who-we-are",
      ctaSecondary: "Be Involved",
      ctaSecondaryLink: "/volunteer",
      objectPosition: "center 25%"
    },
    {
      image: heroImage6,
      subtitle: "Human- Rights Based Development Governance and Citizen Engagement",
      subtitleShort: "Rights-Based Governance & Citizen Engagement",
      ctaText: "Read More",
      ctaLink: "/objectives",
      ctaSecondary: "Be Involved",
      ctaSecondaryLink: "/volunteer",
      objectPosition: "center top"
    },
    {
      image: heroImage9,
      subtitle: "MOU signing with African Union Commission Department of Political Affairs, Peace and Security.",
      subtitleShort: "MOU Signing with the African Union Commission",
      ctaText: "Read More",
      ctaLink: "/vision-mission",
      ctaSecondary: "Be Involved",
      ctaSecondaryLink: "/volunteer",
      objectPosition: "center top"
    },
    {
      image: heroImage8,
      subtitle: "Mental Wellness and Psychosocial wellbeing",
      ctaText: "Read More",
      ctaLink: "/scope-programmes",
      ctaSecondary: "Be Involved",
      ctaSecondaryLink: "/volunteer",
      objectPosition: "center 25%"
    },
    {
      image: heroImage1,
      subtitle: "Empowering Young People as Agents of Peace",
      ctaText: "Read More",
      ctaLink: "/get-involved",
      ctaSecondary: "Be Involved",
      ctaSecondaryLink: "/volunteer",
      objectPosition: "center 25%"
    },
    {
      image: heroImage2,
      subtitle: "Strengthened Feminist Leadership and Activism",
      ctaText: "Read More",
      ctaLink: "/young-african-peacemakers",
      ctaSecondary: "Be Involved",
      ctaSecondaryLink: "/volunteer",
      objectPosition: "center 25%"
    },
    {
      image: heroImage3,
      subtitle: "Building Bridges Across Communities",
      ctaText: "Read More",
      ctaLink: "/young-women-network",
      ctaSecondary: "Be Involved",
      ctaSecondaryLink: "/volunteer",
      objectPosition: "center 25%"
    },
    {
      image: heroImage10,
      subtitle: "Receiving Intercultural inovation hub award",
      ctaText: "Read More",
      ctaLink: "/young-african-peacemakers",
      ctaSecondary: "Be Involved",
      ctaSecondaryLink: "/volunteer",
      objectPosition: "center top"
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative bg-iphrd-green overflow-hidden flex flex-col md:block md:min-h-[75vh]">
      <div className="relative h-[40vh] sm:h-[45vh] md:absolute md:inset-0 md:h-auto">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt="Hero"
              className="w-full h-full object-cover"
              style={{ objectPosition: slide.objectPosition }}
            />
            <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
          </div>
        ))}
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:absolute md:inset-x-0 md:bottom-0 md:py-10 lg:py-14">
        <div className="w-full max-w-3xl md:max-w-none mx-auto md:mx-0 md:ml-8 lg:ml-16 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight md:leading-none md:whitespace-nowrap drop-shadow-lg">
            {/* Mobile: full sentence */}
            <span className="md:hidden">{slides[currentSlide].subtitle}</span>
            {/* Desktop: short version if provided, otherwise full */}
            <span className="hidden md:inline">
              {slides[currentSlide].subtitleShort || slides[currentSlide].subtitle}
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mt-3 md:mt-4 justify-center md:justify-start">
            <Link
              to={slides[currentSlide].ctaLink}
              className="px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-iphrd-green text-white rounded-full font-semibold text-sm sm:text-base hover:bg-iphrd-green/80 transition-all inline-flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg hover:shadow-xl"
            >
              {slides[currentSlide].ctaText}
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to={slides[currentSlide].ctaSecondaryLink}
              className="px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-iphrd-green text-white rounded-full font-semibold text-sm sm:text-base hover:bg-iphrd-green/80 transition-all inline-flex items-center justify-center w-full sm:w-auto shadow-lg hover:shadow-xl"
            >
              {slides[currentSlide].ctaSecondary}
            </Link>
          </div>

          <div className="flex gap-1.5 sm:gap-2 justify-center md:justify-start mt-5 sm:mt-6 md:mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? 'w-4 sm:w-6 md:w-8 bg-white'
                    : 'w-1 sm:w-1.5 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-1.5 md:p-2 transition-all z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-1.5 md:p-2 transition-all z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
      </button>
    </section>
  );
};

const Home = () => {
  return (
    <div>
      <Hero />

{/* About Section - Green Background */}
<section className="py-8 md:py-12 relative overflow-hidden" style={{ backgroundColor: '#00721d' }}>
  {/* Decorative Background Elements */}
  <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl"></div>
  <div className="absolute bottom-0 left-0 w-64 h-64 md:w-80 md:h-80 bg-white/5 rounded-full blur-3xl"></div>

  <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
    {/* Header */}
    <div className="text-center mb-8 md:mb-12">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
        About IPHRD AFRICA
      </h2>
      <div className="w-16 h-0.5 bg-white/60 rounded-full mx-auto mt-3"></div>
    </div>

    <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">

      {/* Peace is built by the people closest to the conflict */}
      <div className="border-l-4 border-white/60 pl-4 md:pl-6">
        <h3 className="text-lg md:text-xl font-bold text-white mb-3">
          Peace is built by the people closest to the conflict.
        </h3>
        <p className="text-white font-semibold text-base md:text-lg mb-3">
          What we do
        </p>
        <p className="text-white/80 leading-relaxed text-sm md:text-base mb-4">
          IPHRD-Africa equips women and young people to prevent violence, mediate disputes, and shape the policies that keep their communities safe.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Link
            to="/donate"
            className="inline-flex items-center gap-2 px-5 py-2 bg-yellow-500 text-green-900 rounded-full font-bold text-xs md:text-sm hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span>Support Our Work</span>
          </Link>
          <Link
            to="/scope-programmes"
            className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 border border-white/30 text-white rounded-full font-semibold text-xs md:text-sm hover:bg-white/20 transition-all transform hover:-translate-y-0.5"
          >
            <span>See Our Impact</span>
          </Link>
        </div>

        <p className="text-white/80 leading-relaxed text-sm md:text-base">
          Across Africa, women and young people are among those most affected by conflict, yet they are often absent from the rooms where peace decisions are made. IPHRD-Africa changes that. We train, accompany, and amplify local leaders, connecting community-level peacebuilding to national and regional policy, so that peace is sustained rather than just negotiated.
        </p>
      </div>

      {/* Impact Snapshot */}
      <div className="border-l-4 border-white/60 pl-4 md:pl-6">
        <h3 className="text-lg md:text-xl font-bold text-white mb-3">
          Impact Snapshot
        </h3>
        <ul className="space-y-2 text-white/80 text-sm md:text-base">
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold mt-0.5">•</span>
            <span><span className="text-white font-semibold">5,000+</span> young people trained in mediation and peacebuilding</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold mt-0.5">•</span>
            <span><span className="text-white font-semibold">10</span> Intergenerational Forums on Mediation Convened</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold mt-0.5">•</span>
            <span><span className="text-white font-semibold">16</span> Policy and Advocacy engagements influenced</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold mt-0.5">•</span>
            <span><span className="text-white font-semibold">11</span> youth peace initiatives supported</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold mt-0.5">•</span>
            <span><span className="text-white font-semibold">3</span> International Forums on Mediation Convened</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold mt-0.5">•</span>
            <span><span className="text-white font-semibold">4</span> Countries supported in Elections Observation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold mt-0.5">•</span>
            <span><span className="text-white font-semibold">6</span> Young women deployed for Job shadowing</span>
          </li>
        </ul>
        <p className="text-white/80 leading-relaxed text-sm md:text-base mt-4">
          Every dollar invested in prevention protects lives, livelihoods, and futures. <span className="text-white font-semibold">Join us in building peace before conflict begins.</span>
        </p>
      </div>

    </div>

    {/* Learn More Button */}
    <div className="text-center mt-8 md:mt-10">
      <Link
        to="/who-we-are"
        className="inline-flex items-center gap-2 px-5 md:px-6 py-2 md:py-2.5 bg-white text-[#00721d] rounded-full font-semibold text-xs md:text-sm hover:bg-white/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <span>Learn More</span>
        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  </div>
</section>

     {/* Our Impact */}
<section className="py-12 md:py-16" style={{ backgroundColor: '#00721d' }}>
  <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
    <div className="text-center mb-8 md:mb-10">
      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-3">
        <span className="text-[#FFFFFF] text-md">📊</span>
        <span className="text-white text-xs font-medium tracking-wide">Our Achievements</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Our Impact</h2>
      <div className="w-16 h-0.5 bg-white/30 mx-auto mb-2"></div>
      <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">Making a meaningful difference across Africa through dedicated action</p>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {impactStats.map((stat, index) => (
        <div key={index} className="group relative bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all hover:-translate-y-1 border border-white/20">
          <div className="text-2xl md:text-3xl font-bold text-white">
            <AnimatedCounter end={stat.value} duration={2000} />
            {stat.suffix && <span className="text-xl md:text-2xl">{stat.suffix}</span>}
          </div>
          <div className="text-white/70 text-[11px] md:text-xs leading-tight mt-1">{stat.label}</div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition"></div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* SDG Commitment */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00721d]/20 to-[#00721d]/20 px-5 py-2 rounded-full mb-4">
              <span className="w-2 h-2 bg-[#00721d] rounded-full"></span>
              <span className="text-[#00721d] text-sm font-semibold tracking-wide">Global Goals</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-iphrd-blue mb-4">Our Commitment to Sustainable Development Goals</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#00721d] to-[#2E2F6F] mx-auto mb-5"></div>
            <p className="text-gray-600 text-base max-w-3xl mx-auto leading-relaxed">
              At IPHRD-Africa, we are dedicated to creating positive change and advancing global sustainability. 
              Our work aligns with the United Nations Sustainable Development Goals, driving progress towards a 
              better world for all.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-12">
            {sdgList.map((sdg, index) => (
              <div key={index} className="group bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="relative mb-3">
                  <img 
                    src={sdg.image}
                    alt={`SDG ${sdg.number}`}
                    className="w-full h-24 object-contain mx-auto group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="inline-block px-2 py-0.5 bg-[#00721d]/20 rounded-full mb-1">
                  <span className="text-xs font-bold text-[#00721d]">SDG {sdg.number}</span>
                </div>
                <p className="text-iphrd-blue text-xs font-medium leading-tight">{sdg.title}</p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#00721d]/20 transition group cursor-pointer">
              <img src={agenda2063} alt="Agenda 2063" className="w-12 h-12 object-contain group-hover:scale-110 transition duration-300" />
              <div>
                <p className="text-sm font-semibold text-iphrd-green">Agenda 2063</p>
                <p className="text-md text-iphrd-blue">Africa's Development Framework</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#00721d]/20 transition group cursor-pointer">
              <img src={sdgIcon} alt="Sustainable Development Goals" className="w-12 h-12 object-contain group-hover:scale-110 transition duration-300" />
              <div>
                <p className="text-sm font-semibold text-iphrd-green">Sustainable Development Goals</p>
                <p className="text-md text-iphrd-blue">UN Global Goals</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#00721d]/20 transition group cursor-pointer">
              <img src={kenyaVision} alt="Kenya Vision 2030" className="w-12 h-12 object-contain rounded-full group-hover:scale-110 transition duration-300" />
              <div>
                <p className="text-sm font-semibold text-iphrd-green">Kenya Vision 2030</p>
                <p className="text-md text-iphrd-blue">National Development Blueprint</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
  {/* Our Partners - Alternative Version */}
{/* Responsive grid: 2 cols on mobile, 3 on sm, 6 on md+ */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
  {partners.map((partner, index) => (
    <a 
      key={index}
      href={partner.website || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-3 sm:p-4 text-center flex flex-col items-center min-h-[130px] sm:min-h-[140px] justify-center"
    >
      <div className="w-full flex items-center justify-center mb-2" style={{ height: '70px' }}>
        <img 
          src={partner.image}
          alt={partner.name}
          style={{ 
            maxHeight: '60px', 
            maxWidth: '100%', 
            objectFit: 'contain',
            display: 'block'
          }}
          onError={(e) => {
            console.log('Error loading:', partner.name);
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" font-family="Arial" font-size="40" fill="%23999" text-anchor="middle" dy=".3em"%3E' + partner.name.charAt(0) + '%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>
      <div className="font-semibold text-gray-800 text-xs md:text-sm line-clamp-2 min-h-[32px]">
        {partner.name}
      </div>
    </a>
  ))}
</div>


{/* Testimonial Section - Wendy Aura */}
<section className="py-10 md:py-12 bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden">
  {/* Decorative Background Elements */}
  <div className="absolute top-0 left-0 w-64 h-64 bg-green-200/30 rounded-full blur-3xl"></div>
  <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl"></div>

  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

    {/* Section Header */}
    <div className="text-center mb-6 md:mb-8">
      <div className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full mb-2">
        <span className="text-xs font-semibold tracking-wider uppercase">Impact Story</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
        Voices of Change
      </h2>
      <div className="w-16 h-1 bg-green-600 rounded-full mx-auto mt-3"></div>
    </div>

    {/* Testimonial Card */}
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="grid md:grid-cols-5">

        {/* Left: Photo / Accent */}
        <div className="md:col-span-2 bg-gradient-to-br from-green-700 to-green-900 relative flex items-center justify-center p-6 min-h-[220px]">
          <svg className="absolute top-4 left-4 w-14 h-14 text-white/10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
          </svg>

          <div className="relative z-10 text-center">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-white text-3xl md:text-4xl font-bold">WA</span>
            </div>
            <p className="text-white font-bold text-base mt-3">Wendy Aura</p>
            <p className="text-white/70 text-xs">Kenya</p>
            <div className="w-8 h-0.5 bg-yellow-400 rounded-full mx-auto mt-2"></div>
          </div>
        </div>

        {/* Right: Story */}
        <div className="md:col-span-3 p-5 md:p-7 flex flex-col justify-center">
          <svg className="w-8 h-8 text-green-600 mb-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>

          <p className="text-gray-700 leading-snug text-sm mb-3">
            I started with the young women mediation training. Before the training, I never imagined myself as a peacebuilder. I actually thought that I must come from a 'terrorist-prone' area to talk about peace.
          </p>
          <p className="text-gray-700 leading-snug text-sm mb-3">
            Through the first training, I unlearned many things. I saw how conflicts happen even in the most basic units like home. I was able to see how my work relates to peacebuilding and since then, I developed serious interest in matters peace. I started my own research; dug deep into YPS and WPS.
          </p>
          <p className="text-gray-700 leading-snug text-sm mb-3">
            The first engagement with IPHRD-AFRICA was actually a turning point for me and since then, I've been called to engage in a youth policy process with UNDESA, where we developed a training manual on YPS for Nairobi county. Not to mention, engaging in other peace-related dialogues and activities convened by IPHRD.
          </p>
          <p className="text-gray-700 leading-snug text-sm mb-4">
            I have also gained confidence contributing to the peace agenda in any space. I'm currently a member of the Kenya Youth Peace and Security coalition. I'm forever grateful to IPHRD for unlocking a part of me that I didn't know about.
          </p>

          {/* Highlight Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
              Young Women Mediation
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
              YPS & WPS
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
              Kenya YPS Coalition
            </span>
          </div>
        </div>

      </div>
    </div>

  </div>
</section>
      
<section className="bg-gray-50 py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-10">
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ADCD7D]/20 to-[#2E2F6F]/20 px-5 py-2 rounded-full mb-4">
        <span className="w-2 h-2 bg-[#ADCD7D] rounded-full"></span>
        <span className="text-[#ADCD7D] text-sm font-semibold tracking-wide">Stay Connected</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Latest from Facebook</h2>
      <p className="text-gray-500 text-sm max-w-2xl mx-auto">
        Get the latest updates, news, and stories from IPHRD-Africa
      </p>
    </div>
    
    {/* Only our page posts - no Facebook app */}
    <FacebookPagePosts />
  </div>
</section>
    </div>
  );
};

const unscrs = [
  { title: "UNSCR 2250", description: "Resolution 2250 (2015) is the first Security Council resolution dedicated to youth, peace, and security, urging Member States to increase the inclusive representation of young people in decision-making at all levels related to peace and security. It recognizes the important and positive role that youth play in the maintenance and promotion of international peace and security. The resolution calls on all stakeholders to consider establishing mechanisms for young people to participate meaningfully in peace processes and conflict prevention.", image: unImage },
  { title: "UNSCR 2419", description: "Resolution 2419 (2018) focuses on the role of youth in conflict prevention and resolution, building on resolution 2250 (2015). It calls for inclusive representation of youth in peace processes and decision-making at all levels, recognizing that young people can play an important and positive role in sustaining peace. The resolution defines youth in this context as persons aged 18 to 29 years old and emphasizes the need to address factors that drive young people toward radicalization and violent extremism.", image: unImage },
  { title: "UNSCR 2535", description: "Resolution 2535 (2020) reaffirms the important and positive contribution of youth to the maintenance and promotion of peace and security, building on resolutions 2250 (2015) and 2419 (2018). It recognizes the role of young people in conflict prevention, resolution, and peacebuilding, and calls for their meaningful inclusion in these processes. The resolution emphasizes the need to protect young people from violence, recruitment by armed and terrorist groups, and to create opportunities for youth participation in decision-making at all levels.", image: unImage },
  { title: "UNSCR 2807", description: "Resolution 2807 (2025) urges greater youth participation and leadership in peace processes, conflict prevention, peacebuilding, recovery and reconstruction. It encourages Member States to adopt or strengthen national action plans on youth, peace and security.", image: unImage },
  { title: "UNSCR 1325", description: "Resolution 1325 (2000) is the landmark resolution on women, peace, and security, urging increased participation of women at all levels of decision-making in conflict prevention, resolution, and peace-building. The resolution calls on all parties to armed conflicts to take special measures to protect women and girls from gender-based violence, particularly rape and other forms of sexual abuse, and stresses the need to incorporate a gender perspective into peacekeeping operations. It also requests the Secretary-General to expand the role and contribution of women in UN field-based operations and to appoint more women as special representatives and envoys.", image: unImage }
];

const countryFlags = [
  { name: "Kenya", flagImage: kenyaFlag },
  { name: "Ethiopia", flagImage: ethiopiaFlag },
  { name: "Sudan", flagImage: sudanFlag },
  { name: "South Sudan", flagImage: southSudanFlag },
  { name: "Somalia", flagImage: somaliaFlag }
];

const programs = [
  {
    image: woman1,
    title: "Young Women Leaders Mediation Project",
    description: "Empowering young women with mediation skills and leadership opportunities across the region.",
    link: "/young-women-leaders",
    icon: "👩‍⚖️"
  },
  {
    image: heroImage1,
    title: "Young African Peace Makers Project",
    description: "Building a generation of peace-builders across the African continent through training and mentorship.",
    link: "/young-african-peacemakers",
    icon: "🕊️"
  },
  {
    image: woman3,
    title: "Young Women Mediation Network",
    description: "Connecting and supporting young women mediators across the region through networking and collaboration.",
    link: "https://ywm-network.iphrdafrica.org/",
    icon: "🤝"
  }
];

const impactStats = [
  { value: "5,000", label: "Direct Impact" },
  { value: "10", label: "Intergenerational Forums" },
  { value: "15", label: "Cohorts trained on Mediation, Negotiation and Dialogue" },
  { value: "900,000", label: "Estimated Indirect Reach" },
  { value: "6", label: "Job shadowing support for Young Women" },
  { value: "16", label: "Policy and Advocacy Initiatives" }
];

const features = [
  { icon: "🎯", title: "Holistic Approach", description: "We adopt a comprehensive and holistic approach by promoting a human rights perspective to governance and peace-building, addressing socioeconomic structures, and fostering unity." },
  { icon: "🤝", title: "Inclusivity and Diversity", description: "We value justice for all and actively target diverse groups, including women, men, youth, children, the aged, persons with special needs, and other minority communities." },
  { icon: "👥", title: "People-Centered Approach", description: "Recognizing the importance of successful structural prevention, we have adopted a people-centered approach based on participation, teamwork, and consultative processes." },
  { icon: "🗣️", title: "Stakeholder Participation", description: "We place a strong emphasis on the active participation of stakeholders at all levels of society, ensuring a broad and inclusive influence on political, economic, and social decisions." },
  { icon: "🌍", title: "Strategic Collaborations", description: "We actively seek to establish collaborations, partnerships, and networks at various levels, including grassroots, national, and international levels, enhancing our reach and impact." },
  { icon: "🎯", title: "Commitment to Sustainable Development Goals", description: "IPHRD-Africa is dedicated to supporting the achievement of Sustainable Development Goals, the African Union's Agenda 2063, and Kenya's Vision 2030, showcasing a commitment to broader global and national agendas." }
];

const partners = [
  { name: "Norwegian Church Aid", image: ncaLogo, placeholder: "🌐", website: "https://www.kirkensnodhjelp.no/en" },
  { name: "GIZ", image: gizLogo, placeholder: "🏛️", website: "https://www.giz.de/en/regions/africa" },
  { name: "FECCLAHA", image: fecclahaLogo, placeholder: "🤝", website: "https://fecclaha.org/" },
  { name: "Clingendeal", image: clingendealLogo, placeholder: "🌍", website: "https://www.clingendael.org/" },
  { name: "Initiative for Inclusive Peace", image: IIP, placeholder: "🌍", website: "https://www.initiativeforinclusivepeace.org/" },
  { name: "Active Citizen", image: activecitizen, placeholder: "👥" }
];

const sdgList = [
  { number: 3, title: "Good Health and Well-being", image: sdg3 },
  { number: 4, title: "Quality Education", image: sdg4 },
  { number: 5, title: "Gender Equality", image: sdg5 },
  { number: 10, title: "Reduced Inequalities", image: sdg10 },
  { number: 16, title: "Peace, Justice & Strong Institutions", image: sdg16 },
  { number: 13, title: "Climate Action", image: sdg13 },
  { number: 17, title: "Partnerships for the Goals", image: sdg17 }
];

export default Home;