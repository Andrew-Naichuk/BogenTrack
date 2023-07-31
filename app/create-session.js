// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const providerGoogle = new firebase.auth.GoogleAuthProvider();
const analytics = firebase.analytics();

// Auth status observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        createSessionDateField.value = getCurrentDate();
        getEquipmentOptions();
    } else {
        let redirectLocation = loadedLocation + '/app/signin.html'
        window.location.replace(redirectLocation);
    }
});


// Canceling adding session functionality
cancelNewSessionButton.addEventListener('click', function(){
    // Setting fields values back to default and navigating
    createSessionDateField.value = '';
    createSessionDistanceField.value = '';
    createSessionCommentField.value = '';
    let redirectLocation = loadedLocation + '/app/home.html';
    window.location.href = redirectLocation;
});


// Distance field validation functionality for create session
// It should not be allowed to set negative or zero distance
createSessionDistanceField.addEventListener('input', function(){
    if (createSessionDistanceField.value < 1) {
        createSessionDistanceField.value = 1
    }
});


// Populating equipment selector with options if any
async function getEquipmentOptions() {
    // Reference to specific document in the database
    const docRef = db.collection("btUsers").doc(auth.currentUser.uid);
    // Trying to fetch data from the document
    try {
        const doc = await docRef.get();
        if (doc.exists) {
            // Rendering configs cards
            let configsExist = false;
            try {
                const existingConfigs = doc.data().equipmentConfigs;
                if (existingConfigs) {
                    configsExist = true;
                };
            } catch (error) {
                configsExist = false;
            };

            if (configsExist) {
                let list = doc.data().equipmentConfigs;
                let liveConfigsNumber = 0;
                list.forEach (item => {
                    if (item.status === 'live'){
                        liveConfigsNumber = ++liveConfigsNumber
                    }
                });
                // Checking if any configs saved
                if (liveConfigsNumber > 0) {
                    list.forEach (config => {
                        if (config.status === 'live') {
                            const renderedOption = document.createElement("option");
                            renderedOption.value = config.uid;
                            renderedOption.innerText = config.name;
                            newSessionConfigField.appendChild(renderedOption);
                        }
                    })
                }
            }
        }
    } catch (error) {
        
    }
};



// Add New Session Functionality
saveNewSessionButton.addEventListener('click', function(){
    // Checking date field has full value
    if (createSessionDateField.value.length === 10) {
        // Creating model session object
        // All new sessions have 'live' status by default to be rendered in the list
        // This status is used later to "delete" sessions by excluding them from rendering
        const newSession = {
            "uid": generateUID(),
            "status": 'live',
            "date": createSessionDateField.value,
            "distance": createSessionDistanceField.value,
            "equipment": newSessionConfigField.value,
            "comment": createSessionCommentField.value.replace(/</g, '(').replace(/>/g, ')'),
            "rounds": [],
        };
        
        // Asynchronous function for database operations
        (async function(){
            // Get reference to the user document in the btUsers collection
            const docRef = db.collection("btUsers").doc(auth.currentUser.uid);
            // Retrieve the document from the database
            const doc = await docRef.get();
            
            // Check if the document exists
            if (doc.exists) {
                try {
                    // Pushing populated session object to the DB by updating the sessions array field
                    await db.collection("btUsers").doc(auth.currentUser.uid).update({
                        sessions: firebase.firestore.FieldValue.arrayUnion(newSession),
                    });
                } catch (error) {
                    createToastMessage('fail', error.message);
                    console.log(error.message);
                }
            } else {
                try {
                    // Create a new document with sessions array field containing the new session object
                    await db.collection("btUsers").doc(auth.currentUser.uid).set({
                        sessions: firebase.firestore.FieldValue.arrayUnion(newSession),
                    });
                } catch (error) {
                    createToastMessage('fail', error.message);
                    console.log(error.message);
                }
            }
        })();
        
        // Setting fields values back to default
        createSessionDateField.value = '';
        createSessionCommentField.value = '';
        
        // Navigating back to sessions list and updating it
        createToastMessage('success', 'New session created!')
        setTimeout(function(){
            let redirectLocation = loadedLocation + '/app/home.html';
            window.location.replace(redirectLocation);
        }, 1000);
    } else {
        createToastMessage('fail', 'Date is not filled!')
    };
});