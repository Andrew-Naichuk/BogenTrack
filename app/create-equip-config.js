// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const providerGoogle = new firebase.auth.GoogleAuthProvider();
const analytics = firebase.analytics();

// Auth status observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {

    } else {
        let redirectLocation = loadedLocation + '/app/signin.html';
        window.location.replace(redirectLocation);
    }
});


// Canceling adding config functionality
cancelNewEquipConfigButton.addEventListener('click', function(){
    // Setting fields values back to default and navigating

    let redirectLocation = loadedLocation + '/app/profile.html';
    window.location.href = redirectLocation;
});