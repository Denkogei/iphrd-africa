import { Link } from 'react-router-dom';

const Objectives = () => {
  // Icons for each objective
  const objectiveIcons = [
    "🤝", "🕊️", "⚖️", "👥", "📚", "🏛️", "📊"
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-iphrd-green py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <span className="text-white text-xs font-medium">Our Goals</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Our Objectives</h1>
          <div className="w-16 h-0.5 bg-white mx-auto"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Objective - Full Width on Mobile */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-iphrd-green/10 to-iphrd-blue/10 rounded-2xl p-8 md:p-10 text-center border border-iphrd-green/20 shadow-lg">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full mb-5">
                <span className="text-iphrd-green text-lg">🎯</span>
                <span className="text-iphrd-green text-xs font-semibold uppercase tracking-wide">Primary Focus</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-iphrd-blue mb-4">Main Objective</h2>
              <div className="w-16 h-0.5 bg-iphrd-green mb-5 mx-auto"></div>
              <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-medium text-justify">
                To promote human rights, governance, conflict prevention and peace building for sustainable development.
              </p>
            </div>
          </div>

          {/* Specific Objectives - Full iphrd-green Background */}
          <div className="bg-iphrd-green rounded-2xl p-8 md:p-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full mb-4">
                <span className="text-white text-sm">📋</span>
                <span className="text-white text-xs font-semibold tracking-wide">Strategic Framework</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Specific Objectives</h2>
              <div className="w-16 h-0.5 bg-white mb-4 mx-auto"></div>
              <p className="text-white/80 text-base max-w-2xl mx-auto">
                Seven key areas guiding our work across Africa
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-5">
              {specificObjectives.map((objective, index) => (
                <div key={index} className="flex gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 group border border-white/20 hover:border-white/40">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                      <span className="text-lg text-white">{objectiveIcons[index]}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-iphrd-green bg-white px-2 py-0.5 rounded-full">
                        0{index + 1}
                      </span>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed text-justify">{objective}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const specificObjectives = [
  "To empower the community and facilitate recovery, rehabilitation and development for vulnerable/marginalized groups in fragile, conflict-affected and post conflict communities",
  "To support the processes of conflict prevention, resolution and management, social cohesion, healing and reconciliation in fragile, conflict-affected and post conflict communities",
  "To strengthen gender mainstreaming in peace, human rights and development in Africa",
  "To mainstream human rights including the rights of the vulnerable and marginalized groups in peace and development processes in Africa, with a focus on fragile, conflict-affected and post conflict communities",
  "To support generation and training of capacities for sustainable peace and development in Africa",
  "To promote good governance and democracy in fragile, conflict-affected and post conflict communities",
  "To undertake applied research for support of policy development and training on peace, human rights and development in Africa"
];

export default Objectives;