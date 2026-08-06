// src/pages/GetInvolved/Volunteer.jsx
import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Volunteer = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    area_of_interest: 'Research & Documentation',
    why_volunteer: '',
    cvFile: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      cvFile: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('full_name', formData.full_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('cover_letter', formData.why_volunteer || '');
      formDataToSend.append('area_of_interest', formData.area_of_interest);
      formDataToSend.append('cv', formData.cvFile);
      
      // Use volunteer endpoint which sets application_type='volunteer'
      const url = 'https://trial.iphrdafrica.org/api/volunteer/apply';
      
      const response = await axios.post(url, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setSubmitted(true);
        toast.success('Volunteer application submitted successfully!');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      toast.error(err.response?.data?.error || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const volunteerRoles = [
    {
      title: "Research Assistant",
      commitment: "10-15 hours/week",
      description: "Support our research team in data collection, analysis, and report writing on peace and human rights issues."
    },
    {
      title: "Community Mobilizer",
      commitment: "Flexible",
      description: "Engage with communities, organize peace dialogues, and support grassroots initiatives."
    },
    {
      title: "Social Media Volunteer",
      commitment: "5-10 hours/week",
      description: "Help amplify our message through content creation and social media management."
    },
    {
      title: "Event Support",
      commitment: "As needed",
      description: "Assist in organizing workshops, training sessions, and community events."
    }
  ];

  return (
    <div className="bg-white">
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-iphrd-green to-green-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-5">
            <span className="text-white text-xs font-medium">Make a Difference</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Volunteer With Us</h1>
          <div className="w-20 h-0.5 bg-white mx-auto"></div>
          <p className="text-white/80 text-base max-w-2xl mx-auto mt-4">
            Be part of the change. Your skills and passion can make a difference in communities across Africa.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Left Column - Volunteer Opportunities Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Volunteer Opportunities</h2>
              <div className="space-y-4 mb-8">
                {volunteerRoles.map((role, index) => (
                  <div key={index} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition">
                    <h3 className="font-bold text-gray-900 text-lg">{role.title}</h3>
                    <p className="text-sm text-iphrd-green mb-2 font-medium">{role.commitment}</p>
                    <p className="text-gray-600 text-sm">{role.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Column - Application Form */}
            <div>
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Volunteer Application</h2>
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="text-iphrd-green text-5xl mb-4">✓</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Application Received!</h3>
                    <p className="text-gray-600">Thank you for your interest. We'll review your application and get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="full_name"
                        required
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Area of Interest *</label>
                      <select
                        name="area_of_interest"
                        value={formData.area_of_interest}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                      >
                        <option>Research & Documentation</option>
                        <option>Community Outreach</option>
                        <option>Communications & Media</option>
                        <option>Event Support</option>
                        <option>Administration</option>
                        <option>Peace-building Programs</option>
                        <option>Fundraising & Partnership</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to volunteer? *</label>
                      <textarea
                        name="why_volunteer"
                        rows="4"
                        required
                        value={formData.why_volunteer}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                        placeholder="Tell us why you're interested in volunteering with IPHRD-Africa..."
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upload CV/Resume (PDF Only)</label>
                      <input
                        type="file"
                        name="cvFile"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-iphrd-green"
                      />
                      <p className="text-xs text-gray-500 mt-1">Optional but recommended. Max file size: 5MB</p>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-iphrd-green text-white py-2.5 rounded-lg font-semibold hover:bg-iphrd-green/80 transition disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Volunteer;