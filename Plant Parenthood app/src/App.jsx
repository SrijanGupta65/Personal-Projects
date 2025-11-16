import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { PlantProvider } from './context/PlantContext';
import AppRoutes from './AppRoutes';

export default function App() {
  return (
    <Router>
      <UserProvider>
        <PlantProvider>
          <AppRoutes />
        </PlantProvider>
      </UserProvider>
    </Router>
  );
}