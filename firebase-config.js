// ==========================================
// FIREBASE CONFIG - GANTI DENGAN CONFIG KAMU
// ==========================================

// Copy config dari Firebase Console (Step 4 nanti)
const firebaseConfig = {
    apiKey: "GANTI-DENGAN-API-KEY-KAMU",
    authDomain: "GANTI-DENGAN-AUTH-DOMAIN-KAMU",
    projectId: "GANTI-DENGAN-PROJECT-ID-KAMU",
    storageBucket: "GANTI-DENGAN-STORAGE-BUCKET-KAMU",
    messagingSenderId: "GANTI-DENGAN-SENDER-ID-KAMU",
    appId: "GANTI-DENGAN-APP-ID-KAMU"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const db = firebase.firestore();
const storage = firebase.storage();

console.log("Firebase initialized successfully!");
