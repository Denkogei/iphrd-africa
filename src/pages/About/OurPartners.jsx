// Corrected import paths - make sure these files exist
import ncaLogo from '../../assets/images/partners/nca.png';
import gizLogo from '../../assets/images/partners/giz.jpg';
import fecclahaLogo from '../../assets/images/partners/FECCLAHA.png';
import clingendealLogo from '../../assets/images/partners/clingendael.png';
import IIP from '../../assets/images/partners/IIP.jpg';
import activecitizen from '../../assets/images/partners/activecitizen.jpeg';

const OurPartners = () => {
  const partners = [
    { 
      name: "Norwegian Church Aid", 
      image: ncaLogo, 
      placeholder: "🌐",
      website: "https://www.kirkensnodhjelp.no/en"
    },
    { 
      name: "GIZ", 
      image: gizLogo, 
      placeholder: "🏛️",
      website: "https://www.giz.de/en/regions/africa"
    },
    { 
      name: "FECCLAHA", 
      image: fecclahaLogo, 
      placeholder: "🤝",
      website: "https://fecclaha.org/"
    },
    { 
      name: "Clingendael", 
      image: clingendealLogo, 
      placeholder: "🌍",
      website: "https://www.clingendael.org/"
    },
    { 
      name: "Initiative for Inclusive Peace", 
      image: IIP, 
      placeholder: "🌍",
      website: "https://www.initiativeforinclusivepeace.org/"
    },
    { 
      name: "Active Citizen", 
      image: activecitizen, 
      placeholder: "🤝",
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-iphrd-green py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-5">
            <span className="text-white text-xs font-medium">Collaboration & Networks</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Partnerships</h1>
          <div className="w-20 h-0.5 bg-white mx-auto"></div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-10">
            <p className="text-gray-700 text-base md:text-lg leading-relaxed text-center">
              IPHRD-Africa seeks to implement programmes which are aimed at empowering the poor and marginalized communities, often affected by conflict and violence, working towards sustainable peace and development. These programmes are implemented both directly and indirectly in partnership with other like-minded partners. IPHRD-Africa seeks to engage in productive performance related partnerships with other strategic organizations and institutions at community, national and international levels. IPHRD-Africa also works with individuals, and intends to form alliances with the government bodies and other non-state local, national and international partners working towards sustainable peace and development through a human rights based approach.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Grid - Responsive */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-iphrd-green/10 px-5 py-2 rounded-full mb-4">
              <span className="w-2 h-2 bg-iphrd-green rounded-full"></span>
              <span className="text-iphrd-green text-sm font-semibold tracking-wide">Our Network</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Our Partners in Impact</h2>
            <div className="w-20 h-1 bg-iphrd-green mx-auto mb-4"></div>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              Collaborating for Change. Together, we're making a difference worldwide.
            </p>
          </div>
          
          {/* Responsive grid: 2 on mobile, 3 on tablet, 6 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {partners.map((partner, index) => (
              <a 
                key={index}
                href={partner.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center cursor-pointer hover:-translate-y-1"
              >
                <div className="h-20 sm:h-24 flex items-center justify-center mb-3 transition duration-300">
                  {partner.image ? (
                    <img 
                      src={partner.image}
                      alt={partner.name}
                      className="max-h-16 sm:max-h-20 max-w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        if (parent && !parent.querySelector('.placeholder-icon')) {
                          const span = document.createElement('span');
                          span.className = 'text-4xl placeholder-icon';
                          span.textContent = partner.placeholder || '🤝';
                          parent.appendChild(span);
                        }
                      }}
                    />
                  ) : (
                    <span className="text-4xl">{partner.placeholder || '🤝'}</span>
                  )}
                </div>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm group-hover:text-iphrd-green transition leading-snug">
                  {partner.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurPartners;