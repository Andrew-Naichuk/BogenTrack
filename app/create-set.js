// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const providerGoogle = new firebase.auth.GoogleAuthProvider();
const analytics = firebase.analytics();

// Auth status observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        updatePageOnAuth();
    } else {
        let redirectLocation = loadedLocation + '/app/signin.html';
        window.location.replace(redirectLocation);
    };
});


// Page content handler
async function updatePageOnAuth(){
    showLoading();
    await getSessionsSnapshot();
    isLoading = false;
    createRoundTimeField.value = getCurrentTime();
    checkScoreList();
    sessionsSnapshot.forEach(session => {
        if (session.uid === window.location.search.replace('?','')) {
            newSetDistanceField.value = session.distance;
        };
    });
};


// Cancel creating new set
cancelNewRoundButton.addEventListener('click', function(){
    // Setting fields values back to default and navigating
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
        // Setting indicators to default
        setTotalScoreIndicator.innerText = '0';
        setAverageIndicator.innerText = '0';
    } else {
        // Removing notice from filled container
        const notice = roundScoresList.querySelector('#scoreNotice');
        if (notice){
            roundScoresList.removeChild(notice);
        };
    };
};


// Function to update indicators
function updateIndicators(usecase, element){
    // updating indicators is involved in both adding and removing scores
    // thus function takes usecase parameter to operate properly
    // use 'add' or 'remove' usecase parameter on coresponding steps
    // 'element' parameter is used to get clicked button (in current implementation - button)
    if (usecase === 'add') {
        if (element.id === 'X'){
            setTotalScoreIndicator.innerText = Number(setTotalScoreIndicator.innerText) + 10;
        };
        if (element.id === 'M'){
            setTotalScoreIndicator.innerText = Number(setTotalScoreIndicator.innerText) + 0;
        };
        if (element.id !== 'M' && element.id !== 'X'){
            setTotalScoreIndicator.innerText = Number(setTotalScoreIndicator.innerText) + Number(element.id);
        };
    };

    if (usecase === 'remove') {
        if (element.id === 'X'){
            setTotalScoreIndicator.innerText = Number(setTotalScoreIndicator.innerText) - 10;
        };
        if (element.id === 'M'){
            setTotalScoreIndicator.innerText = Number(setTotalScoreIndicator.innerText) - 0;
        };
        if (element.id !== 'M' && element.id !== 'X'){
            setTotalScoreIndicator.innerText = Number(setTotalScoreIndicator.innerText) - Number(element.id);
        };
    };
    const averageResult = Number(setTotalScoreIndicator.innerText) / roundScoresList.querySelectorAll('h3').length;
    setAverageIndicator.innerText = averageResult.toString().slice(0, 4);
};


// Add arrow score keyboard functionality
const keyboardButtons = roundScoreKeyboard.querySelectorAll('button');
keyboardButtons.forEach(button => {
    button.addEventListener('click', function(){
        // Adding score by button click
        const newScore = document.createElement('h3');
        newScore.classList.add('fix36');
        newScore.classList.add('centered-text');
        newScore.innerText = button.id;
        roundScoresList.appendChild(newScore);
        updateIndicators('add',button);
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
            updateIndicators('remove',button);
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
                "distance": newSetDistanceField.value,
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
            }, 1500);
        } else {
            createToastMessage('fail', 'No scores were added');
        };
    } else {
        createToastMessage('fail', 'Time is not filled');
    };
});