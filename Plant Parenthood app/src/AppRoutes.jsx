import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LogInPage from './pages/LogInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import CommunityForum from './pages/CommunityForum.jsx';
import RecommendPage from './pages/RecommendPage.jsx';
import MyCollectionPage from './pages/MyCollectionPage.jsx';
import SeedLocatorPage from './pages/SeedLocatorPage.jsx';

// Protected Route component
function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LogInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-collection"
        element={
          <ProtectedRoute>
            <MyCollectionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommend-page"
        element={
          <ProtectedRoute>
            <RecommendPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community-forum"
        element={
          <ProtectedRoute>
            <CommunityForum />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community-forum/post/:postId"
        element={
          <ProtectedRoute>
            <CommunityForum />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seed-page"
        element={
          <ProtectedRoute>
            <SeedLocatorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/plant/:plantId"
        element={
          <ProtectedRoute>
            <MyCollectionPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
} 