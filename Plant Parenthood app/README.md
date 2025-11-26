# Plant Parenthood 🌱

Link to the website: https://plant-parenthood-3a5c5.web.app/login

You can use the following credentials to sign in to check out the application

Username: GuestUser1
Password: GuestUser1

Disclaimer: This site is powered by mock data and was built purely as a learning exercise.

Plant Parenthood is a comprehensive plant management and community platform designed to help plant enthusiasts track their plants, connect with other plant lovers, and discover new plants to grow.

## Core Features

### Plant Management
- **Dashboard/Homepage** (`/home`)
  - Central hub for managing your plant collection
  - Plant cards showing:
    - Plant image and name
    - Species information
    - Health status indicators
    - Last care dates (watering, sunlight, etc.)
  - Add new plants manually
  - Delete plants from collection
  - Track plant health metrics
  - Plant care logging system

### Plant Care Tracking
- **Care Logging System**
  - Record plant care activities
  - Track soil moisture levels
  - Monitor sun exposure
  - Log overall plant health
  - Record watering and fertilizing dates
  - Add care notes and observations

### Community Features
- **Community Forum** (`/community-forum`)
  - Create and share plant-related posts
  - Like and save posts
  - Comment on posts
  - Edit/delete own posts and comments
  - Filter posts by:
    - Popular posts
    - My posts
    - Liked posts
    - Saved posts
  - Search functionality
  - Tag system for categorizing posts

### Plant Discovery
- **Plant Recommendations** (`/recommend-page`)
  - Personalized plant suggestions
  - Filter by difficulty level
  - Seasonal recommendations
  - Care requirement matching

- **Seed Finder** (`/seed-page`)
  - List of local seed shops and nurseries
  - Shop information and details
  - Location-based search

## User Experience

### Plant Collection Management
- Add plants from My Collection or manually
- Track plant health and care history
- Set and receive care reminders
- Delete plants from collection
- Log plant care activities

### Community Engagement
- Create and share plant-related posts
- Interact with other users' content
- Save interesting posts
- Build a network of plant enthusiasts

### Resource Access
- Find local seed shops
- Get personalized plant recommendations
- Access care guides and tips
- Track seasonal planting information

## Technical Implementation

### Frontend
- React for the frontend
- React Router for navigation
- Context API for state management:
  - UserContext for user authentication
  - PlantContext for plant management
- Protected routes for authenticated content
- Responsive design for all screen sizes
- Local storage for persistent data:
  - User sessions
  - Saved posts
  - Plant reminders
  - User preferences

### Security Features
- Protected routes requiring authentication
- Secure user sessions
- Private user data protection
- Secure password handling

### Data Persistence
- Local storage for:
  - User authentication state
  - Plant collection data
  - Community forum posts and interactions
  - Plant care reminders
  - User preferences and settings



