import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarColor, getAvatarLetter } from "../utils/getAvatarPlaceholder";
import api from "../api/axios";
import useAuth from "../context/useAuth";
import "../style/DogProfile.css";
import ImageUpload from "../components/ImageUpload";

const DogProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dog, setDog] = useState(null);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState();
  const [editAvatar, seteditAvatar] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [img, setImg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const { data } = await api.get("/dogs/me");
        setDog(data);
        setName(data.name || "");
        setBreed(data.breed || "");
        setAge(data.age || "");
        setAvatar(data.avatar || "");
      } catch (err) {
        if (err.response?.status === 404) {
          setDog(null);
        } else {
          console.error("Unexpected dog api error", err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      navigate("/login");
    } else {
      fetchDog();
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("breed", breed);
    formData.append("age", age);
    formData.append("avatar", img);

    try {
      if (dog) {
        const { data } = await api.put("/dogs/me", formData);
        setDog(data);
      } else {
        const { data } = await api.post("/dogs", formData);
        setDog(data);
      }
      setIsSubmitting(false);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setIsSubmitting(false);
    }
  };

  const handleAvatarClick = () => { seteditAvatar(true); setShowImageUpload(false); };
  const handleCloseModal = () => { seteditAvatar(false); setShowImageUpload(false); };
  const handleEditAvatar = () => setShowImageUpload(true);

  const handleDeleteAvatar = async () => {
    if (!dog) return;
    setDeleting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("avatar", "");
      const { data } = await api.put("/dogs/me", formData);
      setAvatar("");
      setDog(data);
      seteditAvatar(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete avatar");
    } finally {
      setDeleting(false);
    }
  };

  const handleNewData = (data) => {
    const form = data();
    setImg(form.file);
    if (form.file) {
      const url = URL.createObjectURL(form.file);
      setAvatar(url);
    }
  };

  if (loading) {
    return (
      <div className="dp-loading">
        <div className="loading-dots">
          <span className="loading-dot" style={{ animationDelay: "0s" }} />
          <span className="loading-dot" style={{ animationDelay: "0.18s" }} />
          <span className="loading-dot" style={{ animationDelay: "0.36s" }} />
        </div>
        <p className="loading-text">Loading dog profile...</p>
      </div>
    );
  }

  return (
    <div className="dp-container">

      {/* Header */}
      <div className="dp-header">
        <h1 className="dp-title">
          {dog ? "Update Dog Profile" : "Create Dog Profile"}
        </h1>
        <p className="dp-subtitle">
          {dog ? "Update your furry friend's information" : "Let's create a profile for your pup!"}
        </p>
      </div>

      {/* Error */}
      {error && <div className="dp-error">{error}</div>}

      {/* Form Card */}
      <div className="dp-card">
        <form onSubmit={handleSubmit} className="dp-form">

          {/* Avatar */}
          <div className="avatar-section" onClick={handleAvatarClick}>
            <div className="avatar-wrap">
              {avatar ? (
                <img className="avatar-img" src={avatar} alt="avatar" />
              ) : (
                <div className="avatar-placeholder" style={{ backgroundColor: getAvatarColor(name) }}>
                  {getAvatarLetter(name) || "🐶"}
                </div>
              )}
              <div className="avatar-edit-overlay">Edit</div>
            </div>
            <p className="avatar-hint">Click to change photo</p>
          </div>

          {/* Name */}
          <div className="dp-field">
            <label className="dp-label">Dog Name <span className="required">*</span></label>
            <input
              className="dp-input"
              type="text"
              placeholder="Enter your dog's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Breed */}
          <div className="dp-field">
            <label className="dp-label">Breed</label>
            <input
              className="dp-input"
              type="text"
              placeholder="e.g., Golden Retriever, Poodle"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Age */}
          <div className="dp-field">
            <label className="dp-label">Age</label>
            <input
              className="dp-input"
              type="number"
              placeholder="Age in years"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className={`dp-submit ${isSubmitting || !name.trim() ? "" : "active"}`}
          >
            {isSubmitting ? (
              <><span className="spinner" /> Processing...</>
            ) : (
              dog ? "Update Profile" : "Create Profile"
            )}
          </button>

        </form>
      </div>

      {/* Avatar Modal */}
      <div id="avatar-modal" className={editAvatar ? "" : "hide"}>
        <div className="modal-inner">
          <button className="modal-close" onClick={handleCloseModal} aria-label="Close">✕</button>

          {showImageUpload ? (
            <>
              <ImageUpload onReady={handleNewData} />
              <div className="modal-actions">
                <button className="modal-btn" onClick={() => setShowImageUpload(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              {avatar ? (
                <img className="modal-avatar-img" src={avatar} alt="avatar" />
              ) : (
                <div className="modal-avatar-placeholder" style={{ backgroundColor: getAvatarColor(name) }}>
                  {getAvatarLetter(name)}
                </div>
              )}
              <div className="modal-actions">
                <button className="modal-btn" onClick={handleEditAvatar}>Edit</button>
                <button className="modal-btn modal-btn-danger" onClick={handleDeleteAvatar} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .dp-input:focus {
          outline: none;
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 3px rgba(245,166,35,0.12);
          background: #fff;
        }
      `}</style>
    </div>
  );
};

export default DogProfile;