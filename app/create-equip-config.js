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
cancelNewEquipConfigButton.addEventListener('click', ()=>{
    // Setting fields values back to default and navigating

    let redirectLocation = loadedLocation + '/app/profile.html';
    window.location.href = redirectLocation;
});


// Saving config functionality
saveNewEquipConfigButton.addEventListener('click', ()=>{
    if (newConfigNameInput.value.length > 0) {
        // Creating model config object
        // All new configs have 'live' status by default to be rendered in the list
        // This status is used later to "delete" items by excluding them from rendering
        const newConfig = {
            "uid": generateUID(),
            "status": 'live',
            "name": newConfigNameInput.value.replace(/</g, '(').replace(/>/g, ')'),
            "riser": newConfigRiserInput.value.replace(/</g, '(').replace(/>/g, ')'),
            "limbs": newConfigLimbsInput.value.replace(/</g, '(').replace(/>/g, ')'),
            "string": newConfigStringInput.value.replace(/</g, '(').replace(/>/g, ')'),
            "size": newConfigSizeInput.value,
            "draw": newConfigDrawInput.value,
            "brace": newConfigBraceInput.value,
            "tiller": newConfigTillerInput.value,
            "nocking": newConfigNockingInput.value,
            "arrowsName": newConfigArrowsNameInput.value.replace(/</g, '(').replace(/>/g, ')'),
            "arrowsLength": newConfigArrowsSizeInput.value,
            "arrowsSpine": newConfigArrowsSpineInput.value,
            "arrowsDetails": newConfigArrowsDetailsInput.value,
            "comment": newConfigCommentInput.value.replace(/</g, '(').replace(/>/g, ')'),
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
                    // Pushing populated config object to the DB by updating the configs array field
                    await db.collection("btUsers").doc(auth.currentUser.uid).update({
                        equipmentConfigs: firebase.firestore.FieldValue.arrayUnion(newConfig),
                    });
                } catch (error) {
                    createToastMessage('fail', error.message);
                    console.log(error.message);
                }
            } else {
                try {
                    // Create a new document with configs array field containing the new config object
                    await db.collection("btUsers").doc(auth.currentUser.uid).set({
                        equipmentConfigs: firebase.firestore.FieldValue.arrayUnion(newConfig),
                    });
                } catch (error) {
                    createToastMessage('fail', error.message);
                    console.log(error.message);
                }
            };
        })();

        // Setting fields values back to default
        newConfigNameInput.value = '';
        newConfigRiserInput.value = '';
        newConfigLimbsInput.value = '';
        newConfigStringInput.value = '';
        newConfigSizeInput.value = '';
        newConfigDrawInput.value = '';
        newConfigBraceInput.value = '';
        newConfigTillerInput.value = '';
        newConfigNockingInput.value = '';
        newConfigArrowsNameInput.value = '';
        newConfigArrowsSizeInput.value = '';
        newConfigArrowsSpineInput.value = '';
        newConfigArrowsDetailsInput.value = '';
        newConfigCommentInput.value = '';
                
        // Navigating back to sessions list and updating it
        createToastMessage('success', 'New equipment config created!');
        setTimeout(function(){
            let redirectLocation = loadedLocation + '/app/profile.html';
            window.location.replace(redirectLocation);
        }, 1000);
    } else {
        createToastMessage('fail', 'Config name is not filled!');
    };
});