import { Globe, Users, Target, Award, FileText } from 'lucide-react';

function YouthPeaceIndex() {
  const stats = [
    { label: 'Countries Covered', value: '5', icon: Globe },
    { label: 'Youth Respondents', value: '6,800+', icon: Users },
    { label: 'Peace Indicators', value: '32', icon: Target },
    { label: 'Partner Organizations', value: '41', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-iphrd-green to-green-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-medium mb-6">
            <Globe className="w-4 h-4" />
            IPHRD Africa Initiative
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Youth Peace Index
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Measuring youth-led peacebuilding across Kenya, Ethiopia, Somalia, South Sudan,
            and Sudan.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100"
            >
              <div className="w-12 h-12 mx-auto bg-green-50 rounded-xl flex items-center justify-center mb-3">
                <stat.icon className="w-6 h-6 text-iphrd-green" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Download Section */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Download the Youth Peace Index
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Access the full report with country scores, pillar breakdowns, and youth insights
          across the Horn of Africa and East Africa.
        </p>
        <button className="inline-flex items-center gap-2 px-8 py-4 bg-iphrd-green text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-lg">
          <FileText className="w-5 h-5" />
          Download Report
        </button>
      </section>
    </div>
  );
}

export default YouthPeaceIndex;