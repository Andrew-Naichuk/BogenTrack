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
    }
});


// Page content handler
async function updatePageOnAuth(){
    userEmailIndicator.innerText = auth.currentUser.email;
    showLoading();
    await getSessionsSnapshot();
    await getEquipmentConfigs();
    isLoading = false;

    let liveSessionsNumber = 0;
    sessionsSnapshot.forEach(session => {
        if (!session.status || session.status === 'live') {
            liveSessionsNumber = ++liveSessionsNumber;
        }
    });
    userSessionsIndicator.innerText = liveSessionsNumber;
};


// Sign Out Functionality
signOutButton.addEventListener('click', async function(){
    try {
        // Attempting to sign out using auth method
        firebase.auth().signOut();
    } catch (error) {
        createToastMessage('fail', error.message);
        console.log(error.message);
    }
});


// Add new equipment config functionality
createNewEquipmentConfigButton.addEventListener('click', () => {
    let redirectLocation = loadedLocation + '/app/create-equip-config.html';
    window.location.href = redirectLocation;
});


// Download data functionality
downloadDataButton.addEventListener('click', () => {
    getSessionsSnapshot();
    setTimeout(()=>{
        // Convert the variable to a JSON string
        const jsonString = JSON.stringify(sessionsSnapshot, null, 2);

        // Create a Blob from the JSON string
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.download = 'data.json'; // Set the file name
        downloadLink.href = URL.createObjectURL(blob);

        // Trigger a click event on the download link
        downloadLink.click();

        // Clean up the URL object
        URL.revokeObjectURL(downloadLink.href);
    }, 700)
});


// Render equipment configs
async function getEquipmentConfigs() {
    // Reference to specific document in the database
    const docRef = db.collection("btUsers").doc(auth.currentUser.uid);
    equipmentConfigsList.innerHTML = '';
    // Trying to fetch data from the document
    try {
        const doc = await docRef.get();
        if (doc.exists) {
            // Rendering configs cards
            let configsExist = false;
            try {
                const existingConfigs = doc.data().equipmentConfigs;
                if (existingConfigs) {
                    configsExist = true;
                };
            } catch (error) {
                configsExist = false;
            };
            
            if (configsExist) {
                let list = doc.data().equipmentConfigs.reverse();
                let liveConfigsNumber = 0;
                list.forEach (item => {
                    if (item.status === 'live'){
                        liveConfigsNumber = ++liveConfigsNumber
                    }
                });
                // Checking if any configs saved
                if (liveConfigsNumber > 0) {
                    list.forEach (config => {
                        if (config.status === 'live') {
                            const renderedConfig = document.createElement("article");
                            renderedConfig.id = config.uid;
                            renderedConfig.classList.add('hidden');
                            
                            let configContents = '';
                            if (config.riser) {
                                configContents = configContents + `Riser - ${config.riser}\n`;
                            }
                            if (config.limbs) {
                                configContents = configContents + `Limbs - ${config.limbs}\n`;
                            }
                            if (config.string) {
                                configContents = configContents + `String - ${config.string}\n`;
                            }
                            if (config.size) {
                                configContents = configContents + `Bow length - ${config.size}"\n`;
                            }
                            if (config.draw) {
                                configContents = configContents + `Draw weight - ${config.draw}lb\n`;
                            }
                            if (config.arrowsName) {
                                configContents = configContents + `Arrows - ${config.arrowsName}\n`;
                            }
    
                            renderedConfig.innerHTML = `
                                <h5>${config.name}</h5>
                                <p>${configContents}</p>
                            `;
    
                            equipmentConfigsList.appendChild(renderedConfig);
                            renderedConfig.classList.remove('hidden');
                            renderedConfig.classList.add('fadeIn');
                        };
                    });
    
                } else {
                    // Displaying a notice when there are no configs
                    const noConfigsNotice = document.createElement("div");
                    noConfigsNotice.className = 'screenNotice';
                    noConfigsNotice.innerHTML = `
                        <h5>No Configs Yet</h5>
                        <p>You can save your equipment details by adding your first config.</p>
                    `;
                    equipmentConfigsList.appendChild(noConfigsNotice);
                }
            }
        }
    } catch (error) {
        createToastMessage('fail', error.message);
    }
}