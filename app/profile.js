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
    showLoading();
    await getSessionsSnapshot();
    await getEquipmentConfigs();
    isLoading = false;

    updateUserInfo();
    updateLiveSessions();
    updateArchiveSessions();

    // Showing password change block if logged with password
    if (firebase.auth().currentUser.providerData[0].providerId === 'password') {
        changePasswordButton.classList.remove('hidden');
    };
};


// Sign Out Functionality
signOutButton.addEventListener('click', async function(){
    try {
        // Attempting to sign out using auth method
        firebase.auth().signOut();
    } catch (error) {
        createToastMessage('fail', error.message);
    };
});


// Updating user details
function updateUserInfo() {
    // Updating user profile image
    if (auth.currentUser.photoURL) {
        userProfilePicture.setAttribute('src', auth.currentUser.photoURL);
    } else {
        const letter = auth.currentUser.email.charAt(0);
        const photoLink = 'https://placehold.co/200x200/69B7FF/FFFFFF?text=' + letter.toUpperCase();
        userProfilePicture.setAttribute('src', photoLink);
    };
    // Updating email indicator
    if (auth.currentUser.displayName) {
        emailLabel.classList.add('hidden');
        userNameIndicator.classList.remove('hidden');
        userNameIndicator.innerText = auth.currentUser.displayName;
    };
    userEmailIndicator.innerText = auth.currentUser.email;
};


// Updating live sessions indicator
function updateLiveSessions() {
    let liveSessionsNumber = 0;
    try {
        sessionsSnapshot.forEach(session => {
            if (!session.status || session.status === 'live') {
                liveSessionsNumber = ++liveSessionsNumber;
            }
        });
        userSessionsIndicator.innerText = liveSessionsNumber;
    } catch (error) {
        userSessionsIndicator.innerText = liveSessionsNumber;
    };
};


// Updating archived sessions indicator
function updateArchiveSessions() {
    let archiveSessionsNumber = 0;
    try {
        sessionsSnapshot.forEach(session => {
            if (session.status !== 'live') {
                archiveSessionsNumber = ++archiveSessionsNumber;
            }
        });
        archiveSessionsIndicator.innerText = archiveSessionsNumber;
    } catch (error) {
        archiveSessionsIndicator.innerText = archiveSessionsNumber;
    };
};


// Change password functionality
changePasswordButton.addEventListener('click', () => {
    changePasswordButton.classList.add('hidden');
    newPasswordBlock.classList.remove('hidden');
    newPasswordField.value = '';
});
cancelChangePasswordButton.addEventListener('click', () => {
    changePasswordButton.classList.remove('hidden');
    newPasswordBlock.classList.add('hidden');
    newPasswordField.value = '';
});
confirmPasswordButton.addEventListener('click', async function() {
    try {
        await firebase.auth().currentUser.updatePassword(newPasswordField.value);
        createToastMessage('success', 'Password changed!');
        changePasswordButton.classList.remove('hidden');
        newPasswordBlock.classList.add('hidden');
        newPasswordField.value = '';
    } catch (error) {
        createToastMessage('fail', error.message);
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

                            // Making setups clickable to open their details
                            renderedConfig.addEventListener('click', function(){
                                let container = renderedConfig;
                                let clickedElement = event.target;
                                while (clickedElement && clickedElement !== container && clickedElement !== document) {
                                    clickedElement = clickedElement.parentElement;
                                }
                                if (clickedElement === container) {
                                    let redirectLocation = loadedLocation + '/app/equip-config.html?' + `${container.id}`
                                    window.location.href = redirectLocation;
                                }
                            });
    
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
    };
};