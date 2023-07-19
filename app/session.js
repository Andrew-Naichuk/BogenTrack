// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const providerGoogle = new firebase.auth.GoogleAuthProvider();
const analytics = firebase.analytics();

// Auth status observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        getSessionsSnapshot();
        setTimeout(function(){
            sessionsSnapshot.forEach(session => {
                if (session.uid === window.location.search.replace('?','')) {
                    sessionNameIndicator.innerText = session.date;
                }
            });
            getRounds();
            // Changing indicators values
            setTimeout(updateSessionIndicators, 400);
        }, 400);
    } else {
        let redirectLocation = loadedLocation + '/app/signin.html'
        window.location.replace(redirectLocation);
    }
});

// Edit Session Switching
editSessionButton.addEventListener('click', function(){
    let redirectLocation = loadedLocation + '/app/update-session.html?' + window.location.search.replace('?','');
    window.location.href = redirectLocation;
});


// Add New Round Switching
createRoundButton.addEventListener('click', function(){
    let redirectLocation = loadedLocation + '/app/create-set.html?' + window.location.search.replace('?','');
    window.location.href = redirectLocation;
});


// Updatind Session Screen Indicators
function updateSessionIndicators(){
    let sessionTotal = 0;
    let sessionAverage = 0;
    let numberOfRounds;

    const sessionRounds = document.querySelectorAll('article');
    numberOfRounds = sessionRounds.length;
    sessionRounds.forEach(sessionRound => {
        let total = sessionRound.getAttribute("data-total");
        let average = sessionRound.getAttribute("data-average");
        sessionTotal = sessionTotal + Number(total);
        sessionAverage = sessionAverage + Number(average);
    });
    sessionTotalPointsIndicator.innerText = sessionTotal;
    let averageResult = sessionAverage / numberOfRounds;
    if (averageResult) {
        sessionAverageShotIndicator.innerText = averageResult.toString().slice(0, 4);
    } else {
        sessionAverageShotIndicator.innerText = '0'
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

            let sessionExists = false;

            // Going through all sessions in search of the currently selected one
            list.forEach(listItem => {
                if (listItem.uid === window.location.search.replace('?','')) {

                    sessionExists = true;

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

                    let liveRoundsNumber = 0;
                    let roundsList = listItem.rounds;
                    // Checking for live rounds amount
                    roundsList.forEach(round => {
                        if (!round.status || round.status === 'live') {
                            liveRoundsNumber = liveRoundsNumber + 1;
                        }
                    });

                    // Handling case when there are no rounds in the session
                    if (liveRoundsNumber < 1) {
                        const noRoundsNotice = document.createElement("div");
                        noRoundsNotice.className = 'screenNotice';
                        noRoundsNotice.innerHTML = `
                            <div class="faded">${iconsBundle.bow}</div>
                            <h4>Looks Empty</h4>
                            <p>Start saving shooting results by creating and populating a new set for each round.</p>
                        `;
                        roundsListContainer.appendChild(noRoundsNotice);
                    }

                    roundsList.forEach(round => {
                        if (!round.status || round.status === 'live') {

                            let totalResult = 0;
                            round.arrows.forEach(function (number) {
                                totalResult += Number(number);
                            });

                            // Calculating average result per arrow
                            let averageResult = totalResult / round.arrows.length;
                            // Assigning color to the rendered item based on value
                            let averageColor;
                            if (averageResult < 3) {
                                averageColor = 'white'
                            }
                            if (averageResult >= 3) {
                                averageColor = 'black'
                            }
                            if (averageResult >= 5) {
                                averageColor = 'blue'
                            }
                            if (averageResult >= 7) {
                                averageColor = 'red'
                            }
                            if (averageResult >= 9) {
                                averageColor = 'gold'
                            }

                            let displayAverage = averageResult.toString().slice(0, 3);

                            // Creating and configuring round arrows results for render
                            let renderedArrowsResult = '';
                            round.arrows.forEach(arrow =>{
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
                                renderedArrowsResult = renderedArrowsResult + `<h5 class="${arrowColor}">` + arrow + '</h5>';
                            });

                            // Creating and configuring the rendered round element
                            const renderedRound = document.createElement("article");
                            renderedRound.id = round.uid;
                            renderedRound.classList.add('fadeIn');
                            renderedRound.setAttribute("data-total", totalResult);
                            renderedRound.setAttribute("data-average", displayAverage);
                            renderedRound.innerHTML = `
                            <div class="articleRow">
                                <h5 class="fix50">${round.time}</h5>
                                <p class="fullWidth">${iconsBundle.arrows} ${round.arrows.length}</p>
                                <p class="fullWidth">${iconsBundle.target} ${totalResult}</p>
                                <h5 class="fix50"><span class="faded">Ø</span> <span class="${averageColor}">${displayAverage}</span></h5>
                            </div>
                            <hr>
                            <div class="articleScores">
                                ${renderedArrowsResult}
                            </div>
                            `;

                            // Making rounds clickable for round details reveal
                            renderedRound.addEventListener('click', function(){
                                let container = renderedRound;
                                let clickedElement = event.target;
                                while (clickedElement && clickedElement !== container && clickedElement !== document) {
                                    clickedElement = clickedElement.parentElement;
                                }
                                if (clickedElement === container) {
                                    let redirectLocation = loadedLocation + '/app/set.html?' + `${container.id}`;
                                    window.location.href = redirectLocation;
                                }
                            });

                            roundsListContainer.appendChild(renderedRound);
                            
                        }
                    });
                } 
            });

            // Check if needed session was found for redirect to 404 if not
            if (sessionExists === false) {
                let redirectLocation = loadedLocation + '/404.html';
                window.location.replace(redirectLocation);
            };
        }
    } catch (error) {
        createToastMessage('fail', error.message);
        console.log(error.message);
    }
};