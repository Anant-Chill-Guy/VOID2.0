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
    return <Navigate to="/articles" />;
  }

  const { title, date, imageUrl, content, tags } = post;

  return (
    <>
      <Navbar />
      <div className="bg-gray-900 min-h-screen pt-24 pb-12">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link to="/articles" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">&larr; Back to all articles</Link>
          </div>
          <article>
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white font-serif leading-tight mb-4">{title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-gray-400">
                <span>{date}</span>
                {tags && tags.length > 0 && (
                  <>
                    <span className="text-slate-600">·</span>
                    <span className="text-blue-400">{tags.join('  ·  ')}</span>
                  </>
                )}
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