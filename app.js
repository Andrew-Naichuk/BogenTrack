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
function showScreen(screen){
    allScreens.forEach(element => {
        // Check if the current element's id matches the specified screen
        if (element.id === screen) {
            // If the element matches the specified screen, remove 'hidden' and 'fadeOut' classes
            element.classList.remove('hidden');
            element.classList.remove('fadeOut');

            // Add 'fadeIn' and 'visible' classes to make the element visible with a fade-in effect
            element.classList.add('fadeIn');
            element.classList.add('visible');
        } else {
            // If the element doesn't match the specified screen, remove 'fadeIn' and 'visible' classes
            element.classList.remove('fadeIn');
            element.classList.remove('visible');

            // Add 'fadeOut' and 'hidden' classes to hide the element with a fade-out effect
            element.classList.add('fadeOut');
            element.classList.add('hidden');
        };
    });
};


// Generating UUIDs
function generateUID() {
    // Get the current timestamp in milliseconds
    const timestamp = Date.now();

    // Generate a random number between 0 and 99999
    const random = Math.floor(Math.random() * 100000);

    // Combine the timestamp and random number to create a unique identifier (UID)
    const uid = `${timestamp}-${random}`;

    // Return the generated UID
    return uid;
};


// Generating current date
function getCurrentDate(){
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;

    let dayString = day.toString();
    let monthString = month.toString();

    if (dayString.length < 2) {
        day = '0' + dayString;
    };
    if ( monthString.length < 2) {
        month = '0' + monthString;
    };
    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;
    return currentDate;
};


// Generating current time
function getCurrentTime(){
    const time = new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();

    let hoursString = hours.toString();
    let minutesString = minutes.toString();

    if (hoursString.length < 2) {
        hoursString = '0' + hoursString;
    };
    if (minutesString.length < 2) {
        minutesString = '0' + minutesString;
    };
    let currentTime = hoursString + ':' + minutesString;
    return currentTime;
};


// Log In Form Functionality
logInButton.addEventListener('click', async function(){
    // Attempting to sign in using email and password inputs values
    try {
        await firebase.auth().signInWithEmailAndPassword(logInEmailField.value, logInPasswordField.value);
    } catch (error) {
        window.alert(error);
    }
});

