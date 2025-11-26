import React, { useEffect } from 'react';
import './PostSubmissionAlert.css';

const PostSubmissionAlert = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="submission-alert">
      <div className="alert-content">
        <span className="alert-message">✓ {message}</span>
        <button className="alert-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default PostSubmissionAlert;