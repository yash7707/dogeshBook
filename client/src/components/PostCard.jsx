import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { getAvatarColor, getAvatarLetter } from "../utils/getAvatarPlaceholder";
import "../style/PostCard.css";

const PostCard = ({ post, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const cardRef = useRef(null);
  const likeBtnRef = useRef(null);
  const heartRef = useRef(null);

  useEffect(() => {
    const liked = post.likedByUser || (post.likes && Array.isArray(post.likes) && post.likes.length > 0);
    setIsLiked(liked);
    setLikeCount(post.likes?.length || post.likesCount || 0);
  }, [post]);

  const handleLikeClick = () => {
    setIsAnimating(true);
    const next = !isLiked;
    setIsLiked(next);
    setLikeCount((p) => (next ? p + 1 : p - 1));
    onLike();

    if (heartRef.current) {
      gsap.timeline()
        .to(heartRef.current, { scale: 1.7, duration: 0.12, ease: "back.out(3)" })
        .to(heartRef.current, { scale: 1, duration: 0.22, ease: "elastic.out(1.2, 0.4)" });
    }
    if (likeBtnRef.current) {
      gsap.fromTo(likeBtnRef.current, { scale: 1 }, { scale: 0.93, duration: 0.1, yoyo: true, repeat: 1 });
    }
    setTimeout(() => setIsAnimating(false), 600);
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts), now = new Date();
    const h = (now - d) / 3600000;
    if (h < 1) return `${Math.floor(h * 60)}m ago`;
    if (h < 24) return `${Math.floor(h)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div ref={cardRef} className="post-card">

      {/* Left accent stripe */}
      <div className="post-stripe" style={{ background: getAvatarColor(post.dog?.name) }} />

      <div className="post-inner">
        {/* Header */}
        <div className="post-header">
          <div className="dog-avatar" style={{ backgroundColor: getAvatarColor(post.dog?.name) }}>
            {getAvatarLetter(post.dog?.name)}
          </div>
          <div className="dog-info">
            <div className="dog-name-row">
              <span className="dog-name">{post.dog?.name || "Anonymous Dog"}</span>
              {post.dog?.breed && <span className="breed-badge">{post.dog.breed}</span>}
            </div>
            <div className="post-meta">
              {post.createdAt && <span className="post-time">{formatTime(post.createdAt)}</span>}
              <span className="post-status"><span className="status-dot" />Posted</span>
            </div>
          </div>
          <button className="more-btn">⋮</button>
        </div>

        {/* Content */}
        <p className="post-content">{post.content}</p>

        {post.images?.length > 0 && (
          <div className="image-grid">
            {post.images.slice(0, 4).map((img, i) => (
              <div key={i} className="image-preview" style={{ backgroundImage: `url(${img})` }}>
                {i === 3 && post.images.length > 4 && <div className="image-more">+{post.images.length - 4}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="post-stats">
          <span className="stat"><strong>{likeCount}</strong> Wags</span>
          <span className="stat-dot" />
          <span className="stat"><strong>{post.comments?.length || 0}</strong> Woofs</span>
          <span className="stat-dot" />
          <span className="stat"><strong>{post.shares || 0}</strong> Sniffs</span>
        </div>

        {/* Actions */}
        <div className="post-actions">
          <button
            ref={likeBtnRef}
            className={`act-btn act-like ${isLiked ? "liked" : ""} ${isAnimating ? "animating" : ""}`}
            onClick={handleLikeClick}
          >
            <span ref={heartRef}>{isLiked ? "❤️" : "🤍"}</span>
            {isLiked ? "Liked" : "Wag"}
          </button>
          <button className="act-btn act-comment">
            <span>💬</span> Woof
          </button>
          <button className="act-btn act-share">
            <span>🔁</span> Sniff
          </button>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="post-tags">
            {post.tags.map((t, i) => <span key={i} className="tag">#{t}</span>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;