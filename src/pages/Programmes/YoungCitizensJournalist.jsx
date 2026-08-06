// src/pages/YoungCitizensJournalist.jsx
const YoungCitizensJournalist = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-iphrd-green to-green-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-5">
            <span className="text-white text-xs font-medium">Youth Empowerment</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">YOUTH CITIZEN JOURNALIST PROJECT</h1>
          <div className="w-20 h-0.5 bg-white mx-auto"></div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <p className="text-gray-700 leading-relaxed">
              IPHRD-Africa is implementing a project that seeks to give space for the youth to report on the good things that are happening in their community on peaceful coexistence and social cohesion.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default YoungCitizensJournalist;