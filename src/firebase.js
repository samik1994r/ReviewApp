// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// Remove getAnalytics import if you're not using it
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8xH5FWI816NZVjA029mKg1ngUPe6iNyM",
  authDomain: "photoreviewpro.firebaseapp.com",
  projectId: "photoreviewpro",
  storageBucket: "photoreviewpro.appspot.com",
  messagingSenderId: "305744751617",
  appId: "1:305744751617:web:b6d7cc2dd6d9dbfc802400",
  measurementId: "G-02LDV56WPJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Remove this line if you're not using analytics
// const analytics = getAnalytics(app);

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(app);

export { storage };