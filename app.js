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
    // Changing indicators values
    setTimeout(updateSessionIndicators, 500);
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
    // Changing indicators values
    setTimeout(updateSessionIndicators, 500);
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
    // Changing indicators values
    setTimeout(updateSessionIndicators, 500);
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
        createToastMessage('success', 'New session created!')
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
                createToastMessage('success', 'Session updated!')
                setTimeout(getRounds, 500);
                // Changing indicators values
                setTimeout(updateSessionIndicators, 1000);
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
            createToastMessage('success', 'Session deleted!')
            setTimeout(getSessions, 500);
        };
    });
});


// Delete Round Functionality
// Open confirmation modal functionality
deleteRoundModalButton.addEventListener('click', function(){
    confirmDeleteRoundModal.classList.remove("hidden");
    confirmDeleteRoundModal.classList.add("fadeIn");
    confirmDeleteRoundModal.classList.add("visible");
});
// Close confirmation modal functionality (cancel delete)
cancelDeleteRoundButton.addEventListener('click', function(){
    confirmDeleteRoundModal.classList.remove("visible");
    confirmDeleteRoundModal.classList.remove("fadeIn");
    confirmDeleteRoundModal.classList.add("hidden");
});
// Delete round in DB
deleteRoundButton.addEventListener('click', function(){
    // Preparing updated session snapshot with new status of current round
    sessionsSnapshot.forEach(session => {
        if (session.uid === currentSelectedSession){
            session.rounds.forEach(round => {
                if (round.uid === currentSelectedRound) {
                    round.status = 'deleted';
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
                    // Navigating back to rounds list and updating it
                    confirmDeleteRoundModal.classList.remove("visible");
                    confirmDeleteRoundModal.classList.remove("fadeIn");
                    confirmDeleteRoundModal.classList.add("hidden");
                    showScreen('SessionScreen');
                    createToastMessage('success', 'Set deleted!')
                    setTimeout(getRounds, 500);
                    // Changing indicators values
                    setTimeout(updateSessionIndicators, 1000);
                };
            });
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
        createToastMessage('success', 'New set created!')
        setTimeout(getRounds, 500);
        // Changing indicators values
        setTimeout(updateSessionIndicators, 1000);

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
                            // Assigning color to the rendered item based on value
                            let arrowColor = 'white';
                            if (Number(arrow) === 3 || Number(arrow) === 4) {
                                arrowColor = 'black'
                            }
                            if (Number(arrow) === 5 || Number(arrow) === 6) {
                                arrowColor = 'blue'
                            }
                            if (Number(arrow) === 7 || Number(arrow) === 8) {
                                arrowColor = 'red'
                            }
                            if (Number(arrow) === 9 || Number(arrow) === 10) {
                                arrowColor = 'gold'
                            }
                            const renderedArrow = document.createElement("article");
                            renderedArrow.classList.add('fadeIn');
                            renderedArrow.innerHTML = `
                            <div class="articleRow">
                                <h5>Arrow ${renderedArrowNumber}</h5>
                                <h5 class="fix50 ${arrowColor}">${iconsBundle.target} ${arrow}</h5>
                            </div>
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
