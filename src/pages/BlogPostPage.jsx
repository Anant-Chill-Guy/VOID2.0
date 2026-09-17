import React from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function BlogPostPage() {
  const location = useLocation();
  const { post } = location.state || {};

  if (!post) {
    // If the post data isn't passed through state, you might want to fetch it
    // or redirect the user. For now, we'll redirect to the blogs page.
    return <Navigate to="/blogs" />;
  }

  const { title, author, authorAvatar, date, imageUrl, content } = post;

  return (
    <>
      <Navbar />
      <div className="bg-gray-900 min-h-screen pt-24 pb-12">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link to="/blogs" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">&larr; Back to all posts</Link>
          </div>
          <article>
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white font-serif leading-tight mb-4">{title}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                {/* Letter Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white ${
                  authorAvatar === 'S' ? 'bg-blue-600' :
                  authorAvatar === 'A' ? 'bg-green-600' :
                  authorAvatar === 'P' ? 'bg-purple-600' :
                  'bg-gray-600'
                }`}>
                  {authorAvatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-200">{author}</p>
                  <p className="text-sm">{date}</p>
                </div>
              </div>
            </header>

            {imageUrl && (
              <img src={imageUrl} alt={title} className="w-full h-auto object-cover rounded-lg mb-8" />
            )}

            <div className="prose prose-lg prose-invert max-w-none text-gray-200" dangerouslySetInnerHTML={{ __html: content }} />
          </article>
        </main>
      </div>
      <Footer />
    </>
  );
}