logInGoogleButton.addEventListener('click', async function(){
    // Attempting to sign in using Google auth popup
    try {
        await auth.signInWithPopup(provider);
    } catch (error) {
        window.alert(error);
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


// Sign Out Functionality
signOutButton.addEventListener('click', async function(){
    try {
        // Attempting to sign out using auth method
        firebase.auth().signOut();
    } catch (error) {
        window.alert(error);
    }
});


// Log In - Sign Up Switching
function entryFormsHandler(){
    if (logInForm.classList.contains('visible')) {
        // If login form is currently visible, switch to signup form
        signUpForm.classList.remove('visible'); // Hide signup form
        signUpForm.classList.add('hidden');
    } else {
        // If login form is not currently visible, switch to login form
        signUpForm.classList.remove('hidden'); // Show signup form
        signUpForm.classList.add('visible');
    }
};
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


// Profile Functionality
profileButton.addEventListener('click', function(){
    userEmailIndicator.innerText = auth.currentUser.email;
    userSessionsIndicator.innerText = sessionsListScreen.querySelectorAll('article').length;
    showScreen('profileScreen');
});
backHomeButton.addEventListener('click', function(){
    showScreen('sessionsListScreen');
});


// Add Session - Cancel Add Switching
createSessionButton.addEventListener('click', function(){
    showScreen('createSessionScreen');
    createSessionDateField.value = getCurrentDate();
});
cancelNewSessionButton.addEventListener('click', function(){
    // Setting fields values back to default and navigating
    createSessionDateField.value = '';
    createSessionDistanceField.value = '';
    createSessionCommentField.value = '';
    showScreen('sessionsListScreen');
});


// Distance field validation functionality for create and update session
// It should not be allowed to set negative or zero distance
createSessionDistanceField.addEventListener('input', function(){
    if (createSessionDistanceField.value < 1) {
        createSessionDistanceField.value = 1
    }
});
updateSessionDistanceField.addEventListener('input', function(){
    if (updateSessionDistanceField.value < 1) {
        updateSessionDistanceField.value = 1
    }
});


// Edit Session - Cancel Edit Switching
editSessionButton.addEventListener('click', function(){
    showScreen('updateSessionScreen');
    // Populating edit screen with data of currently selected section
    (async function(){
        try {
            // Get reference to the user document in the btUsers collection
            const docRef = db.collection("btUsers").doc(auth.currentUser.uid);
            // Retrieve the document from the database
            const doc = await docRef.get();
            sessionsSnapshot = doc.data().sessions;
            // Find currently selected session in DB and populate inputs with its data
            sessionsSnapshot.forEach(session => {
                if (session.uid === currentSelectedSession) {
                    updateSessionDateField.value = session.date;
                    if (session.distance) {
                        updateSessionDistanceField.value = session.distance;
                    } else {
                        updateSessionDistanceField.value = '';
                    };
                    updateSessionCommentField.value = session.comment;
                }
            });
        } catch (error) {
            window.alert(error)
        }
    })();
});
cancelUpdatedSessionButton.addEventListener('click', function(){
    updateSessionDateField.value = '';
    updateSessionDistanceField.value = '';
    updateSessionCommentField.value = '';
    showScreen('SessionScreen');
});


// Back to Sessions List Functionality
backToSessionListButton.addEventListener('click', function(){
    sessionsListContainer.innerHTML = '';
    sessionNameIndicator.innerText = 'Session'
    showScreen('sessionsListScreen');
    setTimeout(getSessions, 100);
});


// Back to Session Screen functionality
backToSessionScreenButton.addEventListener('click', function(){
    arrowsListContainer.innerHTML = '';
    showScreen('SessionScreen');
    setTimeout(getRounds, 100);
});


// Add Round - Cancel Add Switching
createRoundButton.addEventListener('click', function(){
    roundsListContainer.innerHTML = '';
    showScreen('createRoundScreen');
    createRoundTimeField.value = getCurrentTime();
    renderArrowSelectors();
});
cancelNewRoundButton.addEventListener('click', function(){
    // Setting fields values back to default and navigating
    createRoundTimeField.value = '';
    createRoundCommentField.value = '';

    // Getting rounds and rendering
    showScreen('SessionScreen');
    setTimeout(getRounds, 100);
});


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
                    window.alert(error);
                }
            } else {
                try {
                    // Create a new document with sessions array field containing the new session object
                    await db.collection("btUsers").doc(auth.currentUser.uid).set({
                        sessions: firebase.firestore.FieldValue.arrayUnion(newSession),
                    });
                } catch (error) {
                    window.alert(error);
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
        window.alert('Date is not filled');
    };
});


// Update Session Functionality
saveUpdatedSessionButton.addEventListener('click', function(){
    // Preparing updated session snapshot with new values from user inputs
    sessionsSnapshot.forEach(session => {
        if (session.uid === currentSelectedSession){
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
                // Navigating back to rounds list and updating it
                showScreen('SessionScreen');
                setTimeout(getRounds, 500);
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
        if (session.uid === currentSelectedSession){
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
            // Navigating back to rounds list and updating it
            confirmDeleteSessionModal.classList.remove("visible");
            confirmDeleteSessionModal.classList.remove("fadeIn");
            confirmDeleteSessionModal.classList.add("hidden");
            showScreen('sessionsListScreen');
            setTimeout(getSessions, 500);
        };
    });
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
                        if (session.uid === currentSelectedSession) {
                            session.rounds.push(newRound);
                        }
                    });
                }
                // Pushing updated snapshot with new round to the DB
                await db.collection("btUsers").doc(auth.currentUser.uid).update({
                    sessions: sessionsSnapshot,
                });
            } catch (error) {
                window.alert(error);
            }
        })();

        // Setting fields values back to default
        createRoundTimeField.value = '';
        createRoundCommentField.value = '';
        
        // Navigating back to session screen and updating it
        showScreen('SessionScreen');
        setTimeout(getRounds, 500);

    } else {
        window.alert('Time is not filled');
    };
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


