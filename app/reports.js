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
    await getReports();
    isLoading = false;
};


// Cancel Report Functionality
cancelReportButton.addEventListener('click', function(){
    reportTextField.value = '';
});


// Send Report Functionality
submitReportButton.addEventListener('click', function(){
    if (reportTextField.value.length > 0) {
        // Creating model report object
        // All new reports have 'new' status by default to be tracked as solved or not
        // This status is used later to solve reports and send notifications to users
        const newReport = {
            "uid": generateUID(),
            "status": 'new',
            "content": reportTextField.value.replace(/</g, '(').replace(/>/g, ')'),
            "reply": '',
        };
        // Asynchronous function for database operations
        (async function(){
            // Get reference to the user document in the btIssues collection
            const docRef = db.collection("btIssues").doc(auth.currentUser.uid);
            // Retrieve the document from the database
            const doc = await docRef.get();
            // Check if the document exists
            if (doc.exists) {
                try {
                    // Pushing populated report object to the DB by updating the reports array field
                    await db.collection("btIssues").doc(auth.currentUser.uid).update({
                        reports: firebase.firestore.FieldValue.arrayUnion(newReport),
                    });
                } catch (error) {
                    window.alert(error);
                }
            } else {
                try {
                    // Create a new document with reports array field containing the new report object
                    await db.collection("btIssues").doc(auth.currentUser.uid).set({
                        reports: firebase.firestore.FieldValue.arrayUnion(newReport),
                    });
                } catch (error) {
                    window.alert(error);
                }
            }
        })();
        // Setting field value back to default
        reportTextField.value = '';
        createToastMessage('success', 'Report sent!')
        setTimeout(getReports, 1000);
    }
});


// Read and Render Reports Functionality
async function getReports(){
    reportsList.innerHTML = '';
    const docRef = db.collection("btIssues").doc(auth.currentUser.uid);
    // Retrieve the document from the database
    try {
        const doc = await docRef.get();
        // Check if the document exists
        if (doc.exists) {
            let reportsSnapshot = doc.data().reports;
            // Rendering reports submited by user
            reportsSnapshot.forEach(report => {
                const renderedReport = document.createElement("article");
                if (report.reply && report.reply.length > 0) {
                    renderedReport.innerHTML = `
                    <h5>Report ${report.uid}</h5>
                    <p>${report.content}</p>
                    <h5>BogenTrack team reply:</h5>
                    <p>${report.reply}</p>
                    `
                } else {
                    renderedReport.innerHTML = `
                    <h5>Report ${report.uid}</h5>
                    <p>${report.content}</p>
                    <p class="faded"> No reply from BogenTrack team yet.</p>
                    `
                };
                reportsList.appendChild(renderedReport);
            });
        } else {
            // Rendering notice that no reports were submited by user yet
            const reportsNotice = document.createElement("div");
            reportsNotice.className = 'screenNotice';
            reportsNotice.innerHTML = `
                <div class="faded">${iconsBundle.box}</div>
                <h4>No Reports</h4>
                <p>You can help us improve BogenTrack by submiting your issue report or wish.</p>
            `
            reportsList.appendChild(reportsNotice);
        }
    } catch (error) {
        createToastMessage('fail', error.message);
        console.log(error.message);
    }
};