import React, { useState } from 'react';
import './NewPost.css';

const NewPost = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.content.trim()) newErrors.content = 'Content is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            onSubmit({
                title: formData.title,
                content: formData.content,
                tags: formData.tags
            });
            // Reset form after submission
            setFormData({
                title: '',
                content: '',
                tags: ''
            });
        }
    };

    return (
        <div className="new-post-modal">
            <div className="new-post-content">
                <div className="new-post-header">
                    <h2>Create New Post</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={errors.title ? 'error' : ''}
                            placeholder="What's your post about?"
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className={errors.content ? 'error' : ''}
                            rows="6"
                            placeholder="Share your plant knowledge or ask a question..."
                        />
                        {errors.content && <span className="error-message">{errors.content}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Tags (optional)</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="e.g., pests, propagation, indoor-plants"
                        />
                        <small className="hint">Separate tags with commas</small>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Post to Community
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewPost;