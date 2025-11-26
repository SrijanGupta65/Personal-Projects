// components/AddReminderModal.js
import React, { useState } from 'react';

export default function AddReminderModal({ plant, onClose, onSave }) {
    const [type, setType] = useState('water');
    const [frequency, setFrequency] = useState(7);
    const [notes, setNotes] = useState('');
    const [nextDue, setNextDue] = useState(new Date());

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            plantId: plant.id,
            type,
            frequency: parseInt(frequency),
            notes,
            nextDue: new Date(nextDue)
        });
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '18px',
                padding: '24px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <h2 style={{ color: '#205624', marginTop: 0 }}>Add Reminder for {plant.name}</h2>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Reminder Type</label>
                        <select 
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        >
                            <option value="water">Watering</option>
                            <option value="fertilize">Fertilizing</option>
                            <option value="soil">Soil Change</option>
                            <option value="prune">Pruning</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Frequency (days)</label>
                        <input
                            type="number"
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            min="1"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Next Due Date</label>
                        <input
                            type="date"
                            value={nextDue.toISOString().split('T')[0]}
                            onChange={(e) => setNextDue(new Date(e.target.value))}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '16px',
                                minHeight: '80px'
                            }}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: '1px solid #205624',
                                background: 'transparent',
                                color: '#205624',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#205624',
                                color: '#fff',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Save Reminder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}