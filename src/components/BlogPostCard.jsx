import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogPostCard({ post }) {
  // Destructure the post object for easier access
  const { title, snippet, imageUrl, date, readTime, tags } = post;

  return (
    <article className="flex flex-col sm:flex-row gap-6 w-full group">
      {/* Content Section */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          {tags && tags.length > 0 && (
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
              {tags[0]}
            </span>
          )}
        </div>
        <Link to={`/articles/${post.id}`} state={{ post }} className="block">
          <h2 className="text-2xl font-bold text-white group-hover:text-blue-300 group-hover:underline font-serif transition-colors">{title}</h2>
          <p className="mt-2 text-gray-400 text-base leading-relaxed hidden md:block">
            {snippet}
          </p>
        </Link>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span>{date} · {readTime}</span>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <Link to={`/articles/${post.id}`} state={{ post }} className="sm:w-48 sm:h-32 h-40 flex-shrink-0 group">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-lg group-hover:opacity-80 transition-opacity"
          />
        ) : (
          <div className="w-full h-full rounded-lg border border-slate-700 bg-gradient-to-br from-blue-600/25 via-slate-800 to-slate-900 flex items-center justify-center p-3 text-center">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-300">
              {tags && tags[0] ? tags[0] : 'VOID'}
            </span>
          </div>
        )}
      </Link>
    </article>
  );
}