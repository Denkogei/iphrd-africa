// src/pages/ScopeProgrammes.jsx
import { Shield, Heart, Leaf, Users, BookOpen, Building2 } from 'lucide-react';

const ScopeProgrammes = () => {
  const programmes = [
    {
      title: 'Peace and Security Programme (PSP)',
      icon: Shield,
      subProgrammes: [
        {
          title: 'Young Women Leaders Mediation Programme',
          subProgrammes: [
            'Young Women Mediation Network'
          ]
        },
        {
          title: 'Young African Peacemakers Programme',
          subProgrammes: [
            'Young Citizens Journalist Project'
          ]
        },
        {
          title: 'The Youth Peace Index',
          subProgrammes: []
        },
        {
          title: 'Other Programs',
          subProgrammes: [
            'Peacebuilding and Post Conflict Reconstruction Initiative',
            'Crime and Violence Prevention Initiative',
            'Prevention of Violence Towards Children Initiative',
            'Social Cohesion and Non-violent Communication Initiative',
            'Peace Operations and Humanitarian Assistance Initiative',
            'Countering Violent Extremism Initiative',
            'Media and Peace Initiative',
            'Migration and Conflict Initiative'
          ]
        }
      ]
    },
    {
      title: 'Community Empowerment and Development Programme (CEDP)',
      icon: Users,
      subProgrammes: [
        'The Women Empowerment Initiative',
        'The Youth Empowerment Initiative',
        'Leadership & Governance Initiative',
        'Trauma Healing Initiative',
        'Citizen Journalism Initiative'
      ]
    },
    
    {
      title: 'Human Rights and Development Programme (HRDP)',
      icon: Heart,
      subProgrammes: [
        'Human Rights Education and Awareness Initiative',
        'Women\'s Rights Initiative',
        'Children and Youth Rights Initiative',
        'Health and Reproductive Rights Initiative',
        'Human Rights and the Media Initiative'
      ]
    },
    {
      title: 'Natural Resource Management and Development Programme (NRMDP)',
      icon: Leaf,
      subProgrammes: [
        'Climate Change and Human Rights Initiative',
        'Sustainability in Natural Resource Management Initiative',
        'Sustainability in Water and Land Management Initiative',
        'Urban-Ecosystem and waste Management Initiative',
        'Resources and Conflict Initiative',
        'Extractive industry and Human Rights Initiative'
      ]
    },
    {
      title: 'Governance and Citizen Engagement Programme (GCEP)',
      icon: Building2,
      subProgrammes: [
        'County Governance Initiative',
        'Local Governance Initiative',
        'Civic Education Initiative',
        'Electoral Support Initiative',
        'Governance and Rule of law Initiative',
        'Leadership in Peace and Governance Initiative'
      ]
    },
    {
      title: 'Research, Documentation and Advocacy Programme (RDAP)',
      icon: BookOpen,
      description: 'This programme cuts across all the other programmes. The programme will undertake research, analysis, documentation and publication of challenges, achievements, best practices and lessons learnt to ensure an evidence based approach in designing, developing, implementing and evaluating programmes.\n\nResearch findings will inform the content for capacity building programmes and policy interventions.',
      subProgrammes: []
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-iphrd-green to-green-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">OUR SCOPE AND PROGRAMMES</h1>
          <div className="w-20 h-0.5 bg-white mx-auto"></div>
        </div>
      </section>

      {/* Text Content with justified text */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed text-justify">
              IPHRD-Africa is committed to supporting the achievement of Sustainable Developments Goals (SGDs), the African Union's Agenda 2063 and Kenya's Vision 2030 thus accelerating poverty reduction, enhancing structural prevention and strengthening post conflict reconstruction and development while incorporating a human rights approach.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              IPHRD-Africa focuses on three strategic pillars: Peace and Security; Human Rights; and Sustainable Development, spanning from Community, National, Regional and International level.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              The organization's initial focus was Kenya. However, IPHRD-Africa implements some of its programmes within the Eastern African region, other regions in Africa as well as beyond Africa.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              Youth being at the center of our work, we are also implementing Youth pease and security(YPS) and Security agenda and Women Peace and security(WPS).
            </p>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {programmes.map((programme, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition h-fit">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-iphrd-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <programme.icon className="w-6 h-6 text-iphrd-green" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{programme.title}</h3>
                  </div>
                  
                  {programme.description && (
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed whitespace-pre-line text-justify">
                      {programme.description}
                    </p>
                  )}
                  
                  {programme.subProgrammes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Sub-programmes include:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {programme.subProgrammes.map((item, idx) => {
                          if (typeof item === 'string') {
                            return (
                              <div key={idx} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-iphrd-green rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-gray-600 text-justify">{item}</span>
                              </div>
                            );
                          } else if (typeof item === 'object' && item.title) {
                            return (
                              <div key={idx}>
                                <div className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-iphrd-green rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm text-gray-600 text-justify">{item.title}</span>
                                </div>
                                {item.subProgrammes && item.subProgrammes.length > 0 && (
                                  <div className="ml-6 space-y-2 mt-1">
                                    {item.subProgrammes.map((subItem, subIdx) => {
                                      if (typeof subItem === 'string') {
                                        return (
                                          <div key={subIdx} className="flex items-start gap-2">
                                            <span className="text-iphrd-green font-bold text-sm flex-shrink-0">✓</span>
                                            <span className="text-sm text-gray-600 text-justify">{subItem}</span>
                                          </div>
                                        );
                                      }
                                      return null;
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScopeProgrammes;