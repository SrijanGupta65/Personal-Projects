import React, { useState, useRef } from 'react';

// Placeholder for actual icons/components if needed
const UploadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM19 18H6C3.79 18 2 16.21 2 14C2 11.95 3.53 10.24 5.56 10.03L6.63 9.92L7.13 8.97C8.08 7.14 9.94 6 12 6C14.62 6 16.88 7.86 17.39 10.43L17.69 11.93L19.22 12.04C20.78 12.14 22 13.45 22 15C22 16.65 20.65 18 19 18ZM8 13H10.55V16H13.45V13H16L12 9L8 13Z" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const AddPlantModal = ({ onClose, onAddPlant }) => {
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        waterFrequency: 'weekly',
        lightRequirement: 'partial shade'
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleWaterFrequencySelect = (frequency) => {
        setFormData(prev => ({
            ...prev,
            waterFrequency: frequency
        }));
    };

    const handleLightRequirementSelect = (requirement) => {
        setFormData(prev => ({
            ...prev,
            lightRequirement: requirement
        }));
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                file: 'Please select a valid image file (JPG or PNG)'
            }));
            return;
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setErrors(prev => ({
                ...prev,
                file: 'File size must be less than 5MB'
            }));
            return;
        }

        setSelectedFile(file);
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
        setErrors(prev => ({ ...prev, file: '' }));
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Plant name is required';
        }
        if (!formData.species.trim()) {
            newErrors.species = 'Species is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        // Create the new plant object
        const newPlant = {
            ...formData,
            image: previewUrl || null // Use the preview URL for the image
        };

        onAddPlant(newPlant);
    };

    // Cleanup preview URL when component unmounts
    React.useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <div className="add-plant-modal-overlay" onClick={handleOverlayClick}>
            <div className="add-plant-modal-content">
                <button className="modal-close-button" onClick={onClose} aria-label="Close add plant modal">
                    <CloseIcon />
                </button>
                <div className="modal-drag-handle-container">
                    <div className="modal-drag-handle"></div>
                </div>
                <h2 className="modal-title">Add a new plant</h2>
                
                <div className="form-group">
                    <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Plant name"
                        className={`form-input-modal ${errors.name ? 'error' : ''}`}
                    />
                    {errors.name && (
                        <div className="error-message">{errors.name}</div>
                    )}
                </div>

                <div className="form-group">
                    <input 
                        type="text"
                        name="species"
                        value={formData.species}
                        onChange={handleInputChange}
                        placeholder="Enter species (e.g., Basil, Snake Plant)"
                        className={`form-input-modal ${errors.species ? 'error' : ''}`}
                    />
                    {errors.species && (
                        <div className="error-message">{errors.species}</div>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/jpeg,image/png"
                    style={{ display: 'none' }}
                />

                <div 
                    className="form-group upload-section"
                    onClick={handleUploadClick}
                    style={{
                        position: 'relative',
                        height: previewUrl ? '200px' : 'auto',
                        border: '2px dashed #cccccc',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8f8f8'
                    }}
                >
                    {previewUrl ? (
                        <img 
                            src={previewUrl} 
                            alt="Plant preview" 
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    ) : (
                        <>
                            <UploadIcon />
                            <span>Upload Photo (JPG, PNG up to 5MB)</span>
                        </>
                    )}
                </div>
                {errors.file && (
                    <div className="error-message">{errors.file}</div>
                )}

                <div className="form-group">
                    <label className="form-label-modal">Water Frequency</label>
                    <div className="button-group">
                        <button 
                            type="button"
                            className={`option-button ${formData.waterFrequency === 'daily' ? 'active' : ''}`}
                            onClick={() => handleWaterFrequencySelect('daily')}
                        >
                            Daily
                        </button>
                        <button 
                            type="button"
                            className={`option-button ${formData.waterFrequency === 'weekly' ? 'active' : ''}`}
                            onClick={() => handleWaterFrequencySelect('weekly')}
                        >
                            Weekly
                        </button>
                        <button 
                            type="button"
                            className={`option-button ${formData.waterFrequency === 'bi-weekly' ? 'active' : ''}`}
                            onClick={() => handleWaterFrequencySelect('bi-weekly')}
                        >
                            Bi-Weekly
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label-modal">Light Requirements</label>
                    <div className="button-group">
                        <button 
                            type="button"
                            className={`option-button ${formData.lightRequirement === 'full sun' ? 'active' : ''}`}
                            onClick={() => handleLightRequirementSelect('full sun')}
                        >
                            Full Sun
                        </button>
                        <button 
                            type="button"
                            className={`option-button ${formData.lightRequirement === 'partial shade' ? 'active' : ''}`}
                            onClick={() => handleLightRequirementSelect('partial shade')}
                        >
                            Partial Shade
                        </button>
                        <button 
                            type="button"
                            className={`option-button ${formData.lightRequirement === 'low light' ? 'active' : ''}`}
                            onClick={() => handleLightRequirementSelect('low light')}
                        >
                            Low Light
                        </button>
                    </div>
                </div>
                
                <button 
                    className="submit-button-modal" 
                    onClick={handleSubmit}
                >
                    Add Plant
                </button> 
            </div>
        </div>
    );
};

export default AddPlantModal; 