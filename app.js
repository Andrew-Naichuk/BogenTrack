// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHY-cawV60DzQIbS21E7atrU6BAdyVtGg",
    authDomain: "bogentrack.firebaseapp.com",
    projectId: "bogentrack",
    storageBucket: "bogentrack.appspot.com",
    messagingSenderId: "673595653369",
    appId: "1:673595653369:web:06cef8e7e7e4d4dfbf7628",
    measurementId: "G-QR4TSG9K78"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();
const analytics = firebase.analytics();

// Auth status observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        showScreen('sessionsListScreen');
        getSessions();
    } else {
        showScreen('entryScreen')
    }
});

// Showing and Hiding Screens Functionality
function showScreen(screen) {
    allScreens.forEach(element => {
        if (element.id === screen) {
            element.classList.remove('hidden');
            element.classList.remove('fadeOut');

            element.classList.add('fadeIn');
            element.classList.add('visible');
        } else {
            element.classList.remove('fadeIn');
            element.classList.remove('visible');

            element.classList.add('fadeOut');
            element.classList.add('hidden');
        }
    });
}

// Generating UUIDs
function generateUID() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 100000);
    const uid = `${timestamp}-${random}`;
    return uid;
}








// Log In Form Functionality
logInButton.addEventListener('click', async function(){
    try {
        await firebase.auth().signInWithEmailAndPassword(logInEmailField.value, logInPasswordField.value)
    } catch (error) {
    }
});
logInGoogleButton.addEventListener('click', async function(){
    try {
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.log('Error while loging in');
    }
});

// Sign Up Form Functionality
signUpButton.addEventListener('click', async function(){
    try {
        await firebase.auth().createUserWithEmailAndPassword(signUpemailField.value, signUppasswordField.value)
    } catch (error) {
        console.log('Error while signing up');
    }
});

// Sign Out Functionality
signOutButton.addEventListener('click', async function(){
    try {
        firebase.auth().signOut();
    } catch (error) {
        console.log('Error while signing out');
    }
});

// Log In - Sign Up Switching
function entryFormsHandler() {
    if (logInForm.classList.contains('visible')) {
        signUpForm.classList.remove('visible');
        signUpForm.classList.add('hidden');
    
    } else {
        signUpForm.classList.remove('hidden');
        signUpForm.classList.add('visible');
    }
}
toSignUpForm.addEventListener('click', function(){
    logInForm.classList.remove('visible');
    logInForm.classList.add('hidden');
    entryFormsHandler();
});
toLogInForm.addEventListener('click', function(){
    logInForm.classList.remove('hidden');
    logInForm.classList.add('visible');
    entryFormsHandler();
});







// Add Session - Cancel Add Switching
createSessionButton.addEventListener('click', function(){
    showScreen('createSessionScreen');
});
cancelNewSessionButton.addEventListener('click', function(){
    // Setting fields values back to default and navigating
    createSessionDateField.value = '';
    createSessionCommentField.value = '';
    showScreen('sessionsListScreen');
});



// Back to Sessions List Functionality
backToSessionListButton.addEventListener('click', function(){
    showScreen('sessionsListScreen');
    setTimeout(getSessions, 500);
});


// Add Round - Cancel Add Switching
createRoundButton.addEventListener('click', function(){
    showScreen('createRoundScreen');
    renderArrowSelectors();
});
cancelNewRoundButton.addEventListener('click', function(){
    // Setting fields values back to default and navigating
    createRoundTimeField.value = '';
    createRoundCommentField.value = '';

    // Getting rounds and rendering
    showScreen('SessionScreen');
    setTimeout(getRounds, 500);
});







