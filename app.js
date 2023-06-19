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
            element.classList.add('visible');
        } else {
            element.classList.remove('visible');
            element.classList.add('hidden');
        }
    });
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
    setTimeout(getSessions, 1000);
});


// Add Round - Cancel Add Switching
createRoundButton.addEventListener('click', function(){
    showScreen('createRoundScreen');
});
cancelNewRoundButton.addEventListener('click', function(){
    // Setting fields values back to default and navigating

    // !!!!!!!! DONT FORGET - add getting rounds and rendering
    showScreen('SessionScreen');
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
            try {
                // Pushing populated session object to the DB
                await db.collection("btUsers").doc(auth.currentUser.uid).update({
                    sessions: firebase.firestore.FieldValue.arrayUnion(newSession),
                });
            } catch (error) {
                console.log(error);
            }
        })();
        // Setting fields values back to default
        createSessionDateField.value = '';
        createSessionCommentField.value = '';
        // Navigating back to sessions list and updating it
        showScreen('sessionsListScreen');
        setTimeout(getSessions, 1000);

    } else {
        console.log('Date is not filled');
    };
});






// Add New Round Functionality

// Arrows Number Clicker Functionality
removeArrowButton.addEventListener('click', function(){
    let arrowsNumber;
    arrowsScoreList.innerHTML = '';
    if (Number(arrowsCounter.innerText) > 1) {
        arrowsCounter.innerText = Number(arrowsCounter.innerText) - 1;
        arrowsNumber = Number(arrowsCounter.innerText);
    };
    let currentAddedArrow = arrowsNumber;
    for (let i = 0; i < arrowsNumber; i++) {
        const arrowScoreSelector = document.createElement("div");
        arrowScoreSelector.id = currentAddedArrow;
        arrowScoreSelector.innerHTML = `
        <h6>Arrow ${currentAddedArrow}</h6>
        `
        arrowsScoreList.appendChild(arrowScoreSelector);
        currentAddedArrow = currentAddedArrow - 1
    }

});
addArrowButton.addEventListener('click', function(){
    arrowsScoreList.innerHTML = '';
    if (Number(arrowsCounter.innerText) < 10) {
        arrowsCounter.innerText = Number(arrowsCounter.innerText) + 1;
    };

});







// Write To Database

async function writeSession(data) {
    try {
        await db.collection("btUsers").doc(auth.currentUser.uid).set({
            sessions: data,
        })
    } catch (error) {
        console.log('Error while writing to DB')
    }
}

// Update In Database

async function updateSession(data) {
    try {
        await db.collection("btUsers").doc(auth.currentUser.uid).update({
            sessions: data,
        })
    } catch (error) {
        console.log('Error while writing to DB')
    }
}

// Read and Render Sessions From Database

async function getSessions(){
    // Refference to specific document in DB
    const docRef = db.collection("btUsers").doc(auth.currentUser.uid);
    try {
        // Trying to fetch data
        const doc = await docRef.get();
        if (doc.exists) {
            // Rendering session cards
            sessionsListContainer.innerHTML = '';
            let list = doc.data().sessions.reverse();
            list.forEach(listItem => {
                const renderedSession = document.createElement("article");
                renderedSession.id = listItem.uid
                renderedSession.innerHTML = `
                <h5>${listItem.date}</h5>
                <p>${listItem.rounds.length} Rounds</p>
                `

                // Making sessions clickable to open their details
                renderedSession.addEventListener('click', function(){
                    showScreen('SessionScreen');
                });

                sessionsListContainer.appendChild(renderedSession);
            });
        } else {
            console.log('No data yet')
        }
    } catch (error) {
        console.log('Error while getting data')
    }
}






// Generating UUIDs

function generateUID() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 100000);
    const uid = `${timestamp}-${random}`;
    return uid;
}