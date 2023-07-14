// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const providerGoogle = new firebase.auth.GoogleAuthProvider();
const analytics = firebase.analytics();

// Auth status observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        userEmailIndicator.innerText = auth.currentUser.email;
        getSessionsSnapshot();
        setTimeout(function(){
            let liveSessionsNumber = 0;
            sessionsSnapshot.forEach(session => {
                if (!session.status || session.status === 'live') {
                    liveSessionsNumber = ++liveSessionsNumber;
                }
            });
            userSessionsIndicator.innerText = liveSessionsNumber;
        }, 400);
    } else {
        let redirectLocation = loadedLocation + '/app/signin.html'
        window.location.replace(redirectLocation);
    }
});

// Sign Out Functionality
signOutButton.addEventListener('click', async function(){
    try {
        // Attempting to sign out using auth method
        firebase.auth().signOut();
    } catch (error) {
        createToastMessage('fail', error.message);
        console.log(error.message);
    }
});