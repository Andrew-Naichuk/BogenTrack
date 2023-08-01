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
    await getEquipmentItems();
    isLoading = false;
};


// Getting equipment items of config from DB
async function getEquipmentItems() {
    // Reference to specific document in the database
    const docRef = db.collection("btUsers").doc(auth.currentUser.uid);
    // Trying to fetch data from the document
    try {
        const doc = await docRef.get();
        if (doc.exists) {
            let list = doc.data().equipmentConfigs;
            list.forEach (item => {
                if (item.uid === window.location.search.replace('?','')){
                    equipmentItems.forEach(equipItem => {
                        const equipmentPiece = equipItem.id;
                        if (item[equipmentPiece]) {
                            equipItem.classList.remove('hidden');
                            equipItem.querySelector('p').innerText = item[equipmentPiece];
                        }
                    });
                };
            });
        };
    } catch (error) {
        createToastMessage('fail', error.message);
    };
};