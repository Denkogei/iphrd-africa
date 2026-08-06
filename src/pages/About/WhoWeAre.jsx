import { Link } from 'react-router-dom';
import aboutVideo from '../../assets/videos/background.MOV';

const WhoWeAre = () => {
  return (
    <div>
      {/* Hero Section with Video Background */}
      <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Video Background - Fixed for mobile */}
        <div className="absolute inset-0 w-full h-full">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ 
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              perspective: 1000,
              WebkitTransform: 'translate3d(0,0,0)',
              transform: 'translate3d(0,0,0)',
              minHeight: '100%',
              minWidth: '100%'
            }}
          >
            <source src={aboutVideo} type="video/quicktime" />
            <source src={aboutVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-4">
            <span className="text-iphrd-green-400 text-xs font-medium">About IPHRD-Africa</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Who We Are</h1>
          <div className="w-16 md:w-20 h-0.5 bg-iphrd-green-400 mx-auto"></div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 lg:p-10">
            {/* Title */}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 md:mb-6 text-center">IPHRD-Africa</h2>
            <div className="w-10 md:w-12 h-0.5 bg-iphrd-green-500 mx-auto mb-6 md:mb-8"></div>
            
            <div className="space-y-4 md:space-y-5">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed text-justify">
                IPHRD-Africa is a registered non-profit organization in Kenya, operating as an NGO with a focus on promoting a human rights approach to governance and peace-building for sustainable development in Africa.
              </p>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed text-justify">
                The organization values justice, inclusivity, and active participation from all societal stakeholders, targeting various groups. Through activities like research, advocacy, and capacity building, IPHRD-Africa empowers communities to influence political, economic, and social decisions.
              </p>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed text-justify">
                Committed to collaboration and partnerships, the organization aims to contribute to Sustainable Development Goals, the African Union's Agenda 2063, and Kenya's Vision 2030. With a people-centered approach, it strives to transform socioeconomic structures, reduce poverty and violence, and promote human rights, justice, peace, and sustainable development in the region.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default WhoWeAre;