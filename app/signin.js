// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const providerGoogle = new firebase.auth.GoogleAuthProvider();
const analytics = firebase.analytics();

// Auth status observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        let redirectLocation = loadedLocation + '/app/home.html'
        window.location.replace(redirectLocation);
    }
});

// Log In Form Functionality
logInButton.addEventListener('click', async function(){
    // Attempting to sign in using email and password inputs values
    try {
        await firebase.auth().signInWithEmailAndPassword(logInEmailField.value, logInPasswordField.value);
    } catch (error) {
        window.alert(error);
    }
});

logInGoogleButton.addEventListener('click', async function(){
    // Attempting to sign in using Google auth popup
    try {
        await auth.signInWithPopup(providerGoogle);
    } catch (error) {
        window.alert(error);
    }
});