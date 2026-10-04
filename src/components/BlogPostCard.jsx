import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogPostCard({ post, index = 0 }) {
  const { title, snippet, date, readTime, tags } = post;

  // Pointer-tracked 3D tilt; falls back to flat without a pointer.
  const handleMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-py * 6).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(px * 8).toFixed(2)}deg`);
    el.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`);
  };

  const handleLeave = (e) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <article
      className="article-card"
      style={{ '--i': index }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <span className="article-card__sheen" aria-hidden="true" />
      <div className="article-card__meta">
        {tags && tags.length > 0 && <span className="article-card__tag">{tags[0]}</span>}
        <span className="article-card__date">
          {date} · {readTime}
        </span>
      </div>

      <Link to={`/articles/${post.id}`} state={{ post }} className="article-card__link">
        <h2 className="article-card__title">{title}</h2>
        <p className="article-card__snippet">{snippet}</p>
      </Link>

      <span className="article-card__more">
        Read article <span aria-hidden="true">&rarr;</span>
      </span>
    </article>
  );
}
