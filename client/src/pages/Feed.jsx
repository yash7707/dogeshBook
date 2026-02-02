import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import useAuth from "../context/useAuth";
import PostCard from "../components/PostCard";
import "../style/Feed.css";

const Feed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [dogId, setDogId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  // Fetch dog + posts
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const dogRes = await api.get("/dogs/me");
        setDogId(dogRes.data._id);
        const postRes = await api.get("/posts");
        setPosts(postRes.data.posts || postRes.data);
      } catch (err) {
        // redirecting if profile is not created
        if(err.response?.data?.message === "Dog profile not found"){
          setLoading(false);
          setError("Please create a profile first to see the feed!! Redirecting you to profile...");
          handleNoProfile("/dog",3000);
          return;
        }
        setError("Unable to load feed");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleNoProfile = (page,wait) => {
    setTimeout(() => {
      navigate(page);
    }, wait);
  }

  // Create post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const { data } = await api.post("/posts", {
        content,
        dog: dogId,
      });

      setPosts((prev) => [data, ...prev]);
      setContent("");
      setIsTyping(false);

      // Trigger success animation
      const submitBtn = e.target.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.classList.add("post-success");
        setTimeout(() => submitBtn.classList.remove("post-success"), 1000);
      }
    } catch (err) {
      setError("Failed to create post");
      console.error(err);
    }
  };

  // Like / Unlike
  const handleLike = async (postId) => {
    try {
      const { data } = await api.post(`/posts/${postId}/like`);

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: data.likes,
                likesCount: data.likesCount,
                likedByUser: data.likedByUser,
              }
            : post,
        ),
      );
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  if (loading) {
    return (
      <div className="feed-loading">
        <div className="loading-paws">
          <span>🐾</span>
          <span>🐾</span>
          <span>🐾</span>
        </div>
        <p>Fetching doggy posts...</p>
      </div>
    );
  }

  return (
    <div className="feed-container">
      {/* Header */}
      <div className="feed-header">
        <h2 className="feed-title">Dogesh Feed</h2>
        <p className="feed-subtitle">
          Share your dog's adventures with the pack!
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Create Post Form */}
      <div className="create-post-card">
        <form onSubmit={handlePostSubmit} className="post-form">
          <div className="form-header">
            <span className="form-icon">📝</span>
            <h3>Create a Paw-some Post</h3>
          </div>

          <div className="textarea-container">
            <textarea
              placeholder="What's your dog up to? Share their latest adventure, funny moment, or cute photo! 🦴"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              className="post-textarea"
              rows="4"
            />
            <div className="textarea-footer">
              <div className={`typing-indicator ${isTyping ? "typing" : ""}`}>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
              <span className="char-count">{content.length}/500</span>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className={`submit-btn ${content.trim() ? "active" : ""}`}
              disabled={!content.trim()}
            >
              <span className="btn-icon">📮</span>
              Share with the Pack
            </button>

            <div className="hint">
              <span className="hint-icon">💡</span>
              Share photos, stories, or ask for advice!
            </div>
          </div>
        </form>
      </div>

      {/* Posts Section Header */}
      <div className="posts-header">
        <div className="posts-title-wrapper">
          <h3 className="posts-title">
            <span className="posts-icon">📰</span>
            Latest from the Pack
            <span className="post-count">{posts.length} posts</span>
          </h3>
        </div>

        <div className="posts-stats">
          <div className="stat">
            <span className="stat-icon">🐕</span>
            <span className="stat-label">Active dogs</span>
          </div>
          <div className="stat-divider">•</div>
          <div className="stat">
            <span className="stat-icon">❤️</span>
            <span className="stat-label">Wagging tails</span>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="empty-feed">
            <div className="empty-state">
              <div className="empty-icon">🐾</div>
              <h4>No posts yet!</h4>
              <p>Be the first to share a doggy story! Your pack is waiting.</p>
              <button
                className="empty-action-btn"
                onClick={() =>
                  document.querySelector(".post-textarea")?.focus()
                }
              >
                Start sharing
              </button>
            </div>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post, index) => (
              <PostCard
                key={post._id}
                post={post}
                userId={user._id}
                onLike={() => handleLike(post._id)}
                className="post-card-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