// Read and Render Sessions From Database
async function getSessions(){
    // Reference to specific document in the database
    const docRef = db.collection("btUsers").doc(auth.currentUser.uid);
    sessionsListContainer.innerHTML = '';
    try {
        // Trying to fetch data from the document
        const doc = await docRef.get();
        if (doc.exists) {
            // Updating snapshot to the latest state
            sessionsSnapshot = doc.data().sessions;
            // Rendering session cards
            let list = doc.data().sessions.reverse();
            list.forEach(listItem => {

                if (!listItem.status || listItem.status === 'live') {
                    let totalResult = 0;
                    let totalArrows = 0;
                    let roundsList = listItem.rounds;
    
                    // Calculating total result and total arrows for each session
                    roundsList.forEach(round => {
                        round.arrows.forEach(function (number) {
                            totalResult += Number(number);
                            totalArrows = totalArrows + 1;
                        });
                    });
    
                    // Calculating average result per arrow
                    let averageResult = totalResult / totalArrows;
                    let displayAverage = averageResult.toString().slice(0, 3);
    
                    // Creating and configuring the rendered session card element
                    const renderedSession = document.createElement("article");
                    renderedSession.id = listItem.uid;
                    renderedSession.classList.add('hidden');
                    // Checking if session has rounds to render it as new or filled
                    if (listItem.rounds.length > 0) {
                        renderedSession.setAttribute("data-display-name", listItem.date)
                        renderedSession.innerHTML = `
                        <h5 class="fix90">${listItem.date}</h5>
                        <p class="fullWidth">${iconsBundle.repeat} ${listItem.rounds.length}</p>
                        <p class="fullWidth">${iconsBundle.arrows} ${totalArrows}</p>
                        <h5 class="fix50">Ø ${displayAverage}</h5>
                    `;
                    } else {
                        renderedSession.classList.add('highlighted')
                        renderedSession.setAttribute("data-display-name", listItem.date)
                        renderedSession.innerHTML = `
                        <h5>${listItem.date}</h5>
                        <h5 class="fix50">New</h5>
                        `
                    }
    
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
                        sessionNameIndicator.innerText = renderedSession.getAttribute("data-display-name");
                        showScreen('SessionScreen');
                        getRounds();
                    });
    
                    sessionsListContainer.appendChild(renderedSession);
                    renderedSession.classList.remove('hidden');
                    renderedSession.classList.add('fadeIn');
                };
            });
        } else {
            // Displaying a notice when there are no sessions
            const noSessionsNotice = document.createElement("div");
            noSessionsNotice.className = 'screenNotice';
            noSessionsNotice.innerHTML = `
                <h4>Looks Empty</h4>
                <p>Start tracking your results by adding your first training session.</p>
            `;
            sessionsListContainer.appendChild(noSessionsNotice);
        }
    } catch (error) {
        window.alert(error);
    }
};


