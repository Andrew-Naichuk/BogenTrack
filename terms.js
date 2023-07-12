// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHY-cawV60DzQIbS21E7atrU6BAdyVtGg",
    authDomain: "bogentrack.firebaseapp.com",
    projectId: "bogentrack",
    storageBucket: "bogentrack.appspot.com",
    messagingSenderId: "673595653369",
    appId: "1:673595653369:web:06cef8e7e7e4d4dfbf7628",
    measurementId: "G-QR4TSG9K78"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();
const analytics = firebase.analytics();