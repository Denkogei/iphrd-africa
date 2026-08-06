import { Link } from 'react-router-dom';

// Import Board Member Images
import sylviaImg from '../../assets/images/BOG/sylvia.jpg';
import susanImg from '../../assets/images/BOG/susan.jpeg';
import thomsonImg from '../../assets/images/BOG/muthama.jpg';
import jeffImg from '../../assets/images/BOG/jeff.jpeg';
import carolineImg from '../../assets/images/BOG/kendagor.jpg';

const BoardOfDirectors = () => {
  const boardMembers = [
    {
      name: "Sylvia Mundia",
      role: "Chair, Board of Directors",
      image: sylviaImg
    },
    {
      name: "Susan Wamalwa",
      role: "Secretary, Board of Directors",
      image: susanImg
    },
    {
      name: "Thomson Muthama",
      role: "Treasurer",
      image: thomsonImg
    },
    {
      name: "Jeff Murgor",
      role: "Member",
      image: jeffImg
    },
    {
      name: "Caroline Kendagor",
      role: "Member",
      image: carolineImg
    }
  ];

  return (
    <div>
      {/* Hero Section - Green Background */}
      <section className="bg-iphrd-green py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <span className="text-white text-xs font-medium">Our Leadership</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Board of Directors</h1>
          <div className="w-20 h-0.5 bg-white mx-auto"></div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 text-sm leading-relaxed text-center text-justify">
            IPHRD-Africa has a strong governance structure that is accountable with an independent Board of Directors consisting of seasoned experts in the various thematic areas implemented by the organization. The Board is tasked with providing strategic direction, policy guidance and professional support to the organization. It is the highest decision-making body of the organization and plays a key role in defining IPHRD-Africa's overall strategy. The Board comprises of the following members
          </p>
        </div>
      </section>

      {/* Board Members - Grid on Desktop, List on Mobile */}
      <section className="bg-gray-50 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Grid (3 columns) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boardMembers.map((member, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 bg-gray-100 shadow-sm">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <h3 className="text-base font-semibold text-gray-800 mb-2">{member.name}</h3>
                <span className="inline-block text-xs font-medium text-iphrd-green bg-iphrd-green/10 px-3 py-1 rounded-full">
                  {member.role}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile List */}
          <div className="md:hidden flex flex-col divide-y divide-gray-100">
            {boardMembers.map((member, index) => (
              <div key={index} className="flex gap-4 py-5">
                {/* Image */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 shadow-sm">
                    <img 
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">{member.name}</h3>
                  <span className="inline-block text-xs font-medium text-iphrd-green bg-iphrd-green/10 px-2 py-0.5 rounded-full">
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="bg-white py-8">
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-iphrd-green hover:text-iphrd-green/80 text-sm transition group"
          >
            <span className="group-hover:-translate-x-1 transition">←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BoardOfDirectors;