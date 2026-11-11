// src/pages/Contacts.jsx
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contacts = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.warning('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('https://trial.iphrdafrica.org/api/send-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'Contact Form Message',
          message: formData.message,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success === true) {
        toast.success(`✅ Thank you ${formData.name}! Your message has been sent successfully. We will get back to you soon.`);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(data.error || 'Submission failed');
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(`❌ Failed to send message: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 mb-8">Get in touch with us. We'd love to hear from you.</p>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-[#2E7D32] text-xl">📍</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Address</h3>
                    <p className="text-gray-600">IPHRD-Africa<br />Nairobi, Kenya<br />Elysee plaza, 2nd floor, Kilimani Road</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-[#2E7D32] text-xl">📧</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">info@iphrdafrica.org</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-[#2E7D32] text-xl">📞</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Phone</h3>
                    <p className="text-gray-600"> +254 759-862-938</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-[#2E7D32] text-xl">⏰</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Office Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM (EAT)</p>
                  </div>
                </div>
              </div>
            </div>
            
            
          </div>
          
          <div>
            <div className="bg-white border rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea 
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                    placeholder="Please provide detailed information about your inquiry..."
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2E7D32] text-white py-2 rounded-lg font-semibold hover:bg-[#1B5E20] transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacts;