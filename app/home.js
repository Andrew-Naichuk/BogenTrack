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
        let redirectLocation = loadedLocation + '/app/signin.html'
        window.location.replace(redirectLocation);
    }
});


// Page content handler
async function updatePageOnAuth(){
    showLoading();
    await getSessions();
    isLoading = false;
    await checkForOnboarding();
};


// Add new session button functionality
createSessionButton.addEventListener('click', function(){
    let redirectLocation = loadedLocation + '/app/create-session.html';
    window.location.href = redirectLocation;
});


// Read user preferences for onboarding
async function checkForOnboarding(){
    // Reference to specific document in the database
    const docRef = db.collection("btUsers").doc(auth.currentUser.uid);

    try {
        // Trying to fetch data from the document
        const doc = await docRef.get();
        if (doc.exists) {
            // Trying to get onboarding state
            userPreferences = doc.data().preferences;
            if (userPreferences) {
                if (userPreferences.onboardingDone === false){
                    showOnboarding();
                };
            } else {
                try {
                    // Pushing default preferences to DB
                    await db.collection("btUsers").doc(auth.currentUser.uid).update({
                        preferences: newPreferences,
                    });
                    userPreferences = newPreferences;
                    showOnboarding();
                } catch (error) {
                    createToastMessage('fail', error.message);
                };
            };
        } else {
            try {
                // Pushing default preferences to DB
                await db.collection("btUsers").doc(auth.currentUser.uid).set({
                    preferences: newPreferences,
                });
                userPreferences = newPreferences;
                showOnboarding();
            } catch (error) {
                createToastMessage('fail', error.message);
            };
        };
    } catch (error) {
        createToastMessage('fail', error.message);
    };
};


// Onboarding screens functionality
let currentOnboardingStep = 1;
function showOnboarding(){
    onboardingWindow.classList.remove('hidden');
    // Next onboarding step button functionality
    onboardingNextButton.addEventListener('click', ()=>{
        if (currentOnboardingStep !== 5) {
            // Cases where onboarding step is not final
            currentOnboardingStep = ++currentOnboardingStep;
            onboardingScreens.forEach(screen => {
                if (screen.id == currentOnboardingStep) {
                    screen.classList.remove('hidden');
                } else {
                    screen.classList.add('hidden');
                };
            });
        } else {
            // Final onboarding step
            onboardingWindow.classList.add('hidden');
            // Updating user preferences in DB with flag of onboarding being completed
            userPreferences.onboardingDone = true;
            (async function(){
                try {
                    await db.collection("btUsers").doc(auth.currentUser.uid).update({
                        preferences: userPreferences,
                    });
                } catch (error) {
                    createToastMessage('fail', error.message);
                }
            })();
        };
    });
};
// Skip onboarding button functionality
skipOnboardingButton.addEventListener('click', ()=>{
    onboardingWindow.classList.add('hidden');
    userPreferences.onboardingDone = true;
    // Updating user preferences in DB with flag of onboarding being completed
    (async function(){
        try {
            await db.collection("btUsers").doc(auth.currentUser.uid).update({
                preferences: userPreferences,
            });
        } catch (error) {
            createToastMessage('fail', error.message);
        }
    })();
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
            try {
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
                            if (!round.status || round.status === 'live') {
                                round.arrows.forEach(function (number) {
                                    totalResult += Number(number);
                                    totalArrows = totalArrows + 1;
                                });
                            };
                        });
        
                        // Calculating average result per arrow
                        let averageResult = totalResult / totalArrows;
                        // Assigning color to the rendered item based on value
                        let averageColor;
                        if (averageResult < 3) {
                            averageColor = 'white';
                        }
                        if (averageResult >= 3) {
                            averageColor = 'black';
                        }
                        if (averageResult >= 5) {
                            averageColor = 'blue';
                        }
                        if (averageResult >= 7) {
                            averageColor = 'red';
                        }
                        if (averageResult >= 9) {
                            averageColor = 'gold';
                        }
                        let displayAverage = averageResult.toString().slice(0, 3);
        
                        // Creating and configuring the rendered session card element
                        const renderedSession = document.createElement("article");
                        renderedSession.id = listItem.uid;
                        renderedSession.classList.add('hidden');

                        // Checking if session has card color
                        if (listItem.cardColor) {
                            renderedSession.classList.add(`bg-${listItem.cardColor}`);
                        };

                        // Checking if session has rounds to render it as new or filled
                        let sessionLiveRounds = 0;
                        listItem.rounds.forEach (round => {
                            if (!round.status || round.status === 'live') {
                                sessionLiveRounds = sessionLiveRounds + 1;
                            }
                        });
                        if (sessionLiveRounds > 0) {
                            renderedSession.setAttribute("data-display-name", listItem.date)
                            renderedSession.innerHTML = `
                            <div class="articleRow">
                                <h5 class="fix90 align-center">${listItem.date}</h5>
                                <p class="fullWidth align-center">${iconsBundle.repeat} ${sessionLiveRounds}</p>
                                <p class="fullWidth align-center">${iconsBundle.arrows} ${totalArrows}</p>
                                <h5 class="fix50 align-center"><span class="faded">Ø</span> <span class="${averageColor}">${displayAverage}</span></h5>
                            </div>
                        `;
                        } else {
                            renderedSession.classList.remove('bg-white');
                            renderedSession.classList.add('highlighted');
                            renderedSession.setAttribute("data-display-name", listItem.date);
                            renderedSession.innerHTML = `
                            <div class="articleRow">
                                <h5>${listItem.date}</h5>
                                <h5 class="fix50">New</h5>
                            </div>
                            `;
                        };
        
                        // Making sessions clickable to open their details
                        renderedSession.addEventListener('click', function(){
                            let container = renderedSession;
                            let clickedElement = event.target;
                            while (clickedElement && clickedElement !== container && clickedElement !== document) {
                                clickedElement = clickedElement.parentElement;
                            }
                            if (clickedElement === container) {
                                let redirectLocation = loadedLocation + '/app/session.html?' + `${container.id}`
                                window.location.href = redirectLocation;
                            }
                        });
                    
                        sessionsListContainer.appendChild(renderedSession);
                        renderedSession.classList.remove('hidden');
                        renderedSession.classList.add('fadeIn');
                    
                    };
                });
            } catch (error) {
                // Displaying a notice when there are no sessions
                const noSessionsNotice = document.createElement("div");
                noSessionsNotice.className = 'screenNotice';
                noSessionsNotice.innerHTML = `
                    <div class="faded">${iconsBundle.bow}</div>
                    <h4>Looks Empty</h4>
                    <p>Start tracking your results by adding your first training session.</p>
                `;
                sessionsListContainer.appendChild(noSessionsNotice);
            }

        } else {
            // Displaying a notice when there are no sessions
            const noSessionsNotice = document.createElement("div");
            noSessionsNotice.className = 'screenNotice';
            noSessionsNotice.innerHTML = `
                <div class="faded">${iconsBundle.bow}</div>
                <h4>Looks Empty</h4>
                <p>Start tracking your results by adding your first training session.</p>
            `;
            sessionsListContainer.appendChild(noSessionsNotice);
        };
    } catch (error) {
        createToastMessage('fail', error.message);
    }
};