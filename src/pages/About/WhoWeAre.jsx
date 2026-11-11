import { Link } from 'react-router-dom';
import aboutVideo from '../../assets/videos/background.MOV';

const WhoWeAre = () => {
  return (
    <div>
      {/* Hero Section with Video Background */}
      <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Video Background - Fixed for mobile */}
        <div className="absolute inset-0 w-full h-full">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ 
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              perspective: 1000,
              WebkitTransform: 'translate3d(0,0,0)',
              transform: 'translate3d(0,0,0)',
              minHeight: '100%',
              minWidth: '100%'
            }}
          >
            <source src={aboutVideo} type="video/quicktime" />
            <source src={aboutVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-4">
            <span className="text-iphrd-green-400 text-xs font-medium">About IPHRD-Africa</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Who We Are</h1>
          <div className="w-16 md:w-20 h-0.5 bg-iphrd-green-400 mx-auto"></div>
        </div>
      </section>

      {/* About Section - Green Background */}
      <section className="py-8 md:py-12 relative overflow-hidden" style={{ backgroundColor: '#00721d' }}>
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 md:w-80 md:h-80 bg-white/5 rounded-full blur-3xl"></div>
      
        <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
              About IPHRD AFRICA
            </h2>
            <div className="w-16 h-0.5 bg-white/60 rounded-full mx-auto mt-3"></div>
          </div>
      
          {/* 4 Distinct Sections */}
          <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
      
            {/* 1. Who We Are */}
            <div className="border-l-4 border-white/60 pl-4 md:pl-6">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                Who We Are
              </h3>
              <p className="text-white/80 leading-relaxed text-sm md:text-base mb-3">
                <span className="text-white font-semibold">IPHRD-AFRICA</span> is a non-profit, non-partisan organization registered in Kenya as a Non-Governmental Organization (NGO) with a local, national and international status. Since 2016, we have worked to promote a human rights approach to governance and peace building for sustainable development in Africa.
              </p>
              <p className="text-white/80 leading-relaxed text-sm md:text-base mb-3">
                At the heart of our work is a belief in <span className="text-white font-semibold">justice for all</span>, <span className="text-white font-semibold">inclusivity</span> and <span className="text-white font-semibold">meaningful participation</span>. We work with women, men, youth, children, the elderly, persons with special needs and other minority groups, recognising that sustainable peace is built when people are able to participate in shaping the decisions that affect their lives.
              </p>
              <p className="text-white/80 leading-relaxed text-sm md:text-base">
                Our approach is <span className="text-white font-semibold">people-centred</span>, participatory and consultative, bringing communities and stakeholders together to contribute to peaceful and sustainable societies.
              </p>
            </div>
      
            {/* 2. What We Do */}
            <div className="border-l-4 border-white/60 pl-4 md:pl-6">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                What We Do
              </h3>
              <p className="text-white/80 leading-relaxed text-sm md:text-base mb-3">
                IPHRD-Africa works to prevent and transform conflict, strengthen unity and build social cohesion among communities. Through research, lobbying, advocacy, capacity building, policy development and sensitization, we support communities and stakeholders to understand challenges, strengthen their capacities and influence political, economic and social decisions.
              </p>
              <p className="text-white/80 leading-relaxed text-sm md:text-base">
                Our work brings people together around the issues that shape their communities, creating space for dialogue, participation, collaboration and peaceful transformation. We also build collaborations, partnerships and networks at the grassroots, national and international levels, connecting local experiences with wider opportunities for peacebuilding and sustainable development.
              </p>
            </div>
      
            {/* 3. Where We Work */}
            <div className="border-l-4 border-white/60 pl-4 md:pl-6">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                Where We Work
              </h3>
              <p className="text-white/80 leading-relaxed text-sm md:text-base mb-3">
                Our work is rooted in communities and connected across borders. IPHRD-Africa works across the <span className="text-white font-semibold">Horn of Africa and Great Lakes region</span>, with a focus on <span className="text-white font-semibold">Kenya, Ethiopia, Sudan, South Sudan and Somalia</span>.
              </p>
              <p className="text-white/80 leading-relaxed text-sm md:text-base">
                Across these countries, we engage communities, peacebuilders, civil society actors, institutions and other stakeholders to strengthen peace, social cohesion, human rights and sustainable development. We recognise that the challenges facing communities do not stop at borders. Sustainable peace therefore requires local knowledge, regional cooperation and shared action.
              </p>
            </div>
      
            {/* 4. What Makes Us Credible */}
            <div className="border-l-4 border-white/60 pl-4 md:pl-6">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                What Makes Us Credible
              </h3>
              <p className="text-white/80 leading-relaxed text-sm md:text-base mb-3">
                IPHRD-Africa has been operational since 2016 and is registered in Kenya as a Non-Governmental Organization, providing an established foundation for our work. Over the years, we have built experience in peacebuilding, conflict transformation, human rights, governance, social cohesion and sustainable development, working alongside communities and partners across the region.
              </p>
              <p className="text-white/80 leading-relaxed text-sm md:text-base">
                Our credibility is grounded not only in the work we undertake, but in the relationships, partnerships and networks we build at grassroots, national, regional and international levels. We remain committed to supporting the <span className="text-white font-semibold">Sustainable Development Goals (SDGs)</span>, the <span className="text-white font-semibold">African Union's Agenda 2063</span> and <span className="text-white font-semibold">Kenya's Vision 2030</span>, while placing human rights, justice, peace and sustainable development at the centre of our work.
              </p>
            </div>
      
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhoWeAre;