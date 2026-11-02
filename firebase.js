import { initializeApp } from
"https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";


const firebaseConfig = { 
  apiKey: "AIzaSyBKGzj7NdW0UyeslAxw4YeCOlfgRHEXKdE", 
  authDomain: "travelease-2baf4.firebaseapp.com", 
  projectId: "travelease-2baf4", 
  storageBucket: "travelease-2baf4.firebasestorage.app", 
  messagingSenderId: "1060310844129", 
  appId: "1:1060310844129:web:41693d2875d91bfb0eeda0", 
  measurementId: "G-N7G8QKJFLW" 
}; 


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);