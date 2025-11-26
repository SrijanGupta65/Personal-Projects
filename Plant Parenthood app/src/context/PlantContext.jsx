import React, { createContext, useContext, useState } from 'react';
import { handleFirebaseError } from '../firebase';

const PlantContext = createContext();

export function usePlants() {
  return useContext(PlantContext);
}

export function PlantProvider({ children }) {
  // Initialize state from localStorage
  const [myPlants, setMyPlants] = useState(() => {
    try {
      const savedPlants = localStorage.getItem('myPlants');
      return savedPlants ? JSON.parse(savedPlants) : [];
    } catch (error) {
      return [];
    }
  });

  const [error, setError] = useState(null);

  const addPlants = (newPlants) => {
    try {
      setMyPlants(prevPlants => {
        // Get existing plants from localStorage to ensure we have the most recent state
        let currentPlants;
        try {
          const savedPlants = localStorage.getItem('myPlants');
          currentPlants = savedPlants ? JSON.parse(savedPlants) : prevPlants;
        } catch (error) {
          currentPlants = prevPlants;
        }

        // Add timestamps to new plants
        const now = new Date().toISOString();
        const plantsWithTimestamps = newPlants.map(plant => ({
          ...plant,
          lastWatered: now,
          lastSunlight: now,
          lastFertilized: now,
          lastUpdated: now
        }));

        // Filter out any duplicates based on name
        const uniqueNewPlants = plantsWithTimestamps.filter(newPlant => 
          !currentPlants.some(existingPlant => existingPlant.name === newPlant.name)
        );
        
        // Combine existing plants with new unique plants
        const updatedPlants = [...currentPlants, ...uniqueNewPlants];
        
        // Save to localStorage
        try {
          localStorage.setItem('myPlants', JSON.stringify(updatedPlants));
        } catch (error) {
          setError(handleFirebaseError(error, 'saving plants'));
        }
        
        return updatedPlants;
      });
    } catch (error) {
      setError(handleFirebaseError(error, 'adding plants'));
    }
  };

  const removePlant = (plantId) => {
    try {
      setMyPlants(prevPlants => {
        const updatedPlants = prevPlants.filter(plant => plant.id !== plantId);
        try {
          localStorage.setItem('myPlants', JSON.stringify(updatedPlants));
        } catch (error) {
          setError(handleFirebaseError(error, 'removing plant'));
        }
        return updatedPlants;
      });
    } catch (error) {
      setError(handleFirebaseError(error, 'removing plant'));
    }
  };

  const updatePlant = (plantId, updates) => {
    try {
      setMyPlants(prevPlants => {
        const updatedPlants = prevPlants.map(plant => 
          plant.id === plantId ? { ...plant, ...updates } : plant
        );
        try {
          localStorage.setItem('myPlants', JSON.stringify(updatedPlants));
        } catch (error) {
          setError(handleFirebaseError(error, 'updating plant'));
        }
        return updatedPlants;
      });
    } catch (error) {
      setError(handleFirebaseError(error, 'updating plant'));
    }
  };

  const clearError = () => setError(null);

  return (
    <PlantContext.Provider value={{ myPlants, addPlants, removePlant, updatePlant, error, clearError }}>
      {children}
    </PlantContext.Provider>
  );
}