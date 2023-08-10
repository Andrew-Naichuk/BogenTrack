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


// Google signup button functionality
googleLoginButton.addEventListener('click', async function(){
    // Attempting to sign in using Google auth popup
    try {
        await auth.signInWithPopup(providerGoogle);
    } catch (error) {
        createToastMessage('fail', error.message);
    }
});

// Sign Up Form Functionality
signUpButton.addEventListener('click', async function(){
    try {
        // Attempting to sign up using new account email and password inputs values
        await firebase.auth().createUserWithEmailAndPassword(signUpemailField.value, signUppasswordField.value)
    } catch (error) {
        createToastMessage('fail', error.message);
    }
});