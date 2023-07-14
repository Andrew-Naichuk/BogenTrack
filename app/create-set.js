// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const providerGoogle = new firebase.auth.GoogleAuthProvider();
const analytics = firebase.analytics();

// Auth status observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        createRoundTimeField.value = getCurrentTime();
        renderArrowSelectors();
    } else {
        let redirectLocation = loadedLocation + '/app/signin.html'
        window.location.replace(redirectLocation);
    }
});


// Cancel creating new set
cancelNewRoundButton.addEventListener('click', function(){
    // Setting fields values back to default and navigating
    createRoundTimeField.value = '';
    createRoundCommentField.value = '';
    let redirectLocation = loadedLocation + '/app/session.html?' + window.location.search.replace('?','');
    window.location.href = redirectLocation;
});


// Arrows Number Clicker Functionality
function renderArrowSelectors(){
    // Clear the arrowsScoreList
    arrowsScoreList.innerHTML = '';

    // Get the number of arrows from the arrowsCounter
    arrowsNumber = Number(arrowsCounter.innerText);

    // Initialize arrowId to 1
    let arrowId = 1;

    // Loop to create arrow score selectors based on the arrowsNumber
    for (let i = 0; i < arrowsNumber; i++) {
        // Create a new arrowScoreSelector element
        const arrowScoreSelector = document.createElement("div");
        // Set the id of the arrowScoreSelector
        arrowScoreSelector.id = 'arrowSelector' + arrowId;
        // Set the innerHTML of the arrowScoreSelector
        arrowScoreSelector.innerHTML = `
            <h5>Shot ${arrowId} Score</h5>
            <input type="range" id="arrowScore${arrowId}" name="arrowScore${arrowId}" min="0" max="11" value="6" step="1" list="values">
            <datalist id="values">
                <option value="0" label="M"></option>
                <option value="1" label="1"></option>
                <option value="2" label="2"></option>
                <option value="3" label="3"></option>
                <option value="4" label="4"></option>
                <option value="5" label="5"></option>
                <option value="6" label="6"></option>
                <option value="7" label="7"></option>
                <option value="8" label="8"></option>
                <option value="9" label="9"></option>
                <option value="10" label="10"></option>
                <option value="11" label="X"></option>
            </datalist>
        `;
        // Append the arrowScoreSelector to the arrowsScoreList
        arrowsScoreList.appendChild(arrowScoreSelector);
        // Increment the arrowId by 1
        arrowId = arrowId + 1;
    }
    // Decrease the arrowsNumber by 1
    arrowsNumber = arrowsNumber - 1;
};

removeArrowButton.addEventListener('click', function(){
    if (Number(arrowsCounter.innerText) > 1) {
        arrowsCounter.innerText = Number(arrowsCounter.innerText) - 1;
        arrowsNumber = arrowsCounter.innerText;
        renderArrowSelectors()
    };
});

addArrowButton.addEventListener('click', function(){
    if (Number(arrowsCounter.innerText) < 10) {
        arrowsCounter.innerText = Number(arrowsCounter.innerText) + 1;
        arrowsNumber = arrowsCounter.innerText;
        renderArrowSelectors()
    };

});


// Add New Round Functionality
saveNewRoundButton.addEventListener('click', function(){
    if (createRoundTimeField.value.length === 5) {
        // Collecting arrows scores
        let arrowsScores = [];
        let arrowsScoreInputs = arrowsScoreList.querySelectorAll('input');
        arrowsScoreInputs.forEach(input => {
            if (input.value === "11") {
                arrowsScores.push("10");
            } else {
                arrowsScores.push(input.value);
            }
        });
    
        // Creating model round object
        const newRound = {
            "uid": generateUID(),
            "time": createRoundTimeField.value,
            "comment": createRoundCommentField.value.replace(/</g, '(').replace(/>/g, ')'),
            "arrows": arrowsScores,
            "status": 'live',
        };

        // Asynchronous function for database operations
        (async function(){
            try {
                // Making a snapshot of all sessions of current user
                const docRef = db.collection("btUsers").doc(auth.currentUser.uid);
                const doc = await docRef.get();
                if (doc.exists) {
                    sessionsSnapshot = doc.data().sessions;
                    // Updating currently selected session in snapshot with new round
                    sessionsSnapshot.forEach(session => {
                        if (session.uid === window.location.search.replace('?','')) {
                            session.rounds.push(newRound);
                        }
                    });
                }
                // Pushing updated snapshot with new round to the DB
                await db.collection("btUsers").doc(auth.currentUser.uid).update({
                    sessions: sessionsSnapshot,
                });
            } catch (error) {
                createToastMessage('fail', error.message);
                console.log(error.message);
            }
        })();

        // Setting fields values back to default
        createRoundTimeField.value = '';
        createRoundCommentField.value = '';
        
        // Navigating back and updating it
        createToastMessage('success', 'New set created!')
        setTimeout(function(){
            let redirectLocation = loadedLocation + '/app/session.html?' + window.location.search.replace('?','');
            window.location.replace(redirectLocation);
        }, 1000);

    } else {
        window.alert('Time is not filled');
    };
});