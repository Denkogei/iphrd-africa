// src/components/NewsDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE_URL = 'https://trial.iphrdafrica.org';

function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/news/${id}`);
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        console.error("Error fetching article:", err);
      }
    };
    fetchArticle();
  }, [id]);

  if (!article) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-pink-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <main className="pt-[12vh] px-4 md:px-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Full Media */}
        {article.media_url && (
          <div className="w-full mb-6 rounded-2xl overflow-hidden">
            {article.media_type === "image" ? (
              <img
                src={article.media_url}
                alt={article.title}
                className="w-full h-auto object-contain"
              />
            ) : (
              <video
                controls
                className="w-full h-auto max-h-[70vh] rounded-2xl"
              >
                <source
                  src={article.media_url}
                  type={`video/${article.media_url.split(".").pop()}`}
                />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}

        {/* Title & Meta */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
        <p className="text-gray-500 text-sm mb-6">
          {new Date(article.date_posted).toLocaleDateString()}
          {article.author && ` • by ${article.author}`}
        </p>

        {/* Content */}
        <div className="prose max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
          {article.content}
        </div>

        {/* Back link */}
        <Link
          to="/media/news"
          className="mt-6 inline-block text-pink-600 font-semibold hover:underline"
        >
          ← Back to news
        </Link>
      </div>
    </main>
  );
}

export default NewsDetail;
