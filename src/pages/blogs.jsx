import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import BlogPostCard from '../components/BlogPostCard';
import { blogPosts } from '../data/blogPosts';

export default function Blogs() {
  return (
    <>
      <Navbar />
      <div className="bg-black min-h-screen pt-24">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Page Header */}
          <div className="border-b border-slate-700 pb-8 mb-8 text-center">
            <h1 className="blogs-hero-title">Articles</h1>
            <p className="blogs-hero-subtitle">
              Cyber security write-ups, CTF breakdowns and notes from the VOID Society.
            </p>
          </div>

          {/* Blog Post List */}
          <div className="space-y-12">
            {blogPosts.map((post, i) => (
              <BlogPostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}