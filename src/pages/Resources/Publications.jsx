const Publications = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Publications</h1>
      <p className="text-xl text-gray-600 mb-8">Research, reports, and resources from our work</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {publications.map((pub, index) => (
          <div key={index} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
            <div className="bg-gray-100 h-40 flex items-center justify-center">
              <div className="text-5xl">{pub.icon}</div>
            </div>
            <div className="p-5">
              <span className="text-xs text-blue-600 font-semibold uppercase">{pub.type}</span>
              <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{pub.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{pub.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{pub.date}</span>
                <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">
                  Download PDF →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Submit Your Research</h3>
        <p className="text-gray-600 mb-4">We welcome contributions from researchers and practitioners</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Submit Publication
        </button>
      </div>
    </div>
  );
};

const publications = [
  {
    icon: "📘",
    type: "Annual Report",
    title: "IPHRD-Africa Annual Report 2023",
    description: "Comprehensive overview of our activities, impact, and achievements in 2023.",
    date: "January 2024"
  },
  {
    icon: "📄",
    type: "Policy Brief",
    title: "Youth Participation in Peace Processes",
    description: "Analysis of youth inclusion in peace negotiations and recommendations.",
    date: "December 2023"
  },
  {
    icon: "📊",
    type: "Research Paper",
    title: "Women's Mediation in East Africa",
    description: "Case studies and lessons from women mediators in the region.",
    date: "October 2023"
  },
  {
    icon: "📖",
    type: "Training Manual",
    title: "Community Mediation Guide",
    description: "Practical guide for community-based mediation and conflict resolution.",
    date: "August 2023"
  },
  {
    icon: "🗺️",
    type: "Report",
    title: "Conflict Dynamics in the Horn of Africa",
    description: "Analysis of emerging conflicts and peace-building opportunities.",
    date: "June 2023"
  },
  {
    icon: "📋",
    type: "Evaluation Report",
    title: "Young Women Leaders Program Impact Assessment",
    description: "Evaluation of program outcomes and recommendations.",
    date: "March 2023"
  }
];

export default Publications;