// Read and Render Rounds From Database
async function getRounds(){
    // Reference to specific document in the database
    const docRef = db.collection("btUsers").doc(auth.currentUser.uid);
    roundsListContainer.innerHTML = '';
    try {
        // Trying to fetch data from the document
        const doc = await docRef.get();
        if (doc.exists) {
            // Updating snapshot to the latest state
            sessionsSnapshot = doc.data().sessions;
            let list = doc.data().sessions;

            // Going through all sessions in search of the currently selected one
            list.forEach(listItem => {
                if (listItem.uid === currentSelectedSession) {

                    // Rendering session distance if any
                    if (listItem.distance && listItem.distance.length > 0) {
                        const sessionRenderedDistance = document.createElement("div");
                        sessionRenderedDistance.classList.add('sessionPageDistance');
                        sessionRenderedDistance.classList.add('fadeIn');
                        sessionRenderedDistance.innerHTML = `
                            <h4>Distance — ${listItem.distance} meters</h4>
                        `
                        roundsListContainer.appendChild(sessionRenderedDistance);
                    };

                    // Rendering session comment if any
                    if (listItem.comment.length > 0) {
                        const sessionRenderedComment = document.createElement("div");
                        sessionRenderedComment.classList.add('sessionPageComment');
                        sessionRenderedComment.classList.add('fadeIn');
                        sessionRenderedComment.innerHTML = `
                            <h4>Session Notes:</h4>
                            <p>${listItem.comment}</p>
                        `;
                        roundsListContainer.appendChild(sessionRenderedComment);
                    };

                    let roundsList = listItem.rounds;

                    // Handling case when there are no rounds in the session
                    if (roundsList.length < 1) {
                        const noRoundsNotice = document.createElement("div");
                        noRoundsNotice.className = 'screenNotice';
                        noRoundsNotice.innerHTML = `
                            <h4>Looks Empty</h4>
                            <p>Start saving shooting results by creating and populating a new round for each end.</p>
                        `;
                        roundsListContainer.appendChild(noRoundsNotice);
                    }

                    roundsList.forEach(round => {
                        let totalResult = 0;
                        round.arrows.forEach(function (number) {
                            totalResult += Number(number);
                        });

                        // Calculating average result per arrow
                        let averageResult = totalResult / round.arrows.length;
                        let displayAverage = averageResult.toString().slice(0, 3);

                        // Creating and configuring the rendered round element
                        const renderedRound = document.createElement("article");
                        renderedRound.id = round.uid;
                        renderedRound.classList.add('fadeIn');
                        renderedRound.innerHTML = `
                            <h5 class="fix50">${round.time}</h5>
                            <p class="fullWidth">${iconsBundle.arrows} ${round.arrows.length}</p>
                            <p class="fullWidth">${iconsBundle.target} ${totalResult}</p>
                            <h5 class="fix50">Ø ${displayAverage}</h5>
                        `;

                        // Making rounds clickable for round details reveal
                        renderedRound.addEventListener('click', function(){
                            let container = renderedRound;
                            let clickedElement = event.target;
                            while (clickedElement && clickedElement !== container && clickedElement !== document) {
                                clickedElement = clickedElement.parentElement;
                            }
                            if (clickedElement === container) {
                                currentSelectedRound = container.id;
                            }
                            roundNameIndicator.innerText = round.time;
                            showScreen('RoundScreen');
                            getArrows();
                        });

                        roundsListContainer.appendChild(renderedRound);
                    });
                }
            });
        }
    } catch (error) {
        window.alert(error);
    }
};


// Read and Render Arrows From Database
async function getArrows(){
    const docRef = db.collection("btUsers").doc(auth.currentUser.uid);
    arrowsListContainer.innerHTML = '';
    // Trying to fetch data from the document
    const doc = await docRef.get();
    if (doc.exists) {
        sessionsSnapshot = doc.data().sessions;
        let list = doc.data().sessions;
        // Going through all sessions in search of the currently selected one
        list.forEach(listItem => {
            if (listItem.uid === currentSelectedSession) {
                // Going through all rounds in search of the currently selected one
                let roundsList = listItem.rounds;
                roundsList.forEach(round => {
                    if (round.uid === currentSelectedRound) {

                        // Rendering round comment if any
                        if (round.comment.length > 0) {
                            const roundRenderedComment = document.createElement("div");
                            roundRenderedComment.classList.add('sessionPageComment');
                            roundRenderedComment.classList.add('fadeIn');
                            roundRenderedComment.innerHTML = `
                                <h4>Round Notes:</h4>
                                <p>${round.comment}</p>
                            `;
                            arrowsListContainer.appendChild(roundRenderedComment);
                        };

                        // Rendering arrows of the selected round
                        let renderedArrowNumber = 1;
                        round.arrows.forEach(arrow => {
                            const renderedArrow = document.createElement("article");
                            renderedArrow.classList.add('fadeIn');
                            renderedArrow.innerHTML = `
                            <h5>Arrow ${renderedArrowNumber}</h5>
                            <h5 class="fix50">${iconsBundle.target} ${arrow}</h5>
                            `;
                            arrowsListContainer.appendChild(renderedArrow);
                            renderedArrowNumber = renderedArrowNumber + 1
                        })
                    };
                });
            }
        });
    }
};