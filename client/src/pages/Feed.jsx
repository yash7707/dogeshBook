import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
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

  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null);
  const postsRef = useRef(null);
  const submitBtnRef = useRef(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const fetchData = async () => {
      try {
        const dogRes = await api.get("/dogs/me");
        setDogId(dogRes.data._id);
        const postRes = await api.get("/posts");
        setPosts(postRes.data.posts || postRes.data);
      } catch (err) {
        if (err.response?.data?.message === "Dog profile not found") {
          setLoading(false);
          setError("Please create a profile first! Redirecting...");
          setTimeout(() => navigate("/dog"), 3000);
          return;
        }
        setError("Unable to load feed");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" });
      gsap.from(subtitleRef.current, { y: 15, opacity: 0, duration: 0.6, delay: 0.15, ease: "power2.out" });
      gsap.from(formRef.current, { y: 24, opacity: 0, duration: 0.6, delay: 0.25, ease: "power2.out" });
      if (postsRef.current) {
        const cards = postsRef.current.querySelectorAll(".post-card-item");
        gsap.from(cards, { y: 30, opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.35, ease: "power2.out" });
      }
    }, containerRef);
    return () => ctx.revert();
  }, [loading, posts]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    gsap.to(submitBtnRef.current, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });
    try {
      const { data } = await api.post("/posts", { content, dog: dogId });
      setPosts((prev) => [data, ...prev]);
      setContent("");
      setIsTyping(false);
      gsap.to(submitBtnRef.current, {
        backgroundColor: "#4ADE80", duration: 0.25, yoyo: true, repeat: 1,
        onComplete: () => gsap.set(submitBtnRef.current, { clearProps: "backgroundColor" }),
      });
    } catch (err) { setError("Failed to create post"); }
  };

  const handleLike = async (postId) => {
    try {
      const { data } = await api.post(`/posts/${postId}/like`);
      setPosts((prev) => prev.map((post) =>
        post._id === postId
          ? { ...post, likes: data.likes, likesCount: data.likesCount, likedByUser: data.likedByUser }
          : post
      ));
    } catch (err) { console.error("Like failed", err); }
  };

  if (loading) {
    return (
      <div className="feed-loading">
        <div className="loading-dots">
          <span className="loading-dot" style={{ animationDelay: "0s" }} />
          <span className="loading-dot" style={{ animationDelay: "0.18s" }} />
          <span className="loading-dot" style={{ animationDelay: "0.36s" }} />
        </div>
        <p className="loading-text">Fetching doggy posts...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="feed-container">

      {/* Header */}
      <div className="feed-header">
        <h2 ref={titleRef} className="feed-title">Dogesh Feed</h2>
        <p ref={subtitleRef} className="feed-subtitle">Share your dog's adventures with the pack</p>
      </div>

      {error && <div className="feed-error">{error}</div>}

      {/* Create Post */}
      <div ref={formRef} className="create-post-card">
        <div className="form-top">
          <div className="form-avatar">
            {user?.name?.[0]?.toUpperCase() || "★"}
          </div>
          <div>
            <p className="form-title">What's your dog up to?</p>
            <p className="form-hint">Share a moment with the pack</p>
          </div>
        </div>

        <form onSubmit={handlePostSubmit}>
          <textarea
            className="post-textarea"
            placeholder="My dog just did the funniest thing..."
            value={content}
            onChange={(e) => { setContent(e.target.value); setIsTyping(e.target.value.length > 0); }}
            rows={3}
          />
          <div className="textarea-footer">
            <div className={`typing-dots ${isTyping ? "visible" : ""}`}>
              <span /><span /><span />
            </div>
            <span className={`char-count ${content.length > 450 ? "warn" : ""}`}>{content.length}/500</span>
          </div>
          <button ref={submitBtnRef} type="submit" disabled={!content.trim()} className={`submit-btn ${content.trim() ? "active" : ""}`}>
            Share with the Pack
          </button>
        </form>
      </div>

      {/* Posts */}
      <div className="posts-header">
        <h3 className="posts-title">Latest from the Pack</h3>
        <span className="posts-badge">{posts.length}</span>
      </div>

      <div ref={postsRef}>
        {posts.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No posts yet</p>
            <p className="empty-sub">Be the first to share something with the pack.</p>
            <button className="empty-btn" onClick={() => document.querySelector(".post-textarea")?.focus()}>
              Start sharing
            </button>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post._id} className="post-card-item">
                <PostCard post={post} userId={user._id} onLike={() => handleLike(post._id)} />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Feed;