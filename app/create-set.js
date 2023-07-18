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
        checkScoreList();
    } else {
        let redirectLocation = loadedLocation + '/app/signin.html';
        window.location.replace(redirectLocation);
    };
});


// Cancel creating new set
cancelNewRoundButton.addEventListener('click', function(){
    // Setting fields values back to default and navigating
    createRoundTimeField.value = '';
    createRoundCommentField.value = '';
    let redirectLocation = loadedLocation + '/app/session.html?' + window.location.search.replace('?','');
    window.location.href = redirectLocation;
});


// Empty score list handling
function checkScoreList(){
    // Checking for scores in the container
    if (roundScoresList.innerHTML === ''){
        // Creating notice for empty container
        const scoreNotice = document.createElement('h6');
        scoreNotice.id = 'scoreNotice';
        scoreNotice.classList.add('centered-text');
        scoreNotice.classList.add('faded');
        scoreNotice.innerText = 'Add arrows scores by clicking respective buttons below';
        roundScoresList.appendChild(scoreNotice);
    } else {
        // Removing notice from filled container
        const notice = roundScoresList.querySelector('#scoreNotice');
        if (notice){
            roundScoresList.removeChild(notice);
        };
    };
};


// Add arrow score keyboard functionality
const keyboardButtons = roundScoreKeyboard.querySelectorAll('button');
keyboardButtons.forEach(button => {
    button.addEventListener('click', function(){
        // Adding score by button click
        const newScore = document.createElement('h5');
        newScore.classList.add('fix50');
        newScore.classList.add('centered-text');
        newScore.innerText = button.id;
        roundScoresList.appendChild(newScore);
        // Highlighting delete option while hovering score
        newScore.addEventListener('mouseenter', function(){
            newScore.innerText = '⨉';
            newScore.classList.add('red');
        });
        newScore.addEventListener('mouseleave', function(){
            newScore.innerText = button.id;
            newScore.classList.remove('red');
        });
        // Delete score from list by click
        newScore.addEventListener('click', function(){
            roundScoresList.removeChild(newScore);
            checkScoreList();
        });
        // Checking for notice status
        checkScoreList();
    });
});


// Add New Round Functionality
saveNewRoundButton.addEventListener('click', function(){
    if (createRoundTimeField.value.length === 5) {
        // Collecting arrows scores
        let arrowsScores = [];
        let arrowsScoreInputs = roundScoresList.querySelectorAll('h5');
        arrowsScoreInputs.forEach(input => {
            if (input.innerText === 'M'){
                arrowsScores.push('0')
            }
            if (input.innerText === 'X'){
                arrowsScores.push('10')
            }
            if (input.innerText != 'M' && input.innerText != 'X'){
                arrowsScores.push(input.innerText)
            }
        });

        // Checking for some scores entered
        if (arrowsScores.length > 0) {
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
            createToastMessage('fail', 'No scores were added');
        };
    } else {
        createToastMessage('fail', 'Time is not filled');
    };
});