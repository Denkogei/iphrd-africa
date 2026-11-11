import { Link } from 'react-router-dom';
import wanjikuImage from '../../assets/images/team/wanjiku-kamau.jpg';
import emanuelImage from '../../assets/images/team/emanuel-luanda.jpg';
import dennisImage from '../../assets/images/team/dennis-kemboi.png';
import carlosImage from '../../assets/images/team/carlos.jpg';

const OurTeam = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Our Team</h1>
      <p className="text-xl text-gray-600 mb-12 text-center">Meet the dedicated individuals driving our mission forward</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="w-56 h-56 rounded-full overflow-hidden bg-gray-200 mx-auto mt-6 border-4 border-white shadow-md">
              {member.image ? (
                <img 
                  src={member.image} 
                  alt={member.name}
                  className={`w-full h-full object-cover ${member.name === 'Emanuel Luanda' ? 'object-[center_18%]' : 'object-center'}`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full rounded-full bg-gradient-to-r from-iphrd-green to-iphrd-blue flex items-center justify-center">
                        <span class="text-white text-6xl">${member.icon}</span>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-r from-iphrd-green to-iphrd-blue flex items-center justify-center">
                  <span className="text-white text-6xl">{member.icon}</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-iphrd-green font-semibold mb-3">{member.position}</p>
              <p className="text-gray-600 text-sm text-justify">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-iphrd-green/10 p-8 rounded-lg text-center">
        <h3 className="text-2xl font-bold text-iphrd-green mb-4">Join Our Team</h3>
        <p className="text-gray-700 mb-4">
          We're always looking for passionate individuals to join our mission.
        </p>
        <Link
          to="/opportunities"
          className="inline-block bg-iphrd-green text-white px-6 py-2 rounded-lg hover:bg-iphrd-green/90 transition"
        >
          View Opportunities
        </Link>
      </div>
    </div>
  );
};

const teamMembers = [
  {
    icon: "👩‍💼",
    image: wanjikuImage,
    name: "Wanjiku Kamau",
    position: "Programs Manager",
    bio: "Experienced programs manager with a background in peace-building, conflict resolution, and sustainable development initiatives. Skilled in strategic planning and program implementation across Africa."
  },
  {
    icon: "👨‍💼",
    image: emanuelImage,
    name: "Emanuel Luanda",
    position: "Programs Officer",
    bio: "Emanuel Lwanda is a programs officer at IPHRD-Africa. Previously, he served as a programme facilitator at the National Federation of Public Benefit Organizations and as an internship trainee at the Eastern Africa Standby Force (EASF). He began as an attachee at the National Federation of PBOs. He holds a Bachelor of Arts in International Relations and Diplomacy from Zetech University."
  },
  {
    icon: "👨‍💻",
    image: dennisImage,
    name: "Dennis Kemboi",
    position: "IT & Communications",
    bio: "Dennis Kemboi is an IT and communications professional at IPHRD-Africa, supporting the organization’s digital strategy, technology systems, website management, and communications. He is passionate about using technology and digital innovation to strengthen organizational impact, improve information management, and support peacebuilding, human rights, and sustainable development initiatives across Africa."
  },
  {
    icon: "👨‍💻",
    image: carlosImage,
    name: "Carlos Kipchumba",
    position: "Programs Officer",
    bio: "Development professional focused on gender equality, human rights, peacebuilding, and youth empowerment. Passionate about supporting inclusive communities and strengthening locally driven approaches to peace, development, and social justice."
  }
];

export default OurTeam;