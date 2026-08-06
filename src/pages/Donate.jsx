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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToastContainer />
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Our Work</h1>
      <p className="text-xl text-gray-600 mb-8">Your donation helps us empower Indigenous communities in Kenya.</p>
      
      <div className="bg-white border rounded-lg p-8 shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Donate via M-Pesa</h2>
        
        <div className="bg-green-50 p-6 rounded-lg mb-6">
          <p className="text-gray-600 mb-2">Send M-Pesa to:</p>
          <p className="text-3xl font-bold text-green-700 mb-4">{mpesaNumber}</p>
          <button
            onClick={handleCopy}
            className="bg-[#2E7D32] text-white px-6 py-2 rounded-lg hover:bg-[#1B5E20] transition"
          >
            Copy Number
          </button>
        </div>
        
        <div className="text-left text-gray-500 text-sm">
          <p>Steps:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Go to M-Pesa</li>
            <li>Select "Send Money"</li>
            <li>Enter {mpesaNumber}</li>
            <li>Enter Amount</li>
            <li>Enter PIN</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Donate;