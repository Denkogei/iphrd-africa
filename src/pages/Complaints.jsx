// src/pages/Complaints.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Complaints = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    concern_type: 'Program-related Concern',
    description: '',
    confirm_accuracy: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.confirm_accuracy) {
      toast.warning('Please confirm that the information provided is accurate');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('https://trial.iphrdafrica.org/api/send-complaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          concern_type: formData.concern_type,
          description: formData.description,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success === true) {
        toast.success(`✅ Thank you! Your complaint has been submitted. Reference: ${data.reference_id || 'N/A'}`);
        
        // Reset form
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          concern_type: 'Program-related Concern',
          description: '',
          confirm_accuracy: false
        });
        
        // Navigate after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        throw new Error(data.error || 'Submission failed');
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(`❌ Failed to submit: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      
      <div className="bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-5">
              <span className="text-white text-xs font-medium">We Value Your Voice</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Complaints & Feedback</h1>
            <div className="w-20 h-0.5 bg-white mx-auto"></div>
            <p className="text-white/80 text-base max-w-2xl mx-auto mt-4">
              We value your feedback and take all complaints seriously
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Submit a Complaint or Feedback</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          name="full_name"
                          required
                          value={formData.full_name}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type of Concern *</label>
                      <select
                        name="concern_type"
                        required
                        value={formData.concern_type}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                      >
                        <option>Program-related Concern</option>
                        <option>Staff Conduct</option>
                        <option>Financial Matter</option>
                        <option>General Feedback</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <textarea
                        name="description"
                        rows="6"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                        placeholder="Please provide detailed information about your concern..."
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="confirm_accuracy"
                        checked={formData.confirm_accuracy}
                        onChange={handleChange}
                        className="rounded border-gray-300 focus:ring-[#2E7D32]"
                      />
                      <label className="text-sm text-gray-600">I confirm that the information provided is accurate *</label>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#2E7D32] text-white py-2 rounded-lg font-semibold hover:bg-[#1B5E20] transition disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-xl sticky top-24 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Our Commitment</h3>
                  <p className="text-gray-600 mb-4">
                    We are committed to addressing all complaints fairly, confidentially, and promptly. All submissions are handled in accordance with our complaints policy.
                  </p>
                  <hr className="my-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">What to Expect</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm">
                    <li>Acknowledgment within 2 business days</li>
                    <li>Investigation within 14 days</li>
                    <li>Resolution update within 21 days</li>
                    <li>Confidential handling of all matters</li>
                  </ul>
                  <hr className="my-4" />
                  <p className="text-sm text-gray-500">
                    For urgent matters, please contact us directly at{' '}
                    <a href="mailto:iphrdcommunications@gmail.com" className="text-[#2E7D32] hover:underline">
                      iphrdcommunications@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Complaints;