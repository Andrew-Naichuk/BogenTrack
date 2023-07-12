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

// Sign Up Form Functionality
signUpButton.addEventListener('click', async function(){
    try {
        // Attempting to sign up using new account email and password inputs values
        await firebase.auth().createUserWithEmailAndPassword(signUpemailField.value, signUppasswordField.value)
    } catch (error) {
        window.alert(error);
    }
});