// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const providerGoogle = new firebase.auth.GoogleAuthProvider();
const analytics = firebase.analytics();

// Auth status observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Populating edit screen with data of currently selected section
        (async function(){
            try {
                // Get reference to the user document in the btUsers collection
                const docRef = db.collection("btUsers").doc(auth.currentUser.uid);
                // Retrieve the document from the database
                const doc = await docRef.get();
                sessionsSnapshot = doc.data().sessions;

                let sessionExists = false;

                // Find currently selected session in DB and populate inputs with its data
                sessionsSnapshot.forEach(session => {
                    if (session.uid === window.location.search.replace('?','')) {

                        sessionExists = true;

                        updateSessionDateField.value = session.date;
                        if (session.distance) {
                            updateSessionDistanceField.value = session.distance;
                        } else {
                            updateSessionDistanceField.value = '';
                        };
                        updateSessionCommentField.value = session.comment;
                    }
                });
                
                // Check if needed session was found for redirect to 404 if not
                if (sessionExists === false) {
                    let redirectLocation = loadedLocation + '/404.html';
                    window.location.replace(redirectLocation);
                };
            } catch (error) {
                window.alert(error)
            }
        })();
    } else {
        let redirectLocation = loadedLocation + '/app/signin.html'
        window.location.replace(redirectLocation);
    }
});


// Canceling updating session functionality
cancelUpdatedSessionButton.addEventListener('click', function(){
    updateSessionDateField.value = '';
    updateSessionDistanceField.value = '';
    updateSessionCommentField.value = '';
    let redirectLocation = loadedLocation + '/app/session.html?' + window.location.search.replace('?','');
    window.location.href = redirectLocation;
});


// Distance field validation functionality for update session
// It should not be allowed to set negative or zero distance
updateSessionDistanceField.addEventListener('input', function(){
    if (updateSessionDistanceField.value < 1) {
        updateSessionDistanceField.value = 1;
    }
});


// Update Session Functionality
saveUpdatedSessionButton.addEventListener('click', function(){
    // Preparing updated session snapshot with new values from user inputs
    sessionsSnapshot.forEach(session => {
        if (session.uid === window.location.search.replace('?','')){
            if (updateSessionDateField.value.length === 10) {
                session.status = 'live';
                session.date = updateSessionDateField.value;
                session.distance = updateSessionDistanceField.value;
                session.comment = updateSessionCommentField.value.replace(/</g, '(').replace(/>/g, ')');
    
                // Asynchronous function for database operations
                (async function(){
                    try {
                        // Pushing updated session object to the DB by updating the sessions array field
                        await db.collection("btUsers").doc(auth.currentUser.uid).update({
                            sessions: sessionsSnapshot,
                        });
                    } catch (error) {
                        window.alert(error);
                    }
                })();
                // Setting fields values back to default
                updateSessionDateField.value = '';
                updateSessionCommentField.value = '';
                // Navigating back updating it
                createToastMessage('success', 'Session updated!')
                setTimeout(function(){
                    let redirectLocation = loadedLocation + '/app/session.html?' + window.location.search.replace('?','');
                    window.location.replace(redirectLocation);
                }, 1000);
            } else {
                window.alert('Date is not filled');
            };
        };
    });
});



// Delete Session Functionality
// Open confirmation modal functionality
deleteSessionModalButton.addEventListener('click', function(){
    confirmDeleteSessionModal.classList.remove("hidden");
    confirmDeleteSessionModal.classList.add("fadeIn");
    confirmDeleteSessionModal.classList.add("visible");
});
// Close confirmation modal functionality (cancel delete)
cancelDeleteSessionButton.addEventListener('click', function(){
    confirmDeleteSessionModal.classList.remove("visible");
    confirmDeleteSessionModal.classList.remove("fadeIn");
    confirmDeleteSessionModal.classList.add("hidden");
});
// Delete session in DB
deleteSessionButton.addEventListener('click', function(){
    // Preparing updated session snapshot with new status of current session
    sessionsSnapshot.forEach(session => {
        if (session.uid === window.location.search.replace('?','')){
            session.status = 'deleted';

            // Asynchronous function for database operations
            (async function(){
                try {
                    // Pushing updated session object to the DB by updating the sessions array field
                    await db.collection("btUsers").doc(auth.currentUser.uid).update({
                        sessions: sessionsSnapshot,
                    });
                } catch (error) {
                    window.alert(error);
                }
            })();

            // Setting fields values back to default
            updateSessionDateField.value = '';
            updateSessionDistanceField.value = '';
            updateSessionCommentField.value = '';
            // Navigating back updating it
            createToastMessage('success', 'Session deleted!')
            setTimeout(function(){
                let redirectLocation = loadedLocation + '/app/home.html';
                window.location.replace(redirectLocation);
            }, 1000);
        };
    });
});