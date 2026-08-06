import { Link } from 'react-router-dom';

const VisionMission = () => {
  const coreValues = [
    { title: "Gender Equality", description: "Promoting equal rights and opportunities for all genders in our work and communities.", icon: "⚖️" },
    { title: "Integrity", description: "Upholding honesty, transparency, and ethical conduct in all our endeavors.", icon: "💎" },
    { title: "Professionalism", description: "Maintaining the highest standards of excellence and competence in our work.", icon: "🎯" },
    { title: "Respect", description: "Valuing diverse perspectives and treating all individuals with dignity and respect.", icon: "🤝" },
    { title: "Transparency", description: "Operating with openness, accountability, and clear communication.", icon: "🔍" }
  ];

  const principles = [
    "Commitment to continuous organizational learning, ensuring the ongoing professional development of staff capacity and of absorbing lessons gathered from all aspects of our work and the work of others",
    "The promotion of local ownership and national capacity building to ensure sustainable processes",
    "Consultative, Participatory and inclusive",
    "Learning and knowledge-based approach",
    "Balanced approach to gender, diversity, culture and age",
    "Respect for local culture and belief in the power of local capacities, ideas and solutions"
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-iphrd-green py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Vision, Mission & Values</h1>
          <div className="w-20 h-0.5 bg-white/60 mx-auto"></div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-iphrd-green/10 rounded-xl flex items-center justify-center mb-5">
                <span className="text-3xl">👁️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h2>
              <div className="w-12 h-0.5 bg-iphrd-green mb-5"></div>
              <p className="text-gray-600 leading-relaxed text-justify">
                To contribute to peaceful coexistence of all groups within the communities through promotion of human rights based approach for sustainable peace and development.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-iphrd-green/10 rounded-xl flex items-center justify-center mb-5">
                <span className="text-3xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
              <div className="w-12 h-0.5 bg-iphrd-green mb-5"></div>
              <p className="text-gray-600 leading-relaxed text-justify">
                To be a Centre of Excellence in enhancing and promoting social cohesion, conflict prevention, resolution and management, building sustainable peace and in establishing a conducive environment for achieving sustainable development through a human rights based approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values & Principles - Side by Side */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            
            {/* Left Column - Core Values */}
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Core Values</h2>
                <div className="w-12 h-0.5 bg-iphrd-green mx-auto"></div>
              </div>
              <div className="space-y-4">
                {coreValues.map((value, index) => (
                  <div key={index} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-iphrd-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">{value.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">{value.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed text-justify">{value.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Principles */}
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Guiding Principles</h2>
                <div className="w-12 h-0.5 bg-iphrd-green mx-auto"></div>
              </div>
              <div className="space-y-4">
                {principles.map((principle, index) => (
                  <div key={index} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-iphrd-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-iphrd-green">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed flex-1 text-justify">{principle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisionMission;