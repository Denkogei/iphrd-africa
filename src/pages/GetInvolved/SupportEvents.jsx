const SupportEvents = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Our Events</h1>
      <p className="text-xl text-gray-600 mb-8">Help us create impactful events that bring communities together</p>
      
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="border rounded-lg p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{event.icon}</span>
                      <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-2">{event.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span>📅 {event.date}</span>
                      <span>📍 {event.location}</span>
                      <span>👥 {event.capacity}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                      Support
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Ways to Support</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-2">
                <span>💝</span>
                <span>Financial contribution for event logistics</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>🤝</span>
                <span>In-kind support (venue, catering, materials)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>👥</span>
                <span>Volunteer as event staff</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>📢</span>
                <span>Promote our events in your network</span>
              </li>
            </ul>
            <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
              Become an Event Partner
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Past Events Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-3xl font-bold text-blue-600">25+</div>
            <div className="text-sm text-gray-600">Events Organized</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">2,000+</div>
            <div className="text-sm text-gray-600">Participants</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">15+</div>
            <div className="text-sm text-gray-600">Countries Reached</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">30+</div>
            <div className="text-sm text-gray-600">Partner Organizations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const events = [
  {
    icon: "🕊️",
    title: "Annual Peace Summit 2024",
    date: "October 15-17, 2024",
    location: "Nairobi, Kenya",
    capacity: "300 participants",
    description: "A three-day summit bringing together peace-builders, policymakers, and youth leaders from across Africa."
  },
  {
    icon: "👩‍⚖️",
    title: "Young Women Mediation Training",
    date: "August 5-9, 2024",
    location: "Kigali, Rwanda",
    capacity: "50 participants",
    description: "Intensive mediation skills training for young women leaders in the Great Lakes region."
  },
  {
    icon: "📚",
    title: "Peace Education Symposium",
    date: "September 20, 2024",
    location: "Virtual",
    capacity: "500 participants",
    description: "Online symposium on integrating peace education in African schools and universities."
  }
];

export default SupportEvents;