import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import AddPlantModal from '../components/AddPlantModal';
import PlantLogModal from '../components/PlantLogModal';
import PlantStatusIndicators from '../components/PlantStatusIndicators';
import { usePlants } from '../context/PlantContext';

// Example images (replace with your own assets as needed)
import mintImg from '../assets/img/vegetation.png';
import tomatoImg from '../assets/img/fruits.png';
import beansImg from '../assets/img/peas.png';

export default function HomePage() {
    const [isAddPlantModalOpen, setIsAddPlantModalOpen] = useState(false);
    const [isPlantLogModalOpen, setIsPlantLogModalOpen] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const { myPlants, addPlants, updatePlant, removePlant, error, clearError } = usePlants();

    // Clear error when component unmounts
    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    const generateReminders = () => {
        if (!myPlants) return [];
        const reminders = [];
        const now = new Date();

        myPlants.forEach(plant => {
            if (plant.lastWatered) {
                const lastWateredDate = new Date(plant.lastWatered);
                const daysSinceWatered = (now - lastWateredDate) / (1000 * 60 * 60 * 24);
                if (daysSinceWatered > 7) {
                    reminders.push({
                        id: `${plant.id}-water`,
                        plantName: plant.name,
                        plantImage: plant.image,
                        message: "Time to water your plant!"
                    });
                }
            }

            if (plant.lastFertilized) {
                const lastFertilizedDate = new Date(plant.lastFertilized);
                const daysSinceFertilized = (now - lastFertilizedDate) / (1000 * 60 * 60 * 24);
                if (daysSinceFertilized > 28) {
                    reminders.push({
                        id: `${plant.id}-fertilize`,
                        plantName: plant.name,
                        plantImage: plant.image,
                        message: "Don't forget to fertilize!"
                    });
                }
            }
        });

        return reminders;
    };

    const handleAddPlant = (newPlant) => {
        // Add default values and generate ID
        const plantToAdd = {
            ...newPlant,
            id: Date.now(),
            soilMoisture: 50,
            sunExposure: 50,
            overallHealth: 'Good',
            notes: ''
        };

        addPlants([plantToAdd]);
        setIsAddPlantModalOpen(false);
    };

    const handleDeletePlant = (e, plantId) => {
        e.stopPropagation(); // Prevent opening the plant log modal
        if (window.confirm('Are you sure you want to delete this plant?')) {
            removePlant(plantId);
        }
    };

    const openAddPlantModal = () => setIsAddPlantModalOpen(true);
    const closeAddPlantModal = () => setIsAddPlantModalOpen(false);

    const openPlantLogModal = (plant) => {
        setSelectedPlant(plant);
        setIsPlantLogModalOpen(true);
    };

    const closePlantLogModal = () => {
        setIsPlantLogModalOpen(false);
        setSelectedPlant(null);
    };

    const handleSavePlantLog = (logData) => {
        updatePlant(logData.plantId, {
            soilMoisture: logData.soilMoisture,
            sunExposure: logData.sunExposure,
            overallHealth: logData.overallHealth,
            notes: logData.notes,
            lastWatered: logData.lastWatered,
            lastFertilized: logData.lastFertilized,
            lastSunlight: logData.lastSunlight,
            lastUpdated: logData.lastUpdated
        });
        closePlantLogModal();
    };

    return (
        <>
            <NavBar />
            <style>{`
                .responsive-flex-container {
                    display: flex;
                    width: 100%;
                    flex-direction: row;
                    gap: 100px;
                }
                @media (max-width: 1023px) {
                    .responsive-flex-container {
                        flex-direction: column-reverse;
                        gap: 0;
                    }
                }
                .home-page-main {
                    padding: 0 30px;
                }
                @media (min-width: 1024px) {
                    .home-page-main {
                        padding: 0 130px;
                    }
                }
            `}</style>
            <main className="mobile-home-container home-page-main" style={{ background: '#d3ddca', minHeight: '100vh', paddingBottom: 24 }}>
                {error && (
                    <div 
                        role="alert" 
                        style={{ 
                            background: '#ffebee', 
                            color: '#c62828', 
                            padding: '12px 20px', 
                            borderRadius: '8px', 
                            marginBottom: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <span>{error}</span>
                        <button 
                            onClick={clearError}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#c62828',
                                cursor: 'pointer',
                                padding: '4px 8px',
                                fontSize: '20px'
                            }}
                            aria-label="Dismiss error message"
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="responsive-flex-container">
                    {/* My Plants Section */}
                    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0' }}>
                            <h2 style={{ color: '#205624', fontWeight: 700, fontSize: '1.5rem', margin: 0 }}>My Plants</h2>
                            <button 
                                className="add-plant-button"
                                onClick={openAddPlantModal}
                                style={{ fontSize: 4 }}
                                aria-label="Add new plant"
                            >
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44771 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44771 11 8 11H11V8Z" fill="currentColor" />
                                    <path className="svg-border-path" fillRule="evenodd" clipRule="evenodd" d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4Z" fill="#205624" />
                                </svg>
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {myPlants.map((plant) => (
                                <div 
                                    key={plant.id} 
                                    onClick={() => openPlantLogModal(plant)}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        background: '#fff', 
                                        borderRadius: 18, 
                                        padding: 12, 
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)', 
                                        gap: 12,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0px)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`View details for ${plant.name}`}
                                >
                                    <img src={plant.image} alt={plant.name} style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 22, color: '#205624', marginBottom: 2 }}>{plant.name}</div>
                                        <div style={{ fontSize: 13, color: '#205624', letterSpacing: 8, fontWeight: 500, marginBottom: 6 }}>{plant.species.toUpperCase()}</div>
                                        <PlantStatusIndicators
                                            lastWatered={plant.lastWatered}
                                            lastSunlight={plant.lastSunlight}
                                            lastUpdated={plant.lastUpdated}
                                            sunExposure={plant.sunExposure}
                                        />
                                    </div>
                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => handleDeletePlant(e, plant.id)}
                                        style={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            background: 'none',
                                            border: 'none',
                                            padding: 8,
                                            cursor: 'pointer',
                                            borderRadius: 4,
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(220, 53, 69, 0.1)';
                                            e.currentTarget.querySelector('svg').style.stroke = '#dc3545';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'none';
                                            e.currentTarget.querySelector('svg').style.stroke = '#666';
                                        }}
                                        aria-label="Delete plant"
                                    >
                                        <svg 
                                            width="20" 
                                            height="20" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="#666" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                            style={{ transition: 'stroke 0.2s ease' }}
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                            <line x1="10" y1="11" x2="10" y2="17" />
                                            <line x1="14" y1="11" x2="14" y2="17" />
                                        </svg>
                                    </button>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#205624" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 24 }}><polyline points="9 6 15 12 9 18" /></svg>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Reminders Section */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }} >
                        <h2 style={{ color: '#205624', fontWeight: 700, fontSize: '1.5rem', margin: '12px 0' }}>Reminders</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                            {(() => {
                                const reminders = generateReminders();
                                if (reminders.length > 0) {
                                    return reminders.map(reminder => (
                                        <div key={reminder.id} style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 18, padding: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', position: 'relative' }}>
                                            <img src={reminder.plantImage} alt={reminder.plantName} style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', marginRight: 12 }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 700, fontSize: 20, color: '#205624' }}>{reminder.plantName}</div>
                                                <div style={{ fontSize: 15, color: '#4a5a4a' }}>{reminder.message}</div>
                                            </div>
                                            <span style={{ position: 'absolute', top: 8, right: 8, background: '#e53935', color: '#fff', borderRadius: 6, fontWeight: 700, fontSize: 16, padding: '2px 8px' }}>!</span>
                                        </div>
                                    ));
                                } else {
                                    return (
                                        <div style={{ background: '#fff', borderRadius: 18, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', textAlign: 'center', color: '#205624' }}>
                                            You're all good to go today! No reminders.
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Modals */}
            {isAddPlantModalOpen && (
                <AddPlantModal 
                    onClose={closeAddPlantModal}
                    onAddPlant={handleAddPlant}
                />
            )}
            
            <PlantLogModal
                plant={selectedPlant}
                isOpen={isPlantLogModalOpen}
                onClose={closePlantLogModal}
                onSave={handleSavePlantLog}
            />
            
            <Footer />
        </>
    );
} 