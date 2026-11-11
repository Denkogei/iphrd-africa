// src/pages/Donate.jsx
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Donate = () => {
  const mpesaNumber = "+254 759 862 938";

  const handleCopy = () => {
    navigator.clipboard.writeText(mpesaNumber);
    toast.success('M-Pesa number copied!');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Our Work</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Your donation helps us empower communities and build sustainable peace across Africa.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* Donation Methods */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            Ways to Give
          </h2>
          <div className="w-16 h-1 bg-green-600 rounded-full mx-auto mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* M-Pesa Card */}
            <div className="bg-white border rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Donate via M-Pesa</h3>
              </div>

              <div className="bg-green-50 p-4 rounded-lg mb-4 text-center">
                <p className="text-gray-600 text-sm mb-1">Send M-Pesa to:</p>
                <p className="text-2xl font-bold text-green-700 mb-3">{mpesaNumber}</p>
                <button
                  onClick={handleCopy}
                  className="bg-[#2E7D32] text-white px-5 py-2 rounded-lg hover:bg-[#1B5E20] transition text-sm font-semibold"
                >
                  Copy Number
                </button>
              </div>

              <div className="text-left text-gray-500 text-sm">
                <p className="font-semibold text-gray-700 mb-2">Steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to M-Pesa</li>
                  <li>Select "Send Money"</li>
                  <li>Enter {mpesaNumber}</li>
                  <li>Enter Amount</li>
                  <li>Enter PIN</li>
                </ol>
              </div>
            </div>

            {/* PayPal Card */}
            <div className="bg-white border rounded-xl p-6 shadow-md flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 00-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 00-.556.479l-1.187 7.527h-.506l-.24 1.516h4.28c.56 0 1.038-.407 1.12-.96l.049-.248.895-5.667.057-.316a1.13 1.13 0 011.12-.96h.7c4.57 0 8.146-1.856 9.192-7.223.44-2.244.21-4.122-1.048-5.062z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Donate via PayPal</h3>
              </div>

              <p className="text-gray-600 text-sm mb-4 flex-1">
                For international donors or anyone who prefers using a card. Secure and fast.
              </p>

              <a
                href="https://www.paypal.com/ncp/payment/MK2GYW7Q2R2UL"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#0070BA] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#005ea6] transition w-full"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 00-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 00-.556.479l-1.187 7.527h-.506l-.24 1.516h4.28c.56 0 1.038-.407 1.12-.96l.049-.248.895-5.667.057-.316a1.13 1.13 0 011.12-.96h.7c4.57 0 8.146-1.856 9.192-7.223.44-2.244.21-4.122-1.048-5.062z" />
                </svg>
                Donate with PayPal
              </a>
            </div>

          </div>
        </section>

        {/* Why Give */}
        <section className="bg-white border rounded-xl p-6 md:p-8 shadow-sm">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Why Your Support Matters</h3>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            Across Africa, women and young people are among those most affected by conflict, yet they are often absent from the rooms where peace decisions are made. Your donation helps us train, accompany, and amplify local leaders — connecting community-level peacebuilding to national and regional policy, so that peace is sustained rather than just negotiated.
          </p>
        </section>

        {/* Trust Signals */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-5 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-700 mb-1">2016</p>
            <p className="text-gray-600 text-sm">Operating since</p>
          </div>
          <div className="bg-white border rounded-xl p-5 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-700 mb-1">Registered NGO</p>
            <p className="text-gray-600 text-sm">In Kenya</p>
          </div>
          <div className="bg-white border rounded-xl p-5 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-700 mb-1">5,000+</p>
            <p className="text-gray-600 text-sm">Lives impacted</p>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center text-gray-600 text-sm">
          <p>
            Questions about donating?{" "}
            <a href="mailto:info@iphrdafrica.org" className="text-green-700 font-semibold hover:underline">
              info@iphrdafrica.org
            </a>{" "}
            ·{" "}
            <a href="tel:+254759862938" className="text-green-700 font-semibold hover:underline">
              +254 759 862 938
            </a>
          </p>
        </section>

      </div>
    </div>
  );
};

export default Donate;