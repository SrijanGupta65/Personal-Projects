import React, { useState, useEffect } from 'react';

export default function PlantLogModal({ plant, isOpen, onClose, onSave }) {
  const [soilMoisture, setSoilMoisture] = useState(plant?.soilMoisture || 50);
  const [sunExposure, setSunExposure] = useState(plant?.sunExposure || 50);
  const [overallHealth, setOverallHealth] = useState(plant?.overallHealth || 'Okay');
  const [notes, setNotes] = useState(plant?.notes || '');
  const [watered, setWatered] = useState(false);
  const [fertilized, setFertilized] = useState(false);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Update state when plant changes
  useEffect(() => {
    if (plant) {
      setSoilMoisture(plant.soilMoisture || 50);
      setSunExposure(plant.sunExposure || 50);
      setOverallHealth(plant.overallHealth || 'Okay');
      setNotes(plant.notes || '');
      setWatered(false);
      setFertilized(false);
    }
  }, [plant]);

  if (!isOpen || !plant) return null;

  const getSoilMoistureLabel = (value) => {
    if (value < 33) return 'Low';
    if (value < 67) return 'Medium';
    return 'High';
  };

  const getSunExposureLabel = (value) => {
    if (value < 25) return 'Shade';
    if (value < 50) return 'Partial Shade';
    if (value < 75) return 'Partial Sun';
    return 'Full Sun';
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    const logData = {
      plantId: plant.id,
      soilMoisture,
      sunExposure,
      overallHealth,
      notes,
      lastWatered: watered ? now : plant.lastWatered,
      lastFertilized: fertilized ? now : plant.lastFertilized,
      lastSunlight: sunExposure !== plant.sunExposure ? now : plant.lastSunlight,
      lastUpdated: now
    };
    onSave(logData);
    onClose();
  };

  const handleCancel = () => {
    // Reset form to initial values
    setSoilMoisture(plant?.soilMoisture || 50);
    setSunExposure(plant?.sunExposure || 50);
    setOverallHealth(plant?.overallHealth || 'Okay');
    setNotes(plant?.notes || '');
    setWatered(false);
    setFertilized(false);
    onClose();
  };

  return (
    <div 
      className="plant-log-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <div 
        className="plant-log-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '30px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            padding: '5px'
          }}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Plant name and subtitle */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#333', 
            margin: '0 0 5px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {plant.name}, {plant.type}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </h2>
          <p style={{ color: '#888', margin: 0, fontSize: '16px' }}>Log your plant's progress</p>
        </div>

        {/* Soil Moisture */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '16px', color: '#333', fontWeight: '500' }}>Soil Moisture</span>
            <span style={{ fontSize: '16px', color: '#666' }}>{getSoilMoistureLabel(soilMoisture)}</span>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type="range"
              min="0"
              max="100"
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: `linear-gradient(to right, #4a8c4a 0%, #4a8c4a ${soilMoisture}%, #e0e0e0 ${soilMoisture}%, #e0e0e0 100%)`,
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none'
              }}
            />
            <style>
              {`
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #4a8c4a;
                  cursor: pointer;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                input[type="range"]::-moz-range-thumb {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #4a8c4a;
                  cursor: pointer;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
              `}
            </style>
          </div>
        </div>

        {/* Sun Exposure */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '16px', color: '#333', fontWeight: '500' }}>Sun Exposure</span>
            <span style={{ fontSize: '16px', color: '#666' }}>{getSunExposureLabel(sunExposure)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sunExposure}
            onChange={(e) => setSunExposure(parseInt(e.target.value))}
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              background: `linear-gradient(to right, #4a8c4a 0%, #4a8c4a ${sunExposure}%, #e0e0e0 ${sunExposure}%, #e0e0e0 100%)`,
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none'
            }}
          />
        </div>

        {/* Overall Health */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '16px', color: '#333', fontWeight: '500', marginBottom: '15px' }}>Overall Health</h3>
          <div className="health-selection" style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            {['Poor', 'Okay', 'Great'].map((health) => (
              <button
                key={health}
                className="health-button"
                onClick={() => setOverallHealth(health)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '15px',
                  border: overallHealth === health ? '3px solid #4a8c4a' : '2px solid #e0e0e0',
                  borderRadius: '12px',
                  background: 'white',
                  cursor: 'pointer',
                  minWidth: '80px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>
                  {health === 'Poor' ? '☹️' : health === 'Okay' ? '😐' : '😊'}
                </div>
                <span style={{ fontSize: '14px', color: '#666' }}>{health}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginBottom: '30px', display: 'flex', gap: '15px' }}>
          <button
            onClick={() => setWatered(!watered)}
            style={{
              flex: 1,
              padding: '15px',
              border: watered ? '2px solid #2962ff' : '2px solid #e0e0e0',
              borderRadius: '12px',
              background: watered ? 'rgba(41, 98, 255, 0.1)' : 'white',
              color: '#333',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Water Plant
          </button>
          <button
            onClick={() => setFertilized(!fertilized)}
            style={{
              flex: 1,
              padding: '15px',
              border: fertilized ? '2px solid #43a047' : '2px solid #e0e0e0',
              borderRadius: '12px',
              background: fertilized ? 'rgba(67, 160, 71, 0.1)' : 'white',
              color: '#333',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Fertilize Plant
          </button>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ fontSize: '16px', color: '#333', fontWeight: '500', marginBottom: '10px', display: 'block' }}>
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., noticed some yellow leaves, repotted today..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '15px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              fontSize: '14px',
              resize: 'vertical',
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4a8c4a'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        {/* Action Buttons */}
        <div className="action-buttons" style={{ display: 'flex', gap: '15px', justifyContent: 'center', width: '100%', padding: '0' }}>
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              width: '100%',
              padding: '15px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              background: 'white',
              color: '#666',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              width: '100%',
              padding: '15px',
              border: 'none',
              borderRadius: '12px',
              background: '#4a8c4a',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
} 