// Add New Session Functionality
saveNewSessionButton.addEventListener('click', function(){
    // Checking date field has full value
    if (createSessionDateField.value.length === 10) {
        // Creating model session object
        const newSession = {
            "uid": generateUID(),
            "date": createSessionDateField.value,
            "comment": createSessionCommentField.value,
            "rounds": [],
        };
        (async function(){
            const docRef = db.collection("btUsers").doc(auth.currentUser.uid);
            const doc = await docRef.get();
            if (doc.exists) {
                try {
                // Pushing populated session object to the DB
                await db.collection("btUsers").doc(auth.currentUser.uid).update({
                    sessions: firebase.firestore.FieldValue.arrayUnion(newSession),
                });
            } catch (error) {
                console.log(error);
            }
            } else {
                try {
                    await db.collection("btUsers").doc(auth.currentUser.uid).set({
                        sessions: firebase.firestore.FieldValue.arrayUnion(newSession),
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        })();
        // Setting fields values back to default
        createSessionDateField.value = '';
        createSessionCommentField.value = '';
        // Navigating back to sessions list and updating it
        showScreen('sessionsListScreen');
        setTimeout(getSessions, 500);

    } else {
        console.log('Date is not filled');
    };
});






// Add New Round Functionality

let sessionsSnapshot;

saveNewRoundButton.addEventListener('click', function(){
    if (createRoundTimeField.value.length === 5) {
        // Collecting arrows scores
        let arrowsScores = [];
        let arrowsScoreInputs = arrowsScoreList.querySelectorAll('input');
        arrowsScoreInputs.forEach(input => {
            arrowsScores.push(input.value)
        });
    
        // Creating model round object
        const newRound = {
            "uid": generateUID(),
            "time": createRoundTimeField.value,
            "comment": createRoundCommentField.value,
            "arrows": arrowsScores,
        };

        (async function(){
            try {
                // Making a snapshot of all sessions of current user
                const docRef = db.collection("btUsers").doc(auth.currentUser.uid);
                const doc = await docRef.get();
                if (doc.exists) {
                    sessionsSnapshot = doc.data().sessions;
                    // Updating currently selected session in snapshot with new round
                    sessionsSnapshot.forEach(session => {
                        if (session.uid === currentSelectedSession) {
                            session.rounds.push(newRound)
                        }
                    });
                };
                // Pushing updated snapshot with new round to the DB
                await db.collection("btUsers").doc(auth.currentUser.uid).update({
                    sessions: sessionsSnapshot,
                });
            } catch (error) {
                console.log(error);
            }
        })();

        // Setting fields values back to default
        createRoundTimeField.value = '';
        createRoundCommentField.value = '';
        // Navigating back to session screen and updating it
        showScreen('SessionScreen');
        setTimeout(getRounds, 500);

    } else {
        console.log('Time is not filled');
    };
});







// Arrows Number Clicker Functionality
function renderArrowSelectors(){
    arrowsScoreList.innerHTML = '';
    arrowsNumber = Number(arrowsCounter.innerText);
    let arrowId = 1;
    for (let i = 0; i < arrowsNumber; i++) {
        const arrowScoreSelector = document.createElement("div");
        arrowScoreSelector.id = 'arrowSelector' + arrowId;
        arrowScoreSelector.innerHTML = `
        <h5>Arrow ${arrowId} Score</h5>
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
        `
        arrowsScoreList.appendChild(arrowScoreSelector);
        arrowId = arrowId + 1
    }
    arrowsNumber = arrowsNumber - 1
};
let arrowsNumber = 6;
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








// Read and Render Sessions From Database
async function getSessions(){
    // Refference to specific document in DB
    const docRef = db.collection("btUsers").doc(auth.currentUser.uid);
    sessionsListContainer.innerHTML = '';
    try {
        // Trying to fetch data
        const doc = await docRef.get();
        if (doc.exists) {
            // Rendering session cards
            let list = doc.data().sessions.reverse();
            list.forEach(listItem => {
                let totalResult = 0;
                let totalArrows = 0;
                let roundsList = listItem.rounds;
                roundsList.forEach(round =>{
                    round.arrows.forEach(function (number) {
                        totalResult += Number(number);
                        totalArrows = totalArrows + 1;
                    });
                });
                let averageResult = totalResult / totalArrows;
                let displayAverage = averageResult.toString().slice(0, 3);
                const renderedSession = document.createElement("article");
                renderedSession.id = listItem.uid
                renderedSession.innerHTML = `
                <h5>${listItem.date}</h5>
                <p>${listItem.rounds.length} Rounds</p>
                <p>${totalArrows} Arrows</p>
                <h5>Ø ${displayAverage}</h5>
                `

                // Making sessions clickable to open their details
                renderedSession.addEventListener('click', function(){
                    let container = renderedSession;
                    let clickedElement = event.target;
                    while (clickedElement && clickedElement !== container && clickedElement !== document) {
                        clickedElement = clickedElement.parentElement;
                    }
                    if (clickedElement === container) {
                        currentSelectedSession = container.id;
                    }
                    showScreen('SessionScreen');
                    getRounds();
                    
                });

                sessionsListContainer.appendChild(renderedSession);
            });
        } else {
            const noSessionsNotice = document.createElement("div");
            noSessionsNotice.className = 'screenNotice'
            noSessionsNotice.innerHTML = `
                <h4>Looks Empty</h4>
                <p>Start tracking your results by adding your first training session.</p>
            `
            sessionsListContainer.appendChild(noSessionsNotice);
        }
    } catch (error) {
        console.log('Error while getting data')
    }
};




// Read and Render Rounds From Database
async function getRounds(){
    // Refference to specific document in DB
    const docRef = db.collection("btUsers").doc(auth.currentUser.uid);
    roundsListContainer.innerHTML = '';
    try {
        // Trying to fetch data
        const doc = await docRef.get();
        if (doc.exists) {
            let list = doc.data().sessions;
            // Going through all sessions in search of currently selected one
            list.forEach(listItem => {
                if (listItem.uid === currentSelectedSession) {
                    let roundsList = listItem.rounds;

                    if (roundsList.length < 1) {
                        const noRoundsNotice = document.createElement("div");
                        noRoundsNotice.className = 'screenNotice'
                        noRoundsNotice.innerHTML = `
                            <h4>Looks Empty</h4>
                            <p>Start saving shooting results by creating and populating new round on each end.</p>
                        `
                        roundsListContainer.appendChild(noRoundsNotice);
                    }

                    roundsList.forEach(round => {
                        let totalResult = 0;
                        round.arrows.forEach(function (number) {
                            totalResult += Number(number);
                        });
                        let averageResult = totalResult / round.arrows.length
                        let displayAverage = averageResult.toString().slice(0, 3);
                        const renderedRound = document.createElement("article");
                        renderedRound.id = round.uid
                        renderedRound.innerHTML = `
                        <h5>${round.time}</h5>
                        <p>${round.arrows.length} Arrows</p>
                        <p>Total ${totalResult}</p>
                        <h5>Ø ${displayAverage}</h5>
                        `
                        roundsListContainer.appendChild(renderedRound);
                    });
                }
            });
        }

    } catch (error) {
        console.log('Error while getting data');
    }
};





