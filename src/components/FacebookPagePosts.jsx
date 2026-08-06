import { useEffect } from 'react';

const FacebookPagePosts = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-[#1877f2] px-4 py-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-white font-semibold">Latest from Facebook</span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#1877f2] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">IPHRD-Africa</h3>
                <p className="text-gray-500 text-xs">Nonprofit Organization</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm text-center py-4">
              View our latest updates, photos, and news on Facebook
            </p>
            <a
              href="https://www.facebook.com/iphrdafrica"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#1877f2] text-white text-center py-2 rounded-lg hover:bg-[#1877f2]/90 transition font-medium"
            >
              Visit our Facebook Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacebookPagePosts;