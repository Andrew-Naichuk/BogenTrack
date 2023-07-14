// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const providerGoogle = new firebase.auth.GoogleAuthProvider();
const analytics = firebase.analytics();

// Auth status observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        getSessions();
    } else {
        let redirectLocation = loadedLocation + '/app/signin.html'
        window.location.replace(redirectLocation);
    }
});


// Add new session button functionality
createSessionButton.addEventListener('click', function(){
    let redirectLocation = loadedLocation + '/app/create-session.html'
    window.location.href = redirectLocation;
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
    
                    // Creating and configuring the rendered session card element
                    const renderedSession = document.createElement("article");
                    renderedSession.id = listItem.uid;
                    renderedSession.classList.add('hidden');
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
                            <h5 class="fix90">${listItem.date}</h5>
                            <p class="fullWidth">${iconsBundle.repeat} ${sessionLiveRounds}</p>
                            <p class="fullWidth">${iconsBundle.arrows} ${totalArrows}</p>
                            <h5 class="fix50"><span class="faded">Ø</span> <span class="${averageColor}">${displayAverage}</span></h5>
                        </div>
                    `;
                    } else {
                        renderedSession.classList.add('highlighted')
                        renderedSession.setAttribute("data-display-name", listItem.date)
                        renderedSession.innerHTML = `
                        <div class="articleRow">
                            <h5>${listItem.date}</h5>
                            <h5 class="fix50">New</h5>
                        </div>
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
                            let redirectLocation = loadedLocation + '/app/session.html?' + `${container.id}`
                            window.location.href = redirectLocation;
                        }
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
                <div class="faded">${iconsBundle.bow}</div>
                <h4>Looks Empty</h4>
                <p>Start tracking your results by adding your first training session.</p>
            `;
            sessionsListContainer.appendChild(noSessionsNotice);
        }
    } catch (error) {
        createToastMessage('fail', error.message);
        console.log(error.message);
    }
};