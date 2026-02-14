import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarColor, getAvatarLetter } from "../utils/GetAvatarPlaceholder";
import api from "../api/axios";
import useAuth from "../context/useAuth";
import "../style/DogProfile.css"
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

  // Fetch existing dog profile
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
          setDog(null); // expected state
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

    // multipart data 
    const formData = new FormData();
    formData.append("name" , name);
    formData.append("breed" , breed);
    formData.append("age" , age);
    formData.append("avatar" , img);

    try {
      if (dog) {
        // Update existing dog
        const { data } = await api.put("/dogs/me", formData);
        setDog(data);
      } else {
        // Create new dog
        const { data } = await api.post("/dogs", formData);
        setDog(data);
      }

      // After dog exists, go to feed
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleAvatarClick = (e) => {
    seteditAvatar(true);
    setShowImageUpload(false);
  }

  const handleCloseModal = () => {
    seteditAvatar(false);
    setShowImageUpload(false);
  };

  const handleEditAvatar = () => {
    setShowImageUpload(true);
  };

  const handleDeleteAvatar = async () => {
    if (!dog) return;
    setDeleting(true);
    setError("");
    try {
      // Use update API to clear avatar and avatarPublicId
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

  // const handleOutsideClick = () =>{
  // }

  const handleNewData = (data) => {
    const form = data();
    setImg(form.file);
    // setShowImageUpload(false);
    // Optionally, update avatar preview immediately
    if (form.file) {
      const url = URL.createObjectURL(form.file);
      setAvatar(url);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: "20px"
      }}>
        <div style={{ display: "flex", gap: "15px" }}>
          {["🐕", "🐩", "🐕‍🦺"].map((dogEmoji, i) => (
            <span key={i} style={{
              fontSize: "40px",
              animation: `bounce 1s infinite ${i * 0.2}s`
            }}>
              {dogEmoji}
            </span>
          ))}
        </div>
        <p style={{ color: "var(--text-medium, #718096)" }}>
          Loading dog profile...
        </p>
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto 40px",
      padding: "30px 20px"
    }} >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{
          color: "var(--primary-blue, #4A6FA5)",
          fontSize: "2rem",
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px"
        }}>
          <span style={{ animation: "float 3s infinite" }}>🐶</span>
          {dog ? "Update Dog Profile" : "Create Dog Profile"}
        </h1>
        <p style={{ color: "var(--text-medium, #718096)" }}>
          {dog ? "Update your furry friend's information" : "Let's create a profile for your dog!"}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: "rgba(255, 138, 122, 0.1)",
          border: "1px solid var(--secondary-coral, #FF8A7A)",
          color: "var(--secondary-coral-dark, #E87A6A)",
          padding: "12px 16px",
          borderRadius: "12px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* Form Card */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "30px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        border: "1px solid var(--border-light, #E2E8F0)"
      }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Avatar */}
          <div id="avtarDiv" style={{textAlign:"center",display:"flex", justifyContent:"center", cursor:"pointer"}} onClick={handleAvatarClick}>
            {avatar ?  <img className="avtar-img" src={avatar} alt="avatar-image" width={"100px"} height={"100px"} style={{objectFit:"cover", borderRadius:"var(--radius-circle, 50%)"}}/> :  <div
          className="dog-avatar"
          style={{
              backgroundColor: getAvatarColor(name),
            }}
          >
            {getAvatarLetter(name)}
          </div>}
           

          </div>
          
          {/* Name Field */}
          <div>
            <label style={{
              marginBottom: "8px",
              fontWeight: "600",
              color: "var(--text-dark, #2D3748)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            >
              <span>🐕</span>
              Dog Name *
            </label>
            <input
              type="text"
              placeholder="Enter your dog's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
              style={{
                width: "calc(100% - 35px)",
                padding: "12px 16px",
                border: "2px solid var(--border-light, #E2E8F0)",
                borderRadius: "12px",
                fontSize: "16px",
                transition: "all 0.3s ease"
              }}
            />
          </div>

          {/* Breed Field */}
          <div>
            <label style={{
              marginBottom: "8px",
              fontWeight: "600",
              color: "var(--text-dark, #2D3748)",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <span>🏷️</span>
              Breed
            </label>
            <input
              type="text"
              placeholder="e.g., Golden Retriever, Poodle"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: "calc(100% - 35px)",
                padding: "12px 16px",
                border: "2px solid var(--border-light, #E2E8F0)",
                borderRadius: "12px",
                fontSize: "16px",
                transition: "all 0.3s ease"
              }}
            />
          </div>

          {/* Age Field */}
          <div>
            <label style={{
              marginBottom: "8px",
              fontWeight: "600",
              color: "var(--text-dark, #2D3748)",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <span>🎂</span>
              Age
            </label>
            <input
              type="number"
              placeholder="Age in years"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: "calc(100% - 35px)",
                padding: "12px 16px",
                border: "2px solid var(--border-light, #E2E8F0)",
                borderRadius: "12px",
                fontSize: "16px",
                transition: "all 0.3s ease"
              }}
            />
          </div>

          {/* Avatar Field */}
          {/* <div className="hide">
            <input
              id="avtar-url"
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: "calc(100% - 35px)",
                padding: "12px 16px",
                border: "2px solid var(--border-light, #E2E8F0)",
                borderRadius: "12px",
                fontSize: "16px",
                transition: "all 0.3s ease"
              }}
            />
          </div> */}

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isSubmitting || !name.trim()}
            style={{
              backgroundColor: isSubmitting ? "var(--border-light, #E2E8F0)" : "var(--primary-blue, #4A6FA5)",
              color: "white",
              border: "none",
              padding: "16px 24px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isSubmitting || !name.trim() ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            {isSubmitting ? (
              <>
                <span style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "50%",
                  borderTopColor: "white",
                  animation: "spin 1s linear infinite"
                }}></span>
                Processing...
              </>
            ) : (
              <>
                {dog ? "Update Profile" : "Create Profile"}
              </>
            )}
          </button>
        </form>
      </div>

      {/* Avatar Modal */}
      <div id="avatar-modal" className={editAvatar ? "" : "hide"}>
        <div className="modal-inner" style={{ position: "relative", padding: "24px 16px 16px 16px", zIndex: 2000 }}>
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "transparent",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#4A6FA5",
              zIndex: 2
            }}
            aria-label="Close"
          >
            ×
          </button>
          {/* Avatar Preview or ImageUpload */}
          {showImageUpload ? (
            <>
              <div style={{ margin: "0 auto 12px auto" }}>
                <ImageUpload onReady={handleNewData} />
              </div>
              <div className="modal-action-btns">
                <button
                  onClick={() => setShowImageUpload(false)}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {avatar ? (
                <img className="avtar-img-scaled" src={avatar} alt="avatar-image" width={"100px"} />
              ) : (
                <div
                  className="dog-avatar-scaled"
                  style={{ backgroundColor: getAvatarColor(name) }}
                >
                  {getAvatarLetter(name)}
                </div>
              )}
              {/* Action Buttons */}
              <div className="modal-action-btns">
                <button
                  onClick={handleEditAvatar}
                  type="button"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteAvatar}
                  type="button"
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input:focus {
          outline: none;
          border-color: var(--primary-blue, #4A6FA5) !important;
          box-shadow: 0 0 0 3px rgba(74, 111, 165, 0.1);
        }
      `}</style>
    </div>
  );
};

export default DogProfile;
