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
        let redirectLocation = loadedLocation + '/app/signin.html';
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


// Add new equipment config functionality
createNewEquipmentConfigButton.addEventListener('click', () => {
    let redirectLocation = loadedLocation + '/app/create-equip-config.html';
    window.location.href = redirectLocation;
});

// Download data functionality
downloadDataButton.addEventListener('click', () => {
    getSessionsSnapshot();
    setTimeout(()=>{
        // Convert the variable to a JSON string
        const jsonString = JSON.stringify(sessionsSnapshot, null, 2);

        // Create a Blob from the JSON string
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.download = 'data.json'; // Set the file name
        downloadLink.href = URL.createObjectURL(blob);

        // Trigger a click event on the download link
        downloadLink.click();

        // Clean up the URL object
        URL.revokeObjectURL(downloadLink.href);
    }, 700)
});