// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "plant-parenthood-3a5c5.firebaseapp.com",
  projectId: "plant-parenthood-3a5c5",
  storageBucket: "plant-parenthood-3a5c5.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();

// Error handling wrapper for Firebase operations
export const handleFirebaseError = (error, operation) => {
  let errorMessage = 'An error occurred';
  
  switch (error.code) {
    case 'permission-denied':
      errorMessage = 'You do not have permission to perform this operation';
      break;
    case 'not-found':
      errorMessage = 'The requested resource was not found';
      break;
    case 'already-exists':
      errorMessage = 'This resource already exists';
      break;
    case 'unauthenticated':
      errorMessage = 'Please log in to perform this operation';
      break;
    default:
      errorMessage = `Error during ${operation}: ${error.message}`;
  }
  
  return errorMessage;
};

export default firebase;