import { useState, useEffect } from "react";
import { getAvatarColor, getAvatarLetter } from "../utils/GetAvatarPlaceholder";
import "../style/PostCard.css"; 

const PostCard = ({ post, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Initialize state from post data
  useEffect(() => {
    const liked =
      post.likedByUser ||
      (post.likes && Array.isArray(post.likes) && post.likes.length > 0);
    setIsLiked(liked);

    const count = post.likes?.length || post.likesCount || 0;
    setLikeCount(count);
  }, [post]);

  const handleLikeClick = () => {
    // Trigger animation
    setIsAnimating(true);

    // Update local state immediately for better UX
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));

    // Call the parent handler
    onLike();

    // Reset animation after a delay
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Format timestamp if available
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const mins = Math.floor(diffInHours * 60);
      return `${mins}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };


  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <div
          className="dog-avatar"
          style={{
            backgroundColor: getAvatarColor(post.dog?.name),
          }}
        >
          {getAvatarLetter(post.dog?.name)}
        </div>

        <div className="dog-info">
          <div className="dog-name-wrapper">
            <h3 className="dog-name">{post.dog?.name || "Anonymous Dog"}</h3>
            {post.dog?.breed && (
              <span className="dog-breed">{post.dog.breed}</span>
            )}
          </div>

          <div className="post-meta">
            {post.createdAt && (
              <span className="post-time">
                <span className="time-icon">🕐</span>
                {formatTime(post.createdAt)}
              </span>
            )}
            <span className="post-indicator">
              <span className="indicator-dot"></span>
              Posted
            </span>
          </div>
        </div>

        <div className="post-actions">
          <button className="action-btn more-btn" aria-label="More options">
            ⋮
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="post-content">
        <p>{post.content}</p>

        {/* If there are images (you can expand this later) */}
        {post.images && post.images.length > 0 && (
          <div className="post-images">
            <div className="image-grid">
              {post.images.slice(0, 4).map((img, index) => (
                <div
                  key={index}
                  className="image-preview"
                  style={{ backgroundImage: `url(${img})` }}
                >
                  {index === 3 && post.images.length > 4 && (
                    <div className="image-count">+{post.images.length - 4}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Post Stats */}
      <div className="post-stats">
        <div className="stat">
          <span className="stat-icon">❤️</span>
          <span className="stat-count">{likeCount}</span>
          <span className="stat-label">Wags</span>
        </div>

        <div className="stat">
          <span className="stat-icon">💬</span>
          <span className="stat-count">{post.comments?.length || 0}</span>
          <span className="stat-label">Woofs</span>
        </div>

        <div className="stat">
          <span className="stat-icon">🔁</span>
          <span className="stat-count">{post.shares || 0}</span>
          <span className="stat-label">Sniffs</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="post-actions-bar">
        <button
          className={`action-btn like-btn ${isLiked ? "liked" : ""} ${isAnimating ? "animating" : ""}`}
          onClick={handleLikeClick}
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <div className="like-icon-container">
            <span className="like-icon-heart">❤️</span>
            <span className="like-icon-paw">🐾</span>
          </div>
          <span className="action-label">{isLiked ? "Liked" : "Wag"}</span>
        </button>

        <button className="action-btn comment-btn" aria-label="Comment">
          <span className="action-icon">💬</span>
          <span className="action-label">Woof</span>
        </button>

        <button className="action-btn share-btn" aria-label="Share">
          <span className="action-icon">🔁</span>
          <span className="action-label">Sniff</span>
        </button>
      </div>

      {/* Tags if any */}
      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map((tag, index) => (
            <span key={index} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
