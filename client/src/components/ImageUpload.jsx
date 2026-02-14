import React, { useState, useRef, useCallback , useEffect } from "react";

const ImageUpload = ({ 
  onImageChange, 
  maxSize = 2 * 1024 * 1024, // 2MB default
  acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  multiple = false,
  name = "image",
  onReady
}) => {
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Generate form data with the uploaded image
  const getFormData = useCallback(() => {
    const formData = new FormData();
    if (img) {
      formData.append(name, img);
    }
    return {"data": formData, "file":img};
  }, [img, name]);

  // Validate file
  const validateFile = (file) => {
    if (!acceptedFormats.includes(file.type)) {
      setError(`Invalid file format. Accepted formats: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`);
      return false;
    }

    if (file.size > maxSize) {
      const sizeInMB = (maxSize / (1024 * 1024)).toFixed(1);
      setError(`File too large. Maximum size: ${sizeInMB}MB`);
      return false;
    }

    setError("");
    return true;
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!validateFile(file)) return;

    setImg(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Callback with form data
    if (onImageChange) {
      const formData = new FormData();
      formData.append(name, file);
      onImageChange(formData, file);
    }
  };

  const handleImgUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleFileSelect(file);
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Clear image
  const handleClear = () => {
    setImg(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setError("");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (onImageChange) {
      onImageChange(new FormData(), null);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    onReady(getFormData);
  }, [getFormData]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="image-upload-container">
      <input
        ref={fileInputRef}
        type="file"
        className="img-input"
        onChange={handleImgUpload}
        accept={acceptedFormats.join(',')}
        multiple={multiple}
        style={{ display: 'none' }}
      />

      {!preview ? (
        <div
          className={`drop-zone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
          onClick={triggerFileInput}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="drop-zone-content">
            <svg
              className="upload-icon"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="drop-zone-text">
              <span className="browse-link">Click to upload</span> or drag and drop
            </p>
            <p className="drop-zone-subtext">
              {acceptedFormats.map(f => f.split('/')[1]).join(', ').toUpperCase()} 
              (Max. {(maxSize / (1024 * 1024)).toFixed(1)}MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="preview-container">
          <div className="preview-wrapper">
            <img 
              src={preview} 
              alt="Preview" 
              className="preview-image"
            />
            <div className="preview-overlay">
              <button
                type="button"
                className="change-button"
                onClick={triggerFileInput}
              >
                Change
              </button>
              <button
                type="button"
                className="remove-button"
                onClick={handleClear}
              >
                Remove
              </button>
            </div>
          </div>
          <div className="file-info">
            <p className="file-name">{img.name}</p>
            <p className="file-size">
              {(img.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      <style>{`
        .image-upload-container {
          max-width: 400px;
          margin: 0 auto;
        }

        .drop-zone {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background-color: #f9fafb;
        }

        .drop-zone:hover {
          border-color: #3b82f6;
          background-color: #f0f9ff;
        }

        .drop-zone.dragging {
          border-color: #3b82f6;
          background-color: #dbeafe;
        }

        .drop-zone.error {
          border-color: #ef4444;
        }

        .upload-icon {
          color: #9ca3af;
          margin-bottom: 16px;
        }

        .drop-zone:hover .upload-icon {
          color: #3b82f6;
        }

        .drop-zone-text {
          color: #374151;
          margin-bottom: 8px;
          font-size: 16px;
        }

        .browse-link {
          color: #3b82f6;
          font-weight: 500;
        }

        .drop-zone-subtext {
          color: #6b7280;
          font-size: 14px;
        }

        .preview-container {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          background-color: white;
        }

        .preview-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          overflow: hidden;
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .preview-wrapper:hover .preview-overlay {
          opacity: 1;
        }

        .change-button,
        .remove-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .change-button {
          background-color: white;
          color: #374151;
        }

        .change-button:hover {
          background-color: #f3f4f6;
        }

        .remove-button {
          background-color: #ef4444;
          color: white;
        }

        .remove-button:hover {
          background-color: #dc2626;
        }

        .file-info {
          padding: 12px 16px;
          border-top: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }

        .file-name {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .file-size {
          font-size: 12px;
          color: #6b7280;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          padding: 8px 12px;
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 4px;
          color: #dc2626;
          font-size: 14px;
        }

        .error-message svg {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};


export default ImageUpload;